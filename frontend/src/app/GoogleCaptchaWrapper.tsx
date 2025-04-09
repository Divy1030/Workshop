// "use client";
// import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
// import React from "react";

// export default function GoogleCaptchaWrapper({
//     children,
// }: {
//     children: React.ReactNode;
// }) {
//     const recaptchaKey: string | undefined =
//         process?.env?.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
//     return (
//         <GoogleReCaptchaProvider
//             reCaptchaKey={recaptchaKey ?? "NOT DEFINED"}
//         >
//             {children}
//         </GoogleReCaptchaProvider>
//     );
// }

"use client";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import React from "react";

interface Props {
  children: React.ReactNode;
  reCaptchaKey: string;
  scriptProps?: {
    async?: boolean;
    defer?: boolean;
    appendTo?: 'head' | 'body';
    nonce?: string;
  };
}

export default function GoogleCaptchaWrapper({ children, reCaptchaKey, scriptProps }: Props) {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={reCaptchaKey}
      scriptProps={scriptProps}
    >
      {children}
    </GoogleReCaptchaProvider>
  );
}
