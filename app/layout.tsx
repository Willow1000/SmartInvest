import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "./components/auth/ModalContext";
import SignupModal from "./components/auth/SignupModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartInvest - Institutional-Grade Asset Management",
  description: "Advanced algorithms & professional tools for serious investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#1a1d29] text-white`}
      >
        <ModalProvider>
          {children}
          <SignupModal />
        </ModalProvider>
      </body>
    </html>
  );
}
