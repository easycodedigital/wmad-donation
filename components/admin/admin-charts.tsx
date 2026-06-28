"use client";

type MonthlyPoint = {
  monthKey: string;
  totalAmount: number;
  donationCount: number;
};

type DonationTrendChartProps = {
  data: MonthlyPoint[];
};

function formatMonthLabel(monthKey: string) {
  const [year, month] = monthKey.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString(undefined, { month: "short" });
}

export function DonationTrendChart({ data }: DonationTrendChartProps) {
  const points = [...data].reverse().slice(-6);
  const maxAmount = Math.max(...points.map((p) => p.totalAmount), 1);

  if (points.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 text-sm text-slate-500">
        No donation data yet
      </div>
    );
  }

  const width = 560;
  const height = 180;
  const padX = 8;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const coords = points.map((point, index) => {
    const x = padX + (index / Math.max(points.length - 1, 1)) * chartW;
    const y = padY + chartH - (point.totalAmount / maxAmount) * chartH;
    return { x, y, point };
  });

  const linePath = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c.x} ${c.y}`).join(" ");
  const areaPath = `${linePath} L ${coords[coords.length - 1]?.x ?? padX} ${padY + chartH} L ${coords[0]?.x ?? padX} ${padY + chartH} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-48 w-full" aria-hidden>
        <defs>
          <linearGradient id="donation-area" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(16 185 129 / 0.25)" />
            <stop offset="100%" stopColor="rgb(16 185 129 / 0.02)" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => (
          <line
            key={ratio}
            x1={padX}
            x2={width - padX}
            y1={padY + chartH * ratio}
            y2={padY + chartH * ratio}
            stroke="rgb(226 232 240)"
            strokeWidth="1"
          />
        ))}
        <path d={areaPath} fill="url(#donation-area)" />
        <path d={linePath} fill="none" stroke="rgb(5 150 105)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(({ x, y, point }) => (
          <g key={point.monthKey}>
            <circle cx={x} cy={y} r="5" fill="white" stroke="rgb(5 150 105)" strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
        {points.map((point) => (
          <span key={point.monthKey}>{formatMonthLabel(point.monthKey)}</span>
        ))}
      </div>
    </div>
  );
}

export function MiniDonationBars({ data }: DonationTrendChartProps) {
  const points = [...data].slice(0, 14).reverse();
  const maxCount = Math.max(...points.map((p) => p.donationCount), 1);

  if (points.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-xs text-slate-500">
        No data
      </div>
    );
  }

  return (
    <div className="flex h-32 items-end gap-1.5">
      {points.map((point, index) => {
        const height = Math.max(12, (point.donationCount / maxCount) * 100);
        const shaded = index % 3 === 0;
        return (
          <div
            key={point.monthKey}
            className="flex-1 rounded-t-md transition hover:opacity-80"
            style={{ height: `${height}%` }}
            title={`${point.monthKey}: ${point.donationCount} donations`}
          >
            <div
              className={`h-full w-full rounded-t-md ${
                shaded ? "bg-emerald-600" : "bg-emerald-200"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
