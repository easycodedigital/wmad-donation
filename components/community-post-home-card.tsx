"use client";

import {
  formatCommunityPostTime,
  type CommunityPostItem,
} from "@/components/community-posts-types";

type CommunityPostHomeCardProps = {
  post: CommunityPostItem;
};

function splitPostContent(post: CommunityPostItem) {
  const text = post.content.trim();
  if (!text) {
    return { title: "Photo update", excerpt: null as string | null };
  }

  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) {
    return {
      title: lines[0],
      excerpt: lines.slice(1).join(" ").trim() || null,
    };
  }

  if (text.length <= 88) {
    return { title: text, excerpt: null };
  }

  const cut = text.lastIndexOf(" ", 88);
  const splitAt = cut > 48 ? cut : 88;
  return {
    title: text.slice(0, splitAt).trim(),
    excerpt: text.slice(splitAt).trim(),
  };
}

export function CommunityPostHomeCard({ post }: CommunityPostHomeCardProps) {
  const roleLabel =
    post.user.role === "ADMIN"
      ? "Admin"
      : post.user.major?.trim() || "Member";
  const { title, excerpt } = splitPostContent(post);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-bl-[2rem] rounded-tr-2xl border border-slate-100 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-emerald-100 hover:shadow-md">
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-emerald-50 to-sky-50">
        {post.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            {post.user.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.user.profileImage}
                alt=""
                className="h-20 w-20 rounded-bl-2xl rounded-tr-xl border-4 border-white object-cover shadow-md ring-2 ring-emerald-100"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-bl-2xl rounded-tr-xl border-4 border-white bg-gradient-to-br from-emerald-100 to-sky-100 text-3xl font-bold text-emerald-800 shadow-md ring-2 ring-emerald-100">
                {post.user.name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <span className="inline-flex w-fit rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
          {roleLabel}
        </span>

        <h3 className="mt-3 line-clamp-2 font-[family-name:var(--font-display)] text-base font-bold leading-snug text-slate-900 sm:text-lg">
          {title}
        </h3>

        {excerpt ? (
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">{excerpt}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-2.5 border-t border-slate-100 pt-4">
          {post.user.profileImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={post.user.profileImage}
              alt=""
              className="h-9 w-9 shrink-0 rounded-full border border-slate-100 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-sky-100 text-xs font-bold text-emerald-800">
              {post.user.name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{post.user.name}</p>
            <p className="text-xs text-slate-500">{formatCommunityPostTime(post.createdAt)}</p>
          </div>
        </div>
      </div>
    </article>
  );
}
