'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiPhone, FiMail, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useFormContext, formSchema } from '@/context/FormContent';
import { mapFormToRegistrationData } from '@/lib/mapper';

// Extract only the fields needed for this step
const contactDetailsSchema = z.object({
  contactNumber: formSchema.shape.contactNumber,
  email: formSchema.shape.email,
  hostlerOrDayScholar: formSchema.shape.hostlerOrDayScholar,
});

type ContactDetailsData = z.infer<typeof contactDetailsSchema>;

export default function ContactDetails() {
  const router = useRouter();
  const { formData, updateFormData } = useFormContext();
  const [emailSent, setEmailSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<ContactDetailsData>({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      contactNumber: formData.contactNumber,
      email: formData.email,
      hostlerOrDayScholar: formData.hostlerOrDayScholar,
    }
  });

  // Get the current email value for the verification button
  const currentEmail = watch("email");

  const sendVerificationEmail = async () => {
    if (!currentEmail) {
      setError("Please enter an email address first");
      return;
    }

    setError(null);
    setSending(true);
    
    try {
      // First register the user to create a preliminary record
      const tempFormData = {
        ...formData,
        email: currentEmail,
        contactNumber: watch("contactNumber") || formData.contactNumber
      };
      const registrationData = mapFormToRegistrationData(tempFormData);
      
      const registerResponse = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const result = await registerResponse.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to register');
      }

      setEmailSent(true);
      
      // Display notification that email has been sent
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  const onSubmit = (data: ContactDetailsData) => {
    updateFormData(data);
    router.push('/register/payment');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Contact Number</label>
        <div className="flex items-center">
          <input
            type="tel"
            {...register("contactNumber")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <FiPhone className="absolute right-4 text-blue-700" />
        </div>
        {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber.message}</p>}
      </div>

      <div className="relative">
        <label className="absolute text-blue-700 text-sm font-medium -top-2 left-4 bg-white px-1">Email Address</label>
        <div className="flex items-center">
          <input
            type="email"
            {...register("email")}
            className="w-full py-3 px-4 border border-blue-700 rounded-full focus:outline-none"
          />
          <FiMail className="absolute right-4 text-blue-700" />
        </div>
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>

      <button
        type="button"
        onClick={sendVerificationEmail}
        disabled={sending || !currentEmail}
        className={`w-full flex items-center justify-center py-3 px-4 
          ${emailSent ? 'bg-green-600 text-white' : 'border border-blue-700 text-blue-700'} 
          rounded-full ${sending ? 'opacity-70 cursor-wait' : ''}`}
      >
        {sending ? (
          'Sending...'
        ) : emailSent ? (
          <>Verification Email Sent <span className="ml-2">✓</span></>
        ) : (
          <>Click here to verify OTP <FiChevronRight className="ml-2" /></>
        )}
      </button>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      {emailSent && (
        <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
          A verification email has been sent to your email address. Please check your inbox and click the verification link before proceeding to payment.
        </div>
      )}

      <div className="flex items-center justify-start space-x-16 mt-4">
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Hostler"
            {...register("hostlerOrDayScholar")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Hostler</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            value="Days Schlor"
            {...register("hostlerOrDayScholar")}
            className="form-radio h-5 w-5 text-blue-700 border-blue-700"
          />
          <span className="ml-2 text-blue-700">Days Scholar</span>
        </label>
      </div>
      {errors.hostlerOrDayScholar && <p className="text-red-500 text-sm mt-1">{errors.hostlerOrDayScholar.message}</p>}

      <div className="flex justify-between mt-8">
        <Link href="/register/personal-details">
          <button
            type="button"
            className="px-6 py-3 rounded-full border border-blue-500 text-blue-500 hover:bg-blue-50 flex items-center justify-center"
          >
            <FiChevronLeft className="mr-2" /> Back
          </button>
        </Link>
        
        <button
          type="submit"
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
        >
          Next <FiChevronRight className="ml-2" />
        </button>
      </div>
    </form>
  );
}