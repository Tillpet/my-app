import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Providers } from "@/components/providers";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import "../globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('theme-store');var mode='system',theme='default';if(raw){var parsed=JSON.parse(raw);var s=parsed&&parsed.state?parsed.state:parsed;if(s&&(s.mode==='light'||s.mode==='dark'||s.mode==='system'))mode=s.mode;if(s&&(s.theme==='default'||s.theme==='blue'||s.theme==='green'||s.theme==='purple'))theme=s.theme;}var effective=mode;if(mode==='system'){effective=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var root=document.documentElement;root.setAttribute('data-mode',effective);root.setAttribute('data-theme',theme);}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Common" });
  return {
    title: t("title"),
    description: t("description"),
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} data-mode="light" data-theme="default" suppressHydrationWarning>
      <head>
        <script
          // 防闪烁：在 React 水合前把 localStorage 中的主题写回 <html> 属性。
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers>
            <ThemeSwitcher />
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
