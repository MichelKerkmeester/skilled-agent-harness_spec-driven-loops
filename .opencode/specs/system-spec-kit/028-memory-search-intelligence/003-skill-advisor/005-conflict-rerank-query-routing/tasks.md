---
title: "Tasks: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Task Format: T### [P?] Description (file path). Default-off scorer seams implemented for C1/QCR/C6; live promotion gates remain pending and packet 030 was not touched."
trigger_phrases:
  - "advisor conflict rerank routing tasks"
  - "C1 QCR C6 deferred tasks"
  - "query class router tasks"
  - "semantic exact rerank tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/005-conflict-rerank-query-routing"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Implemented default-off scorer seams and deterministic unit coverage for C1/QCR/C6"
    next_safe_action: "Run live conflict-edge and routing-quality benchmarks before any default/live promotion"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-005-conflict-rerank-query-routing"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Tasks: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)

<!-- SPECKIT_LEVEL: 2 -->
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

**Status:** Default-off code seams are implemented in the Skill Advisor scorer. Live/default promotion is still gated: C1 needs a reciprocal `conflicts_with` edge and live data check; QCR needs held-out routing-quality evidence before any live weight change; C6 depends on the RRF spine and remains opt-in behind its own flag. Packet 030 was not touched.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the RRF spine status — all three candidates ride it; the spine exists default-off behind `SPECKIT_ADVISOR_RRF_FUSION`, so C6 can be implemented only as an opt-in seam — REQ-004 [evidence: sibling spec metadata says "Implemented default-off"; `fusion.ts` exports `ADVISOR_RRF_FUSION_FLAG`]
- [ ] T002 [B] Re-verify the C1 dormancy against live data before any live/default promotion: query `skill-graph.sqlite skill_edges` `conflicts_with` count + the `graph-metadata.json` `conflicts_with` arrays; the default-off seam remains live-inert while the count is 0 and all arrays are `[]` (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`) — REQ-005 [prior evidence: iter-010 — 0 `conflicts_with` edges, 20 metadata `[]`, verified live 2026-06-19]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 C1 default-off carrier: conflict mass is kept out of the opt-in RRF lane sum and applied as a post-fusion demotion beside `primaryIntentBonus`, with `spec_kit.scorer.graph_conflict_demote_applied_total` as the applied-counter — REQ-002 [evidence: `fusion.ts`, `graph-causal.ts`, `metrics.ts`, `tests/scorer/conflict-query-rerank.vitest.ts`]
- [x] T004 QCR default-off seam: query class routing computes class→lane multipliers through `effectiveScorerWeights`, remains disabled unless `SPECKIT_ADVISOR_QUERY_CLASS_ROUTING=true`, and preserves `explicit_author` as the strongest lane — REQ-003/REQ-006 [evidence: `fusion.ts`, `tests/scorer/conflict-query-rerank.vitest.ts`; live benchmark still pending]
- [x] T005 C6 default-off seam: exact semantic rerank is gated by `SPECKIT_ADVISOR_EXACT_SEMANTIC_RERANK=true` plus the opt-in RRF path, uses only the fused top-K, bypasses the 0.2 cutoff for that subset, and reorders only within a bounded score window with skill-id fallback — REQ-004/REQ-007 [evidence: `fusion.ts`, `semantic-shadow.ts`, `tests/scorer/conflict-query-rerank.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 [P] C1 fixtures: post-fusion demotion is deterministic + auditable (applied-counter); empty conflict data remains inert by construction (`mcp_server/tests/scorer/conflict-query-rerank.vitest.ts`, existing RRF spine tests) — SC-002
- [x] T007 [P] QCR fixtures: class→lane-multiplier is additive, keeps `explicit_author` dominant, and is default-off; held-out routing-quality benchmark remains the live-promotion gate (`mcp_server/tests/scorer/conflict-query-rerank.vitest.ts`) — SC-002/REQ-006
- [x] T008 [P] C6 fixtures: top-K re-order is deterministic within the bounded exact-rerank window; the 0.2-cutoff bypass is scoped to requested top-K skill ids (`mcp_server/tests/scorer/conflict-query-rerank.vitest.ts`) — SC-002/REQ-007
- [x] T009 Default-inert regression: scorer output remains byte-identical with QCR unset versus explicitly false, and all new ranking seams are flag-gated — SC-001 [evidence: `tests/scorer/conflict-query-rerank.vitest.ts`]
- [x] T010 `tsc` + broad advisor test suite green — DoD [evidence: baseline `npm run typecheck` 0 errors; baseline broad vitest 17 files, 123 passed, 2 skipped; patched broad vitest 18 files, 127 passed, 2 skipped]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Implemented code/test tasks marked `[x]`; live-gate task T002 remains explicitly blocked by the no-live-data constraint
- [x] Gate discipline held: all ranking/recall changes are default-off and packet 030 was not touched
- [x] Verification passed for implemented default-off seams (deterministic / additive / bounded rerank / default-inert)
- [ ] Live promotion evidence remains pending: C1 conflict-edge check, QCR held-out routing-quality benchmark, and any default flip benchmark
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research evidence**: `../research/iterations/iteration-002.md` (C1, F16/F18), `../research/iterations/iteration-003.md` (C6, F1-F4), `../research/iterations/iteration-004.md` (C1/QCR/C6 rows), `../research/iterations/iteration-006.md` (C1 reframe + dormancy flag), `../research/iterations/iteration-010.md` (conflicts_with DORMANT)
- **Sibling sub-phase (hard dep)**: `../001-rrf-determinism-spine/spec.md` (C3 — the RRF spine)
- **Wave-0 shipped record (none done)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no advisor C1/QCR/C6 row)
<!-- /ANCHOR:cross-refs -->
