"use client";

import Link from "next/link";
import { DonationPricingSection } from "@/components/donation-pricing-section";
import { DonorShowcaseSlider } from "@/components/donor-showcase-slider";
import { HomeCommunityPostsSection } from "@/components/home-community-posts-section";
import { useTranslation } from "@/components/language-provider";
import type { CommunityPostItem } from "@/components/community-posts-types";
import type { WarmWishItem } from "@/components/warm-wishes-grid";
import { WarmWishesSlider } from "@/components/warm-wishes-slider";

const CAUSE_ICONS = [
  "https://png.pngtree.com/png-clipart/20250801/original/pngtree-hands-holding-floating-hearts-vector-png-image_21457648.png",
  "https://cdn-icons-png.flaticon.com/512/5455/5455944.png",
  "https://cdn.sanity.io/images/g3jm82pm/production/8d7f85c20a75235e618b35f982f05f343f022363-550x550.png?w=1200&q=75&fit=clip&auto=format",
] as const;

const ACTIVITY_IMAGES = [
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=900&q=80",
] as const;

type DonorMember = {
  id: number;
  name: string;
  profileImage: string | null;
};

type HomeSectionsProps = {
  donorMembers: DonorMember[];
  warmWishes: WarmWishItem[];
  communityPosts: CommunityPostItem[];
};

export function HomeSections({ donorMembers, warmWishes, communityPosts }: HomeSectionsProps) {
  const t = useTranslation();

  return (
    <div className="w-full min-w-0 max-w-full overflow-x-hidden">
      <section id="causes" className="scroll-mt-24 w-full max-w-full overflow-x-hidden bg-white px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto w-full min-w-0 max-w-6xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">
            {t.causes.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900 md:text-5xl">
            {t.causes.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-500">{t.causes.description}</p>

          <div className="mt-12 grid min-w-0 gap-6 md:grid-cols-3">
            {t.causes.cards.map((card, index) => (
              <article
                key={card.title}
                className="group min-w-0 rounded-bl-[2.75rem] rounded-tr-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl hover:shadow-slate-200/70"
              >
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-bl-2xl rounded-tr-xl bg-emerald-100 p-2 transition duration-300 group-hover:scale-110 group-hover:bg-emerald-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={CAUSE_ICONS[index]}
                    alt=""
                    className="h-full w-full object-contain transition duration-300 group-hover:scale-110"
                  />
                </span>
                <h3 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                  {card.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{card.body}</p>
                <Link
                  href="/register"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-500 transition duration-300 hover:gap-2 hover:text-emerald-600"
                >
                  {t.causes.readMore} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <DonationPricingSection />

      <section
        id="donors"
        className="scroll-mt-24 w-full max-w-full overflow-x-hidden border-t border-neutral-100 bg-gradient-to-b from-neutral-50 to-white px-4 py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              {t.donors.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900 md:text-4xl">
              {t.donors.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-600">{t.donors.description}</p>
          </div>

          {donorMembers.length === 0 ? (
            <p className="mt-12 text-center text-sm text-neutral-500">
              {t.donors.empty}{" "}
              <Link href="/register" className="font-semibold text-emerald-700 underline">
                {t.donors.registerLink}
              </Link>
              .
            </p>
          ) : (
            <div className="mt-12">
              <DonorShowcaseSlider donors={donorMembers} />
            </div>
          )}
        </div>
      </section>

      <section
        id="cheer-wall"
        className="scroll-mt-24 w-full max-w-full overflow-x-hidden border-t border-emerald-100/80 bg-gradient-to-b from-emerald-50/40 via-white to-white px-4 py-16 md:px-6 md:py-20"
      >
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
              {t.cheerWall.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900 md:text-4xl">
              {t.cheerWall.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-neutral-600">{t.cheerWall.description}</p>
          </div>

          <div className="mt-12 w-full min-w-0">
            <WarmWishesSlider wishes={warmWishes} emptyHint={t.cheerWall.empty} />
          </div>
        </div>
      </section>

      <HomeCommunityPostsSection posts={communityPosts} />

      <section className="w-full max-w-full overflow-x-hidden border-t border-neutral-100 bg-white px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto w-full min-w-0 max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-500">
              {t.activity.eyebrow}
            </p>
            <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-slate-900 md:text-5xl">
              {t.activity.title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-slate-500">{t.activity.description}</p>
          </div>

          <div className="mt-12 grid min-w-0 gap-6 md:grid-cols-3">
            {t.activity.cards.map((activity, index) => (
              <article
                key={activity.title}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="overflow-hidden rounded-bl-[4rem] rounded-tr-[1.25rem]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={ACTIVITY_IMAGES[index]}
                    alt={activity.title}
                    className="h-44 w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>
                <div className="px-1 pb-2 pt-5">
                  <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
                    {activity.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{activity.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <footer className="w-full max-w-full overflow-x-hidden border-t border-neutral-200 bg-emerald-700 px-4 py-12 text-white md:px-6">
        <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div>
            <p className="font-[family-name:var(--font-display)] text-2xl font-bold">
              {t.footer.title}
            </p>
            <p className="mt-1 text-sm text-emerald-100">{t.footer.description}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/register"
              className="rounded-bl-xl rounded-tr-lg bg-white px-6 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
            >
              {t.footer.register}
            </Link>
            <Link
              href="/login"
              className="rounded-bl-xl rounded-tr-lg border-2 border-white/80 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {t.footer.login}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
