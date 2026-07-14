---
title: "Feature Specification: sk-doc create-packet components"
description: "The eleven create-* workflow packets under sk-doc contain snake_case asset, reference, and template names. This nested phase parent separates each packet so its rename map and path-reference closure can be reviewed without widening another component's scope."
trigger_phrases:
  - "sk-doc create-packet components"
  - "create packet kebab-case phases"
  - "017 create workflow packet names"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-packet phase map"
    next_safe_action: "Select a create-* child phase for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT -->

# Feature Specification: sk-doc create-packet components

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc` |
| **Child Count** | 11 direct phases |
| **Handoff Criteria** | Every create-* child passes its checklist and the parent rollup can account for every scoped path |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The create-* packets are independent authoring workflows, but their resource directories and template filenames use mixed snake_case forms. A single broad rename would make it difficult to distinguish path updates from content identifiers and from tool-mandated names.

### Purpose

Give each create-* packet a bounded Level-2 execution contract for converting its own non-exempt filesystem names to kebab-case and updating every path consumer while keeping `SKILL.md`, manifests, package metadata, Python files, and Python package directories exact.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `create-skill`, `create-readme`, `create-agent`, and `create-command` resource trees.
- `create-feature-catalog`, `create-manual-testing-playbook`, and `create-benchmark` resource trees.
- `create-flowchart`, `create-changelog`, `create-diff`, and `create-quality-control` resource trees.
- References in each packet's `SKILL.md`, `README.md`, assets, references, tests, and registry-facing path values where the referenced filesystem name changes.

### Out of Scope

- The hub root, shared backbone, root scripts, root manual-testing-playbook, root benchmark, changelog evidence, and rollup gate, which have sibling phases.
- Tool-mandated `SKILL.md`, `README.md`, `mode-registry.json`, package manifests, lockfiles, and similar names.
- Python `.py` files, Python import-package directories, content identifiers, and non-path keys.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `create-*/` | Modify | 001-011 | Rename scoped assets/references and update their path consumers |
| `003-create-packets/001-.../` through `011-.../` | Documentation only | Child phases | Hold the detailed manifest, tasks, and SOL checklist for each packet |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-create-skill/` | Parent-skill and skill template/resource names | Planned |
| 002 | `002-create-readme/` | README and install-guide assets/references | Planned |
| 003 | `003-create-agent/` | Agent template and authoring references | Planned |
| 004 | `004-create-command/` | Command templates and argument/router references | Planned |
| 005 | `005-create-feature-catalog/` | Feature-catalog templates and guidance | Planned |
| 006 | `006-create-manual-testing-playbook/` | Manual-testing-playbook templates and guidance | Planned |
| 007 | `007-create-benchmark/` | Benchmark asset/reference taxonomy and storage guidance | Planned |
| 008 | `008-create-flowchart/` | Flowchart assets, references, and validator resource paths | Planned |
| 009 | `009-create-changelog/` | Changelog topology and versioning references | Planned |
| 010 | `010-create-diff/` | Confirm the packet has no in-scope snake_case filesystem name to rename | Planned |
| 011 | `011-create-quality-control/` | Quality-control transformation and validation references | Planned |

The child checklists are the acceptance contracts. The parent is complete only when each row has a passing child report and no child leaves an unclassified path.
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None at parent level. Child phases must resolve only their own path/reference ambiguities against the 001 convention and must not expand another packet's scope.
<!-- /ANCHOR:questions -->
