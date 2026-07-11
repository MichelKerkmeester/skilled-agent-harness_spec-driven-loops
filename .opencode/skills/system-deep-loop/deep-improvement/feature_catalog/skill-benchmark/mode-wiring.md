---
title: "Mode wiring and orchestration"
description: "Routes loop-host to the skill-benchmark orchestrator with one additive lane arm; the orchestrator runs the D5 gate first, then per-scenario contamination-lint and router-replay, then scores and emits a dual report."
trigger_phrases:
  - "mode wiring and orchestration"
  - "run-skill-benchmark.cjs"
  - "wire skill-benchmark mode"
  - "lane c orchestration"
  - "--mode=skill-benchmark"
version: 1.17.0.7
---

# Mode wiring and orchestration

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Lane C is reached by resolving `--mode=skill-benchmark` in `loop-host.cjs`, which plans a single step pointing at `run-skill-benchmark.cjs`. The orchestrator runs a fixed deterministic pipeline: the D5 connectivity gate first, then per-scenario contamination-lint and router-replay, scoring, and a dual JSON-plus-markdown report.

---

## 2. HOW IT WORKS

`scripts/shared/loop-host.cjs` adds the lane additively. It defines `const LANE_SKILL_BENCHMARK = new Set(['run-skill-benchmark.cjs'])` and includes `'skill-benchmark'` in the closed `VALID_MODES` set alongside `agent-improvement` and `model-benchmark`. `parseArgs` accepts both `--key=value` and `--key value` forms; `resolveMode` returns `agent-improvement` for an undefined mode and writes a stderr warning and falls back to `agent-improvement` for any value not in `VALID_MODES`. `planInvocation('skill-benchmark', args)` fails closed unless both `--skill` and `--outputs-dir` are present, then returns a single step `{ script: 'run-skill-benchmark.cjs', args: [...] }`, forwarding the optional flags listed in `SKILL_BENCHMARK_RUN_OPTIONS` (`fixtures-dir`, `output`, `trace-mode`, `advisor-mode`). `resolveScriptPath` maps the bare `run-skill-benchmark.cjs` name to `scripts/skill-benchmark/` at spawn time. The agent-improvement (`score-candidate.cjs`) and model-benchmark (`materialize-benchmark-fixtures.cjs` + `run-benchmark.cjs`) plans are unchanged. `loop-host.cjs`'s `runPlan` spawns each step with `spawnSync('node', ...)` and aborts the remaining steps if one exits non-zero.

`scripts/skill-benchmark/run-skill-benchmark.cjs` is the orchestrator (`run(args)`). It resolves the target skill root via `resolveSkillRoot` (a path/`.`-prefixed arg is resolved as-is; a bare id is joined under `.opencode/skills/`), derives `skillId` from the basename, creates `--outputs-dir`, and returns exit code 2 with a stderr message if the target has no `SKILL.md`. It then runs the pipeline in fixed order: (1) `scanConnectivity` (D5 gate) first, before any fixtures load; (2) `loadFixtures` from `--fixtures-dir` or `assets/skill_benchmark/fixtures/<skillId>/`; (3) per scenario, `buildBannedVocab` + `lintFixture`, then `routeSkillResources` (Mode A), then `scoreScenario`; (4) the advisor probe (`probeAdvisor`) runs per scenario only when `--advisor-mode=python`, otherwise `advisorResult` is `undefined`; (5) `aggregate` builds the report object, which is written to `skill-benchmark-report.json` and rendered to `skill-benchmark-report.md` via `renderReport`. Malformed fixtures degrade to an `unparseable-fixture` row rather than crashing.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` | Orchestration | Resolves `--mode`, validates against `VALID_MODES`, plans the single `skill-benchmark` step pointing at `run-skill-benchmark.cjs`. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs` | Orchestration | Lane C pipeline: D5 gate, per-scenario contamination-lint + router-replay, optional advisor probe, scoring, dual report. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/_args.cjs` | Utility | Shared `--key=value` / `--key value` / bare-flag arg parser for Lane C scripts. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/skill-benchmark.vitest.ts` | Automated test | Asserts `VALID_MODES` includes all three modes, that the skill-benchmark plan is a single `run-skill-benchmark.cjs` step, that it fails closed without required args, and the Lane A default plan stays byte-identical. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts` | Automated test | Verifies `parseArgs`, `resolveMode`, `resolveScriptPath` lane mapping, and the closed mode set. |

---

## 4. SOURCE METADATA

- Group: Skill-benchmark mode
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `skill-benchmark/mode-wiring.md`
Related references:
- [contamination-gate-and-fixtures.md](contamination-gate-and-fixtures.md) — Hint-free fixtures and contamination gate
