"use client";
import React from "react";
import Link from "next/link";

const StatusPage = () => {
  // Instead of using useSearchParams, we'll access URL parameters directly
  // This avoids the need for a Suspense boundary
  const getSearchParam = (paramName: string): string | null => {
    // Only run in client-side
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.get(paramName);
    }
    return null;
  };
  
  const status = getSearchParam("status");
  const paymentId = getSearchParam("payment_id");
  const orderId = getSearchParam("order_id");
  
  const isSuccess = status === "success";

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
          {isSuccess ? "Registration Completed!" : "Payment Failed"}
        </h2>
        
        <p className="text-gray-600 text-center mb-6">
          {isSuccess 
            ? "Your registration for CSI Render 3.0 workshop has been confirmed. Here are your payment details:" 
            : "We couldn't process your payment. Please try again or contact support if the issue persists."}
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

export default StatusPage;