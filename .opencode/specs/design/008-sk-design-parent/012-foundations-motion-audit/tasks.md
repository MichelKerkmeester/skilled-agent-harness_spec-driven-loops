---
title: "Tasks: sk-design foundations, motion, and audit-depth expansion"
description: "Task list for the ten sk-design additions across foundations, motion, and audit. All build tasks are done and the phase is executed. The sk-design family passes package_skill --check."
trigger_phrases:
  - "sk-design foundations motion audit tasks"
  - "design data viz motion restraint tasks"
  - "design audit evidence hardening tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/012-foundations-motion-audit"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all build tasks and wired the ten files into the routers"
    next_safe_action: "Execute 013-mdgen-boundary-cleanup (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-012-foundations-motion-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design foundations, motion, and audit-depth expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

- [x] T001 Confirm the planned predecessors landed: `010-shared-register` and `011-interface-audit-core` (audit base + register)
- [x] T002 Re-read the grounding sections of `../009-reference-asset-expansion/research/research.md` (3.2 foundations, 3.3 motion, 3.4 audit, priority ranking items 6 and 7)
- [x] T003 Confirm the foundations, motion, and audit homes and the existing references each new file keys into
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the data-visualization foundations reference: chart-type selection, axis and encoding, color-for-data (sequential, diverging, categorical), sparklines, table alignment (`.opencode/skills/sk-design/design-foundations/references/data_viz.md`)
- [x] T005 [P] Author the device/input/context adaptation matrix as rethinking-for-context, not pixel scaling (`.opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md`)
- [x] T006 [P] Author the first foundations asset: fill-in OKLCH ramp plus type-scale and spacing-scale scaffold (`.opencode/skills/sk-design/design-foundations/assets/token_starter.md`)
- [x] T007 Author the motion restraint gate: when not to animate, high-frequency never-animate threshold, never-animate-keyboard-initiated rule (`.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md`)
- [x] T008 [P] Author the reusable motion pattern cards: loading, feedback, state, page-transition, gesture, toast, drag-drop, hover, focus (`.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md`)
- [x] T009 [P] Author the animate-presence checklist: exit wrapper, exit prop, key, symmetry, presence hook, safeToRemove, mode, nested-exit (`.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md`)
- [x] T010 [P] Author the motion-performance failure card: layout thrash, scroll polling, endless rAF, mixed systems, layer promotion, paint-heavy effects, blur (`.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md`)
- [x] T011 Author the audit evidence-capture reference: file and source resolution, browser evidence, deterministic scans, screenshot and overlay notes, fallback labels (`.opencode/skills/sk-design/design-audit/references/evidence_capture.md`)
- [x] T012 [P] Author the snippet-level accessibility quick-fixes asset: names, keyboard, focus and dialogs, semantics, forms and errors, contrast, motion (`.opencode/skills/sk-design/design-audit/assets/a11y_quick_fixes.md`)
- [x] T013 [P] Author the hardening edge-cases reference: extreme inputs, API and network errors, permissions, rate limits, concurrency, i18n and RTL, text expansion, CJK and emoji (`.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify each of the ten files delivers its named path and purpose and references existing mode content rather than duplicating it
- [x] T015 Verify each addition cites the 009 deliverable and that no owned-basics topic (OKLCH/contrast, gesture basics, critique/CWV/a11y) is re-declared
- [x] T016 Run `validate.sh --strict` on this packet and the touched mode packets, then update continuity and STOP for operator review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All build tasks marked `[x]` with the file present at its named path
- [x] No `[B]` blocked tasks remaining
- [x] All ten additions grounded in the 009 deliverable with no duplication of owned content, and the packet validates clean

### Status note

This packet is EXECUTED. All build tasks are done and ten files are built and verified. Foundations gained `references/data_viz.md` (134 lines), `references/layout/adaptation_matrix.md` (130) and `assets/token_starter.md` (132). Motion gained `references/animation_decision_framework.md` (109), `assets/motion_pattern_cards.md` (188), `assets/animate_presence_checklist.md` (97) and `assets/motion_performance_failure_card.md` (60). Audit gained `references/evidence_capture.md` (109), `assets/a11y_quick_fixes.md` (166) and `references/hardening_edge_cases.md` (143). Each file is register-aware, HVR-clean, `contextType: implementation`, and wired into its mode SKILL.md router (Section 2 loading table, Section 5 references, and an explicit `../shared/register.md` pointer). The predecessor phases `010-shared-register` and `011-interface-audit-core` landed first, so the audit-depth files extend the audit base and the mode defaults read the shared register. `package_skill --check` returns exit 0 across the hub and all five modes, and `validate.sh --strict` passes on this packet. Research rows MO-R2 (advanced motion craft top-up) and MO-R3 (advanced rendering) were out of this phase's scope and are deferred nice-to-haves, not omissions.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source deliverable**: See `../009-reference-asset-expansion/research/research.md` (sections 3.2, 3.3, 3.4, priority ranking)
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
