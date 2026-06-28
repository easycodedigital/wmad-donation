import { getTokenFromCookieHeader, verifyToken, type AuthPayload } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type AuthenticatedUser = AuthPayload & {
  name: string;
  profileImage: string | null;
  status: "PENDING" | "APPROVED" | "DISABLED";
};

export async function getAuthenticatedUser(
  req: Request,
): Promise<AuthenticatedUser | null> {
  const token = getTokenFromCookieHeader(req.headers.get("cookie"));
  if (!token) return null;

  let payload: AuthPayload;
  try {
    payload = verifyToken(token);
  } catch {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
    select: {
      id: true,
      role: true,
      status: true,
      name: true,
      profileImage: true,
    },
  });

  if (!user) return null;

  return {
    id: user.id,
    role: user.role,
    status: user.status,
    name: user.name,
    profileImage: user.profileImage,
  };
}

export function canPostCommunityUpdate(user: AuthenticatedUser): boolean {
  if (user.role === "ADMIN") return true;
  return user.role === "MEMBER" && user.status === "APPROVED";
}

export function canModerateCommunityPost(
  user: AuthenticatedUser,
  authorId: number,
): boolean {
  return user.id === authorId || user.role === "ADMIN";
}
