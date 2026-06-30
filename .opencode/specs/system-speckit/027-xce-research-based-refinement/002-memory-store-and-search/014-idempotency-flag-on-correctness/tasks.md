---
title: "Tasks: Idempotency Flag-On Correctness"
description: "Completed task list for fixing default-off memory idempotency correctness when SPECKIT_MEMORY_IDEMPOTENCY is explicitly enabled, including receipt replay, immutable storage, write gating, tests, and Level 2 documentation."
trigger_phrases:
  - "idempotency correctness tasks"
  - "memory receipt tasks"
  - "flag on idempotency tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness"
    last_updated_at: "2026-06-11T12:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed idempotency receipt fixes and regression tests"
    next_safe_action: "Phase complete; preserve final verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The flag remains default-off after correctness fixes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Idempotency Flag-On Correctness

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

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `idempotency-receipts.ts` feature flag, normalization, derive, lookup, and store code [10m]
- [x] T002 Read `memory-save.ts` idempotency lookup/conflict/write branches [15m]
- [x] T003 Read `memory-idempotency-and-near-duplicate.vitest.ts` existing coverage [10m]
- [x] T004 Run existing idempotency/near-duplicate suite with `SPECKIT_MEMORY_IDEMPOTENCY=true` [10m]
- [x] T005 Identify related memory-save suites and Vitest aggregate exclusion behavior [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add replay equality regression test (`tests/memory-idempotency-and-near-duplicate.vitest.ts`) [15m]
- [x] T007 Add immutable repeated-store regression test (`tests/memory-idempotency-and-near-duplicate.vitest.ts`) [15m]
- [x] T008 Add normalization and genuine conflict regression coverage (`tests/memory-idempotency-and-near-duplicate.vitest.ts`) [15m]
- [x] T009 Fix replay to return stored response exactly (`lib/storage/idempotency-receipts.ts`) [10m]
- [x] T010 Fix store to preserve first receipt response (`lib/storage/idempotency-receipts.ts`) [10m]
- [x] T011 Add tested memory-save receipt-write guard (`lib/storage/idempotency-receipts.ts`) [15m]
- [x] T012 Use guard in `memory-save.ts` before storing receipts (`handlers/memory-save.ts`) [10m]
- [x] T013 Add successful-write and skipped failure/duplicate/unchanged coverage (`tests/memory-idempotency-and-near-duplicate.vitest.ts`) [20m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Confirm new tests fail on current code with the flag enabled [10m]
- [x] T015 Run fixed idempotency/near-duplicate suite with the flag enabled [10m]
- [x] T016 Run related memory-save suites with the flag enabled [10m]
- [x] T017 Run idempotency/near-duplicate suite with the flag unset [10m]
- [x] T018 Run `npx tsc --noEmit` from the MCP server directory [10m]
- [x] T019 Run strict spec validation for this phase [10m]
- [x] T020 Run changed-code comment-hygiene checks [10m]
- [x] T021 Create `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, `description.json`, and `graph-metadata.json` [35m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implementation and targeted regression coverage are complete.
- [x] No live `mcp_server/database/**` shard or host daemon was used for tests.
- [x] Parent 027 metadata was not edited.
- [x] Final TypeScript, flag-off test, strict spec validation, and comment-hygiene evidence recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:cross-refs -->
