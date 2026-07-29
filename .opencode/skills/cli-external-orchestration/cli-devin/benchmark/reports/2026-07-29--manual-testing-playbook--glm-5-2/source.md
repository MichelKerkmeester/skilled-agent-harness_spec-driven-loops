# cli-devin Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> cli-devin · live · claude · glm-5-2 · free

This map separates the canonical contracts, the private gold, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/cli-external-orchestration/cli-devin` |
| Scenario corpus | `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/goal-hook/goal-hook.md` (`DV-022`) |
| Scoring method | `not recorded` |
| Spec packet | `.opencode/specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation` |
| Raw evidence | [`devin-model-reply.txt`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/devin-model-reply.txt), [`devin-injection-excerpt.txt`](../../../../../../specs/cli-external-orchestration/034-goal-hook-playbooks-and-validation/evidence/devin-injection-excerpt.txt) |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The corpus and its private gold are inputs and are never rewritten by a run. This folder holds outputs only. A run that needs different gold gets a new corpus revision and a new folder, so a prior run is never overwritten when its result changes.
