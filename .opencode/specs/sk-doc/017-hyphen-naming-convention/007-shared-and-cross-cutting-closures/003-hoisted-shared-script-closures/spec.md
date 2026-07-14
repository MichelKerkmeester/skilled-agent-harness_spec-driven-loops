---
title: "Feature Specification: hoisted shared script closures (017 phase 007 child 003)"
description: "Shared scripts used by more than one skill must move with their complete import, require, source, registry, fixture, and symlink closure rather than being hidden inside one component subtree."
trigger_phrases:
  - "hoisted shared script closures"
  - "shared script naming closure"
  - "phase 007 shared scripts"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the hoisted shared-script closure contract"
    next_safe_action: "Build the multi-skill shared-script consumer graph from the frozen map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/skill_contract.cjs"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-doc/scripts/"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/shared/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Only non-exempt script filenames are rename candidates; Python `.py` scripts remain exempt"
      - "A shared script is hoisted here when its reference closure spans two or more skill subtrees"
      - "Symlink façades are coordinated with child 002, while component-owned script batches remain with phase 008"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Hoisted Shared Script Closures

> Child adjacency under the 007 parent (grouping order, not a runtime dependency): sibling `002-cross-skill-symlink-closure`; root infrastructure and active spec/document closures are `001-root-and-opencode-infra-strays` and `004-active-specs-and-docs`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/007-shared-and-cross-cutting-closures/003-hoisted-shared-script-closures |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | Shared script owners and all consuming skills |
| **Origin** | Child 003 of the 007 shared and cross-cutting dependency-closures phase |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Shared script trees are consumed through more than one skill surface. The repository has shared script locations such as `.opencode/skills/sk-doc/shared/scripts/` and `scripts/shared/`, plus façade paths under `.opencode/skills/sk-doc/scripts/`. A script filename change held inside one component subtree can therefore break imports, `require`/`source` calls, registries, fixtures, or test commands owned elsewhere.

This child hoists every multi-skill shared-script dependency closure into one manifest and execution contract. It preserves the program exemption boundary, especially the exemption for Python `.py` scripts and Python import-package directories, while requiring non-exempt script names to move with every consumer.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Non-exempt script filenames under `shared/scripts/`, `scripts/shared/`, and equivalent shared script roots.
- Shared script consumers in two or more skill subtrees, including imports, `require`, shell `source`, registries, fixtures, test commands, and path-valued configuration.
- Symlink façades and link-node references, coordinated with child 002's atomic contract.
- Explicit classification of Python `.py` scripts, Python package directories, tool-mandated names, and generated outputs as exempt where applicable.
- A closure handoff that downstream phase 008 component children can declare through `depends_on`.

### Out of Scope
- Scripts owned and consumed by one component subtree; those remain with the relevant phase 008 child.
- Python `.py` filenames and Python import-package directories.
- Runtime/package-layout directories, manifests, lockfiles, and configuration-data filename batches owned by other phases.
- Changelogs, `z_archive/`, completed history, code identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/**/shared/scripts/**` | Rename/reference closure | Rename only non-exempt shared script names and update all consumers |
| `.opencode/skills/**/scripts/shared/**` | Rename/reference closure | Include shared dispatch/helper scripts with cross-skill consumers |
| Shared-script façade links and registries | Link/reference update | Keep public script paths, symlinks, imports, and registries aligned |
| Shared-script fixtures and test commands | Reference update | Preserve execution and discovery paths without renaming Python exemptions |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Identify the complete multi-skill shared-script set | Each selected script has consumers in at least two skill subtrees, with the consumer paths recorded in the closure manifest |
| REQ-002 | Apply explicit semantic targets to non-exempt script names | Every rename has a kebab-case target, collision evidence, and no mechanical conversion of leading or repeated underscores |
| REQ-003 | Move all script consumers in lockstep | Imports, `require`, shell `source`, registries, fixtures, test commands, and path-valued configuration resolve to the target |
| REQ-004 | Preserve exemption and executable/symlink semantics | Python files/package dirs and tool-mandated names are unchanged; executable bits and symlink edges are preserved through child 002 |
| REQ-005 | Keep component ownership unambiguous | A script with only one owning skill is recorded as delegated to phase 008, not silently absorbed into this shared closure |
| REQ-006 | Publish a dependency-ready handoff | The manifest gives phase 008 children stable closure identifiers, consumer evidence, and required ordering |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the shared-script inventory, **when** consumer edges are resolved, **then** every selected script has at least two skill owners or is explicitly delegated to a component child.
- **SC-002**: **Given** a non-exempt shared script filename, **when** its semantic target is selected, **then** the target is kebab-case, collision-free, and recorded in the frozen-map closure.
- **SC-003**: **Given** imports, `require`, `source`, registries, fixtures, and test commands that reference a selected script, **when** the closure is applied, **then** every consumer resolves and no source path remains.
- **SC-004**: **Given** a Python script, Python package directory, or tool-mandated script name, **when** the closure is applied, **then** the exemption remains intact and is evidenced in the ledger.
- **SC-005**: **Given** a shared script with a symlink façade, **when** child 003 hands off the closure, **then** child 002 has the link edge and target mode evidence needed for atomic execution.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk / Dependency | Impact | Mitigation |
|-------------------|--------|------------|
| A consumer is hidden in a registry or dynamic loader | A script appears healthy while one skill still points at the old name | Use the phase 005 reference checker and disposition every dynamic site |
| A Python exemption is mistaken for a rename candidate | Imports or test discovery can break | Classify by extension and package role before target selection |
| A shared script is actually component-owned | Scope overlaps phase 008 and creates competing maps | Require two-skill consumer evidence or an explicit delegation record |
| A symlink façade is moved without its target closure | Public script paths dangle | Hand every symlink edge to child 002's atomic contract |
| A shared script is executable | Mode drift breaks dispatch | Capture and compare executable bits in the closure evidence |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Consumer ownership is established from the reference graph; unresolved dynamic sites become explicit dispositions in the handoff rather than assumptions.
<!-- /ANCHOR:questions -->
