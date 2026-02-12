export function spn({ processes, settings }) {
  let totalWaiting = 0;
  let totalTurnaround = 0;
  let totalResponse = 0;

  const list = [...processes].map(p => ({
    ...p,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
  }));

  const cs = Number(settings.contextSwitch || 0);
  const n = list.length;

  let time = 0;
  const timeline = [];

  while (list.length > 0) {
    const readylist = list.filter(p => p.arrivalTime <= time);

    if (readylist.length === 0) {
      const nextArrival = Math.min(...list.map(p => p.arrivalTime));
      timeline.push({ label: "IDLE", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    readylist.sort((a, b) => a.burstTime - b.burstTime);
    const p = readylist[0];

    const startTime = time;
    const completionTime = time + p.burstTime;

    const turnaroundTime = completionTime - p.arrivalTime;
    const waitingTime = turnaroundTime - p.burstTime;
    const responseTime = startTime - p.arrivalTime;

    totalWaiting += waitingTime;
    totalTurnaround += turnaroundTime;
    totalResponse += responseTime;

    timeline.push({
      label: `P${p.id}`,
      start: startTime,
      end: completionTime,
    });

    time = completionTime;

    const idx = list.findIndex(x => x.id === p.id);
    list.splice(idx, 1);

    if (cs > 0 && list.length > 0) {
      timeline.push({ label: "CS", start: time, end: time + cs });
      time += cs;
    }
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
