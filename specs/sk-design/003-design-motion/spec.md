---
title: "Feature Specification: Reconstruct the sk-design motion mode"
description: "The shipped sk-design motion mode lacked a tracked spec-folder packet, so its source-defined restraint gate, choreography workflow, presence patterns, performance safeguards, and reduced-motion handoff were not documented in packet form. This reconstruction records only behavior stated by the intact design-motion source and its references/assets."
trigger_phrases:
  - "sk-design motion reconstruction"
  - "temporal interaction design"
  - "animation choreography mode"
  - "motion reduced motion handoff"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/003-design-motion"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful motion specification"
    next_safe_action: "Review motion packet against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/SKILL.md"
      - ".opencode/skills/sk-design/design-motion/references/"
      - ".opencode/skills/sk-design/design-motion/procedures/"
      - ".opencode/skills/sk-design/design-motion/assets/"
      - ".opencode/specs/sk-design/003-design-motion/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-motion-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design motion mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-motion/SKILL.md and its references/ and assets/. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | 0055-skilled-migration-000-scaffold |
| **Spec Folder** | 003-design-motion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped motion mode defines the temporal layer for the sk-design family, but its packet was absent from git and memory. The intact source specifies motion restraint, timing, easing, choreography, interaction feedback, presence behavior, performance boundaries, reduced-motion alternatives, procedure selection, and implementation handoff that need to be represented without adding behavior.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined motion contract inspectable while preserving its boundaries and uncertainty.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Temporal-layer ownership for animation purpose, interaction feedback, transition choreography, motion materials, motion/react and AnimatePresence patterns, morphing icons, and reduced-motion alternatives.
- Activation triggers, skip conditions, family boundaries, smart routing, resource-loading levels, and the direct fallback.
- The restraint gate, motion-budget choices, timing and easing bands, staging, materials, interaction patterns, presence rules, performance safeguards, and advanced craft guidance.
- Named duration and easing tokens mapped to the source timing bands: 100-150ms feedback, 200-300ms small state changes, 300-500ms modal or layout transitions, and 500-800ms only for earned entrances or brand choreography.
- The interaction-state procedure selection rule, context and proof requirements, performance and AnimatePresence asset checks, and the sk-code handoff boundary.
- Source and asset traceability for this reconstruction.

### Out of Scope
- Static color, typography, layout, responsive, theme, or token-system work; the source routes that work to foundations.
- Inventing the overall visual direction or interface concept; the source routes that work to interface first.
- Findings-first motion-performance review, release scoring, or accessibility verdicts; the source assigns those to audit.
- Pure implementation after choreography is specified; the source hands that work to sk-code.
- Reconstructing undisclosed schemas from sibling shared files, generated metadata, runtime behavior, or any additional skill mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/003-design-motion/spec.md | Create | Level-2 reconstruction specification for the motion mode. |
| .opencode/specs/sk-design/003-design-motion/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/003-design-motion/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/003-design-motion/checklist.md | Create | Unchecked Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve motion ownership and family boundaries. | The packet identifies motion as the temporal layer and distinguishes foundations, interface, audit, and sk-code responsibilities. |
| REQ-002 | Preserve the restraint gate and motion workflow. | The packet records frequency, keyboard, purpose, and register checks before timing, the instant-state outcome for a failed gate, the 100-150ms, 200-300ms, 300-500ms, and 500-800ms bands, ease-out entrances, ease-in exits, justified springs, named duration/easing tokens, materials, reduced-motion behavior, and handoff sequence. |
| REQ-003 | Preserve routing and resource-loading behavior. | The packet records register plus animation-decision loading first, corpus-map plus matching temporal reference loading, conditional references/assets, guarded discovery, top-2 ambiguity handling, and the unknown fallback checklist. |
| REQ-004 | Preserve procedure, proof, and execution boundaries. | The packet records at-most-one private procedure selection, the no-procedure fallback, context/proof fields, the Read/Glob/Grep direct fallback, and the motion-owned stack-boundary handoff field. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Preserve interaction and presence guidance. | The packet records feedback, loading, gestures, delight, morphing-icon, AnimatePresence, exit, keys, modes, hooks, nested-exit, list-transition rules, and the motion pattern-card types at source-defined scope. |
| REQ-006 | Preserve performance and reduced-motion guidance. | The packet records compositor-first materials, FLIP, scroll and loop constraints, layer and blur bounds, reduced-motion state preservation, and low-target-device verification. |
| REQ-007 | Preserve source traceability without claiming execution. | The packet cites the intact SKILL.md, seven references, one procedure, and three assets, and does not claim runtime, generator, validator, or downstream-script results. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes motion as the sk-design temporal layer and lists its owned axes without adding static-system, interface-direction, audit, or implementation behavior.
- **SC-002**: The packet makes the restraint gate, motion budget, named timing/easing tokens, source duration bands, material decisions, reduced-motion path, and performance risks explicit.
- **SC-003**: The packet captures temporal routing, conditional resources, one-procedure selection, direct fallback, proof requirements, and the sk-code stack-boundary handoff.
- **SC-004**: The packet covers the source-defined interaction, AnimatePresence, performance, reduced-motion, advanced-craft, and motion-card guidance.
- **SC-005**: Every source claim in the reconstruction can be traced to the intact SKILL.md or a cited references, procedure, or assets path, and the packet remains a reconstruction draft.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared register, sk_code_handoff envelope, and shared polish procedure are named by SKILL.md through sibling paths. | Exact shared schemas and orchestration details are outside this child source set. | Preserve the pointers and limit this packet to the motion-owned fields and rules stated by SKILL.md. |
| Risk | Motion overlaps with foundations, interface, audit, and sk-code. | A reconstruction could assign static, conceptual, audit, or implementation behavior to motion. | Keep the explicit skip conditions, family boundary, handoff boundary, and integration points. |
| Risk | Resource loading is conditional and intent-driven. | Loading every reference or every procedure card would contradict the routing contract. | Record the default resources, intent map, guarded discovery, ambiguity handling, and at-most-one procedure rule. |
| Risk | Performance and reduced-motion claims are source guidance, not a runtime result for this packet. | The packet could falsely imply that a target build was measured or verified. | Keep low-device testing and measurement as source-defined handoff checks and do not claim execution here. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Motion uses transform and opacity as the default, avoids continuous layout animation, maps named duration/easing tokens to the source bands, and bounds paint-heavy effects as stated by the source.
- **NFR-P02**: Performance verification includes off-screen pausing, exact-property transitions, blur bounds, and testing on the lowest target device; this reconstruction claims no measurement.

