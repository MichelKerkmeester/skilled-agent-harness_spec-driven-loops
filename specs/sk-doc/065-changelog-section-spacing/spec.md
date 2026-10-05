---
title: "Feature Specification: Changelog Section Spacing"
description: "Changelog entries and release notes separate sections with a forced blank line and run the items inside a section together, with no horizontal rules."
trigger_phrases:
  - "changelog section spacing"
  - "changelog nbsp separators"
  - "release notes spacing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Changelog Section Spacing

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The changelog standard put a `---` rule between top-level sections and an `&nbsp;` line between the items inside a section. The operator wants the opposite reading rhythm: a forced blank line between the opening, Why This Release, What's New at a Glance and every later section, and the items inside a section running together with no rules at all. Entries and GitHub release notes written from the standard would keep the old spacing.

### Purpose
Every changelog entry and release note written from now on, and the published v4 Skilled releases, use the new spacing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The changelog template's example blocks, separator guideline and release-notes section
- `SKILL.md` section 8 rule 4, its release-notes block and the section 9 structural checks
- The worked examples and their annotation
- The format check and release-notes assembly in both `/create:changelog` YAML workflows
- The four v4 Skilled changelog entries and the three published v4 release notes
- The skill's own v1.3.3.0 changelog entry

### Out of Scope
- Skilled entries in the `v1+`, `v2+` and `v3+` folders and their releases - they predate the v4 style and keep their spacing
- The release title and annotated tag format - both workflows already write `vX — Heading` and `vX: Heading`
- The stale `sk-doc` leaf manifest for `sk-create-frontmatter` - a separate defect found during verification

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md` | Modify | Example blocks, separator guideline, release-notes format |
| `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` | Modify | Notation rule, release notes, structural checks, version 1.3.3.0 |
| `.skilled/skills/sk-doc/sk-create-changelog/references/worked-examples.md` | Modify | Both examples and the annotations |
| `.skilled/skills/sk-doc/sk-create-changelog/changelog/v1.3.3.0.md` | Create | The skill's changelog entry |
| `.skilled/commands/create/assets/create-changelog-auto.yaml` | Modify | Format check and release-notes assembly |
| `.skilled/commands/create/assets/create-changelog-confirm.yaml` | Modify | Format check and release-notes assembly |
| `.skilled/changelog/skilled/v4.0.0.0.md` to `v4.0.0.3.md` | Modify | Respaced, content unchanged |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The standard requires an `&nbsp;` line before every H2, nothing between H4 items and no `---` rule in an entry body | Template, `SKILL.md`, worked examples and both YAML format checks state it, and no live file states the old rule |
| REQ-002 | Release notes keep the entry's spacing and end with an `&nbsp;` line before the full-changelog pointer | Template section 6, `SKILL.md` section 8 and both YAML release steps state it |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The v4 Skilled entries and the published v4 release notes use the new spacing with their content unchanged | Non-spacing lines identical before and after, and each live body has no `---` and one `&nbsp;` per H2 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A new entry generated from the standard reads with a forced blank line between sections and none between items
- **SC-002**: The published v4 releases show the same layout on GitHub
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing published release notes | Med | Bodies saved to `scratch/release-bodies-before/` first, restorable with `gh release edit --notes-file` |
| Risk | The respace drops content | Low | Non-spacing lines compared before and after for every file and body |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator chose the scope, the restyle of the v4 releases and the commit and push
<!-- /ANCHOR:questions -->

---


