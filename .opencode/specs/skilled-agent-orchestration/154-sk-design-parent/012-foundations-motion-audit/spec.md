---
title: "Feature Specification: sk-design foundations, motion, and audit-depth expansion"
description: "Executed Level-1 implementation phase: rounded out the substance recommendations from the 009 deep-research deliverable across three modes. Built the data-viz and adaptation foundations references plus the first foundations asset, the motion restraint gate plus the first motion asset cards, and the audit-depth evidence, a11y, and hardening surfaces. Ten files are built and wired into their mode routers and the sk-design family passes package_skill --check."
trigger_phrases:
  - "sk-design foundations motion audit expansion"
  - "design data viz foundations"
  - "design motion restraint gate"
  - "design audit evidence hardening"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the ten foundations motion and audit files and wired the routers, family check passes"
    next_safe_action: "Execute 013-mdgen-boundary-cleanup (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-012-foundations-motion-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design foundations, motion, and audit-depth expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../011-interface-audit-core/spec.md (audit base + register) |
| **Successor** | ../013-mdgen-boundary-cleanup/spec.md (planned) |
| **Handoff Criteria** | Ten files exist under `.opencode/skills/sk-design/` across foundations, motion, and audit: the data-viz and adaptation-matrix references plus the token-starter asset for foundations, the animation-decision-framework reference plus the pattern-cards, animate-presence-checklist, and motion-performance-failure assets for motion, and the evidence-capture and hardening-edge-cases references plus the a11y-quick-fixes asset for audit. Each file delivers the path and purpose named in this spec, is grounded in the 009 research deliverable, and is wired into its mode SKILL.md router. The sk-design family passes `package_skill --check` and `validate.sh --strict` passes on this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-research deliverable in `../009-reference-asset-expansion/research/research.md` ranked the highest-leverage expansions for each sk-design mode and found three substance gaps that remained after the shared register and the interface/audit first-assets landed. Foundations had one real coverage hole, data-visualization, plus a missing device/input/context adaptation matrix and zero assets. Motion was well covered on basics but missing the restraint gate that is the strongest anti-slop lever, and it shipped zero reusable pattern or failure cards. Audit was the densest expansion target: it had no evidence-capture model, no snippet-level accessibility fixes, and no production-readiness hardening matrix. Before this phase these judgments were made implicitly and inconsistently across the modes, with no checkable reference or fill-in card to anchor them.

### Purpose
Round out the substance recommendations from the 009 research across three modes in a single phase: close the foundations data-viz and adaptation holes and add the first foundations asset, add the motion restraint gate and the first motion asset cards, and deepen audit with an evidence model, accessibility quick-fixes, and a hardening matrix. Each addition traces to its path and purpose, grounded in the 009 deliverable rather than by volume, so the family gains checkable references and reusable cards instead of more presets. This phase is EXECUTED. All ten files are built, register-aware, HVR-clean, and wired into their mode SKILL.md routers, and the sk-design family passes `package_skill --check`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Foundations: a data-visualization foundations reference (the one real coverage hole), a device/input/context adaptation matrix, and the first foundations asset (a fill-in OKLCH ramp plus type-scale and spacing-scale scaffold).
- Motion: an animation-decision-framework reference (the restraint gate) plus three motion assets, the reusable pattern cards, the animate-presence checklist, and the motion-performance failure-mode card.
- Audit depth: an evidence-capture reference, a snippet-level accessibility quick-fixes asset, and a production-readiness hardening edge-cases reference.

### Out of Scope
- The shared register, the interface/audit first-assets, and the N1/N2 author-once gates (earlier phases, including the `011-interface-audit-core` audit base).
- The audit AI-fingerprint/model-tell catalog and the transform/remediation verbs (own phases, register-dependent).
- The md-generator authoring-boundary reference and source-of-truth card (planned successor `013-mdgen-boundary-cleanup`).
- Any change to existing `sk-design/` mode SKILLs or their current references and assets in this phase.

