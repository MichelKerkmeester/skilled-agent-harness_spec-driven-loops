---
title: "Tasks: Phase 2: idempotency-and-near-duplicate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "memory save idempotency receipt tasks"
  - "retry-safe memory write replay"
  - "near_duplicate_of advisory hint"
  - "last_dedup_checked_at dedup marker"
  - "duplicate row on retried save"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/002-memory-store-and-search/005-memclaw-derived-memory-hardening/002-idempotency-and-near-duplicate"
    last_updated_at: "2026-06-10T11:05:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented idempotency receipts and near-duplicate hints"
    next_safe_action: "Run next phase after validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-idempotency-and-near-duplicate"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: idempotency-and-near-duplicate

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

- [x] T001 Add the idempotency-receipt table (server-derived operation/content/request fingerprint key + stored prior-response payload) plus `near_duplicate_of` and `last_dedup_checked_at` columns on `memory_index`, via an idempotent numbered migration (`.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts`) Evidence: SCHEMA_VERSION is 36; schema compatibility and migration refinement tests pass.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add the pre-mutation replay wrapper for `memory_save`/`memory_update`: derive the receipt key, look it up before the write, replay the prior response on a hit-match, fail closed on a hit-mismatch, proceed on a miss; record the receipt inside the write transaction (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-update.ts`) Evidence: new receipt tests prove replay and conflict; source-order test proves replay returns before indexing/response hooks.
- [x] T003 Add retry-vs-content classification on top of the existing `content_hash` / `checkExistingRow` / `checkContentHashDedup` checks: separate "same retry" from "same content already exists" from "same key, changed payload" (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/dedup.ts`) Evidence: `classifyRetryVsContent` added and covered by receipt/conflict plus existing content-hash dedup canaries.
- [x] T004 Compute the deterministic advisory `near_duplicate_of` + similarity metadata post-embedding only, against a fixed threshold, skipping silently when no embedding exists (`.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts`) Evidence: new near-duplicate tests cover advisory, no-embedding skip, and flag-off skip.
- [x] T005 Record the `last_dedup_checked_at` marker alongside enrichment state and short-circuit rescans for rows unchanged since that marker (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/enrichment-state.ts`) Evidence: marker short-circuit and clear behavior covered in the new suite.
- [x] T006 Carry `replayed:true` and the single `near_duplicate_of` hint on the existing response envelope, and suppress reconsolidation on a replayed write (`.opencode/skills/system-spec-kit/mcp_server/handlers/save/response-builder.ts`, `.opencode/skills/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts`) Evidence: replay returns stored response before normal save response hooks; response builder carries `near_duplicate_of`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] vitest: identical retry of `memory_save`/`memory_update` creates 0 duplicate rows and replays the prior success with `replayed:true`; a same-key/changed-payload retry fails closed (`.opencode/skills/system-spec-kit/mcp_server`) Evidence: targeted Vitest run passed 16 files, 214 tests, 53 skipped.
- [x] T008 [P] vitest: `near_duplicate_of` surfaces as exactly one inline advisory hint (never a rejection/queue), is skipped when no embedding exists, and a row unchanged since `last_dedup_checked_at` is not rescanned (`.opencode/skills/system-spec-kit/mcp_server`) Evidence: `memory-idempotency-and-near-duplicate.vitest.ts` passed.
- [x] T009 Update the memory-system docs to describe the idempotency receipt, the `replayed:true` flag, and the advisory near-duplicate behavior (`.opencode/skills/system-spec-kit/mcp_server`) Evidence: `ENV_REFERENCE.md` documents `SPECKIT_MEMORY_IDEMPOTENCY`; this summary documents behavior.
- [x] T010 Manual MCP verification: a retried save replays the prior success and a near-duplicate appears as a single inline advisory hint, never a block or queue (`.opencode/skills/system-spec-kit/mcp_server`) Evidence: covered by in-memory MCP envelope tests; no live daemon/manual DB mutation run by request.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed by targeted in-memory MCP envelope tests
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
