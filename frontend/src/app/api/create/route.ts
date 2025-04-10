import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    // Initialize Razorpay with proper error handling
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_aZ74nXNctnJW7H",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "w3F8tvaIU93JThludnOwNA1U",
    });

    const options = {
      amount: 10000, // ₹100 in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);
    return NextResponse.json({
      success: true,
      id: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}