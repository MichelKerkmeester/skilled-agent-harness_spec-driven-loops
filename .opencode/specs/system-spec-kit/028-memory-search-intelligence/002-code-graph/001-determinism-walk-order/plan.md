---
title: "Implementation Plan: Code-Graph Determinism + Walk-Order"
description: "Plan for the code-graph determinism + walk-order sub-phase: the shipped Q4-C1 RRF-additive trust predecessor (commit e21caf5de6) plus three gated PENDING follow-ups — the content-derived walk-order tiebreak (det-context-order-global), the fuseResultsMulti dual-channel adapter (Q8), and the Q4-C1 boost-magnitude benchmark tuning — sequenced against the 001 determinism foundation and a not-yet-existing retrieval benchmark, all on the one code-graph-context.ts finalize/rank seam with no schema migration."
trigger_phrases:
  - "code graph determinism walk order plan"
  - "code-graph-context finalize tiebreak sequencing"
  - "fuseResultsMulti code graph adapter plan"
  - "028 code-graph determinism impl"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 plan sequencing shipped Q4-C1 vs gated det-order + fuser adapter + tuning"
    next_safe_action: "Author tasks.md (pre-check shipped Q4-C1, leave residue pending)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
      - "../research/research.md"
      - "../../research/synthesis/01-go-candidates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code-Graph Determinism + Walk-Order

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js |
| **Framework** | System Code Graph MCP (`.opencode/skills/system-code-graph/mcp_server/`) + the shared `system-spec-kit/shared/algorithms/rrf-fusion.ts` fuser |
| **Storage** | tree-sitter → SQLite typed-edge code graph (destructive DELETE+INSERT reindex, no temporal columns) |
| **Testing** | `tsc`, package build, Vitest (code-graph ranking/impact/gold-battery suite), `validate.sh --strict` |

### Overview
This sub-phase makes the code-graph impact/dependency/neighborhood walk reproducible across scan rebuilds and lets it fuse its dual impact channels through the 001 determinism keystone — all on a single seam (`rankContextEdges` → `finalize()` in `code-graph-context.ts`) with no schema migration. The rank-time trust blend that turns the already-plumbed `confidence`/`evidenceClass` edge metadata into ranking signal (Q4-C1) **already shipped** in the flat Wave-0 packet (030, commit `e21caf5de6`) as an RRF-**additive** term whose neutral fallback is byte-identical to the rowid baseline. This plan records that predecessor as DONE and sequences the three gated follow-ups: the benchmark-driven magnitude tuning (`Q4-C1-benchmark-tuning`), the content-derived total tiebreak replacing the DB-iteration-order tiebreak (`det-context-order-global`), and the adapter that promotes 001's `fuseResultsMulti` for the dual CALLS+IMPORTS impact channels (`Q8-fuser-adapter` / `fuseResultsMulti-codegraph-promote`).

The discipline is the same one packet 030 demonstrated and the 001 sibling foundation encodes: ship only what is additive, ordering-only, and neutral-fallback-stable; reuse the shared keystone rather than forking a code-graph-specific comparator or fuser; defer anything that needs a downstream benchmark (Q4-C1 tuning) or a foundation signature (det-order, fuser adapter) that is not yet consumed here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 028 research treated as roadmap input, not implementation authority. Evidence: `spec.md` sections 2 and 11.
- [x] Scope limited to the `code-graph-context.ts` finalize/rank seam; the bi-temporal (Q1-C1), PPR (Q3-C1), generation-watermark (Q6-*), and edge-staleness clusters are excluded. Evidence: `spec.md` section 3 Out of Scope.
- [x] Candidate seams identified from `../research/research.md` Internal Baseline + the roadmap/synthesis corrections (RRF-additive not multiplicative; promotable-with-adapter not drop-in; one finalize seam not impact-only) before any edit.
- [x] PENDING candidates name a concrete gate (needs-benchmark / shared-infra-dep). Evidence: `spec.md` section 11.

