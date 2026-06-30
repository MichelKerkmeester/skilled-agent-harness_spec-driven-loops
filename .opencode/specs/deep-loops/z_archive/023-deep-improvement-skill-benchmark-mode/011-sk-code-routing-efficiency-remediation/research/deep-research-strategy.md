# Deep-Research Strategy — sk-code routing-efficiency & usefulness remediation

## Topic
How to make sk-code load a tighter, task-appropriate resource slice that cuts D3 over-routing and lifts D4 routine-task usefulness, without regressing D1 routing or D2 discovery.

## Charter
- Executor: native @deep-research (Opus), 3 iterations, convergence 0.05.
- Research only. No skill mutation, no router edit (that is a follow-on phase).
- Do NOT re-litigate that the §11 surface-flattening projection exists; investigate how to tighten loading given it.

## Research questions (hypotheses to weigh)
- H1 surface×concern slicing — load only the detected surface's slice for the matched concern.
- H2 phase-gated loading — gate heavy implementation refs behind the §2 routing phase.
- H3 lazy/progressive loading — preamble + top-ranked slice first, fetch more on demand.
- H4 anti-over-routing heuristic — cap/rank resources per intent, drop low-signal for narrow tasks.

## Known context (evidence baseline)
- Live benchmark: D1-intra 92, D2 87, D3 42 (routed ~16-20 vs gold ~5-8), D5 100.
- D4 ablation (approximate, n=2): CS-001 skill helped (0.88 vs 0.78); LS-001 skill hurt (0.82 vs 0.95).
- sk-code/benchmark/live-final/{skill-benchmark-report.md, d4-ablation.json}; sk-code/references/smart_routing.md §11.

## Stop conditions
- Converge (newInfoRatio < 0.05) or reach iteration 3.
- Deliverable: ranked approaches + one recommendation + D1/D2 regression guard + cross-surface non-starvation safeguard.
