import { Inter, JetBrains_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrainsmono",
});

export const metadata = {
  title: "Shento's Blog • Tutorials",
  description: "The best tech tutorials you can imagine!",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body className={inter.className}>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