### Definition of Done
- [x] All 4 candidate rows have a final status (DONE-with-commit or PENDING-with-gate). Evidence: `spec.md` section 11.
- [x] The shipped Q4-C1 predecessor traces to Wave-0 commit `e21caf5de6` in `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 13.
- [ ] The det-order tiebreak and the fuser adapter are built against the 001 foundation signatures (downstream; tracked, not built this sub-phase).
- [ ] The Q4-C1 boost magnitudes are re-tuned against a retrieval benchmark with the neutral-fallback order-stability gate still holding (downstream; gated on a benchmark that does not yet exist).
- [x] Level-2 packet docs use the system-spec-kit templates and pass strict validation.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A set of ordering-only improvements on one existing code-graph ranking seam, plus one adapter over a shared fuser. No schema migration, no change to the destructive reindex write path, no new edge type, no daemon topology change. The cross-subsystem relationship is a *consume-the-shared-signature* relationship: code-graph promotes 001's `fuseResultsMulti` with an adapter and reuses 001's total comparator — it does not import Memory and does not author its own determinism primitives.

### Key Components
- **RRF-additive trust blend (shipped)**: `contextEdgeReliability` + `rankContextEdges` in `code-graph-context.ts:355-378` — `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`; structural weight unmutated; a neutral edge scores `1/(61+index)` so it reproduces the rowid baseline byte-for-byte.
- **Content-derived total tiebreak (residue)**: replace the equal-`rankScore` tiebreak `|| (left.index - right.index)` at `:377` with the 001 hand-written total comparator keyed on a content-derived field (target symbol id / content hash, COALESCE to id), covering `finalize()` at `:436`/`:712` so impact + dependency/callees + outline-export are all reproducible across a rebuild.
- **fuseResultsMulti dual-channel adapter (residue)**: an adapter at the impact-walk seam (`:627-671`) that synthesizes `RrfItem.id` for each edge, pre-sorts the CALLS channel and the IMPORTS channel, labels the dual GRAPH channels, and calls the shared `fuseResultsMulti` so the two channels fuse by rank with a cross-channel bonus instead of DB-order concatenation.
- **Q4-C1 magnitude tuning (residue)**: re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` (`:101-108`) against a code-graph retrieval benchmark; the neutral-fallback order-stability gate is the non-negotiable ship criterion regardless of magnitudes.

### Data Flow
The impact/dependency walk collects reverse-edge results (CALLS and IMPORTS channels) bounded by the 400 ms budget; `rankContextEdges` applies the additive trust term and the equal-score tiebreak; `finalize()` returns the ordered expansion. Today the dual channels are concatenated in DB order and the tiebreak is DB-iteration-order; after the residue lands, the channels fuse by rank through the shared `fuseResultsMulti` and the tiebreak is content-derived, so the same query returns the same order before and after a destructive reindex. The trust blend is byte-identical-by-default on neutral edges, so any consumer of the context envelope stays stable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shipped predecessor (Wave-0 / packet 030)
- [x] RRF-additive rank-time trust blend in `rankContextEdges` / `contextEdgeReliability`; structural weight unmutated; neutral edge byte-identical to the rowid baseline (commit `e21caf5de6`).

### Phase 2: Walk-order determinism (PENDING — gated on the 001 foundation)
- [ ] `det-context-order-global` — replace the `|| (left.index - right.index)` tiebreak with the 001 content-derived total comparator (target id / content hash, COALESCE to id); cover `finalize()` so impact + dependency/callees + outline-export are reproducible across scan rebuilds. Gate: 001 total-comparator keystone.
- [ ] `Q8-fuser-adapter` / `fuseResultsMulti-codegraph-promote` — adapter promoting the shared `fuseResultsMulti` for the dual CALLS+IMPORTS impact channels (synthesize `RrfItem.id`, pre-sort, label channels, cross-channel bonus). Gate: 001 `fuseResultsMulti` signature.

