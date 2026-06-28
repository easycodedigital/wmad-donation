import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { AdminWorkspace } from "@/components/admin-workspace";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { findCommunityPostsForFeed, serializeCommunityPost } from "@/lib/community-posts-db";

async function loadProfileImagesByUserIds(ids: number[]) {
  const unique = [...new Set(ids.filter((id) => Number.isFinite(id)))];
  if (unique.length === 0) {
    return new Map<number, string | null>();
  }
  const rows = await prisma.$queryRaw<Array<{ id: number; profileImage: string | null }>>(
    Prisma.sql`SELECT id, "profileImage" FROM "User" WHERE id IN (${Prisma.join(unique)})`,
  );
  return new Map(rows.map((r) => [r.id, r.profileImage]));
}

export default async function AdminPage() {
  const token = (await cookies()).get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    redirect("/login");
  }

  if (payload.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: payload.id },
    select: { id: true, name: true, email: true, major: true, profileImage: true },
  });

  const memberManagementListRaw = await prisma.user.findMany({
    where: { role: "MEMBER" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      major: true,
      profileImage: true,
      status: true,
      createdAt: true,
    },
  });

  const memberUsersBase = memberManagementListRaw.filter((m) => m.status === "APPROVED");

  const allDonationsRaw = await prisma.donation.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  const profileMap = await loadProfileImagesByUserIds([
    ...memberUsersBase.map((m) => m.id),
    ...allDonationsRaw.map((d) => d.userId),
  ]);

  const memberUsers = memberUsersBase.map((m) => ({
    ...m,
    profileImage: profileMap.get(m.id) ?? null,
  }));

  const allDonations = allDonationsRaw.map((donation) => ({
    id: donation.id,
    amount: donation.amount,
    status: donation.status,
    paymentType: donation.paymentType,
    accountNumber: donation.accountNumber,
    proofImageUrl: donation.proofImageUrl,
    note: donation.note,
    createdAt: donation.createdAt.toISOString(),
    user: {
      id: donation.user.id,
      name: donation.user.name,
      email: donation.user.email,
      profileImage: profileMap.get(donation.userId) ?? null,
    },
  }));

  const communityPostsRaw = await findCommunityPostsForFeed(48);
  const communityPosts = communityPostsRaw.map(serializeCommunityPost);

  return (
    <main className="h-screen w-full max-w-full overflow-hidden bg-[#f4f6f8]">
      <AdminWorkspace
        adminId={adminUser?.id ?? payload.id}
        adminName={adminUser?.name ?? "Admin"}
        adminEmail={adminUser?.email ?? ""}
        adminMajor={adminUser?.major ?? null}
        adminProfileImage={adminUser?.profileImage ?? null}
        allDonations={allDonations}
        memberManagementList={memberManagementListRaw.map((m) => ({
          id: m.id,
          name: m.name,
          email: m.email,
          major: m.major,
          profileImage: m.profileImage,
          status: m.status,
          createdAt: m.createdAt.toISOString(),
        }))}
        memberUsers={memberUsers}
        communityPosts={communityPosts}
      />
    </main>
  );
}
