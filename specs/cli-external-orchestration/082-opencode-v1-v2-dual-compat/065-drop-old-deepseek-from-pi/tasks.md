---
title: "Tasks: Phase 65: drop-old-deepseek-from-pi"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "drop old deepseek from pi tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 65: drop-old-deepseek-from-pi

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the split state the operator asked to close: commit `052d1e2e1e` removed the undated `deepseek-v4.1-flash` from `.pi/settings.json` `enabledModels`, but its object was still registered in `.pi/models.json` and both cli-pi rosters still accepted the bare literal (`.pi/models.json`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T002 Read the three rosters and the four suites that pin them, so the deletion covers every copy and each test expectation that names the old id (`.pi/models.json`, `executor-config.ts`, `fanout-run.cjs`, the `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli` suites)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Delete the `deepseek-v4.1-flash` object from the `llmgateway` provider block in `.pi/models.json`, leaving `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna` (`.pi/models.json`)
- [x] T004 Drop the bare id from `PI_SUPPORTED_MODELS` and reword the DeepSeek comments so they describe only the dated 2026-10-17 literal (`.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`)
- [x] T005 Drop the bare id from `PI_ALLOWED_MODELS` and `PI_MODEL_PROVIDERS`, keep `HERMES_ALLOWED_MODELS` unchanged and reword the comments to say why Hermes keeps the id and Pi does not (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`)
- [x] T006 Update `executor-config`, `fanout-run`, `combo-matrix` and `orchestrate-session-cli`: remove the old id from the expected rosters, move the cli-pi representative commands to `-1017`, add a check that cli-pi rejects the old id and add a check that `.pi/models.json` does not register it (`.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/combo-matrix.vitest.ts`, `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts`)
- [x] T007 Update the three roster docs: `cli-pi` `references/providers-and-models.md`, `.pi/custom-providers.md` and the v4.0.0.13 changelog now say Pi no longer carries the old id and point at OpenCode or Hermes to reproduce the 2026-09-10 release (`.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`, `.pi/custom-providers.md`, `.skilled/changelog/skilled/v4.0.0.13.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Prove the new checks bite: restoring the old id in `.pi/models.json` and the rosters fails 5 tests; a sixth, the Hermes CJS alignment check, failed only because the revert script also duplicated a Hermes id, so it is not counted (`.skilled/skills/system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`)
- [x] T009 Record the suite counts from a full rerun of the four updated suites and any suite the runtime rosters touch (`.skilled/skills/system-deep-loop/runtime/tests/`, `.skilled/skills/system-deep-loop/deep-ai-council/scripts/tests/orchestrate-session-cli.vitest.ts`) - deep-loop runtime 2807 passed and 8 skipped of 2815 in 167 files (the 062 baseline was 2806 and 8 of 2814; the one extra is the new rejection test); deep-ai-council 120 of 120 before and after; config-shape, battery and cli-opencode script tests 85 of 85 before and after; playbook fleet `--strict` PASS before and after, cli-pi 35 scenarios and 0 violations
- [x] T010 Live proof: `pi --list-models` shows no undated llmgateway DeepSeek row after the main checkout updates (`.pi/models.json`) - on the main checkout at `8d13b357a9`, `pi --list-models` lists three llmgateway rows, `deepseek-v4.1-flash-1017`, `glm-5.3-flash` and `gpt-6-luna`, with no undated DeepSeek row, exit 0 (`scratch/live/list-models.txt`)
- [x] T011 Live proof: an unpinned `pi` run uses `deepseek-v4.1-flash-1017` and exits 0 (`.pi/settings.json`, `.pi/models.json`) - `pi -ne -p ... --mode json --offline` with no `--model` reported `model: deepseek-v4.1-flash-1017`, `provider: llmgateway`, reply OK, exit 0 (`scratch/live/unpinned-run.jsonl`)
- [x] T012 Live proof: a fan-out cli-pi lineage pinned to `deepseek-v4.1-flash` is rejected with "cli-pi model 'deepseek-v4.1-flash' is not in the enforced allowlist" (`.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) - `buildLineageCommand` with the real `pi` on PATH threw that message listing the nine allowed ids, while `-1017` built `pi -p --offline --model llmgateway/deepseek-v4.1-flash-1017 --thinking max` (`scratch/live/fanout-pin-rejection.txt`)
- [x] T013 Fill this phase's four docs and the parent packet's phase-map and handoff rows from the facts and the verification record (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `../spec.md`)
- [x] T014 Commit and push to main (`.pi/models.json`, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`) - pushed to main as `8d13b357a9`
- [x] T015 Confirm CI is green on the pushed commit (`.pi/models.json`) - 17 of 17 workflows green on `8d13b357a9`, including Deep-Loop Runtime Tests `39909844320`, OpenCode Dual-Version Battery `39909844429`, Spec-Kit Check `39909844384`, Playbook Operator Contract `39909844592` and Trigger Index Rebuild `39909844393`; the index rebuild `c33ff8840a` had 13 succeeded, Trigger Index Rebuild skipped and Spec-Kit Check `39910111430` green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, the live proof, suite count, push and CI tasks included
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the live `pi --list-models` and unpinned-run proofs, the rejection proof and the suite counts are recorded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **The cli-pi model reference**: See `../../../.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md`
- **The previous phase**: See `../064-append-log-concurrency-flake/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---
