export function fcfs({
    processes,
    settings
}) {
    const list = [...processes]
    list.sort((a, b) => a.arrivalTime - b.arrivalTime);
    let time = 0
    const timeline = []
    for (const p of list) {
        if (time < p.arrivalTime) {
            timeline.push({
                label: "IDLE",
                start: time,
                end: p.arrivalTime,
            });
            time = p.arrivalTime
        }

        timeline.push({
            label: `P${p.id}`,
            start: time,
            end: time + p.burstTime,

        })
        time += p.burstTime;
        if (settings.contextSwitch > 0) {
            timeline.push({
                label: `CS`,
                start: time,
                end: time + Number(settings.contextSwitch),

            })
            time += Number(settings.contextSwitch)
        }

    }
    return {
        timeline,
        metrics: null
    }
}