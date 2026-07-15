---
title: "Task Breakdown: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Per-candidate task breakdown, skip-closed-in-sweep pre-checked as SHIPPED (030 e1c6a3c793). MEM-fact-invalidation-event-time spearhead, C3-B four-timestamp window, GR-temporal-ordering-invalidation and C3-D note pending."
trigger_phrases:
  - "bitemporal window memory tasks"
  - "event-time invalidation tasks"
  - "four timestamp window tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-07-04T17:51:08.870Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window task breakdown from 028/001 research"
    next_safe_action: "Start T010 spearhead (single-site invalidateEdge change)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Bi-temporal Window for Spec-Kit Memory Causal + Lineage

<!-- SPECKIT_LEVEL: 3 -->
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

**Candidate status legend**: `skip-closed-in-sweep` = SHIPPED (030 `e1c6a3c793`). `C3-B` schema-migration foundation = DONE in this implementation. `MEM-fact-invalidation-event-time`, `GR-temporal-ordering-invalidation` and behavior consumers remain PENDING/deferred.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm spearhead writer seam `invalidateEdge()` stamps `now()` (`lib/graph/temporal-edges.ts:81,86,94`)
- [ ] T002 Confirm the three current-edge readers use binary `IS NULL` (`temporal-edges.ts:108-138`, `contradiction-detection.ts:75-77,99-110`, `frontmatter-promoter.ts` `openEdgeClause`)
- [ ] T003 [P] Decide + record canonical event-time source = lineage. Causal `invalid_at` is a derived projection (decision-record.md ADR-001)
- [ ] T004 [P] Confirm whether lineage already carries `valid_from`/`valid_to`/`ingested_at` (only `expired_at` missing per 005 iter-019/024/035)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Candidate: skip-closed-in-sweep, SHIPPED (030 `e1c6a3c793`)
- [x] T005 Add `AND invalid_at IS NULL` (`openEdgeClause`) to the promoter cleanup query so already-closed generated edges are skipped (`lib/causal/frontmatter-promoter.ts`), SHIPPED `e1c6a3c793` (030 §14 row 9)
- [x] T006 Schema-aware guard: clause only applied when `columns.has('invalid_at')` (fixtures without the column stay compatible), SHIPPED `e1c6a3c793`

### Candidate: MEM-fact-invalidation-event-time (H/S, spearhead), PENDING
- [ ] T010 Change `invalidateEdge()` to accept/derive the close timestamp from lineage event-time instead of `new Date().toISOString()` (`lib/graph/temporal-edges.ts:81,86,94`)
- [ ] T011 Fail-open fallback: when no lineage event-time is available, fall back to `now()` so the edge still closes (preserve the `console.warn`-no-throw contract)
- [ ] T012 [P] Verify reader-transparency: no `WHERE invalid_at < now()` reader introduced. Readers stay on `IS NULL` (grep gate)

### Candidate: C3-B four-timestamp window (M, additive), PENDING
- [x] T020 Declare the four-timestamp window once in the schema: event-time `valid_from`/`valid_to` + txn-time `ingested_at`/`expired_at` (`lib/search/vector-index-schema.ts`), reconciling causal-edge vs lineage column shapes (unify, do not fork a third store), v38 UP/BACKFILL/DOWN implemented.
- [x] T021 Keep existing single `valid_at`/`invalid_at` readers byte-identical (additive columns nullable, unread until a consumer opts in), no recall/currentness reader was enabled. `SPECKIT_BITEMPORAL_RECALL` defaults OFF.
- [x] T022 Confirm additivity against `active_memory_projection` at build, migration touches `causal_edges` and `memory_lineage`. `active_memory_projection` DDL and projection behavior are unchanged, with fresh-init and lineage schema tests passing.

### Candidate: GR-temporal-ordering-invalidation (H/S, NEW), PENDING
- [ ] T030 Add chronology-driven auto-invalidation: when two edges on the same pair conflict, close the chronologically-earlier `valid_at` (`lib/graph/contradiction-detection.ts:75-77,99-110`)
- [ ] T031 Scope the rule to conflicting/superseding relation pairs ONLY (do not invalidate co-valid, non-conflicting same-pair facts)
- [ ] T032 [P] Document deterministic tie-break when two conflicting same-pair edges share an identical `valid_at`

### Candidate: C3-D separation-of-concerns note (S, decision), PENDING
- [ ] T040 [P] Record in decision-record.md: tombstone-sweep ("off-state forgetting", `lib/causal/sweep.ts:68-100`) vs temporal-close ("not current", `temporal-edges.ts:64-80`) are distinct concerns
- [ ] T041 [P] Note skip-closed ships as cheap defensive hardening before C3-A, NOT a data-loss gate (fork is theoretical + tombstone-recoverable, 005 iter-032)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T050 Unit test: closing an edge with a known lineage event-time writes that timestamp (not `now()`). Missing event-time falls back to `now()`
- [ ] T051 Regression test: closed generated edge not re-touched by promoter cleanup (skip-closed fixture), guard is SHIPPED, test reconfirms it
- [x] T052 Unit test: four-timestamp additivity, existing `IS NULL` readers/results byte-identical. v38 up/backfill/down/idempotent/fresh-init tests added.
- [ ] T053 Unit test: chronology invalidation closes earlier-`valid_at` on conflicting pair. Co-valid non-conflicting pair untouched (behavior deferred outside schema-foundation scope)
- [x] T054 Typecheck + focused/broad memory suite verified, `npm run typecheck` exit 0. Focused Vitest `84 passed`. Broad memory/schema/search/migration slice `7 failed | 94 passed` files and `13 failed | 1493 passed | 105 skipped` tests, matching baseline failure count with 6 new passing tests.
- [x] T055 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0, validation passed with 0 errors / 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Schema-foundation tasks marked `[x]` with evidence. Behavior candidates remain explicitly deferred.
- [x] No `[B]` blocked tasks remaining (T022 additivity confirmed at build)
- [x] Reader-transparency invariant holds (no recall/currentness consumer enabled, legacy `invalid_at IS NULL` readers preserved)
- [x] Focused tests, broad baseline comparison and `validate.sh --strict` pass for the schema-foundation scope
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Shipped evidence**: Wave-0 record (skip-closed-in-sweep = `e1c6a3c793`)
<!-- /ANCHOR:cross-refs -->
