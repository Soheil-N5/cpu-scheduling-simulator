export function mlfq({ processes, settings }) {
  const queues = settings.queues || [];
  const cs = Number(settings.contextSwitch || 0);
  const boostInterval = Number(settings.boostInterval || 0);

  const all = processes.map(p => ({
    ...p,
    remainingTime: Number(p.remainingTime ?? p.burstTime),
    added: false,
    queueLevel: 0, 
  }));

  const ready = queues.map(() => []);
  const timeline = [];

  let time = 0;
  let completed = 0;
  const n = all.length;
  let lastLabel = null;

  let nextBoostTime = boostInterval > 0 ? boostInterval : Infinity;

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

  const nextNotAddedArrival = () => {
    let m = Infinity;
    for (const p of all) {
      if (!p.added && p.remainingTime > 0 && p.arrivalTime < m) m = p.arrivalTime;
    }
    return m;
  };

  const doBoost = () => {
    for (let lvl = 1; lvl < ready.length; lvl++) {
      while (ready[lvl].length) {
        const p = ready[lvl].shift();
        p.queueLevel = 0;
        ready[0].push(p);
      }
    }
    nextBoostTime = boostInterval > 0 ? time + boostInterval : Infinity;
  };

  while (completed < n) {
    addArrivals();

    if (time >= nextBoostTime) {
      doBoost();
      lastLabel = null; 
      continue;
    }

    const level = highestQueue();

    if (level === -1) {
      const nextArrival = nextNotAddedArrival();
      const nextEvent = Math.min(nextArrival, nextBoostTime);

      if (nextEvent === Infinity) break; 
      if (nextEvent > time) {
        timeline.push({ label: "IDLE", start: time, end: nextEvent });
        time = nextEvent;
      } else {
        time += 1;
      }
      lastLabel = null;
      continue;
    }

    const quantum = Number(queues[level].timeQuantum || 1);
    const p = ready[level].shift();
    const label = `P${p.id}`;

    if (cs > 0 && lastLabel && lastLabel !== label) {
      timeline.push({ label: "CS", start: time, end: time + cs });
      time += cs;
      addArrivals();
      if (time >= nextBoostTime) continue;
    }

    let exec = Math.min(quantum, p.remainingTime);

    const nextArrival = nextNotAddedArrival();
    const nextEvent = Math.min(nextArrival, nextBoostTime);

    if (nextEvent < time + exec) exec = nextEvent - time;

    if (exec <= 0) {
      ready[level].unshift(p);
      continue;
    }

    timeline.push({ label, start: time, end: time + exec });
    time += exec;
    p.remainingTime -= exec;

    addArrivals();

    if (p.remainingTime <= 0) {
      completed++;
      lastLabel = label;
      continue;
    }

    const usedFullQuantum = exec === quantum;

    if (usedFullQuantum && level < ready.length - 1) {
      p.queueLevel = level + 1;         
      ready[level + 1].push(p);
    } else {
      p.queueLevel = level;
      ready[level].push(p);
    }

    lastLabel = label;
  }

  return { timeline, metrics: null };
}
