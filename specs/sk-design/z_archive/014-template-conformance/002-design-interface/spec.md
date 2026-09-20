---
title: "Feature Specification: design-interface template conformance"
description: "Phase parent for the per-folder template-conformance audit of the design-interface mode: nine children, one per top-level folder under .opencode/skills/sk-design/design-interface/, each auditing every file in that folder against its governing sk-doc template and fixing deviations."
trigger_phrases:
  - "design-interface template conformance"
  - "design-interface audit"
  - "interface mode conformance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored phase-parent spec.md and nine Planned children"
    next_safe_action: "Backfill metadata, then validate --recursive --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + sub-phase map only; no plan/tasks/checklist/decision/impl-summary here (those live in child phase folders). -->

# Feature Specification: design-interface template conformance

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Structure** | Phase Parent lean trio |
| **Priority** | P1 |
| **Status** | Planned — audit findings gathered, no fixes applied yet |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Handoff Criteria** | Each child audits every file in its one folder against the named governing template, fixes deviations, and its folder's checker (or `validate.sh`) passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `design-interface` mode (`.opencode/skills/sk-design/design-interface/`) grew nine top-level folders — packet root, `references/`, `assets/`, `procedures/`, `corpus/`, `scripts/`, `feature-catalog/`, `manual-testing-playbook/`, `changelog/` — under different authoring passes. A sampling audit found real deviations from the `sk-doc` `create-skill` / `create-feature-catalog` / `create-manual-testing-playbook` templates: a reference file missing its required `## 1. OVERVIEW` section, cross-mode file contamination (a `foundations`-mode changelog entry and three `foundations`-prefixed scenario files sitting inside this mode's own `changelog/` and `manual-testing-playbook/`), an undersized index file masquerading as a reference topic, and an unenforced `tests/` requirement for `scripts/`.

### Purpose
Give each of the nine folders its own independently auditable, independently fixable packet, so the exhaustive per-file conformance pass and its fixes land folder-by-folder without one giant cross-cutting change.

> **Phase-parent note:** root stays lean — `spec.md`, `description.json`, `graph-metadata.json`. No plan/tasks/checklist/decision-record/implementation-summary at this level; those live in the nine children.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Auditing and fixing every file in each of the nine `design-interface` top-level folders against its governing template.
- Running each folder's own checker (`package_skill.py`, `naming_doc_check.py`, `contrast_check.py`, `baseline_rhythm_check.py`, or `validate.sh` for spec-adjacent docs) after fixes.

### Out of Scope
- `LICENSE.txt` at the packet root — owned by sibling packet `001-apache-devendoring`.
- `manual-testing-playbook/licensing-and-provenance/` scenario `ID-007` — will be deleted or inverted by `001-apache-devendoring`, not by this phase.
- The other eight `014-template-conformance` siblings (`001`, `003`-`008`) and the program parent itself — owned by other workers.
- Any change to `sk-design`'s other modes (`interface-motion`, `md-generator`) or the `sk-design` parent hub.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|--------------|
| `.opencode/skills/sk-design/design-interface/{SKILL.md,README.md}` | Audit/Modify | `001-packet-root/` | Packet-root ceiling and README structure conformance |
| `.opencode/skills/sk-design/design-interface/references/**/*.md` | Audit/Modify | `002-references/` | Reference-topic template conformance, 29 files |
| `.opencode/skills/sk-design/design-interface/assets/**/*.md` | Audit/Modify | `003-assets/` | Asset template conformance |
| `.opencode/skills/sk-design/design-interface/procedures/*.md` | Audit/Modify | `004-procedures/` | Procedure-card template conformance |
| `.opencode/skills/sk-design/design-interface/corpus/**` | Audit/Modify | `005-corpus/` | Directory-rule conformance (no authored template) |
| `.opencode/skills/sk-design/design-interface/scripts/**` | Audit/Modify | `006-scripts/` | Checker scripts, missing `tests/` finding |
| `.opencode/skills/sk-design/design-interface/feature-catalog/**` | Audit/Modify | `007-feature-catalog/` | Feature-catalog template conformance |
| `.opencode/skills/sk-design/design-interface/manual-testing-playbook/**` | Audit/Modify | `008-manual-testing-playbook/` | Playbook template + scenario-ID conformance, cross-mode contamination |
| `.opencode/skills/sk-design/design-interface/changelog/*.md` | Audit/Modify | `009-changelog/` | Changelog template conformance, cross-mode contamination |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> Each child is an independently validatable Level-2 audit-and-fix packet, one per `design-interface` top-level folder. All nine are **Planned**: the sampling pass below found real defects, but the exhaustive per-file audit and the fixes are each child's first task.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | `001-packet-root/` | `SKILL.md` + `README.md` vs `skill-md-template.md` + `skill-readme-template.md`; `LICENSE.txt` explicitly excluded | **Planned** |
| 2 | `002-references/` | 29 files across `aesthetics/`, `design-grounding/`, `design-process/`, `foundations/` (incl. `color/`, `layout/`, `type/`), `mcp-tooling/` vs `skill-reference-template.md` | **Planned** |
| 3 | `003-assets/` | 3 files vs `skill-asset-template.md` | **Planned** |
| 4 | `004-procedures/` | 9 procedure cards vs `skill-procedure-template.md` | **Planned** |
| 5 | `005-corpus/` | `.mjs` modules + `tests/` vs `create-skill/references/shared/overview.md` directory rules | **Planned** |
| 6 | `006-scripts/` | 3 Python checkers + fixtures vs directory rules; missing `tests/` finding | **Planned** |
| 7 | `007-feature-catalog/` | 5 category dirs, 11 feature files vs `feature-catalog-template.md` | **Planned** |
| 8 | `008-manual-testing-playbook/` | 20 category dirs vs `manual-testing-playbook-template.md`; cross-mode contamination in `procedure-card-contract/` | **Planned** |
| 9 | `009-changelog/` | 2 files vs `changelog-template.md` §7 nested-packet rules; one file is a `foundations`-mode entry, not this mode's | **Planned** |

### Phase Transition Rules
- Each child passes `validate.sh` independently; validate the theme with `validate.sh --recursive --strict`.
- Children are independent of each other — no child blocks another's start. `002-references` and `008-manual-testing-playbook` are the largest jobs.

### Phase Handoff Criteria
| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| Each child | Program parent | Every file in the child's one folder matches its governing template, or a documented exception is recorded | Child's folder checker (or `validate.sh` for the child's own spec docs) passes |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS
- `006-scripts`: the reference-template §8 `tests/` requirement (REQUIRED when `scripts/` exists, ≥80% coverage, `test_[name].py`) is unenforced by any checker here — operator decision needed on whether to scaffold `tests/` or formally except this mode.
- `002-references`: one dispatcher-cited defect (`resource-loading-notes.md` numbered headers allegedly sentence-case) did NOT reproduce on read — its headers are already ALL-CAPS. The confirmed, separate issue is that the file is only 36 lines, well under the 200-line reference-worthiness bar.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Program parent:** `../spec.md` (owned by another worker, not created by this packet).
- **Siblings:** `../001-apache-devendoring/` (owns `LICENSE.txt` and playbook scenario `ID-007`), `../003-*/` through `../008-*/` (other design-interface-adjacent conformance packets, owned by other workers).
- **Graph Metadata:** `graph-metadata.json`.
