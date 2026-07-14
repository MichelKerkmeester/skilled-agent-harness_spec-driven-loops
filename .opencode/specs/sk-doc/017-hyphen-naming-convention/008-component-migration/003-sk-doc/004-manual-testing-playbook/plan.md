---
title: "Implementation Plan: sk-doc manual-testing-playbook tree"
description: "Execution plan for the root manual-testing-playbook directory, scenario filename, index, and reference closure."
trigger_phrases:
  - "sk-doc manual playbook implementation plan"
  - "manual playbook rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/004-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook plan"
    next_safe_action: "Inventory playbook links and scenario paths"
    blockers: []
    key_files: [".opencode/skills/sk-doc/manual_testing_playbook/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc manual-testing-playbook tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/manual_testing_playbook/` |
| **Change class** | Directory/file rename plus index/reference update |
| **Execution** | One root-playbook, dependency-closed batch |

### Overview

Create a complete path map for the root index, six category directories, and every scenario file. Rename the tree in dependency order, update index/category/cross-surface links, and prove scenario count and content parity.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Full directory/file census and root-index link inventory are captured.
- [ ] All category/scenario source-target rows are frozen.
- [ ] Scenario identifiers and content fields are marked outside path scope.

### Definition of Done

- [ ] No in-scope snake_case directory or file remains.
- [ ] Root index and every scenario link resolve.
- [ ] Category/scenario counts and content parity match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Root path**: rename directory and index together.
- **Category paths**: rename six directories with their scenario descendants.
- **Index closure**: update root/category links, navigation, and external sk-doc consumers.
- **Content boundary**: preserve scenario IDs, prompts, outcomes, and fields.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture tree, link, and discovery inventories.
- [ ] Freeze the complete semantic map and exemptions.

### Phase 2: Implementation

- [ ] Rename root directory/index, category directories, and scenario files.
- [ ] Update all path-valued links and consumers.

### Phase 3: Verification

- [ ] Resolve every index/scenario link and search old path tokens.
- [ ] Compare discovery counts, content hashes, and external references with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Full tree manifest and snake-case candidate census |
| REQ-002 | Link resolution and discovery-count parity |
| REQ-003 | Scenario content/ID/field diff review |
| REQ-004 | Whole-repository playbook path search |
| REQ-005 | Exemption and scope diff audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared links may be stale |
| Root playbook index | Local consumer | Available | Scenario closure cannot be proven |
| 001 convention policy | Naming authority | Required | Content/path boundary is undefined |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario link fails, counts drift, or scenario content changes unexpectedly.
- **Procedure**: Revert the root-playbook rename/reference commit and restore the original tree paths.
<!-- /ANCHOR:rollback -->
