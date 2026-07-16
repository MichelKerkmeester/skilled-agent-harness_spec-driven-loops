---
title: "Tasks: Governance Retention Decouple"
description: "Task checklist mapped to packet acceptance criteria."
trigger_phrases:
  - "governance retention decouple tasks"
  - "ephemeral retention acceptance tasks"
  - "ADR-002 Option A tasks"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple"
    last_updated_at: "2026-05-14T11:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Task list completed with evidence."
    next_safe_action: "No code task remains in this child packet."
---

# Tasks: Governance Retention Decouple

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [evidence]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read packet spec (`spec.md`) [done]
- [x] T002 Read ADR-002 council file [done]
- [x] T003 Read source governance helper (`scope-governance.ts`) [done]
- [x] T004 Read memory-save call site for context (`memory-save.ts`) [done]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add `DEFAULT_EPHEMERAL_TTL_MS` to source governance helper [done]
- [x] T006 Decouple ephemeral retention from governance trigger logic [done]
- [x] T007 Default non-governed ephemeral `deleteAfter` to 24h [done]
- [x] T008 Preserve explicit ephemeral `deleteAfter` values [done]
- [x] T009 Mirror source behavior to dist JS [done]
- [x] T010 Add `governance-ephemeral-decouple.vitest.ts` [done]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run focused vitest [3/3 passed]
- [x] T012 Run existing governance regression vitests [30/30 passed]
- [x] T013 Create sandbox spec for live save verification [done]
- [x] T014 Verify live save returns positive id and non-null `delete_after` [id `3372`]
- [x] T015 Attempt `memory_search` top-3 verification [blocked by llama-cpp Metal context failure]
- [x] T016 Delete saved memory and remove sandbox directory [done]
- [x] T017 Write plan, tasks, checklist, and implementation summary [done]
- [x] T018 Mark packet metadata complete [done]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`.
- [x] Focused tests passing.
- [x] Existing governance tests passing.
- [x] Live save/delete cleanup verified.
- [x] Search provider blocker documented.
- [x] Checklist filled with evidence.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Specification: `spec.md`
- Plan: `plan.md`
- Checklist: `checklist.md`
- Implementation Summary: `implementation-summary.md`

<!-- /ANCHOR:cross-refs -->
