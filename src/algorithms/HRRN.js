export function hrrn({
    processes,
    settings
}) {
    const list = [...processes].sort(
        (a, b) => a.arrivalTime - b.arrivalTime
    );

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

    return {
        timeline,
        metrics: null
    };
}


function rr(list, time) {
    return list
        .map(p => {
            const waitingTime = time - p.arrivalTime;
            return {
                ...p,
                responseRatio: (waitingTime + p.burstTime) / p.burstTime
            };
        })
        .sort((a, b) => b.responseRatio - a.responseRatio);
}