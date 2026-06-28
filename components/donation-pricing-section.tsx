"use client";

import Link from "next/link";
import { useTranslation } from "@/components/language-provider";
import { DONATION_PRICING_TIERS } from "@/lib/donation-pricing";

export function DonationPricingSection() {
  const t = useTranslation();

  return (
    <section
      id="pricing"
      className="scroll-mt-24 w-full max-w-full overflow-x-hidden border-t border-neutral-100 bg-gradient-to-b from-white via-emerald-50/30 to-white px-4 py-16 md:px-6 md:py-20"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-600">
            {t.pricing.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900 md:text-4xl">
            {t.pricing.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-600">{t.pricing.description}</p>
          <p className="mx-auto mt-4 inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-800">
            {t.pricing.minimum}
          </p>
        </div>

        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DONATION_PRICING_TIERS.map((tier, index) => {
            const copy = t.pricing.tiers[index];
            const isFeatured = tier.featured === true;

            return (
              <li key={tier.id}>
                <article
                  className={`group flex h-full flex-col overflow-hidden rounded-bl-[2.75rem] rounded-tr-2xl border bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg ${
                    isFeatured
                      ? "border-emerald-300 ring-2 ring-emerald-100"
                      : "border-slate-100 hover:border-emerald-100"
                  }`}
                >
                  <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white">
                    {isFeatured ? (
                      <span className="absolute left-4 top-4 z-10 rounded-full bg-emerald-600 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                        {t.pricing.popular}
                      </span>
                    ) : null}
                    <span className="absolute right-4 top-4 z-10 rounded-bl-lg rounded-tr-md bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700 shadow-sm">
                      {copy.badge}
                    </span>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={tier.image}
                      alt={copy.gift}
                      className="mx-auto h-52 w-full max-w-full object-contain px-4 py-3 transition duration-500 group-hover:scale-[1.03] sm:h-56"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-end justify-between gap-3">
                      <p className="font-[family-name:var(--font-display)] text-4xl font-bold text-emerald-700">
                        ${tier.amount}
                      </p>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {t.pricing.giftLabel}
                      </p>
                    </div>

                    <h3 className="mt-3 text-lg font-bold text-slate-900">{copy.gift}</h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">
                      {copy.description}
                    </p>

                    <Link
                      href="/register"
                      className={`mt-5 inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg px-5 py-2.5 text-sm font-semibold transition duration-300 ${
                        isFeatured
                          ? "bg-emerald-600 text-white hover:bg-emerald-700"
                          : "border border-emerald-200 text-emerald-700 hover:border-emerald-500 hover:bg-emerald-50"
                      }`}
                    >
                      {t.pricing.donateCta.replace("{amount}", String(tier.amount))}
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>

        <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-relaxed text-slate-500">
          {t.pricing.note}
        </p>
      </div>
    </section>
  );
}
