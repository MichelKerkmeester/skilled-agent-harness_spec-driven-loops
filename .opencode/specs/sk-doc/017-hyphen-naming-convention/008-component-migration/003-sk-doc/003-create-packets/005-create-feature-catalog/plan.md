---
title: "Implementation Plan: create-feature-catalog resource names"
description: "Execution plan for the create-feature-catalog asset and reference rename/reference closure."
trigger_phrases:
  - "create-feature-catalog resource implementation plan"
  - "feature catalog template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/005-create-feature-catalog"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored feature catalog plan"
    next_safe_action: "Inventory feature catalog path consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-feature-catalog/assets/", ".opencode/skills/sk-doc/create-feature-catalog/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-feature-catalog resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-feature-catalog/` |
| **Change class** | Three resource filename renames plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the two feature-catalog assets and the common-pitfalls reference from the actual inventory. Update packet-owned links, then separate external path values and catalog payload fields from the filesystem closure.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Three source/target rows and packet-local consumers are recorded.
- [ ] Catalog keys, IDs, and external paths are marked outside the rename map.
- [ ] Mandated files and metadata fields are marked unchanged.

### Definition of Done

- [ ] All three targets resolve and no old packet-owned path remains.
- [ ] Template discovery matches BASE.
- [ ] Catalog semantics and external path ownership are unchanged.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset closure**: rename snippet and full catalog templates.
- **Reference closure**: rename the pitfalls guidance file and its links.
- **Ownership filter**: change only paths owned by create-feature-catalog.
- **Content boundary**: leave schema keys, feature IDs, and payload values unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Inventory assets, references, and packet-local consumers.
- [ ] Freeze the three-row map and external-path disposition.

### Phase 2: Implementation

- [ ] Rename the two assets and pitfalls reference.
- [ ] Update packet-owned links and path values.

### Phase 3: Verification

- [ ] Resolve targets and search for stale old packet paths.
- [ ] Compare catalog key/ID content and external path references with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest and filesystem census |
| REQ-002 | Link resolution and old-token search |
| REQ-003 | Schema/key/ID diff review |
| REQ-004 | Path-ownership review and cross-phase report |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared links may be stale |
| Feature-catalog assets | Local resource surface | Available | Target closure cannot be proven |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Template loading fails, catalog content drifts, or an external path was changed.
- **Procedure**: Revert the component-local rename/reference commit and restore the three original paths.
<!-- /ANCHOR:rollback -->
