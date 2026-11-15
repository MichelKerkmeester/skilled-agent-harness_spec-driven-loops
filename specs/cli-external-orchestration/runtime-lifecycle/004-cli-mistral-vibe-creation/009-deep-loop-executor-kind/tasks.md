---
title: "Tasks: Phase 9: deep-loop-executor-kind"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep loop executor kind tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: deep-loop-executor-kind

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/system-deep-loop/runtime`. `S` is `R/tests/stress/cli-adapter`. Test commands run from `R` with `npx --no-install vitest run --no-coverage <files>`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the executor unit baseline (`R/tests/unit/`). Verify: the three files `executor-config.vitest.ts`, `executor-audit.vitest.ts` and `fanout-run.vitest.ts` print `Tests  365 passed (365)`.
- [x] T002 Record the cli-adapter stress baseline (`S/`). Verify: `npx --no-install vitest run --no-coverage tests/stress/cli-adapter` prints a pass count and zero failures, written to goal.md section 4.
- [x] T003 Read the roster aliases and their `thinking` values (`.vibe/config.toml`). Verify: each alias the cli-mistral-vibe providers reference lists has a model row whose `thinking` is set, or goal.md records that phase 006 has not landed.
- [x] T004 List every place a kind is named (`R/`). Verify: `rg -n 'cli-deepseek-harness' R .skilled/commands/deep/assets` output matches the affected-surfaces table in `plan.md`.
- [x] T005 Locate where a lineage's result is recorded and confirm no per-lineage partial exists (`R/scripts/fanout-run.cjs`). Verify: `rg -n "'partial'" R/scripts/fanout-run.cjs` prints only the run-level lines, and goal.md names the result field T011 extends.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add `cli-mistral-vibe` to `EXECUTOR_KINDS` and every exhaustive kind table, with flag support `model`, `timeoutSeconds` and `liveTools` and preventive sandbox `false` (`R/lib/deep-loop/executor-config.ts`). Verify: a config with `reasoningEffort` or `sandboxMode` for the kind is rejected, and one with `model` and `timeoutSeconds` parses.
- [x] T007 Add `VIBE_SUPPORTED_MODELS` and `isVibeSupportedModel` (`R/lib/deep-loop/executor-config.ts`). Verify: each T003 alias returns `true` and an unlisted alias returns `false`.
- [x] T008 Let one kind carry several binary names and give Vibe `vibe-rs` and `vibe-app-server` (`R/lib/deep-loop/executor-audit.ts`). Verify: `detectFromAncestry('cli-mistral-vibe', [...])` returns `true` for a `vibe-rs` and for a `vibe-app-server` command line, and existing kinds' cases still pass.
- [x] T009 Add the `VIBE_` prefix, the `MISTRAL_API_KEY` key, `VIBE_HOME` as lineage state and `.vibe` as the default home folder (`R/lib/deep-loop/executor-audit.ts`). Verify: the filtered env keeps `MISTRAL_API_KEY` and a synthetic `VIBE_PROBE` variable, drops `OPENAI_API_KEY`, and does not keep an inherited `VIBE_HOME`.
- [x] T010 Add `buildVibeLineageCommand` to `LINEAGE_COMMAND_ADAPTERS` and a state-dir env name to `SPECKIT_STATE_ENV_BY_KIND` (`R/scripts/fanout-run.cjs`). Verify: with a shim, the built command holds `-p` or `--prompt-file`, `--output-dir <lineage>/`, `--trust`, `--model <alias>` and a lineage-local `VIBE_HOME`, and a missing binary, a wrong version and an off-roster alias each throw.
- [x] T011 Record a per-lineage outcome read from `export.json` in the result field T005 named (`R/scripts/fanout-run.cjs`). Verify: exit 0 with an export records success, exit 3 with an export records partial and is not counted as succeeded, and exit 3 or exit 0 without an export records failure.
- [x] T012 Add unit cases for T006 to T011 (`R/tests/unit/`). Verify: each new case fails on the T001 tree and passes after the change.
- [x] T013 Add the stress fixture, including a shim that writes an export with `exit_code` 3 and exits 3 (`S/cli-mistral-vibe.vitest.ts`). Verify: it runs the adapter against the shim and prints zero failures.
- [x] T014 Add the kind to the live contract (`S/live-contracts.json`). Verify: the file parses and `rg -c 'cli-mistral-vibe' S/live-contracts.json` prints at least 1.
- [x] T015 Add the kind to the matrix (`S/matrix-manifest.ts`). Verify: `rg -c 'cli-mistral-vibe' S/matrix-manifest.ts` prints the same count as `cli-deepseek-harness` does there.
- [x] T016 Add the `if_cli_mistral_vibe` branch that refuses single-executor use and names `--count=2` or a second `--executor` group (`.skilled/commands/deep/assets/deep-research-auto.yaml`). Verify: `rg -n 'if_cli_mistral_vibe' .skilled/commands/deep/assets/deep-research-auto.yaml` prints one line.
- [x] T017 Add the same branch (`.skilled/commands/deep/assets/deep-review-auto.yaml`). Verify: `rg -n 'if_cli_mistral_vibe' .skilled/commands/deep/assets/deep-review-auto.yaml` prints one line.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Run the executor unit suites (`R/tests/unit/`). Verify: the three files print zero failures and more than 365 passing tests.
- [x] T019 Run the stress suite (`S/`). Verify: `npx --no-install vitest run --no-coverage tests/stress/cli-adapter` prints zero failures and more passes than the T002 baseline, and the exit 3 shim case records partial.
- [x] T020 Pass the adapter's command through phase 007's preflight (`.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs`). Verify: `evaluateDispatch(<command buildVibeLineageCommand built>, '.skilled/skills')` returns `[]`.
- [x] T021 Run one keyed Vibe research lineage beside a second executor group, the smallest run the T016 branch accepts (`R/scripts/fanout-run.cjs`). Verify: the Vibe lineage writes its iteration file and its `export.json` has `exit_code` 0.
- [x] T022 Confirm the operator's Vibe home is untouched (`~/.vibe`). Verify: `find ~/.vibe -newer <marker written before T021>` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the T021 lineage's `export.json` is recorded in goal.md section 4
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Goal**: See `goal.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

