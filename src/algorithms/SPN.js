export function spn({
    processes,
    settings
}) {

    /* {
      id: 1,
      arrivalTime: 0,
      burstTime: 0,
      remainingTime: 0,
      state: "new"
    }*/
    const list = [...processes]
    let time = 0
    const timeline = []
    while (list.length > 0) {
        const readylist = list.filter(p => p.arrivalTime <= time);
        if (readylist.length === 0) {
            const nextArrival = Math.min(...list.map(p => p.arrivalTime));
            timeline.push({
                label: "IDLE",
                start: time,
                end: nextArrival,
            });

            time = nextArrival;
            continue;
        }
        readylist.sort((a, b) => a.burstTime - b.burstTime);
        const p = readylist[0];
        timeline.push({
            label: `P${p.id}`,
            start: time,
            end: time + Number(p.burstTime),
        });

        time += Number(p.burstTime);
        const index = list.findIndex(x => x.id === p.id);
        list.splice(index, 1);
        if (settings.contextSwitch > 0) {
            timeline.push({
                label: "CS",
                start: time,
                end: time + Number(settings.contextSwitch),
            });
            time += Number(settings.contextSwitch);
        }
    }
    return {
        timeline,
        metrics: null
    };

}