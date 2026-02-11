export function srtf({ processes, settings }) {
  const timeline = [];
  const list = processes.map(p => ({ ...p })); 
  let time = 0;

  const cs = Number(settings.contextSwitch || 0);

  while (list.some(p => p.remainingTime > 0)) {
    let ready = list.filter(p => p.remainingTime > 0 && p.arrivalTime <= time);
    if (ready.length === 0) {
      const nextArrival = Math.min(
        ...list.filter(p => p.remainingTime > 0).map(p => p.arrivalTime)
      );
      timeline.push({ label: "IDLE", start: time, end: nextArrival });
      time = nextArrival;
      continue;
    }

    ready.sort((a, b) => a.remainingTime - b.remainingTime);
    let p = ready[0];

    const last = timeline[timeline.length - 1];

    const switching =
      cs > 0 &&
      last &&
      last.label.startsWith("P") &&
      last.label !== `P${p.id}`;

    if (switching) {
      timeline.push({ label: "CS", start: time, end: time + cs });
      time += cs;

      ready = list.filter(q => q.remainingTime > 0 && q.arrivalTime <= time);
      ready.sort((a, b) => a.remainingTime - b.remainingTime);
      p = ready[0];
    }

  
    const last2 = timeline[timeline.length - 1];
    if (last2 && last2.label === `P${p.id}`) {
      last2.end += 1;
    } else {
      timeline.push({ label: `P${p.id}`, start: time, end: time + 1 });
    }

    p.remainingTime -= 1;
    time += 1;
  }

  if (cs > 0 && timeline.length > 0 && timeline[timeline.length - 1].label.startsWith("P")) {
    const last = timeline[timeline.length - 1];
    timeline.push({ label: "CS", start: last.end, end: last.end + cs });
    time = last.end + cs;
  }

  return { timeline, metrics: null };
}
