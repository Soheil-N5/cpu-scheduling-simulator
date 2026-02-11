import { useState } from "react";

export default function AlgorithmSelector({
  setAlgorithm,
  setSettings,
  handleRun,
  settings,
  algorithm,
}) {
  const [needsQuantum, setNeedsQuantum] = useState(false);

  const algorithms = [
    { value: "fcfs", label: "FCFS / FIFO", quantum: false },
    { value: "spn", label: "SPN (Non-Preemptive SJF)", quantum: false },
    { value: "srtf", label: "SRTF (Preemptive SJF)", quantum: true },
    { value: "hrrn", label: "HRRN", quantum: false },
    { value: "rr", label: "Round Robin", quantum: true },
    { value: "mlq", label: "MLQ", quantum: false },
    { value: "mlfq", label: "MLFQ", quantum:false },
  ];
  const needsQueues = algorithm === "mlq" || algorithm === "mlfq";

  const changeAlgorithm = (e) => {
    const value = e.target.value;
    setAlgorithm(value);

    const algo = algorithms.find((a) => a.value === value);
    setNeedsQuantum(algo?.quantum ?? false);
  };

  return (
    <div className="section-container">
      <div className="left-content">
        <label>Algorithm</label>
        <select onChange={changeAlgorithm}>
          {algorithms.map((algo) => (
            <option key={algo.value} value={algo.value}>
              {algo.label}
            </option>
          ))}
        </select>

        <div className="tags">
          <span className="tag accent">
            Context Switch: <strong>{settings.contextSwitch || "-"}</strong>
          </span>

          {needsQuantum && (
            <span className="tag accent">
              Time Quantum: <strong>{settings.timeQuantum || "-"}</strong>
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
            value={settings.contextSwitch}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v))
                setSettings((prev) => ({
                  ...prev,
                  contextSwitch: Number(v),
                }));
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
              value={settings.timeQuantum}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v))
                  setSettings((prev) => ({
                    ...prev,
                    timeQuantum: Number(v),
                  }));
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

              return (
                <div key={i} className={`queue-row ${isLast ? "locked" : ""}`}>
                  <div className="queue-info">
                    <span className="queue-title">
                      Queue {i + 1}
                    </span>
                  
                  </div>

                  <div className="queue-controls">
                    <select
                      value={
                        isLast ? "fcfs" : settings.queues[i]?.algorithm || "rr"
                      }
                      disabled={isLast}
                      onChange={(e) => {
                        const algo = e.target.value;
                        setSettings((prev) => {
                          const newQueues = [...prev.queues];
                          newQueues[i] = { ...newQueues[i], algorithm: algo };
                          return { ...prev, queues: newQueues };
                        });
                      }}
                    >
                      <option value="rr">Round Robin</option>
                      <option value="fcfs">FCFS</option>
                    </select>

                    {!isLast && settings.queues[i]?.algorithm === "rr" && (
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Quantum"
                        value={settings.queues[i]?.timeQuantum || ""}
                        onChange={(e) => {
                          const v = e.target.value;
                          if (/^\d*$/.test(v))
                            setSettings((prev) => {
                              const newQueues = [...prev.queues];
                              newQueues[i] = {
                                ...newQueues[i],
                                timeQuantum: Number(v),
                              };
                              return { ...prev, queues: newQueues };
                            });
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
