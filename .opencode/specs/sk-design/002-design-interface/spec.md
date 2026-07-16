---
title: "Feature Specification: Reconstruct the sk-design interface mode"
description: "The shipped sk-design interface mode lacked a tracked spec-folder packet, so its source-defined direction, voice, information architecture, composition, routing, and handoff contract were not documented in packet form. This reconstruction records only behavior stated by the intact interface source and its references, procedures, and asset."
trigger_phrases:
  - "sk-design interface reconstruction"
  - "overall interface direction"
  - "interface composition and voice"
  - "design-interface source packet"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/002-design-interface"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Reconstructed interface source contract"
    next_safe_action: "Review packet against source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/references/"
      - ".opencode/skills/sk-design/design-interface/assets/"
      - ".opencode/skills/sk-design/design-interface/procedures/"
      - ".opencode/specs/sk-design/002-design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-interface-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design interface mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-interface/SKILL.md and its references/ and assets/. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | `0055-skilled-migration-000-scaffold` |
| **Spec Folder** | 002-design-interface |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped interface mode defines the overall direction for distinctive UI, including visual voice, information architecture, component direction, interface-level composition, motion posture, critique, and writing. Its packet was absent from git and memory, while the intact source distributes the contract across routing rules, design-process references, private procedure cards, and a mechanical pre-flight asset.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined interface contract inspectable without adding behavior, inventing a component schema, or claiming runtime verification.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The public `interface` mode's ownership of overall visual direction: palette, typography, layout, motion direction, critique, and interface writing.
- Subject, audience, and single-page-job grounding; Brand-vs-Product register posture; and the internal VARIANCE, MOTION, and DENSITY Design Read dials.
- Information architecture and voice guidance: hierarchy from the subject, structural devices that encode true information, one job per interface element, end-user vocabulary, active voice, stable action names, and useful error and empty states.
- Component and composition direction: a compact color/type/layout/signature token plan, deliberate brief-specific choices, one justified aesthetic risk, reuse-before-generate when a real system exists, and the anti-default critique.
- Interface-level composition gates for hero structure, bento cell math, eyebrow and meta-label restraint, contrast, CTA naming, section rhythm, layout-family repetition, navigation, responsive collapse, and mobile behavior.
- Smart routing, default and conditional resource loading, guarded resource discovery, intent-specific references, and the unknown fallback defined by the source.
- At-most-one private procedure-card selection, relative-path proof, the no-procedure fallback, context basis, proof line, direct Read/Glob/Grep fallback, and the shared sk-code handoff fields named by the source.
- Real-UI grounding, reuse, render fidelity, targeted revision, redesign intake, variation debiasing, transform application, optional real-world references, quality-floor checks, and source traceability.

