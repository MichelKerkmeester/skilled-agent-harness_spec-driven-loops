---
title: "Feature Specification: Bi-temporal Window for Spec-Kit Memory Causal + Lineage"
description: "Give the Memory MCP causal and lineage edges a correct four-timestamp bi-temporal window (event-time valid_from/valid_to + transaction-time ingested_at/expired_at) and close superseded facts at event-time, not now() — so 'what did we believe as of date X' history is correct while staying reader-transparent."
trigger_phrases:
  - "028 bitemporal window memory"
  - "memory fact invalidation event-time"
  - "four timestamp causal lineage window"
  - "skip closed in sweep causal"
  - "temporal ordering invalidation memory"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/001-speckit-memory/007-bitemporal-window"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author bi-temporal-window impl-phase spec from 028/001 research"
    next_safe_action: "Plan MEM-fact-invalidation-event-time spearhead (H/S reader-transparent)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-001-007-bitemporal-window"
      parent_session_id: null
    completion_pct: 20
    open_questions:
      - "Is the C3-B four-timestamp window additive against active_memory_projection (no migration spec exists to verify)?"
      - "Does lineage already carry valid_from/valid_to/ingested_at, missing only expired_at?"
    answered_questions:
      - "skip-closed-in-sweep is SHIPPED (030 commit e1c6a3c793)"
      - "MEM-fact-invalidation-event-time is the H/S reader-transparent spearhead (single-site invalidateEdge change)"
---

# Feature Specification: Bi-temporal Window for Spec-Kit Memory Causal + Lineage

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The Memory MCP already ships an edge-presence currentness substrate (`SPECKIT_TEMPLATE_EDGES`-gated `valid_at`/`invalid_at` columns on `causal_edges`, an `invalidateEdge()` writer, and `IS NULL`-filtered current-edge readers), but the substrate is bi-temporally *incorrect in two ways*: (1) it carries only a single `valid_at`/`invalid_at` pair, conflating real-world event-time with our transaction-time, and (2) `invalidateEdge()` always stamps `invalid_at = now()` — recording *when we noticed* a fact died rather than *when it actually died*. This phase fixes the spearhead correctness bug (close at event-time, reader-transparent), defines the additive four-timestamp window shared with Code-Graph and lineage, adds chronology-driven supersession scoped to conflicting relation pairs, and records the tombstone-sweep vs temporal-close separation-of-concerns note. The one already-shipped candidate (skip-closed-in-sweep) is referenced for completeness.

**Key Decisions**: lineage is the canonical event-time writer (causal `invalid_at` is a derived projection); retention TTL is EXCLUDED from the bi-temporal consumer set (physical deletion is the opposite of edge-presence currentness — a category error).

**Critical Dependencies**: the four-timestamp window (C3-B) is the shared substrate that gates `GR-temporal-ordering-invalidation`'s full form and the Code-Graph Q1-C1 column shape; the spearhead (`MEM-fact-invalidation-event-time`) ships independently of the migration.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Phase** | `system-spec-kit/028-memory-search-intelligence/001-speckit-memory` (research) |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence` |
| **Subsystem** | Spec-Kit Memory MCP (PRIMARY) — retrieval intelligence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Memory MCP's causal-edge currentness machinery records the wrong time and the wrong number of times. `invalidateEdge()` always writes `invalid_at = new Date().toISOString()` (`lib/graph/temporal-edges.ts:81,86,94`), so a superseded edge is closed at *transaction-time* (when we noticed), never at *event-time* (when the fact actually became stale) — making "what did we believe as of date X" queries wrong. The store carries a single `valid_at`/`invalid_at` pair (`temporal-edges.ts:41,50`) with zero transaction-time columns, so it cannot distinguish event-time from ingest-time at all. Contradiction detection only fires on hand-listed relation-pair conflicts (`CONFLICTING_RELATIONS`), so a newer fact that simply post-dates an older one does not retire it.

