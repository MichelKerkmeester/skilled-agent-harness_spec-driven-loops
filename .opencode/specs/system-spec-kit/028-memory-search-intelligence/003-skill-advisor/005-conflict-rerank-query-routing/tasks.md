---
title: "Tasks: Skill Advisor — Conflict Re-rank, Query-Class Routing & Semantic Exact-Rerank (C1/QCR/C6)"
description: "Task Format: T### [P?] Description (file path). Gate-first, all candidates deferred. All tasks PENDING — none of C1/QCR/C6 shipped in 030 Wave-0."
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
    recent_action: "Author C1/QCR/C6 deferred-routing task breakdown (re-plan; all PENDING)"
    next_safe_action: "Verify each gate (T001-T002) before implementing any candidate"
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
    completion_pct: 0
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

**Status:** All tasks PENDING — none of C1/QCR/C6 shipped in 030 Wave-0 (`git log 1ecc531431..ab5459fb6d` has no advisor/conflict/query-class/rerank commit; 030 §14 candidate-status table covers only Memory/Code-Graph Wave-0 candidates, no advisor C1/QCR/C6 row). Each candidate is PENDING with its gate: C1 = `dormant-data` (needs a reciprocal `conflicts_with` edge) + `shared-infra-dep` (001 RRF spine); QCR = `needs-benchmark` (held-out routing-quality) + `shared-infra-dep`; C6 = `shared-infra-dep` (001 RRF spine / C3 rank-based survivor set).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 [B] Confirm the 001 RRF spine status (sibling `001-rrf-determinism-spine`, candidate C3) — all three candidates ride it; C6 is BLOCKED until C3 ships (`../001-rrf-determinism-spine/spec.md`) — REQ-004 [evidence: research.md C3 "determinism spine for C1/C2/C6"; iter-004 F9]
- [ ] T002 [B] Re-verify the C1 dormancy against live data: query `skill-graph.sqlite skill_edges` `conflicts_with` count + the `graph-metadata.json` `conflicts_with` arrays; C1 stays PENDING while the count is 0 and all arrays are `[]` (`.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`) — REQ-005 [evidence: iter-010 — 0 `conflicts_with` edges, 20 metadata `[]`, verified live 2026-06-19]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 [B] C1 (gated on a declared reciprocal `conflicts_with` edge): lift the `conflicts_with: -0.35` mass out of the `graph_causal` lane sum and apply a deterministic post-fusion demotion in the ranking comparator beside `primaryIntentBonus`, with its own applied-counter (`mcp_server/lib/scorer/lanes/graph-causal.ts:18`; `mcp_server/lib/scorer/fusion.ts:425-433`) — REQ-002 [evidence: iter-002 C1; iter-006 reframe; iter-010]
- [ ] T004 [B] QCR (gated on a held-out routing-quality benchmark + calibrated class taxonomy): compute a class→lane-multiplier and feed it through `effectiveScorerWeights` before the per-skill loop, additive + `explicit_author`-dominant, shadow-only on first ship (`mcp_server/lib/scorer/fusion.ts:69-82`) — REQ-003/REQ-006 [evidence: iter-001 Q1; iter-004 QCR; roadmap.md:75]
- [ ] T005 [B] C6 (gated on the 001 RRF spine / C3): re-score the fused top-K survivors with full-precision cosine (bypassing the 0.2 cutoff for that subset only) as a bounded tiebreak with a deterministic skill-id tiebreak, reusing `cosineSimilarity` + cached vectors (`mcp_server/lib/scorer/fusion.ts:425+`; `lanes/semantic-shadow.ts:47-69,194-199`) — REQ-004/REQ-007 [evidence: iter-003 C6, F1-F4; iter-004 C6 row]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 [P] C1 fixtures: post-fusion demotion is deterministic + auditable (applied-counter); inert (byte-identical ranking) when every skill declares `conflicts_with []` (`mcp_server/tests/*.vitest.ts`) — SC-002
- [ ] T007 [P] QCR fixtures: class→lane-multiplier is additive, keeps `explicit_author` dominant, and is shadow-only by default (no live weight change); held-out routing-quality benchmark shows a net gain before any live weight change (`mcp_server/tests/*.vitest.ts`) — SC-002/REQ-006
- [ ] T008 [P] C6 fixtures: top-K re-order is byte-stable via the skill-id tiebreak; the 0.2-cutoff bypass is scoped to top-K only; no recall regression vs the exhaustive cosine pass (`mcp_server/tests/*.vitest.ts`) — SC-002/REQ-007
- [ ] T009 Default-inert regression: with each gate unmet, scorer output matches the C3-only (or pre-spine weighted-sum) baseline exactly — no default-on behavior (`mcp_server/tests/*.vitest.ts`) — SC-001
- [ ] T010 `tsc` + advisor test suite green; independent adversarial review refuting QCR mis-routing, C6 non-determinism, and C1 over-eager demotion — DoD
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (or explicitly deferred with the gate recorded)
- [ ] No `[B]` blocked tasks remaining once gates materialize
- [ ] Gate discipline held: C1 not shipped without a declared conflict edge (T002); QCR not shipped without a benchmark (T007); C6 not shipped before C3 (T001)
- [ ] Verification passed for every promoted candidate (deterministic / additive / byte-stable; no recall regression; default-inert otherwise)
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
