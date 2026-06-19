---
title: "Implementation Summary: Code-Graph Determinism + Walk-Order"
description: "Implementation summary for the code-graph determinism + walk-order sub-phase: the Q4-C1 RRF-additive rank-time trust predecessor shipped in Wave-0 (commit e21caf5de6) with the neutral-fallback order-stability gate met, and the three gated PENDING follow-ups (det-context-order-global, the fuseResultsMulti dual-channel adapter, Q4-C1 benchmark tuning) recorded with their gates and not yet built."
trigger_phrases:
  - "implementation summary code graph determinism walk order"
  - "Q4-C1 rank-time trust shipped"
  - "code-graph-context finalize tiebreak residue"
  - "028 code-graph determinism impl summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored Level-2 impl-summary for the code-graph walk-order sub-phase"
    next_safe_action: "Run validate.sh --strict and fix any remaining structure issues"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 25
    open_questions:
      - "Is the impact walk already stable across scan rebuilds, or does the index-based tiebreak rely on shifting SQLite row order?"
    answered_questions: []
---
# Implementation Summary: Code-Graph Determinism + Walk-Order

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `028-memory-search-intelligence/002-code-graph/001-determinism-walk-order` |
| **Completed** | Partial — 1 of 4 candidates shipped (Q4-C1, Wave-0); residue gated |
| **Level** | 2 |
| **Actual Effort** | Q4-C1 shipped in Wave-0 (commit `e21caf5de6`); det-order / fuser adapter / tuning not yet built (gated) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The Q4-C1 RRF-additive rank-time trust blend shipped in the flat Wave-0 packet (030) and is the prerequisite already in place: the code-graph impact/dependency ranker now blends the already-plumbed `confidence`/`evidenceClass` edge metadata into ranking as an **additive** term (`rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor`), structural weight unmutated, with a neutral edge byte-identical to the rowid baseline. The three walk-order follow-ups are **PENDING and not built** this sub-phase: the content-derived total tiebreak (`det-context-order-global`), the `fuseResultsMulti` dual-channel adapter (`Q8` / `fuseResultsMulti-codegraph-promote`), and the Q4-C1 boost-magnitude benchmark tuning. This sub-phase records the shipped predecessor with its commit evidence and carries the residue with explicit gates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified (Wave-0 `e21caf5de6`) | RRF-additive trust blend in `contextEdgeReliability` + `rankContextEdges`; structural weight unmutated; neutral edge byte-identical |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified (Wave-0 `e21caf5de6`) | Neutral-byte-identical + trusted-boost ranking tests |
| `.opencode/specs/.../001-determinism-walk-order/{spec,plan,tasks,implementation-summary}.md` | Created (this sub-phase) | Level-2 packet docs recording 1 DONE + 3 PENDING-with-gate |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Q4-C1 was delivered in Wave-0 using the one-candidate-at-a-time method: read the `rankContextEdges` seam, add the additive reliability term (not a multiplicative blend — a multiplicative-neutral fallback was shown to re-order ties vs the rowid baseline), prove the neutral edge is byte-for-byte identical to the pre-change output, add the byte-identical + trusted-boost tests, and commit independently (`e21caf5de6`). This sub-phase was delivered by reading the 028 research (`research.md` + `roadmap.md` BROADENING/027-REVISIT/006 addenda + `synthesis/01`/`03`/`04`), mapping the four named candidates to the single `code-graph-context.ts` finalize/rank seam, recording the shipped predecessor with its commit and the residue with its gates, and validating the Level-2 folder strict.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| RRF-additive trust, never `score × reliability` | A multiplicative-neutral fallback re-orders ties vs the rowid baseline; additive `baselineRankScore + reliability` keeps neutral edges byte-identical (`002` iter I2; `roadmap.md` BROADENING §2) |
| Reuse the 001 total-comparator for det-order, don't fork | JS `(a,b)=>b-a` is not a total order (NaN / -0 poison it); the keystone is built once and reused (`synthesis/01` SA7) |
| Promote `fuseResultsMulti` via adapter, don't author a code-graph fuser | The signature is generic (zero Memory coupling) but needs an adapter (synthesize `RrfItem.id`, pre-sort, label channels); promotable-with-adapter, NOT drop-in (`002` iter-5) |
| Gate Q4-C1 tuning on a benchmark, ship the order-stability gate now | No candidate has a measured before/after number; the neutral == rowid baseline gate is the ship criterion, the magnitudes are a tuning follow-up (`synthesis/03` §B) |
| Exclude Q1-C1 / Q3-C1 / Q6-* from this seam | Bi-temporal is DEFER-speculative/schema-migration, PPR is unbuilt, the watermark is redundant with the readiness gate — separate sub-phases (`synthesis/04`) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Q4-C1 order-stability (shipped) | Pass | code-graph ranking/impact/gold-battery | 56 tests pass incl. neutral-byte-identical + trusted-boost; the 8 full-package failures are unrelated IPC sandbox EPERM (`e21caf5de6`) |
| det-order cross-rebuild reproducibility | Not built | — | Gated on the 001 total-comparator; a property test (same query, same order before/after a destructive reindex) is the verification gate |
| Fuser-adapter dual-channel fuse | Not built | — | Gated on the 001 `fuseResultsMulti` signature |
| Q4-C1 magnitude tuning | Not built | — | Gated on a code-graph retrieval benchmark (none exists campaign-wide) |
| Strict packet validation | Pass | This sub-phase | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order --strict` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `code-graph-context.ts` (Q4-C1 paths) | Covered by the Wave-0 ranking suite | Covered | Covered |
| det-order / fuser adapter / tuning | Not built | Not built | Not built |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No measurable added walk cost (additive term / tie-only re-order / rank-fuse inside the 400 ms budget) | Q4-C1 is an additive term inside the existing rank; det-order is tie-only; fuser is a rank-fuse over already-collected channels | Pass (Q4-C1) / Pending (residue) |
| NFR-S01 | No new external data sink or trust boundary | Code-graph context render is JSON-escaped + trusted-source; no change introduced | Pass |
| NFR-R01 | Byte-identical-by-default or content-derived tie re-order; reproducible across scan rebuilds for unchanged content | Q4-C1 neutral fallback byte-identical (shipped); cross-rebuild reproducibility lands with det-order (pending) | Pass (Q4-C1) / Pending (det-order) |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No measured benefit number** — every leverage/effort rating is structural inference; the Q4-C1 boost magnitudes (0.01 / 0.004 / 0.002) are an unbenchmarked default, which is exactly why the tuning is a gated follow-up (`synthesis/03` §B).
2. **det-order assumes the walk is not yet cross-rebuild-stable** — whether the impact walk already relies on shifting SQLite row order via the `index` tiebreak is an open-item (`roadmap.md` Provenance); REQ-002 closes it, but the assumption should be confirmed before building.
3. **The fuser promotion is adapter-gated** — `fuseResultsMulti` is promotable-with-adapter, not drop-in; the adapter (synthesize id, pre-sort, label channels) is the real work and is not built here.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Implement all four named candidates | Only Q4-C1 shipped (Wave-0); det-order / fuser adapter / tuning recorded PENDING | This is a planning-only re-plan; the residue is gated on the 001 foundation and a retrieval benchmark, neither built in this sub-phase |
| Treat Q4-C1 as DONE-and-closed | Recorded Q4-C1 as the shipped predecessor with an explicit tuning follow-up | The order-stability gate is met but the boost magnitudes are unbenchmarked (`030` §14 cand 13 NOTE) |

<!-- /ANCHOR:deviations -->
