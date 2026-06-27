---
title: "Feature Specification: sk-design unified sk-code handoff schema"
description: "Planned Level-2 implementation phase: standardize one sk-code handoff schema and apply it across four modes. Interface gets a required build manifest, foundations a handoff card, audit a backlog-handoff card that routes accepted findings without applying them, and motion an implementation-mechanism and stack-boundary field on its motion cards. Not started."
trigger_phrases:
  - "sk-design sk-code handoff schema"
  - "design build manifest handoff"
  - "audit backlog handoff card"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the unified handoff-schema phase from the four-mode recurrence"
    next_safe_action: "Define the shared handoff schema, then apply it per mode"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design unified sk-code handoff schema

<!-- SPECKIT_LEVEL: 2 -->
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
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned (not started) |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../018-routing-wiring/spec.md |
| **Successor** | ../020-benchmark-fixtures/spec.md |
| **Handoff Criteria** | One shared sk-code handoff schema is defined and the four modes reference it: interface emits a required build manifest, foundations a handoff card, audit a backlog-handoff card that routes accepted findings to sk-code without applying them, and motion an implementation-mechanism and stack-boundary field on its motion cards, with `validate.sh --strict` passing and `package_skill.py --check` passing on every touched skill |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A required structured handoff to sk-code recurs in four of five modes under different names, which the 015 synthesis flagged as one need served by one schema (`../015-per-skill-improvement-research/implementation-summary.md`, "A required structured handoff card to sk-code recurs in four of five modes"). Interface wants a required design-to-build manifest, but its current manifest is optional (`../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md`, P1 "Require A Design-To-Build Handoff Manifest"). Foundations wants an explicit final handoff card so its success criterion (an implementable handoff that does not make sk-code guess token roles or breakpoint intent) is met (`../015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/research.md`, P2-1). Audit wants a backlog-handoff card that routes accepted findings to sk-code without applying them, preserving the audit-never-fixes boundary (`../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md`, R4). Motion wants an implementation-mechanism and stack-boundary field on its motion cards to prevent accidental library migration before sk-code handoff (`../015-per-skill-improvement-research/003-motion/research/lineages/gpt55fast/research.md`, P2 stack-boundary).

### Purpose
Standardize one sk-code handoff schema and apply it across the four modes so the design-to-build boundary is consistent and cheap to maintain. The schema carries the fields each mode needs (register posture, source evidence, output schema, reuse list, motion budget, open risks, and explicit do-not constraints), and each mode references it: interface as a required build manifest, foundations as a handoff card, audit as a backlog-handoff card that routes findings without applying them, and motion as an implementation-mechanism and stack-boundary field on its cards.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define one shared sk-code handoff schema for the family, carrying the common fields the four modes need.
- Apply it to interface as a required build manifest with tokens, signature move, motion budget, reuse list, and open risks.
- Apply it to foundations as a handoff card with register, surface role, source evidence, output schema, and the CSS-variable and breakpoint handoff.
- Apply it to audit as a backlog-handoff card that routes accepted findings (id, severity, owner, target, one-line fix shape, verification) to sk-code without applying them, preserving the audit-never-fixes boundary.
- Apply it to motion as an implementation-mechanism and stack-boundary field on the motion cards recording which animation library to use.

### Out of Scope
- The md-generator mode, which does not hand a design to sk-code the same way and is the fifth mode the recurrence skips.
- The routing and alias wiring (`../018-routing-wiring`) and the benchmark fixtures (`../020-benchmark-fixtures`).
- Any change to the audit scoring contract or to the design content the handoff references.

