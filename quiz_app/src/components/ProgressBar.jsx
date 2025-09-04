export default function ProgressBar({ value, max }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="progress" aria-label="progress">
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}
