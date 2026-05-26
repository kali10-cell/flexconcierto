import "./globals.css";
import { Cormorant_Garamond, Manrope } from "next/font/google";

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

export const metadata = {
  title: "Flex Concierto",
  description: "Gestión de conciertos, salas VIP y experiencias en vivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${body.variable} ${display.variable}`}>
        {children}
      </body>
    </html>
  );
}