### Inputs (read-only)
- The ranked deliverable and rationale: `../009-reference-asset-expansion/research/research.md` (sections 3.2 design-foundations, 3.3 design-motion, 3.4 design-audit, and section 4 "Family-Wide Priority Ranking" items 6 and 7).
- The live `sk-design/` tree, to confirm the foundations, motion, and audit homes and the existing references the new files key into.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-foundations/references/data_viz.md` | Create | Data-visualization foundations: chart-type selection, axis and encoding, color-for-data (sequential, diverging, categorical), sparklines, and table alignment beyond tabular-nums. The one real foundations coverage hole |
| `.opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md` | Create | Device, input, and context adaptation (phone, tablet, desktop, print, constrained) framed as rethinking for context rather than pixel scaling |
| `.opencode/skills/sk-design/design-foundations/assets/token_starter.md` | Create | First foundations asset: a fill-in OKLCH ramp plus type-scale and spacing-scale scaffold, keyed to the existing token vocabulary reference |
| `.opencode/skills/sk-design/design-motion/references/animation_decision_framework.md` | Create | The restraint gate for when not to animate. 100+ per day means never animate, keyboard-initiated actions never animate, and tens per day means reduce. The strongest motion anti-slop lever |
| `.opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md` | Create | First motion asset: reusable cards for loading, feedback, state, page-transition, gesture, toast, drag-drop, hover, and focus, with owner and state fields |
| `.opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md` | Create | Exit-wrapper, exit prop, key, symmetry, presence-hook, safeToRemove, mode, and nested-exit checks for presence animation |
| `.opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md` | Create | Failure-mode card: layout thrash, scroll polling, endless rAF, mixed animation systems, layer promotion, paint-heavy effects, and blur |
| `.opencode/skills/sk-design/design-audit/references/evidence_capture.md` | Create | Evidence model: file and source resolution, browser evidence, deterministic scans, screenshot and overlay notes, and fallback labels |
| `.opencode/skills/sk-design/design-audit/assets/a11y_quick_fixes.md` | Create | Snippet-level accessibility fixes: accessible names, keyboard, focus and dialogs, semantics, forms and errors, contrast, and motion |
| `.opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md` | Create | Production-readiness matrix: extreme inputs, API and network errors, permissions, rate limits, concurrency, internationalization and RTL, text expansion, and CJK and emoji |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The foundations data-viz coverage hole is closed | `design-foundations/references/data_viz.md` exists and covers chart-type selection, axis and encoding, color-for-data (sequential, diverging, categorical), sparklines, and table alignment beyond tabular-nums |
| REQ-002 | The motion restraint gate exists | `design-motion/references/animation_decision_framework.md` exists and states when not to animate, including the high-frequency never-animate threshold and the never-animate-keyboard-initiated rule |
| REQ-003 | The audit evidence model exists | `design-audit/references/evidence_capture.md` exists and defines file and source resolution, browser evidence, deterministic scans, screenshot and overlay notes, and fallback labels |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The foundations adaptation matrix and first asset exist | `design-foundations/references/layout/adaptation_matrix.md` covers device, input, and context adaptation as rethinking-for-context. `design-foundations/assets/token_starter.md` is a fill-in OKLCH ramp plus type-scale and spacing-scale scaffold |
| REQ-005 | The three motion assets exist | `design-motion/assets/motion_pattern_cards.md`, `design-motion/assets/animate_presence_checklist.md`, and `design-motion/assets/motion_performance_failure_card.md` each exist and carry their named card or checklist content |
| REQ-006 | The audit a11y and hardening surfaces exist | `design-audit/assets/a11y_quick_fixes.md` carries snippet-level fixes. `design-audit/references/hardening_edge_cases.md` carries the production-readiness matrix |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three foundations files exist. `data_viz.md` closes the data-viz hole, `layout/adaptation_matrix.md` frames adaptation as rethinking-for-context, and `assets/token_starter.md` is a fill-in token scaffold keyed to the existing token vocabulary.
- **SC-002**: The four motion files exist. `animation_decision_framework.md` is the restraint gate, and the three assets (`motion_pattern_cards.md`, `animate_presence_checklist.md`, `motion_performance_failure_card.md`) carry their named content.
- **SC-003**: The three audit-depth files exist. `evidence_capture.md` defines the evidence model, `a11y_quick_fixes.md` carries snippet-level fixes, and `hardening_edge_cases.md` carries the production-readiness matrix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Additions duplicate basics already owned (OKLCH/contrast/dark-mode in foundations, gesture basics in motion, critique/CWV/a11y in audit) | Family dilutes and the leverage bar is lost | Mitigated. Authored only the named coverage holes and referenced existing files rather than re-declaring their content |
| Risk | Data-viz or hardening references grow into volume imports | Scope creep beyond the research's "if effective" bar | Mitigated. Each file is bounded to the path and purpose named here and cites the 009 deliverable |
| Dependency | `../009-reference-asset-expansion/research/research.md` | Scope cannot be grounded | Read sections 3.2, 3.3, 3.4, and the priority ranking as the rationale for each addition |
| Dependency | `../011-interface-audit-core` (audit base + register) | Audit-depth files have no base to extend | Satisfied. The audit base and shared register landed first, and the audit-depth files reference them rather than re-declare |
| Dependency | Live `sk-design/` tree | Mode homes and keyed references unconfirmed | Confirm the foundations, motion, and audit homes and the existing references before authoring |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All build-time questions are resolved.

- Data-viz color-for-data ramps and chart-type vocabulary. Resolved: `data_viz.md` (134 lines) settles chart-type selection, axis and encoding, sequential, diverging and categorical color-for-data, sparklines, and table alignment against the foundations sources cited in the 009 research.
- One file or split for the motion pattern cards. Resolved: the cards ship as one usable asset, `motion_pattern_cards.md` (188 lines), covering loading, feedback, state, page-transition, gesture, toast, drag-drop, hover, and focus with owner and state fields.
- Overlap between the hardening edge-cases matrix and the audit base. Resolved: `hardening_edge_cases.md` (143 lines) extends the `011-interface-audit-core` audit base without re-declaring its coverage.
- Advanced motion craft top-up (MO-R2) and advanced rendering (MO-R3) were out of this phase's scope. Deferred as nice-to-haves, not omissions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
