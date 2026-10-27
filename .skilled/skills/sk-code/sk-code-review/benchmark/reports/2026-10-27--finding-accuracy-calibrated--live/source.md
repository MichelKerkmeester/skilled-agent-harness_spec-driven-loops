# sk-code-review Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> sk-code-review · live

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/sk-code/sk-code-review` |
| Scenario corpus | sk-code-review/manual-testing-playbook/finding-accuracy/ (CR-025, CR-026, CR-027), clean control at version 1.0.2.0 |
| Scoring method | `live-finding-accuracy` |
| Topology digest | `not recorded` |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
