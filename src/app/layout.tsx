import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Footer from "./Footer";
import "./globals.css";
import Nav from "./Nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SOAC",
  description: "Small Object Automated Counting Website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} relative flex flex-col items-center min-h-screen`}
      >
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
