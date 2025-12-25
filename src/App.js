import './App.css';
import { Toaster } from "react-hot-toast";

import { useState,useEffect } from 'react';
import AlgorithmSelector from './components/AlgorithmSelector';
function App() {
const [processes,setProcesses] = useState([]);//list
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
  </main>
</div>
</>
  );
}

export default App;
