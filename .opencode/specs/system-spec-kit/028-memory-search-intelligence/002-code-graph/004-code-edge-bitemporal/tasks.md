---
title: "Task Breakdown: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)"
description: "Per-candidate task breakdown for the DEFER-speculative Code Graph schema-migration cluster — every candidate is PENDING (gated), none shipped in 030; the only active task this phase is recording the DEFER decision."
trigger_phrases:
  - "code edge bitemporal tasks"
  - "q1-c1 cluster tasks"
  - "code graph migration deferred tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/004-code-edge-bitemporal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author code-edge-bitemporal task breakdown from 028/002 research"
    next_safe_action: "Record DEFER; do not start migration tasks until gate is met"
    blockers:
      - "All implementation tasks blocked on Q6-C1 + a named as-of consumer"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-004-code-edge-bitemporal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Task Breakdown: Code-Edge Bi-temporal Lifecycle (Q1-C1 cluster)

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

**Candidate status legend**: ALL FIVE candidates (`Q1-C1`, `Q1-C1-code-edge-bitemporal`, `Q1-C1-views`, `CG-edge-bitemporal-lifecycle`, `CG-symbol-timeline-query`) = **PENDING (gated, DEFER-speculative)**. None shipped in 030 (030 §3/§14: Code Graph shipped Q4-C1 only; Q1-C1 listed DEFER-speculative). Every implementation task below is `[B]` Blocked on the gate (Q6-C1 + a named as-of consumer). The only active task this phase is recording the DEFER decision.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

The Gate — the only active work this phase. Record the DEFER-speculative decision and confirm the gate dependencies are unmet; no migration work starts.

- [ ] T001 Record DEFER-speculative decision: no as-of/time-travel consumer found across 200 iterations (decision-record.md ADR-001)
- [ ] T002 Record that the cluster does NOT fix the real edge-staleness bug (dependency-transitivity) → route to sibling `002-edge-staleness-correctness`
- [ ] T003 [P] Record standalone CG-edge-bitemporal-lifecycle as REFUTED (per-scan DELETE+INSERT rebuild fights never-delete; tombstones `:247-260` already cover deletion-history; 002 iter-013) (ADR-003)
- [ ] T004 [P] Confirm the gate dependencies are unmet: Q6-C1 not built, closed-vocab not built, no named consumer (plan.md §6)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

ALL deferred — every task below is `[B]` Blocked on the gate (Q6-C1 + closed-vocab + a named as-of consumer). Nothing here ships this phase.

### Candidate: Q1-C1 / Q1-C1-code-edge-bitemporal (M, BUILD schema migration) — PENDING (gated)
- [ ] T010 [B] Add `valid_at`/`invalid_at` columns to `code_edges` (`code-graph-db.ts:177-184`); SCHEMA_VERSION 5->6 (`:142`); additive ALTER in `ensureSchemaMigrations()` (`:511`) — BLOCKED on Q6-C1 + closed-vocab
- [ ] T011 [B] Replace the 4 reindex DELETE sites (`:941,:985,:1012,:1031`) with `UPDATE ... SET invalid_at = <generation>` + INSERT new — BLOCKED on Q1-C1 columns + Q6-C1 generation
- [ ] T012 [B] Default read filter `invalid_at IS NULL` (via the live-view, T020) — BLOCKED on Q1-C1-views
- [ ] T013 [B] Reconcile the `code_edges` validity-window shape with Memory C3-B (`007-bitemporal-window`) — shared shape, no fork — BLOCKED on C3-B shape decision
- [ ] T014 [B] [P] Trace the bi-temporal commit-time=event-time mapping end-to-end (dangling-prune contract `:957-968` + cross-file CALLS resolver — currently INFERRED) before relying on it

