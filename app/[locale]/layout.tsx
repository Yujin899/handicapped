import type { Metadata } from "next";
import { ThemeProvider } from "../../components/theme-provider";
import "../globals.css";
import { i18n, type Locale } from "../../i18n/config";

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
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans transition-colors duration-300">
        <ThemeProvider>
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/10">
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
