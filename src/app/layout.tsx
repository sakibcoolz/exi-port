import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Exi-port.com - Global Trade Classified Platform",
  description: "Connect exporters, importers, trade agents, and buyers worldwide. Post products, discover opportunities, and grow your business with Exi-port.com.",
  keywords: ["export", "import", "trade", "classified", "global", "business", "products"],
  authors: [{ name: "Exi-port Team" }],
  openGraph: {
    title: "Exi-port.com - Global Trade Classified Platform",
    description: "Connect exporters, importers, trade agents, and buyers worldwide.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Exi-port.com - Global Trade Classified Platform",
    description: "Connect exporters, importers, trade agents, and buyers worldwide.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
