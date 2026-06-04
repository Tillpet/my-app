import { getTranslations, setRequestLocale } from "next-intl/server";
import { LanguageSwitcher } from "./_components/language-switcher";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function I18nTestPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Common");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-primary">
      <h1 className="text-3xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="text-muted-foreground">{t("description")}</p>
      <p className="rounded-md bg-muted px-3 py-1 text-sm font-mono text-primary">
        {t("currentLocale", { locale })}
      </p>
      <LanguageSwitcher />
    </main>
  );
}
