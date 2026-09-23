import type { Metadata } from "next";
import { IBM_Plex_Mono, Noto_Sans_Telugu, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-outfit",
  display: "swap",
});

const notoTelugu = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-te",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-mono",
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
      className={`${outfit.variable} ${notoTelugu.variable} ${ibmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--pp-dust)] font-sans text-[var(--pp-ink)]">
        {children}
      </body>
    </html>
  );
}
