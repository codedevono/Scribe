import "./globals.css";
import { Instrument_Sans, Newsreader } from "next/font/google";

const ui = Instrument_Sans({ subsets: ["latin"], variable: "--font-ui", display: "swap" });
const write = Newsreader({ subsets: ["latin"], variable: "--font-write", display: "swap" });

export const metadata = { title: "Scribe" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ui.variable} ${write.variable}`}>
      <body>{children}</body>
    </html>
  );
}