import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Revolve",
  description: "A trusty app which cycles through and recommends items, activities or events based on the last time you used them. ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex flex-col grow min-h-screen">
          {children} 
        </main>  
      </body>
    </html>
  );
}
