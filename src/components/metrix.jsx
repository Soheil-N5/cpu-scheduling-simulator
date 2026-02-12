export default function MetricsPanel({ metrics }) {
  if (!metrics) return null;

  const items = [
    { label: "Avg Waiting Time", value: metrics.avgWaitingTime, suffix: "" },
    { label: "Avg Turnaround Time", value: metrics.avgTurnaroundTime, suffix: "" },
    { label: "Avg Response Time", value: metrics.avgResponseTime, suffix: "" },
    { label: "CPU Utilization", value: metrics.cpuUtilization, suffix: "%" },
    { label: "Throughput", value: metrics.throughput, suffix: "" },
  ];

  return (
    <div className="section-container metrics-section">
      <div className="metrics-left">
        <p>Metrics</p>
        <div className="metrics-tags">
          {items.map((it) => (
            <div
              key={it.label}
              className={`metrics-card ${it.label.includes("CPU") ? "accent" : ""}`}
            >
              <span className="metrics-card__label">{it.label}</span>
              <span className="metrics-card__value">
                {Number.isFinite(it.value) ? it.value.toFixed(2) : "-"}
                {it.suffix}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="metrics-right">
        <div className="tag">
          <strong>Note:</strong> values are averages
        </div>
      </div>
    </div>
  );
}
