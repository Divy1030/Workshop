'use client';
import { useState, useEffect } from 'react';
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
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showSimulatedEmail, setShowSimulatedEmail] = useState(false);

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

  // Function to generate a random 6-digit OTP
  const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendVerificationEmail = async () => {
    if (!currentEmail) {
      setError("Please enter an email address first");
      return;
    }

    setError(null);
    setSending(true);
    
    // Generate a new OTP for this verification attempt
    const newOtp = generateOtp();
    setGeneratedOtp(newOtp);
    
    // Simulate API call delay
    setTimeout(async () => {
      try {
        // First register the user to create a preliminary record
        const tempFormData = {
          ...formData,
          email: currentEmail,
          contactNumber: watch("contactNumber") || formData.contactNumber
        };
        
        // Simulate backend register call
        console.log("Registering user with data:", tempFormData);
        
        setEmailSent(true);
        setShowSimulatedEmail(true);
        
        // Auto-hide the simulated email after 5 seconds if user doesn't click "Enter OTP"
        setTimeout(() => {
          if (showSimulatedEmail && !showOtpDialog) {
            setShowSimulatedEmail(false);
          }
        }, 5000);
        
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to send verification email');
      } finally {
        setSending(false);
      }
    }, 1500);
  };

  const openOtpDialog = () => {
    setShowSimulatedEmail(false);
    setShowOtpDialog(true);
  };

  const verifyOtp = () => {
    setVerifying(true);
    
    // Simulate OTP verification with a timeout
    setTimeout(() => {
      // For demonstration, we'll verify against our generated OTP
      if (otp === generatedOtp) {
        setVerified(true);
        setShowOtpDialog(false);
        setError(null);
      } else {
        setError("Invalid OTP. Please try again.");
      }
      setVerifying(false);
    }, 1500);
  };

  const onSubmit = (data: ContactDetailsData) => {
    updateFormData(data);
    router.push('/register/payment');
  };

  // Close simulated email when OTP dialog is opened
  useEffect(() => {
    if (showOtpDialog) {
      setShowSimulatedEmail(false);
    }
  }, [showOtpDialog]);

  return (
    <>
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
          disabled={sending || !currentEmail || verified}
          className={`w-full flex items-center justify-center py-3 px-4 
            ${verified ? 'bg-green-600 text-white' : emailSent ? 'bg-blue-600 text-white' : 'border border-blue-700 text-blue-700'} 
            rounded-full ${sending ? 'opacity-70 cursor-wait' : ''}`}
        >
          {sending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : verified ? (
            <>Email Verified <span className="ml-2">✓</span></>
          ) : emailSent ? (
            <>Verification Email Sent</>
          ) : (
            <>Click here to verify OTP <FiChevronRight className="ml-2" /></>
          )}
        </button>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {emailSent && !verified && !showOtpDialog && !showSimulatedEmail && (
          <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
            A verification email with OTP has been sent to your email address. Please check your inbox and click "Verify OTP" to enter the code.
          </div>
        )}

        {verified && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm">
            Your email has been successfully verified! You can now proceed to the next step.
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
              value="Days Scholar"
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
          
          {verified && (
            <button
              type="submit"
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center"
            >
              Next <FiChevronRight className="ml-2" />
            </button>
          )}
        </div>
      </form>

      {/* Simulated Email Dialog */}
      {showSimulatedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl" style={{ maxWidth: "500px" }}>
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center">
                <div className="bg-blue-500 text-white p-2 rounded-full mr-2">
                  <FiMail className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold text-gray-800">CSI Render 3.0</div>
                  <div className="text-xs text-gray-500">{currentEmail}</div>
                </div>
              </div>
              <button 
                onClick={() => setShowSimulatedEmail(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            </div>
            
            <div className="py-4 px-2 border-b">
              <h3 className="font-bold text-lg mb-2">Email Verification Code</h3>
              <p className="text-gray-600 mb-4">Thank you for registering for CSI Render 3.0 Workshop. Please use the following verification code to complete your registration:</p>
              
              <div className="bg-gray-100 p-4 text-center rounded-md mb-4">
                <span className="font-mono font-bold text-2xl tracking-wider text-gray-800">{generatedOtp}</span>
              </div>
              
              <p className="text-sm text-gray-500">This code will expire in 10 minutes. If you didn't request this code, please ignore this email.</p>
            </div>
            
            <div className="pt-4 flex justify-center">
              <button
                onClick={openOtpDialog}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Enter OTP
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Dialog */}
      {showOtpDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Enter Verification Code</h3>
            <p className="text-gray-600 mb-4">
              Please enter the 6-digit code that was sent to {currentEmail}
            </p>
            
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-4"
              maxLength={6}
            />
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowOtpDialog(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={verifyOtp}
                disabled={otp.length !== 6 || verifying}
                className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center
                  ${(otp.length !== 6 || verifying) ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {verifying ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify OTP'
                )}
              </button>
            </div>
            
            {/* Resend option */}
            <div className="mt-4 text-center">
              <button 
                onClick={sendVerificationEmail}
                disabled={sending}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {sending ? 'Sending...' : 'Resend verification code'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}