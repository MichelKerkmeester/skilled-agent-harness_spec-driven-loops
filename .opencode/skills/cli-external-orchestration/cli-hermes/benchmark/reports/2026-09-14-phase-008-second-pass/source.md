# cli-hermes Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live · claude · glm-5.3-flash (llmgateway, --reasoning none) · phase-008-second-pass

This map separates the canonical contracts, the private evidence, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/cli-external-orchestration/cli-hermes` |
| Scenario corpus | [`cli-hermes/manual-testing-playbook/manual-testing-playbook.md`](../../../manual-testing-playbook/manual-testing-playbook.md) (`HERMES-001`..`HERMES-022`, `cli-hermes-EC-001`..`cli-hermes-EC-014`) |
| Scoring method | `not-recorded` |
| Source packet | `specs/cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog` |
| Prior run | [`2026-09-14-phase-008-first-pass`](../2026-09-14-phase-008-first-pass/), superseded by this one and retained unchanged |
| Raw evidence | Per-run stdout, stderr, exit-code, byte-count and elapsed captures held in the executing session's scratchpad, plus the cited lines of `~/.hermes/logs/agent.log`; each scenario file's Recorded Result carries the load-bearing excerpt |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The packet and its captured evidence are inputs and are never rewritten by a run. This folder holds outputs only. The first pass's folder is left exactly as it was written: a run whose result changes gets a new folder, so a prior run is never overwritten.
