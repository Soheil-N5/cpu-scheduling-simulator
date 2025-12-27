import './App.css';
import { Toaster } from "react-hot-toast";
import { useState } from 'react';
import AlgorithmSelector from './components/AlgorithmSelector';
import ProcessEditor from './components/ProcessEditor';
import toast from "react-hot-toast";
import { fcfs } from './algorithms/FCFS';
import { sjf } from './algorithms/SJF';
import GanttChart from './components/GanttChart';
function App() {
  const [processes, setProcesses] = useState([
    {
      id: 1,
      arrivalTime: 0,
      burstTime: 0,
      remainingTime: 0,
      state: "new"
    }
  ]);

  const [algorithm, setAlgorithm] = useState("");
  const [settings, setSettings] = useState({
    contextSwitch: 0,
    timeQuantum: 0,
    queues: []
  });

  const [timeline, setTimeline] = useState([]);
  const [metrics, setMetrics] = useState(null);
const handleRun = () => {
  if (settings.contextSwitch === "") {
    toast.error("Context Switch is required");
    return;
  }

  if (Number(settings.contextSwitch) < 0) {
    toast.error("Context Switch must be ≥ 0");
    return;
  }

  let res;

  switch (algorithm) {
    case "fcfs":
      res = fcfs({ processes, settings });
      break;

    case "sjf":
      res = sjf({ processes, settings });
      break;

    default:
      toast.error("Please select an algorithm");
      return;
  }

  setTimeline(res.timeline);
  setMetrics(res.metrics);
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
          <h1>CPU Scheduling Visualizer</h1>
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
          />
          <GanttChart timeline={timeline}/>
        </main>
      </div>
    </>
  );
}

export default App;
