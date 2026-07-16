---
title: "Implementation Plan: sk-doc scripts and test fixtures"
description: "Execution plan for the file-type-aware scripts-tree rename map and its sourcing, import, registry, and fixture-reference closure."
trigger_phrases:
  - "sk-doc scripts implementation plan"
  - "scripts fixture rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/003-sk-doc/002-scripts"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored scripts plan"
    next_safe_action: "Inventory script and fixture consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/scripts/", ".opencode/skills/sk-doc/scripts/tests/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc scripts and test fixtures

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/scripts/` |
| **Change class** | Non-Python filename rename plus reference update |
| **Execution** | Isolated worktree at the pinned 032 baseline |

### Overview

Build a semantic manifest from `rg --files`, separating thirteen non-Python fixture/test renames from Python-exempt scripts and already-canonical executable names. Update every consumer of the thirteen paths and prove test discovery remains intact.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The file inventory distinguishes `.py`, `.sh`, `.js`, `.mjs`, and markdown fixtures.
- [ ] The thirteen fixture/test source/target rows and consumer search terms are recorded.
- [ ] Facade symlink names and targets are captured as exempt or reference-only paths.

### Definition of Done

- [ ] No non-Python snake_case scripts or fixtures remain in scope.
- [ ] Every changed fixture path is loaded by its tests or documented consumer.
- [ ] Python names and executable behavior are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Type-aware census**: classify by extension and package semantics before selecting a rename.
- **Fixture closure**: update direct links, basename comparisons, globs, and loader paths for the thirteen non-Python files.
- **Script stability**: leave Python names and existing hyphenated `.sh`/`.js`/`.mjs` names unchanged.
- **Reference proof**: combine static search with test discovery so dynamic fixture paths are covered.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture the scripts tree and symlink inventory.
- [ ] Freeze the thirteen-row fixture/test rename map and the Python exemption list.

### Phase 2: Implementation

- [ ] Rename the command fixture, four root fixtures, spec fixture, five validation fixtures, and two non-Python test runners.
- [ ] Update sourcing/import/registry/README/test references without changing script logic or keys.

### Phase 3: Verification

- [ ] Run fixture discovery and the scripts' relevant tests against the new paths.
- [ ] Search for stale old names and prove no non-Python candidate was missed.
- [ ] Review the diff for Python basename or package-directory changes.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest count, path search, and whole scripts-tree candidate census |
| REQ-002 | `.py` and symlink inventory diff against BASE |
| REQ-003 | `rg` consumer search plus fixture loader/test execution |
| REQ-004 | Non-Python executable name comparison and link resolution |
| REQ-005 | Test discovery count and successful fixture reads |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 convention policy and scope | Internal contract | Required | Exemption classification cannot be closed |
| scripts test fixtures and loaders | Local surface | Available | Reference closure cannot be proven |
| 001 hub/shared phase | Adjacent naming contract | Planned | Shared facade targets may be unresolved |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixture discovery count changes, a stale path remains, or a Python/symlink name changes.
- **Procedure**: Revert the path-scoped rename/reference commit, restore the thirteen original fixture/test names, and rerun the BASE inventory.
<!-- /ANCHOR:rollback -->
