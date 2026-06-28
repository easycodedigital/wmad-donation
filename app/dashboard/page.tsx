import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthPayload, verifyToken } from "@/lib/auth";
import { DashboardWorkspace } from "@/components/dashboard-workspace";
import { prisma } from "@/lib/prisma";
import { findWarmWishesForUser } from "@/lib/warm-wishes-db";
import { findCommunityPostsForUser, serializeCommunityPost } from "@/lib/community-posts-db";

export default async function DashboardPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload: AuthPayload;
  try {
    payload = verifyToken(token);
  } catch {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    include: {
      donations: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  if (user.status !== "APPROVED") {
    redirect("/login");
  }

  const warmWishesRaw = await findWarmWishesForUser(user.id, 48);
  const warmWishes = warmWishesRaw.map((w) => ({
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

  const communityPostsRaw = await findCommunityPostsForUser(user.id, 48);
  const communityPosts = communityPostsRaw.map(serializeCommunityPost);

  return (
    <main className="h-screen w-full max-w-full overflow-hidden bg-[#f4f6f8]">
      <DashboardWorkspace
        user={{
          id: user.id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          major: user.major,
        }}
        donations={user.donations.map((d) => ({
          id: d.id,
          amount: d.amount,
          status: d.status,
          paymentType: d.paymentType,
          accountNumber: d.accountNumber,
          proofImageUrl: d.proofImageUrl,
          note: d.note,
          createdAt: d.createdAt.toISOString(),
        }))}
        warmWishes={warmWishes}
        communityPosts={communityPosts}
      />
    </main>
  );
}
