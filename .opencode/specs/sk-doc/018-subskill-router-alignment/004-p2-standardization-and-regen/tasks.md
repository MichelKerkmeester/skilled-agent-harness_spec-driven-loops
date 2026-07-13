---
title: "Tasks: P2 Standardization and Registry Regeneration"
description: "Standardize all packet trigger/handoff sections, synchronize router projections, and record final verification."
trigger_phrases:
  - "router regeneration tasks"
  - "trigger drift tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/018-subskill-router-alignment/004-p2-standardization-and-regen"
    last_updated_at: "2026-07-13T06:50:00Z"
    last_updated_by: "opencode"
    recent_action: "Completed P2 source and projection work"
    next_safe_action: "Orchestrator may rebuild stale dist and rerun strict validation"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-p2-standardization-and-regen"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: P2 Standardization and Registry Regeneration

<!-- SPECKIT_LEVEL: 3 -->

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm no scoped generator exists [EVIDENCE: scoped generator search]
- [x] T002 Define trigger extraction and multiplexed create-skill split [EVIDENCE: decision-record ADR-001]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Apply P2-01 activation-heading placement [EVIDENCE: structure scan]
- [x] T004 Apply P2-02 one trigger-line placement [EVIDENCE: structure scan]
- [x] T005 Apply P2-03 handoff heading standard [EVIDENCE: structure scan]
- [x] T006 Apply P2-04 handoff lead-in standard [EVIDENCE: structure scan]
- [x] T007 Apply P2-05 exact sibling-id formatting [EVIDENCE: handoff review]
- [x] T008 Hand-sync `mode-registry.json` and `hub-router.json` [EVIDENCE: drift extractor]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run ten package checks [EVIDENCE: package-check batch PASS]
- [x] T010 Parse both JSON files and run source drift extraction [EVIDENCE: JSON parse and `drift: 0`]
- [x] T011 Replay all six routing queries [EVIDENCE: final replay target matrix]
- [ ] T012 Run exact recursive strict validation after stale dist is rebuilt outside this scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Exact strict validation remains blocked by stale compiled dist
- [x] No implementation task is blocked
- [x] Package, JSON, drift, and routing gates pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
