import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log("Registration request data:", formData); // Log the request data

    // Directly use the API endpoint
    const response = await fetch("https://workshop-sxnk.onrender.com/api/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    // Log response status
    console.log("API response status:", response.status);

    // Check if the response is JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      console.log("API response data:", data); // Log the response data

      if (!response.ok) {
        return NextResponse.json(
          {
            success: false,
            error: data.detail || data.message || JSON.stringify(data) || "Registration failed",
          },
          { status: response.status }
        );
      }

      return NextResponse.json({
        success: true,
        data: data,
      });
    } else {
      // Handle non-JSON responses
      const text = await response.text();
      console.error("Non-JSON response:", text);
      return NextResponse.json(
        {
          success: false,
          error: `Server returned non-JSON response. Status: ${response.status}`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    // Enhanced error logging
    console.error("Registration error:", error);
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}