# cli-opencode Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> cli-opencode · live · claude · deepseek-v4-pro + openai/gpt-5.6-luna · headless

This map separates the canonical contracts, the private evidence, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/cli-external-orchestration/cli-opencode` |
| Scenario corpus | [`cli-opencode/manual-testing-playbook/goal-hook/goal-hook.md`](../../../manual-testing-playbook/goal-hook/goal-hook.md) (`CO-039`) |
| Scoring method | `not-recorded` |
| Source packet | [`034-goal-hook-playbooks-and-validation`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/spec.md) |
| Raw evidence | [`evidence/opencode-mkgoal-finding.txt`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/opencode-mkgoal-finding.txt) |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The packet and its captured evidence are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different evidence gets a new capture pass and a new folder, so a prior run is never overwritten when its result changes.
