"use client";

import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  scrolled?: boolean;
};

export function LanguageSwitcher({ scrolled = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useLanguage();

  const options: { code: Locale; label: string }[] = [
    { code: "en", label: t.lang.en },
    { code: "km", label: t.lang.km },
  ];

  return (
    <div
      role="group"
      aria-label={t.lang.switchLabel}
      className={`inline-flex items-stretch overflow-hidden rounded-bl-xl rounded-tr-lg border-2 text-xs font-semibold transition duration-300 md:text-sm ${
        scrolled
          ? "border-neutral-200"
          : "border-white/80 [text-shadow:0_1px_6px_rgba(0,0,0,0.35)]"
      }`}
    >
      {options.map((option, index) => {
        const active = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            onClick={() => setLocale(option.code)}
            aria-pressed={active}
            className={`px-3 py-2 transition duration-300 md:px-4 ${
              index > 0
                ? scrolled
                  ? "border-l border-neutral-200"
                  : "border-l border-white/30"
                : ""
            } ${
              active
                ? scrolled
                  ? "bg-emerald-600 text-white"
                  : "bg-emerald-500/25 text-white hover:bg-emerald-500/35"
                : scrolled
                  ? "text-neutral-800 hover:border-emerald-600 hover:text-emerald-700"
                  : "text-white hover:bg-emerald-500/25 hover:text-emerald-100"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
