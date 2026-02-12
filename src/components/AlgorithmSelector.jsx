export default function AlgorithmSelector({
  setAlgorithm,
  setSettings,
  handleRun,
  settings,
  algorithm,
}) {
  const algorithms = [
    { value: "fcfs", label: "FCFS / FIFO", quantum: false },
    { value: "spn", label: "SPN (Non-Preemptive SJF)", quantum: false },
    { value: "srtf", label: "SRTF (Preemptive SJF)", quantum: true },
    { value: "hrrn", label: "HRRN", quantum: false },
    { value: "rr", label: "Round Robin", quantum: true },
    { value: "mlq", label: "MLQ", quantum: false },
    { value: "mlfq", label: "MLFQ", quantum: false },
  ];

  const queueAlgorithmOptions = [
    { value: "fcfs", label: "FCFS" },
    { value: "spn", label: "SPN " },
    { value: "srtf", label: "SRTF" },
    { value: "hrrn", label: "HRRN" },
    { value: "rr", label: "Round Robin" },
  ];

  const algoMeta = algorithms.find(a => a.value === algorithm);
  const needsQuantum = !!algoMeta?.quantum;
  const needsQueues = algorithm === "mlq" || algorithm === "mlfq";

  const queues =  settings.queues;

  const changeAlgorithm = (e) => {
    const value = e.target.value;
    setAlgorithm(value);
  };

  return (
    <div className="section-container">
      <div className="left-content">
        <label>Algorithm</label>

        <select value={algorithm} onChange={changeAlgorithm}>
          {algorithms.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>

        <div className="tags">
          <span className="tag accent">
            Context Switch: <strong>{settings.contextSwitch ?? "-"}</strong>
          </span>

          {needsQuantum && (
            <span className="tag accent">
              Time Quantum: <strong>{settings.timeQuantum ?? "-"}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="right-content">
        <div className="field">
          <input
            type="text"
            inputMode="numeric"
            placeholder=" "
            value={settings.contextSwitch ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) {
                setSettings((prev) => ({
                  ...prev,
                  contextSwitch: v === "" ? "" : Number(v),
                }));
              }
            }}
          />
          <label>Context Switch</label>
        </div>

        {needsQuantum && (
          <div className="field">
            <input
              type="text"
              inputMode="numeric"
              placeholder=" "
              value={settings.timeQuantum ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                  setSettings((prev) => ({
                    ...prev,
                    timeQuantum: v === "" ? "" : Number(v),
                  }));
                }
              }}
            />
            <label>Time Quantum</label>
          </div>
        )}

        {needsQueues && (
          <div className="queues-config">
            <h4>Queue Configuration</h4>

            {[0, 1, 2, 3].map((i) => {
              const isLast = i === 3;
              const queueAlgo = isLast ? "fcfs" : (queues[i]?.algorithm || "rr");

              return (
                <div key={i} className={`queue-row ${isLast ? "locked" : ""}`}>
                  <div className="queue-info">
                    <span className="queue-title">Queue {i + 1}</span>
                  </div>

                  <div className="queue-controls">
                    <select
                      value={queueAlgo}
                      disabled={isLast}
                      onChange={(e) => {
                        const newAlgo = e.target.value;
                        setSettings((prev) => {
                          const newQueues = (prev.queues?.length ? [...prev.queues] : [{}, {}, {}, {}]);
                          newQueues[i] = { ...newQueues[i], algorithm: newAlgo };
                          if (newAlgo !== "rr") newQueues[i].timeQuantum = "";
                          return { ...prev, queues: newQueues };
                        });
                      }}
                    >
                      {queueAlgorithmOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>

                    {!isLast &&( queueAlgo === "rr"|| queueAlgo === "srtf") && (
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Quantum"
                        value={queues[i]?.timeQuantum ?? ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d*$/.test(v)) {
                            setSettings((prev) => {
                              const newQueues = (prev.queues?.length ? [...prev.queues] : [{}, {}, {}, {}]);
                              newQueues[i] = {
                                ...newQueues[i],
                                timeQuantum: v === "" ? "" : Number(v),
                              };
                              return { ...prev, queues: newQueues };
                            });
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button className="run-btn" onClick={handleRun}>
          ▶ Run
        </button>
      </div>
    </div>
  );
}
