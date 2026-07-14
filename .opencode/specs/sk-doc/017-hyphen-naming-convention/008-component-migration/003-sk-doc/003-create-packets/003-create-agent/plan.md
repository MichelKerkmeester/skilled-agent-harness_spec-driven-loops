---
title: "Implementation Plan: create-agent resource names"
description: "Execution plan for the create-agent template and guidance resource rename/reference closure."
trigger_phrases:
  - "create-agent resource implementation plan"
  - "agent template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/003-create-agent"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-agent plan"
    next_safe_action: "Inventory create-agent consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-agent/assets/", ".opencode/skills/sk-doc/create-agent/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-agent resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-agent/` |
| **Change class** | Three resource filename renames plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the asset template and two guidance files from the actual packet inventory, then update all packet-local links and routing/resource path values. Keep permission content, mandated files, and already-canonical names stable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The three source/target rows and all consumers are recorded.
- [ ] Agent permission fields and identifiers are marked content, not path scope.
- [ ] Existing hyphenated resources are recorded as unchanged.

### Definition of Done

- [ ] All three targets exist and no old live path remains.
- [ ] Agent scaffold/reference loading is unchanged.
- [ ] Permission and content fields have no accidental edits.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Template path**: rename the asset file and all scaffold links.
- **Guidance paths**: rename pitfalls and permission-design references together.
- **Router closure**: inspect packet-local resource maps and routed loading.
- **Content boundary**: preserve agent permission values and frontmatter fields.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture the packet resource census and consumer search terms.
- [ ] Freeze the three-row semantic map and exempt names.

### Phase 2: Implementation

- [ ] Rename the asset and two reference files.
- [ ] Update links, route resources, and packet-local path values.

### Phase 3: Verification

- [ ] Resolve all targets and search for stale old names.
- [ ] Compare permission/frontmatter content and resource discovery with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest and filesystem census |
| REQ-002 | Link/resource resolution and old-token search |
| REQ-003 | Permission/frontmatter diff review |
| REQ-004 | Existing hyphenated resource comparison |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared HVR links may be stale |
| create-agent packet router | Local consumer | Available | Routed resource closure cannot be proven |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Agent resource loading or permission-content comparison fails.
- **Procedure**: Revert the component-local rename/reference commit and restore the three original paths.
<!-- /ANCHOR:rollback -->
