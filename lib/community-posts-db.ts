import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type CommunityPostWithUser = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    major: string | null;
    profileImage: string | null;
    role: "ADMIN" | "MEMBER";
  };
};

const userSelect = {
  id: true,
  name: true,
  major: true,
  profileImage: true,
  role: true,
} as const;

function isCommunityPostTableMissing(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2021" &&
    error.message.includes("CommunityPost")
  );
}

export async function findCommunityPostsForFeed(
  take = 48,
): Promise<CommunityPostWithUser[]> {
  try {
    return await prisma.communityPost.findMany({
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: userSelect } },
    });
  } catch (error) {
    if (isCommunityPostTableMissing(error)) {
      return [];
    }
    throw error;
  }
}

export async function findCommunityPostsForUser(
  userId: number,
  take = 48,
): Promise<CommunityPostWithUser[]> {
  try {
    return await prisma.communityPost.findMany({
      where: { userId },
      take,
      orderBy: { createdAt: "desc" },
      include: { user: { select: userSelect } },
    });
  } catch (error) {
    if (isCommunityPostTableMissing(error)) {
      return [];
    }
    throw error;
  }
}

export async function createCommunityPostRecord(
  userId: number,
  content: string,
  imageUrl: string | null,
): Promise<CommunityPostWithUser> {
  try {
    return await prisma.communityPost.create({
      data: { userId, content, imageUrl },
      include: { user: { select: userSelect } },
    });
  } catch (error) {
    if (isCommunityPostTableMissing(error)) {
      throw new Error(
        "Community posts is not ready yet. Please run migrations, then try again.",
      );
    }
    throw error;
  }
}

export async function findCommunityPostById(
  id: number,
): Promise<CommunityPostWithUser | null> {
  try {
    return await prisma.communityPost.findUnique({
      where: { id },
      include: { user: { select: userSelect } },
    });
  } catch (error) {
    if (isCommunityPostTableMissing(error)) {
      return null;
    }
    throw error;
  }
}

export async function updateCommunityPostRecord(
  id: number,
  content: string,
  imageUrl: string | null,
): Promise<CommunityPostWithUser> {
  return prisma.communityPost.update({
    where: { id },
    data: { content, imageUrl },
    include: { user: { select: userSelect } },
  });
}

export async function deleteCommunityPostRecord(id: number): Promise<void> {
  await prisma.communityPost.delete({ where: { id } });
}

export function serializeCommunityPost(post: CommunityPostWithUser) {
  return {
    id: post.id,
    content: post.content,
    imageUrl: post.imageUrl,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    user: {
      id: post.user.id,
      name: post.user.name,
      major: post.user.major,
      profileImage: post.user.profileImage,
      role: post.user.role,
    },
  };
}
