---
title: "Feature Specification: Phase 2: mode-scaffold"
description: "Scaffold the unregistered sk-create-goal workflow packet for later authoring of spec-kit-compliant packet goals."
trigger_phrases:
  - "sk-create-goal packet scaffold"
  - "goal authoring mode packet"
  - "nested goal mode setup"
  - "unregistered sk-doc mode"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: mode-scaffold

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-25 |
| **Branch** | `worktrees/068-create-goal-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-goal-inventory-and-mode-contract |
| **Successor** | 003-authoring-standards-and-exemplars |
| **Handoff Criteria** | The `sk-create-goal` packet exists in create-skill shape and remains unregistered. The strict package check prints `Result: PASS`, while the sk-doc parent-skill check reports only invariant `6a` for `sk-create-goal`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Create the sk-create-goal sk-doc mode that authors packet goals specification.

**Scope Boundary**: Create only the nested packet at `.skilled/skills/sk-doc/sk-create-goal/`. Do not change hub registration, commands, runtime hooks or system-spec-kit files in this phase (`specs/sk-doc/060-create-goal-mode/spec.md:85-109,121-129`).

**Dependencies**:
- Phase 001 must deliver its ownership contract, target tree and checker decision before this phase executes (`specs/sk-doc/060-create-goal-mode/spec.md:142-143` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`).
- The packet follows the nested-packet contract and the parent goal's frozen decisions (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:273-275,307-318` and `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

**Deliverables**:
- `SKILL.md`, a nested workflow execution contract with routing guidance, plus a short `README.md` stub and `references/README.md`.
- `assets/` for exemplars and `changelog/` for later packet history. Add `scripts/` only if phase 001 selects a mode-local checker (`specs/sk-doc/060-create-goal-mode/spec.md:122-129` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).
- A packet that remains unregistered and contains no fork of the system-spec-kit goal template (`specs/sk-doc/060-create-goal-mode/spec.md:142-143` and `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent assigns packet scaffolding to phase 002 and reserves authoring standards, conformance checking, routing and command work for later phases (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`). The predecessor remains planned and its implementation summary says the checker decision is unresolved. This phase must take its scripts-directory choice from the completed phase 001 contract rather than guess (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).

### Purpose

