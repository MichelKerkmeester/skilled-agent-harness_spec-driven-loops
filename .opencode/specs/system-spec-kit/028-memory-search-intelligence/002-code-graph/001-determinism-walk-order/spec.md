---
title: "Feature Specification: Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence)"
description: "Make the code-graph impact/dependency/neighborhood walk output reproducible across scan rebuilds at the code-graph-context.ts finalize/rank seam, and fuse the dual CALLS+IMPORTS impact channels through 001's shared fuseResultsMulti via an adapter. The RRF-additive rank-time trust blend (Q4-C1) shipped in Wave-0 (packet 030, commit e21caf5de6); det-context-order-global is now implemented in the code-graph MCP seam, while Q4-C1 benchmark tuning and Q8 / fuseResultsMulti-codegraph-promote remain gated."
trigger_phrases:
  - "code graph determinism walk order"
  - "code-graph-context finalize tiebreak"
  - "fuseResultsMulti code graph adapter"
  - "Q4-C1 rank-time trust tuning"
  - "028 code-graph impl phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 spec for the code-graph determinism + walk-order impl sub-phase"
    next_safe_action: "Run canonical verification and keep Q8/tuning pending until their gates close"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../research/research.md"
      - "../../research/roadmap.md"
      - "../../research/synthesis/01-go-candidates.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Are the Q4-C1 evidence-class boost magnitudes (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) earning retrieval quality, or do they need a benchmark-driven re-tune?"
    answered_questions:
      - "The impact walk no longer depends on shifting SQLite row order for equal-trust peers; det-order assigns baseline rank from content-derived keys."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence)

## EXECUTIVE SUMMARY

This sub-phase makes the code-graph impact/dependency/neighborhood walk **reproducible across scan rebuilds** and lets it **fuse the dual impact channels through 001's shared determinism keystone**. Both wins land on a single seam — the `rankContextEdges` / `finalize()` ranking path in `code-graph-context.ts` — with **no schema migration**. The rank-time trust blend that turns the already-plumbed `confidence`/`evidenceClass` edge metadata into ranking signal (candidate Q4-C1) **already shipped** in the flat Wave-0 packet (030, commit `e21caf5de6`) as an RRF-**additive** term. This implementation adds `det-context-order-global`: baseline rank assignment now starts from a content-derived total edge order (`contentHash` coalescing to related symbol id and stable endpoint fields), so equal-trust impact/dependency/neighborhood walks no longer inherit SQLite row order. What remains is Q4-C1 **benchmark-driven magnitude tuning** and the **adapter that promotes 001's `fuseResultsMulti`** (synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels) so CALLS-channel and IMPORTS-channel impact results fuse with a cross-channel bonus instead of being concatenated in DB order (`Q8-fuser-adapter` / `fuseResultsMulti-codegraph-promote`).

**Key Decisions**: Reuse the pattern, do not rebuild the subsystem — the one-seam tiebreak applies the 001 content-derived total-order pattern locally to preserve code-graph isolation, and the dual-channel fuse must promote 001's `fuseResultsMulti` with an adapter rather than authoring a code-graph-specific fuser. Keep every change ordering-only and additive: the trust blend never mutates structural edge weight, the det-order seam only changes rank ordering, and the fuser remains pending until it can be consumed without silently widening subsystem coupling.

