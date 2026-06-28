export type DonationPricingTierId =
  | "tier-5"
  | "tier-10"
  | "tier-15"
  | "tier-25"
  | "tier-50"
  | "tier-100";

export type DonationPricingTier = {
  id: DonationPricingTierId;
  amount: number;
  /** Cropped product image in public/pricing/ */
  image: string;
  featured?: boolean;
};

/** Minimum donation (USD) to qualify for a thank-you gift or apparel. */
export const MIN_DONATION_FOR_REWARD = 5;

export const DONATION_PRICING_TIERS: DonationPricingTier[] = [
  {
    id: "tier-5",
    amount: 5,
    image: "/pricing/tier-5.jpg",
  },
  {
    id: "tier-10",
    amount: 10,
    image: "/pricing/tier-10.jpg",
  },
  {
    id: "tier-15",
    amount: 15,
    image: "/pricing/tier-15.jpg",
  },
  {
    id: "tier-25",
    amount: 25,
    image: "/pricing/tier-25.jpg",
    featured: true,
  },
  {
    id: "tier-50",
    amount: 50,
    image: "/pricing/tier-50.jpg",
  },
  {
    id: "tier-100",
    amount: 100,
    image: "/pricing/tier-100.jpg",
  },
];

/** Returns the highest reward tier the amount qualifies for, or null if below minimum. */
export function getRewardTierForAmount(amount: number): DonationPricingTier | null {
  if (amount < MIN_DONATION_FOR_REWARD) return null;
  let matched: DonationPricingTier | null = null;
  for (const tier of DONATION_PRICING_TIERS) {
    if (amount >= tier.amount) matched = tier;
  }
  return matched;
}
