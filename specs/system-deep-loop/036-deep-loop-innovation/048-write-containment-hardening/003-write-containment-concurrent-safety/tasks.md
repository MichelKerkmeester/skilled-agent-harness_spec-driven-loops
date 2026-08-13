---
title: "Tasks: Write-Containment Concurrent-Writer Safety"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "write containment tasks"
  - "preserve untracked task list"
importance_tier: "critical"
contextType: "implementation"
parent: "system-deep-loop"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/048-write-containment-hardening/003-write-containment-concurrent-safety"
    last_updated_at: "2026-08-11T14:03:33Z"
    last_updated_by: "codex"
    recent_action: "Preserved the shipped tasks while reopening moved-packet metadata closeout"
    next_safe_action: "Refresh continuity after packet paths are clean."
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts"
      - ".opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts"
    session_dedup:
      fingerprint: "sha256:047768ec731e89bd4ff48194f382c5308ffcc55c8bd85add676017356048460d"
      session_id: "2026-08-06-deep-loop-046"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Write-Containment Concurrent-Writer Safety

<!-- SPECKIT_LEVEL: 2 -->
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

Status: In Progress - the fix, tests, and typecheck are shipped; moved-packet metadata closeout remains open.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the exact symptom with a negative control run (expected `preserved_untracked`, got `removed_untracked`; advisories empty) (`write-containment.vitest.ts`)
- [x] T002 Confirm the `rmSync` delete branch as the root cause (`write-containment.ts`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Remove the `rmSync` import and the delete branch from `revertOutOfScopeViolations` (`write-containment.ts`)
- [x] T004 Add `preserved_untracked` to `ContainmentRevertAction.action` and use it for not-in-HEAD paths (`write-containment.ts`)
- [x] T005 Add `advisories` to `EnforceResult`; partition into fatal `violations` (in-HEAD) and non-fatal `advisories` (not-in-HEAD) (`write-containment.ts`)
- [x] T006 Update `fanout-run.cjs` to log every containment event and fail the iteration only when `containment.violations.length > 0` (`fanout-run.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Flip the untracked-delete assertions to preservation assertions (`write-containment.vitest.ts`)
- [x] T008 Add a concurrent-writer regression proving a not-in-HEAD file is preserved as a non-fatal advisory (`write-containment.vitest.ts`)
- [x] T009 Add a mixed fatal-tracked + advisory-untracked regression case (`write-containment.vitest.ts`)
- [x] T010 Run `npx vitest run tests/unit/write-containment.vitest.ts` (cwd `.opencode/skills/system-deep-loop/runtime`) - 18/18 passed
- [x] T011 Run `npx tsc --noEmit -p tsconfig.json` - 0 errors attributable to this change
- [x] T012 Confirm `rg rmSync write-containment.ts` returns no match
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Metadata Closeout

- [ ] T013 Refresh continuity fingerprints after the moved packet's paths are clean (`description.json`, packet docs)
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Unit suite and typecheck both green
- [x] Spec-doc packet (spec/plan/tasks/checklist/implementation-summary) authored and validated
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Code**: `write-containment.ts`, `fanout-run.cjs`, `write-containment.vitest.ts`
<!-- /ANCHOR:cross-refs -->
