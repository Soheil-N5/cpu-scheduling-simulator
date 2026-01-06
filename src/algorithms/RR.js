export function rr({ processes, settings }) {
  const timeQuantum = Number(settings.timeQuantum);
  const contextSwitch = Number(settings.contextSwitch) || 0;

  const all = processes.map(p => ({ ...p }));

  all.sort((a, b) => a.arrivalTime - b.arrivalTime);

  const readyQueue = [];
  const timeline = [];

  let time = 0;
  let index = 0;     
  let completed = 0;
  const n = all.length;

  while (completed < n) {
    while (index < n && all[index].arrivalTime <= time) {
      readyQueue.push(all[index]);
      index++;
    }

    if (readyQueue.length === 0) {
      const nextArrival = all[index].arrivalTime;
      timeline.push({
        label: "IDLE",
        start: time,
        end: nextArrival,
      });
      time = nextArrival;
      continue;
    }

    const p = readyQueue.shift();

    const execTime = Math.min(timeQuantum, p.remainingTime);

    timeline.push({
      label: `P${p.id}`,
      start: time,
      end: time + execTime,
    });

    time += execTime;
    p.remainingTime -= execTime;

    while (index < n && all[index].arrivalTime <= time) {
      readyQueue.push(all[index]);
      index++;
    }

    if (p.remainingTime > 0) {
      readyQueue.push(p);
    } else {
      completed++;
    }

    if ((readyQueue.length > 0 || index < n) && contextSwitch > 0) {
      timeline.push({
        label: "CS",
        start: time,
        end: time + contextSwitch,
      });
      time += contextSwitch;
    }
  }

  return {
    timeline,
    metrics: null,
  };
}
