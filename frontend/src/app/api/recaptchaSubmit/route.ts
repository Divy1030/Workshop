// import { headers } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST(request: Request, response: Response){
//     const secretKey = process.env.RECAPTCHA_SECRET_KEY ;

//     const postData = await request.json();

//     const { gRecaptchaToken } = postData;
    
//     let res;

//     const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;

//     try {
//         const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/x-www-form-urlencoded",
//             },
//             body: formData,
//           });
          
//           res = await response.json();
//           console.log("response at passing token######", res)
          
//     } catch (error) {
//         console.log("the task terminated at sending and verifing token")
//         return NextResponse.json({success: false})
//     }

//     if(res && res.success && res.score > 0.5){
//         console.log("res.data?.score:###", res.data?.score);

//         return NextResponse.json({
//             success: true,
//             score: res.score,
//         });
//     } else {
//         return NextResponse.json({ success: false });
//     }
// }

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { success: false, message: "Missing reCAPTCHA secret key." },
      { status: 500 }
    );
  }

  try {
    const { gRecaptchaToken } = await request.json();

    if (!gRecaptchaToken) {
      return NextResponse.json(
        { success: false, message: "Missing reCAPTCHA token." },
        { status: 400 }
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

    if (data.success && data.score > 0.5) {
      return NextResponse.json({
        success: true,
        score: data.score,
      });
    } else {
      return NextResponse.json({
        success: false,
        score: data.score,
        message: "reCAPTCHA verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
