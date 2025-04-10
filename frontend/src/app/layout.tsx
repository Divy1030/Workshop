import type { Metadata } from "next";
import { Inter, DM_Sans } from "next/font/google";
import "./globals.css";
// import { ReactNode } from "react";
import GoogleCaptchaWrapper from "./GoogleCaptchaWrapper";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-inter",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Render 3.0",
  description: "CSI student registration form for Render 3.0,",
};

// interface Props {
//   children: ReactNode;
//   reCaptchaKey: string;
//   scriptProps?: {
//     async?: boolean;
//     defer?: boolean;
//     appendTo?: 'head' | 'body';
//     nonce?: string;
//   };
// }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${dmSans.variable}`}>
      <body className="font-sans">
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
        <GoogleCaptchaWrapper
         reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
         scriptProps={{
           async: true,
           defer: true,
           appendTo: 'head',
           nonce: undefined,
         }}
         >{children}</GoogleCaptchaWrapper>
      </body>
    </html>
  );
}
