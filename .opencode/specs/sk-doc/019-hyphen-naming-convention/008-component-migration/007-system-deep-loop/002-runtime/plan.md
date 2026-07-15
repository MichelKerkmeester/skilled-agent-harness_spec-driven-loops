---
title: "Implementation Plan: system-deep-loop runtime names (017 phase 007/002)"
description: "Plan for renaming runtime catalog/playbook directories and underscore-bearing runtime resources through the frozen semantic map, then repairing package, script, test, and documentation path consumers while preserving tool and data contracts."
trigger_phrases:
  - "system-deep-loop runtime implementation plan"
  - "runtime kebab-case rename plan"
  - "deep loop runtime reference closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/002-runtime"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored runtime phase plan"
    next_safe_action: "Execute the runtime rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: System-deep-loop runtime names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/runtime/` |
| **Change class** | Dependency-closed filesystem rename plus path/reference repair |
| **Execution** | Isolated worktree using the pinned BASE, runtime manifest, and frozen map |
| **Verification** | Import/path scan, package resolution, catalog/playbook discovery, tests, and mode parity |

### Overview

Move the six runtime directory families and 108 underscore-bearing files in dependency-closed batches. The runtime package workspace, scripts, libraries, tests, catalog/playbook indexes, and path-valued configuration must move together; `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, state markers, and data keys remain exact.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map contains all six directory families and 108 files with one disposition each.
- [ ] The BASE package, test-discovery, symlink, and database-path manifests are captured.
- [ ] Runtime ownership is separated from the root hub and workflow packet children.

### Definition of Done

- [ ] Runtime names and active path consumers are kebab-clean and internally resolvable.
- [ ] The declared workspace installs/resolves inside the worktree with the same package/test contract.
- [ ] Catalog/playbook discovery, scripts, tests, and runtime behavior match BASE evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Catalog/playbook pair**: move `feature_catalog/` and `manual_testing_playbook/` with their category and leaf names, indexes, and resource references as a paired closure.
- **Runtime library closure**: update `lib/`, `scripts/`, hooks, tests, references, and fixtures that resolve moved names; preserve imports and executable modes.
- **Workspace boundary**: keep `package-lock.json`, `tsconfig.json`, `vitest.config.ts`, and `.opencode` state markers at exact names while updating only path values.
- **Contract boundary**: leave event keys, schema names, database columns, argv/stdout shapes, and TypeScript/JavaScript identifiers unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the runtime map, BASE manifest, package-lock workspace data, and test-discovery baseline.
- [ ] Capture all runtime path references, including dynamic `path.join`/loader sites, symlinks, and fixtures.

### Phase 2: Core Implementation

- [ ] Rename `feature_catalog`, `manual_testing_playbook`, `coverage_graph`, `prompt_rendering`, `script_entry_points`, and `state_safety` through the semantic map.
- [ ] Rename the 108 in-scope files and update runtime README/reference paths, scripts, libraries, hooks, tests, and index links.
- [ ] Preserve exact tool names and classify database, generated, state, and identifier/key exceptions.

### Phase 3: Verification

- [ ] Resolve every old path reference and every new module/resource path.
- [ ] Rebuild or install the runtime workspace inside the worktree and compare `realpath`/package results.
- [ ] Run runtime unit/integration tests, catalog/playbook discovery, and test-count parity checks.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Rename-map scan reports six directories and 108 files exactly once, with collision checks. |
| Reference integrity | Resolve Markdown links, resource maps, CJS/TS imports, script paths, fixtures, and package path values. |
| Workspace parity | Install/resolve from the isolated worktree; compare workspace roots and package/test discovery with BASE. |
| Runtime behavior | Run unit/integration tests and script contract checks with non-zero discovery. |
| Exemption safety | Confirm exact tool names, state/database names, identifiers, keys, Python boundaries, and generated output were not renamed. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Frozen rename/reference tooling | Internal | Manual path edits would violate the semantic-map contract. |
| BASE runtime install and discovery manifest | Internal | Package and test parity cannot be demonstrated. |
| Phase 001 hub/shared boundary | Sibling | Runtime-only scope and shared route ownership would be ambiguous. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Collision, broken import/resource path, workspace escape, package/test discovery drift, or changed serialized contract.
- **Procedure**: Stop the current dependency-closed batch; revert only that runtime path/reference commit, restore the BASE manifest, and rerun the pre-change resolver before retrying.
<!-- /ANCHOR:rollback -->
