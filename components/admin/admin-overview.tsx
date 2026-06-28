"use client";

import {
  AdminCard,
  AdminDonationStatusBadge,
  AdminEmptyState,
  AdminSectionHeader,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/components/admin/admin-ui";
import { DonationTrendChart, MiniDonationBars } from "@/components/admin/admin-charts";
import type { AdminPanel } from "@/components/admin/admin-sidebar";

type OverviewDonation = {
  id: number;
  amount: number;
  status: "PENDING" | "APPROVED";
  paymentType: string;
  createdAt: string;
  user: { name: string; email: string };
};

type AdminOverviewProps = {
  totals: {
    memberCount: number;
    pendingDonationCount: number;
    totalDonations: number;
    totalAmount: number;
    monthlyReport: Array<{
      monthKey: string;
      totalAmount: number;
      donationCount: number;
    }>;
  };
  pendingDonations: OverviewDonation[];
  recentDonations: OverviewDonation[];
  approvingDonationId: number | null;
  onApprove: (id: number) => void;
  onNavigate: (panel: AdminPanel) => void;
};

function MetricPill({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm shadow-sm">
        {icon}
      </span>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</p>
        <p className="text-lg font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}

export function AdminOverview({
  totals,
  pendingDonations,
  recentDonations,
  approvingDonationId,
  onApprove,
  onNavigate,
}: AdminOverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <AdminCard padding="lg" className="min-w-0">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
                Donation Dynamics
              </h2>
              <p className="mt-1 text-sm text-slate-500">Approved donation totals by month</p>
            </div>
            <div className="flex rounded-full border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
              {["6M", "1Y"].map((label) => (
                <span
                  key={label}
                  className={`rounded-full px-3 py-1 ${
                    label === "6M" ? "bg-emerald-600 text-white" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <DonationTrendChart data={totals.monthlyReport} />

          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <MetricPill label="Members" value={totals.memberCount} icon="◉" />
            <MetricPill label="Pending" value={totals.pendingDonationCount} icon="◷" />
            <MetricPill label="Records" value={totals.totalDonations} icon="▤" />
            <MetricPill
              label="Approved Total"
              value={`$${totals.totalAmount.toFixed(0)}`}
              icon="◆"
            />
          </div>
        </AdminCard>

        <div className="flex min-w-0 flex-col gap-6">
          <AdminCard>
            <AdminSectionHeader
              title="Quick Analytics"
              description="Donation activity snapshot"
            />
            <MiniDonationBars data={totals.monthlyReport} />
          </AdminCard>

          <AdminCard className="flex flex-1 flex-col">
            <p className="text-sm font-medium text-slate-500">Total Tracked</p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-slate-900">
              ${totals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="mt-1 text-xs text-slate-400">USD · approved donations only</p>
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-medium text-slate-500">Quick status</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-semibold text-emerald-800">
                  {totals.totalDonations - totals.pendingDonationCount} approved
                </span>
                <span className="rounded-full bg-amber-100 px-2.5 py-1 font-semibold text-amber-800">
                  {totals.pendingDonationCount} pending
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate("monthly")}
              className={`${adminPrimaryBtnClass} mt-auto w-full pt-6`}
            >
              View Monthly Report
            </button>
          </AdminCard>
        </div>
      </section>

      {pendingDonations.length > 0 ? (
        <AdminCard>
          <AdminSectionHeader
            title="Pending Approvals"
            description="Review and approve member donation requests."
            action={
              <button type="button" onClick={() => onNavigate("pendingDonations")} className={adminSecondaryBtnClass}>
                View all
              </button>
            }
          />
          <div className="space-y-2">
            {pendingDonations.slice(0, 4).map((donation) => (
              <div
                key={donation.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 transition hover:border-emerald-200 hover:bg-emerald-50/40"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {donation.user.name}{" "}
                    <span className="text-emerald-700">${donation.amount.toFixed(2)}</span>
                  </p>
                  <p className="text-sm text-slate-500">
                    {donation.paymentType} · {new Date(donation.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onApprove(donation.id)}
                  disabled={approvingDonationId === donation.id}
                  className={adminPrimaryBtnClass}
                >
                  {approvingDonationId === donation.id ? "Approving…" : "Approve"}
                </button>
              </div>
            ))}
          </div>
        </AdminCard>
      ) : null}

      <AdminCard padding="lg">
        <AdminSectionHeader
          title="Recent Donations"
          description="Latest activity across all donation records."
          action={
            <button type="button" onClick={() => onNavigate("donationManagement")} className={adminSecondaryBtnClass}>
              Manage all
            </button>
          }
        />
        {recentDonations.length === 0 ? (
          <AdminEmptyState message="No donations recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-400">
                  <th className="pb-3 pr-4 font-semibold">Member</th>
                  <th className="pb-3 pr-4 font-semibold">Amount</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 pr-4 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">ID</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.slice(0, 8).map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-emerald-50/30"
                  >
                    <td className="py-3.5 pr-4">
                      <p className="font-medium text-slate-900">{row.user.name}</p>
                      <p className="text-xs text-slate-400">{row.user.email}</p>
                    </td>
                    <td className="py-3.5 pr-4 font-semibold text-emerald-700">
                      ${row.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600">
                      {new Date(row.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 pr-4">
                      <AdminDonationStatusBadge status={row.status} />
                    </td>
                    <td className="py-3.5 font-mono text-xs text-slate-400">#{row.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>
    </div>
  );
}
