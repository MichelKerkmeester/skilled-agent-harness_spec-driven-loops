---
title: "Changelog: Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence) [002-code-graph/001-determinism-walk-order]"
description: "Chronological changelog for the Code-Graph Determinism + Walk-Order (Structural Retrieval Intelligence) phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-19

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph/001-determinism-walk-order` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/002-code-graph`

### Summary

The Q4-C1 RRF-additive rank-time trust blend shipped in the flat Wave-0 packet (030) and is the prerequisite already in place: the code-graph impact/dependency ranker blends the already-plumbed confidence/evidenceClass edge metadata into ranking as an additive term. This pass implemented det-context-order-global: rankContextEdges now derives a stable content key from the related node content hash, related symbol id, file/fqName, edge type and endpoints, assigns baseline rank from that deterministic order, then uses the same key for equal-score ties. The fuseResultsMulti dual-channel adapter (Q8 / fuseResultsMulti-codegraph-promote) and Q4-C1 boost-magnitude benchmark tuning remain pending with explicit gates.

### Added

- Q4-C1 RRF-additive rank-time trust — blend confidence/evidenceClass into ranking as rankScore = 1/(60+index+1) + clamp(confidence)*evidenceClassFactor (additive, NOT score × reliability; structural weight unmutated); neutral edge byte-identical to the rowid baseline (code-graph-context.ts:355-378) [Done, commit e21caf5de6; 56 ranking/impact/gold-battery tests pass; the 8 full-package failures are unrelated IPC sandbox EPERM; 030 §14 cand 13].
- det-context-order-global — replace DB-iteration-derived ordering with content-derived baseline rank assignment and equal-score ties in rankContextEdges; key order is related content hash, related symbol id, file/fqName, edge type and endpoints; covers the finalize() seam so impact + dependency/callees + outline-export are reproducible across scan rebuilds [Done — implemented in code-graph-context.ts; deterministic unit test verifies equal-trust impact callers return identical order across shifted DB row orders].
- Author plan.md, tasks.md, implementation-summary.md from the system-spec-kit Level-2 templates.
- CHK-010 Shipped Q4-C1 blend is RRF-additive, never multiplicative
- CHK-021 det-order cross-rebuild reproducibility test implemented (REQ-002)
- CHK-031 No new external data sink or trust boundary introduced

### Changed

- Re-confirm the shipped Q4-C1 commit against 030 section 14 candidate 13 (e21caf5de6).
- Record the cross-subsystem consume-the-shared-signature contract (001 total-comparator + fuseResultsMulti, zero Memory coupling) in spec.md + plan.md.
- Confirm the out-of-scope cluster (Q1-C1 bi-temporal, Q3-C1 PPR, Q6-* watermark, CG-edge-staleness) is recorded as belonging to other code-graph sub-phases, not silently dropped (spec.md section 3 Out of Scope).
- All 4 candidates have a final status in spec.md section 11 (2 DONE, 2 PENDING-with-gate).
- The shipped Q4-C1 predecessor traces to Wave-0 commit e21caf5de6 in ../../../030-memory-search-intelligence-impl/spec.md section 14 candidate 13.
- Each gated residue task names its block reason (isolation-compatible shared-fuser consume path / needs-benchmark) and its consuming dependency; none is disguised as incomplete in-flight work.

### Fixed

- Run validate.sh --strict on this sub-phase and fix structure issues.

### Verification

- Q4-C1 order-stability (shipped) - Pass
- det-order cross-rebuild reproducibility - Pass
- Fuser-adapter dual-channel fuse - Not built
- Q4-C1 magnitude tuning - Not built
- Strict packet validation - Pass
- Tasks complete - 11 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-context.ts` | Modified | Content-derived baseline rank assignment and equal-score tie order in rankContextEdges |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-graph-context-handler.vitest.ts` | Modified | Deterministic shifted-row-order impact test |
| `.opencode/specs/.../001-determinism-walk-order/{spec,plan,tasks,checklist,implementation-summary}.md` | Updated | Level-2 packet docs recording 2 DONE + 2 PENDING-with-gate |

### Follow-Ups

- [B] Q8-fuser-adapter / fuseResultsMulti-codegraph-promote — adapter over the shared fuseResultsMulti (shared/algorithms/rrf-fusion.ts) for the dual CALLS+IMPORTS impact channels: synthesize RrfItem.id, pre-sort each channel, label the dual GRAPH channels, apply the cross-channel bonus (code-graph-context.ts:627-671) [Pending — gate: isolation-compatible shared-fuser consume path; current code-graph isolation checks block production source imports from system-spec-kit and @spec-kit/*; do not fork a code-graph-specific fuser].
- [B] Q4-C1-benchmark-tuning — re-tune CONTEXT_EDGE_EVIDENCE_RANK_FACTORS (EXTRACTED/STRUCTURED 0.01, INFERRED 0.004, AMBIGUOUS 0.002) against a code-graph retrieval benchmark (code-graph-context.ts:101-108) [Pending — gate: needs-benchmark; magnitudes are an unbenchmarked default; no before/after number exists campaign-wide (030 §14 cand 13 NOTE; synthesis/03 §B)].
- The fuser adapter is built against an isolation-compatible shared-fuser consume path, and Q4-C1 magnitudes are re-tuned against a retrieval benchmark (downstream verification, tracked).
- No measured benefit number — every leverage/effort rating is structural inference; the Q4-C1 boost magnitudes (0.01 / 0.004 / 0.002) are an unbenchmarked default, which is exactly why the tuning is a gated follow-up (synthesis/03 §B).
- The fuser promotion is adapter-gated — fuseResultsMulti is promotable-with-adapter, not drop-in; the adapter (synthesize id, pre-sort, label channels) remains blocked until code-graph has an isolation-compatible shared-fuser consume path.
