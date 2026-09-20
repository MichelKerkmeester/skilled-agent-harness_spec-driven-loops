---
title: "Tasks: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "phase 022 tasks"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/022-benchmark-rerun-and-coverage-fill"
    last_updated_at: "2026-07-07T13:10:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All implementation tasks completed"
    next_safe_action: "Write checklist.md and implementation-summary.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "benchmark-coverage-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Phase 022 - Benchmark Rerun & Manual-Testing Coverage Fill

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Router-mode rerun (pre-coverage-fill): `PASS` 100/100, scenarios=25
- [x] T002 [P] Live-mode rerun (pre-coverage-fill, background): `PASS` 93/100, scenarios=25
- [x] T003 Read full playbook root index to establish current per-mode/category inventory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Launch 7-way parallel audit Workflow (6 mode agents + 1 parent-hub agent), each grounded in real `mode-registry.json`/`SKILL.md`/existing-scenario reads
- [x] T005 Synthesis agent: reconcile 7 raw reports, reject weak/redundant recommendations, resolve ID collisions
- [x] T006 [P] Author `PB-007` (interface variation-set selection proof)
- [x] T007 [P] Author `AI-004` (audit vs sk-code code-review collision boundary)
- [x] T008 [P] Author `MG-004` (md-generator brief-only authoring-boundary)
- [x] T009 [P] Author `HM-004` (hub-level design-mode pairing before an Open Design run)
- [x] T010 Update Advisor Integration table + header ID range (AI-001..AI-004)
- [x] T011 Update md-generator Pipeline table + header ID range (MG-001..MG-004)
- [x] T012 Update Parity Behavior table + header ID range (PB-001..PB-007)
- [x] T013 Update Hub Manager Intake table + header ID range (HM-001..HM-004)
- [x] T014 Update critical-path scenario list (+MG-004)
- [x] T015 Update Section 16 cross-reference index (+4 rows) and totals (33->37, 15->16, 8->10)
- [x] T016 Update Overview + Coverage-note prose to mention the 4 new behaviors
- [x] T017 [P] Fix `README.md`'s stale "33-scenario" playbook description line
- [x] T018 Bump playbook file version 1.1.0.0 -> 1.2.0.0
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T019 Router-mode rerun against updated corpus: scenarios 25 -> 27, `PASS` 100/100
- [x] T020 Confirm pre-existing `parseWarnings` unchanged before/after (not a new regression)
- [x] T021 Live-mode rerun against final 27-scenario corpus for the complete baseline: `PASS` 94/100
- [x] T022 Write this phase's own `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both benchmark modes confirm no regression AND reflect the final, coverage-filled corpus
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../021-command-surface-validator-and-agent-parity/`
<!-- /ANCHOR:cross-refs -->
