import { useState } from "react";

export default function AlgorithmSelector({
  setAlgorithm,
  setSettings,
  handleRun,
  settings,
}) {
  const [preemptive, setPreemptive] = useState(false);

  const algorithms = [
    { value: "fcfs", label: "FCFS" },
    { value: "sjf", label: "SJF" },
    { value: "srtf", label: "SRTF" },
    { value: "hrrn", label: "HRRN" },
    { value: "rr", label: "Round Robin" },
    { value: "mlq", label: "MLQ" },
    { value: "mlfq", label: "MLFQ" },
  ];

  const changeAlgorithm = (e) => {
    const value = e.target.value;
    setAlgorithm(value);
    setPreemptive(value === "rr");
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

          {preemptive && (
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

        {preemptive && (
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

        <button className="run-btn" onClick={handleRun}>
          ▶ Run
        </button>
      </div>
    </div>
  );
}
