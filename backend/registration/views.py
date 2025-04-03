from django.utils import timezone
from django.conf import settings
from django.core.mail import send_mail
from django.urls import reverse
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
import requests
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Registration
from .serializers import RegistrationSerializer
import qrcode
from io import BytesIO
import base64
from rest_framework.decorators import api_view
from django.views.decorators.csrf import csrf_exempt

signer = TimestampSigner()

class RegistrationCreateView(generics.CreateAPIView):
    """
    This endpoint creates a draft registration (with personal and contact details)
    and sends an email verification link.
    """
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    def perform_create(self, serializer):
        instance = serializer.save()
        # Generate a token that expires in, say, 1 hour (3600 seconds)
        token = signer.sign(instance.email)
        instance.email_verification_token = token
        instance.token_expires_at = timezone.now() + timezone.timedelta(seconds=3600)
        instance.save()
        
        # Construct the verification URL (adjust the domain as needed)
        verify_url = self.request.build_absolute_uri(
            reverse('email-verify') + f'?token={token}&reg_id={instance.id}'
        )


        send_mail(
            subject="Verify your email",
            message=f"Please verify your email by clicking the following link: {verify_url}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[instance.email],
        )


class EmailVerificationView(APIView):
    """
    Endpoint to verify the user's email using the token.
    """
    def get(self, request, format=None):
        token = request.GET.get('token')
        reg_id = request.GET.get('reg_id')
        if not token or not reg_id:
            return Response({'detail': 'Missing token or registration id.'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            registration = Registration.objects.get(id=reg_id)
        except Registration.DoesNotExist:
            return Response({'detail': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check token expiry manually
        if registration.token_expires_at < timezone.now():
            return Response({'detail': 'Token expired.'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Verify the token
        try:
            original_email = signer.unsign(token, max_age=3600)
        except (SignatureExpired, BadSignature):
            return Response({'detail': 'Invalid or expired token.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if original_email != registration.email:
            return Response({'detail': 'Token does not match registration email.'}, status=status.HTTP_400_BAD_REQUEST)
        
        registration.is_email_verified = True
        registration.email_verification_token = None
        registration.token_expires_at = None
        registration.save()
        return Response({'detail': 'Email verified successfully.'}, status=status.HTTP_200_OK)
    

@api_view(['POST'])
def initiate_payment(request):
    """
    This endpoint is called when the user is ready to pay.
    It should verify that the registration exists and email is verified,
    then create a Razorpay payment link (here we simulate it) and generate a QR code.
    """
    reg_id = request.data.get('registration_id')
    try:
        registration = Registration.objects.get(id=reg_id)
    except Registration.DoesNotExist:
        return Response({'detail': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    if not registration.is_email_verified:
        return Response({'detail': 'Email not verified.'}, status=status.HTTP_400_BAD_REQUEST)
    

    amount = 50000

    # Create payload for Razorpay Payment Links API
    payload = {
        "amount": amount,
        "currency": "INR",
        "accept_partial": False,
        "description": "Workshop Registration Payment",
        "customer": {
            "name": registration.full_name,
            "contact": registration.phone,
            "email": registration.email,
        },
        "notify": {
            "sms": True,
            "email": True,
        },
        "reminder_enable": True,
        # Optional: add a callback
        # "callback_url": settings.RAZORPAY_CALLBACK_URL,
        # "callback_method": "get"
    }
    
    razorpay_url = "https://api.razorpay.com/v1/payment_links"
    try:
        # Use test API keys from settings
        response = requests.post(
            razorpay_url,
            auth=(settings.RAZORPAY_KEY, settings.RAZORPAY_SECRET),
            json=payload
        )
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        return Response({'detail': 'Error creating payment link.', 'error': str(e)},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    data = response.json()
    payment_url = data.get('short_url')
    if not payment_url:
        return Response({'detail': 'Payment URL not received from Razorpay.'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    # Save Razorpay Payment Link ID and update payment status
    registration.payment_reference = data.get('id')
    registration.payment_status = "pending"
    registration.save()
    
    # Generate a QR code for the payment URL
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(payment_url)
    qr.make(fit=True)
    img = qr.make_image(fill='black', back_color='white')
    
    buffered = BytesIO()
    img.save(buffered, format="PNG")
    qr_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    return Response({
        'payment_url': payment_url,
        'qr_code': qr_base64
    }, status=status.HTTP_200_OK)
    

@csrf_exempt
@api_view(['POST'])
def payment_webhook(request):
    """
    This endpoint receives webhook notifications from Razorpay.
    Update the registration's payment_status based on the event received.
    """
    data = request.data
    # Here, parse the data according to Razorpay's webhook format.
    # For example, assume data contains registration_id and payment_status:
    reg_id = data.get('registration_id')
    status_update = data.get('payment_status')  # expected to be 'succeeded' or 'failed'
    
    if not reg_id or not status_update:
        return Response({'detail': 'Invalid payload.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        registration = Registration.objects.get(id=reg_id)
    except Registration.DoesNotExist:
        return Response({'detail': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    registration.payment_status = status_update
    registration.save()
    
    return Response({'detail': 'Payment status updated.'}, status=status.HTTP_200_OK)
