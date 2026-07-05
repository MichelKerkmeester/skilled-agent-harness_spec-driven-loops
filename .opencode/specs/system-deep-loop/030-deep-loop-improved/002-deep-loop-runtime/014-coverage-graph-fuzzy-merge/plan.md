---
title: "Implementation Plan: Phase 14: Coverage Graph Fuzzy Merge"
description: "Plan for the shipped query-only near-duplicate finding discovery APIs in the coverage graph."
trigger_phrases:
  - "coverage-graph fuzzy merge"
  - "finding consolidation candidates"
  - "near-duplicate nodes"
  - "namespace alias memo"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/002-deep-loop-runtime/014-coverage-graph-fuzzy-merge"
    last_updated_at: "2026-07-01T21:46:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold plan with shipped fuzzy-merge query content from spec.md"
    next_safe_action: "Use this plan as documentation for the completed coverage graph consolidation query APIs"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts"
    session_dedup:
      fingerprint: "sha256:014a5e7c9d2b4f6081c3e5a7890b2d4f6a8c0e2d4f6b8a0c2e4d6f8a1b3c5e0f"
      session_id: "scaffold-content-remediation-014"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: Coverage Graph Fuzzy Merge

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript coverage graph query layer |
| **Framework** | Query-only deterministic string-similarity discovery |
| **Storage** | Existing graph rows are read but not mutated |
| **Testing** | Spec acceptance requires category-guarded similarity, candidate clustering with leftovers, DB state unchanged before/after calls, and seeded near-duplicate fixtures; no dedicated test file is named in spec.md |

### Overview
This phase shipped query-only near-duplicate discovery in `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts`. `findSimilarNodes` performs deterministic category-guarded string similarity, while `findConsolidationCandidates` returns clusters and leftovers without performing any row mutation or LLM-based merge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented: near-duplicate findings over-counted coverage and under-reported convergence.
- [x] Success criteria measurable: identical names in different categories must never match; DB row count/content unchanged after query calls.
- [x] Dependencies identified: deterministic string-similarity utility and bounded namespace alias memo available.

### Definition of Done
- [x] `findSimilarNodes(ns, { kind, name, threshold })` implemented.
- [x] Category guard blocks cross-category matches before similarity scoring.
- [x] Bounded namespace alias memo included to avoid unbounded growth.
- [x] `findConsolidationCandidates()` returns clusters plus leftover nodes in one pass.
- [x] Query-only boundary preserved; no row mutation or auto-merge added.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only consolidation candidate discovery with deterministic similarity and hard category isolation.

### Key Components
- **`findSimilarNodes`**: Finds near matches for one node descriptor inside a namespace and category.
- **Category guard**: Rejects cross-category matches before computing string similarity.
- **Namespace alias memo**: Bounded memoization for namespace/name aliases to keep query cost controlled.
- **`findConsolidationCandidates`**: Groups likely near-duplicates into clusters and reports leftover nodes in a single read pass.

### Data Flow
Callers request similar nodes or consolidation candidates from the query layer. The query reads existing graph nodes, applies category checks, computes deterministic string similarity above the configured threshold, and returns candidate clusters. Any actual merge or row mutation remains the caller's responsibility outside the graph query layer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/deep-loop-runtime/lib/coverage-graph/coverage-graph-query.ts` | Reads coverage graph nodes | Add read-only fuzzy candidate query APIs | Spec acceptance covers category guard, clustering, and no mutation |
| Coverage graph rows | Persisted graph data | Read only | DB row count/content unchanged before/after query calls |

Required inventories:
- Same-class producers: inspect existing graph query APIs before adding candidate discovery.
- Consumers of changed symbols: callers may use candidate output to decide merges, but mutation remains outside this layer.
- Matrix axes: same category near duplicate, same name different category, threshold below/above 0.85, clusters, leftovers, and no-write guarantee.
- Algorithm invariant: query functions may identify consolidation candidates, but must not change database rows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm implementation scope is only `coverage-graph-query.ts`.
- [x] Confirm deterministic string similarity is used instead of LLM calls.
- [x] Confirm auto-merge/row mutation is out of scope.

### Phase 2: Core Implementation
- [x] Implement `findSimilarNodes(ns, { kind, name, threshold })`.
- [x] Enforce category guard before similarity checks.
- [x] Add bounded namespace alias memo behavior.
- [x] Implement `findConsolidationCandidates()` returning clusters and leftovers.
- [x] Keep the query/mutation boundary intact with no DB writes.

### Phase 3: Verification
- [x] Verify identical names in different categories return no match.
- [x] Verify seeded near-duplicates cluster at threshold 0.85.
- [x] Verify `findConsolidationCandidates()` returns clusters and leftovers in one pass.
- [x] Verify DB state is unchanged before and after both query functions.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/guard | Identical names with different categories return empty results | Spec acceptance criteria; no dedicated test file named |
| Unit/similarity | Threshold 0.85 clusters seeded near-duplicates | Fixture-based similarity test |
| Integration/no mutation | DB row count/content unchanged before/after query calls | Before/after DB assertions |
| Candidate output | Clusters plus leftovers returned in one pass | Integration test on seeded graph |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deterministic string-similarity utility | Internal | Available | Required for no-LLM candidate discovery |
| Bounded alias memo | Internal | Available | Prevents namespace alias tracking from growing without bound |
| Future auto-merge/mutation workflow | Internal future | Deferred | Query APIs expose candidates; callers own mutation decisions |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Query functions match across categories, mutate rows, or return misleading candidate clusters.
- **Procedure**: Remove `findSimilarNodes` and `findConsolidationCandidates` from `coverage-graph-query.ts`; callers return to exact-node matching until query-only fuzzy discovery is corrected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
