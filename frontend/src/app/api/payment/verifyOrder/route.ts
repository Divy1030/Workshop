import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const { orderId, razorpayPaymentId, razorpaySignature } = await request.json();

    const keySecret = process.env.RAZORPAY_SECRET_ID as string;

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(orderId + "|" + razorpayPaymentId)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      return NextResponse.json(
        { message: "Payment verification failed", isOk: false },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Payment verified successfully", isOk: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error verifying Razorpay order:", error);
    return NextResponse.json(
      { message: "Internal Server Error", isOk: false },
      { status: 500 }
    );
  }
}