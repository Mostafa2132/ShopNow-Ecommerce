import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./Providers";
import Navbar from "../Components/Navbar/Navbar";
import ToastProvider from "../Components/ToastProvider/ToastProvider";
import Footer from "../Components/Footer/Footer";
import GusetRoute from "../Components/GusetRoute/GusetRoute";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ShopNow ",
  description:
    "Discover premium products at unbeatable prices. Shop electronics, fashion, home goods & more with fast shipping, authentic products, and exceptional customer service. 50K+ happy customers worldwide.",
  keywords: [
    "online shopping",
    "e-commerce",
    "premium products",
    "electronics",
    "fashion",
    "home goods",
    "fast delivery",
    "authentic products",
    "best deals",
    "online store",
  ],
  authors: [{ name: "ShopNow" }],
  creator: "ShopNow",
  publisher: "ShopNow",

  // Additional metadata
  category: "E-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="pt-12">
          <ToastProvider />

          <Providers>
            <Navbar />
            <main>
              <GusetRoute>{children}</GusetRoute>
            </main>
            <Footer />
          </Providers>
        </div>
      </body>
    </html>
  );
}
