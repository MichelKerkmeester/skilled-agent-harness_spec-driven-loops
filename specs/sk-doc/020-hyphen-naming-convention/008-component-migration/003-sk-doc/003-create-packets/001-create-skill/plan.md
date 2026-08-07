---
title: "Implementation Plan: create-skill resource names"
description: "Execution plan for the create-skill parent-skill and skill resource rename map and reference closure."
trigger_phrases:
  - "create-skill resource implementation plan"
  - "create-skill template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/001-create-skill"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-skill plan"
    next_safe_action: "Inventory create-skill path consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-skill/assets/", ".opencode/skills/sk-doc/create-skill/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-skill resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-skill/` |
| **Change class** | Resource directory/template rename plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Use the actual `assets/` and `references/` inventory to build a semantic map for parent-skill and ordinary-skill resources. Rename directories and non-Python filenames first, then update documentation and scaffold path values, leaving tool-mandated names and Python helpers untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Parent-skill and skill resource inventories are captured.
- [ ] Every underscore-bearing non-Python path has a target or an exemption row.
- [ ] All path consumers in `SKILL.md`, README, templates, and references are identified.

### Definition of Done

- [ ] No in-scope snake_case resource path remains in create-skill.
- [ ] Every target link resolves and package tooling still sees mandated files.
- [ ] Python helpers and payload keys are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Parent-skill domain**: rename the two `parent_skill` directories, five parent templates, and two scaffold files as one closure.
- **Skill domain**: rename the seven skill template filenames and their reference links.
- **Shared reference domain**: rename packet-local common/validation references without touching shared hub scope.
- **Consumer pass**: search old directory names, full old basenames, and relative path fragments in all packet files.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture inventory, symlinks if any, and the old-to-new map.
- [ ] Mark `SKILL.md`, manifests, `.py`, and package directories as unchanged.

### Phase 2: Implementation

- [ ] Rename the two parent-skill directories, seven parent-skill asset files, seven skill asset files, and six packet-reference files.
- [ ] Update all path-valued links and generator/scaffold references.

### Phase 3: Verification

- [ ] Resolve every changed target from the packet root.
- [ ] Run package/resource discovery and inspect the diff for key/identifier changes.
- [ ] Search for stale old path tokens.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Component census and manifest parity |
| REQ-002 | Old-token search plus target link resolution |
| REQ-003 | File-type and mandated-name diff audit |
| REQ-004 | Parent/ordinary resource loading checks |
| REQ-005 | Payload key and identifier diff review |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared links may point at old names |
| create-skill scripts | Local Python helpers | Exempt | Renaming them would break imports |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scaffold resource cannot be loaded, a mandated file changes, or a stale path remains.
- **Procedure**: Revert the component-local rename/reference commit and restore the original directory and file paths.
<!-- /ANCHOR:rollback -->
