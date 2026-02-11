export function mlq({ processes, settings }) {
  const queues = settings.queues;
  const cs = Number(settings.contextSwitch || 0);

  const all = processes.map(p => ({
    ...p,
    queueLevel: Number(p.queueLevel ?? 0),
    remainingTime: p.remainingTime ?? p.burstTime,
    added: false,
  }));

  const ready = queues.map(() => []);
  const timeline = [];

  let time = 0;
  let completed = 0;
  const n = all.length;
  let lastLabel = null;

  const addArrivals = () => {
    all.forEach(p => {
      if (!p.added && p.arrivalTime <= time) {
        ready[p.queueLevel].push(p);
        p.added = true;
      }
    });
  };

  const highestQueue = () => {
    for (let i = 0; i < ready.length; i++) {
      if (ready[i].length) return i;
    }
    return -1;
  };

  while (completed < n) {
    addArrivals();
    const level = highestQueue();

    if (level === -1) {
      time++;
      lastLabel = null;
      continue;
    }

    const q = queues[level];
    const algo = q.algorithm;
    const quantum = algo === "rr" ? Number(q.timeQuantum) : Infinity;

    const p = ready[level].shift();
    const label = `P${p.id}`;

    if (cs > 0 && lastLabel && lastLabel !== label) {
      timeline.push({ label: "CS", start: time, end: time + cs });
      time += cs;
    }

    let exec = Math.min(quantum, p.remainingTime);

  
    const nextArrival = Math.min(
      ...all
        .filter(x => !x.added)
        .map(x => x.arrivalTime),
      Infinity
    );
    if (nextArrival < time + exec) exec = nextArrival - time;

    timeline.push({ label, start: time, end: time + exec });
    time += exec;
    p.remainingTime -= exec;

    addArrivals();

    if (p.remainingTime > 0) {
      ready[level].push(p); 
    } else {
      completed++;
    }

    lastLabel = label;
  }

  return { timeline, metrics: null };
}
