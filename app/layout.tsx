import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-nostra-kazan.makhmutov18m.chatgpt.site"),
  title: "Coffee Nostra — B2B-подписка для заведений Казани",
  description:
    "Кофе, чай и сиропы по специальным условиям без необходимости закупать лишний объём.",
  openGraph: {
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-подписка Coffee Nostra для заведений Казани.",
    type: "website",
    images: [{ url: "/og.png", width: 1730, height: 900 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-подписка Coffee Nostra для заведений Казани.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
