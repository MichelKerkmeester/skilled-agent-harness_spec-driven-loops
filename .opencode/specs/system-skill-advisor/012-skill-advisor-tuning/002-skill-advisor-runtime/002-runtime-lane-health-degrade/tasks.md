---
title: "Tasks: Skill Advisor Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)"
description: "Task Format: T### [P?] Description (file path). Baseline-first, P0-prerequisite-first. Runtime lane-health degrade tasks implemented in this 028 sub-phase. 030 untouched."
trigger_phrases:
  - "advisor lane health degrade tasks"
  - "C5 liveTotal elision tasks"
  - "advisor baseline first tasks"
  - "degraded lane flag tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/012-skill-advisor-tuning/002-skill-advisor-runtime/002-runtime-lane-health-degrade"
    last_updated_at: "2026-06-19T08:19:43Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented C5/C5a/AMB lane-health-degrade tasks and recorded test evidence"
    next_safe_action: "Run final strict validation and keep packet 030 untouched"
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
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Skill Advisor Runtime Lane-Health & Graceful Lane-Degrade (C5/C5a/AMB)

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

**Status:** All tasks DONE in this 028 sub-phase. No candidate was already shipped in 030, and this implementation did not touch packet 030.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Baseline + P0 prerequisite, a HARD GATE before any C5 elision.

- [x] T001 [P0] Capture the confidence baseline, representative prompt `alpha routing surface nearby neutral words`, baseline confidence `0.6060`, degraded confidence `0.6189`, delta `+0.0129`, `liveNormalized 0.1600 -> 0.1839`, pinned in `mcp_server/tests/scorer/runtime-lane-health.vitest.ts`, REQ-001
- [x] T002 [P0] Build the runtime per-lane health signal classing each lane `healthy` / `runtime_degraded` / `matched_nothing`, call-scoped, from runtime score-presence plus handler-owned stale graph health state, not derived from `disabled` or registry-static liveness (`mcp_server/lib/scorer/types.ts`, `mcp_server/lib/scorer/fusion.ts`, `mcp_server/handlers/advisor-recommend.ts`), REQ-002
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> C5 elision (consumes the Phase-1 health signal), then C5a + AMB legibility.

- [x] T003 [P0] C5: widened the `liveTotal` filter to also exclude `runtime_degraded` lanes. Kept `matched_nothing` lanes in the denominator (`mcp_server/lib/scorer/fusion.ts`), REQ-003
- [x] T004 Prove `liveNormalized` degrades-to-remaining for a degraded lane and is unchanged for a zero-match lane. Mutation falsifier proved the test fails if degraded lanes remain in `liveTotal` (`mcp_server/tests/scorer/runtime-lane-health.vitest.ts`), SC-001/SC-002
- [x] T005 C5a: added per-call degraded-lane list and runtime-accurate `metrics.liveLaneCount`. Handler emits prompt-safe `runtimeLaneHealth` only when degraded lanes exist (`mcp_server/lib/scorer/fusion.ts`, `mcp_server/handlers/advisor-recommend.ts`, `mcp_server/schemas/advisor-tool-schemas.ts`), REQ-005
- [x] T006 AMB: report degraded-lane condition on the ambiguity/abstention surface without changing abstention thresholds (`mcp_server/lib/scorer/fusion.ts`, `mcp_server/handlers/advisor-recommend.ts`), REQ-006
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 [P] Add degrade-vs-matched-nothing fixtures: degraded lane elided (confidence rises to degrade-to-remaining). Zero-match lane retained (no over-credit) (`mcp_server/tests/scorer/runtime-lane-health.vitest.ts`), SC-001/SC-002
- [x] T008 [P] Add the all-lanes-healthy byte-identical regression assertion (`mcp_server/tests/scorer/runtime-lane-health.vitest.ts`), REQ-004
- [x] T009 Add C5a/AMB legibility assertions: degraded-lane list + runtime live-lane count present. Abstention surface reports degradation (`mcp_server/tests/scorer/runtime-lane-health.vitest.ts`, `mcp_server/tests/handlers/advisor-recommend.vitest.ts`, `mcp_server/tests/schemas/advisor-tool-schemas.vitest.ts`), SC-003
- [x] T010 `tsc` + targeted advisor suite green. Mutation falsifier explicitly refuted the over-credit inversion by failing when degraded lanes remained in `liveTotal`, DoD
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] P0 gate satisfied: baseline captured (T001) AND lane-health signal built (T002) BEFORE C5 elision (T003)
- [x] Verification passed (degrade-to-remaining proven, no over-credit, happy path byte-identical)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Research evidence**: `../research/iterations/iteration-003.md` (Q6 F5/F7, C5, C5a), `../research/iterations/iteration-014.md` (G14-03), `../research/iterations/iteration-016.md` (J16-01)
- **Wave-0 shipped record (none done)**: Wave-0 record (no advisor row) + (C5 NO-GO)
<!-- /ANCHOR:cross-refs -->