### Candidate: Q1-C1-views (the keystone) — PENDING (gated)
- [ ] T020 [B] `CREATE VIEW code_nodes_live`/`code_edges_live` `WHERE invalid_at IS NULL` — the single current-view chokepoint; co-ships ATOMICALLY with T010 in ONE migration (002 iter-023 Phase 2) — BLOCKED on Q1-C1 columns
- [ ] T021 [B] Route ALL default reads through the live-view; the as-of/audit reader (T030) deliberately bypasses (002 iter-018 keystone) — BLOCKED on T020
- [ ] T022 [B] [P] apply-once G2 invariant: a rescan of unchanged content is a no-op (same edge ids, same windows, generation unchanged) — BLOCKED on T011

### Candidate: CG-edge-bitemporal-lifecycle (H/L, edge-granularity) — PENDING (gated, standalone REFUTED)
- [ ] T030 [B] Edge-write close-and-replace on relabel (one current edge per ordered pair) layered ON TOP OF Q1-C1 columns (`structural-indexer.ts` edge-write) — NEVER standalone (REFUTED 002 iter-013) — BLOCKED on Q1-C1 columns
- [ ] T031 [B] Reconcile with tombstones (`:247-260`): lifecycle is versioning, NOT a deletion-log; do not duplicate the existing deletion-history machinery — BLOCKED on T030
- [ ] T032 [B] [P] Decide whether 1.0-confidence structural edges (CONTAINS/IMPORTS) stay replace-in-place while only heuristic edges (CALLS/TESTED_BY) get versioning (open question, 002 iter-009)

### Candidate: CG-symbol-timeline-query (the as-of read) — PENDING (gated, needs a consumer)
- [ ] T040 [B] As-of read over the Q1-C1 columns ("call graph at generation/commit N") that bypasses the live-view — BUILD ONLY IF a real consumer is named — BLOCKED on a named consumer
- [ ] T041 [B] Unsatisfiable generation surfaces an ERROR, never silently-stale edges (Q6-C1 contract) — BLOCKED on Q6-C1
- [ ] T042 [B] [P] Intersect any PPR-reached set (Q3-C1, separate candidate) with the `invalid_at IS NULL` current set — BLOCKED on Q1-C1 + Q3-C1
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Deferred — blocked on Phase 2, except T056 (the strict-validation gate on the gated docs, which IS active this phase).

- [ ] T050 [B] Unit test: apply-once G2 invariant (no-change rescan = no-op: same ids, windows, generation)
- [ ] T051 [B] Unit test: non-destructive supersede (reindex UPDATEs `invalid_at`, INSERTs new, deletes nothing); as-of read resolves the closed edge at the prior generation
- [ ] T052 [B] Unit test: live-view chokepoint (default reads see only `invalid_at IS NULL`; only the timeline reader bypasses)
- [ ] T053 [B] Unit test: unsatisfiable generation errors (never silently-stale)
- [ ] T054 [B] Static grep gate: `DELETE FROM code_edges` returns only sanctioned sites; reindex DELETEs replaced
- [ ] T055 [B] Typecheck + focused code-graph reindex/read suite green
- [ ] T056 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` exit 0 (active this phase — validates the gated docs)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] DEFER decision recorded (Phase 1 active tasks); all five candidates marked PENDING (gated) with their gate
- [ ] `validate.sh --strict` passes on this folder (T056)
- [ ] No implementation task started before the gate is met (Q6-C1 + closed-vocab + a named as-of consumer)
- [ ] (IF un-deferred) all `[B]` tasks unblocked in dependency order; apply-once G2 invariant + live-view tests green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research**: `../research/iterations/iteration-018.md` (aionforge schema reference), `iteration-023.md` (build sequence), `iteration-013.md` (standalone REFUTED), `iteration-009.md` (edge-governance cluster)
- **Shipped evidence**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (Code Graph shipped Q4-C1 only; Q1-C1 = DEFER-speculative, never implemented)
- **Shared bi-temporal sibling**: `../../001-speckit-memory/007-bitemporal-window/` (Memory C3-B validity-window shape)
<!-- /ANCHOR:cross-refs -->
