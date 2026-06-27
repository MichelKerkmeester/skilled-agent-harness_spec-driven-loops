---
title: "Tasks: adopt the make-interfaces-feel-better backlog into sk-design"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mifb design adoption tasks"
  - "sk-design corpus adoption tasks"
  - "implement design backlog tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/023-mifb-design-adoption"
    last_updated_at: "2026-06-27T09:26:47Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the build task list grouped by mode dispatch"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast to apply the foundations edits"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-023-mifb-design-adoption"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Tasks: adopt the make-interfaces-feel-better backlog into sk-design

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Scaffold phase 023 (spec, plan, tasks)
- [x] T002 Confirm 12 target files present; confirm executor cli-codex gpt-5.5 high fast
- [x] T003 Author per-group scope-locked codex prompts
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [Group A] Concentric-radius math (`design-foundations/.../layout/layout_responsive.md`)
- [x] T005 [Group A] Image-outline pure-rgba exception (`design-foundations/.../color/palette_theming.md`)
- [x] T006 [Group A] Root font smoothing + text-wrap caveats + tabular framing (`design-foundations/.../type/typography_system.md`)
- [x] T007 [Group A] Shadow-as-border matrix + dark-mode white-ring (`design-foundations/.../color/palette_theming.md`)
- [x] T008 [Group B] Radius/outline/hit-area/shadow-ring detectors (`design-audit/references/anti_patterns_production.md`)
- [x] T009 [Group B] `transition: all` static-risk detector (`design-audit/references/accessibility_performance.md`)
- [x] T010 [Group C] Icon-swap CSS fallback + static escape hatch (`design-motion/references/micro_interactions.md`)
- [x] T011 [Group C] Semantic split/stagger + small fixed-translate exits (`design-motion/references/motion_strategy.md`)
- [x] T012 [Group D] Optical-alignment examples + preflight reminders (`design-interface/.../mechanical_defaults.md`, `interface_preflight_card.md`)
- [x] T013 [Group E] md-generator measured-capture reminder (`design-md-generator/SKILL.md`)
- [x] T014 [Group E] Optional shared vocabulary (`shared/design_token_vocabulary.md`)
- [x] T015 [Group E] Hub doc fix: shared-base `references/` -> `shared/` (`SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Diff-review every changed file for scope lock + voice match + conflict-decision preservation
- [x] T017 Confirm the three absences (no global review format, no hub per-mode logic, no wholesale numeric defaults)
- [x] T018 Finalize checklist/decision-record/implementation-summary; run `validate.sh --strict`; save continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Per-diff verification passed; strict validation clean
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source backlog**: See `../022-mifb-design-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
