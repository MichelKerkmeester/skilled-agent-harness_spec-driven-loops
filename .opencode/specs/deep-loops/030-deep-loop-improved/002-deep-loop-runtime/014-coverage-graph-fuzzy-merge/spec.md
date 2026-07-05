---
title: "Coverage Graph Incremental Fuzzy Finding-Merge"
description: "Near-duplicate findings accumulate as separate nodes, over-counting coverage and under-reporting convergence; deterministic string-similarity consolidation resolves this without LLM calls or row mutation."
trigger_phrases:
  - "coverage-graph fuzzy merge"
  - "finding consolidation candidates"
  - "near-duplicate nodes"
  - "namespace alias memo"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/002-deep-loop-runtime/014-coverage-graph-fuzzy-merge"
    last_updated_at: "2026-06-28T14:02:03Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/014-coverage-graph-fuzzy-merge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Coverage Graph Incremental Fuzzy Finding-Merge

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 18 |
| **Predecessor** | 013-coverage-graph-time-decay |
| **Successor** | 015-fallback-router-typed-reroute |
| **Handoff Criteria** | `findSimilarNodes` and `findConsolidationCandidates` implemented; category guard enforced; no row mutation path introduced |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the deep-loop-runtime recs specification.

**Scope Boundary**: `coverage-graph-query.ts` only — new query functions, no mutation logic.

**Dependencies**:
- String-similarity utility available (deterministic, no LLM); namespace alias memo bounded to prevent unbounded growth

**Deliverables**:
- `findSimilarNodes(ns, {kind, name, threshold})` — category-guarded, deterministic string-similarity, bounded alias memo
- `findConsolidationCandidates()` — returns clusters + leftovers in one pass; no DB write

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Near-duplicate findings (same concept, slightly different wording) accumulate as separate nodes; without a consolidation layer the graph over-counts coverage and under-reports actual convergence. Callers have no lightweight API to discover consolidation candidates before deciding to merge. The existing query surface lacks a category guard, which risks cross-category false positives when names happen to be similar across unrelated domains.

### Purpose
Add `findSimilarNodes` and `findConsolidationCandidates` as query-only operations so callers can discover and act on near-duplicate clusters without row mutation occurring inside the graph layer.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `findSimilarNodes(ns, {kind, name, threshold})` using deterministic string-similarity (no LLM) with bounded namespace alias memo
- `findConsolidationCandidates()` returning cheap clusters + leftovers in one pass
- Category guard enforced before similarity check — cross-category matches blocked regardless of name similarity
- Query-only contract: no row mutation; callers decide what to merge

### Out of Scope
- LLM-based semantic consolidation — deep-rewrite variant requiring model calls; separate ticket
- Row mutation / auto-merge — intentionally deferred to callers to preserve the query/mutation boundary

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | Modify | Add `findSimilarNodes` and `findConsolidationCandidates` query functions |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `findSimilarNodes` must be category-guarded: nodes from different categories must never match regardless of name similarity | Unit test: two nodes with identical names but different categories return an empty result set |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | `findConsolidationCandidates()` must return clusters + leftover nodes in a single pass without triggering any DB write or row mutation | Integration test: call on a graph with seeded near-duplicates; assert DB state unchanged before/after; assert correct cluster membership returned |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No row mutation occurs in the graph layer as a result of calling either new function — confirmed by asserting DB row count and content are identical before and after both calls.
- **SC-002**: `findSimilarNodes` with threshold 0.85 correctly clusters the seeded near-duplicate test fixtures without merging any cross-category nodes — confirmed by unit test fixture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | String-similarity thresholds set too aggressively merge unrelated nodes across categories | Med | Enforce category guard before any similarity check; category mismatch is a hard block, not a soft filter |
| Evidence | `external/kasper/src/utils.ts:13-71`; `state.ts:638-655` | Low | Read-only citation from research.md §5.1 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

> **Provenance:** research.md §5.1, (iter 14)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
