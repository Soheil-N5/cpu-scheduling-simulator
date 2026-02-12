export function rr({ processes, settings }) {
  const timeQuantum = Number(settings.timeQuantum);
  const contextSwitch = Number(settings.contextSwitch) || 0;

  const all = processes
    .map(p => ({
      ...p,
      arrivalTime: Number(p.arrivalTime),
      burstTime: Number(p.burstTime),
      remainingTime: Number(p.remainingTime ?? p.burstTime),
      firstStartTime: null,
      completionTime: null,
    }))
    .sort((a, b) => a.arrivalTime - b.arrivalTime);

  const readyQueue = [];
  const timeline = [];

  let time = 0;
  let index = 0;
  const n = all.length;

  while (all.some(p => p.remainingTime > 0)) {
    while (index < n && all[index].arrivalTime <= time) {
      readyQueue.push(all[index]);
      index++;
    }

    if (readyQueue.length === 0) {
      const nextArrival = all[index].arrivalTime;
      timeline.push({ label: "IDLE", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    const p = readyQueue.shift();

    if (p.firstStartTime === null) p.firstStartTime = time;

    const execTime = Math.min(timeQuantum, p.remainingTime);

    timeline.push({
      label: `P${p.id}`,
      start: time,
      end: time + execTime,
    });

    time += execTime;
    p.remainingTime -= execTime;

    if (p.remainingTime === 0) {
      p.completionTime = time;
    }

    while (index < n && all[index].arrivalTime <= time) {
      readyQueue.push(all[index]);
      index++;
    }

    if (p.remainingTime > 0) {
      readyQueue.push(p);
    }

    const last = timeline[timeline.length - 1];
    if (
      contextSwitch > 0 &&
      last &&
      last.label.startsWith("P") &&
      readyQueue.length > 0 &&
      `P${readyQueue[0].id}` !== last.label
    ) {
      timeline.push({ label: "CS", start: time, end: time + contextSwitch });
      time += contextSwitch;
    }
  }

  let totalWaiting = 0;
  let totalTurnaround = 0;
  let totalResponse = 0;

  for (const p of all) {
    const tat = p.completionTime - p.arrivalTime;     
    const wt  = tat - p.burstTime;                    
    const rt  = p.firstStartTime - p.arrivalTime;     

    totalTurnaround += tat;
    totalWaiting += wt;
    totalResponse += rt;
  }

  const totalTime = timeline.length ? timeline[timeline.length - 1].end : 0;

  const busyTime = timeline
    .filter(t => t.label !== "IDLE")
    .reduce((sum, t) => sum + (t.end - t.start), 0);

  return {
    timeline,
    metrics: {
      avgWaitingTime: n ? totalWaiting / n : 0,
      avgTurnaroundTime: n ? totalTurnaround / n : 0,
      avgResponseTime: n ? totalResponse / n : 0,
      cpuUtilization: totalTime ? (busyTime / totalTime) * 100 : 0,
      throughput: totalTime ? n / totalTime : 0,
    },
  };
}
