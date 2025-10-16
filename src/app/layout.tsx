import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MarketForge - Gere Projetos com IA",
  description: "Plataforma SaaS que usa IA para gerar projetos digitais completos em 6 passos",
  keywords: ["IA", "Gerador de Projetos", "PRD", "Bolt", "Lovable", "v0"],
  authors: [{ name: "MarketForge" }],
  openGraph: {
    title: "MarketForge - Gere Projetos com IA",
    description: "Transforme ideias em projetos completos com IA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          toastOptions={{
            style: {
              background: '#18181b',
              border: '1px solid rgba(168, 85, 247, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
