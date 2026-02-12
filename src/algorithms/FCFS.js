export function fcfs({
    processes,
    settings
}) {
    const list = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime);

    let time = 0;
    const timeline = [];
    const cs = Number(settings.contextSwitch || 0);
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

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
        const startTime = time;
        const completionTime = time + p.burstTime;

        const turnaroundTime = completionTime - p.arrivalTime;
        const waitingTime = turnaroundTime - p.burstTime;
        const responseTime = startTime - p.arrivalTime;

        totalWaiting += waitingTime;
        totalTurnaround += turnaroundTime;
        totalResponse += responseTime;
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
    const totalTime = timeline.length ?
        timeline[timeline.length - 1].end :
        0;

    const busyTime = timeline
        .filter(t => t.label !== "IDLE")
        .reduce((sum, t) => sum + (t.end - t.start), 0);

    const n = list.length;
    return {
        timeline,
        metrics: {
            avgWaitingTime: n ? totalWaiting / n : 0,
            avgTurnaroundTime: n ? totalTurnaround / n : 0,
            avgResponseTime: n ? totalResponse / n : 0,
            cpuUtilization: totalTime ? (busyTime / totalTime) * 100 : 0,
            throughput: totalTime ? n / totalTime : 0
        }
    };
}