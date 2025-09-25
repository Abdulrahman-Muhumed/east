import "./globals.css";
import { brand } from "./config/brand";

export const metadata = {
  title: "East — Arabic Gum & Natural Resins",
  description: "Premium East African sourcing. Ethical trade, consistent grades.",
  icons: {
    icon: '/east_image2.png',             // or '/icon.png'
    apple: '/east_image2.png',
    shortcut: '/east_image2.png',
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
        {children}
      </body>
    </html>
  );
}

