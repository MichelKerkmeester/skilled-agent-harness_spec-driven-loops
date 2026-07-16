---
title: "Feature Specification: Reconstruct the sk-design foundations mode"
description: "The shipped sk-design foundations mode lacked a tracked spec-folder packet, so its source-defined routing, static-system workflow, boundaries, and handoff contract were not documented in packet form. This reconstruction records only behavior stated by the intact design-foundations source and its references."
trigger_phrases:
  - "sk-design foundations reconstruction"
  - "static visual system specification"
  - "design foundations mode"
  - "foundations source packet"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/001-design-foundations"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful foundations specification"
    next_safe_action: "Review specification against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-foundations/SKILL.md"
      - ".opencode/skills/sk-design/design-foundations/references/"
      - ".opencode/skills/sk-design/design-foundations/assets/"
      - ".opencode/specs/sk-design/001-design-foundations/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-foundations-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design foundations mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-foundations/. Verify against that SKILL.md before treating any line as authoritative.

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
| **Spec Folder** | 001-design-foundations |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped foundations mode defines the static visual system for the sk-design family, but its packet was absent from git and memory. The intact source specifies routing, resource loading, static-system decisions, read-only execution, procedure-card selection, downstream handoff, and verification expectations that need to be represented without adding behavior.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined foundations contract inspectable while preserving its boundaries and uncertainty.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Static visual-system ownership for color, typography, spacing, layout, hierarchy, grids, responsive adaptation, theming, and design tokens.
- Activation triggers, skip conditions, family boundaries, smart routing, resource-loading levels, and the direct fallback.
- The source-defined workflow from system role and constraints through layered static decisions, anti-slop checks, proof, and implementation handoff.
- The read-only execution contract: backendKind reference-base, Read/Glob/Grep tool surface, and mutatesWorkspace false.
- At-most-one procedure-card selection, including the no-procedure fallback and relative-path proof.
- The shared sk_code_handoff envelope and its foundations-owned fields: register posture, surface role, source evidence, output schema, token names, breakpoint intent, accessibility checks, and unresolved risks.
- Source and asset traceability for this reconstruction.

### Out of Scope
- Inventing an overall interface direction, voice, or signature concept; the source routes that work to interface.
- Animation, transition choreography, micro-interactions, or reduced-motion behavior; the source routes that work to motion.
- Review, scoring, accessibility audit, or production-hardening reports; the source routes that work to audit.
- Measured token extraction from a live site into DESIGN.md; the source routes that work to md-generator or the future sk-design-spec child.
- Static-system implementation after handoff; sk-code implements the tokens and breakpoints without inventing roles or changing breakpoint intent.
- Running the shipped deterministic scripts inside foundations; the source states they run downstream.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/001-design-foundations/spec.md | Create | Level-2 reconstruction specification for the foundations mode. |
| .opencode/specs/sk-design/001-design-foundations/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/001-design-foundations/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/001-design-foundations/checklist.md | Create | Unchecked Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve foundations ownership of the static visual system. | The packet names color, type, spacing, layout, hierarchy, grids, responsive adaptation, theming, and token vocabulary as the owned axis, and distinguishes implementation handoff from design decisions. |
| REQ-002 | Preserve activation, skip, and family boundaries. | The packet records the source triggers and the stated exclusions for interface, motion, audit, md-generator, and sk-code. |
| REQ-003 | Preserve the execution contract. | The packet records backendKind reference-base, Read/Glob/Grep only, mutatesWorkspace false, no subagent dispatch in direct fallback, and no script execution by foundations. |
| REQ-004 | Preserve procedure-card selection discipline. | The packet states that at most one matching private procedure card is selected and cited, or that the no-procedure baseline fallback is stated. |
| REQ-005 | Preserve the implementation handoff contract. | The packet records the shared sk_code_handoff envelope and only the foundations-owned fields named by the source, without defining an unprovided schema. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve routing and resource-loading behavior. | The packet records register-first loading, corpus-map plus matching-axis loading, conditional resources, guarded discovery, and the unknown fallback checklist described by the source. |
| REQ-007 | Preserve static-system decision rules. | The packet records role-first token naming, OKLCH and contrast guidance, dark-mode surface rebuilding, scale-based spacing, content-driven breakpoints, input-capability adaptation, and chart-question matching. |
| REQ-008 | Preserve source traceability and verification expectations. | The packet cites the intact SKILL.md, references, and assets paths, and separates foundations proof from downstream deterministic checks. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes foundations as the static visual-system mode and lists its owned axes without adding interface, motion, audit, extraction, or implementation behavior.
- **SC-002**: The packet makes the Read/Glob/Grep-only surface, reference-base backend, non-mutating workspace contract, and downstream-only scripts explicit.
- **SC-003**: The packet captures the role-first workflow, one-procedure-card rule, proof requirements, and shared sk_code_handoff field ownership.
- **SC-004**: Every source claim in the reconstruction can be traced to the intact SKILL.md or a cited references/assets path.
- **SC-005**: The packet remains a reconstruction draft and does not claim runtime validation, generated metadata, or a complete shared-envelope schema that the source does not provide.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared register, context-loading contract, and sk_code_handoff envelope are named by SKILL.md through sibling shared paths. | Exact shared-envelope details are outside this child source set. | Keep the handoff statement limited to the foundations-owned fields named in SKILL.md and retain the shared-path pointers. |
| Risk | Foundations overlaps with interface, motion, audit, md-generator, and sk-code. | A reconstruction could accidentally assign another family member's behavior to foundations. | Keep the explicit When NOT to Use, Family Boundary, and Integration Points statements in the packet. |
| Risk | Resource loading is conditional and axis-driven. | Loading every reference or every procedure card would contradict the routing contract. | Record the default resources, matching-axis map, guarded discovery, and at-most-one procedure selection. |
| Risk | The mode has deterministic scripts but cannot run them. | A packet could falsely claim contrast, rhythm, or naming verification. | Record scripts as downstream checks only and keep the direct mode proof separate from script execution. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance behavior is specified; the mode is a read-only reference-base tool surface.
- **NFR-P02**: No execution benchmark is claimed for this reconstruction packet.

