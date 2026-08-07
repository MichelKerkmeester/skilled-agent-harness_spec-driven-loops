---
title: "Tasks: OpenCode Route-Line Bounding"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "route line bounding tasks"
  - "compiled route cap task list"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the task breakdown for bounding the compiled-route line"
    next_safe_action: "Author checklist.md verification items matching the requirements"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: OpenCode Route-Line Bounding

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

Status: Planned - this packet documents the intended implementation; no code has been written yet. All tasks are pending, and Phase 2 is blocked on phase 001 shipping its `policy-plan.ts` registry.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm phase 001's `policy-plan.ts` registry and receipt builder are available to extend (`../001-measurement-and-receipts-foundation/`)
- [ ] T002 Capture the target-count distribution from phase 001's fixture data to choose the bounding cap (`tests/parity/fixtures/policy-plan/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [B] T003 Add the independent flag read (off by default) to the plugin's options loading path (`.opencode/plugins/mk-skill-advisor.js`) - blocked on T001
- [ ] T004 Implement the bounded-mode branch in `renderCompiledRouteSummaryLine` (`+K more` marker plus content digest) (`.opencode/plugins/mk-skill-advisor.js`)
- [ ] T005 Implement the reveal/clarification accessor returning the full target list (`.opencode/plugins/mk-skill-advisor.js`)
- [ ] T006 Register `runtime.opencode-compiled-route.v1` in `policy-plan.ts`, hashing the full target list (`.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Add a fixture with a target list larger than the cap; assert every original name is present in the bounded line or the reveal path (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
- [ ] T008 Add a flag-off parity fixture asserting byte-identical output to the phase 001 unbounded baseline (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
- [ ] T009 Add a digest-stability fixture pair (unchanged target set -> stable digest; changed target set -> changed digest) (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
- [ ] T010 Run the plugin test suite and confirm no regression in existing cases (`.opencode/plugins/tests/mk-skill-advisor.test.cjs`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (T003 unblocks once phase 001 ships)
- [ ] Bounded, flag-off-parity, and reveal-path fixtures all green
- [ ] `runtime.opencode-compiled-route.v1` receipt confirmed stable/unstable per SC-003
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor phase**: `../001-measurement-and-receipts-foundation/`
- **Successor phase**: `../003-opencode-transform-dedup/`
<!-- /ANCHOR:cross-refs -->
