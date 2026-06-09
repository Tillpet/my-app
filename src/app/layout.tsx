import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import "./globals.css";

const THEME_INIT_SCRIPT = `(function(){try{var raw=localStorage.getItem('theme-store');var mode='system',theme='default';if(raw){var parsed=JSON.parse(raw);var s=parsed&&parsed.state?parsed.state:parsed;if(s&&(s.mode==='light'||s.mode==='dark'||s.mode==='system'))mode=s.mode;if(s&&(s.theme==='default'||s.theme==='blue'||s.theme==='green'||s.theme==='purple'))theme=s.theme;}var effective=mode;if(mode==='system'){effective=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var root=document.documentElement;root.setAttribute('data-mode',effective);root.setAttribute('data-theme',theme);}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My App",
  description: "My App",
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: Props) {
  return (
    <html data-mode="light" data-theme="default" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {/* <ThemeSwitcher /> */}
          {children}
        </Providers>
      </body>
    </html>
  );
}