### Purpose
Make the causal + lineage temporal model bi-temporally correct: close superseded facts at event-time (reader-transparent), give the edge store the additive four-timestamp window it shares with lineage and Code-Graph, and let chronology resolve conflicting-pair supersession beyond the hand-listed relations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — five candidates (one SHIPPED, four PENDING)
- **`MEM-fact-invalidation-event-time`** (Memory; H/S; **the spearhead**) — derive the close timestamp from lineage event-time, not `now()`, at the single `invalidateEdge()` site. Reader-transparent (all three readers use a binary `IS NULL` test).
- **C3-B** (Memory; M; BUILD-new additive) — four-timestamp window (event-time `valid_from`/`valid_to` + txn-time `ingested_at`/`expired_at`) replacing the single `valid_at`/`invalid_at` pair, declared once in the schema, on causal + lineage.
- **C3-D** (Memory; S; decision note) — document tombstone-sweep ("off-state forgetting") vs temporal-close ("not current") as separate concerns; ship the `AND invalid_at IS NULL` guard as cheap defensive hardening, NOT a data-loss gate.
- **`GR-temporal-ordering-invalidation`** (Memory; H/S; NEW, Wave-1) — when two edges on the same pair conflict, auto-invalidate the chronologically-earlier `valid_at`; scoped to conflicting/superseding relation pairs only.
- **`skip-closed-in-sweep`** (Memory causal; S) — **SHIPPED** (030 commit `e1c6a3c793`); `AND invalid_at IS NULL` on the promoter cleanup so already-closed generated edges are not re-touched. Referenced here for completeness.

