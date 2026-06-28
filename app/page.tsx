import { connection } from "next/server";
import { Prisma } from "@prisma/client";
import { HomeHeader } from "@/components/home-header";
import { HomeHero } from "@/components/home-hero";
import { HomeSections } from "@/components/home-sections";
import { prisma } from "@/lib/prisma";
import { findWarmWishesForFeed } from "@/lib/warm-wishes-db";
import { findCommunityPostsForFeed, serializeCommunityPost } from "@/lib/community-posts-db";

export const dynamic = "force-dynamic";

async function getWarmWishesForHome() {
  const rows = await findWarmWishesForFeed(48);
  return rows.map((w) => ({
    id: w.id,
    message: w.message,
    createdAt: w.createdAt.toISOString(),
    user: {
      id: w.user.id,
      name: w.user.name,
      major: w.user.major,
      profileImage: w.user.profileImage,
    },
  }));
}

async function getDonorMembersForShowcase() {
  return prisma.$queryRaw<
    Array<{ id: number; name: string; profileImage: string | null }>
  >(Prisma.sql`
    SELECT u.id, u.name, u."profileImage"
    FROM "User" u
    WHERE u.role = 'MEMBER'
      AND u.status = 'APPROVED'
      AND EXISTS (SELECT 1 FROM "Donation" d WHERE d."userId" = u.id)
    ORDER BY (
      SELECT MAX(d."createdAt") FROM "Donation" d WHERE d."userId" = u.id
    ) DESC
    LIMIT 16
  `);
}

export default async function Home() {
  await connection();
  const donorMembers = await getDonorMembersForShowcase();
  const warmWishes = await getWarmWishesForHome();
  const communityPostsRaw = await findCommunityPostsForFeed(48);
  const communityPosts = communityPostsRaw.map(serializeCommunityPost);

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-white text-neutral-800">
      <HomeHeader />
      <HomeHero />
      <HomeSections
        donorMembers={donorMembers}
        warmWishes={warmWishes}
        communityPosts={communityPosts}
      />
    </div>
  );
}
