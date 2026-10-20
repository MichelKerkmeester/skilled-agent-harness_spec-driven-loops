# cli-opencode Benchmark Sources

> cli-opencode · live · opencode · llmgateway/deepseek-v4.1-flash · high

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/cli-external-orchestration/cli-opencode` |
| Scenario corpus | `manual-testing-playbook/plugin-utilization/` (CO-040 to CO-056) |
| Scoring method | `not-applicable-manual-outcome` |
| Topology digest | `not recorded` |
| Raw evidence | `specs/cli-external-orchestration/082-opencode-v1-v2-dual-compat/034-live-plugin-playbook/scratch/live-runs/` (one file per scenario and version, plus `results-matrix.md`) |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
