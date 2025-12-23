# CPU Scheduling Simulator

A visual simulator for classical CPU scheduling algorithms, built with React.
This project is designed for educational purposes to understand how different
CPU scheduling strategies work.

## Features

- Visual Gantt Chart
- Context Switch handling
- Idle CPU periods
- Scheduling performance metrics:
  - Waiting Time
  - Turnaround Time
  - Response Time

## Implemented Algorithms

- FCFS (First Come First Serve)
- SJF (Shortest Job First)
- SRTF (Shortest Remaining Time First)
- HRRN (Highest Response Ratio Next)
- Round Robin (RR)
- Multi-Level Queue (MLQ)
- Multi-Level Feedback Queue (MLFQ)

## Timeline Model

All scheduling algorithms output a unified timeline structure:

```js
{
  label: "P1" | "CS" | "IDLE",
  start: Number,
  end: Number
}
```
P1, P2, ... : Process execution

CS : Context Switch

IDLE : CPU idle time

Project Structure

src/
├─ algorithms/   // Scheduling algorithms
├─ components/   // React UI components
├─ utils/        // Shared utilities (timeline, metrics, etc.)

Technologies
React

JavaScript (ES6+)

Git & GitHub

Author soheil-noori
Student project – CPU Scheduling Simulation



