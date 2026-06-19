---
title: "Tasks: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry"
description: "Task Format: T### [P?] Description (file path). All tasks PENDING — Q2-C1 is not yet implemented and is gated on owner sign-off (REQ-000)."
trigger_phrases:
  - "Q2-C1 tasks parser transient fatal"
  - "code graph bounded retry tasks"
  - "parser skip-list self-heal tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/007-007-parser-resilience"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author Q2-C1 parser-resilience task breakdown (all pending; sign-off gated)"
    next_safe_action: "Resolve T000 owner sign-off before any implementation task"
    blockers:
      - "T000 owner sign-off blocks all build tasks"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-007-parser-resilience"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "T000 owner sign-off on reversing no-self-heal"
    answered_questions:
      - "No schema migration required — reuses durable attempt_count"
---

# Tasks: Code Graph Q2-C1 — Transient/Fatal Parser Skip-List with Bounded Retry

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

**Status:** All tasks PENDING — Q2-C1 is **not** shipped (absent from 030 spec §14; only Code-Graph Q4-C1 shipped in Wave-0). Every build task is **blocked** on T000 owner sign-off, since Q2-C1 deliberately reverses the documented "must not auto-unskip / no self-heal" stance.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-0 -->
## Phase 0: Sign-off Gate (HARD precondition)

- [ ] T000 [B-until-resolved] Secure explicit owner sign-off to reverse the "must not auto-unskip / no self-heal" stance for the TRANSIENT class (`mcp_server/lib/parser-skip-list.ts:93-97`) — REQ-000; all build tasks blocked until recorded
<!-- /ANCHOR:phase-0 -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm the durable `attempt_count` budget and the permanent-skip no-op (`mcp_server/lib/parser-skip-list.ts:78-91, 93-97`) — evidence: research iter-002 finding 8, `f2-8`
- [ ] T002 [B] Confirm the parse-error catch + empty-node isolation return (`mcp_server/lib/structural-indexer.ts:1254-1262`)
- [ ] T003 [B] Enumerate the TRANSIENT (WASM OOM / timeout / deadline-abort) vs FATAL error-string mapping; default ambiguous → FATAL (fail-closed) — REQ-007; evidence: `consolidation.md:60-68`
- [ ] T004 [B] Decide the `max_retries` surface (config, default 5) and whether a `retry_class` column is needed (`mcp_server/lib/code-graph-db.ts:203-211`)
- [ ] T005 [B] Capture baseline: parser-skip-list / structural-indexer vitest suite green
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [B] Add the transient/fatal axis + `max_retries` ceiling to the skip-list policy; reuse the durable `attempt_count` as the budget (`mcp_server/lib/parser-skip-list.ts`) — REQ-001/002
- [ ] T007 [B] Make `lookupSkipList` return "skip" only for FATAL or exhausted-TRANSIENT; a TRANSIENT-under-budget file stays eligible for re-attempt (`mcp_server/lib/parser-skip-list.ts`) — REQ-001
- [ ] T008 [B] Promote an exhausted TRANSIENT (`attempt_count >= max_retries`) to FATAL (`mcp_server/lib/parser-skip-list.ts`) — REQ-002
- [ ] T009 [B] Classify the caught error TRANSIENT vs FATAL at the structural-indexer catch before `addToSkipList`; preserve the empty-node isolation return (`mcp_server/lib/structural-indexer.ts:1254-1262`) — REQ-004/007
- [ ] T010 [B] Lift `recordSuccess` into a TRANSIENT self-heal (clear/heal a TRANSIENT entry on a clean re-parse; FATAL stays manual-review-only) (`mcp_server/lib/parser-skip-list.ts:93-97`) — REQ-005, the reversed contract
- [ ] T011 [B] [P] (If needed) declare an additive `retry_class` column on `parser_skip_list` (`mcp_server/lib/code-graph-db.ts:203-211`) — additive only, no destructive migration
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 [B] [P] Transient-self-heal test: a TRANSIENT file re-enters the graph when it next parses cleanly (`mcp_server/tests/*.vitest.ts`) — REQ-001/005
- [ ] T013 [B] [P] Exhaustion→fatal test: a TRANSIENT file failing `max_retries` times is permanently skipped; durable budget not reset by a mid-scan crash (`mcp_server/tests/*.vitest.ts`) — REQ-002
- [ ] T014 [B] [P] Fatal-from-first test: a FATAL file is skipped immediately, no re-attempt (`mcp_server/tests/*.vitest.ts`) — REQ-003
- [ ] T015 [B] [P] Poison-pill isolation test: a scan with one crashing file still indexes every other file (`mcp_server/tests/*.vitest.ts`) — REQ-004
- [ ] T016 [B] [P] Error→class mapping test incl. unknown-defaults-to-FATAL; B1/B2/OTHER cohort labels unchanged (`mcp_server/tests/*.vitest.ts`) — REQ-006/007
- [ ] T017 [B] `tsc` + build pass; focused parser-skip-list / structural-indexer suite green; `validate.sh --strict` on this folder green
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T000 owner sign-off recorded (REQ-000)
- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Verification passed (transient self-heal, exhaustion→fatal, fatal-from-first, poison-pill isolation; durable-budget; `validate.sh --strict` green)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/iterations/iteration-002.md` (Q2 findings 8/9/10), `../research/deltas/iter-002.jsonl` (`f2-8`, `cand-Q2-C1`)
- **External source**: `../../external/aionforge-memory-development/docs/consolidation.md:60-68`
- **Shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Q2-C1 absent — PENDING)
<!-- /ANCHOR:cross-refs -->
