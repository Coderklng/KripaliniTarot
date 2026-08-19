import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WelcomeMessageWidget from '../Component/welcomeMessage';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// 1. Metadata Object
export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')
  ),
  title: "Kripalini Tarot Reader",
  description: "Your website description",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Kripalini Tarot",
  },
  icons: {
    icon: [
      { url: "/images/logos/logo.jpg" },
    ],
  },
  openGraph: {
    title: "Kripalini Tarot Reader",
    description: "Your website description",
    images: [
      {
        url: "/images/logos/logo.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>

      {/* 🚀 FIX: WelcomeMessageWidget ko body ke andar laya gaya hai */}
      <body className="min-h-full flex flex-col">
        {children}
        <WelcomeMessageWidget />
      </body>
    </html>
  );
}