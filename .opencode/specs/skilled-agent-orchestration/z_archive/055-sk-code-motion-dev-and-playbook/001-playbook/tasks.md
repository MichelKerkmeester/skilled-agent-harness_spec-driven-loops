---
title: "Tasks: sk-code Manual Testing Playbook Motion.dev Refinement"
description: "Task ledger for Packet 1 playbook planning, implementation, and verification."
trigger_phrases:
  - "sk-code playbook tasks"
  - "motion.dev playbook tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/055-sk-code-motion-dev-and-playbook/001-playbook"
    last_updated_at: "2026-05-05T07:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Created Packet 1 task ledger"
    next_safe_action: "Complete implementation tasks and verification tasks"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: sk-code Manual Testing Playbook Motion.dev Refinement

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T-NNN [P0/P1/P2] [P-parallel-marker] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 [P0] [P] Read sk-doc playbook creation reference (`.opencode/skills/sk-doc/references/specific/manual_testing_playbook_creation.md`)
- [x] T-002 [P0] [P] Read sk-doc root and snippet templates (`.opencode/skills/sk-doc/assets/documentation/testing_playbook/`)
- [x] T-003 [P0] [P] Read existing sk-code root playbook and representative scenario files (`.opencode/skills/sk-code/manual_testing_playbook/`)
- [x] T-004 [P1] [P] Read parent spec and in-repo motion.dev usage anchors (`../spec.md`, `a_nobel_en_zn/2_javascript/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-005 [P0] Create Level 2 child planning artifacts (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`). Evidence: files created; validator required and accepted them.
- [x] T-006 [P0] [P] Create MR-001 motion API smoke scenario (`05--motion-dev-and-animation-regression/001-motion-api-smoke.md`). Evidence: file exists with five required sections.
- [x] T-007 [P0] [P] Create MR-002 CDN bundle version pin scenario (`05--motion-dev-and-animation-regression/002-cdn-bundle-version-pin.md`). Evidence: file exists with five required sections.
- [x] T-008 [P0] [P] Create MR-003 reduced-motion scenario (`05--motion-dev-and-animation-regression/003-prefers-reduced-motion.md`). Evidence: file exists with five required sections.
- [x] T-009 [P0] [P] Create MR-004 animation regression baseline scenario (`05--motion-dev-and-animation-regression/004-animation-regression-baseline.md`). Evidence: file exists with five required sections.
- [x] T-010 [P0] [P] Create CB-001 cross-browser animation scenario (`06--cross-browser-and-performance-gates/001-cross-browser-animate.md`). Evidence: file exists with five required sections.
- [x] T-011 [P0] [P] Create CB-002 Core Web Vitals gate scenario (`06--cross-browser-and-performance-gates/002-cwv-gates.md`). Evidence: file exists with five required sections.
- [x] T-012 [P0] [P] Create CB-003 GPU compositing scenario (`06--cross-browser-and-performance-gates/003-gpu-compositing.md`). Evidence: file exists with five required sections.
- [x] T-013 [P0] Update root playbook index, overview, category summaries, and cross-reference sections (`manual_testing_playbook.md`). Evidence: root playbook now includes sections 11-14 and MR/CB index rows.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-014 [P0] Verify no files outside approved scope changed (`git status --short`). Evidence: Packet 1 created/modified only files under approved spec and playbook paths; unrelated dirty files were present before editing.
- [x] T-015 [P0] Run strict spec validation (`validate.sh 001-playbook --strict`). Evidence: strict validator returned exit 0.
- [x] T-016 [P1] Count line totals for final packet report (`wc -l`). Evidence: final report includes line counts.
- [x] T-017 [P1] Confirm new scenario IDs are indexed in root playbook (`rg "MR-00|CB-00" manual_testing_playbook.md`). Evidence: root playbook contains MR-001..MR-004 and CB-001..CB-003 rows.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks complete. Evidence: T-005 through T-015 are marked complete.
- [x] Strict validation exits 0. Evidence: `validate.sh ... --strict --verbose` returned exit 0.
- [x] Root playbook reports 17 deterministic scenarios across 6 categories. Evidence: root overview updated.
- [x] New scenario files remain inside the two new category folders. Evidence: `find` inventory confirmed seven files in folders 05 and 06.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Root Playbook**: See `.opencode/skills/sk-code/manual_testing_playbook/manual_testing_playbook.md`
<!-- /ANCHOR:cross-refs -->
