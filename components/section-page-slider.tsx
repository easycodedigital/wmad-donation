"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTranslation } from "@/components/language-provider";

const DEFAULT_INTERVAL_MS = 5000;

function chunk<T>(items: T[], size: number): T[][] {
  if (size <= 0) return [items];
  const pages: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    pages.push(items.slice(i, i + size));
  }
  return pages.length > 0 ? pages : [[]];
}

type SectionPageSliderProps<T> = {
  items: T[];
  itemsPerPage: number;
  renderItem: (item: T) => ReactNode;
  getItemKey: (item: T) => string | number;
  pageClassName?: string;
  autoIntervalMs?: number;
  emptyHint?: string;
  ariaLabel?: string;
  showArrows?: boolean;
};

export function SectionPageSlider<T>({
  items,
  itemsPerPage,
  renderItem,
  getItemKey,
  pageClassName = "flex flex-wrap items-start justify-center gap-5 sm:gap-6",
  autoIntervalMs = DEFAULT_INTERVAL_MS,
  emptyHint,
  ariaLabel = "Carousel",
  showArrows = true,
}: SectionPageSliderProps<T>) {
  const t = useTranslation();
  const [activePage, setActivePage] = useState(0);
  const [paused, setPaused] = useState(false);

  const pages = useMemo(
    () => chunk(items, itemsPerPage),
    [items, itemsPerPage],
  );

  const pageCount = pages.length;
  const visiblePage =
    pageCount > 0 ? Math.min(activePage % pageCount, pageCount - 1) : 0;

  const goToPage = useCallback(
    (index: number) => {
      if (pageCount === 0) return;
      setActivePage(((index % pageCount) + pageCount) % pageCount);
    },
    [pageCount],
  );

  useEffect(() => {
    if (paused || pageCount <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const id = window.setInterval(() => {
      setActivePage((current) => (current + 1) % pageCount);
    }, autoIntervalMs);
    return () => window.clearInterval(id);
  }, [paused, pageCount, autoIntervalMs]);

  if (items.length === 0) {
    return emptyHint ? (
      <p className="text-center text-sm text-neutral-500">{emptyHint}</p>
    ) : null;
  }

  return (
    <div
      className="relative w-full min-w-0 max-w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
    >
      {showArrows && pageCount > 1 ? (
        <>
          <div className="absolute left-0 top-1/2 z-20 hidden -translate-y-1/2 sm:block">
            <button
              type="button"
              aria-label={t.hero.prevSlide}
              onClick={() => goToPage(visiblePage - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              ‹
            </button>
          </div>
          <div className="absolute right-0 top-1/2 z-20 hidden -translate-y-1/2 sm:block">
            <button
              type="button"
              aria-label={t.hero.nextSlide}
              onClick={() => goToPage(visiblePage + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-lg text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              ›
            </button>
          </div>
        </>
      ) : null}

      <div
        className="w-full min-w-0 overflow-hidden px-1 sm:px-10"
        aria-label={ariaLabel}
        role="region"
      >
        <div
          className="flex transition-transform duration-500 ease-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${visiblePage * 100}%)` }}
        >
          {pages.map((page, pageIndex) => (
            <ul
              key={pageIndex}
              className={`w-full shrink-0 ${pageClassName}`}
              aria-hidden={pageIndex !== visiblePage}
            >
              {page.map((item) => (
                <li key={getItemKey(item)}>{renderItem(item)}</li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-2">
          {pages.map((_, index) => {
            const isActive = index === visiblePage;
            return (
              <button
                key={index}
                type="button"
                aria-label={`${t.hero.showSlide} ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => goToPage(index)}
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "flex h-3.5 w-3.5 items-center justify-center border-2 border-emerald-500 bg-white"
                    : "h-2.5 w-2.5 bg-emerald-200 hover:bg-emerald-300"
                }`}
              >
                {isActive ? (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export function useResponsiveItemsPerPage(
  breakpoints: { minWidth: number; count: number }[],
  fallback = 1,
) {
  const sorted = useMemo(
    () => [...breakpoints].sort((a, b) => b.minWidth - a.minWidth),
    [breakpoints],
  );

  const [count, setCount] = useState(fallback);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const match = sorted.find((bp) => width >= bp.minWidth);
      setCount(match?.count ?? fallback);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [sorted, fallback]);

  return count;
}
