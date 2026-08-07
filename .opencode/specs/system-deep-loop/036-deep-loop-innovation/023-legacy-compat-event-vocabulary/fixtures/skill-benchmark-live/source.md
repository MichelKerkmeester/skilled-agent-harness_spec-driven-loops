# system-deep-loop Benchmark Sources

> system-deep-loop · router

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/system-deep-loop` |
| Scenario corpus | `.opencode/skills/system-deep-loop/manual-testing-playbook` |
| Scoring method | `mode-a-router-replay` |
| Topology digest | `caf25c390b41edcba112b945ba091f76b97a659eb389b773c738d41d40d13473` |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
