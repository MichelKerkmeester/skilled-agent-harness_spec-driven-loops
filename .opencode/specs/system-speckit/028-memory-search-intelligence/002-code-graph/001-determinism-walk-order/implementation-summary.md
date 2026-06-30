---
title: "Implementation Summary: Code-Graph Determinism + Walk-Order"
description: "Implementation summary for the code-graph determinism + walk-order sub-phase: Q4-C1 RRF-additive rank-time trust shipped in Wave-0, det-context-order-global is implemented in code-graph-context.ts and the fuseResultsMulti dual-channel adapter plus Q4-C1 benchmark tuning remain gated."
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
    recent_action: "Implemented det-context-order-global and updated the Level-2 packet"
    next_safe_action: "Run canonical typecheck, broad Vitest and validate.sh --strict"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-002-determinism-walk-order"
      parent_session_id: null
    completion_pct: 50
    open_questions:
      - "Can the shared fuser be consumed from code-graph without violating the active isolation contract or forking the fuser?"
      - "Do the Q4-C1 evidence-class boost magnitudes earn retrieval quality against a real benchmark?"
    answered_questions:
      - "The impact walk no longer relies on shifting SQLite row order for equal-trust peers, and det-order assigns baseline rank from content-derived keys."
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
| **Completed** | Partial, 2 of 4 candidates done (Q4-C1, det-context-order-global). Residue gated |
| **Level** | 2 |
| **Actual Effort** | Q4-C1 shipped in Wave-0 (commit `e21caf5de6`), det-order implemented in this pass, fuser adapter / tuning not yet built (gated) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The Q4-C1 RRF-additive rank-time trust blend shipped in the flat Wave-0 implementation record (030) and is the prerequisite already in place: the code-graph impact/dependency ranker blends the already-plumbed `confidence`/`evidenceClass` edge metadata into ranking as an **additive** term. This pass implemented `det-context-order-global`: `rankContextEdges` now derives a stable content key from the related node content hash, related symbol id, file/fqName, edge type and endpoints, assigns baseline rank from that deterministic order, then uses the same key for equal-score ties. The `fuseResultsMulti` dual-channel adapter (`Q8` / `fuseResultsMulti-codegraph-promote`) and Q4-C1 boost-magnitude benchmark tuning remain pending with explicit gates.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Content-derived baseline rank assignment and equal-score tie order in `rankContextEdges` |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Deterministic shifted-row-order impact test |
| `.opencode/specs/.../001-determinism-walk-order/{spec,plan,tasks,checklist,implementation-summary}.md` | Updated | Level-2 packet docs recording 2 DONE + 2 PENDING-with-gate |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Q4-C1 was delivered in Wave-0 using the one-candidate-at-a-time method: read the `rankContextEdges` seam, add the additive reliability term, prove the neutral edge is byte-for-byte identical to the pre-change output, add the byte-identical + trusted-boost tests and commit independently (`e21caf5de6`). This pass read the phase docs and the code-graph isolation history, then implemented det-order at the same seam without importing from system-spec-kit production source. The fuser adapter was left pending because the shared fuser exists but is not currently consumable from code-graph without violating the active isolation guard or forking the fuser.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| RRF-additive trust, never `score × reliability` | A multiplicative-neutral fallback re-orders ties vs the rowid baseline. Additive `baselineRankScore + reliability` keeps neutral edges byte-identical (`002` iter I2, `roadmap.md` BROADENING §2) |
| Keep det-order local to code-graph's isolated seam | The package's isolation guard forbids production source imports from system-spec-kit. The implementation mirrors the content-derived total-order pattern without adding a cross-skill import |
| Promote `fuseResultsMulti` via adapter, don't author a code-graph fuser | The signature is generic (zero Memory coupling) but needs an adapter (synthesize `RrfItem.id`, pre-sort, label channels). Promotable-with-adapter, NOT drop-in (`002` iter-5) |
| Gate Q4-C1 tuning on a benchmark, ship the order-stability gate now | No candidate has a measured before/after number. Neutral edges must remain unchanged against the current deterministic baseline, and the magnitudes are a tuning follow-up (`synthesis/03` §B) |
| Exclude Q1-C1 / Q3-C1 / Q6-* from this seam | Bi-temporal is DEFER-speculative/schema-migration, PPR is unbuilt, the watermark is redundant with the readiness gate, separate sub-phases (`synthesis/04`) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Q4-C1 order-stability (shipped) | Pass | code-graph ranking/impact/gold-battery | 56 tests pass incl. neutral-byte-identical + trusted-boost. The 8 full-package failures are unrelated IPC sandbox EPERM (`e21caf5de6`) |
| det-order cross-rebuild reproducibility | Pass | `code-graph-context-handler.vitest.ts` | Equal-trust impact callers return identical order across shifted DB row orders |
| Fuser-adapter dual-channel fuse | Not built | - | Gated on an isolation-compatible shared-fuser consume path |
| Q4-C1 magnitude tuning | Not built | - | Gated on a code-graph retrieval benchmark (none exists campaign-wide) |
| Strict packet validation | Pass | This sub-phase | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order --strict` |

### Test Coverage Summary

| File | Statements | Branches | Functions |
|------|------------|----------|-----------|
| `code-graph-context.ts` (Q4-C1 paths) | Covered by the Wave-0 ranking suite | Covered | Covered |
| det-order | Covered by shifted-row-order unit test | Covered | Covered |
| fuser adapter / tuning | Not built | Not built | Not built |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

| NFR ID | Target | Actual | Status |
|--------|--------|--------|--------|
| NFR-P01 | No measurable added walk cost (additive term / tie-only re-order / rank-fuse inside the 400 ms budget) | Q4-C1 is an additive term inside the existing rank, det-order is tie-only, fuser is a rank-fuse over already-collected channels | Pass (Q4-C1) / Pending (residue) |
| NFR-S01 | No new external data sink or trust boundary | Code-graph context render is JSON-escaped + trusted-source. No change introduced | Pass |
| NFR-R01 | Byte-identical-by-default or content-derived tie re-order. Reproducible across scan rebuilds for unchanged content | Q4-C1 shipped, det-order now derives baseline rank and ties from content-stable keys | Pass |

<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No measured benefit number**, every leverage/effort rating is structural inference. The Q4-C1 boost magnitudes (0.01 / 0.004 / 0.002) are an unbenchmarked default, which is exactly why the tuning is a gated follow-up (`synthesis/03` §B).
2. **The fuser promotion is adapter-gated**, `fuseResultsMulti` is promotable-with-adapter, not drop-in. The adapter (synthesize id, pre-sort, label channels) remains blocked until code-graph has an isolation-compatible shared-fuser consume path.

<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Implement all four named candidates | Q4-C1 and det-order are done. Fuser adapter and tuning remain pending | The fuser adapter would require either a forbidden cross-skill production import or a local fuser fork. Tuning requires a retrieval benchmark that does not exist |
| Treat Q4-C1 as DONE-and-closed | Recorded Q4-C1 as the shipped predecessor with an explicit tuning follow-up | The order-stability gate is met but the boost magnitudes are unbenchmarked (`030` §14 cand 13 NOTE) |

<!-- /ANCHOR:deviations -->
