'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronRight } from 'react-icons/fi';
import { useFormContext } from '@/context/FormContext'

export default function Payment() {
  const router = useRouter();
  const { formData } = useFormContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePayment = () => {
    setIsSubmitting(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Submit the full form data here
      console.log("Form submitted:", formData);
      
      // Redirect to success page
      router.push('/register/success');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-gray-700 mb-4">
        <p>Please complete your payment to finish registration.</p>
        <p className="text-sm text-gray-500">Registration fee: ₹ 250</p>
      </div>
      
      <div className="w-full flex flex-col items-center justify-center">
        <div className="mb-4 relative w-48 h-48">
          <div className="bg-gray-100 border border-gray-300 flex items-center justify-center w-48 h-48">
            <div className="text-gray-500 text-center p-4">
              <div className="text-lg font-bold mb-2">QR Code</div>
              <div className="text-xs">Scan to make payment</div>
            </div>
          </div>
        </div>
        <div className="text-blue-700 text-center">
          http://linkofpayment.joincontest123
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mt-6 text-sm w-full">
          <p className="font-medium text-blue-700 mb-1">Security Notice:</p>
          <p className="text-gray-600">
            For your security, you cannot go back after initiating payment. 
            Please ensure all details are correct before proceeding.
          </p>
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          type="button"
          onClick={handlePayment}
          disabled={isSubmitting}
          className={`px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full flex items-center justify-center
            ${isSubmitting ? 'opacity-70 cursor-wait' : ''}`}
        >
          {isSubmitting ? 'Processing...' : (
            <>
              Complete Payment <FiChevronRight className="ml-2" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}