'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const registrationId = searchParams.get('registration_id'); // Extract registration_id from the query string

  const [paymentData, setPaymentData] = useState<{
    payment_url: string;
    qr_code: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (registrationId) {
      initiatePayment(parseInt(registrationId));
    }
  }, [registrationId]);

  const initiatePayment = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ registration_id: id }),
      });

      const data = await response.json();

      if (response.ok) {
        setPaymentData(data.data); // Save payment_url and qr_code
      } else {
        setError(data.error || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('Error initiating payment:', error); // Log the error for debugging
      setError('An error occurred while initiating payment');
    } finally {
      setLoading(false);
    }
  };

  // Wrap checkPaymentStatus in useCallback to avoid missing dependency warnings
  const checkPaymentStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/payment/status/?registration_id=${registrationId}`);
      const data = await response.json();

      if (response.ok) {
        setPaymentStatus(data.data.payment_status);

        if (data.data.payment_status === 'paid') {
          alert('Payment successful!');
          if (intervalId) clearInterval(intervalId); // Stop polling once payment is successful
        }
      } else {
        setError(data.error || 'Failed to fetch payment status');
      }
    } catch (error) {
      console.error('Error checking payment status:', error); // Log the error for debugging
      setError('An error occurred while checking payment status');
    }
  }, [registrationId, intervalId]);

  useEffect(() => {
    if (paymentData) {
      const interval = setInterval(() => {
        checkPaymentStatus();
      }, 5000); // Poll every 5 seconds

      setIntervalId(interval);

      return () => clearInterval(interval); // Cleanup interval on component unmount
    }
  }, [paymentData, checkPaymentStatus]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Page</h1>

      {loading && <p>Loading...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {paymentData && (
        <div>
          <p className="mb-4">Scan the QR code below or click the link to make the payment:</p>
          <div className="mb-4">
            <Image
              src={`data:image/png;base64,${paymentData.qr_code}`}
              alt="Payment QR Code"
              width={192}
              height={192}
              className="mx-auto"
            />
          </div>
          <a
            href={paymentData.payment_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            Click here to pay online
          </a>
        </div>
      )}

      {paymentStatus && (
        <div className="mt-6">
          <p>Payment Status: <strong>{paymentStatus}</strong></p>
        </div>
      )}
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentPageContent />
    </Suspense>
  );
}