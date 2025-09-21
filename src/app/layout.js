import "./globals.css";
import { brand } from "./config/brand";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollTopButton from "./components/ui/ScrollTopButton";
import { icons } from "lucide-react";

export const metadata = {
  title: "East — Arabic Gum & Natural Resins",
  description: "Premium East African sourcing. Ethical trade, consistent grades.",
  icons: {
    icon: '/east_image2.png.ico',             // or '/icon.png'
    apple: '/east_image2.png.png',
    shortcut: '/east_image2.png.ico',
  },
};

export default function RootLayout({ children }) {
  const vars = {
    "--brand-primary": brand.colors.primary,
    "--brand-accent": brand.colors.accent
  };

  return (
    <html lang="en">
      <body style={vars} className=" text-black ">
        <Header />
        <main className="min-h-dvh">{children}</main>
        <ScrollTopButton />
        <Footer />
      </body>
    </html>
  );
}

