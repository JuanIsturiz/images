import "../globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme-provider";
import TopBar from "@/components/shared/TopBar";
import { Image } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { ScrollArea } from "@/components/ui/scroll-area";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "images",
  description: "App Generated by Next.js and made by Juan Isturiz",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <head>
          <link rel="icon" href="/favicon.svg" sizes="any" />
        </head>
        <ClerkProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ScrollArea className="h-auto sm:h-screen">
              <main className="relative">
                <TopBar />
                <div className="w-full max-w-7xl mx-auto px-2">
                  <div className="relative">{children}</div>
                </div>
                <Toaster />
              </main>
            </ScrollArea>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
