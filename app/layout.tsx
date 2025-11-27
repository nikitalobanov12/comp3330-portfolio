import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Auth0Provider } from "@auth0/nextjs-auth0";
import { Toaster } from "@/components/ui/sonner";
import Navbar from "@/src/components/Navbar";
import { auth0 } from "@/lib/auth0";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Nikita's Portfolio",
  description: "Full-stack developer portfolio showcasing projects and skills",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth0.getSession();

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoMono.variable} antialiased`}
      >
        <Auth0Provider user={session?.user}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            {children}
            <Toaster />
          </ThemeProvider>
        </Auth0Provider>
      </body>
    </html>
  );
}
