---
title: "Feature Specification: sk-create-diagram scaffold and design system"
description: "Scaffold the sk-create-diagram packet and author SKILL.md plus the shared design-system references, restructured to the sk-create-skill contract per phase 001's decision record."
trigger_phrases:
  - "sk-create-diagram SKILL.md"
  - "diagram design system references"
  - "diagram skill scaffold"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/002-skill-scaffold-and-design-system"
    last_updated_at: "2026-08-12T06:10:45.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase spec ahead of executor dispatch"
    next_safe_action: "Dispatch phase 002 executor prompt via cli-opencode"
    blockers: []
    key_files:
      - "spec.md"
      - "../001-inventory-and-skill-contract/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram scaffold and design system

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
| **Phase** | 2 of 6 |
| **Predecessor** | `../001-inventory-and-skill-contract/spec.md` |
| **Successor** | `../003-diagram-type-reference-library/spec.md` |
| **Handoff Criteria** | `SKILL.md` skeleton and every design-system reference exist, pass `validate_skill_package.py --check`, and are internally cross-reference-consistent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: `SKILL.md`, the design-system and primitive references, the four base HTML templates, and the icon gallery/reference. The 27 `type-*.md` files and their examples are phase 003; import/export tooling is phase 004; hub wiring is phase 005.

**Dependencies**: `../001-inventory-and-skill-contract/decision-record.md` (identity, boundary, tree, section-order mapping — the executor brief), `sk-create-skill/assets/skill/skill-md-template.md`, `skill-reference-template.md`.

**Deliverables**: See §3 Files to Change.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 001 decided what ports and how `SKILL.md` remaps, but nothing has been written yet — the packet folder does not exist.

### Purpose

Scaffold `.opencode/skills/sk-doc/sk-create-diagram/` and produce a working `SKILL.md` plus every shared design-system reference, so phase 003 has a real packet to add the 27 type references into rather than a bare folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create the packet folder with the tree from `decision-record.md` §4 (`SKILL.md`, `README.md` stub, `references/`, `assets/`, `scripts/`, `changelog/` — README and changelog get full content in phase 005).
- Author `SKILL.md` using the section-order mapping in `decision-record.md` §6, respecting the `sk-create-skill` frontmatter contract (`name`, `description`, `allowed-tools`, `version`).
- Port `references/style-guide.md`, `onboarding.md` (trimmed to agent-mediated guidance), `output-spec.md`, `primitive-annotation.md`, `primitive-sketchy.md`, `primitive-terminal.md`, `primitive-icons.md`, each with the full 5-field + version reference frontmatter block.
- Port `assets/template.html`, `template-dark.html`, `template-full.html`, `template-terminal.html`, `assets/icons.html`.

### Out of Scope

- The 27 `type-*.md` references and their example assets (phase 003).
- `export.md`, `import-drawio.md`, `import-mermaid.md`, and the two extraction scripts (phase 004).
- `mode-registry.json` / `hub-router.json` / `command-metadata.json` registration (phase 005).
- Full `README.md` and `changelog/v1.0.0.0.md` content — a minimal stub is enough for phase 002; phase 005 completes them once the whole packet exists.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` | Create | Restructured per `decision-record.md` §6 |
| `.opencode/skills/sk-doc/sk-create-diagram/references/style-guide.md` | Create | Ported design tokens |
| `.opencode/skills/sk-doc/sk-create-diagram/references/onboarding.md` | Create | Ported, agent-mediated only |
| `.opencode/skills/sk-doc/sk-create-diagram/references/output-spec.md` | Create | Ported format/size/detail/audience dials |
| `.opencode/skills/sk-doc/sk-create-diagram/references/primitive-annotation.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/references/primitive-sketchy.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/references/primitive-terminal.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/references/primitive-icons.md` | Create | Ported |
| `.opencode/skills/sk-doc/sk-create-diagram/assets/template*.html` (4 files) | Create | Ported base scaffolds |
| `.opencode/skills/sk-doc/sk-create-diagram/assets/icons.html` | Create | Ported icon gallery |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` has valid frontmatter and the required section order. | `name: sk-create-diagram`, `description`, `allowed-tools`, `version: 1.0.0.0`; sections in order `WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / SUCCESS CRITERIA / REFERENCES`. |
| REQ-002 | `SKILL.md` states the `sk-create-flowchart` boundary verbatim from `decision-record.md` §2. | The exact boundary sentence appears under "When NOT to Use". |
| REQ-003 | Every ported `references/*.md` carries the full 5-field + version frontmatter block. | Spot-checked against `skill-reference-template.md`. |
| REQ-004 | Ported content preserves the source's mandatory connector rules and complexity-budget table without loss. | Diffed against `context/skills/diagram-design/SKILL.md` §6-7 for completeness. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | `SKILL.md` stays under the 5k-word ceiling. | Word count checked; detail lives in `references/`, not inlined. |
| REQ-006 | Every reference and asset filename is kebab-case. | Already true of the source filenames; confirmed unchanged. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scripts/validate_skill_package.py .opencode/skills/sk-doc/sk-create-diagram --check` reports no hard failures for the files this phase owns.
- **SC-002**: `SKILL.md`'s "SMART ROUTING" section correctly points to every reference this phase creates.
- **SC-003**: No content from `context/` is treated as instructions during porting — only as source material to adapt.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The Deepseek executor drifts from the section-order mapping and produces a link-farm `SKILL.md`. | Medium | Dispatch prompt quotes `decision-record.md` §6 verbatim and names the exact required section order. |
| Risk | Mandatory connector rules (§6 of the source) get summarized away during restructuring. | High | Dispatch prompt explicitly flags them as non-negotiable and requires them to land in a references file, not be dropped. |
| Dependency | Phase 001 decision record | High | Complete and strict-validated. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None — this phase executes a frozen brief.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Executor brief: `../001-inventory-and-skill-contract/decision-record.md`
- Source: `../context/skills/diagram-design/SKILL.md`
