"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/components/language-provider";

const SCROLL_THRESHOLD = 48;

const navLinkClass = (scrolled: boolean) =>
  scrolled
    ? "transition hover:text-emerald-700"
    : "transition hover:text-emerald-300";

export function HomeHeader() {
  const t = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > SCROLL_THRESHOLD);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-all duration-300 ease-out ${
        scrolled
          ? "border-neutral-200 bg-white shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-3.5 md:gap-4 md:px-6 md:py-4">
        <Link
          href="/"
          className="flex shrink-0 items-center transition-opacity duration-300 hover:opacity-90"
          aria-label="WMAD Alumni home"
        >
          <Image
            src="/logo-mobile.png"
            alt=""
            width={44}
            height={44}
            priority
            className="h-10 w-10 object-contain md:hidden"
          />
          <Image
            src="/logo.png"
            alt="WMAD Alumni"
            width={180}
            height={48}
            priority
            className="hidden h-10 w-auto max-w-[168px] object-contain md:block lg:max-w-[180px]"
          />
        </Link>

        <nav
          className={`hidden items-center gap-6 text-sm font-medium transition-colors duration-300 lg:flex xl:gap-8 ${
            scrolled ? "text-neutral-600" : "text-white/95 [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]"
          }`}
        >
          <Link href="/" className={navLinkClass(scrolled)}>
            {t.nav.home}
          </Link>
          <a href="#causes" className={navLinkClass(scrolled)}>
            {t.nav.causes}
          </a>
          <a href="#pricing" className={navLinkClass(scrolled)}>
            {t.nav.pricing}
          </a>
          <a href="#donors" className={navLinkClass(scrolled)}>
            {t.nav.donors}
          </a>
          <a href="#cheer-wall" className={navLinkClass(scrolled)}>
            {t.nav.cheerWall}
          </a>
          <a href="#community-posts" className={navLinkClass(scrolled)}>
            {t.nav.posts}
          </a>
          <Link href="/login" className={navLinkClass(scrolled)}>
            {t.nav.login}
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:gap-3">
          <LanguageSwitcher scrolled={scrolled} />
          <Link
            href="/register"
            className={`rounded-bl-xl rounded-tr-lg border-2 px-2.5 py-1.5 text-[11px] font-semibold transition duration-300 sm:px-3 sm:py-2 sm:text-xs md:px-4 md:text-sm ${
              scrolled
                ? "border-neutral-200 text-neutral-800 hover:border-emerald-600 hover:text-emerald-700"
                : "border-white/80 text-white [text-shadow:0_1px_6px_rgba(0,0,0,0.35)] hover:border-emerald-300 hover:bg-emerald-500/25 hover:text-emerald-100"
            }`}
          >
            {t.nav.donate}
          </Link>
        </div>
      </div>
    </header>
  );
}
