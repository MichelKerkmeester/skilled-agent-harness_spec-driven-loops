---
title: "Feature Specification: sk-git references (017 phase 008/012/001)"
description: "The sk-git reference surface has a historical underscore-to-hyphen rename map and stale path pointers. This phase closes the reference-file rename and link graph while preserving the program's filesystem-only scope and exemption boundary."
trigger_phrases:
  - "sk-git references kebab-case"
  - "017 sk-git reference rename"
  - "reference pointer closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/001-references"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the references phase from the sk-git path history and live pointer inventory"
    next_safe_action: "Execute the references rename map and pointer closure on the pinned worktree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
      - ".opencode/skills/sk-git/references/"
      - ".opencode/skills/sk-git/assets/worktree-checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-git references

> Phase adjacency under the sk-git component parent: predecessor 008-component-migration/011-mcp-code-mode; successor 002-assets. The siblings are independently scoped; the adjacency is an execution ordering hint for the component rollup.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/012-sk-git/001-references |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-git |
| **Origin** | Phase 001 of the sk-git component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The reference surface's source history contains nine snake_case filenames: commit_workflows.md, continuous_integration.md, finish_workflows.md, github_mcp_integration.md, gitkraken_mcp_integration.md, large_reorg_playbook.md, quick_reference.md, shared_patterns.md, and worktree_workflows.md. The live checkout already contains their hyphenated targets from a prior pre-adoption change, but active SKILL.md and asset pointers still expose several source spellings. The execution phase must therefore use a semantic source-to-target map and close the entire pointer graph, recording already-compliant targets as such when the pinned baseline contains them.

The purpose is to leave sk-git/references/ addressable only through kebab-case filesystem paths, with every active link, router entry, table entry, and path-valued pointer updated in the same dependency-closed change. The phase does not alter code identifiers, data keys, frontmatter fields, or prose that is not a path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the following semantic map when the source names are present: commit_workflows.md -> commit-workflows.md; continuous_integration.md -> continuous-integration.md; finish_workflows.md -> finish-workflows.md; github_mcp_integration.md -> github-mcp-integration.md; gitkraken_mcp_integration.md -> gitkraken-mcp-integration.md; large_reorg_playbook.md -> large-reorg-playbook.md; quick_reference.md -> quick-reference.md; shared_patterns.md -> shared-patterns.md; worktree_workflows.md -> worktree-workflows.md.
- Update path references in SKILL.md, README.md, the reference files, and any tracked sk-git consumer that points at these files, including the asset checklist's reference links.
- Preserve file contents, executable or symlink modes if encountered, Git rename history, and the reference document's frontmatter fields and values except for path-valued references.
- Record an explicit no-op disposition for a source name that is absent because its target already exists at the pinned baseline; do not silently omit it from the map.

### Out of Scope
- Files under assets/, manual-testing-playbook/, benchmark/, or changelog/; their child phases own those surfaces.
- Feature-catalog paths, code or shell identifiers, JSON/YAML/TOML keys, frontmatter field names, Python .py names, Python package directories, and tool-mandated names.
- Executing this rename during authoring; this document describes the later migration phase only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-git/references/*.md | Rename/Modify | Apply the nine-entry source-to-target map and repair internal links. |
| .opencode/skills/sk-git/SKILL.md | Modify | Replace reference path pointers and router/resource table paths. |
| .opencode/skills/sk-git/README.md | Modify | Replace reference path pointers and verification commands. |
| .opencode/skills/sk-git/assets/worktree-checklist.md | Modify | Repair links into references/. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every observed reference source name has exactly one semantic target or an explicit baseline no-op disposition. | The phase map and candidate report enumerate all nine source names with no unknown or duplicate target. |
| REQ-002 | Reference files and their active consumers use kebab-case filesystem paths. | The rename/reference checker finds zero active pointers to the underscore source paths and every target resolves. |
| REQ-003 | The rename preserves content and filesystem metadata while changing only path names and path-valued references. | Git reports rename status for each applicable file; mode, symlink, frontmatter fields, keys, and non-path values are unchanged. |
| REQ-004 | The phase stays within the sk-git reference surface. | The candidate diff contains no asset, manual-playbook, benchmark, changelog, code, or sibling-surface rename. |
| REQ-005 | The phase remains compatible with the 017 exemption boundary. | .py, Python package directories, tool-mandated names, keys, and frozen content are explicitly excluded from the candidate map. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine reference entries are either renamed to their hyphenated targets or evidenced as already compliant at BASE.
- **SC-002**: All active sk-git links, router paths, tables, and commands resolve through kebab-case reference filenames.
- **SC-003**: The diff is path-scoped and does not alter exempt names, identifiers, keys, or frontmatter fields.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The phase depends on the 017 frozen rename map and the reference-checking tooling from phase 005. Its main risks are stale pointers hidden in router prose or asset links, a duplicate source and target path, and accidental edits to non-path text. The checklist requires a zero-broken-pointer scan, collision check, and path-scoped diff review.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The only baseline variance is handled by the explicit rename-or-no-op disposition required in REQ-001.
<!-- /ANCHOR:questions -->
