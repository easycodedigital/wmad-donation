"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  adminInputClass,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/components/admin/admin-ui";
import { FlashBanner } from "@/components/flash-banner";
import { runBottomSheetEnter } from "@/lib/bottom-sheet";

type Props = {
  initialName: string;
  initialEmail?: string;
  initialMajor: string | null;
  initialProfileImage: string | null;
  embedded?: boolean;
  description?: string;
};

function ProfileAvatar({
  profileImage,
  name,
  size = "md",
}: {
  profileImage: string;
  name: string;
  size?: "md" | "lg";
}) {
  const sizeClass = size === "lg" ? "h-28 w-28 text-2xl" : "h-20 w-20 text-lg";

  if (profileImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profileImage}
        alt="Profile"
        className={`${sizeClass} rounded-bl-[2rem] rounded-tr-xl border border-slate-200 object-cover shadow-sm`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} items-center justify-center rounded-bl-[2rem] rounded-tr-xl border border-dashed border-slate-300 bg-slate-50 font-semibold text-slate-500`}
    >
      {name.trim() ? name.trim().slice(0, 1).toUpperCase() : "?"}
    </div>
  );
}

export function DashboardProfileSection({
  initialName,
  initialEmail = "",
  initialMajor,
  initialProfileImage,
  embedded = false,
  description = "Update how your name, major, and photo appear on donations and the cheer wall.",
}: Props) {
  const router = useRouter();
  const [profileSheetOpen, setProfileSheetOpen] = useState(false);
  const [profileSheetEntered, setProfileSheetEntered] = useState(false);
  const [name, setName] = useState(initialName);
  const [major, setMajor] = useState(initialMajor ?? "");
  const [profileImage, setProfileImage] = useState(initialProfileImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [uploadNotice, setUploadNotice] = useState("");

  useEffect(() => {
    if (!profileSheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [profileSheetOpen]);

  const openProfileSheet = () => {
    setError("");
    setMessage("");
    setUploadNotice("");
    setName(initialName);
    setMajor(initialMajor ?? "");
    setProfileImage(initialProfileImage ?? "");
    setProfileSheetOpen(true);
    runBottomSheetEnter(setProfileSheetEntered);
  };

  const closeProfileSheet = () => {
    if (saving || uploading) return;
    setProfileSheetEntered(false);
    setProfileSheetOpen(false);
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setMessage("");
    setUploadNotice("");
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploading(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Upload failed.");
      return;
    }

    const data = await res.json();
    setProfileImage(data.url);
    setUploadNotice("Photo uploaded — tap Save profile to keep it.");

    const saveRes = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim() || initialName,
        major: major.trim() || null,
        profileImage: data.url,
      }),
    });

    if (saveRes.ok) {
      const updated = await saveRes.json();
      if (typeof updated?.name === "string") {
        setName(updated.name);
      }
      setUploadNotice("Photo uploaded and saved to your profile.");
      setMessage("Profile photo updated.");
      router.refresh();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setUploadNotice("");
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);

    const res = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        major: major.trim() || null,
        profileImage: profileImage.trim() || null,
      }),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? "Could not save profile.");
      return;
    }

    const updated = await res.json();
    if (typeof updated?.name === "string") {
      setName(updated.name);
    }
    setMessage("Profile saved.");
    setProfileSheetOpen(false);
    router.refresh();
  };

  const profileForm = (
    <form className="grid gap-5" onSubmit={handleSave}>
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 text-center lg:items-start lg:text-left">
          <ProfileAvatar profileImage={profileImage} name={name} size="lg" />
          <div className="w-full">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Profile photo
            </p>
            <label className="mt-2 block">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading || saving}
                className={`${adminInputClass} text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-800`}
              />
            </label>
            {uploading ? <p className="mt-2 text-xs text-slate-500">Uploading…</p> : null}
            {uploadNotice ? (
              <p className="mt-2 text-xs text-emerald-700">{uploadNotice}</p>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Display name
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your display name"
              disabled={saving}
              autoComplete="name"
              className={adminInputClass}
            />
          </label>

          {initialEmail ? (
            <label className="grid gap-1.5 sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Email
              </span>
              <input
                type="email"
                value={initialEmail}
                disabled
                className={`${adminInputClass} cursor-not-allowed bg-slate-50 text-slate-500`}
              />
              <span className="text-xs text-slate-400">Email cannot be changed here.</span>
            </label>
          ) : null}

          <label className="grid gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Major
            </span>
            <input
              type="text"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g. Computer Science"
              disabled={saving}
              className={adminInputClass}
            />
          </label>

          <label className="grid gap-1.5 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Profile photo URL
            </span>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              placeholder="https://... or /uploads/..."
              disabled={saving}
              className={adminInputClass}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        <button type="submit" disabled={saving || uploading} className={adminPrimaryBtnClass}>
          {saving ? "Saving…" : "Save profile"}
        </button>
        <button
          type="button"
          disabled={saving || uploading}
          onClick={() => {
            setName(initialName);
            setMajor(initialMajor ?? "");
            setProfileImage(initialProfileImage ?? "");
            setError("");
            setMessage("");
            setUploadNotice("");
          }}
          className={adminSecondaryBtnClass}
        >
          Reset changes
        </button>
      </div>
    </form>
  );

  const rootClass = embedded ? "" : "mx-auto w-full max-w-7xl px-6 pb-6";
  const cardClass = embedded
    ? "rounded-[1.25rem] border border-slate-200/70 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] lg:p-8"
    : "rounded-bl-[2.75rem] rounded-tr-2xl border border-slate-200 bg-white p-5 shadow-sm";

  if (embedded) {
    return (
      <section className={rootClass}>
        <div className={cardClass}>
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-600">
              My profile
            </p>
            <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900">
              Account details
            </h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>

          {message ? (
            <FlashBanner variant="success" onDismiss={() => setMessage("")} className="mb-4 rounded-xl">
              {message}
            </FlashBanner>
          ) : null}
          {error ? (
            <FlashBanner variant="error" onDismiss={() => setError("")} className="mb-4 rounded-xl">
              {error}
            </FlashBanner>
          ) : null}

          {profileForm}
        </div>
      </section>
    );
  }

  return (
    <section className={rootClass}>
      <div className={cardClass}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <ProfileAvatar profileImage={profileImage} name={name} />
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{name.trim() || "Your name"}</h2>
              <p className="text-sm text-slate-500">Your profile</p>
            </div>
          </div>

          <button
            type="button"
            onClick={openProfileSheet}
            className={adminSecondaryBtnClass}
          >
            Edit profile
          </button>
        </div>

        {!profileSheetOpen && error ? (
          <FlashBanner variant="error" onDismiss={() => setError("")} className="mt-3 rounded-lg">
            {error}
          </FlashBanner>
        ) : null}
        {!profileSheetOpen && message ? (
          <FlashBanner variant="success" onDismiss={() => setMessage("")} className="mt-3 rounded-lg">
            {message}
          </FlashBanner>
        ) : null}
      </div>

      {profileSheetOpen ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col justify-end"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-edit-sheet-title"
        >
          <button
            type="button"
            className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${
              profileSheetEntered ? "opacity-100" : "opacity-0"
            }`}
            onClick={closeProfileSheet}
            aria-label="Close panel"
          />
          <div
            className={`relative max-h-[min(90dvh,720px)] w-full overflow-y-auto rounded-t-[1.75rem] border border-slate-200 border-b-0 bg-white px-5 pb-8 pt-3 shadow-[0_-8px_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${
              profileSheetEntered ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="mx-auto mb-4 h-1.5 w-10 shrink-0 rounded-full bg-slate-200" />
            <h3 id="profile-edit-sheet-title" className="text-lg font-semibold text-slate-900">
              Edit profile
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Update your name, major, profile photo URL, or upload a new image.
            </p>

            {uploadNotice ? (
              <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                {uploadNotice}
              </p>
            ) : null}
            {error ? (
              <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-4">{profileForm}</div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
