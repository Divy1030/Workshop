import hashlib
import hmac
import json
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
from django.shortcuts import render, redirect

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


def verification_success(request):
    return render(request, 'verification_success.html')

def verification_error(request):
    # Get the error reason from query parameters
    reason = request.GET.get('reason', 'unknown')
    return render(request, 'verification_error.html', {'reason': reason})

class EmailVerificationView(APIView):
    """
    Endpoint to verify the user's email using the token.
    """
    def get(self, request, format=None):
        token = request.GET.get('token')
        reg_id = request.GET.get('reg_id')

         
        host = request.get_host()  # e.g. "127.0.0.1:8000" or "workshop-sxnk.onrender.com"
        protocol = "https" if request.is_secure() else "http"
        base_url = f"{protocol}://{host}"

        if not token or not reg_id:
            return redirect(f"{base_url}/verification-error/?reason=missing_params")
        
        try:
            registration = Registration.objects.get(id=reg_id)
        except Registration.DoesNotExist:
            return redirect(f"{base_url}/verification-error/?reason=not_found")
        
        if registration.token_expires_at is None:
            return redirect(f"{base_url}/verification-error/?reason=missing_expiry")
    
        # Check token expiry manually
        if registration.token_expires_at < timezone.now():
            return redirect(f"{base_url}/verification-error/?reason=expired")
        
        # Verify the token
        try:
            original_email = signer.unsign(token, max_age=3600)
        except (SignatureExpired, BadSignature):
            return redirect(f"{base_url}/verification-error/?reason=invalid_token")
        
        if original_email != registration.email:
            return redirect(f"{base_url}/verification-error/?reason=email_mismatch")
        
        registration.is_email_verified = True
        registration.email_verification_token = None
        registration.token_expires_at = None
        registration.save()
        return redirect(f"{base_url}/verification-success/")
    

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
        "notes": {
            "registration_id": str(registration.id)  # Pass registration ID as a string
        },
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
    # Get webhook payload and headers
    payload = request.body
    received_signature = request.META.get('HTTP_X_RAZORPAY_SIGNATURE', '')

    # Verify the signature (if you have a webhook secret set up)
    webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET  
    expected_signature = hmac.new(
        webhook_secret.encode('utf-8'),
        payload,
        hashlib.sha256
    ).hexdigest()

    if not hmac.compare_digest(received_signature, expected_signature):
        return Response({'detail': 'Invalid signature.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        data = json.loads(payload.decode('utf-8'))
    except json.JSONDecodeError:
        return Response({'detail': 'Invalid JSON payload.'}, status=status.HTTP_400_BAD_REQUEST)

    # Process the event
    event_type = data.get('event')
    payload_data = data.get('payload', {})

    # Example: handling a payment link paid event
    if event_type == 'payment_link.paid':
        payment_link_data = payload_data.get('payment_link', {}).get('entity', {})
        registration_id = payment_link_data.get('notes', {}).get('registration_id')
        if registration_id:
            try:
                registration = Registration.objects.get(id=registration_id)
                registration.payment_status = "succeeded"
                registration.save()
            except Registration.DoesNotExist:
                return Response({'detail': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    # Example: handling a payment link failed event
    elif event_type == 'payment_link.failed':
        payment_link_data = payload_data.get('payment_link', {}).get('entity', {})
        registration_id = payment_link_data.get('notes', {}).get('registration_id')
        if registration_id:
            try:
                registration = Registration.objects.get(id=registration_id)
                registration.payment_status = "failed"
                registration.save()
            except Registration.DoesNotExist:
                return Response({'detail': 'Registration not found.'}, status=status.HTTP_404_NOT_FOUND)

    # Respond with success
    return Response({'detail': 'Webhook processed successfully.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_payment_status(request):
    reg_id = request.query_params.get('registration_id')
    try:
        registration = Registration.objects.get(id=reg_id)
    except Registration.DoesNotExist:
        return Response({'detail': 'Registration not found.'}, status=404)

    response_data = {
        "payment_status": registration.payment_status
    }

    if registration.payment_status == "succeeded":
        response_data.update({
            "payment_time": registration.created_at,
            "reference_id": registration.payment_reference
        })

    return Response(response_data)
