import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import arcjet, { shield } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    // Shield protects your app from common attacks e.g. SQL injection
    // DRY_RUN mode logs only. Use "LIVE" to block
    shield({
      mode: "LIVE",
    }),
  ],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request: NextRequest) {
  try {
    const decision = await aj.protect(_request);

    for (const result of decision.results) {
      console.log("Rule Result", result);
    }

    console.log("Conclusion", decision.conclusion);

    if (decision.isDenied() && decision.reason.isShield()) {
      console.log('you are suspicious');
      
      return NextResponse.json(
        {
          error: "You are suspicious!",
          // Useful for debugging, but don't return it to the client in
          // production
          //reason: decision.reason,
        },
        { status: 403 }
      );
    }else{
      console.log("passed by arcjet");
      
    }

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
      currency: order.currency,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create order" },
      { status: 500 }
    );
  }
}
