from django.urls import path
from .views import RegistrationCreateView, EmailVerificationView , initiate_payment, payment_webhook, get_payment_status

urlpatterns = [
    path('register/', RegistrationCreateView.as_view(), name='registration-create'),
    path('email-verify/', EmailVerificationView.as_view(), name='email-verify'),
    path('payment/initiate/', initiate_payment, name='initiate-payment'),
    path('payment/webhook/', payment_webhook, name='payment-webhook'),
    path('payment/status/',get_payment_status, name='payment-status'),
]