Each check below names the task whose Verify clause answers it.

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A task blocked on `MISTRAL_API_KEY` is marked `[B]` with the reason in goal.md, and the phase stays open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The unit baseline of 365 is recorded (T001)
- [x] CHK-002 [P0] The roster aliases and their `thinking` values are read from phase 006's config (T003)
- [x] CHK-003 [P1] Phase 007's Vibe hard rules pass in the dispatch hook suites
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The runtime type-checks with the new kind in every exhaustive `Record<ExecutorKind, ...>` table (T006)
- [x] CHK-011 [P0] A missing binary, a wrong version and an off-roster alias each throw before launch (T010)
- [x] CHK-012 [P1] The adapter follows `buildDshLineageCommand`'s preflight order: PATH, version, roster, lineage folder
- [x] CHK-013 [P1] No code comment carries a packet, phase or task id
- [x] CHK-014 [P1] The command the adapter builds passes phase 007's preflight with no violation (T020)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] CHK-021 [P0] One keyed Vibe lineage completes a research iteration (T021)
- [x] CHK-022 [P1] Exit 3 records partial and a missing `export.json` records failure (T011, T019)
- [x] CHK-023 [P1] An inherited `VIBE_HOME` is replaced by the lineage's own (T009)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] `MISTRAL_API_KEY` reaches Vibe through the environment only, never through argv (T010)
- [x] CHK-031 [P0] An off-roster model alias is refused before launch (T007, T010)
- [x] CHK-032 [P1] No lineage writes to the operator's `~/.vibe` (T022)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` name the same requirements
- [x] CHK-041 [P1] Each new table row carries a comment with its reason, as the dsh rows do
- [x] CHK-042 [P2] The deep-loop runtime README names the new kind, if it lists kinds. Not applicable: the README lists no kinds
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Keyed-run evidence stays in `scratch/` until it is quoted in goal.md. Deviation: it lives in `research/keyed-lineage-run/`, recorded in goal.md
- [x] CHK-051 [P1] `scratch/` holds no `VIBE_HOME` or key material at close
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
