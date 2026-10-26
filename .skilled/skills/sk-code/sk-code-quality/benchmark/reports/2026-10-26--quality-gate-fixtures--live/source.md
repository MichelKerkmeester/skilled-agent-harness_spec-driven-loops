# sk-code-quality Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> sk-code-quality · live

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.skilled/skills/sk-code/sk-code-quality` |
| Scenario corpus | the seven live scenarios CQ-002 to CQ-008, fixtures F01, F02, F05 and F06, the 50-file timing set built at run time and the four intent prompts (CQ-001 and canaries CB-CR-006 to CB-CR-008). Raw transcripts and the measurement record stay in the packet that produced this report, at specs/sk-code/015-quality-agnostic-gate/006-measurement/evidence/ |
| Scoring method | `catch rate, false positive count, wall time and intent recall per scenario, with no weighted dimension score` |
| Topology digest | `not recorded` |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
