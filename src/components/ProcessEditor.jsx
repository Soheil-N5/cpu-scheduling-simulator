export default function ProcessEditor({ processes, setProcesses }) {
  const updateProcess = (index, key, value) => {
    const next = processes.map((p, i) =>
      i === index ? { ...p, [key]: value } : p
    );
    setProcesses(next);
  };

  const addProcess = () => {
    setProcesses([
      ...processes,
      {
        id: processes.length + 1,
        arrivalTime: 0,
        burstTime: 1,
      },
    ]);
  };

  return (
    <div className="section-container">
      <div className="process-editor">
       
        <div className="process-editor__header">
          <label className="process-editor__title">Process Editor</label>
          <button className="process-editor__add-btn" onClick={addProcess}>
            + Add Process
          </button>
        </div>

        <div className="process-editor__list">
          {processes.map((p, index) => (
            <div className="process-row" key={index}>
              <div className="process-row__id">P{p.id}</div>

              <div className="process-row__field">
                <label className="process-row__label">Arrival Time</label>
                <input
                  className="process-row__input"
                  type="text"
                  inputMode="numeric"
                  value={p.arrivalTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v)) {
                      updateProcess(
                        index,
                        "arrivalTime",
                        v === "" ? "" : Number(v)
                      );
                    }
                  }}
                />
              </div>

              <div className="process-row__field">
                <label className="process-row__label">Burst Time</label>
                <input
                  className="process-row__input"
                  type="text"
                  inputMode="numeric"
                  value={p.burstTime}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (/^\d*$/.test(v)) {
                      const n = Number(v);
                      if (v === "" || n >= 1) {
                        updateProcess(index, "burstTime", v === "" ? "" : n);
                      }
                    }
                  }}
                />
              </div>

              <button
                className="process-row__remove-btn"
                onClick={() =>
                  setProcesses(processes.filter((_, i) => i !== index))
                }
                aria-label="Remove process"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
