import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Coffee Nostra — B2B-подписка для заведений Казани",
  description:
    "Кофе, чай и сиропы по специальным условиям без необходимости закупать лишний объём.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
