# system-spec-kit Benchmark Sources

> system-spec-kit · doc · vitest · opencode-adapter-driven-verified

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/system-spec-kit` |
| Scenario corpus | `manual-testing-playbook` |
| Scoring method | `not-applicable-manual-outcome` |
| Topology digest | `not recorded` |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
