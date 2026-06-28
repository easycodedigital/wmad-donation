import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Sans_Khmer, Playfair_Display } from "next/font/google";
import { AppProviders } from "@/components/app-providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const notoSansKhmer = Noto_Sans_Khmer({
  variable: "--font-khmer",
  subsets: ["khmer"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "WMAD DONATE",
  icons: {
    icon: "/public/logo.png",
  },  
  description: "Donation platform for WMAD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${notoSansKhmer.variable} h-full w-full max-w-full overflow-x-hidden antialiased`}
    >
      <body
        suppressHydrationWarning
        className="flex min-h-full w-full max-w-full min-w-0 flex-col overflow-x-hidden font-[family-name:var(--font-geist-sans)]"
      >
        <AppProviders>
          <div className="w-full min-w-0 max-w-full overflow-x-hidden">{children}</div>
        </AppProviders>
      </body>
    </html>
  );
}
