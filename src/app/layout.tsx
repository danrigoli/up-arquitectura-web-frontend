import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Inter } from 'next/font/google'
import AuthProvider from '@/contexts/auth.context';
import initializeUser from '@/lib/ssr-user';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Trabajo Final",
  description: "Este es el trabajo final de la materia de Arquitectura Web de la Universidad de Palermo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await initializeUser();

  return (

    <html lang="en">
      <body
        className={`${inter.className} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <AuthProvider user={user}>
          {children}
          <Toaster />
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
