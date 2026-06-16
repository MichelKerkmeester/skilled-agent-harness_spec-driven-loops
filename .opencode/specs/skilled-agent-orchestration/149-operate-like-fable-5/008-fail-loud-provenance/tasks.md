---
title: "Tasks: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch"
description: "Concrete task list for adding a requested-vs-actual model diff to the deep-loop executor audit and a fallback-router guard, proven by a new vitest. Task Format: T### [P?] Description (file path)."
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/008-fail-loud-provenance"
    last_updated_at: "2026-06-15T14:06:40Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-fail-loud-provenance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Fail-loud executor provenance: requested-versus-actual model comparison in the executor audit, emitting error on mismatch

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Setup here means baseline capture and seam confirmation; no scaffolding is needed since the runtime module and vitest harness already exist.

- [x] T001 Run the baseline suite green before any edit: `executor-audit.vitest.ts`, `fallback-router.vitest.ts`, `dispatch-failure.vitest.ts` (`.opencode/skills/deep-loop-runtime/tests/unit/`). Verify: all pass.
- [x] T002 Confirm the recording seam and types in `.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts` (`buildExecutorAuditRecord` ~485, `DispatchFailureReason`, `emitDispatchFailure`). Verify: `rg -n 'buildExecutorAuditRecord|DispatchFailureReason|emitDispatchFailure'`.
- [x] T003 [P] Confirm `resolveFallback` in `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` branches only on quota-pool, not model approval. Verify: read + `rg -n 'fail-fast|fallback_target'`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add a `model_mismatch` member to the `DispatchFailureReason` union (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`). Verify: type-checks; `rg -n 'model_mismatch'` shows it in the union. (REQ-005)
- [x] T005 Add the requested-vs-actual comparison at the provenance-recording point: compare the recorded actual model to the caller-approved model (normalized), skip on native kind (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`). Verify: new vitest match case writes the record, native case skips. (REQ-002)
- [x] T006 On mismatch, call `emitDispatchFailure(..., 'model_mismatch', ...)` instead of writing a success record (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`). Verify: new vitest mismatch case emits a `dispatch_failure` with reason `model_mismatch` and writes no success record. (REQ-001)
- [x] T007 Add the guard in `resolveFallback` so it never routes to an unapproved model while preserving the configured `fallback_target` route (`.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts`). Verify: new vitest unapproved case returns `fail-fast`; `fallback-router.vitest.ts` stays green. (REQ-003)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Create `executor-provenance-mismatch.vitest.ts` covering mismatch-loud, match-pass, native-skip, approved-fallback-pass, unapproved-substitution-fail-fast (`.opencode/skills/deep-loop-runtime/tests/unit/`). Verify: `npx vitest run tests/unit/executor-provenance-mismatch.vitest.ts` passes. (REQ-001, REQ-002, REQ-003)
- [x] T009 Confirm the crash path stays loud: a lost-provenance crash routes through `emitDispatchFailure` with `crash`, never a silent return (`.opencode/skills/deep-loop-runtime/lib/deep-loop/executor-audit.ts`). Verify: `rg -n "'crash'"` plus vitest or read of the close/error handlers. (REQ-004)
- [x] T010 Mutation check: temporarily revert the comparison, confirm the mismatch test goes RED, then restore. Verify: test bites (true-RED), not vacuous green.
- [x] T011 Run the full skill vitest suite and `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/149-operate-like-fable-5/008-fail-loud-provenance --strict`; sync spec/plan/tasks/checklist. Verify: green suite + clean validator.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

