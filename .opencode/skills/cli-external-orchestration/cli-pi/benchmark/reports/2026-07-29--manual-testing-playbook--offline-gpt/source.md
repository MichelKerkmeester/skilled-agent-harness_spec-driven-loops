# cli-pi Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> cli-pi · live · claude · gpt (offline via openai-codex-responses) · offline

This map separates the canonical contracts, the private evidence, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/cli-external-orchestration/cli-pi` |
| Scenario corpus | [`cli-pi/manual-testing-playbook/goal-hook/goal-hook.md`](../../../manual-testing-playbook/goal-hook/goal-hook.md) (`PI-021`) |
| Scoring method | `not-recorded` |
| Source packet | [`034-goal-hook-playbooks-and-validation`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/spec.md) |
| Raw evidence | [`evidence/pi-injection-excerpt.txt`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/pi-injection-excerpt.txt) |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The packet and its captured evidence are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different evidence gets a new capture pass and a new folder, so a prior run is never overwritten when its result changes.
