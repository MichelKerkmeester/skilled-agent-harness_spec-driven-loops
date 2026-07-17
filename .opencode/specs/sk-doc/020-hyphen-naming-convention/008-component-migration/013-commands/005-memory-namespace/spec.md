---
title: "Feature Specification: memory command namespace naming (032 phase 008/013/005)"
description: "The memory command namespace has compliant command markdown files but four snake_case presentation asset filenames. This phase renames those maintained assets, updates command and README pointers, and preserves memory command IDs, tool names, and data keys."
trigger_phrases:
  - "memory command namespace naming"
  - "kebab-case memory assets"
  - "hyphenate memory presentation files"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored memory namespace docs"
    next_safe_action: "Execute the memory asset rename closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/memory/"
      - ".opencode/commands/memory/assets/"
      - ".opencode/commands/memory/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The memory command markdown files already use compliant basenames; the four presentation files are the physical candidates."
      - "Memory tool IDs, YAML/data keys, and plugin contracts remain exact while path values change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Memory command namespace naming

> Phase adjacency under the commands component parent: predecessor `004-doctor-namespace`; successor `006-scripts-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 005 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `.opencode/commands/memory/assets/` tree contains `learn_presentation.txt`, `manage_presentation.txt`, `save_presentation.txt`, and `search_presentation.txt`. The four memory command files and `README.txt` point to those underscore filenames, leaving a maintained command asset surface outside the canonical filesystem form.

### Purpose

Rename the four memory presentation assets to kebab-case and update every active pointer so learn, manage, save, and search commands load the same presentation contracts and retain their tool behavior.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `.opencode/commands/memory/assets/learn_presentation.txt`, `manage_presentation.txt`, `save_presentation.txt`, and `search_presentation.txt`, with targets `learn-presentation.txt`, `manage-presentation.txt`, `save-presentation.txt`, and `search-presentation.txt`.
- References from `learn.md`, `manage.md`, `save.md`, `search.md`, `README.txt`, asset-local content, tests, indexes, and external path consumers.
- A four-row frozen-map disposition and reference closure for the memory namespace.

### Out of Scope

- The already-compliant `README.txt`, `learn.md`, `manage.md`, `save.md`, and `search.md` filenames.
- Memory tool IDs, plugin names, YAML/data keys, frontmatter fields, generated/lockfile output, Python files/package directories, and frozen history.
- Other command namespaces and shared asset residuals owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every memory presentation asset maps once to a kebab-case target | The map lists four sources, four distinct targets, and no unknown disposition. |
| REQ-002 | Memory command presentation pointers remain resolvable | All four commands and README references point to existing targets with no active old path. |
| REQ-003 | Memory tool behavior remains equivalent | Learn, manage, save, and search presentation loading and tool dispatch retain BASE outcomes. |
| REQ-004 | Exempt content remains unchanged | Tool IDs, plugin names, YAML/data keys, frontmatter fields, Python/package names, generated output, and frozen history are preserved. |
| REQ-005 | The closure is auditable | The report records all four rows, external consumers, link results, and the path-scoped diff. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four maintained memory presentation assets use kebab-case and resolve from every active consumer.
- **SC-002**: Learn, manage, save, and search commands retain BASE presentation and tool outcomes.
- **SC-003**: No memory tool ID, key, or exemption changes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Memory command files repeat presentation paths in tables and setup instructions, and save/manage flows can carry additional path references in their assets. The mitigation is a four-row semantic map plus a path-only reference scan; the phase depends on the 005 tooling, 006 frozen map, and 000 baseline and must not alter tool IDs or data keys.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must classify every underscore occurrence as a filesystem path, tool/data key, or prose before editing it and must attach external consumers to the memory closure.
<!-- /ANCHOR:questions -->
