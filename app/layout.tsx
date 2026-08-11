import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-nostra-kazan.makhmutov18m.chatgpt.site"),
  title: "Coffee Nostra — B2B-подписка для заведений Казани",
  description:
    "Coffee Nostra объединяет закупки заведений, согласует условия с поставщиками и помогает покупать кофе, чай и сиропы без лишнего объёма.",
  openGraph: {
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-посредник между поставщиками и заведениями Казани.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Цены крупного опта — без крупного объёма",
    description: "B2B-посредник между поставщиками и заведениями Казани.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
