import './App.css';
import { Toaster } from "react-hot-toast";

import { useState,useEffect } from 'react';
import AlgorithmSelector from './components/AlgorithmSelector';
import ProcessEditor from './components/ProcessEditor';
function App() {
const [processes,setProcesses] = useState([
{
  id:1,
  arrivalTime:0,
  burstTime:0,
  remaningTime:0,
  state:"new"
},{
  id:3,
  arrivalTime:0,
  burstTime:0,
  remaningTime:0,
  state:"new"
},{
  id:2,
  arrivalTime:0,
  burstTime:0,
  remaningTime:0,
  state:"new"
}
]);//list
const [algorithm,setAlgorithm]=useState("");//string
const [settings,setSettings]=useState({
  "contextSwitch":0,
  "timeQuantum":0,  
  "queues": []
});//object cs , qtime , queue config
const [timeline,setTimeline]=useState([]);//list
const [metrics,setMetrics]=useState(null);//object
useEffect(() => {
  console.log(algorithm);
}, [algorithm]);

  return (<>
  <Toaster
  position="top-right"
  toastOptions={{
    style: {
      background: "#181e36",
      color: "#e8ecf8",
      border: "1px solid #232b4a",
      fontSize: "13px",
    },
    success: {
      iconTheme: {
        primary: "#4f7cff",
        secondary: "#fff",
      },
    },
    error: {
      iconTheme: {
        primary: "#e5484d",
        secondary: "#fff",
      },
    },
  }}
/>
<div className="App">
  <header className="app-header">
    <h1>CPU Scheduling Visualizer</h1>
  </header>

  <main className="container">
  <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} setSettings={setSettings}/>
  <ProcessEditor processes={processes} setProcesses={setProcesses}/>
  </main>
</div>
</>
  );
}

export default App;
