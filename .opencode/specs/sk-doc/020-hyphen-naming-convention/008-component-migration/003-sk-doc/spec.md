---
title: "Feature Specification: sk-doc surface component migration"
description: "The sk-doc skill surface contains in-scope snake_case directories and non-Python filenames across its hub, shared backbone, workflow packets, playbook, and release evidence. This phase parent divides the surface into independent component phases so each rename set has a bounded reference update and blocking acceptance contract."
trigger_phrases:
  - "sk-doc component migration"
  - "sk-doc kebab-case phases"
  - "020 sk-doc surface"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored sk-doc phase map"
    next_safe_action: "Select a direct child phase for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: sk-doc surface component migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/020-hyphen-naming-convention/008-component-migration` |
| **Child Count** | 7 direct phases |
| **Handoff Criteria** | Every direct child passes its own checklist and the rollup gate confirms the complete sk-doc surface |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The sk-doc surface uses snake_case in several directory and filename families, while the 020 program defines kebab-case as the sole canonical form for in-scope filesystem names. The surface also contains Python scripts, Python package directories, tool-mandated names, and historical content that must remain unchanged under the program exemption boundary.

### Purpose

Provide seven independently executable phase contracts that rename the in-scope sk-doc filesystem names, update their path references, preserve the exemption set, verify the changelog evidence, and close with a whole-surface gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The sk-doc hub root and `shared/` assets, references, scripts, and facade behavior.
- The `scripts/` tree, including non-Python test fixture filenames and path consumers.
- The eleven `create-*` workflow packets represented by the nested `003-create-packets` parent.
- The root `manual_testing_playbook/` tree and the root `benchmark/` artifact boundary.
- Changelog/version evidence and the final subtree naming gate.

### Out of Scope

- Python `.py` filenames and Python import-package directories.
- `SKILL.md`, `README.md`, `mode-registry.json`, package manifests, lockfiles, and other tool-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter field names, database columns, and frozen historical surfaces.
- Any migration outside `.opencode/skills/sk-doc` or any implementation during this authoring pass.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/` | Modify | 001-007 | Rename scoped names and update path consumers within the surface |
| `003-create-packets/` | Documentation only | Nested parent | Decomposes the eleven create-* packet children |
| `changelog/` | Verify | 006 | Confirm the released entry and version evidence match the completed rename set |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-hub-root-and-shared/` | Hub-root and shared-backbone non-Python filesystem names, preserving facade links and mandated names | Planned |
| 002 | `002-scripts/` | Non-Python script-tree filenames, test fixtures, and sourcing/import/reference updates | Planned |
| 003 | `003-create-packets/` | Parent map for the eleven independent create-* workflow packets | Planned |
| 004 | `004-manual-testing-playbook/` | Root manual-testing-playbook directories, scenario files, and references | Planned |
| 005 | `005-benchmark/` | Root benchmark artifact naming boundary; current baseline contains only `.gitkeep` | Planned |
| 006 | `006-changelog-verify/` | Verify changelog entry and version-bump evidence after the rename phases | Planned |
| 007 | `007-skill-gate/` | Roll up sibling evidence and enforce the subtree-wide exemption-aware kebab-case gate | Planned |

Each child phase owns its rename/reference manifest and checklist. Phase 007 may close only after all executable children and the nested create-packet children have supplied passing evidence.
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at parent level. A child may record a path-specific question only when the baseline census finds a name that cannot be classified by the 001 convention and exemption boundary.
<!-- /ANCHOR:questions -->
