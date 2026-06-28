"use client";

import Link from "next/link";
import { useState } from "react";
import { BackToHomeLink } from "@/components/back-to-home-link";
import { FlashBanner } from "@/components/flash-banner";
import { useTranslation } from "@/components/language-provider";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function LoginPage() {
  const t = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data?.error ?? t.auth.login.error);
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
        <p className="text-sm font-medium text-emerald-700">{t.auth.login.eyebrow}</p>
        <h1 className="mt-1 text-2xl font-bold text-gray-900">{t.auth.login.title}</h1>
        <p className="mt-1 text-sm text-gray-500">{t.auth.login.description}</p>

        <div className="mt-5 space-y-3">
          <input
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 outline-none ring-0 focus:border-gray-900"
            type="email"
            placeholder={t.auth.login.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-neutral-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
            type="password"
            placeholder={t.auth.login.password}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            className="w-full rounded-bl-xl rounded-tr-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-700 disabled:opacity-60"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? t.auth.login.submitting : t.auth.login.submit}
          </button>
        </div>

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
          {t.auth.login.newDonor}{" "}
          <Link
            href="/register"
            className="font-semibold text-emerald-700 underline-offset-2 hover:underline"
          >
            {t.auth.login.register}
          </Link>
        </p>
      </div>
    </main>
  );
}
