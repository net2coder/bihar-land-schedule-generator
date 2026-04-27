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
  title: "बंटवारा | आपसी बंटवारा जनरेटर",
  description:
    "भूमि विभाजन की अधिकार-अभिलेख तालिका बनाएं — प्रिंट-अनुकूलित आपसी बंटवारा जनरेटर",
  applicationName: "बंटवारा",
  keywords: ["बंटवारा", "भूमि विभाजन", "खसरा", "खतौनी", "land division"],
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
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
