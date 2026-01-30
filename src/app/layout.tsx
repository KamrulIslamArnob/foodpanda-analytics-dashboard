import type { Metadata } from "next";
import { Lexend_Deca, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/layout/footer";

const lexendDeca = Lexend_Deca({
  variable: "--font-lexend-deca",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodPanda Analytics",
  description: "Visualize and analyze your FoodPanda order history.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lexendDeca.variable} ${geistMono.variable} font-sans antialiased min-h-screen flex flex-col`}
        style={{ fontFamily: "var(--font-lexend-deca), system-ui, sans-serif" }}
      >
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
