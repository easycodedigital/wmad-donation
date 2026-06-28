"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "@/components/language-provider";

const HERO_SLIDES = [
  {
    src: "https://www.pse.ngo/sites/default/files/2024-09/132.jpeg",
    alt: "Children smiling together",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoukvschXLKZYba2JHSiWRteg3-88SAaBhYpF42-aJKg&s=10",
    alt: "Children learning in a classroom",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Qbwy_wDhR6YA0wH7J8lpCOtKkiRGhbc5QXtQwXWn0J-ObbIYjkzwssM&s=10",
    alt: "Volunteers supporting a community",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDKTWblnDY7Y22UwAoAYR45TOC7lCaVqQmOpfX4VOCBNzAUOeTPDeXhosZ&s=10",
    alt: "Hands reaching out to help",
  },
] as const;

const SLIDE_INTERVAL_MS = 4000;

export function HomeHero() {
  const t = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goToSlide = useCallback((index: number) => {
    setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  const goNext = useCallback(() => {
    goToSlide(activeIndex + 1);
  }, [activeIndex, goToSlide]);

  const goPrev = useCallback(() => {
    goToSlide(activeIndex - 1);
  }, [activeIndex, goToSlide]);

  useEffect(() => {
    if (paused) return;
    const id = window.setInterval(goNext, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, goNext]);

  return (
    <section
      className="relative isolate flex min-h-svh w-full flex-col overflow-hidden"
      aria-label="Hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Background slides */}
      <div className="absolute inset-0" aria-hidden>
        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ease-in-out motion-reduce:transition-none ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt=""
              className={`h-full w-full object-cover ${
                index === activeIndex ? "hero-slide-ken-burns" : ""
              }`}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 flex flex-1 items-center px-4 pb-12 pt-24 md:px-6 md:pb-16 md:pt-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-300">
            {t.hero.eyebrow}
          </p>
          <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-display)] text-4xl font-bold leading-[1.12] text-white md:text-5xl lg:text-6xl">
            {t.hero.title}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 md:text-base md:leading-8">
            {t.hero.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg border border-emerald-500 bg-emerald-500 px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-lg hover:shadow-emerald-900/40"
            >
              {t.hero.donateNow}
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg border border-white/60 px-7 py-3 text-sm font-semibold text-white transition duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white/15"
            >
              {t.hero.learnMore}
            </Link>
          </div>
        </div>
      </div>

      {/* Slider controls */}
      <div className="relative z-20 flex items-center justify-between px-4 pb-8 md:px-6">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`${t.hero.showSlide} ${index + 1}: ${slide.alt}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex
                    ? "w-8 bg-emerald-400"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              aria-label={t.hero.prevSlide}
              onClick={goPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-lg text-white transition hover:border-white/60 hover:bg-black/40"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label={t.hero.nextSlide}
              onClick={goNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-lg text-white transition hover:border-white/60 hover:bg-black/40"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {HERO_SLIDES[activeIndex].alt}
      </p>
    </section>
  );
}
