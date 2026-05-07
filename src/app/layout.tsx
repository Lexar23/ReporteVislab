import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dashboard de Reportes | Visualización Avanzada",
  description: "Sistema inteligente de visualización y gestión de reportes de facturación.",
};

import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { AnimatedBackground } from "@/components/layout/AnimatedBackground";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { RefreshProvider } from "@/context/RefreshContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (!theme) {
                  localStorage.setItem('theme', 'light');
                  document.documentElement.classList.remove('dark');
                } else if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) { }
            `,
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} w-full h-full overflow-y-scroll antialiased  scroll-smooth`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <RefreshProvider>
            <AnimatedBackground />
            <Navbar />
            <Sidebar />
            <div className="md:ml-75 ml-0 right-0 pt-4">
              {children}
            </div>
          </RefreshProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
