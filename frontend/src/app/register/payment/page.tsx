"use client";
import React from "react";
import { useState } from "react";
import Script from "next/script";
import Image from "next/image";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentPage = () => {
  const AMOUNT = 10000; // ₹100 in paise
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/create", {
        method: "POST",
      });
      
      // Check if the response is valid before parsing
      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.status} ${response.statusText}`);
      }
      
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server returned non-JSON response");
      }
      
      const data = await response.json();
      
      // Ensure we have the required fields
      if (!data.id || !data.amount) {
        throw new Error("Invalid order data received");
      }
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_aZ74nXNctnJW7H",
        amount: data.amount,
        currency: data.currency || "INR",
        name: "CSI Render 3.0",
        description: "Workshop Registration Fee",
        order_id: data.id,
        handler: function (response: any) {
          // Redirect to status page (step 4) with success and payment details
          router.push(`/register/status?status=success&payment_id=${response.razorpay_payment_id}&order_id=${response.razorpay_order_id}`);
          setIsProcessing(false);
        },
        prefill: {
          name: "Student Name",
          email: "student@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#4338ca",
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      router.push('/register/status?status=failed');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center justify-center p-6">
      {/* Workshop Logo/Header */}
      <div className="w-full max-w-md mb-8 text-center">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">CSI Render 3.0</h1>
        <p className="text-gray-600">Complete your registration by making the payment</p>
      </div>

      {/* Payment Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md transition-all hover:shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-semibold text-gray-800">Registration Fee</span>
          <span className="text-2xl font-bold text-indigo-700">₹100.00</span>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Workshop Registration</span>
            <span className="text-gray-800">₹100.00</span>
          </div>
          <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between">
            <span className="font-medium">Total</span>
            <span className="font-bold">₹100.00</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-500 mb-3">Secure Payment Via</h3>
          <div className="flex space-x-3 items-center">
            <div className="bg-gray-50 p-2 rounded">
              <svg className="h-6 w-10" viewBox="0 0 40 24">
                <path
                  fill="#3395FF"
                  d="M32 0H8a8 8 0 00-8 8v8a8 8 0 008 8h24a8 8 0 008-8V8a8 8 0 00-8-8z"
                ></path>
                <path
                  fill="#FFF"
                  d="M15.4 15.4c0 .4-.3.6-.8.6h-1.3v-2.3h1.3c.5 0 .8.2.8.7 0 .3-.2.5-.4.6.3 0 .4.2.4.4zM14 13h-.7v1h.7c.3 0 .5-.2.5-.5s-.2-.5-.5-.5zm.4 1.7c0-.3-.2-.5-.5-.5h-.6v1h.6c.3 0 .5-.2.5-.5z"
                ></path>
                <path
                  fill="#FFF"
                  d="M17.3 16H16l-1-2.3H16l.5 1.3.5-1.3h.8zm1.4-1.9c-.2 0-.3 0-.4.2l-.1-1.4h-.8l.1 2.2c0 .6.4 1 1 1 .2 0 .4 0 .5-.1l-.1-.6h-.2zm1.5-.4h.8v2.3h-.8zm.4-1c-.3 0-.5.2-.5.5s.2.5.5.5.5-.2.5-.5-.2-.5-.5-.5zm1.8 0h-.8v-.6h.8v.7zm0 3.3h-.8v-2.3h.8v2.3zm1 0c-.3 0-.4-.2-.4-.5v-1.8h.8v-.7h-.8v-.7l-.8.2v.5h-.5v.7h.5v1.8c0 .8.5 1.1 1.2 1l-.1-.6.1.1zm1.8-2.4c-.4 0-.6.4-.7.8-.1-.4-.4-.8-.9-.8-.3 0-.5.1-.6.4v-.3h-.7v2.3h.8v-1.3c0-.3.2-.5.4-.5.3 0 .4.2.4.5v1.3h.8v-1.3c0-.3.1-.5.4-.5.2 0 .4.2.4.5v1.3h.8v-1.5c0-.7-.4-1-1-1h-.1z"
                ></path>
              </svg>
            </div>
            <div className="bg-gray-50 p-2 rounded px-3">
              <svg className="h-4 w-8" viewBox="0 0 32 16">
                <path
                  fill="#FFB600"
                  d="M30 0H2a2 2 0 00-2 2v12a2 2 0 002 2h28a2 2 0 002-2V2a2 2 0 00-2-2z"
                ></path>
                <path
                  fill="#DB0029"
                  d="M16 3.5a9 9 0 100 9 9 9 0 000-9z"
                ></path>
                <path
                  fill="#FB8C00"
                  d="M20 8a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <svg className="h-6 w-10" viewBox="0 0 40 24">
                <rect width="40" height="24" rx="4" fill="#FFF"></rect>
                <path
                  fill="#5B57A2"
                  d="M22 12a6 6 0 11-12 0 6 6 0 0112 0z"
                ></path>
                <path
                  fill="#D90751"
                  d="M30 12a6 6 0 11-12 0 6 6 0 0112 0z"
                ></path>
                <path
                  fill="#EE5E2F"
                  d="M26 12a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={isProcessing}
          className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            "Pay ₹100 Securely"
          )}
        </button>

        <div className="text-center mt-4 text-xs text-gray-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Secure payment powered by Razorpay
        </div>
      </div>

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => {
          console.log("Razorpay script loaded");
        }}
        onError={() => {
          console.error("Failed to load Razorpay script");
        }}
      />
    </div>
  );
};

export default PaymentPage;