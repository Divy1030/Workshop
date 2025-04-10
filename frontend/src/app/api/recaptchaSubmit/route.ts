import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Add CORS headers
  const origin = request.headers.get('origin');
  
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return new NextResponse(
      JSON.stringify({ success: false, message: "Missing reCAPTCHA secret key." }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }

  try {
    const { gRecaptchaToken } = await request.json();

    if (!gRecaptchaToken) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Missing reCAPTCHA token." }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': origin || '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;

    const googleRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData,
    });

    const data = await googleRes.json();

    console.log("Google reCAPTCHA response:", data);

    return new NextResponse(
      JSON.stringify({
        success: data.success && data.score > 0.5,
        score: data.score,
        message: data.success && data.score > 0.5 ? "Verification successful" : "reCAPTCHA verification failed",
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return new NextResponse(
      JSON.stringify({ success: false, message: "Internal server error." }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin || '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS(request: Request) {
  const origin = request.headers.get('origin');
  
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': origin || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
