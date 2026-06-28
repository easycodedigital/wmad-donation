import { en } from "./en";
import { km } from "./km";
import type { Locale } from "./types";
import type { TranslationDict } from "./translation-dict";

export type { Locale, TranslationDict };
export { en, km };
export { LOCALES, LOCALE_COOKIE } from "./types";

const dictionaries: Record<Locale, TranslationDict> = { en, km };

export function getDictionary(locale: Locale): TranslationDict {
  return dictionaries[locale] ?? en;
}
