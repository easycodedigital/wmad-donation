"use client";

import Link from "next/link";
import { CommunityPostHomeCard } from "@/components/community-post-home-card";
import type { CommunityPostItem } from "@/components/community-posts-types";
import { useTranslation } from "@/components/language-provider";

type HomeCommunityPostsSectionProps = {
  posts: CommunityPostItem[];
};

export function HomeCommunityPostsSection({ posts }: HomeCommunityPostsSectionProps) {
  const t = useTranslation();
  const visible = posts.slice(0, 9);

  return (
    <section
      id="community-posts"
      className="scroll-mt-24 w-full max-w-full overflow-x-hidden border-t border-neutral-100 bg-white px-4 py-16 md:px-6 md:py-20"
    >
      <div className="mx-auto w-full min-w-0 max-w-6xl">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">
            {t.communityPosts.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-bold text-neutral-900 md:text-4xl">
            {t.communityPosts.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-600">{t.communityPosts.description}</p>
        </div>

        {visible.length === 0 ? (
          <p className="mt-12 text-center text-sm text-neutral-500">{t.communityPosts.empty}</p>
        ) : (
          <ul className="mt-12 grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((post) => (
              <li key={post.id} className="min-w-0">
                <CommunityPostHomeCard post={post} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center text-sm text-neutral-500">
          {t.communityPosts.cta}{" "}
          <Link href="/login" className="font-semibold text-emerald-700 underline hover:text-emerald-800">
            {t.communityPosts.loginLink}
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
