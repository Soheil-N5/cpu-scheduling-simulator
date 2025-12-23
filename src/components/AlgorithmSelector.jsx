export default function AlgorithmSelector(prop) {
  const algorithems = ["fcfs", "sjf", "srtf", "hrrn", "rr", "mlq", "mlfq"];
  const changeAlgorithm = (e) => {
    prop.setAlgorithm(algorithems[e]);
  };
  return (
    <div className="algorithm-container">
      <p className="algorithm-title">
        Choose an algorithm, set the context switch and time quantum, then run
        the simulation.
      </p>

      <div className="algorithm-body">
        <div className="left-content">
          <div className="algorithm-section">
            <label htmlFor="algorithm-select">Algorithm</label>
            <select id="algorithm-select">
              <option value="fcfs">FCFS</option>
              <option value="sjf">SJF</option>
              <option value="srtf">SRTF</option>
              <option value="hrrn">HRRN</option>
              <option value="rr">Round Robin</option>
            </select>
          </div>

          <div className="flags">
            <label>
              <input type="checkbox" />
              Preemptive
            </label>
          </div>
        </div>

        <div className="right-content">
          <div className="input-group">
            <label htmlFor="cs-input">Context Switch</label>
            <input id="cs-input" type="number" min="0" />
          </div>

          <div className="input-group">
            <label htmlFor="qt-input">Time Quantum</label>
            <input id="qt-input" type="number" min="1" />
          </div>

          <button className="run-btn">Run</button>
        </div>
      </div>
    </div>
  );
}
