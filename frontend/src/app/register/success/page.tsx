'use client';

import Link from 'next/link';
import { useEffect, useState, Suspense } from 'react';
import { useFormContext } from '@/context/FormContext';
import { useSearchParams } from 'next/navigation';

// Define a type for payment details
type PaymentDetails = {
  amount: string;
  status: string;
  reference: string;
  timestamp: string;
};

function SuccessPageContent() {
  const { formData } = useFormContext();
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registration_id'); // Extract registration_id from the query string
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null); // Use the defined type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPaymentStatus = async () => {
      try {
        // Mock payment data for demo purposes
        setPaymentDetails({
          amount: "250.00",
          status: "succeeded",
          reference: "PAY" + Math.floor(Math.random() * 1000000),
          timestamp: new Date().toISOString(),
        });
      } catch {
        setError("Could not retrieve payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [searchParams]);

  return (
    <div className="w-full flex flex-col items-center justify-center text-center">
      <div className="mb-4 relative w-72 h-48">
        <div className="bg-yellow-200 border border-yellow-300 flex items-center justify-center w-72 h-48 rounded-lg">
          <div className="text-yellow-800 text-center p-4">
            <div className="text-2xl font-bold mb-2">🎉</div>
            <div className="text-lg font-bold">Registration Complete!</div>
          </div>
        </div>
      </div>

      <div className="text-blue-700 text-xl font-bold mb-6">
        You&apos;ve Registered Successfully.
      </div>

      <div className="bg-blue-50 rounded-lg p-4 mb-6 w-full">
        <h3 className="font-medium text-blue-700 mb-2">Registration Details:</h3>
        <div className="text-left text-sm space-y-1">
          <p><span className="font-medium">Name:</span> {formData.name}</p>
          <p><span className="font-medium">Roll No:</span> {formData.rollNo}</p>
          <p><span className="font-medium">Email:</span> {formData.email}</p>
          <p><span className="font-medium">Contact:</span> {formData.contactNumber}</p>
        </div>
      </div>

      {loading ? (
        <div className="bg-gray-100 rounded-lg p-4 mb-6 w-full animate-pulse">
          <p className="text-center text-gray-500">Loading payment details...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6 w-full text-sm">
          {error}
        </div>
      ) : paymentDetails && (
        <div className="bg-green-50 rounded-lg p-4 mb-6 w-full">
          <h3 className="font-medium text-green-700 mb-2">Payment Details:</h3>
          <div className="text-left text-sm space-y-1">
            <p><span className="font-medium">Amount:</span> ₹ {paymentDetails.amount}</p>
            <p><span className="font-medium">Status:</span> <span className="text-green-600 font-medium">Paid</span></p>
            <p><span className="font-medium">Reference:</span> {paymentDetails.reference}</p>
            <p><span className="font-medium">Date:</span> {new Date(paymentDetails.timestamp).toLocaleDateString()}</p>
          </div>
        </div>
      )}

      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="mb-4">
          Thank you for completing your payment. Your registration ID is: <strong>{registrationId}</strong>.
        </p>
        <p className="text-gray-600">
          You will receive a confirmation email shortly. If you have any questions, please contact support.
        </p>
      </div>

      <Link href="/">
        <button className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          Return to Home
        </button>
      </Link>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessPageContent />
    </Suspense>
  );
}