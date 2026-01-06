export function srtf({
    processes,
    settings
}) {
    const timeline = []
    const list = [...processes]
    let time = 0
    while (list.some(p => p.remainingTime > 0)) {
        const readylist = list.filter(p => p.remainingTime > 0 && p.arrivalTime <= time)
        if (readylist.length === 0) {
            const nextArrival = Math.min(...list.filter(p => p.remainingTime > 0 && p.arrivalTime > time).map(p => p.arrivalTime));
            timeline.push({
                label: "IDLE",
                start: time,
                end: nextArrival,
            });
            time = nextArrival
            continue;
        }

        readylist.sort((a, b) => a.remainingTime - b.remainingTime)
        const p = readylist[0]

        if (
            timeline.length > 0 &&
            timeline[timeline.length - 1].label === `P${p.id}`
        ) {
            timeline[timeline.length - 1].end += 1;
        } else {
            if (settings.contextSwitch > 0 &&
                timeline.length > 0 &&
                timeline[timeline.length - 1].label.startsWith("P") &&
                timeline[timeline.length - 1].label !== `P${p.id}`) {
                timeline.push({
                    label: "CS",
                    start: time,
                    end: time + Number(settings.contextSwitch),
                });
                time += Number(settings.contextSwitch);
            }
            timeline.push({
                label: `P${p.id}`,
                start: time,
                end: time + 1,
            });

        }

        p.remainingTime--
        time += 1
    }
    if (
        settings.contextSwitch > 0 &&
        timeline.length > 0 &&
        timeline[timeline.length - 1].label.startsWith("P")
    ) {
        const last = timeline[timeline.length - 1];
        timeline.push({
            label: "CS",
            start: last.end,
            end: last.end + Number(settings.contextSwitch),
        });
    }

    return {
        timeline,
        metrics: null
    };
}