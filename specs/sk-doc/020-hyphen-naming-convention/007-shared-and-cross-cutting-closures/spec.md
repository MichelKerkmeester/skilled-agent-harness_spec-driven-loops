---
title: "Feature Specification: shared and cross-cutting dependency closures (020 phase 007)"
description: "Backbone phase for dependency closures whose filesystem-name changes and reference fan-out cross skill boundaries, shared script trees, root infrastructure, or active spec documentation."
trigger_phrases:
  - "shared cross-cutting dependency closures"
  - "hyphen naming phase 007 closures"
  - "cross-skill symlink closure"
  - "hoisted shared script closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures"
    last_updated_at: "2026-07-14T17:28:55Z"
    last_updated_by: "codex"
    recent_action: "Authored the shared-closure parent specification and four-child phase map"
    next_safe_action: "Execute a selected closure child against the frozen rename map"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/007-shared-and-cross-cutting-closures/"
      - ".opencode/skills/sk-doc/scripts/"
      - ".opencode/commands/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Kebab-case is the canonical form for in-scope filesystem names"
      - "Python scripts, Python import-package directories, tool-mandated names, generated output, and frozen history remain exempt"
      - "Each child owns a dependency closure and publishes its handoff for the component phases"
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT — root purpose + child phase map only; detailed plans, tasks, checklists, and decisions live in the children. -->

# Feature Specification: Shared and Cross-Cutting Dependency Closures

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase parent |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `sk-doc/020-hyphen-naming-convention` |
| **Predecessor** | `006-inventory-and-frozen-map` |
| **Successor** | `008-component-migration` |
| **Handoff Criteria** | Every child has a concrete, evidence-pinned closure manifest that downstream component phases can declare as a dependency |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Several in-scope filesystem names are not owned by one component subtree. Root and `.opencode` infrastructure, symlink façades, shared scripts, and active spec documents each fan out into multiple consumers. Treating any one of these as a local name change can leave a dangling link, stale command path, broken shared-script reference, or unresolved spec link.

### Purpose
Define four hoisted dependency-closure children that inventory the shared surface, carry every rename and reference edge together, and hand a verifiable closure contract to the component phases under phase 008.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root-level and `.opencode` infrastructure names that no single skill owns.
- Symlink link-nodes and targets whose resolved paths cross skill boundaries.
- Shared scripts and their multi-skill consumer references.
- Active spec folders and authored documentation names, links, and path-derived values.
- Closure manifests that classify each candidate as rename, exempt, frozen, generated, or tool-mandated.

### Out of Scope
- Component-owned names handled by the phase 008 skill subtrees.
- Python `.py` files and Python import-package directories.
- Tool-mandated names such as `.utcp_config.json`, `.mcp.json`, `SKILL.md`, and other exact-name contracts.
- Generated or lockfile output, changelogs, `z_archive/`, and completed spec history.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, and database columns.

### Files to Change

| File Path | Change Type | Child | Description |
|-----------|-------------|-------|-------------|
| Root files and `.opencode/commands/**`, `.opencode/install_guides/**` | Rename/reference closure | `001-root-and-opencode-infra-strays` | Classify and close names outside one skill-owned subtree |
| Cross-skill symlink link-nodes and resolved targets | Symlink/reference closure | `002-cross-skill-symlink-closure` | Move targets and every pointer as one atomic closure |
| `.opencode/skills/**/shared/**` and `scripts/shared/**` | Rename/reference closure | `003-hoisted-shared-script-closures` | Hoist scripts with consumers in multiple skill trees |
| Active `.opencode/specs/**` folders and authored docs | Rename/reference closure | `004-active-specs-and-docs` | Preserve phase structure while resolving doc names and links |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Closure owned | Downstream handoff |
|-------|--------|---------------|-------------------|
| 001 | `001-root-and-opencode-infra-strays/` | Root-level and `.opencode` infrastructure candidates outside a single skill | Root-infrastructure closure manifest and unresolved cross-boundary edges |
| 002 | `002-cross-skill-symlink-closure/` | Symlink targets and link-nodes that cross skill boundaries | Atomic symlink ordering contract, mode manifest, and resolved-target evidence |
| 003 | `003-hoisted-shared-script-closures/` | Shared script names with consumers in multiple skill subtrees | Shared-script closure manifest and consumer/reference dispositions |
| 004 | `004-active-specs-and-docs/` | Active spec/document names and path-derived references | Packet/doc closure manifest, link evidence, and strict-validation targets |

Each child remains a planning contract. The component phases consume the child handoffs through explicit `depends_on` entries; this parent does not duplicate their implementation details.
<!-- /ANCHOR:phase-map -->

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None blocking. Child execution uses the immutable BASE, the frozen bijective rename map, and the rename/reference tooling defined by the governing 020 phases.
<!-- /ANCHOR:questions -->

## RELATED DOCUMENTS

- **Program scope and sequencing**: See `../spec.md`
- **Naming policy and exemptions**: See `../../001-convention-policy-and-scope/spec.md`
- **Child phase contracts**: See the four folders listed in the phase map above
- **Graph metadata**: See `graph-metadata.json` for the active child pointer
