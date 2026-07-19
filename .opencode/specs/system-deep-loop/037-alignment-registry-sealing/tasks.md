---
title: "Tasks: deep-alignment registry seal-state"
description: "Task breakdown for the sealed-registry fix, mapped to REQ-001..007."
_memory:
  continuity:
    packet_pointer: "system-deep-loop/037-alignment-registry-sealing"
    last_updated_at: "2026-07-19T15:30:00Z"
    last_updated_by: "spec-author"
    recent_action: "Break the fix into tasks T001-T009 mapped to requirements"
    next_safe_action: "Execute tasks in phase order"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/reduce-alignment-state.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: deep-alignment registry seal-state

<!-- ANCHOR:notation -->
## Task Notation

`[x]` done · `[ ]` open · each task cites its REQ and evidence. `[P0]`/`[P1]` mirror the spec priority.

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Add `overall.sealed` in `buildOverallRollup`; default false, set from `integrity.sealed`. (REQ-001) [SOURCE: reduce-alignment-state.cjs `buildOverallRollup`]
- [x] T002 [P0] Thread `options.seal` through `reduceAlignmentState` into the rollup. (REQ-002) [SOURCE: reduce-alignment-state.cjs `reduceAlignmentState`]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 [P0] Parse `--seal` in the CLI; emit `sealed` in stdout JSON; update usage + JSDoc. (REQ-002) [SOURCE: reduce-alignment-state.cjs CLI block]
- [x] T004 [P1] Report banner: PRELIMINARY vs SEALED in `renderAlignmentReport`. (REQ-006) [SOURCE: reduce-alignment-state.cjs `renderAlignmentReport`]
- [x] T005 [P1] `deep-alignment-auto.yaml`: seed-unsealed note, `step_refresh_registry`, synthesis `--seal`. (REQ-004, REQ-005) [SOURCE: deep-alignment-auto.yaml]
- [x] T006 [P1] `deep-alignment-confirm.yaml`: same three edits, mirrored. (REQ-005) [SOURCE: deep-alignment-confirm.yaml]
- [x] T007 [P1] Document `sealed` + lifecycle in `alignment-report-reducer.md`. (REQ-006) [SOURCE: alignment-report-reducer.md §2 + test row]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 [P0] Author `reducer-seal-state.test.cjs` (5 cases). (REQ-002, REQ-003, REQ-004) [TESTED: reducer-seal-state.test.cjs — 5/5]
- [x] T009 [P0] No-regression baseline + reducer suite green; strict validate. (REQ-007) [TESTED: stash baseline; `validate.sh` --strict; suite run]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All T001–T009 done with evidence, both workflows wired identically, and `validate.sh --strict` → Errors 0.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Requirements: `spec.md` §4 (REQ-001..007).
- Plan: `plan.md` §4 phases 1–3.
- Verification: `checklist.md`, `implementation-summary.md`.

<!-- /ANCHOR:cross-refs -->
