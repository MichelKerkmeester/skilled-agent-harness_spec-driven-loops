---
title: "Tasks: 116/008 — Playbooks and Default Calibration"
description: "Level 2 task ledger for Phase H manual playbooks, SKILL.md version bump, metadata refresh, and verification."
trigger_phrases:
  - "deep-review playbook"
  - "review-depth manual scenario"
  - "SKILL version bump"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/008-complexity-playbooks-calibration"
    last_updated_at: "2026-05-22T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Populated Level 2 task ledger."
    next_safe_action: "Complete verification and handoff."
    blockers: []
    key_files:
      - "plan.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:1160088300000000000000000000000000000000000000000000000000000000"
      session_id: "116-008-tasks"
      parent_session_id: "116-008-playbooks-and-default-calibration"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No default values are changed in this phase."
---
# Tasks: 116/008 — Playbooks and Default Calibration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## PHASE 1: SETUP

- [x] T001 Read Phase 116 parent spec (`../spec.md`) [5m]
- [x] T002 Read research R8 P2 default-calibration guidance (`../001-research-synthesis/research/research.md`) [10m]
- [x] T003 [P] Read Phase 002-007 implementation summaries [20m]
- [x] T004 [P] Inspect Level 2 templates (`templates/examples/level_2/`) [10m]
- [x] T005 Replace Phase 008 scaffold with Level 2 docs (`spec.md`, `plan.md`, `tasks.md`) [20m]
- [x] T006 Create Level 2 checklist (`checklist.md`) [15m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## PHASE 2: IMPLEMENTATION

- [x] T010 Create root playbook README (`manual_testing_playbook/README.md`) [15m]
- [x] T011 Create validator warn rollout scenario (`scenario-01-validator-warn-rollout.md`) [15m]
- [x] T012 Create strict v2 validator scenario (`scenario-02-validator-strict-v2.md`) [15m]
- [x] T013 Create reducer search debt scenario (`scenario-03-reducer-search-debt.md`) [15m]
- [x] T014 Create `candidateCoverageGate` STOP scenario (`scenario-04-stop-gate-candidate.md`) [15m]
- [x] T015 Create `graphlessFallbackGate` STOP scenario (`scenario-05-stop-gate-graphless-fallback.md`) [15m]
- [x] T016 Create graph vocabulary scenario (`scenario-06-graph-vocabulary.md`) [15m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## PHASE 3: VERIFICATION

- [x] T020 Update only the `version:` field (`.opencode/skills/deep-review/SKILL.md`) [5m]
- [x] T021 Verify `SKILL.md` diff shows only the version-line change [5m]
- [x] T030 Refresh metadata (`description.json`, `graph-metadata.json`) [5m]
- [x] T031 Run strict spec validation [5m]
- [x] T032 Run playbook inventory and grep checks [5m]
- [x] T033 Run requested full `tests/deep-loop/` Vitest command [10m]
- [x] T034 Finalize `implementation-summary.md` with Known Limitations and Commit Handoff [15m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` or explicitly documented.
- [x] No `[B]` blocked tasks remaining.
- [x] Six scenario files follow the requested structure.
- [x] Defaults are evidence-backed or left unchanged.
- [x] Checklist.md fully verified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
