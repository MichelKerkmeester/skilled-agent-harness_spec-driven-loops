# cli-hermes Benchmark Sources

_Derived after the fact from this run's stored record, not written at run time._

> cli-hermes · live and hermetic · cli-pi orchestrator on llmgateway/deepseek-v4.1-flash (--thinking high) · sessions on glm-5.3-flash · phase-008-third-pass

This map separates the canonical contracts, the private evidence, and the curated outputs in this folder.

| Resource | Purpose |
|---|---|
| Target skill | `.opencode/skills/cli-external-orchestration/cli-hermes` |
| Scenario corpus | [`cli-hermes/manual-testing-playbook/manual-testing-playbook.md`](../../../manual-testing-playbook/manual-testing-playbook.md) (`HERMES-001` to `HERMES-030`, plus `cli-hermes-EC-001` to `EC-014`) |
| Hermetic suite | `system-deep-loop/runtime/tests/stress/cli-adapter/cli-hermes.vitest.ts`, 18 of 18 with `DEEP_LOOP_CLI_HERMES_LIVE=1` |
| Scoring method | `not-recorded` |
| Source packet | `specs/cli-external-orchestration/071-cli-hermes-creation/008-hermes-playbook-and-catalog` |
| Defect packet | `specs/cli-external-orchestration/071-cli-hermes-creation/010-hermes-hook-parity`, which owns the plugin the two fixes changed |
| Prior run | [`2026-09-14-phase-008-second-pass`](../2026-09-14-phase-008-second-pass/), superseded by this one and retained unchanged |
| Raw evidence | Per-scenario stdout, stderr, exit-code and elapsed captures held in the executing session's scratchpad, plus the cited lines of `~/.hermes/logs/agent.log` and `~/.hermes/logs/errors.log` |
| Machine record | [`skill-benchmark-report.json`](./skill-benchmark-report.json) |
| Curated result set | [`results.csv`](./results.csv) |

## Boundary

The Pi workers wrote only into their own scratch directories. The only repository files this run touched are the scenario fixtures a scenario's own command sequence creates and removes.
