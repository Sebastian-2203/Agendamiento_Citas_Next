import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agendamiento Psicología",
  description: "Agenda tus citas de forma fácil y rápida",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>
        <div id="app">
          {children}
          {/* Decorative Background Leaves/Shapes */}
          <div className="bg-shape bg-shape-bottom-left"></div>
          <div className="bg-shape bg-shape-top-right"></div>
        </div>
      </body>
    </html>
  );
}
