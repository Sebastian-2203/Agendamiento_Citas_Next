import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  weight: ["300", "400", "500", "600", "700"],
});

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
    <html lang="es" className={outfit.variable}>
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
