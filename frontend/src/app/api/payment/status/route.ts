import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const registrationId = searchParams.get("registration_id");

    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: "Registration ID is required" },
        { status: 400 }
      );
    }

    // Directly use the API endpoint
    const response = await fetch(`https://workshop-sxnk.onrender.com/api/payment/status/?registration_id=${registrationId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log response status
    console.log("API response status:", response.status);

    const data = await response.json();
    console.log("API response data:", data); // Log the response data

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data.detail || "Failed to fetch payment status",
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        payment_status: data.payment_status,
        payment_time: data.payment_time,
        reference_id: data.reference_id,
      },
    });
  } catch (error) {
    console.error("Payment status error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}