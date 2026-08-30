---
title: "Tasks: Phase 1: Production Database Isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "production db isolation tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: Production Database Isolation

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

- [ ] T001 Answer the resolver-wide vs test-scoped question in spec.md open questions
- [ ] T002 Grep for callers that depend on the root config include globs (`.opencode/skills/system-spec-kit/vitest.config.ts`)
- [ ] T003 Capture the pre-fix negative control: resolved DB path from a `scripts/`-rooted run
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Reconcile the two configs: share `setupFiles` or delete the root config (`.opencode/skills/system-spec-kit/vitest.config.ts`)
- [ ] T005 Add the fail-closed refusal in the shared path resolver
- [ ] T006 [P] Add the config-drift check that fails on an unguarded `mcp-server/tests/**` glob
- [ ] T007 [P] Add the negative-control test asserting the resolved path is never the production directory
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run the negative control; confirm it now fails closed
- [ ] T009 Run from all three working directories; confirm a throwaway dir each time
- [ ] T010 Run the full suite and compare against the recorded baseline
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Negative control reproduced before the fix and failing closed after
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->

---
