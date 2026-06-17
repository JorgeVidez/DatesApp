import type { Metadata } from "next";
import { Literata, Plus_Jakarta_Sans } from "next/font/google";
import { CitasProvider } from "@/context/CitasContext";
import "./globals.css";

const literata = Literata({
  subsets: ["latin"],
  variable: "--font-literata",
  weight: ["600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Romantics Dates - Registro de Citas",
  description: "Planificando momentos románticos con intención y estética moderna.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${literata.variable} ${plusJakartaSans.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-on-background font-jakarta">
        <CitasProvider>
          {children}
        </CitasProvider>
      </body>
    </html>
  );
}
