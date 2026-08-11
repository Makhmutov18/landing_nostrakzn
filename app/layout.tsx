import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#0e0f0e",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-nostra-kazan.makhmutov18m.chatgpt.site"),
  title: "Coffee Nostra — B2B-подписка для заведений Казани",
  description:
    "Coffee Nostra объединяет закупки заведений, согласует условия с поставщиками и помогает покупать кофе, чай и сиропы без лишнего объёма.",
  openGraph: {
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-посредник между поставщиками и заведениями Казани.",
    type: "website",
    images: [{ url: "/og.png", alt: "Coffee Nostra — цены крупного опта без крупного объёма" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-посредник между поставщиками и заведениями Казани.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
