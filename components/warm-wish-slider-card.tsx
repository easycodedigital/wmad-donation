"use client";

import { formatWarmWishTime, type WarmWishItem } from "@/components/warm-wishes-grid";
import { useTranslation } from "@/components/language-provider";

type WarmWishSliderCardProps = {
  wish: WarmWishItem;
};

export function WarmWishSliderCard({ wish }: WarmWishSliderCardProps) {
  const t = useTranslation();
  const roleLine = [wish.user.major ?? t.warmWishes.member, formatWarmWishTime(wish.createdAt)]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex w-[220px] shrink-0 flex-col items-center rounded-bl-[2.25rem] rounded-tr-2xl border border-slate-100 bg-white px-5 pb-6 pt-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md sm:w-[240px]">
      {wish.user.profileImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={wish.user.profileImage}
          alt=""
          className="h-28 w-28 rounded-bl-[1.75rem] rounded-tr-xl border-4 border-white object-cover shadow-md ring-2 ring-emerald-100 sm:h-32 sm:w-32"
        />
      ) : (
        <div className="flex h-28 w-28 items-center justify-center rounded-bl-[1.75rem] rounded-tr-xl border-4 border-white bg-gradient-to-br from-emerald-100 to-sky-100 text-3xl font-bold text-emerald-800 shadow-md ring-2 ring-emerald-100 sm:h-32 sm:w-32">
          {wish.user.name.slice(0, 1).toUpperCase()}
        </div>
      )}

      <p className="mt-4 line-clamp-2 text-center text-[11px] font-bold uppercase leading-snug tracking-wide text-slate-900">
        {wish.user.name}
      </p>
      <p className="mt-1 text-center text-[10px] text-slate-500">{roleLine}</p>
      <p className="mt-3 line-clamp-4 break-words text-center font-[family-name:var(--font-display)] text-sm italic leading-relaxed text-slate-700">
        {wish.message}
      </p>
    </article>
  );
}
