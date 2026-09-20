---
title: "Feature Specification: Inventory and skill-contract mapping for sk-create-diagram"
description: "Map the forked diagram-design plugin (context/) to the sk-create-skill authoring contract: content-trim manifest, target file tree, name and scope boundary, command surface."
trigger_phrases:
  - "diagram skill inventory"
  - "diagram-design content trim manifest"
  - "sk-create-diagram scope boundary"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/001-inventory-and-skill-contract"
    last_updated_at: "2026-08-12T05:53:36.000Z"
    last_updated_by: "claude"
    recent_action: "Completed the content inventory and produced the trim manifest and target tree"
    next_safe_action: "Start phase 002 executor dispatch"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Ship all 27 diagram types and the icon primitive in v1; drop only the multi-variant asset gallery (keep one canonical example per type)."
      - "Onboarding stays agent-mediated guidance, not a packet script — no toolSurface entry claims network fetch."
      - "One command, /create:diagram, covers generate, import, and export via natural-language routing inside the skill."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Inventory and skill-contract mapping for sk-create-diagram

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | `../002-skill-scaffold-and-design-system/spec.md` |
| **Handoff Criteria** | Content-trim manifest, target file tree, skill name/boundary, and command surface are decided and recorded |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Analysis and decision-recording only. No skill files are authored in this phase; phases 002-005 consume this phase's `decision-record.md` as their executor brief.

**Dependencies**: The forked source at `../context/` (untracked copy of the `cathrynlavery/diagram-design` plugin) and the `sk-create-skill` contract at `.opencode/skills/sk-doc/sk-create-skill/SKILL.md`.

**Deliverables**:

- `decision-record.md` — content-trim manifest, target file tree, name/boundary decision, command surface.
- `resource-map.md` — line-count and dependency inventory of every source file, and its fate (port / trim / drop).
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The source plugin ships 282 files (references, 100 example HTML assets, two Python extractors, its own CI/lint tooling, marketplace/plugin manifests for three runtimes) using its own conventions. Copying it verbatim would violate `sk-create-skill`'s frontmatter, section-order, root-metadata-class, and kebab-case-resource rules, and would ship CI tooling and an asset gallery this repository does not need.

### Purpose

Decide, once, what ports as-is, what gets restructured to fit the contract, and what is dropped — so phases 002-005 execute against a single frozen manifest instead of re-litigating scope per file.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Read `context/skills/diagram-design/SKILL.md`, `context/README.md`, and every `references/*.md`, `assets/*.html`, and `scripts/*.py` file's size/shape (not necessarily full content of every example asset).
- Decide the new skill's name, folder, and scope-boundary text against the existing `sk-create-flowchart` sibling.
- Decide the command surface (`/create:diagram` vs. multiple commands).
- Produce a concrete target file tree for `.opencode/skills/sk-doc/sk-create-diagram/`.
- Resolve the two open questions carried from the phase-parent spec (icon set inclusion, onboarding automation boundary).

### Out of Scope

- Writing any file under `.opencode/skills/sk-doc/sk-create-diagram/` — that starts in phase 002.
- Editing `mode-registry.json`, `hub-router.json`, or `command-metadata.json` — phase 005.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `decision-record.md` | Create | Trim manifest, target tree, name/boundary, command surface |
| `resource-map.md` | Create | Per-file inventory: source path, lines, dependencies, fate |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Inventory every source file's size and dependency footprint. | `resource-map.md` lists every `references/*.md`, `scripts/*.py`, and the `assets/` directory with line counts and stdlib-only confirmation for scripts. |
| REQ-002 | Decide the content-trim manifest. | `decision-record.md` states exactly what ports verbatim-adapted, what gets restructured, and what is dropped, with a one-line reason each. |
| REQ-003 | Decide the skill name and scope boundary against `sk-create-flowchart`. | `decision-record.md` states the folder name and a "When NOT to Use" boundary sentence distinguishing ASCII-markdown flowcharts from self-contained HTML/SVG diagrams. |
| REQ-004 | Decide the command surface. | `decision-record.md` states one command (`/create:diagram`) and how import/export sub-intents route inside the single packet. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Produce the target file tree. | `decision-record.md` includes a full tree for `references/`, `assets/`, `scripts/`, matching the `sk-create-skill` required standalone/nested shape. |
| REQ-006 | Resolve the two carried-over open questions. | `decision-record.md` states a decision for icon-set inclusion and onboarding-automation boundary, each with a one-line reason. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every source file has a recorded fate (port / restructure / drop) in `resource-map.md`.
- **SC-002**: `decision-record.md` gives phases 002-005 enough detail to execute without re-reading `context/` end to end.
- **SC-003**: The scope-boundary text makes `sk-create-diagram` vs. `sk-create-flowchart` routing unambiguous for the advisor.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Trimming too aggressively loses the design system's actual value (the 27-type breadth is the point). | Medium | Keep all 27 type references and one example each; only trim the redundant multi-variant gallery. |
| Risk | The `sk-create-flowchart` boundary reads ambiguous to the advisor, causing mis-routing. | Medium | Mirror the exact exclusion language `sk-create-flowchart` already uses ("SVG, HTML... interactive design work") back as this skill's inclusion language. |
| Dependency | `sk-create-skill` contract (frontmatter, section order, root-metadata class) | High | Already read in full; this phase's decisions cite it directly. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining — both carried-over questions are resolved in `decision-record.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decisions: `decision-record.md`
- Resource inventory: `resource-map.md`
- Source: `../context/skills/diagram-design/SKILL.md`, `../context/README.md`