### Out of Scope
- **C3-A** (edge-presence currentness as the live retirement path) — read-side build + store reconciliation; depends on C3-B + skip-closed; lives in a later phase. - It is not a flag flip (the flag is already ON) and needs the four-timestamp window first.
- **C3-C** (`TemporalMode` Current/AsOf/AsKnownAt/History on recall) — L effort (~12 JOIN sites / 2 writers against `active_memory_projection`); depends on C3-B; later phase. - Transaction-time recall mode is a substrate consumer, not the substrate.
- **Retention TTL** — physical deletion is the opposite of edge-presence currentness (category error); excluded from the bi-temporal consumer set by explicit decision. - Confusing TTL sweep with temporal-close would fork a third store.
- **Code-Graph Q1-C1** (`code_edges` bi-temporal) — DEFER-speculative; owned by the `002-code-graph` sibling. - Shares only the column shape, not this phase's write path.
- **`active_memory_projection` "Current"-replaces-projection** — the L-effort C3-C reshape. - Out of this phase's additive scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/temporal-edges.ts` | Modify | `invalidateEdge()` accepts/derives an event-time close timestamp from lineage instead of `now()`; add the four-timestamp columns (`valid_from`/`valid_to`/`ingested_at`/`expired_at`) additively. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Declare the four-timestamp window once (reconcile causal-edge vs lineage at `:184-185` — unify, do not fork a third store). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/graph/contradiction-detection.ts` | Modify | Add chronology-driven auto-invalidation scoped to conflicting/superseding relation pairs (`GR-temporal-ordering-invalidation`). |
| `.opencode/skills/system-spec-kit/mcp_server/lib/causal/frontmatter-promoter.ts` | Reference (SHIPPED) | `AND invalid_at IS NULL` open-edge clause already present (`openEdgeClause`); no change — verifies skip-closed-in-sweep. |
| `.opencode/skills/system-spec-kit/mcp_server/.../*.vitest.ts` | Create | Event-time close test, four-timestamp additivity test, chronology-invalidation test scoped to conflicting pairs. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `MEM-fact-invalidation-event-time`: `invalidateEdge()` stamps the close timestamp with the superseding fact's lineage event-time, not `new Date().toISOString()`. | Unit test asserts that closing an edge with a known event-time writes that timestamp into the close column; a missing event-time falls back to `now()` (fail-open). Seam confirmed at `temporal-edges.ts:81,86,94`. |
| REQ-002 | Reader-transparency: no `WHERE invalid_at < now()` reader is added; all current-edge readers keep the binary `IS NULL` test. | grep shows the three readers (`getValidEdgesForNode` `temporal-edges.ts:108-138`, `contradiction-detection.ts:75-77,99-110`, frontmatter-promoter `openEdgeClause`) still use `IS NULL`. |
| REQ-003 | skip-closed-in-sweep stays intact: the promoter cleanup keeps the `AND invalid_at IS NULL` open-edge clause. | `frontmatter-promoter.ts` `openEdgeClause` present (SHIPPED `e1c6a3c793`); a closed-edge fixture test proves a closed generated edge is not re-touched. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | C3-B four-timestamp window declared additively (event-time `valid_from`/`valid_to` + txn-time `ingested_at`/`expired_at`) on causal + lineage. | Schema declares the four columns once; existing single `valid_at`/`invalid_at` readers continue to pass byte-identically; additivity verified against `active_memory_projection` (additivity is UNVERIFIED per research — must be confirmed at build). |
| REQ-005 | `GR-temporal-ordering-invalidation` scoped to conflicting/superseding relation pairs only. | Test proves two co-valid non-conflicting same-pair edges are NOT invalidated; two conflicting same-pair edges invalidate the chronologically-earlier `valid_at`. |
| REQ-006 | C3-D separation-of-concerns documented: tombstone-sweep (forgetting) vs temporal-close (not-current) are distinct; skip-closed ships as defensive hardening, not a data-loss gate. | decision-record.md ADR records the distinction; the guard is cheap hardening (fork is theoretical + tombstone-recoverable, 005 iter-032). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Closing a superseded edge records the real-world event-time; an "as of date X" lineage query returns the belief-state correct for X (the spearhead's reader-transparent fix).
- **SC-002**: The four-timestamp window is additive — existing `IS NULL` readers and the live retirement path stay byte-identical until a consumer opts into transaction-time semantics.
- **SC-003**: Chronology-driven invalidation never retires a co-valid, non-conflicting same-pair fact (scoped to conflicting/superseding relations).
- **SC-004**: `validate.sh --strict` on this phase folder passes; typecheck + focused causal/temporal tests green.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a `WHERE invalid_at < now()` reader while changing the close time | Breaks reader-transparency; the spearhead stops being H/S | Keep readers on the binary `IS NULL` test (REQ-002); change only the writer's stamped value |
| Risk | Deriving the close time from the causal projection instead of lineage | Wrong/derived timestamp; bi-temporal incorrectness persists | Derive from lineage (canonical event-time writer); causal `invalid_at` is a projection |
| Risk | C3-B additivity unverified against `active_memory_projection` | Migration may not be purely additive (no migration spec exists) | Confirm additivity at build; lineage is already ~3/4 bi-temporal (missing only `expired_at`) per 005 iter-019/024/035 |
| Risk | `GR-temporal-ordering` applied to every same-pair edge | Wrongly invalidates co-valid non-conflicting facts | Scope to conflicting/superseding relation pairs (Graphiti gates on flagged contradictions) |
| Dependency | C3-B four-timestamp window | Gates C3-A live retirement path + Code-Graph Q1-C1 column shape | Sequence C3-B before C3-A; the spearhead ships independently of the migration |
| Dependency | lineage canonical-writer decision | Determines where event-time is sourced | Record the decision in decision-record.md (lineage canonical; causal derived) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The event-time close change is a single-site write change; no added read-path cost (no new reader, no new index requirement for the spearhead).

### Security
- **NFR-S01**: No new untrusted-content surface; the temporal columns carry timestamps only, not recalled content.

### Reliability
- **NFR-R01**: `invalidateEdge()` keeps its fail-open contract (`console.warn` on error, no throw); a missing event-time falls back to `now()` rather than failing the close.

---

## 8. EDGE CASES

### Data Boundaries
- Missing lineage event-time: fall back to `now()` (fail-open) so the edge still closes.
- Edge already closed (`invalid_at IS NOT NULL`): no-op (existing `invalidateEdge` contract; reinforced by skip-closed-in-sweep).
- Fixture schema without `invalid_at`/four-timestamp columns: predicate is schema-aware (`columns.has('invalid_at')` already guards the promoter clause).

### Error Scenarios
- Two conflicting same-pair edges with identical `valid_at`: tie handling must be deterministic (document; do not silently invalidate both).
- `SPECKIT_TEMPORAL_EDGES` semantics: the flag is already ON; the spearhead's writer change does not depend on a flip.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: ~4 prod + tests; LOC: ~150-300; Systems: causal-graph + lineage store |
| Risk | 13/25 | Auth: N; API: N (internal lib); Breaking: temporal-store reconciliation if forked, additive otherwise |
| Research | 8/20 | Seams confirmed; C3-B additivity UNVERIFIED against `active_memory_projection` |
| Multi-Agent | 4/15 | Single-stream implementation; spearhead independent of migration |
| Coordination | 6/15 | Dependencies: C3-B gates C3-A (later phase) + Code-Graph Q1-C1 column shape (sibling) |
| **Total** | **45/100** | **Level 3** (bi-temporal substrate + schema-migration-class C3-B) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A reader is added that compares `invalid_at` to `now()`, breaking reader-transparency | H | M | REQ-002 grep gate; readers stay on `IS NULL` |
| R-002 | C3-B migration is not actually additive against `active_memory_projection` | M | M | Confirm additivity at build; lineage already ~3/4 bi-temporal |
| R-003 | Chronology invalidation over-fires on co-valid same-pair edges | M | M | Scope to conflicting/superseding relation pairs (REQ-005) |
| R-004 | Event-time sourced from the causal projection rather than lineage | M | L | Decision recorded: lineage canonical, causal derived |

---

## 11. USER STORIES

### US-001: Correct "as of date X" belief history (Priority: P0)

**As a** memory consumer asking "what did we believe as of date X", **I want** superseded edges closed at the fact's real event-time, **so that** the belief-state I read back is correct for X rather than reflecting when we noticed the change.

**Acceptance Criteria**:
1. Given an edge superseded by a fact with a known event-time, When `invalidateEdge()` closes it, Then the close column holds that event-time, not `now()`.

### US-002: Chronology resolves supersession (Priority: P1)

**As a** causal-graph maintainer, **I want** two conflicting same-pair edges to auto-retire the chronologically-earlier one, **so that** supersession is resolved beyond the hand-listed relation pairs — without retiring co-valid, non-conflicting facts.

**Acceptance Criteria**:
1. Given two conflicting same-pair edges, When chronology invalidation runs, Then the earlier `valid_at` edge is closed and the later remains current.
2. Given two co-valid non-conflicting same-pair edges, When chronology invalidation runs, Then neither is closed.

---

## 12. OPEN QUESTIONS

- Is the C3-B four-timestamp window additive against `active_memory_projection`? No migration spec exists to verify (005 most-likely-wrong runner-up).
- Does lineage already carry `valid_from`/`valid_to`/`ingested_at`, missing only `expired_at` (005 iter-019/024/035 says ~3/4 bi-temporal)?
- What is the deterministic tie-break when two conflicting same-pair edges share an identical `valid_at`?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Research (PRIMARY)**: `../research/research.md`, `../../research/roadmap.md` (BROADENING + 027-REVISIT + MEMORY-SYSTEMS addenda), `../../research/synthesis/01-go-candidates.md`, `../../research/synthesis/06-memory-systems-findings.md`, `../research/from-005-revisit-027/research.md`.
- **Wave-0 shipped record**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (skip-closed-in-sweep = `e1c6a3c793`).
