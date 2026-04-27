import type { Metadata } from "next";
import { Yantramanav, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";

const yantramanav = Yantramanav({
  weight: ["400", "500", "700", "900"],
  subsets: ["devanagari", "latin"],
  variable: "--font-yantramanav",
  display: "swap",
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bantwara – Land Division & Property Schedule Generator (बंटवारा सॉफ्टवेयर)",
  description:
    "Create property division schedules and land records effortlessly with Bantwara by net2coder. Professional jameen/jamin bantwara generator for Bihar land records. Print-optimized for Khesra, Khata, Jamabandi documentation.",
  applicationName: "Bantwara – Land Division & Property Schedule Generator",
  keywords: [
    "bantwara",
    "बंटवारा",
    "land division",
    "भूमि विभाजन",
    "property division",
    "schedule generator",
    "bantwara generator",
    "jameen bantwara",
    "jamin bantwara",
    "net2coder",
    "alok kushwaha",
    "bantwara by net2coder",
    "net2coder jameen",
    "net2coder jamin",
    "खसरा",
    "खतौनी",
    "land records",
    "Bihar land",
    "property records",
    "land survey",
    "भूमि अभिलेख",
    "आपसी बंटवारा",
    "भू विभाजन",
    "जमीन बंटवारा",
    "property schedule",
    "print schedule",
    "boundary documentation",
    "parcel division",
    "land partition",
    "bantwara.net2coder.in",
  ],
  authors: [{ name: "net2coder", url: "https://net2coder.in" }, { name: "Alok Kushwaha" }],
  creator: "net2coder",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  openGraph: {
    type: "website",
    locale: "hi_IN",
    url: "https://bantwara.net2coder.in",
    siteName: "Bantwara – Land Division & Property Schedule Generator",
    title: "Bantwara – Land Division & Property Schedule Generator (बंटवारा सॉफ्टवेयर)",
    description: "Professional jameen/jamin bantwara and property division schedule generator for Bihar land records.",
    images: [
      {
        url: "https://bantwara.net2coder.in/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bantwara – Land Division & Property Schedule Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bantwara – Land Division & Property Schedule Generator",
    description: "Professional jameen/jamin bantwara and property division schedule generator by net2coder",
    creator: "@net2coder",
    images: ["https://bantwara.net2coder.in/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "google-site-verification-code-here",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" className={`${yantramanav.variable} ${notoSansDevanagari.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased">{children}</body>
    </html>
  );
}
