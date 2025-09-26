import "./globals.css";
import { brand } from "./config/brand";

export const metadata = {
  title: "East — Hides and investment company LTD",
  description: "Premium East African sourcing. Ethical trade, consistent grades.",
  icons: {
    icon: [
      { url: '/east_logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/east_logo-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/east_logo.png', sizes: '180x180' },
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

