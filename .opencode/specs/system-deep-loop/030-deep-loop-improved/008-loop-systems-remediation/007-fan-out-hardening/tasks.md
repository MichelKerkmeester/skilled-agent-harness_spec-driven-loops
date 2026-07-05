---
title: "Tasks: Fan-Out Hardening"
description: "Task list for the detached CLI fan-out hardening fixes."
trigger_phrases:
  - "fan out hardening tasks"
  - "detached cli fanout salvage retry tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/008-loop-systems-remediation/007-fan-out-hardening"
    last_updated_at: "2026-06-30T15:30:00Z"
    last_updated_by: "glm-fanout-review"
    recent_action: "Tracked fan-out hardening remediation"
    next_safe_action: "Phase complete; fixes shipped and verified"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "glm-fanout-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Fan-Out Hardening

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Read fan-out dispatch + prompt construction (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`)
- [x] T002 Read failure classifier (`.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`)
- [x] T003 [P] Read merge lineage selection (`.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs`)
- [x] T004 Run baseline fan-out suite and capture the pre-existing `spawn-cjs.ts` transform failure
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add review setup bindings to `buildLoopPrompt` (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`)
- [x] T006 Add salvage-failure gate before fulfilled return (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`)
- [x] T007 Add `artifact_miss` retry class (`.opencode/skills/deep-loop-runtime/scripts/lib/cli-guards.cjs`)
- [x] T008 Make `--dangerously-skip-permissions` opt-in + add `sandboxMode` to cli-opencode flag support (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`, `lib/deep-loop/executor-config.ts`)
- [x] T009 Add `reconstructReviewRegistryFromState` leaf-only merge fallback (`.opencode/skills/deep-loop-runtime/scripts/fanout-merge.cjs`)
- [x] T010 Map `lag_ceiling_*` events in `statusForLedgerEvent` (`.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs`)
- [x] T011 Fix pre-existing `spawn-cjs.ts` duplicate `opencodeStateDir` (`.opencode/skills/deep-loop-runtime/tests/helpers/spawn-cjs.ts`)
- [x] T012 Author Level-1 docs (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Add exit-0/no-artifact regression test (`.opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts`)
- [x] T014 Add merge reconstruction unit tests (`.opencode/skills/deep-loop-runtime/tests/unit/fanout-merge.vitest.ts`)
- [x] T015 Update executor-config contract test for sandboxMode acceptance (`.opencode/skills/deep-loop-runtime/tests/unit/executor-config.vitest.ts`)
- [x] T016 Repoint playbook to exit-0/no-artifact regression (`.opencode/skills/deep-loop-runtime/manual_testing_playbook/09--fanout/fanout-salvage-recovery.md`)
- [x] T017 Run full deep-loop-runtime Vitest suite (549 tests green)
- [x] T018 Run comment hygiene on modified code files
- [x] T019 Run strict spec validation after metadata refresh
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Direct behavioral verification passed (suite green)
- [x] Full requested Vitest suite passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Source**: `review/lineages/glm/review-report.md`
<!-- /ANCHOR:cross-refs -->
