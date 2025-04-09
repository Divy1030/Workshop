import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request, response: Response){
    const secretKey = process.env.RECAPTCHA_SECRET_KEY ;

    const postData = await request.json();

    const { gRecaptchaToken } = postData;
    
    let res;

    const formData = `secret=${secretKey}&response=${gRecaptchaToken}`;

    try {
        const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: formData,
          });
          
          res = await response.json();
          console.log("response at passing token######", res)
          
    } catch (error) {
        console.log("the task terminated at sending and verifing token")
        return NextResponse.json({success: false})
    }

    if(res && res.success && res.score > 0.5){
        console.log("res.data?.score:###", res.data?.score);

        return NextResponse.json({
            success: true,
            score: res.score,
        });
    } else {
        return NextResponse.json({ success: false });
    }
}