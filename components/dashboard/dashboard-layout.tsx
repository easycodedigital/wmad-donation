"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  IconHome,
  IconLogout,
  IconMenu,
  IconPlus,
  IconPost,
  IconRefresh,
  IconTable,
  IconUsers,
} from "@/components/admin/admin-icons";
import { LogoutButton } from "@/components/logout-button";
import type { DashboardPanel } from "@/components/dashboard/dashboard-sidebar";

type NavItem = {
  id: DashboardPanel;
  label: string;
  icon: ReactNode;
  badgeKey?: "pending";
};

const MENU_ITEMS: NavItem[] = [
  { id: "overview", label: "Overview", icon: <IconHome className="h-[18px] w-[18px]" /> },
  { id: "donate", label: "Submit Donation", icon: <IconPlus className="h-[18px] w-[18px]" /> },
  {
    id: "history",
    label: "Donation History",
    icon: <IconTable className="h-[18px] w-[18px]" />,
    badgeKey: "pending",
  },
  { id: "profile", label: "My Profile", icon: <IconUsers className="h-[18px] w-[18px]" /> },
];

const COMMUNITY_ITEMS: NavItem[] = [
  { id: "posts", label: "Posts", icon: <IconPost className="h-[18px] w-[18px]" /> },
  { id: "cheerWall", label: "Cheer Wall", icon: <IconRefresh className="h-[18px] w-[18px]" /> },
];

type DashboardLayoutProps = {
  userName: string;
  userEmail: string;
  profileImage: string | null;
  activePanel: DashboardPanel;
  onPanelChange: (panel: DashboardPanel) => void;
  pendingDonationCount: number;
  children: ReactNode;
};

function NavButton({
  item,
  active,
  badge,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  badge: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between gap-2 rounded-bl-xl rounded-tr-lg px-3 py-2.5 text-left text-sm font-medium transition duration-200 ${
        active
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
          : "text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-800"
      }`}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
            active ? "bg-white/15 text-white" : "bg-slate-100 text-slate-500"
          }`}
        >
          {item.icon}
        </span>
        <span className="truncate">{item.label}</span>
      </span>
      {badge > 0 ? (
        <span
          className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
            active ? "bg-white/20 text-white" : "bg-amber-100 text-amber-800"
          }`}
        >
          {badge}
        </span>
      ) : null}
    </button>
  );
}

export function DashboardLayout({
  userName,
  userEmail,
  profileImage,
  activePanel,
  onPanelChange,
  pendingDonationCount,
  children,
}: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [activePanel]);

  const badges = { pending: pendingDonationCount };

  const sidebarInner = (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <Link
        href="/"
        className="flex items-center gap-3 px-2 py-1 transition hover:opacity-90"
        onClick={() => setMobileOpen(false)}
      >
        <Image src="/logo-mobile.png" alt="" width={36} height={36} className="h-9 w-9 object-contain" />
        <div>
          <p className="font-[family-name:var(--font-display)] text-base font-bold text-slate-900">
            WMAD Donate
          </p>
          <p className="text-[11px] font-medium text-emerald-600">Donor Portal</p>
        </div>
      </Link>

      <div className="mt-8 flex-1 space-y-6">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Menu
          </p>
          <nav className="space-y-1">
            {MENU_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activePanel === item.id}
                badge={item.badgeKey ? badges[item.badgeKey] : 0}
                onClick={() => {
                  onPanelChange(item.id);
                  setMobileOpen(false);
                }}
              />
            ))}
          </nav>
        </div>

        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
            Community
          </p>
          <nav className="space-y-1">
            {COMMUNITY_ITEMS.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                active={activePanel === item.id}
                badge={0}
                onClick={() => {
                  onPanelChange(item.id);
                  setMobileOpen(false);
                }}
              />
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-6 border-t border-slate-200/80 pt-4">
        <LogoutButton />
        <Link
          href="/"
          className="mt-2 flex w-full items-center gap-3 rounded-bl-xl rounded-tr-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
            <IconLogout className="h-[18px] w-[18px]" />
          </span>
          Back to site
        </Link>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f6f8]">
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close menu"
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-[260px] shrink-0 flex-col overflow-hidden border-r border-slate-200/80 bg-white px-4 py-5 shadow-xl transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 lg:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {sidebarInner}
      </aside>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header className="z-30 shrink-0 border-b border-slate-200/80 bg-white px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <button
                type="button"
                className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <IconMenu />
              </button>
              <div className="min-w-0">
                <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold text-slate-900 sm:text-3xl">
                  Hello, {userName.split(" ")[0]}
                </h1>
                <p className="mt-1 truncate text-sm text-slate-500">{userEmail}</p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {pendingDonationCount > 0 ? (
                <button
                  type="button"
                  onClick={() => onPanelChange("history")}
                  className="hidden rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 sm:inline-flex"
                >
                  {pendingDonationCount} pending
                </button>
              ) : null}
              <button
                type="button"
                onClick={() => onPanelChange("donate")}
                className="hidden items-center gap-1.5 rounded-bl-xl rounded-tr-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 sm:inline-flex"
              >
                <IconPlus className="h-4 w-4" />
                Donate
              </button>
              {profileImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profileImage}
                  alt=""
                  className="h-10 w-10 rounded-full border border-slate-200 object-cover ring-2 ring-emerald-100"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-sm font-bold text-white shadow-md shadow-emerald-500/30">
                  {userName.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </header>

        <main
          ref={mainRef}
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
