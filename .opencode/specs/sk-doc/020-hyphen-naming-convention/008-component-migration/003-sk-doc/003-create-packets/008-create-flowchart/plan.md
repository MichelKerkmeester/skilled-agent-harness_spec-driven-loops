---
title: "Implementation Plan: create-flowchart resource names"
description: "Execution plan for the create-flowchart asset and reference rename/reference closure."
trigger_phrases:
  - "create-flowchart resource implementation plan"
  - "flowchart asset rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/008-create-flowchart"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-flowchart plan"
    next_safe_action: "Inventory flowchart resource consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-flowchart/assets/", ".opencode/skills/sk-doc/create-flowchart/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-flowchart resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-flowchart/` |
| **Change class** | Nine resource filename renames plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the six pattern assets, three reference files, and validator filename from the actual packet inventory, update packet-local links, and verify validator behavior and flowchart notation remain stable.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Nine source/target rows and all resource consumers are recorded.
- [ ] Validator behavior, script content, and flowchart content tokens are marked unchanged.
- [ ] Mandated files and metadata names are marked exempt.

### Definition of Done

- [ ] All ten targets resolve and old live paths are absent.
- [ ] Pattern resource discovery matches BASE.
- [ ] Validator and notation content are stable.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Pattern assets**: rename each workflow pattern file.
- **Guidance references**: rename notation, pattern-selection, and worked-example docs.
- **Consumer closure**: update packet docs and resource links.
- **Execution boundary**: rename the validator path but preserve its executable behavior and all flowchart content semantics.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture resource inventory and freeze the ten-row map.
- [ ] Record script, notation, and mandated-name exemptions.

### Phase 2: Implementation

- [ ] Rename six assets and three references.
- [ ] Update links and path values.

### Phase 3: Verification

- [ ] Resolve all pattern/guidance targets and search old names.
- [ ] Compare validator path, discovery, and notation content with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest and filesystem census |
| REQ-002 | Link resolution and old-token search |
| REQ-003 | Validator/script and content diff audit |
| REQ-004 | Mandated-name diff audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared guidance links may be stale |
| Flowchart validator | Local executable | Available | Script-path closure cannot be proven |
| 001 convention policy | Naming authority | Required | Scope cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Pattern loading or validator guidance fails, or notation content changes.
- **Procedure**: Revert the component-local rename/reference commit and restore the ten original paths.
<!-- /ANCHOR:rollback -->
