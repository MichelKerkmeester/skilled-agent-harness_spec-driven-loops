---
title: "Changelog: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6) [003-skill-advisor/005-conflict-rerank-query-routing]"
description: "Chronological changelog for the Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6) phase."
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

> Spec folder: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/028-memory-search-intelligence/003-skill-advisor`

### Summary

Default-off scorer code shipped for the three routing refinements. The live scorer remains byte-identical with the new flags disabled, and packet 030 was not touched. The implementation keeps the original gate discipline: C1 needs real conflict-edge data before it has live effect, QCR needs held-out routing-quality evidence before any default/live weight change, and C6 needs RRF plus benchmark/recall acceptance before any default flip.

### Added

- Confirm the RRF spine status — all three candidates ride it; the spine exists default-off behind SPECKIT_ADVISOR_RRF_FUSION, so C6 can be implemented only as an opt-in seam — REQ-004
- Default-inert regression: scorer output remains byte-identical with QCR unset versus explicitly false, and all new ranking seams are flag-gated — SC-001
- Implemented code/test tasks marked [x]; live-gate task T002 remains explicitly blocked by the no-live-data constraint
- Verification passed for implemented default-off seams (deterministic / additive / bounded rerank / default-inert)
- CHK-012 Error handling implemented — evidence: QCR is disabled by default and preserves explicit_author dominance; exact rerank returns an empty map if vectors are unavailable
- CHK-020 Acceptance criteria met for default-off implementation — evidence: no default-on behavior; live promotion gates remain explicit

### Changed

- C1 default-off carrier: conflict mass is kept out of the opt-in RRF lane sum and applied as a post-fusion demotion beside primaryIntentBonus, with spec_kit.scorer.graph_conflict_demote_applied_total as the applied-counter — REQ-002
- QCR default-off seam: query class routing computes class→lane multipliers through effectiveScorerWeights, remains disabled unless SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true, and preserves explicit_author as the strongest lane — REQ-003/REQ-006
- C6 default-off seam: exact semantic rerank is gated by SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK=true plus the opt-in RRF path, uses only the fused top-K, bypasses the 0.2 cutoff for that subset, and reorders only within a bounded score window with skill-id fallback — REQ-004/REQ-007
- tsc + broad advisor test suite green — DoD
- Gate discipline held: all ranking/recall changes are default-off and packet 030 was not touched
- CHK-001 Requirements documented in spec.md (REQ-001..007 with per-candidate gates) — evidence: spec.md §4

### Fixed

- [P] C1 fixtures: post-fusion demotion is deterministic + auditable (applied-counter); empty conflict data remains inert by construction (mcp_server/tests/scorer/conflict-query-rerank.vitest.ts, existing RRF spine tests) — SC-002
- [P] QCR fixtures: class→lane-multiplier is additive, keeps explicit_author dominant, and is default-off; held-out routing-quality benchmark remains the live-promotion gate (mcp_server/tests/scorer/conflict-query-rerank.vitest.ts) — SC-002/REQ-006
- [P] C6 fixtures: top-K re-order is deterministic within the bounded exact-rerank window; the 0.2-cutoff bypass is scoped to requested top-K skill ids (mcp_server/tests/scorer/conflict-query-rerank.vitest.ts) — SC-002/REQ-007
- CHK-002 Technical approach defined in plan.md (gate-first sequencing; Phases 1-3; affected-surface inventory) — evidence: plan.md §3-4, FIX ADDENDUM
- CHK-FIX-001 Each candidate has a finding class: C1/QCR/C6 are algorithmic scorer-seam changes
- CHK-FIX-002 Same-class producer inventory completed — evidence: read graph-causal.ts, fusion.ts, semantic-shadow.ts, and existing RRF spine tests before editing

### Verification

- Baseline npm run typecheck - PASS — 0 errors
- Baseline broad vitest - PASS — 17 files, 123 passed, 2 skipped
- Patched npm run typecheck - PASS — 0 errors
- Patched broad vitest - PASS — 18 files, 127 passed, 2 skipped
- Comment hygiene - PASS — modified code/test files clean
- Alignment drift - PASS — 291 files scanned, 0 findings
- Live MCP benchmark/reindex/scan/schema migration - NOT RUN — explicitly out of scope
- Tasks complete - 12 completed task item(s) recorded

### Files Changed

| File | Action | What changed |
|---|---|---|
| `spec.md` | Updated | Default-off implementation state, live promotion gates, and affected surfaces |
| `plan.md` | Updated | Gate-first promotion plan with implemented code seams |
| `tasks.md` | Updated | Implemented tasks marked done; live evidence gates left pending |
| `checklist.md` | Updated | Verification evidence and remaining no-commit/live-gate deferrals |
| `implementation-summary.md` | Updated | This implementation summary |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts` | Modified | QCR flag/classification/multipliers, C6 top-K exact-rerank comparator path, C1 conflict demotion counter |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts` | Modified | Exact subset cosine scoring for C6 |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts` | Modified | Conflict demotion counter definition |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/scorer/conflict-query-rerank.vitest.ts` | Created | Deterministic unit coverage for C1/QCR/C6 seams |

### Follow-Ups

- CHK-FIX-007 Evidence pinned to a fix SHA or explicit diff range — deferred: user requested no git commit
- [B] Re-verify the C1 dormancy against live data before any live/default promotion: query skill-graph.sqlite skill_edges conflicts_with count + the graph-metadata.json conflicts_with arrays; the default-off seam remains live-inert while the count is 0 and all arrays are [] (.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite) — REQ-005 [prior evidence: iter-010 — 0 conflicts_with edges, 20 metadata [], verified live 2026-06-19]
- Live promotion evidence remains pending: C1 conflict-edge check, QCR held-out routing-quality benchmark, and any default flip benchmark
- Live promotion is not complete. C1/QCR/C6 are implemented default-off; no default/live routing flip was made.
- C1 still needs live data evidence. This task did not query the live SQLite graph or metadata arrays because live checks were out of scope.
- QCR's taxonomy and multipliers need benchmark validation. The current values are an opt-in seam, not a calibrated default.
