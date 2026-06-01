import { promises as fs } from "fs";
import path from "path";
import { hasLocale } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messagesPath = path.join(
    process.cwd(),
    "src",
    "messages",
    `${locale}.json`,
  );
  const messages = JSON.parse(await fs.readFile(messagesPath, "utf-8"));

  return {
    locale,
    messages,
  };
});
