"use client";

import { LanguageProvider } from "@/components/language-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
