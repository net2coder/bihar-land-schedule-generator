import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="hi">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
