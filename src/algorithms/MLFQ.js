export function mlfq({ processes, settings }) {
  const queues = settings.queues || [{}, {}, {}, {}];
  const levels = queues.length;

  const cs = Number(settings.contextSwitch || 0);
  let lastExecutedLabel = null;
  let csJustHappened =false;
  const all = processes.map(p => ({
    ...p,
    id: p.id,
    arrivalTime: Number(p.arrivalTime),
    burstTime: Number(p.burstTime),
    remainingTime: Number(p.remainingTime ?? p.burstTime),

    queueLevel: 0,
    added: false,

    firstStartTime: null,
    completionTime: null,
  }));

  const ready = Array.from({ length: levels }, () => []);
  const timeline = [];

  let time = 0;
  let completed = 0;
  const n = all.length;

  const addArrivals = () => {
    for (const p of all) {
      if (!p.added && p.arrivalTime <= time) {
        p.queueLevel = 0;
        ready[0].push(p);
        p.added = true;
      }
    }
  };

  const highestQueue = () => {
    for (let i = 0; i < ready.length; i++) {
      if (ready[i].length) return i;
    }
    return -1;
  };

  const nextArrivalTime = () => {
    return Math.min(
      ...all.filter(p => !p.added && p.remainingTime > 0).map(p => p.arrivalTime),
      Infinity
    );
  };

  while (completed < n) {
    addArrivals();
    const level = highestQueue();

    if (level === -1) {
      const nextA = nextArrivalTime();
      if (nextA === Infinity) break;
      pushOrExtend(timeline, "IDLE", time, nextA);
      time = nextA;
      lastExecutedLabel = null;
      csJustHappened = false;
      continue;
    }

    const cfg = queues[level] || {};
    const algo = (cfg.algorithm || (level === levels - 1 ? "fcfs" : "rr")).toLowerCase();

    const quantum =
      (algo === "rr" || algo === "srtf")
        ? Number(cfg.timeQuantum || settings.timeQuantum || 1)
        : Infinity;

    const chosen = pickProcess(ready[level], algo, time);
    const label = `P${chosen.id}`;

    // Context switch فقط وقتی از یک اجرای واقعی به اجرای واقعی دیگری می‌رویم
    if (cs > 0 && !csJustHappened && lastExecutedLabel && lastExecutedLabel !== label) {
      pushOrExtend(timeline, "CS", time, time + cs);
      time += cs;
      addArrivals();

      csJustHappened = true;
      continue;
    }


    if (chosen.firstStartTime === null) chosen.firstStartTime = time;

    let exec = Math.min(quantum, chosen.remainingTime);

    const nextA = nextArrivalTime();
    if (nextA < time + exec) exec = nextA - time;

    pushOrExtend(timeline, label, time, time + exec);
    time += exec;
    chosen.remainingTime -= exec;

    addArrivals();
    csJustHappened = false;
    lastExecutedLabel = label;

    const idx = ready[level].findIndex(x => x.id === chosen.id);
    if (idx >= 0) ready[level].splice(idx, 1);

    if (chosen.remainingTime === 0) {
      chosen.completionTime = time;
      completed++;
      continue;
    }

    const consumedFullQuantum = exec === quantum && quantum !== Infinity;

    if (consumedFullQuantum && level < levels - 1) {
      chosen.queueLevel = level + 1;
      ready[level + 1].push(chosen);
    } else {
      chosen.queueLevel = level;
      ready[level].push(chosen);
    }

  }

  if (cs > 0 && timeline.length && timeline[timeline.length - 1].label.startsWith("P")) {
    const last = timeline[timeline.length - 1];
    pushOrExtend(timeline, "CS", last.end, last.end + cs);
  }

  return {
    timeline,
    metrics: computeMetrics(all, timeline),
  };
}
function pushOrExtend(timeline, label, start, end) {
  if (end <= start) return;
  const last = timeline[timeline.length - 1];
  if (last && last.label === label && last.end === start) {
    last.end = end;
  } else {
    timeline.push({ label, start, end });
  }
}

function pickProcess(queue, algo, time) {
  if (!queue.length) return null;

  algo = (algo || "fcfs").toLowerCase();

  if (algo === "fcfs" || algo === "rr") return queue[0];

  if (algo === "spn") {
    return queue.reduce((best, p) =>
      p.burstTime < best.burstTime ? p : best
    , queue[0]);
  }

  if (algo === "srtf") {
    return queue.reduce((best, p) =>
      p.remainingTime < best.remainingTime ? p : best
    , queue[0]);
  }

  if (algo === "hrrn") {
    return queue.reduce((best, p) => {
      const rrBest = ((time - best.arrivalTime) + best.burstTime) / best.burstTime;
      const rrP = ((time - p.arrivalTime) + p.burstTime) / p.burstTime;
      return rrP > rrBest ? p : best;
    }, queue[0]);
  }

  return queue[0];
}

function computeMetrics(all, timeline) {
  const n = all.length;

  let totalWaiting = 0;
  let totalTurnaround = 0;
  let totalResponse = 0;

  for (const p of all) {
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
    avgWaitingTime: n ? totalWaiting / n : 0,
    avgTurnaroundTime: n ? totalTurnaround / n : 0,
    avgResponseTime: n ? totalResponse / n : 0,
    cpuUtilization: totalTime ? (busyTime / totalTime) * 100 : 0,
    throughput: totalTime ? n / totalTime : 0,
  };
}
