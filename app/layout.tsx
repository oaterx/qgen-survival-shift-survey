import type { Metadata } from "next";
import { Playfair_Display, IBM_Plex_Sans_Thai, Inter, Prompt } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-playfair",
  display: "swap",
});

const plexThai = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-plex-thai",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Office Survivor Survey — QGEN",
  description: "วัดความมั่นคงทางการเงิน เส้นทางอาชีพ และสุขภาพของคุณ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${playfair.variable} ${plexThai.variable} ${inter.variable} ${prompt.variable} h-full antialiased`}
    >
      <body className="qgen-theme qgen-paper-texture min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