### Security
- **NFR-S01**: No authentication or authorization behavior is specified by the motion source.
- **NFR-S02**: The public motion mode allows Read, Grep, and Glob; direct execution excludes Write, Edit, Bash, and Task.

### Reliability
- **NFR-R01**: Reduced-motion behavior preserves equivalent state information while removing non-essential movement.
- **NFR-R02**: AnimatePresence exits use the source-defined wrapper, exit-prop, stable-key, mode, hook, nested-exit, and timing checks before handoff.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unknown temporal concern: use the source fallback checklist to confirm strategy, interaction, presence, or performance; the affected interaction or state; a concrete input or expected behavior; and reduced-motion and performance expectations.
- Ambiguous intent scores: retain the source-defined top two intents when the primary and secondary scores are within the stated ambiguity delta, then load matching resources.
- High-frequency or keyboard-driven action: ship an instant state change even if a pointer-triggered version can carry a small transition.

### Error Scenarios
- Restraint gate failure: stop the choreography and ship the instant state change.
- No private procedure match: state Procedure applied: none - baseline motion workflow.
- Subagents unavailable or disallowed: execute the same selection, context capture, and proof checks directly with Read, Glob, and Grep.
- Existing animation system: name the implementation mechanism and stack boundary; do not partially migrate or mix systems inside one interaction surface without approval.
- Exit implementation gap: run the AnimatePresence checklist and record any open fail with its file and line before handoff.

### State Transitions
- Motion request selected: detect the temporal concern, score intents, load the register and restraint gate first, then load the corpus map and matching resources.
- Motion allowed: name one purpose, choose the budget, map timing and easing to the source bands, prefer transform/opacity before bounded blur, filter, mask, clip-path, shadow, or color, then specify states and reduced-motion behavior.
- Handoff ready: fill the matching pattern card, run the presence and performance cards when applicable, cite the selected procedure or fallback, and hand the bounded mechanism to sk-code.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One mode with routing, motion decisions, interaction and presence patterns, performance, procedure support, handoff, and boundaries. |
| Risk | 10/25 | The main risk is source drift across motion, accessibility, performance, and sibling-mode boundaries; no runtime code is changed. |
| Research | 12/20 | Reconstruction requires the intact source plus seven references, one procedure, and three assets. |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None stated by the motion source; the exact shared register and sk_code_handoff schemas remain owned by the sibling paths named in SKILL.md.
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

- .opencode/skills/sk-design/design-motion/SKILL.md
- .opencode/skills/sk-design/design-motion/references/advanced_craft.md
- .opencode/skills/sk-design/design-motion/references/animate_presence_patterns.md
- .opencode/skills/sk-design/design-motion/references/animation_decision_framework.md
- .opencode/skills/sk-design/design-motion/references/corpus_map.md
- .opencode/skills/sk-design/design-motion/references/micro_interactions.md
- .opencode/skills/sk-design/design-motion/references/motion_strategy.md
- .opencode/skills/sk-design/design-motion/references/performance_reduced_motion.md
- .opencode/skills/sk-design/design-motion/procedures/interaction_states_pass.md
- .opencode/skills/sk-design/design-motion/assets/animate_presence_checklist.md
- .opencode/skills/sk-design/design-motion/assets/motion_pattern_cards.md
- .opencode/skills/sk-design/design-motion/assets/motion_performance_failure_card.md

SKILL.md also names sibling shared pointers for the motion-budget register, the sk-code handoff envelope, and shared polish orchestration. This packet preserves those pointers without reconstructing their undisclosed contents.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md
