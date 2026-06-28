"use client";

import type { DashboardDonationItem } from "@/components/dashboard-donation-history";
import {
  AdminCard,
  AdminDonationStatusBadge,
  AdminEmptyState,
  AdminSectionHeader,
  AdminStatCard,
  adminPrimaryBtnClass,
  adminSecondaryBtnClass,
} from "@/components/admin/admin-ui";
import type { DashboardPanel } from "@/components/dashboard/dashboard-sidebar";

type DashboardOverviewProps = {
  total: number;
  donationCount: number;
  average: number;
  pendingCount: number;
  trendData: Array<{ id: number; amount: number }>;
  trendMax: number;
  recentDonations: DashboardDonationItem[];
  onNavigate: (panel: DashboardPanel) => void;
};

export function DashboardOverview({
  total,
  donationCount,
  average,
  pendingCount,
  trendData,
  trendMax,
  recentDonations,
  onNavigate,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Total Donations"
          value={`$${total.toFixed(2)}`}
          hint="All approved contributions"
          variant="emerald"
        />
        <AdminStatCard
          label="Donation Count"
          value={donationCount}
          hint="Approved records"
          variant="sky"
        />
        <AdminStatCard
          label="Average Gift"
          value={`$${average.toFixed(2)}`}
          hint="Per approved donation"
          variant="slate"
        />
        <AdminStatCard
          label="Pending Requests"
          value={pendingCount}
          hint="Waiting for admin review"
          variant="amber"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <AdminCard padding="lg">
          <AdminSectionHeader
            title="Your Giving Trend"
            description="Amounts from your latest approved donations"
          />
          <div className="flex h-44 items-end gap-2 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4">
            {trendData.length === 0 ? (
              <p className="w-full text-center text-sm text-slate-500">No trend data yet.</p>
            ) : (
              trendData.map((donation) => (
                <div key={donation.id} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full max-w-[2.5rem] rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition hover:opacity-90"
                    style={{ height: `${Math.max(14, (donation.amount / trendMax) * 100)}%` }}
                    title={`$${donation.amount.toFixed(2)}`}
                  />
                  <span className="text-[10px] font-medium text-slate-400">
                    ${donation.amount >= 1000 ? `${(donation.amount / 1000).toFixed(1)}k` : donation.amount.toFixed(0)}
                  </span>
                </div>
              ))
            )}
          </div>
        </AdminCard>

        <AdminCard className="flex flex-col">
          <p className="text-sm font-medium text-slate-500">Your impact</p>
          <p className="mt-2 font-[family-name:var(--font-display)] text-4xl font-bold text-slate-900">
            ${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="mt-1 text-xs text-slate-400">Total approved giving</p>
          {pendingCount > 0 ? (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              {pendingCount} request{pendingCount === 1 ? "" : "s"} awaiting approval.
            </div>
          ) : null}
          <button type="button" onClick={() => onNavigate("donate")} className={`${adminPrimaryBtnClass} mt-auto w-full pt-6`}>
            Submit New Donation
          </button>
        </AdminCard>
      </section>

      <AdminCard padding="lg">
        <AdminSectionHeader
          title="Recent Activity"
          description="Your latest donation records and requests."
          action={
            <button type="button" onClick={() => onNavigate("history")} className={adminSecondaryBtnClass}>
              View all
            </button>
          }
        />
        {recentDonations.length === 0 ? (
          <AdminEmptyState message="No donations yet. Submit your first gift to get started." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-left text-slate-400">
                  <th className="pb-3 pr-4 font-semibold">Amount</th>
                  <th className="pb-3 pr-4 font-semibold">Payment</th>
                  <th className="pb-3 pr-4 font-semibold">Date</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentDonations.slice(0, 6).map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition last:border-0 hover:bg-emerald-50/30"
                  >
                    <td className="py-3.5 pr-4 font-semibold text-emerald-700">
                      ${row.amount.toFixed(2)}
                    </td>
                    <td className="py-3.5 pr-4 text-slate-600">{row.paymentType}</td>
                    <td className="py-3.5 pr-4 text-slate-600">
                      {new Date(row.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5">
                      <AdminDonationStatusBadge status={row.status} />
                    </td>
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
