import NavBar from "@/components/NavBar";
import "./globals.css";

export const metadata = {
  title: "Shento's Blog • Tutorials",
  description: "The best tech tutorials you can imagine!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        {children}
      </body>
    </html>
  );
}
