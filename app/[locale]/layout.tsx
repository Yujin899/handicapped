import type { Metadata } from "next";
import { ThemeProvider } from "../../components/theme-provider";
import { Inter, IBM_Plex_Sans_Arabic } from "next/font/google";
import "../globals.css";
import { i18n, type Locale } from "../../i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AccessClinic | Verified Healthcare Accessibility",
  description: "Know if the clinic is right for you before you go. Find verified wheelchair access, hearing support, and quiet environments.",
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

import { getDictionary } from "../../i18n/dictionaries";
import { Header } from "../../components/header";
import { Footer } from "../../components/footer";
import { AuthProvider } from "../../components/auth-provider";
import { ChatWidget } from "../../components/chat-widget";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const dict = await getDictionary(locale as Locale);

  return (
    <html
      lang={locale}
      dir={isArabic ? "rtl" : "ltr"}
      className={`${inter.variable} ${ibmPlexSansArabic.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className={`min-h-full flex flex-col ${isArabic ? ibmPlexSansArabic.className : inter.className} transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            <div className={`min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/10 ${isArabic ? ibmPlexSansArabic.className : inter.className}`}>
              <Header dict={dict} locale={locale} />
              <main className="flex-1">
                {children}
              </main>
              <Footer dict={dict} locale={locale} />
              <ChatWidget locale={locale} />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
