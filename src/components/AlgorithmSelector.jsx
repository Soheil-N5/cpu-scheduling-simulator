import { useState } from "react";
import toast from "react-hot-toast";

export default function AlgorithmSelector({ setAlgorithm,setSettings }) {
  const [preemptive, setPreemptive] = useState(false);
  const [contextSwitch, setContextSwitch] = useState("");
  const [timeQuantum, setTimeQuantum] = useState("");

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

  const handleRun = () => {
    if (contextSwitch === "") {
      toast.error("Context Switch is required");
      return;
    }

    if (Number(contextSwitch) < 0) {
      toast.error("Context Switch must be ≥ 0");
      return;
    }

    if (preemptive) {
      if (timeQuantum === "") {
        toast.error("Time Quantum is required for Round Robin");
        return;
      }

      if (Number(timeQuantum) < 1) {
        toast.error("Time Quantum must be ≥ 1");
        return;
      }
    }

    toast.success("Simulation started 🚀");

    
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
            Context Switch: <strong>{contextSwitch || "-"}</strong>
          </span>

          {preemptive && (
            <span className="tag accent">
              Time Quantum: <strong>{timeQuantum || "-"}</strong>
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
            value={contextSwitch}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setContextSwitch(v);
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
              value={timeQuantum}
              onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) setTimeQuantum(v);
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