### Inputs (read-only)
- The recurrence and the per-mode shapes: `../015-per-skill-improvement-research/implementation-summary.md` (the four-of-five recurrence) and the interface (P1 manifest), foundations (P2-1 handoff card), audit (R4 backlog handoff), and motion (P2 stack boundary) lineage research.
- The live interface, foundations, audit, and motion packets, to confirm where each handoff artifact lives and what fields each mode already emits.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/shared/` | Created | One shared sk-code handoff schema the four modes reference |
| `.opencode/skills/sk-design/design-interface/` | Updated | A required build manifest referencing the shared schema (tokens, signature move, motion budget, reuse list, open risks) |
| `.opencode/skills/sk-design/design-foundations/` | Updated | A handoff card referencing the shared schema (register, surface role, source evidence, output schema, CSS-var and breakpoint handoff) |
| `.opencode/skills/sk-design/design-audit/` | Updated | A backlog-handoff card that routes accepted findings to sk-code without applying them |
| `.opencode/skills/sk-design/design-motion/` | Updated | An implementation-mechanism and stack-boundary field on the motion cards |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | One shared sk-code handoff schema exists | A single shared schema is defined in the sk-design shared layer, carrying the common handoff fields, and the four modes reference it rather than each inventing a bespoke card |
| REQ-002 | The audit backlog handoff preserves the audit-never-fixes boundary | The audit backlog-handoff card routes accepted findings (id, severity, owner, target, one-line fix shape, verification) to sk-code and explicitly does not apply them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Interface, foundations, and motion each reference the shared schema | Interface emits a required build manifest, foundations a handoff card, and motion an implementation-mechanism and stack-boundary field, all consistent with the shared schema |
| REQ-004 | The handoff work validates and packages cleanly | `validate.sh --strict` passes on this packet and `package_skill.py --check` passes (exit 0) on every touched sk-design skill |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One shared sk-code handoff schema is defined and the four modes reference it, with the audit variant routing accepted findings without applying them.
- **SC-002**: Interface, foundations, audit, and motion each carry their handoff artifact consistent with the shared schema, `package_skill.py --check` passes on every touched skill, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The shared schema becomes a lowest-common-denominator card that fits no mode well | Modes drift back to bespoke cards | Define a core schema plus per-mode required extensions, so each mode keeps the fields it needs |
| Risk | The audit backlog card invites audit to apply fixes | The audit-never-fixes boundary breaks | State explicitly that the card routes findings to sk-code and never applies them, mirroring the existing quick-fixes boundary |
| Risk | The motion stack-boundary field is read as a build instruction | Motion crosses into implementation | Keep the field a record of which animation library to use, handed to sk-code, not a motion-owned build action |
| Dependency | The four-mode lineage research | The per-mode handoff shapes cannot be grounded | Read each lineage's handoff finding for the required fields |
| Dependency | The live interface, foundations, audit, and motion packets | The handoff homes are unconfirmed | Confirm where each handoff artifact lives before authoring |
| Dependency | `package_skill.py` | The packaging acceptance cannot be recorded | Run `--check` on every touched skill after the handoff artifacts land |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Consistency | All four modes hand to sk-code through one schema, so the build side reads a single contract shape |
| Boundary integrity | The audit variant routes findings without applying them, preserving the audit-never-fixes rule |
| Maintainability | The core schema lives once in the shared layer, so a field change updates all modes from one place |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A foundations handoff with no data-viz layer must still produce a valid card, with the data-viz fields marked not applicable rather than invented.
- An audit with zero accepted findings must produce an empty-but-valid backlog handoff, not a card that implies fixes are pending.
- A motion card for a CSS-only animation must record that no animation library applies, not default to a library name.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Moderate. One shared schema plus four per-mode applications, each small but needing the schema to be general enough to share and specific enough to be useful. The main care point is keeping the audit variant strictly a routing card so the audit-never-fixes boundary holds.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the shared schema is one file the modes import or a documented contract each mode instantiates as its own card: the implementing subagent picks the form that keeps the core fields in one place while letting each mode add its required extensions.
- Whether the foundations and interface cards should be assets or references: the lineages suggest assets (fill-in cards), and the implementing subagent confirms against each packet's existing layout.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