### Out of Scope
- Pure logic, data, or back-end work with no visual surface; the source routes that work to `sk-code`.
- Documentation or prose work that is not interface work; the source routes that work to `sk-doc`.
- A measured `DESIGN.md` or `tokens.json` artifact extraction task; the source routes measured artifacts to `md-generator`.
- Implementation ownership, framework-specific web-surface standards, full-stack behavior, deployment, or Git workflow; the source hands implementation to `sk-code` and related transports.
- Review, scoring, audit, or release-readiness decisions about whether a transform should be applied; the source routes those questions to `audit`.
- A reusable style chooser, preset menu, named aesthetic dial, or copied third-party reference; the source explicitly forbids these.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/002-design-interface/spec.md | Create | Level-2 reconstruction specification for the interface mode. |
| .opencode/specs/sk-design/002-design-interface/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/002-design-interface/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/002-design-interface/checklist.md | Create | Unchecked Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve the interface mode's direction and voice ownership. | The packet states that interface makes deliberate, brief-specific choices for palette, typography, layout, motion direction, copy, and one justified aesthetic risk after grounding the subject, audience, and page job. |
| REQ-002 | Preserve register-first calibration and pinned-axis precedence. | The packet records Brand-vs-Product posture, the one-line Design Read, VARIANCE/MOTION/DENSITY as internal 1-to-10 calibration, and the rule that explicitly pinned brief values are followed exactly. |
| REQ-003 | Preserve information architecture and interface-writing behavior. | The packet records hierarchy from the subject, structural devices only when they encode real information, one job per element, end-user vocabulary, active voice, stable action names, direct errors, useful empty states, and protected redesign contracts. |
| REQ-004 | Preserve component direction and interface-level composition. | The packet records the color/type/layout/signature plan, critique against AI-default looks, reuse-before-generate, the one-signature rule, mechanical delivery gates, responsive quality floor, and the source's concrete hero, bento, CTA, spacing, navigation, and layout-family constraints. |
| REQ-005 | Preserve routing, resources, and private procedure selection. | The packet records the default resources, intent-to-resource map, guarded in-skill discovery, at most one matching procedure card with relative-path proof, and the explicit no-procedure baseline fallback. |
| REQ-006 | Preserve proof, direct execution, and implementation handoff boundaries. | The packet records context basis, proof before ready or handoff claims, Read/Glob/Grep direct fallback, the required sk-code build manifest fields, and the source's child-agent context/proof requirements without inventing a complete shared schema. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Preserve conditional design lanes and escalation behavior. | The packet covers transform verbs, multiple-direction debiasing, real UI, redesign, real-system grounding, Mobbin/Refero critique-against references, thin briefs, pinned conflicts, reduced motion, and the source-defined fallback or escalation for each. |
| REQ-008 | Preserve source traceability and reconstruction limits. | The packet cites the intact SKILL.md, all 19 reference paths, six procedure paths, and the pre-flight asset, and clearly labels the packet as a best-effort reconstruction rather than shipped runtime verification. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes interface as the mode for overall direction, voice, information architecture, component direction, interface composition, critique, and writing, without assigning implementation or unrelated work to it.
- **SC-002**: The packet makes register-first calibration, pinned-axis precedence, subject grounding, one justified risk, anti-default critique, and the one-signature composition rule explicit.
- **SC-003**: The packet captures the mechanical and objective floors: responsive behavior, visible focus, reduced motion, touch targets, contrast, content discipline, pre-flight binary gates, and explicit mobile collapse.
- **SC-004**: The packet records routing, conditional resource loading, one-procedure-card selection, direct fallback, proof requirements, and the required sk-code handoff fields at the level stated by the source.
- **SC-005**: Every source claim in the reconstruction is traceable to the intact SKILL.md or a cited reference, procedure, or asset path, and no runtime execution or generated metadata is claimed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared register, context-loading contract, sk-code handoff envelope, shared procedures, and external Code Mode manuals are named by the source through sibling paths or integrations. | Their complete schemas and transport behavior are outside the requested interface reference set. | Preserve the source paths and only document the interface-owned fields and decisions named by SKILL.md. |
| Risk | Interface overlaps with foundations, audit, md-generator, sk-code, sk-doc, and sibling transports. | A reconstruction could assign static-system, review, extraction, implementation, documentation, or transport behavior to interface incorrectly. | Retain the source's activation, skip, transform, integration, and handoff boundaries. |
| Risk | Resource loading and procedure selection are conditional. | Loading every reference or procedure card by default would contradict the smart router and private-card contract. | Record default resources, intent mapping, guarded discovery, and at-most-one selection rather than a universal load list. |
| Risk | AI-default avoidance can become a reusable aesthetic menu. | Named cues, real-world references, or seed candidates could be mistaken for presets or copied sources. | Keep grounding upstream, resolve at most one critique-against reference, never surface a chooser, and spend one justified risk. |
| Risk | The packet is reconstructed without runtime execution. | Claims about a built render, pre-flight result, or downstream implementation could be overstated. | Keep verification items unchecked and distinguish source evidence from runtime or downstream checks. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The source specifies a quality floor and render-fidelity judgment, not a runtime benchmark or implementation performance budget.
- **NFR-P02**: Responsive behavior, layout stability, loading states where applicable, and readable mobile type remain part of the source-defined quality floor.

### Security
- **NFR-S01**: No authentication or authorization behavior is specified by the interface mode.
- **NFR-S02**: Real-world references are read live through the named Code Mode path, never copied into the design or repository; unsanctioned source write-back is out of scope.

### Reliability
- **NFR-R01**: Every animation has a reduced-motion alternative, and motion cannot be the only carrier of meaning or functionality.
- **NFR-R02**: Direct execution preserves the same context, procedure-selection, proof, quality, and handoff bar when subagents are unavailable or disallowed.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Pinned visual axis: follow the brief exactly and do not replace it with an AI-default critique.
- Free visual axis: ground the subject, audience, and page job, then derive palette, type, structure, motion, and copy from the revised plan.
- Multiple directions: build a subject-grounded candidate space, exclude the median default, use the committed seed-of-thought procedure, and critique every selected direction; never expose the candidate set as a chooser.
- Existing system: read one matching owned system live and reuse its tokens and components before generating net-new work; do not copy the system into the skill or turn it into a generator.

