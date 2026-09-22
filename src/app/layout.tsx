import type { Metadata } from "next";
import { Noto_Sans_Telugu, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-te",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Panchayat360 · Poll-Pulse AP",
  description:
    "Strategic grassroot electoral intelligence for Andhra Pradesh Gram Panchayat elections — NTR, Krishna & West Godavari.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakarta.variable} ${notoTelugu.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F5F5F7] font-sans text-[#1D1D1F]">
        {children}
      </body>
    </html>
  );
}
