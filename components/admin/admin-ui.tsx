import type { ReactNode } from "react";

export const adminInputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20";

export const adminSelectClass = adminInputClass;

export const adminTextareaClass = `${adminInputClass} min-h-[6rem] resize-y`;

export const adminPrimaryBtnClass =
  "inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-600/30 disabled:cursor-not-allowed disabled:opacity-60";

export const adminSecondaryBtnClass =
  "inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60";

export const adminDangerBtnClass =
  "inline-flex items-center justify-center rounded-bl-xl rounded-tr-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60";

export const adminGhostActionClass =
  "rounded-lg border px-2.5 py-1 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

type AdminCardProps = {
  children: ReactNode;
  className?: string;
  padding?: "sm" | "md" | "lg";
};

export function AdminCard({ children, className = "", padding = "md" }: AdminCardProps) {
  const paddingClass =
    padding === "sm" ? "p-4" : padding === "lg" ? "p-7" : "p-6";

  return (
    <article
      className={`rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)] ${paddingClass} ${className}`.trim()}
    >
      {children}
    </article>
  );
}

type AdminSectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function AdminSectionHeader({ title, description, action }: AdminSectionHeaderProps) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="font-[family-name:var(--font-display)] text-xl font-bold text-slate-900">
          {title}
        </h2>
        {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

type AdminStatCardProps = {
  label: string;
  value: string | number;
  hint: string;
  variant?: "emerald" | "amber" | "sky" | "slate";
};

const statVariants = {
  emerald: {
    card: "border-emerald-200/80 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/25",
    label: "text-emerald-100",
    hint: "text-emerald-100/90",
    icon: "bg-white/15 text-white",
  },
  amber: {
    card: "border-amber-200/80 bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900",
    label: "text-amber-700",
    hint: "text-slate-500",
    icon: "bg-amber-100 text-amber-700",
  },
  sky: {
    card: "border-sky-200/80 bg-gradient-to-br from-sky-50 to-white text-slate-900",
    label: "text-sky-700",
    hint: "text-slate-500",
    icon: "bg-sky-100 text-sky-700",
  },
  slate: {
    card: "border-slate-200/80 bg-gradient-to-br from-white to-slate-50 text-slate-900",
    label: "text-slate-500",
    hint: "text-slate-500",
    icon: "bg-slate-100 text-slate-600",
  },
} as const;

const statIcons = {
  emerald: "◆",
  amber: "◷",
  sky: "◎",
  slate: "▣",
} as const;

export function AdminStatCard({
  label,
  value,
  hint,
  variant = "slate",
}: AdminStatCardProps) {
  const styles = statVariants[variant];

  return (
    <article
      className={`group relative overflow-hidden rounded-bl-[2rem] rounded-tr-2xl border p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${styles.card}`}
    >
      <div
        className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-bl-xl rounded-tr-lg text-sm ${styles.icon}`}
        aria-hidden
      >
        {statIcons[variant]}
      </div>
      <p className={`text-sm font-medium ${styles.label}`}>{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
      <p className={`mt-2 text-xs ${styles.hint}`}>{hint}</p>
    </article>
  );
}

type AdminPanelProps = {
  show: boolean;
  children: ReactNode;
  className?: string;
};

export function AdminPanelSection({ show, children, className = "" }: AdminPanelProps) {
  if (!show) return null;

  return (
    <div className={`admin-panel-in space-y-6 ${className}`.trim()}>{children}</div>
  );
}

type AdminStatusBadgeProps = {
  status: "PENDING" | "APPROVED" | "DISABLED";
};

export function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const styles =
    status === "PENDING"
      ? "bg-amber-100 text-amber-800 ring-amber-200/60"
      : status === "DISABLED"
        ? "bg-slate-200 text-slate-700 ring-slate-300/60"
        : "bg-emerald-100 text-emerald-800 ring-emerald-200/60";

  const label =
    status === "PENDING" ? "Pending" : status === "DISABLED" ? "Disabled" : "Approved";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${styles}`}
    >
      {label}
    </span>
  );
}

type AdminDonationStatusBadgeProps = {
  status: "PENDING" | "APPROVED";
};

export function AdminDonationStatusBadge({ status }: AdminDonationStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        status === "PENDING"
          ? "bg-amber-100 text-amber-800 ring-amber-200/60"
          : "bg-emerald-100 text-emerald-800 ring-emerald-200/60"
      }`}
    >
      {status === "PENDING" ? "Pending" : "Approved"}
    </span>
  );
}

export function AdminTableShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[1rem] border border-slate-200/70 bg-white">
      {children}
    </div>
  );
}

export function AdminEmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
}
