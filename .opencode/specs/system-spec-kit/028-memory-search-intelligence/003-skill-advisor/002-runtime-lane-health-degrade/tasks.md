---
title: "Tasks: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "Task Format: T### [P?] Description (file path). Baseline-first, P0-prerequisite-first. All tasks PENDING — none shipped in 030 Wave-0."
trigger_phrases:
  - "advisor lane health degrade tasks"
  - "C5 liveTotal elision tasks"
  - "advisor baseline first tasks"
  - "degraded lane flag tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Author C5/C5a/AMB lane-health-degrade task breakdown (re-plan; all PENDING)"
    next_safe_action: "Capture the confidence baseline (T001), then build the runtime lane-health signal (T002)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-002-runtime-lane-health-degrade"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: Skill Advisor — Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)

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

**Status:** All tasks PENDING — none of C5/C5a/AMB shipped in 030 Wave-0 (`git log 1ecc531431..ab5459fb6d` has no advisor/lane/C5 commit; 030 §14 has no advisor row; 030 spec line 106 lists C5 as NO-GO until baseline + lane-health signal). The candidates are PENDING with gate = `needs-baseline` (REQ-001) + `shared-infra-dep` on a runtime lane-health signal the scorer lacks (REQ-002).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Baseline + P0 prerequisite — a HARD GATE before any C5 elision.

- [ ] T001 [P0] Capture the confidence baseline — force `graph_causal` runtime-empty for a representative prompt, record before/after `liveNormalized` / confidence delta; remove the unsourced "~13%" and replace with the measured value (or UNKNOWN until measured) (`mcp_server/lib/scorer/fusion.ts:388`) — REQ-001 [evidence: roadmap.md:218,262; BROADENING §2]
- [ ] T002 [P0] Build the runtime per-lane health signal classing each lane `healthy` / `runtime_degraded` / `matched_nothing`, call-scoped, from runtime score-presence (`laneScores[lane].length` / `scores.graph_causal`) + rebuild/health state — NOT from `disabled` or `isLiveScorerLane` (`mcp_server/lib/scorer/fusion.ts:337,343-345`; `lane-registry.ts` if registry-keyed) — REQ-002 [evidence: iter-014 G14-03; iter-016 J16-01]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> C5 elision (consumes the Phase-1 health signal), then C5a + AMB legibility.

- [ ] T003 [P0] C5: widen the `liveTotal` filter to also exclude `runtime_degraded` lanes; keep `matched_nothing` lanes in the denominator (`mcp_server/lib/scorer/fusion.ts:343-345`) — REQ-003 [evidence: roadmap.md:90; synthesis 01-go-candidates.md:103]
- [ ] T004 Prove `liveNormalized` degrades-to-remaining for a degraded lane and is unchanged for a zero-match lane (`mcp_server/lib/scorer/fusion.ts:388`) — SC-001/SC-002
- [ ] T005 C5a: add a per-call degraded-lane list and make `metrics.liveLaneCount` runtime-accurate (currently registry-derived) (`mcp_server/lib/scorer/fusion.ts:535-536`) — REQ-005 [evidence: iter-003 C5a; roadmap.md:91; retrieval.md:300]
- [ ] T006 AMB: report the degraded-lane condition on the ambiguity/abstention surface without changing abstention thresholds (`mcp_server/lib/scorer/fusion.ts:484-513`) — REQ-006 [evidence: deltas/iter-004.jsonl AMB rank 9]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 [P] Add degrade-vs-matched-nothing fixtures: degraded lane elided (confidence rises to degrade-to-remaining); zero-match lane retained (no over-credit) (`mcp_server/tests/*.vitest.ts`) — SC-001/SC-002
- [ ] T008 [P] Add the all-lanes-healthy byte-identical regression assertion (`mcp_server/tests/*.vitest.ts`) — REQ-004
- [ ] T009 Add C5a/AMB legibility assertions: degraded-lane list + runtime live-lane count present; abstention surface reports degradation (`mcp_server/tests/*.vitest.ts`) — SC-003
- [ ] T010 `tsc` + advisor test suite green; independent adversarial review explicitly refuting the over-credit inversion — DoD
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] P0 gate satisfied: baseline captured (T001) AND lane-health signal built (T002) BEFORE C5 elision (T003)
- [ ] Verification passed (degrade-to-remaining proven; no over-credit; happy path byte-identical)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research evidence**: `../research/iterations/iteration-003.md` (Q6 F5/F7, C5, C5a), `../research/iterations/iteration-014.md` (G14-03), `../research/iterations/iteration-016.md` (J16-01)
- **Wave-0 shipped record (none done)**: `../../../030-memory-search-intelligence-impl/spec.md` §14 (no advisor row) + line 106 (C5 NO-GO)
<!-- /ANCHOR:cross-refs -->
