"use client";

import type { WarmWishItem } from "@/components/warm-wishes-grid";
import { WarmWishSliderCard } from "@/components/warm-wish-slider-card";
import { useTranslation } from "@/components/language-provider";
import {
  SectionPageSlider,
  useResponsiveItemsPerPage,
} from "@/components/section-page-slider";

type WarmWishesSliderProps = {
  wishes: WarmWishItem[];
  emptyHint?: string;
};

export function WarmWishesSlider({ wishes, emptyHint }: WarmWishesSliderProps) {
  const t = useTranslation();
  const resolvedEmptyHint = emptyHint ?? t.warmWishes.empty;
  const cardsPerPage = useResponsiveItemsPerPage(
    [
      { minWidth: 1280, count: 4 },
      { minWidth: 768, count: 3 },
      { minWidth: 640, count: 2 },
    ],
    1,
  );

  return (
    <SectionPageSlider
      items={wishes}
      itemsPerPage={cardsPerPage}
      getItemKey={(wish) => wish.id}
      emptyHint={resolvedEmptyHint}
      ariaLabel="Messages of hope"
      pageClassName="flex items-stretch justify-center gap-5 sm:gap-6"
      renderItem={(wish) => <WarmWishSliderCard wish={wish} />}
    />
  );
}