### Phase 3: Trust tuning (PENDING — gated on a retrieval benchmark)
- [ ] `Q4-C1-benchmark-tuning` — re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` magnitudes against a code-graph retrieval benchmark; keep the neutral-fallback order-stability gate. Gate: a benchmark that does not yet exist campaign-wide.

### Phase 4: Docs + verification
- [x] Author Level-2 packet docs from the system-spec-kit templates.
- [x] Run strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Code-graph MCP TypeScript contracts | `npm run typecheck` |
| Build | Code-graph MCP package build | `npm run build` |
| Order-stability (shipped) | Neutral edge == rowid baseline; trusted edge gets a bounded additive boost | code-graph ranking/impact/gold-battery vitest (56 pass, `e21caf5de6`) |
| Cross-rebuild reproducibility (residue) | Same query returns the same order before/after a destructive reindex that shifts DB row order | new det-order property test (gated) |
| Dual-channel fuse (residue) | CALLS+IMPORTS fuse by rank with a cross-channel bonus; single-channel degrades cleanly | new fuser-adapter test (gated) |
| Trust tuning (residue) | Re-tuned magnitudes vs baseline on a retrieval benchmark; neutral-fallback gate holds | benchmark harness (does not yet exist) |
| Packet docs | Level-2 structure, anchors, frontmatter, required files | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Q4-C1 RRF-additive trust blend | Internal (shipped) | Green | The prerequisite signal; det-order tiebreaks the trust-blended `rankScore`, tuning adjusts its magnitudes |
| 001 total-comparator keystone | Cross-subsystem (foundation) | Pending consume | Blocks `det-context-order-global` (REQ-002) |
| 001 `fuseResultsMulti` signature (`shared/algorithms/rrf-fusion.ts`) | Cross-subsystem (foundation) | Green-with-adapter | Blocks the dual-channel fuse (REQ-003); promotable-with-adapter, zero Memory coupling (`002` iter-5) |
| Code-graph retrieval benchmark | Verification | Missing | Blocks Q4-C1 magnitude tuning (REQ-004); none exists campaign-wide (`synthesis/03` §B) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped/planned seam re-orders walk output for unchanged content, the neutral-fallback byte-identity breaks, or a re-tune regresses retrieval without a benchmark to justify it.
- **Procedure**: Revert the candidate commit. The shipped Q4-C1 trust blend is `e21caf5de6` (a single independent revert that restores the pure rowid-order ranking). The PENDING residue is not built, so there is nothing to roll back there yet.
- **Data reversal**: None — no candidate in this sub-phase adds a schema migration or touches the destructive reindex write path. Rollback is code + test revert only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Shipped predecessor (Q4-C1) | `confidence`/`evidenceClass` metadata already plumbed to formatting | Walk-order determinism + trust tuning |
| Walk-order determinism (det-order + fuser adapter) | 001 total-comparator + `fuseResultsMulti` signature | Cross-rebuild reproducible walk output |
| Trust tuning | A code-graph retrieval benchmark | Benchmark-justified boost magnitudes |
| Docs + verification | Shipped-commit evidence + gated residue | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Candidate Group | Complexity | Actual Outcome |
|-----------------|------------|----------------|
| Q4-C1 RRF-additive trust (predecessor) | M | Shipped `e21caf5de6` |
| det-context-order-global (residue) | S | Pending — gated on the 001 total-comparator |
| Q8-fuser-adapter / promote (residue) | M | Pending — gated on the 001 `fuseResultsMulti` signature |
| Q4-C1-benchmark-tuning (residue) | M | Pending — gated on a retrieval benchmark (none exists) |
| Docs + verification | M | Completed |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

| Candidate | Rollback |
|-----------|----------|
| Q4-C1 RRF-additive trust | Revert `e21caf5de6` (restores pure rowid-order ranking; structural weight was never mutated). |
| det-context-order-global | Not built; restore the `|| (left.index - right.index)` index tiebreak if a partial change is reverted. |
| Q8-fuser-adapter / promote | Not built; the dual channels stay DB-order concatenated until the adapter lands. |
| Q4-C1-benchmark-tuning | Not built; the shipped default magnitudes (0.01 / 0.004 / 0.002) remain in place. |
<!-- /ANCHOR:enhanced-rollback -->
