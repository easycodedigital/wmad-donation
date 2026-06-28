"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { CommunityPostCard } from "@/components/community-post-card";
import type { CommunityPostItem } from "@/components/community-posts-types";
import { FlashBanner } from "@/components/flash-banner";

const MAX_CONTENT = 2000;

type CommunityPostsPanelProps = {
  initialPosts: CommunityPostItem[];
  currentUser: {
    id: number;
    name: string;
    profileImage: string | null;
    role: "ADMIN" | "MEMBER";
  };
  embedded?: boolean;
  ownPostsOnly?: boolean;
  title?: string;
  description?: string;
};

type PostSheetState = { mode: "edit"; id: number } | { mode: "delete"; id: number } | null;

export function CommunityPostsPanel({
  initialPosts,
  currentUser,
  embedded = false,
  ownPostsOnly = false,
  title = "Community posts",
  description = "Share updates, photos, and news with members and visitors—like a community feed.",
}: CommunityPostsPanelProps) {
  const router = useRouter();

  const filterPosts = (items: CommunityPostItem[]) =>
    ownPostsOnly ? items.filter((p) => p.user.id === currentUser.id) : items;

  const [posts, setPosts] = useState(() => filterPosts(initialPosts));
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sheet, setSheet] = useState<PostSheetState>(null);
  const [sheetEntered, setSheetEntered] = useState(false);
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetError, setSheetError] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const sheetOpen = sheet !== null;
  const activePost = sheet ? posts.find((p) => p.id === sheet.id) ?? null : null;
  const isAdmin = currentUser.role === "ADMIN";
  const ownPosts = useMemo(
    () => (ownPostsOnly ? posts.filter((p) => p.user.id === currentUser.id) : posts),
    [posts, ownPostsOnly, currentUser.id],
  );

  const openSheet = (next: PostSheetState) => {
    setSheet(next);
    setSheetEntered(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setSheetEntered(true));
    });
  };

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError("");
    const formData = new FormData();
    formData.set("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Could not upload image.");
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  };

  const handleImagePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setImageUrl(url);
  };

  const handleEditImagePick = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    const url = await uploadImage(file);
    if (url) setEditImageUrl(url);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const trimmed = content.trim();
    const photo = imageUrl.trim() || null;
    if (!trimmed && !photo) {
      setError("Write something or add a photo before posting.");
      return;
    }

    setSubmitting(true);
    const res = await fetch("/api/community-posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed, imageUrl: photo }),
    });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Could not publish post.");
      return;
    }

    const created = (await res.json()) as CommunityPostItem;
    if (!ownPostsOnly || created.user.id === currentUser.id) {
      setPosts((prev) => filterPosts([created, ...prev]).slice(0, 48));
    }
    setContent("");
    setImageUrl("");
    setMessage("Post published to the community feed and home page.");
    router.refresh();
  };

  const startEdit = (post: CommunityPostItem) => {
    setSheetError("");
    setEditContent(post.content);
    setEditImageUrl(post.imageUrl ?? "");
    openSheet({ mode: "edit", id: post.id });
  };

  const startDelete = (post: CommunityPostItem) => {
    setSheetError("");
    openSheet({ mode: "delete", id: post.id });
  };

  const closeSheet = () => {
    if (sheetBusy) return;
    setSheetEntered(false);
    setSheet(null);
    setSheetError("");
  };

  const saveEdit = async () => {
    if (sheet?.mode !== "edit") return;
    const trimmed = editContent.trim();
    const photo = editImageUrl.trim() || null;
    if (!trimmed && !photo) {
      setSheetError("A post needs text or a photo.");
      return;
    }

    setSheetBusy(true);
    const res = await fetch(`/api/community-posts/${sheet.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: trimmed, imageUrl: photo }),
    });
    setSheetBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSheetError(data?.error ?? "Could not update post.");
      return;
    }

    const updated = (await res.json()) as CommunityPostItem;
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setSheet(null);
    setMessage("Post updated.");
    router.refresh();
  };

  const confirmDelete = async () => {
    if (sheet?.mode !== "delete") return;

    setSheetBusy(true);
    const res = await fetch(`/api/community-posts/${sheet.id}`, { method: "DELETE" });
    setSheetBusy(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSheetError(data?.error ?? "Could not delete post.");
      return;
    }

    setPosts((prev) => prev.filter((p) => p.id !== sheet.id));
    setSheet(null);
    setMessage("Post removed.");
    router.refresh();
  };

  const rootClass = embedded ? "" : "mx-auto w-full max-w-7xl px-6 pb-6";
  const cardClass = embedded
    ? "rounded-[1.25rem] border border-slate-200/70 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"
    : "rounded-bl-[2.75rem] rounded-tr-2xl border border-slate-200 bg-white p-6 shadow-sm";

  return (
    <section className={rootClass}>
      <article className={cardClass}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
          Community
        </p>
        <h2 className="mt-2 text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>

        {message ? (
          <FlashBanner variant="success" onDismiss={() => setMessage("")} className="mt-4 rounded-xl">
            {message}
          </FlashBanner>
        ) : null}
        {error ? (
          <FlashBanner variant="error" onDismiss={() => setError("")} className="mt-4 rounded-xl">
            {error}
          </FlashBanner>
        ) : null}

        <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
          <div className="flex items-start gap-3">
            {currentUser.profileImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={currentUser.profileImage}
                alt=""
                className="h-11 w-11 shrink-0 rounded-bl-xl rounded-tr-lg border border-white object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-bl-xl rounded-tr-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white">
                {currentUser.name.slice(0, 1).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <label htmlFor="community-post-content" className="sr-only">
                Write a post
              </label>
              <textarea
                id="community-post-content"
                value={content}
                onChange={(e) => setContent(e.target.value.slice(0, MAX_CONTENT))}
                rows={3}
                placeholder="What's on your mind?"
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                <span>
                  {content.length}/{MAX_CONTENT}
                </span>
                <span className="text-slate-400">Visible on the public home page</span>
              </div>
              {imageUrl ? (
                <div className="relative mt-3 inline-block max-w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="max-h-48 rounded-bl-xl rounded-tr-lg border border-slate-200 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl("")}
                    className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white"
                  >
                    Remove
                  </button>
                </div>
              ) : null}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-slate-600 transition hover:text-emerald-700">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="sr-only"
                    disabled={uploading}
                    onChange={handleImagePick}
                  />
                  {uploading ? "Uploading…" : "Add photo"}
                </label>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="rounded-bl-xl rounded-tr-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 disabled:opacity-60"
                >
                  {submitting ? "Posting…" : "Post"}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="mt-8 border-t border-slate-100 pt-6">
          <h3 className="text-sm font-semibold text-slate-900">
            {ownPostsOnly ? "Your posts" : "Community feed"}
          </h3>
          {ownPostsOnly ? (
            <p className="mt-0.5 text-xs text-slate-500">
              Only your posts — they also appear on the public home page community section.
            </p>
          ) : null}
          {ownPosts.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
              {ownPostsOnly
                ? "You have not posted yet. Share an update above to appear on the home page."
                : "No posts yet. Be the first to share something with the community."}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {ownPosts.map((post) => {
                const isOwn = post.user.id === currentUser.id;
                const canEdit = isOwn || isAdmin;
                const canDelete = isOwn || isAdmin;
                return (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    actionsDisabled={sheetBusy}
                    onEdit={() => startEdit(post)}
                    onDelete={() => startDelete(post)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </article>

      {sheetOpen && sheet && activePost ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby={sheet.mode === "delete" ? "delete-post-sheet-title" : "edit-post-sheet-title"}
        >
          <button
            type="button"
            className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
              sheetEntered ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeSheet}
            aria-label="Close panel"
          />
          <div
            className={`relative max-h-[min(90dvh,560px)] w-full overflow-y-auto rounded-t-[1.75rem] border border-slate-200 border-b-0 bg-white px-5 pb-8 pt-3 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
              sheetEntered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-slate-200" />
            {sheet.mode === "edit" ? (
              <>
                <h3 id="edit-post-sheet-title" className="text-lg font-semibold text-slate-900">
                  Edit your post
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Update your message or photo before it goes live on the home page.
                </p>
                {sheetError ? (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {sheetError}
                  </p>
                ) : null}
                <div className="mt-4 grid gap-3">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value.slice(0, MAX_CONTENT))}
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  />
                  <p className="text-xs text-slate-500">
                    {editContent.length}/{MAX_CONTENT}
                  </p>
                  {editImageUrl ? (
                    <div className="relative inline-block max-w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={editImageUrl}
                        alt=""
                        className="max-h-40 rounded-bl-xl rounded-tr-lg border border-slate-200 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setEditImageUrl("")}
                        className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-emerald-700">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="sr-only"
                        disabled={uploading}
                        onChange={handleEditImagePick}
                      />
                      Add photo
                    </label>
                  )}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      disabled={sheetBusy}
                      onClick={saveEdit}
                      className="rounded-bl-xl rounded-tr-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {sheetBusy ? "Saving…" : "Save changes"}
                    </button>
                    <button
                      type="button"
                      disabled={sheetBusy}
                      onClick={closeSheet}
                      className="rounded-bl-xl rounded-tr-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h3 id="delete-post-sheet-title" className="text-lg font-semibold text-slate-900">
                  Delete your post?
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  This removes your post from the dashboard and public home page.
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                  {activePost.content.trim() || "Photo post"}
                </div>
                {sheetError ? (
                  <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    {sheetError}
                  </p>
                ) : null}
                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={sheetBusy}
                    onClick={confirmDelete}
                    className="rounded-bl-xl rounded-tr-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50"
                  >
                    {sheetBusy ? "Deleting…" : "Delete post"}
                  </button>
                  <button
                    type="button"
                    disabled={sheetBusy}
                    onClick={closeSheet}
                    className="rounded-bl-xl rounded-tr-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}
