export function fcfs({
    processes,
    settings
}) {
    const list = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let time = 0;
    const timeline = [];
    const cs = Number(settings.contextSwitch || 0);

    for (let i = 0; i < list.length; i++) {
        const p = list[i];

        if (time < p.arrivalTime) {
            timeline.push({
                label: "IDLE",
                start: time,
                end: p.arrivalTime
            });
            time = p.arrivalTime;
        }

        timeline.push({
            label: `P${p.id}`,
            start: time,
            end: time + p.burstTime
        });
        time += p.burstTime;

        if (cs > 0 && i < list.length - 1) {
            timeline.push({
                label: "CS",
                start: time,
                end: time + cs
            });
            time += cs;
        }
    }

    return {
        timeline,
        metrics: null
    };
}