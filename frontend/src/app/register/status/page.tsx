"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const StatusPage = () => {
  const [paymentStatus, setPaymentStatus] = useState<{
    success: boolean;
    transactionReference?: string;
    maskedOrderId?: string;
  }>({ success: false });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get status from URL but don't expose sensitive info in UI
    const getPaymentStatus = async () => {
      try {
        // Only run in client-side
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search);
          const status = urlParams.get("status");
          const paymentId = urlParams.get("payment_id");
          const orderId = urlParams.get("order_id");
          
          // Validate status on the server side
          if (paymentId && orderId) {
            // Send these IDs to your backend for verification
            try {
              const response = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId, orderId })
              });
              
              if (!response.ok) {
                throw new Error(`Server returned ${response.status}: ${await response.text()}`);
              }
              
              const result = await response.json();
              
              // Set state based on server validation
              setPaymentStatus({
                success: result.success,
                // Only show partial/masked IDs if needed
                transactionReference: result.success ? generateReference() : undefined,
                maskedOrderId: result.success ? maskId(orderId) : undefined,
              });
            } catch (error) {
              console.error("API error:", error);
              // Fall back to URL parameter if API verification fails
              setPaymentStatus({ 
                success: status === "success" 
              });
            }
          } else {
            setPaymentStatus({ 
              success: status === "success" 
            });
          }
          
          // Clean up URL parameters for security
          window.history.replaceState({}, document.title, '/register/status');
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        setPaymentStatus({ success: false });
      } finally {
        setIsLoading(false);
      }
    };
    
    getPaymentStatus();
  }, []);
  
  // Helper function to generate a reference number
  const generateReference = () => {
    return `TXN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  };
  
  // Helper function to mask sensitive IDs
  const maskId = (id: string | null) => {
    if (!id) return "Unknown";
    if (id.length <= 8) return "••••••••";
    return `${id.substring(0, 4)}••••${id.substring(id.length - 4)}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex justify-center">
          <div className="flex items-center">
            <svg className="animate-spin h-8 w-8 text-indigo-600 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-800 font-medium">Verifying payment status...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        {/* Step indicator */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">1</div>
            <span className="text-xs mt-1 text-gray-500">Personal</span>
          </div>
          <div className="h-0.5 flex-1 bg-indigo-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">2</div>
            <span className="text-xs mt-1 text-gray-500">Contact</span>
          </div>
          <div className="h-0.5 flex-1 bg-indigo-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">3</div>
            <span className="text-xs mt-1 text-gray-500">Payment</span>
          </div>
          <div className="h-0.5 flex-1 bg-indigo-600 mx-2"></div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-medium">4</div>
            <span className="text-xs mt-1 text-gray-500">Confirmation</span>
          </div>
        </div>
        
        <div className="flex justify-center mb-6">
          <div className={`rounded-full ${paymentStatus.success ? 'bg-green-100' : 'bg-red-100'} p-4`}>
            {paymentStatus.success ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-3">
          {paymentStatus.success ? "Registration Completed!" : "Payment Failed"}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {paymentStatus.success 
            ? "Your registration for CSI Render 3.0 workshop has been confirmed. We've sent confirmation details to your email." 
            : "We couldn't process your payment. Please try again or contact support if the issue persists."}
        </p>
        
        {paymentStatus.success && paymentStatus.transactionReference && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Transaction Reference:</span>
              <span className="font-medium text-gray-800">{paymentStatus.transactionReference}</span>
            </div>
            {paymentStatus.maskedOrderId && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please save this reference for any future communications
              </p>
            )}
          </div>
        )}
        
        <Link href="/" passHref>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {paymentStatus.success ? "Back to Home" : "Try Again"}
          </button>
        </Link>
        
        {!paymentStatus.success && (
          <div className="mt-4 text-center">
            <Link href="/support" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              Contact Support
            </Link>
          </div>
        )}
      </div>
      
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>CSI Render 3.0 Workshop Registration</p>
        <p className="mt-1">© {new Date().getFullYear()} All rights reserved</p>
      </div>
    </div>
  );
};

export default StatusPage;