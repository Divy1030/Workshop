import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_SECRET_ID as string,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, receipt } = await request.json();

    if (!amount || !currency || !receipt) {
      return NextResponse.json(
        { message: "Missing required fields", isOk: false },
        { status: 400 }
      );
    }

    const options = {
      amount: amount * 100, // Convert to smallest currency unit
      currency,
      receipt,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json(
      { message: "Order created successfully", order, isOk: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", isOk: false },
      { status: 500 }
    );
  }
}