import "./RevenueChart.css";

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) {
    return <p className="muted2">No revenue data yet.</p>;
  }

  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="rc">
      {data.map((d) => (
        <div key={d.label} className="rc-col">
          <div
            className="rc-bar"
            style={{ height: `${Math.round((d.value / max) * 100)}%` }}
            title={`Rs. ${d.value}`}
          />
          <p className="rc-label">{d.label}</p>
          <p className="rc-value">Rs. {d.value}</p>
        </div>
      ))}
    </div>
  );
}
