import "./App.css";
import { Toaster } from "react-hot-toast";
import { useState } from "react";
import AlgorithmSelector from "./components/AlgorithmSelector";
import ProcessEditor from "./components/ProcessEditor";
import toast from "react-hot-toast";
import { fcfs } from "./algorithms/FCFS";
import { spn } from "./algorithms/SPN";
import { srtf } from "./algorithms/SRTF";
import GanttChart from "./components/GanttChart";
import { hrrn } from "./algorithms/HRRN";
import { rr } from "./algorithms/RR";
import { mlfq } from "./algorithms/MLFQ";
import { mlq } from "./algorithms/MLQ";
function App() {
  const [processes, setProcesses] = useState([
    {
      id: "1",
      arrivalTime: 0,
      burstTime: 8,
      remainingTime: 8,
      queueLevel: 0,
    },
  ]);

  const [algorithm, setAlgorithm] = useState("fcfs");
  const [settings, setSettings] = useState({
    contextSwitch: 0,
    timeQuantum: 2,
    queues: [
      { algorithm: "rr", timeQuantum: 2 },
      { algorithm: "rr", timeQuantum: 4 },
      { algorithm: "fcfs" },
      { algorithm: "fcfs" },
    ],
  });

  const [timeline, setTimeline] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const handleRun = () => {
    if (!algorithm) {
      toast.error("Please select a scheduling algorithm");
      return;
    }

    if (!processes || processes.length === 0) {
      toast.error("Please add at least one process");
      return;
    }

    for (const p of processes) {
      if (p.arrivalTime < 0) {
        toast.error(`Arrival Time of P${p.id} cannot be negative`);
        return;
      }

      if (p.burstTime <= 0) {
        toast.error(`Burst Time of P${p.id} must be greater than 0`);
        return;
      }
    }

    if (settings.contextSwitch === "") {
      toast.error("Context Switch is required");
      return;
    }

    if (Number(settings.contextSwitch) < 0) {
      toast.error("Context Switch must be ≥ 0");
      return;
    }

    const readyProcesses = processes.map((p) => ({
      ...p,
      remainingTime: p.burstTime,
      state: "ready",
    }));

    let res;

    try {
      switch (algorithm) {
        case "fcfs":
          res = fcfs({ processes: readyProcesses, settings });
          break;

        case "spn":
          res = spn({ processes: readyProcesses, settings });
          break;

        case "srtf":
          res = srtf({ processes: readyProcesses, settings });
          break;
        case "hrrn":
          res = hrrn({ processes: readyProcesses, settings });
          break;
        case "rr":
          res = rr({ processes: readyProcesses, settings });
          break;
        case "mlfq":
          res = mlfq({ processes: readyProcesses, settings });
          break;
        case "mlq":
          res = mlq({ processes: readyProcesses, settings });
          break;
        default:
          toast.error("Unknown algorithm selected");
          return;
      }

      if (!res || !Array.isArray(res.timeline)) {
        toast.error("Algorithm returned invalid result");
        return;
      }

      setTimeline(res.timeline);
      setMetrics(res.metrics);
      toast.success("Processes executed successfully");
    } catch (error) {
      console.error("Run error:", error);
      toast.error("Unexpected error occurred while running the algorithm");
    }
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#181e36",
            color: "#e8ecf8",
            border: "1px solid #232b4a",
            fontSize: "13px",
          },
        }}
      />
      <div className="App">
        <header className="app-header">
          <h1> CPU Scheduling Visualizer </h1>{" "}
        </header>
        <main className="container">
          <AlgorithmSelector
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            settings={settings}
            setSettings={setSettings}
            handleRun={handleRun}
          />
          <ProcessEditor
            processes={processes}
            setProcesses={setProcesses}
            algorithm={algorithm}
          />{" "}
          <GanttChart timeline={timeline} />{" "}
        </main>{" "}
      </div>
    </>
  );
}

export default App;
