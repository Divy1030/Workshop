import { NextRequest, NextResponse } from "next/server";
// import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, orderId } = body;
    
    // Validate that we received the required fields
    if (!paymentId || !orderId) {
      return NextResponse.json({ 
        success: false, 
        error: "Missing payment information" 
      }, { status: 400 });
    }

    // Get the Razorpay key and secret
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_test_aZ74nXNctnJW7H";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "w3F8tvaIU93JThludnOwNA1U";
    
    // Verify the payment with Razorpay API
    const response = await fetch(
      `https://api.razorpay.com/v1/orders/${orderId}/payments`, 
      {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(`${key_id}:${key_secret}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // If Razorpay API call fails
    if (!response.ok) {
      console.error("Razorpay API error:", await response.text());
      return NextResponse.json({ 
        success: false, 
        error: "Could not verify payment with Razorpay" 
      }, { status: 500 });
    }

    // Parse response from Razorpay
    const data = await response.json();
    const items = data.items || [];
    
    // Define a type for the payment item
    interface PaymentItem {
      id: string;
      status: string;
      [key: string]: unknown; // For other properties that might exist
    }
    
    // Find our payment in the list of payments for this order
    const payment = items.find((item: PaymentItem) => item.id === paymentId);
    
    // If payment not found
    if (!payment) {
      return NextResponse.json({ 
        success: false, 
        error: "Payment not found" 
      }, { status: 404 });
    }

    // Check payment status
    const isSuccessful = payment.status === 'captured' || payment.status === 'authorized';
    
    return NextResponse.json({
      success: isSuccessful,
      orderId: orderId,
      paymentId: paymentId,
      status: payment.status
    });

  } catch (error) {
    console.error("Error verifying payment:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Payment verification failed" 
    }, { status: 500 });
  }
}