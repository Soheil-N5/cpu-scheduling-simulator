import './App.css';
import { useState } from 'react';
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

  return (
<div className="App">
  <header className="app-header">
    <h1>CPU Scheduling Visualizer</h1>
  </header>

  <main className="container">
  <AlgorithmSelector algorithm={algorithm} setAlgorithm={setAlgorithm} setSettings={setSettings}/>
  </main>
</div>

  );
}

export default App;
