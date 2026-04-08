import type { Metadata } from "next";
import { Maven_Pro } from "next/font/google";
import "./globals.css";

const mavenPro = Maven_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-maven",
});

export const metadata: Metadata = {
  title: "Kobo — Móveis que Brincam",
  description:
    "Atelier brasileiro de mobiliário infantil em MDF. Encaixes à vista, bordas roliças, estética silenciosa.",
  keywords: ["mobiliário infantil", "MDF", "design", "atelier", "brasil"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${mavenPro.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
