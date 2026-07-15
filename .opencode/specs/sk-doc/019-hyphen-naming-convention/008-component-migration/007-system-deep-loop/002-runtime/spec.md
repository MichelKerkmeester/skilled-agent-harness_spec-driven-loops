---
title: "Feature Specification: system-deep-loop runtime names (017 phase 007/002)"
description: "The runtime tree has six snake_case directories and 108 underscore-bearing files across its catalog, playbook, libraries, scripts, and tests. This phase renames those in-scope names to kebab-case and updates path consumers while preserving the package workspace, tool-mandated files, database contracts, and all code/data identifiers."
trigger_phrases:
  - "system-deep-loop runtime naming"
  - "runtime kebab-case migration"
  - "deep loop runtime path repair"
  - "runtime snake_case filesystem names"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime phase spec"
    next_safe_action: "Execute the runtime rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live runtime inventory has six underscore-bearing directories and 108 underscore-bearing files."
      - "package-lock.json, tsconfig.json, vitest.config.ts, .opencode state markers, SQLite names, and other tool contracts stay exact."
      - "Runtime catalog and playbook trees move with their path consumers as one dependency-closed surface."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: System-deep-loop runtime names

> Phase adjacency under the system-deep-loop component parent: predecessor `001-hub-root-and-shared`; successor `003-deep-research`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Phase 002 of the system-deep-loop component migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The nested runtime is the shared MCP-free backend for research, review, council, and alignment. Its live tree contains snake_case roots such as `feature_catalog`, `manual_testing_playbook`, `coverage_graph`, `prompt_rendering`, `script_entry_points`, and `state_safety`, plus file names such as `atomic_state_serialize_diff.md`, `fanout_merge_research.md`, `executor_config.md`, and `coverage_graph_query.md`; those paths are referenced by scripts, tests, markdown resource indexes, and package configuration.

This phase renames every in-scope runtime filesystem name to kebab-case and repairs the full runtime path closure without changing runtimeLoopType behavior, package dependency resolution, database schema identifiers, or tool-mandated filenames.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The six live underscore-bearing directory families: `runtime/feature_catalog/`, `runtime/manual_testing_playbook/`, `coverage_graph/`, `prompt_rendering/`, `script_entry_points/`, and `state_safety/`.
- The 108 underscore-bearing runtime files across catalog leaves, README/reference material, `lib/`, `scripts/`, hooks, and tests, including `atomic_state.md`, `fanout_pool_concurrency_cap.md`, `round_state_jsonl.md`, `convergence_script.md`, and `status_script.md`.
- Path consumers in runtime `SKILL`-adjacent documentation, `references/`, `scripts/`, `lib/`, test fixtures, package workspace metadata, and relative imports or resource maps.
- Runtime package, test-discovery, symlink, and database-path evidence needed to prove the dependency closure.

### Out of Scope

- Root hub names, workflow packet trees, the root manual-testing playbook, and root benchmark storage.
- `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, `.opencode/skills/.spec-gate-state`, database filenames, and other tool- or storage-mandated names.
- Code identifiers, JSON/YAML/TOML keys, frontmatter fields, database columns/schema names, generated/lockfile output, Python `.py` files, and Python package directories.
- Changing runtime algorithms, command arguments, event names, or serialized state keys.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/feature_catalog/` | Rename/reference update | Rename the catalog root, category directories, and underscore-bearing leaf filenames. |
| `.opencode/skills/system-deep-loop/runtime/manual_testing_playbook/` | Rename/reference update | Rename the runtime playbook root, category directories, and scenario filenames. |
| `.opencode/skills/system-deep-loop/runtime/lib/`, `scripts/`, `hooks/`, `tests/` | Rename/reference update | Rename in-scope path names and repair imports, loaders, fixtures, and test references. |
| `.opencode/skills/system-deep-loop/runtime/package-lock.json`, `tsconfig.json`, `vitest.config.ts` | Reference-only | Preserve exact filenames; update path values only when the frozen map requires it. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every runtime candidate is classified exactly once | The manifest covers all six directories and 108 underscore-bearing files, with no unknown or duplicate target. |
| REQ-002 | Runtime path consumers follow the rename | Markdown links, resource maps, script imports/requires, test fixtures, package path values, and launch commands resolve to the kebab-case targets. |
| REQ-003 | The runtime package closure remains reproducible | The declared workspace, lockfile, `tsconfig.json`, test config, and dependency resolution retain their BASE semantics without renaming tool files. |
| REQ-004 | Catalog/playbook classification remains intact | Runtime catalog and playbook indexes, scenario discovery, and resource loading continue to select the same leaves after the path changes. |
| REQ-005 | Runtime behavior and data contracts do not change | Script argv/stdout/exit contracts, JSONL event keys, database schema names, and runtime loop behavior match BASE evidence. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains in `runtime/`.
- **SC-002**: Runtime imports, path-valued configuration, catalog/playbook resource resolution, and test discovery are intact.
- **SC-003**: A fresh runtime dependency and verification pass resolves inside the worktree with BASE-equivalent contracts.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The declared runtime workspace makes path mistakes expensive: a renamed directory can leave `package-lock.json`, tsconfig, launchers, or tests pointing outside the worktree. The duplicated catalog/playbook trees also require paired index updates, while underscores in event keys and TypeScript identifiers must remain untouched. The phase depends on the frozen map, the runtime package baseline, and the rename/reference checker.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The executor must record whether any runtime candidate is generated or tool-mandated before applying the map, especially for test fixtures and `.opencode` state paths.
<!-- /ANCHOR:questions -->
