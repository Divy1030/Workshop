"use client";
import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const VerificationPage = () => {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const paymentId = searchParams.get("payment_id");
  const orderId = searchParams.get("order_id");
  
  const isSuccess = status === "success";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className={`rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} p-4`}>
            {isSuccess ? (
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
          {isSuccess ? "Payment Verification Successful!" : "Payment Verification Failed"}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {isSuccess 
            ? "Your registration has been confirmed. Here are your payment details:" 
            : "We couldn't verify your payment. Please try again or contact support if the issue persists."}
        </p>
        
        {isSuccess && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-3">
              <span className="text-gray-500">Payment ID:</span>
              <span className="font-medium text-gray-800">{paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Order ID:</span>
              <span className="font-medium text-gray-800">{orderId}</span>
            </div>
          </div>
        )}
        
        <Link href="/" passHref>
          <button className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            {isSuccess ? "Back to Home" : "Try Again"}
          </button>
        </Link>
        
        {!isSuccess && (
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

export default VerificationPage;