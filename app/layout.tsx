import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#f2efe8",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://coffee-nostra-kazan.makhmutov18m.chatgpt.site"),
  title: "Nostra — выгодные условия закупки для заведений Казани",
  description:
    "Nostra помогает заведениям Казани покупать знакомые бренды кофе, сиропов и чая на более выгодных коммерческих условиях.",
  openGraph: {
    title: "Те же бренды. Лучше условия.",
    description: "Nostra — коммерческий партнёр между производителями и заведениями Казани.",
    type: "website",
    images: [{ url: "/og.png", alt: "Nostra — те же бренды, лучше условия" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Те же бренды. Лучше условия.",
    description: "Nostra — коммерческий партнёр между производителями и заведениями Казани.",
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
