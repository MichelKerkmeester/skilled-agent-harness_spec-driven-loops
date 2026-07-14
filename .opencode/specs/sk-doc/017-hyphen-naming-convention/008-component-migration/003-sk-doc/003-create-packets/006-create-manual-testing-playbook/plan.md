---
title: "Implementation Plan: create-manual-testing-playbook resource names"
description: "Execution plan for the create-manual-testing-playbook asset and reference rename/reference closure."
trigger_phrases:
  - "create playbook resource implementation plan"
  - "manual testing template rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/006-create-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-playbook plan"
    next_safe_action: "Inventory playbook resource consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-manual-testing-playbook/assets/", ".opencode/skills/sk-doc/create-manual-testing-playbook/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-manual-testing-playbook resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-manual-testing-playbook/` |
| **Change class** | Four resource filename renames plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the two playbook assets and two references from the actual inventory. Update packet-owned links while retaining playbook schema, scenario IDs, prompt content, and the root playbook phase boundary.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Four source/target rows and packet-local consumers are recorded.
- [ ] Root playbook paths and content identifiers are marked outside scope.
- [ ] Mandated files and fields are marked unchanged.

### Definition of Done

- [ ] All four targets resolve and old packet-local paths are absent.
- [ ] Resource discovery and template links match BASE.
- [ ] Playbook semantics have no accidental changes.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Assets**: rename snippet and full playbook templates.
- **References**: rename pitfalls and prompt-voice guidance.
- **Boundary**: keep root playbook directory and scenario content in phase 004.
- **Consumer closure**: update packet docs and path-valued resource links.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Inventory packet resources and path consumers.
- [ ] Freeze four-row map and root-playbook dispositions.

### Phase 2: Implementation

- [ ] Rename the two assets and two references.
- [ ] Update packet-owned path values and links.

### Phase 3: Verification

- [ ] Resolve every target and search for stale old packet paths.
- [ ] Compare playbook content and resource discovery with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest and filesystem census |
| REQ-002 | Link resolution and old-token search |
| REQ-003 | Content/field/ID diff review |
| REQ-004 | Path ownership and root-playbook diff audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared guidance links may be stale |
| Root playbook phase 004 | Adjacent surface | Planned | Root references need handoff evidence |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Packet resource loading fails or root/content scope is crossed.
- **Procedure**: Revert the component-local rename/reference commit and restore the four original paths.
<!-- /ANCHOR:rollback -->
