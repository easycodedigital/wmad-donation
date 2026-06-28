"use client";

import {
  formatCommunityPostTime,
  type CommunityPostItem,
} from "@/components/community-posts-types";

const actionEditClass =
  "rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50";
const actionDeleteClass =
  "rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50";

type CommunityPostCardProps = {
  post: CommunityPostItem;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  actionsDisabled?: boolean;
};

export function CommunityPostCard({
  post,
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  actionsDisabled = false,
}: CommunityPostCardProps) {
  const roleLabel =
    post.user.role === "ADMIN"
      ? "Admin"
      : post.user.major?.trim() || "Member";
  const metaLine = `${roleLabel} · ${formatCommunityPostTime(post.createdAt)}`;

  return (
    <article className="rounded-bl-[2rem] rounded-tr-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start gap-3">
        {post.user.profileImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.user.profileImage}
            alt=""
            className="h-11 w-11 shrink-0 rounded-bl-xl rounded-tr-lg border border-slate-100 object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-bl-xl rounded-tr-lg bg-gradient-to-br from-emerald-100 to-sky-100 text-sm font-bold text-emerald-800">
            {post.user.name.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-slate-900">{post.user.name}</p>
              <p className="text-xs text-slate-500">{metaLine}</p>
            </div>
            {canEdit || canDelete ? (
              <div className="flex shrink-0 gap-2">
                {canEdit ? (
                  <button
                    type="button"
                    onClick={onEdit}
                    disabled={actionsDisabled}
                    className={actionEditClass}
                  >
                    Edit
                  </button>
                ) : null}
                {canDelete ? (
                  <button
                    type="button"
                    onClick={onDelete}
                    disabled={actionsDisabled}
                    className={actionDeleteClass}
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>

          {post.content ? (
            <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-relaxed text-slate-900">
              {post.content}
            </p>
          ) : null}

          {post.imageUrl ? (
            <div className="mt-3 overflow-hidden rounded-bl-[1.5rem] rounded-tr-xl border border-slate-100 bg-slate-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.imageUrl}
                alt=""
                className="max-h-96 w-full object-cover"
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}
