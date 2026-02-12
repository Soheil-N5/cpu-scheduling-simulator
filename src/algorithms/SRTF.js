export function srtf({ processes, settings }) {
  const timeline = [];
  let time = 0;

  const cs = Number(settings.contextSwitch || 0);
  const tq = Number(settings.timeQuantum || 1); 

  const list = processes.map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.remainingTime ?? p.burstTime),

    firstStartTime: null,
    completionTime: null,
  }));

  const n = list.length;

  const nextArrivalAfter = (t) => {
    return Math.min(
      ...list
        .filter(p => p.remainingTime > 0 && p.arrivalTime > t)
        .map(p => p.arrivalTime),
      Infinity
    );
  };

  const pushOrExtend = (label, start, end) => {
    if (end <= start) return;
    const last = timeline[timeline.length - 1];
    if (last && last.label === label && last.end === start) last.end = end;
    else timeline.push({ label, start, end });
  };

  while (list.some(p => p.remainingTime > 0)) {
    let ready = list.filter(p => p.remainingTime > 0 && p.arrivalTime <= time);

    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...list.filter(p => p.remainingTime > 0).map(p => p.arrivalTime),
        Infinity
      );
      pushOrExtend("IDLE", time, nextArrival);
      time = nextArrival;
      continue;
    }

    ready.sort((a, b) => a.remainingTime - b.remainingTime);
    let p = ready[0];
    const label = `P${p.id}`;

    const last = timeline[timeline.length - 1];
    const switching =
      cs > 0 &&
      last &&
      last.label.startsWith("P") &&
      last.label !== label;

    if (switching) {
      pushOrExtend("CS", time, time + cs);
      time += cs;

      ready = list.filter(q => q.remainingTime > 0 && q.arrivalTime <= time);
      ready.sort((a, b) => a.remainingTime - b.remainingTime);
      p = ready[0];
    }

    if (p.firstStartTime === null) p.firstStartTime = time;

    let exec = Math.min(tq, p.remainingTime);

    const nextA = nextArrivalAfter(time);
    if (nextA < time + exec) exec = nextA - time;

    pushOrExtend(`P${p.id}`, time, time + exec);

    time += exec;
    p.remainingTime -= exec;

    if (p.remainingTime === 0) {
      p.completionTime = time;
    }
  }

  if (cs > 0 && timeline.length > 0 && timeline[timeline.length - 1].label.startsWith("P")) {
    const last = timeline[timeline.length - 1];
    pushOrExtend("CS", last.end, last.end + cs);
    time = last.end + cs;
  }

  let totalWaiting = 0;
  let totalTurnaround = 0;
  let totalResponse = 0;

  for (const p of list) {
    const tat = p.completionTime - p.arrivalTime;  
    const wt = tat - p.burstTime;                
    const rt = p.firstStartTime - p.arrivalTime;  

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
