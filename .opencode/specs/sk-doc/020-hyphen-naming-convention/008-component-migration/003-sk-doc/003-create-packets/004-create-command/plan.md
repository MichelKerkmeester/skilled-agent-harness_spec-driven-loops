---
title: "Implementation Plan: create-command resource names"
description: "Execution plan for the create-command template and routing-reference rename/reference closure."
trigger_phrases:
  - "create-command resource implementation plan"
  - "command template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/004-create-command"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-command plan"
    next_safe_action: "Inventory command resource consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-command/assets/", ".opencode/skills/sk-doc/create-command/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-command resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-command/` |
| **Change class** | Seven resource filename renames plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the three command assets and four guidance references from the actual packet inventory. Update all links and resource values, then prove that router/presentation and argument-hint materials still resolve with unchanged command semantics.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Seven source/target rows and all path consumers are recorded.
- [ ] Router/presentation and argument-hint fields are distinguished from filesystem paths.
- [ ] Mandated files and metadata keys are marked unchanged.

### Definition of Done

- [ ] All seven targets resolve and no old live path remains.
- [ ] Command resource discovery and template structure match BASE.
- [ ] Argument/router content has no accidental semantic change.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Assets**: rename command, router, and presentation templates.
- **References**: rename argument/mode, pitfalls, router split, and worked-example resources.
- **Consumer closure**: update packet docs and every relative resource link.
- **Semantic boundary**: preserve command names, argument hints, modes, and metadata fields.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture inventory and freeze the seven-row map.
- [ ] Search path consumers and record command-content exemptions.

### Phase 2: Implementation

- [ ] Rename the three assets and four references.
- [ ] Update SKILL, README, template, and reference path values.

### Phase 3: Verification

- [ ] Resolve every target and search for stale old names.
- [ ] Compare router/presentation and argument-hint structure with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest and filesystem census |
| REQ-002 | Link resolution and old-token search |
| REQ-003 | Command-template/content diff review |
| REQ-004 | Mandated-name/key/field diff audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared guidance links may be stale |
| create-command templates | Local resource surface | Available | Resource closure cannot be proven |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A command resource cannot be loaded or a command-content diff changes semantics.
- **Procedure**: Revert the component-local rename/reference commit and restore the seven original paths.
<!-- /ANCHOR:rollback -->
