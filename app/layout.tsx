import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import { auth } from "@/auth";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Evently — Plan Events Together",
    template: "%s | Evently",
  },
  description:
    "Create events, invite people, and manage RSVPs — all in one place. Evently makes social and professional event planning effortless.",
  keywords: [
    "event planning",
    "events",
    "RSVP",
    "social events",
    "professional events",
    "meetup",
    "gatherings",
    "event management",
    "invite",
  ],
  authors: [{ name: "Evently" }],
  creator: "Evently",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Evently",
    images: [
      {
        url: "/hero.webp",
        width: 1200,
        height: 630,
        alt: "Evently — Plan events together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/hero.webp"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="min-h-screen bg-background text-foreground pb-12">
          <Navbar session={session} />
          <div className="mx-auto px-4 py-8">{children}</div>
        </div>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