### Security
- **NFR-S01**: No authentication or authorization behavior is specified by the foundations source.
- **NFR-S02**: The documented tool surface excludes workspace mutation and shell execution.

### Reliability
- **NFR-R01**: Direct execution keeps the same context, procedure-selection, proof, and handoff bar when subagents are unavailable or disallowed.
- **NFR-R02**: Missing resources are loaded only when discovered and guarded by the source-defined skill-root checks.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty or unscoped request: use the source-defined UNKNOWN_FALLBACK checklist and confirm static axis, system role, concrete input, and verification expectations.
- Multi-axis request: load the corpus map plus one matching reference from each relevant axis, as defined by the smart router.
- Missing markdown resource: discover and load only paths that exist within the allowed skill or shared roots.

### Error Scenarios
- No procedure card matches: state Procedure applied: none - baseline foundations workflow.
- Subagents are unavailable or disallowed: execute directly with Read, Glob, and Grep while preserving the same proof bar.
- A deterministic script would be needed: do not invoke it in foundations; leave it for the downstream build, ship, maintenance, human-check, or CI step.

### State Transitions
- Public mode selected: choose at most one private procedure card after foundations routing.
- Static decisions ready: emit the shared sk_code_handoff envelope with the foundations-owned fields.
- Static system already fully specified and only code remains: hand off to sk-code rather than reopening foundations decisions.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One mode with routing, resources, static-system axes, procedure support, handoff, and boundaries. |
| Risk | 8/25 | The main risk is source drift or boundary invention; no runtime code is changed. |
| Research | 12/20 | Reconstruction requires the intact source plus all references and assets named in the packet brief. |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None stated by the foundations source; the exact shared sk_code_handoff schema remains owned by the shared reference named in SKILL.md.
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

- .opencode/skills/sk-design/design-foundations/SKILL.md
- .opencode/skills/sk-design/design-foundations/references/corpus_map.md
- .opencode/skills/sk-design/design-foundations/references/color/oklch_workflow.md
- .opencode/skills/sk-design/design-foundations/references/color/palette_theming.md
- .opencode/skills/sk-design/design-foundations/references/type/typography_system.md
- .opencode/skills/sk-design/design-foundations/references/layout/layout_responsive.md
- .opencode/skills/sk-design/design-foundations/references/layout/adaptation_matrix.md
- .opencode/skills/sk-design/design-foundations/references/data_viz.md
- .opencode/skills/sk-design/design-foundations/references/worked_examples.md
- .opencode/skills/sk-design/design-foundations/references/smart_router_pseudocode.md
- .opencode/skills/sk-design/design-foundations/references/design_system_artifact_contract.md
- .opencode/skills/sk-design/design-foundations/assets/token_starter.md
- .opencode/skills/sk-design/design-foundations/assets/contrast_pair_inventory.md

SKILL.md also names the sibling shared pointers for register, context loading, anti-slop vocabulary, design-token vocabulary, cognitive laws, procedure orchestration, and the sk_code_handoff envelope. This packet preserves those pointers without reconstructing their undisclosed contents.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md
