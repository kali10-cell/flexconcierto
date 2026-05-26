import "./globals.css";

export const metadata = {
  title: "Flex Concierto",
  description: "Gestion de conciertos y experiencias en vivo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
