from rest_framework import serializers
from .models import Registration

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = [
            'id', 'full_name', 'student_number', 'branch', 'gender','year',
            'phone', 'email', 'living_type',
            'is_email_verified', 'payment_status', 'payment_reference',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['is_email_verified', 'payment_status', 'payment_reference', 'created_at', 'updated_at']

        