### Error Scenarios
- Brief too thin to ground: state the assumed direction and confirm, or use one focused question when the missing fact changes posture or the largest free axis.
- Transform wording: `make it ...` routes to interface for application; `should it be ...` routes to audit for judgment. `clarify` is an interface alias; `typeset` and `colorize` remain foundations-owned.
- Convention-heavy category: take one Mobbin or Refero reference when initiative and subscription conditions are met, ask when the lookup is borderline or surprising, and fall back to the generic anti-default process when unavailable or declined.
- Redesign: classify greenfield, preserve, or overhaul; protect URLs, navigation labels and destinations, form fields and validation, legal/compliance/pricing copy, locked tokens, analytics, SEO, and structured data unless explicitly approved.
- Missing procedure match: state `Procedure applied: none - baseline interface workflow` and continue with the register, dials, two-pass process, and pre-flight card.
- Quality or motion conflict: surface the trade-off; accessibility and reduced-motion rules win, and a motion value above 4 must correspond to shippable motion or be lowered.

### State Transitions
- Public interface mode selected: choose at most one private procedure card after context is captured and cite its relative path in the plan or proof line.
- Direction plan ready: critique it against the brief and AI-default looks, revise generic choices, then build from the revised plan.
- Real UI in progress: ground, reuse, render, check the actual render, revise with targeted or broad feedback, and hand off with the manifest.
- Pre-delivery: run the binary layout and content gates plus the objective quality floor; one failed or uncheckable pre-flight box means the surface is not ready.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | One mode spans direction, voice, IA, composition, routing, conditional resources, procedures, quality, references, and handoff. |
| Risk | 10/25 | The main risks are boundary drift, default/preset invention, and overclaiming runtime behavior; no runtime code is changed. |
| Research | 15/20 | Reconstruction requires the intact source, all 19 references, six procedures, one asset, and the required Level-2 format exemplar. |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The source does not define a universal component inventory or a complete sk-code handoff schema; those remain owned by the shared references named by SKILL.md.
- The packet does not claim a pre-flight result, render-fidelity result, external-reference lookup, or downstream implementation result.
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

- .opencode/skills/sk-design/design-interface/SKILL.md
- .opencode/skills/sk-design/design-interface/references/aesthetics/README.md
- .opencode/skills/sk-design/design-interface/references/aesthetics/apple_bento.md
- .opencode/skills/sk-design/design-interface/references/aesthetics/brutalist.md
- .opencode/skills/sk-design/design-interface/references/aesthetics/minimalist.md
- .opencode/skills/sk-design/design-interface/references/aesthetics/soft.md
- .opencode/skills/sk-design/design-interface/references/design_grounding/design_inventory.md
- .opencode/skills/sk-design/design-interface/references/design_grounding/design_references_mcp.md
- .opencode/skills/sk-design/design-interface/references/design_process/brief_to_dials.md
- .opencode/skills/sk-design/design-interface/references/design_process/copy_and_mock_data.md
- .opencode/skills/sk-design/design-interface/references/design_process/design_principles.md
- .opencode/skills/sk-design/design-interface/references/design_process/mechanical_defaults.md
- .opencode/skills/sk-design/design-interface/references/design_process/real_ui_loop.md
- .opencode/skills/sk-design/design-interface/references/design_process/redesign_intake.md
- .opencode/skills/sk-design/design-interface/references/design_process/resource_loading_notes.md
- .opencode/skills/sk-design/design-interface/references/design_process/transform_application.md
- .opencode/skills/sk-design/design-interface/references/design_process/ux_quality_reference.md
- .opencode/skills/sk-design/design-interface/references/design_process/variation_diversity.md
- .opencode/skills/sk-design/design-interface/references/mcp_tooling/mobbin_tools.md
- .opencode/skills/sk-design/design-interface/references/mcp_tooling/refero_tools.md
- .opencode/skills/sk-design/design-interface/procedures/aesthetic_direction.md
- .opencode/skills/sk-design/design-interface/procedures/deck_direction_spec.md
- .opencode/skills/sk-design/design-interface/procedures/discovery_question_round.md
- .opencode/skills/sk-design/design-interface/procedures/prototype_flow_spec.md
- .opencode/skills/sk-design/design-interface/procedures/variation_set.md
- .opencode/skills/sk-design/design-interface/procedures/wireframe_exploration.md
- .opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md

The source also names sibling shared references, Code Mode transports, the manual-testing playbook, and the Apache-2.0 license. This packet preserves those pointers and boundaries without reconstructing schemas or behavior that are not part of the requested interface source set.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md