Create the nested workflow packet foundation that later phases can fill with goal-authoring standards while keeping its routing integration for phase 007 (`specs/sk-doc/060-create-goal-mode/spec.md:123-129,143,148`).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create the nested packet's `SKILL.md`, `README.md` stub and `references/README.md` from the sk-create-skill packet pattern (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:297-318` and `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:27-50`). The mode-anatomy audit records the hub-plus-packet structure (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-mode-anatomy-audit.md:25-36`).
- Establish `assets/` for phase 003's exemplars and `changelog/` for later release notes. Create `scripts/` only when phase 001 chooses a mode-local checker (`specs/sk-doc/060-create-goal-mode/spec.md:123,126,129` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).
- State that goal files use system-spec-kit's renderer and contract, with no goal-template copy inside this mode (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-105`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18`).
- Keep the child unregistered until phase 007 and record the expected single `6a` parent-skill failure (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143,148` and `specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:80-107`).

### Out of Scope
- Hub registry, router, hub `SKILL.md`, metadata, command files and runtime mirrors. The parent assigns routing to phase 007 and command work to phase 008 (`specs/sk-doc/060-create-goal-mode/spec.md:104-109,127-129,148-149`).
- Goal authoring standards and exemplar content, which phase 003 owns, or the checker implementation, which phase 006 owns (`specs/sk-doc/060-create-goal-mode/spec.md:123,126`).
- Changes to the system-spec-kit goal template, renderers, validator or goal hooks. The parent keeps those owners unchanged (`specs/sk-doc/060-create-goal-mode/spec.md:94-98` and `specs/sk-doc/060-create-goal-mode/goal.md:49-54`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-goal/SKILL.md` | Create | Nested workflow contract and routing guidance, following the packet scaffold (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:307-318`). |
| `.skilled/skills/sk-doc/sk-create-goal/README.md` | Create | Short packet entry point (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:40-49`). |
| `.skilled/skills/sk-doc/sk-create-goal/references/README.md` | Create | Index for the mode's reference material (`specs/sk-doc/z_archive/040-create-repo-rules/003-skill-scaffold-and-template/spec.md:77-83,93-104`). |
| `.skilled/skills/sk-doc/sk-create-goal/assets/` | Create | Directory reserved for exemplars authored in phase 003 (`specs/sk-doc/060-create-goal-mode/spec.md:123`). |
| `.skilled/skills/sk-doc/sk-create-goal/changelog/` | Create | Packet-local history directory. Phase 009 owns the release file (`specs/sk-doc/060-create-goal-mode/spec.md:129` and `specs/sk-doc/z_archive/040-create-repo-rules/003-skill-scaffold-and-template/implementation-summary.md:155-160`). |
| `.skilled/skills/sk-doc/sk-create-goal/scripts/` | Create, conditional | Create only if phase 001 selects a mode-local checker. Phase 006 owns checker code (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85` and `specs/sk-doc/060-create-goal-mode/spec.md:126`). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The packet contains `SKILL.md`, `README.md`, `references/README.md`, `assets/` and `changelog/`. `scripts/` exists only when phase 001 selects a mode-local checker (`specs/sk-doc/060-create-goal-mode/spec.md:123,126,129` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). |
| REQ-002 | `SKILL.md` separates goal-file authoring from runtime goal state and names system-spec-kit rendering without carrying a local goal-template copy (`specs/sk-doc/060-create-goal-mode/goal.md:49-54`) (`.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:46-105`) (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18,49-53`). |
| REQ-003 | The mode remains unregistered. The parent-skill check reports invariant `6a` for `sk-create-goal` and no other failure, with no partial registry entry (`specs/sk-doc/060-create-goal-mode/spec.md:142-143` and `specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:88-107`). |
| REQ-004 | The strict package check prints `Result: PASS` for the new packet (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391` and `specs/sk-doc/049-sk-create-frontmatter/README.md:166-171`). |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The phase folder's strict validator prints `RESULT: PASSED` after generated metadata is reconciled. Every phase must validate independently before the next begins (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet tree matches phase 001's target tree, including the conditional `scripts/` choice (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:89-94`).
- **SC-002**: The package check prints `Result: PASS` for `.skilled/skills/sk-doc/sk-create-goal` (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171`).
- **SC-003**: The parent-skill check reports only invariant `6a` for `sk-create-goal` (`specs/sk-doc/060-create-goal-mode/spec.md:143` and `specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:88-107`).
- **SC-004**: The mode root contains no `goal.md.tmpl` (`specs/sk-doc/060-create-goal-mode/goal.md:50`).
- **SC-005**: The mode root contains zero `graph-metadata.json` and `description.json` files (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:59` and `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`).

**Given** phase 001 has delivered its target tree and checker decision, **When** the packet is scaffolded, **Then** the directory listing matches those outputs (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/spec.md:85-94`).

**Given** the nested packet exists, **When** the strict package check runs, **Then** it prints `Result: PASS` (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391`).

**Given** the mode remains unregistered, **When** the parent-skill check runs on sk-doc, **Then** its only failure is `6a` for `sk-create-goal` (`specs/sk-doc/060-create-goal-mode/spec.md:143` and `specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:88-107`).

**Given** goal rendering is described in `SKILL.md`, **When** the packet is checked, **Then** the renderer remains system-spec-kit-owned and no goal template is copied into the mode (`specs/sk-doc/060-create-goal-mode/goal.md:49-54` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14-18`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 contract and target tree | Without its checker choice, `scripts/` could be scaffolded against the wrong owner (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`). | Do not begin packet writes until the predecessor handoff in the parent is met (`specs/sk-doc/060-create-goal-mode/spec.md:142-143`). |
| Dependency | sk-create-skill packet pattern and package checker | An incorrect nested-packet shape can fail packaging (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:297-318,370-391`). | Use the packet scaffold and run the exact strict package command. |
| Risk | The expected `6a` failure is mistaken for a reason to register early | Partial registration causes additional `6b` and `10d` failures (`specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:100-107`). | Leave all hub surfaces untouched until phase 007 and record only the expected `6a` result (`specs/sk-doc/060-create-goal-mode/spec.md:127,142-143,148`). |
| Risk | A phase-parent goal is rendered through `create.sh --phase --with-goal` alone | The audit says that path scaffolds child goals but no parent goal (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/scratch/wave1-goal-system-audit.md:14,70`). | The mode's authoring instructions must use the system-spec-kit inline renderer when a parent goal needs rendering (`.skilled/skills/system-spec-kit/runtime/cli/templates/README.md:28-40,46-49`). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance target applies to a packet-scaffold phase (`specs/sk-doc/060-create-goal-mode/spec.md:121-129`).
- **NFR-P02**: The phase adds no runtime or network dependency (`specs/sk-doc/060-create-goal-mode/spec.md:85-109`).

### Security
- **NFR-S01**: Do not change session-goal state, goal hooks or host goal commands. Those remain outside this packet's file-authoring boundary (`specs/sk-doc/060-create-goal-mode/spec.md:94-99` and `specs/sk-doc/060-create-goal-mode/goal.md:51-54`).
- **NFR-S02**: Do not place hub identity files or a goal-template copy in the nested packet (`.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:59`) (`.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:62-72`) (`specs/sk-doc/060-create-goal-mode/goal.md:50`).

### Reliability
- **NFR-R01**: The package gate must print `Result: PASS` and the parent check must show only the expected `6a` failure (`specs/sk-doc/049-sk-create-frontmatter/README.md:168-171` and `specs/sk-doc/060-create-goal-mode/spec.md:143`).
- **NFR-R02**: The phase folder must pass its strict validator before handoff (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Phase 001 selects a mode-local checker: create `scripts/` now, but leave checker code to phase 006 (`specs/sk-doc/060-create-goal-mode/spec.md:126` and `specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).
- Phase 001 assigns the checker to system-spec-kit: omit `scripts/` from this packet and preserve D4 (`specs/sk-doc/060-create-goal-mode/goal.md:52-54`).
- The target mode directory already exists at execution preflight: halt and inspect rather than overwrite an existing packet (`specs/sk-doc/060-create-goal-mode/spec.md:104` and `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:27-50`).

### Error Scenarios
- The package check fails: fix packet-owned template defects and rerun the same strict command (`.skilled/skills/sk-doc/sk-create-skill/SKILL.md:370-391`).
- The parent-skill check reports `6b`, `10d` or any failure beyond the expected `6a`: stop and investigate a partial registration or another source before handoff (`specs/sk-doc/049-sk-create-frontmatter/002-mode-scaffold/implementation-summary.md:100-107` and `specs/sk-doc/060-create-goal-mode/spec.md:143`).
- The strict phase validator reports an error outside generated metadata: fix it before handoff (`specs/sk-doc/060-create-goal-mode/spec.md:131-136`).

### State Transitions
- Partial packet scaffold: keep the phase unclosed and resume from the missing packet-owned artifacts (`specs/sk-doc/060-create-goal-mode/spec.md:131-143`).
- Registration remains deferred after phase 002. Phase 007 closes the `6a` failure when it integrates the mode (`specs/sk-doc/060-create-goal-mode/spec.md:142-143,148`).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Planning estimate for a small nested packet with a conditional scripts directory. |
| Risk | 7/25 | Planning estimate. The main risk is an expected parent-gate failure being misread. |
| Research | 8/20 | Planning estimate based on the predecessor contract, packet references and both audits. |
| **Total** | **25/70** | **Level 2, scores are planning estimates.** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Phase 001's local-checker versus system-spec-kit amendment decision remains pending. Execution must follow its final `mode-boundary.md` and create `scripts/` only for the local-checker choice (`specs/sk-doc/060-create-goal-mode/001-goal-inventory-and-mode-contract/implementation-summary.md:52-56,85`).
<!-- /ANCHOR:questions -->
