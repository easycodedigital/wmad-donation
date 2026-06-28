"use client";

import Link from "next/link";
import { useState } from "react";
import { BackToHomeLink } from "@/components/back-to-home-link";
import { FlashBanner } from "@/components/flash-banner";
import { useTranslation } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function RegisterPage() {
  const t = useTranslation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [major, setMajor] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState("");
  const [imageHint, setImageHint] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    setUploadingImage(true);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    setUploadingImage(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data?.error ?? t.auth.register.imageUploadError);
      return;
    }

    const data = await res.json();
    setProfileImageUrl(data.url);
    setImageHint(t.auth.register.imageSaved);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setImageHint("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim(),
        password,
        major: major.trim() || null,
        profileImage: profileImageUrl.trim() || null,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data?.error ?? t.auth.register.error);
      return;
    }

    if (data?.user?.role === "ADMIN") {
      window.location.href = "/admin";
      return;
    }
    window.location.href = "/dashboard";
  };

  return (
    <main className="relative flex min-h-screen w-full max-w-full items-center justify-center overflow-x-hidden bg-white px-6 py-10">
      <div className="absolute right-4 top-4 z-10 md:right-6 md:top-6">
        <LanguageSwitcher scrolled />
      </div>
      <div className="w-full max-w-md rounded-bl-[2.75rem] rounded-tr-2xl border border-neutral-100 bg-white p-6 shadow-sm">
        <div className="mb-5">
          <BackToHomeLink variant="text" />
        </div>
        <p className="text-sm font-medium text-emerald-700">{t.auth.register.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{t.auth.register.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.auth.register.description}</p>

        <form className="mt-5 space-y-3" onSubmit={handleRegister}>
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="text"
            placeholder={t.auth.register.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="email"
            placeholder={t.auth.register.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="password"
            placeholder={t.auth.register.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            minLength={6}
          />
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="text"
            placeholder={t.auth.register.major}
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            autoComplete="organization-title"
          />
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="text"
            placeholder={t.auth.register.profileUrl}
            value={profileImageUrl}
            onChange={(e) => setProfileImageUrl(e.target.value)}
          />
          <div className="space-y-1">
            <label className="block text-sm text-gray-600">{t.auth.register.uploadLabel}</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-emerald-800"
            />
            {uploadingImage ? (
              <p className="text-xs text-gray-500">{t.auth.register.uploading}</p>
            ) : null}
            {imageHint ? (
              <p className="text-xs font-medium text-emerald-700">{imageHint}</p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full rounded-bl-xl rounded-tr-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
            disabled={loading}
          >
            {loading ? t.auth.register.submitting : t.auth.register.submit}
          </button>
        </form>

        {error ? (
          <FlashBanner
            variant="error"
            onDismiss={() => setError("")}
            className="mt-3 rounded-lg"
          >
            {error}
          </FlashBanner>
        ) : null}
        <p className="mt-4 text-center text-sm text-neutral-600">
          {t.auth.register.hasAccount}{" "}
          <Link
            href="/login"
            className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            {t.auth.register.login}
          </Link>
        </p>
      </div>
    </main>
  );
}