**Critical Dependencies**: `det-context-order-global` is implemented in the code-graph MCP seam without a cross-skill production import, preserving the active code-graph isolation contract while using the same content-derived total-order pattern from the 001 foundation. The Q8 fuser adapter still depends on an isolation-compatible way to consume `fuseResultsMulti` without forking the fuser or adding a forbidden code-graph → system-spec-kit source dependency. The Q4-C1 tuning depends on a retrieval benchmark that does not yet exist (no candidate in the 200-iteration campaign has a measured before/after number).

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-19 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Packet** | system-spec-kit/028-memory-search-intelligence/002-code-graph |
| **Source research** | `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03` + `04` |
| **Shipped predecessor** | `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 13 (Q4-C1, commit `e21caf5de6`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before this pass, the code-graph impact/dependency walk ranked callers/callees on a single seam — `rankContextEdges` feeding `finalize()` in `code-graph-context.ts:365-378, :436, :712` — and its ordering was **not reproducible across scan rebuilds**. The reindex is a destructive DELETE+INSERT swap with no temporal columns (`research.md` Internal Baseline; `code-graph-db.ts:936,941,985`), so currentness equals physical edge presence and the DB iteration order of edges can shift between scans. The ranker's equal-`rankScore` tiebreak was `|| (left.index - right.index)` (`code-graph-context.ts:377`) — the **DB-iteration/rowid order index** — so two edges with the same trust-blended score could re-order whenever a rebuild changed their row order. This pass closes that by assigning baseline rank from content-derived keys before applying the trust term. Separately, the impact walk still concatenates its dual reverse-edge channels (CALLS and IMPORTS) in DB order rather than fusing them by rank, so the cross-channel ranking the shared `fuseResultsMulti` primitive provides (and that Skill Advisor 003 and the Memory fuser already use) remains unavailable here. Finally, the RRF-additive trust blend that shipped in Wave-0 (`e21caf5de6`) carries **unbenchmarked boost magnitudes** — the historical order-stability gate was met, but whether `EXTRACTED/STRUCTURED = 0.01`, `INFERRED = 0.004`, `AMBIGUOUS = 0.002` actually improve retrieval quality was never measured.

### Purpose
Make the code-graph walk output reproducible across scan rebuilds at the one `code-graph-context.ts` finalize/rank seam by replacing DB-iteration-derived ranking with content-derived total ordering (no migration), promote 001's `fuseResultsMulti` via an adapter so the dual CALLS+IMPORTS impact channels fuse by rank with a cross-channel bonus, and tune the shipped Q4-C1 trust boost magnitudes against a retrieval benchmark — all ordering-only, additive, and neutral-fallback-stable.

### Critical context (from the 028 BROADENING + 006 sibling addenda, authoritative — supersede pass-1)
- **No candidate has a measured before/after benefit number** — every leverage/effort rating is structural inference, never a benchmarked delta (`synthesis/03` §B). This is *why* Q4-C1's magnitude tuning is a distinct gated follow-up rather than shipped-and-done.
- **A multiplicative-neutral trust fallback FAILS against the rowid baseline** — `score × reliability` with `neutral = 1` re-orders ties; Q4-C1 must be **RRF-additive** (`baselineRankScore + reliability`, structural weight unmutated), which is how it shipped (`roadmap.md` BROADENING §2; `002` iter I2; commit `e21caf5de6`). Do not reintroduce a multiplicative blend.
- **`fuseResultsMulti` is promotable-with-adapter, NOT drop-in, for code-graph** — the signature is generic (zero Memory coupling) but needs an adapter: synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels; the `{bonusOverChannels}` option name used loosely in the pass-1 roadmap is the real seam on the 001 side, but the code-graph promotion is the adapter, not a rename (`roadmap.md` Provenance & Caveats, RESOLVED by `002` iter-5; `synthesis/01` Wave-0 row).
- **The det-impact-order tiebreak is ONE `finalize()` seam, not impact-only** — it covers impact + dependency/callees + outline-export reproducibility, and the keystone it consumes is the 001 total-comparator (`roadmap.md` §1 Determinism cross-cut row; `002` iter-7). JS `(a,b)=>b-a` is not a total order (NaN / -0 poison it) — reuse the hand-written comparator (`synthesis/01` SA7 keystone).
- **Code-graph bi-temporal (Q1-C1) and seeded-PPR (Q3-C1) are OUT of this sub-phase** — they are DEFER-speculative / schema-migration / unbuilt and explicitly not part of the determinism + walk-order seam (`synthesis/04`; `synthesis/01` Wave-2).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope — the determinism + walk-order candidate set (one seam, no migration)

| # | Candidate | One-line change | Seam (file:line) | Eff | Status |
|---|-----------|-----------------|------------------|-----|--------|
| 1 | **Q4-C1** rank-time trust (shipped predecessor) | RRF-**additive** trust blend `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`; structural weight unmutated; neutral edge byte-identical to the rowid baseline | `code-graph-context.ts:355-378` (`contextEdgeReliability`, `rankContextEdges`) | M | **DONE** (predecessor) |
| 2 | **Q4-C1-benchmark-tuning** | Tune the evidence-class boost magnitudes (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) against a retrieval benchmark — the unbenchmarked-default follow-up the ship criterion deferred | `code-graph-context.ts:101-108` (`CONTEXT_EDGE_EVIDENCE_RANK_FACTORS`) | M | **PENDING** (needs-benchmark) |
| 3 | **det-context-order-global** | Replace DB-iteration-derived ranking with a content-derived total order for baseline rank assignment and equal-score ties (related node content hash, related symbol id, endpoint fields), so the walk is reproducible across scan rebuilds — the one-seam tiebreak covering impact + dependency/callees + outline-export | `code-graph-context.ts` (`rankContextEdges`, `finalize`) | S | **DONE** (implemented, unit-tested) |
| 4 | **Q8-fuser-adapter** / **fuseResultsMulti-codegraph-promote** | Promote 001's `fuseResultsMulti` via an adapter (synthesize `RrfItem.id`, pre-sort each channel, label the dual GRAPH channels) so the CALLS-channel + IMPORTS-channel impact results fuse by rank with a cross-channel bonus instead of DB-order concatenation | `code-graph-context.ts:627-671` (impact walk → `finalize`); consumes `shared/algorithms/rrf-fusion.ts` | M | **PENDING** (gate: isolation-compatible shared-fuser consume path) |

> **Cross-subsystem contract.** Candidate 3 consumes the 001 determinism pattern inside code-graph's local MCP seam because the package's isolation contract blocks production source imports from system-spec-kit. Candidate 4 still must promote the shared `fuseResultsMulti` rather than authoring a code-graph-specific fuser; until there is an isolation-compatible consume path, it remains pending. `Q8-fuser-adapter` and `fuseResultsMulti-codegraph-promote` are two candidate ids for the *same* adapter work (the resolved Q8 open-item and its roadmap-spine entry).

### Out of Scope (this sub-phase)
- **Q1-C1 code-edge bi-temporal** (`valid_at`/`invalid_at` columns, non-destructive supersede) — Wave-2 schema migration, DEFER-speculative (no consumer wants as-of/time-travel; safety redundant with the shipped readiness gate; does NOT fix the real edge-staleness bug). Lives in a future code-graph schema sub-phase (`synthesis/04`; `synthesis/01` Wave-2).
- **Q3-C1 seeded PPR** — net-new query-seeded multi-hop impact ranking; unbuilt; reuses 027's causal-BFS traversal; its own Wave-2 sub-phase (`synthesis/01` Wave-2; `04`).
- **Q6-C1 / Q6-C2 generation watermark** — DEFER-speculative / refuted bump-site; redundant with the shipped readiness gate (`synthesis/01` Wave-0 corrections; `roadmap.md` BROADENING §2 Q6-C2).
- **CG-edge-staleness / dependency-transitivity** — wiring `queryFileImportDependents` into the scan loop; a separate scan-path sub-phase, not the ranking seam (`synthesis/01` Wave-1; `04`).
- **Q5-C1 doc-symbol extractor**, **Q2-C1 transient/fatal parser split**, **closed-vocab edge_type** — separate code-graph sub-phases (tier-2 BUILD / policy change / schema migration respectively).
- Modifying packet 030 (the Wave-0 shipped record), the external reference systems under `external/`, the 001 foundation, or any sibling subsystem (001/003/004) code. This sub-phase only consumes the 001 foundation's signatures.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../mcp_server/lib/code-graph-context.ts` | Modify (DONE Q4-C1 `e21caf5de6`) | RRF-additive trust blend in `contextEdgeReliability` + `rankContextEdges` (structural weight unmutated; neutral byte-identical) |
| `.../mcp_server/lib/code-graph-context.ts` | Modify (DONE det-order) | Assign baseline rank and equal-score ties from a content-derived total order (content hash coalescing to related symbol id and endpoint fields); cover `finalize()` at `:436`/`:712` |
| `.../mcp_server/lib/code-graph-context.ts` | Modify (PENDING fuser adapter) | Adapter over `shared/algorithms/rrf-fusion.ts` `fuseResultsMulti` for the dual CALLS+IMPORTS impact channels (synthesize `RrfItem.id`, pre-sort, label channels) |
| `.../mcp_server/lib/code-graph-context.ts` | Modify (PENDING Q4-C1 tuning) | Re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` magnitudes against a retrieval benchmark; neutral-fallback order-stability gate must still hold |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Rank-time trust is RRF-additive (never `score × reliability`) and a neutral edge is byte-identical to the rowid baseline | DONE — `rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`; structural weight unmutated; neutral edge `reliability = 0` ⇒ order byte-identical to the pre-change rowid baseline (verified byte-for-byte); 56 ranking/impact/gold-battery tests pass (`030` §14 cand 13, commit `e21caf5de6`) |
| REQ-002 | The walk's equal-`rankScore` tiebreak is content-derived (total order), not DB-iteration-order, so output is reproducible across scan rebuilds | DONE — `rankContextEdges` derives a stable key from related node content hash, related symbol id, file/fqName, edge type and endpoints before assigning baseline rank and resolving equal-score ties; deterministic unit test proves equal-trust impact callers return the same order across shifted DB row orders |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The dual CALLS+IMPORTS impact channels fuse by rank through 001's shared `fuseResultsMulti`, not DB-order concatenation | PENDING — adapter synthesizes `RrfItem.id`, pre-sorts each channel, labels the dual GRAPH channels; promotes (does not rebuild) `shared/algorithms/rrf-fusion.ts`; zero Memory coupling; cross-channel bonus applied (`roadmap.md` Provenance, RESOLVED by `002` iter-5; `synthesis/01` Wave-0 row); gated on an isolation-compatible shared-fuser consume path |
| REQ-004 | The Q4-C1 evidence-class boost magnitudes are tuned against a retrieval benchmark, with the neutral-fallback order-stability gate still holding | PENDING — re-tune `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` (currently EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) on a code-graph retrieval benchmark; neutral edges must remain unchanged against the current deterministic baseline; gated on a benchmark that does not yet exist (`030` §14 cand 13 NOTE; `synthesis/03` §B) |
| REQ-005 | Every PENDING candidate names its gate and nothing in the determinism + walk-order seam is silently dropped | DONE/documented — det-order is implemented; fuser adapter remains pending on an isolation-compatible shared-fuser consume path; Q4-C1 tuning remains pending on a benchmark; the out-of-scope cluster (Q1-C1/Q3-C1/Q6-*) is recorded as belonging to other sub-phases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The shipped Q4-C1 trust blend is RRF-additive and proven byte-identical to the rowid baseline on a neutral (no trust metadata) edge — the order-stability ship criterion is met and recorded with its commit (`e21caf5de6`).
- **SC-002**: The walk's content-derived total tiebreak makes impact/dependency/outline-export output reproducible across a scan rebuild that shifts DB row order — deterministic unit coverage verifies the impact path returns the same order for shifted row orders.
- **SC-003**: The dual CALLS+IMPORTS impact channels (when fused) route through 001's `fuseResultsMulti` via an adapter with zero Memory coupling — the cross-channel bonus is applied and no code-graph-specific fuser is authored.
- **SC-004**: Every remaining PENDING candidate (fuser adapter, Q4-C1 tuning) has an explicit gate recorded (isolation-compatible shared-fuser consume path / needs-benchmark) so nothing is silently dropped and nothing ships ungated.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A multiplicative-neutral trust blend re-orders ties vs the rowid baseline | High — silently re-orders walk output | Keep the blend RRF-**additive** (`baselineRankScore + reliability`), as shipped; the neutral-byte-identical gate is the guard (`002` iter I2) |
| Risk | The det-order tiebreak uses JS `(a,b)=>b-a` (not a total order — NaN / -0 poison it) | Med — non-deterministic on edge cases | Use explicit string comparisons over content-derived keys, not subtraction (`synthesis/01` SA7 keystone) |
| Risk | The fuser adapter forks a code-graph-specific fuser instead of promoting 001's | Med — duplicate determinism logic, drift | Promote `fuseResultsMulti` with an adapter (synthesize `RrfItem.id`, pre-sort, label channels); confirm signature genericity first (RESOLVED `002` iter-5) |
| Risk | Q4-C1 tuning changes order without a benchmark to justify it | Med — unmeasured ranking churn | Gate tuning on a real retrieval benchmark; keep the neutral-fallback order-stability gate non-negotiable (`030` §14 cand 13 NOTE) |
| Dependency | 001 determinism + content-id foundation total-comparator pattern | Closed for REQ-002 (det-order) | Implemented locally in the isolated code-graph MCP seam without cross-skill source imports |
| Dependency | 001 `fuseResultsMulti` signature (`shared/algorithms/rrf-fusion.ts`) | Blocks REQ-003 (fuser adapter) | Signature is promotable-with-adapter, zero Memory coupling, but code-graph needs an isolation-compatible consume path (`002` iter-5) |
| Dependency | A code-graph retrieval benchmark | Blocks REQ-004 (Q4-C1 tuning) | None exists in the 200-iteration campaign; build/borrow one before tuning (`synthesis/03` §B) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The trust blend, the content-derived tiebreak, and the fuser adapter add no measurable walk cost — they are an additive rank term, a tie-only re-order, and a rank-fuse over the already-collected dual channels, all inside the existing 400 ms impact-walk budget (`research.md` Internal Baseline; `code-graph-context.ts:297-300`).

### Security
- **NFR-S01**: No new external data sink or trust boundary is introduced; the code-graph context render is JSON-escaped and trusted-source (the broad cross-cutting C8 generalization was refuted/reachability-gated for code-graph; `synthesis/04`).

### Reliability
- **NFR-R01**: Every shipped/planned seam is either byte-identical-by-default (Q4-C1 neutral fallback) or a content-derived tie re-order (det-order) — reproducibility across scan rebuilds is the reliability invariant; the destructive DELETE+INSERT reindex must not change walk output for unchanged content.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Edge with no trust metadata** (neutral): `contextEdgeReliability` returns `0`, so trust metadata does not perturb the deterministic content-derived baseline order.
- **Missing / absent content key for the tiebreak**: the content-derived comparator must COALESCE to a stable fallback (target symbol id) so the order stays total even when a content hash is absent (mirrors the 001 C5-B COALESCE-to-id pattern).
- **Single-channel impact result** (only CALLS or only IMPORTS present): the fuser adapter must degrade to the single channel without a cross-channel bonus, not error.

### Error Scenarios
- **Scan rebuild shifts DB row order**: the prior `index`-based tiebreak re-ordered equal-score ties; content-derived baseline rank and tie ordering now close this failure mode.
- **Unbenchmarked tuning**: changing `CONTEXT_EDGE_EVIDENCE_RANK_FACTORS` without a benchmark is itself the risk REQ-004 gates against; the neutral-fallback gate against the deterministic baseline must still hold after any re-tune.

### Concurrent Operations
- **Reindex concurrent with a read**: out of scope here — handled by the shipped binary readiness gate (`shouldBlockReadPath`); this sub-phase only governs ranking reproducibility once a read is served.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 11/25 | Files: 1 seam (`code-graph-context.ts`); LOC: small per candidate; Systems: code-graph impact/dependency/neighborhood ranker |
| Risk | 13/25 | Auth: N; API: consumes the shared `fuseResultsMulti` signature (cross-subsystem); Breaking: neutral-fallback byte-identity + cross-rebuild reproducibility must hold |
| Research | 12/20 | Investigation done (200-iteration campaign); Q4-C1 shipped; residue gated on a retrieval benchmark + the 001 foundation |
| **Total** | **36/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Do the Q4-C1 evidence-class boost magnitudes earn retrieval quality, or do they need a benchmark-driven re-tune? **No before/after number exists** (`synthesis/03` §B) — REQ-004 is gated on building that benchmark.

Answered in this pass:
- The impact walk is now stable against shifted DB row order for equal-trust peers by assigning baseline rank from content-derived keys.
- The comparator key is a composite: related node content hash coalescing to related symbol id, then file/fqName, edge type, source id, and target id.
<!-- /ANCHOR:questions -->

---

## 11. CANDIDATE STATUS

| # | Candidate | Status | Commit | Gate / Notes |
|---|-----------|--------|--------|--------------|
| 1 | Q4-C1 rank-time trust (predecessor) | **DONE** | `e21caf5de6` | RRF-additive trust blend; structural weight unmutated; neutral edge byte-identical to the rowid baseline (gate met, byte-verified); 56 ranking/impact/gold-battery tests pass; the 8 full-package failures are unrelated IPC sandbox EPERM (`030` §14 cand 13) |
| 2 | Q4-C1-benchmark-tuning | **PENDING** | — | **Gate: needs-benchmark** — the boost magnitudes (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) are an unbenchmarked default; neutral edges must remain unchanged against the current deterministic baseline, and tuning the magnitudes against a retrieval benchmark is a follow-up; no before/after number exists campaign-wide (`030` §14 cand 13 NOTE; `synthesis/03` §B) |
| 3 | det-context-order-global | **DONE** | — | Implemented in `code-graph-context.ts`: content-derived baseline rank assignment + equal-score tie order using related content hash coalesced to related symbol id and stable endpoint fields; deterministic unit test covers shifted impact row order; no schema migration |
| 4 | Q8-fuser-adapter / fuseResultsMulti-codegraph-promote | **PENDING** | — | **Gate: isolation-compatible shared-fuser consume path** — the shared fuser signature exists, but current code-graph isolation checks block production source imports from system-spec-kit and `@spec-kit/*`; do not fork a code-graph-specific fuser |

**Walk-order status: 2 DONE (Q4-C1 trust blend, det-context-order-global), 2 PENDING (gated).** The remaining follow-ups are Q4-C1 benchmark tuning and the dual-channel fuser adapter. No schema migration; the implemented det-order work lands on the single `code-graph-context.ts` finalize/rank seam.

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Source research**: `../research/research.md`, `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md` + `03-corrections-caveats-and-residuals.md` + `04-sibling-and-cross-cutting.md`
- **001 foundation (pattern/signature reference, not modified)**: `../../001-speckit-memory/002-determinism-content-id-foundation/spec.md` (content-derived total-order pattern + `fuseResultsMulti` `{bonusOverChannels}` contract)
- **Shipped predecessor (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 candidate 13 (Q4-C1, commit `e21caf5de6`)
<!-- /ANCHOR:related-docs -->
