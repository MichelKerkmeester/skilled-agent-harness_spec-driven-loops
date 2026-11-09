---
title: "Tasks: Phase 9: gate3-and-continuity-root"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "gate3 and continuity root tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: gate3-and-continuity-root

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

`SK` is `.skilled/skills/system-spec-kit`. `PROBE` is the scratchpad `g3probe.mjs` that classifies the four probe prompts.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record baselines (`implementation-summary.md`). Verify: cli vitest, spec-gate hook, validation shell suites and corpus counts are written there.
- [x] T002 Reproduce V25, V26, V28, V29 (`spec.md` Measured Behavior). Verify: `node PROBE SK/shared/dist/gate-3-classifier.js` prints `false` for the two failing prompts.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Order-independent mixed write tail and resume always required (`SK/shared/gate-3-classifier.ts`, `SK/runtime/cli/tests/gate-3-classifier.vitest.ts`). Verify: `node PROBE` prints `true` for all four probe prompts after the shared rebuild.
- [x] T004 Refuse a fallback project root in the save path (`SK/runtime/cli/core/config.ts`, `SK/runtime/cli/continuity/generate-context.ts`, a cli test). Verify: a save from a non-repository directory exits non-zero and names `--project-root`.
- [x] T005 Probe the CLI writer at install and fix the repair text (`.skilled/commands/doctor/assets/doctor-install.yaml`, `doctor-install-presentation.txt`, `SK/runtime/cli/spec/validate.sh`). Verify: `rg -n 'cli/dist/continuity/generate-context.js' .skilled/commands/doctor/assets/doctor-install*` prints both files.
- [x] T006 Resolve create.sh templates from its own skill and document the override (`SK/runtime/cli/spec/create.sh`, `SK/runtime/ENV-REFERENCE.md`). Verify: create.sh in a scratch git repository with no `.skilled` tree creates the folder.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rebuild `shared` and `runtime/cli` dist in the worktree and rerun every baseline. Verify: counts in `implementation-summary.md` match or exceed baseline.
- [x] T008 Cross-family review of the phase diff by DeepSeek. Verify: review verdict recorded in `decision-record.md`.
- [x] T009 Strict validation of this folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the four probe prompts print `true`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decisions**: See `decision-record.md`
- **Findings**: `../research/research.md` section 2, rows V25 to V29
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task after three fix attempts marks the phase Blocked with evidence in `decision-record.md` (goal G7).
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Baselines captured before the first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `npx tsc -p shared/tsconfig.json --noEmit` and the cli typecheck exit 0
- [x] CHK-011 [P0] `bash -n` passes on `validate.sh` and `create.sh`
- [x] CHK-012 [P1] No spec path or finding id in any changed code comment
- [x] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Probe prompts and create.sh scratch run checked by hand
- [x] CHK-022 [P1] Labeled corpus holds 191 of 195 or better with no agreeing row flipped
- [x] CHK-023 [P1] Fallback-root refusal exits non-zero
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Classes: V25 algorithmic, V26 algorithmic, V27 cross-consumer, V28 class-of-bug, V29 instance-only (three sites in one file).
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n 'TEMPLATES_BASE=|REPO_ROOT/.skilled' create.sh` shows no caller-repo template path left.
- [x] CHK-FIX-003 [P0] Consumer inventory: hook and corpus runner rerun through the rebuilt `shared/dist`.
- [x] CHK-FIX-004 [P0] Classifier matrix: write before and after read-only, each joiner, resume with and without read-only word.
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed in `implementation-summary.md`.
- [x] CHK-FIX-006 [P1] Hostile cwd variant: save run from a directory outside any repository.
- [x] CHK-FIX-007 [P1] Evidence pinned to this phase's commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] A save cannot write into a repository the operator did not name
- [x] CHK-032 [P1] N/A: no auth surface in this phase
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Classifier decision-order comment matches the code
- [x] CHK-042 [P2] `SPECKIT_TEMPLATES_BASE` documented in `ENV-REFERENCE.md`
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Probe scripts and logs live in the session scratchpad, not the worktree
- [x] CHK-051 [P1] scratch/ holds only its `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-09
<!-- /ANCHOR:summary -->

---
