export default function Progress({ value, total }: { value: number; total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div
      className="h-1.5 rounded-full bg-panel2 border border-hairline overflow-hidden w-full"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full bg-success transition-[width] duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
