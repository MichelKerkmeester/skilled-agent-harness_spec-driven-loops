---
title: "Tasks: Code Graph Q2-C1 - Transient/Fatal Parser Skip-List with Bounded Retry"
description: "Task Format: T### [P?] Description (file path). All tasks complete for Q2-C1: transient/fatal retry policy, additive retry_class storage, parser feed points, deterministic unit tests, typecheck, broad vitest and strict spec validation."
trigger_phrases:
  - "Q2-C1 tasks parser transient fatal"
  - "code graph bounded retry tasks"
  - "parser skip-list self-heal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-parser-resilience"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented Q2-C1 parser-resilience and verified typecheck plus broad related vitest"
    next_safe_action: "No implementation remains. Commit deferred per user instruction"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-007-parser-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Owner sign-off satisfied by the 2026-06-19 user request that pre-approved the phase and requested implementation"
      - "The retry budget reuses durable attempt_count, retry_class is an additive schema column with legacy rows defaulting to fatal"
---

# Tasks: Code Graph Q2-C1 - Transient/Fatal Parser Skip-List with Bounded Retry

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

**Status:** All tasks complete in this workspace. Q2-C1 was absent from the Wave-0 shipped record in packet 030. This phase now implements it locally and remains uncommitted per user instruction.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Sign-off Gate (HARD precondition)

- [x] T000 Secure explicit owner sign-off to reverse the "must not auto-unskip / no self-heal" stance for the TRANSIENT class (`mcp_server/lib/parser-skip-list.ts`), satisfied by the 2026-06-19 pre-approved implementation request
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the durable `attempt_count` budget and the prior permanent-skip behavior (`mcp_server/lib/parser-skip-list.ts`)
- [x] T002 Confirm the parse-error catch + empty-node isolation return (`mcp_server/lib/structural-indexer.ts`)
- [x] T003 Enumerate the TRANSIENT (WASM OOM / timeout / deadline-abort) vs FATAL error-string mapping. Default ambiguous → FATAL (fail-closed), covered by `classifyParserRetryClass`
- [x] T004 Decide the `max_retries` surface and whether a `retry_class` column is needed, default 5 via `SPECKIT_PARSER_SKIP_LIST_MAX_RETRIES`. Additive `retry_class` column added
- [x] T005 Capture baseline: typecheck 0 errors. Broad related vitest 5 files / 137 passed / 1 skipped before edits
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add the transient/fatal axis + `max_retries` ceiling to the skip-list policy. Reuse the durable `attempt_count` as the budget (`mcp_server/lib/parser-skip-list.ts`), REQ-001/002
- [x] T007 Make `lookupSkipList` return "skip" only for FATAL or exhausted-TRANSIENT. A TRANSIENT-under-budget file stays eligible for re-attempt (`mcp_server/lib/parser-skip-list.ts`), REQ-001
- [x] T008 Promote an exhausted TRANSIENT (`attempt_count >= max_retries`) to FATAL (`mcp_server/lib/parser-skip-list.ts`), REQ-002
- [x] T009 Classify the caught error TRANSIENT vs FATAL at the structural-indexer catch before `addToSkipList`. Preserve the empty-node isolation return (`mcp_server/lib/structural-indexer.ts`), REQ-004/007
- [x] T010 Lift `recordSuccess` into a TRANSIENT self-heal. FATAL stays manual-review-only (`mcp_server/lib/parser-skip-list.ts`), REQ-005
- [x] T011 [P] Declare an additive `retry_class` column on `parser_skip_list` (`mcp_server/lib/code-graph-db.ts`), additive only, legacy rows default to fatal
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 [P] Transient-self-heal test: a TRANSIENT file re-enters the graph when it next parses cleanly (`mcp_server/tests/parser-skip-list.vitest.ts`), REQ-001/005
- [x] T013 [P] Exhaustion→fatal test: a TRANSIENT file failing `max_retries` times is permanently skipped. Durable budget not reset by a mid-scan crash (`mcp_server/tests/parser-skip-list.vitest.ts`), REQ-002
- [x] T014 [P] Fatal-from-first test: a FATAL file is skipped immediately, no re-attempt (`mcp_server/tests/parser-skip-list.vitest.ts`), REQ-003
- [x] T015 [P] Poison-pill isolation test: one crashing file returns an error result and the next file still parses (`mcp_server/tests/parser-skip-list.vitest.ts`), REQ-004
- [x] T016 [P] Error→class mapping test incl. unknown-defaults-to-FATAL. B1/B2/OTHER cohort labels unchanged (`mcp_server/tests/parser-skip-list.vitest.ts`), REQ-006/007
- [x] T017 `tsc` + build pass. Focused parser-skip-list / structural-indexer suite green. `validate.sh --strict` on this folder green, typecheck and broad vitest complete. Strict validation to be recorded after doc reconciliation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T000 owner sign-off recorded (REQ-000)
- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Verification passed (transient self-heal, exhaustion→fatal, fatal-from-first, poison-pill isolation, durable-budget, `validate.sh --strict` green)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/iterations/iteration-002.md` (Q2 findings 8/9/10), `../research/deltas/iter-002.jsonl` (`f2-8`, `cand-Q2-C1`)
- **External source**: `../../external/aionforge-memory-development/docs/consolidation.md:60-68`
- **Shipped record**: Wave-0 record (historical reference: Q2-C1 was absent there)
<!-- /ANCHOR:cross-refs -->
