---
title: "Tasks: Skill and Mode README Overhaul"
description: "Calibrate, write the swarm brief, author fourteen READMEs across five parallel agents, then reconcile HVR and validate every file."
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-documentation-quality-program/004-skill-mode-readme-overhaul"
    last_updated_at: "2026-07-22T13:08:26Z"
    last_updated_by: "claude"
    recent_action: "All fourteen READMEs authored, HVR-cleaned and validated."
    next_safe_action: "Proceed to phase 005 (code READMEs)."
    blockers: []
    key_files: []
---

# Tasks: Skill and Mode README Overhaul

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

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read `skill-readme-template.md`, the `cli-external-orchestration/cli-claude-code/README.md` exemplar, and one bare README to calibrate voice and depth.
- [x] T002 Confirm the fourteen targets and their current state by line count and header scan (eleven bare sk-doc modes, two sk-code surfaces, `sk-git`).
- [x] T003 Write the shared swarm brief (template, exemplar, HVR, sourcing rules, special cases for the surfaces and `sk-git`).

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Author `sk-doc/create-readme/README.md` and `sk-doc/create-skill/README.md` (dogfood; stale `assets/readme/` paths corrected to the flat layout).
- [x] T005 [P] Author `sk-doc/create-agent/README.md`, `sk-doc/create-command/README.md`, `sk-doc/create-changelog/README.md` (stale `assets/command/` path corrected to `assets/command-template.md`).
- [x] T006 [P] Author `sk-doc/create-diff/README.md`, `sk-doc/create-feature-catalog/README.md`, `sk-doc/create-flowchart/README.md`.
- [x] T007 [P] Author `sk-doc/create-manual-testing-playbook/README.md`, `sk-doc/create-quality-control/README.md`, `sk-doc/create-benchmark/README.md` (benchmark restructured from its prior 147-line README).
- [x] T008 [P] Add pitch and OVERVIEW to `sk-code/code-opencode/README.md` and `sk-code/code-webflow/README.md` (terse), and insert `AT A GLANCE` as section 1 in `sk-git/README.md` with a renumber.

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Finish the HVR pass on the two surface READMEs (`sk-code/code-opencode/README.md`, `sk-code/code-webflow/README.md`): remove the pre-existing em dashes, semicolons and Oxford commas the light touch had kept.
- [x] T010 Run the floor validator (`validate_document.py --type readme`) and a full em-dash and semicolon sweep across all fourteen files; confirm zero.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All fourteen READMEs report VALID under the floor validator with `--type readme`
- [x] `checklist.md` verified with evidence

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->
