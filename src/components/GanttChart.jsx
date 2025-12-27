export default function Ganttchart({ timeline }) {
  const getBlockClass = (block) => {
    if (block.label.startsWith("P")) return "process";
    if (block.label === "CS") return "cs";
    if (block.label === "IDLE") return "idle";
    return "";
  };

  return (
    <div className="section-container gantt-section">
      <p>Gantt Chart</p>

      <div className="ganttchart">
        {timeline.map((block, index) => (
          <div
            key={index}
            className={`gantt-block ${getBlockClass(block)}`}
            style={{ width: (block.end - block.start) * 40 }}
          >
            {index ===  0? (
              <span className="gantt-time-start">{block.start}</span>
            ) : null}
            <span className="gantt-label">{block.label}</span>
            <span className="gantt-time-end">{block.end}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
