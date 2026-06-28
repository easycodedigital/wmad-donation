export type CommunityPostItem = {
  id: number;
  content: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    major: string | null;
    profileImage: string | null;
    role: "ADMIN" | "MEMBER";
  };
};

export function formatCommunityPostTime(iso: string) {
  const date = new Date(iso);
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}
