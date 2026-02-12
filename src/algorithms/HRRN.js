export function hrrn({
    processes,
    settings
}) {
    const list = [...processes].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
    );
    let totalWaiting = 0;
    let totalTurnaround = 0;
    let totalResponse = 0;

    let time = 0;
    const timeline = [];
    let readyQueue = [];

    while (list.length > 0 || readyQueue.length > 0) {

        while (list.length > 0 && list[0].arrivalTime <= time) {
            readyQueue.push(list.shift());
        }

        if (readyQueue.length === 0) {
            const nextArrival = list[0].arrivalTime;

            timeline.push({
                label: "IDLE",
                start: time,
                end: nextArrival,
            });

            time = nextArrival;
            continue;
        }

        readyQueue = rr(readyQueue, time);

        const p = readyQueue.shift();

        const at = Number(p.arrivalTime);
        const bt = Number(p.burstTime);

        const startTime = time;
        const completionTime = time + bt;

        const turnaroundTime = completionTime - at;
        const waitingTime = turnaroundTime - bt;
        const responseTime = startTime - at;

        totalWaiting += waitingTime;
        totalTurnaround += turnaroundTime;
        totalResponse += responseTime;


        timeline.push({
            label: `P${p.id}`,
            start: time,
            end: time + Number(p.burstTime),
        });

        time += Number(p.burstTime);
        if (settings.contextSwitch > 0) {
            timeline.push({
                label: "CS",
                start: time,
                end: time + Number(settings.contextSwitch),
            });
            time += Number(settings.contextSwitch);
        }
    }
    const totalTime = timeline.length ? timeline[timeline.length - 1].end : 0;
    const busyTime = timeline
        .filter(t => t.label !== "IDLE")
        .reduce((sum, t) => sum + (t.end - t.start), 0);

    const n = processes.length;

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


function rr(list, time) {
    return list
        .map(p => {
            const at = Number(p.arrivalTime);
            const bt = Number(p.burstTime);
            const waitingTime = time - at;
            return {
                ...p,
                responseRatio: (waitingTime + bt) / bt,
            };
        })
        .sort((a, b) => b.responseRatio - a.responseRatio);
}