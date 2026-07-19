---
title: "Mode switch"
description: "Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline."
trigger_phrases:
  - "mode switch"
  - "loop-host.cjs"
  - "switch benchmark mode"
  - "model-benchmark routing"
  - "--mode flag resolution"
version: 1.17.0.9
---

# Mode switch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Routes loop-host between the agent-improvement scorer and the model-benchmark materialize-then-run pipeline.

This feature is the entry point that decides which evaluation path a run takes. It keeps the default agent-improvement path byte-identical while adding a separate model-benchmark path behind an explicit flag.

---

## 2. HOW IT WORKS

`scripts/shared/loop-host.cjs` resolves `--mode` before any work begins. `--mode=agent-improvement`, or no flag at all, routes to `scripts/agent-improvement/score-candidate.cjs` and leaves the existing scoring path unchanged. `--mode=model-benchmark` plans a two-step pipeline that runs `scripts/shared/materialize-benchmark-fixtures.cjs` first, then `scripts/model-benchmark/run-benchmark.cjs` against the materialized outputs.

Mode resolution is closed-set. `VALID_MODES` introduced this two-mode split (`agent-improvement` and `model-benchmark`); the set has since grown additively to three — `agent-improvement`, `model-benchmark`, and `skill-benchmark` — with the additional mode documented in [mode-wiring.md](../../feature-catalog/skill-benchmark/mode-wiring.md). `resolveMode()` treats an undefined mode as `agent-improvement`. An unknown mode value writes a warning to stderr and falls back to `agent-improvement`, so a typo degrades to the safe default rather than failing the run. The model-benchmark plan also requires `--profile` and `--outputs-dir`, and the host aborts remaining steps when an earlier step exits non-zero.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/loop-host.cjs` | Mode router | Parses `--mode`, resolves the closed mode set, and plans the agent-improvement or model-benchmark step sequence. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/agent-improvement/score-candidate.cjs` | Scorer | Receives the agent-improvement route unchanged when no mode flag is set. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/materialize-benchmark-fixtures.cjs` | Materializer | First step of the model-benchmark plan, writing packet-local markdown from static fixtures. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` | Benchmark runner | Second step of the model-benchmark plan, scoring materialized outputs and writing the report. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/shared/tests/loop-host.vitest.ts` | Automated test | Verifies `parseArgs`, `resolveMode`, the closed `VALID_MODES` set, the two-step model-benchmark plan, and the unknown-mode stderr fallback. |
| `.opencode/skills/system-deep-loop/deep-improvement/SKILL.md` | Skill contract | Documents Lane B entry-point routing and the unknown-mode fallback as the source of truth. |

---

## 4. SOURCE METADATA

- Group: Model-benchmark mode
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `model-benchmark-mode/mode-switch.md`
Related references:
- [model-dispatcher.md](../../feature-catalog/model-benchmark-mode/model-dispatcher.md) — Model dispatcher
