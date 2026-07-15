---
title: "Implementation Plan: create-benchmark resource names"
description: "Execution plan for the create-benchmark taxonomy, fixture, profile, and guide rename/reference closure."
trigger_phrases:
  - "create-benchmark resource implementation plan"
  - "benchmark fixture rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/003-sk-doc/003-create-packets/007-create-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create-benchmark plan"
    next_safe_action: "Inventory benchmark resource consumers"
    blockers: []
    key_files: [".opencode/skills/sk-doc/create-benchmark/assets/", ".opencode/skills/sk-doc/create-benchmark/references/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: create-benchmark resource names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/create-benchmark/` |
| **Change class** | Taxonomy directory/file rename plus path-reference update |
| **Execution** | One component-local, dependency-closed batch |

### Overview

Rename the actual behavior/model/skill benchmark directories and all listed fixture, profile, guide, shared-asset, and shared-reference files. Update the full packet-local reference graph, while leaving Python names and benchmark payload fields unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Asset and reference taxonomy inventories are captured.
- [ ] Every underscore-bearing path has a target or explicit exemption.
- [ ] Cross-domain links and generated path producers are identified.

### Definition of Done

- [ ] No in-scope snake_case benchmark path remains.
- [ ] All taxonomy, fixture, profile, and guide links resolve.
- [ ] Shared-asset content and benchmark payloads are stable.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset taxonomy**: rename behavior, model, and skill benchmark directories and their templates.
- **Reference taxonomy**: rename five guide domains and their nested files.
- **Shared assets/references**: rename the two shared asset templates, case studies, and worked example.
- **Graph closure**: update direct links, indexes, globs, and path-producing guidance across the packet.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture the full asset/reference census and freeze the semantic map.
- [ ] Record tool-mandated, Python, and payload-field exemptions.

### Phase 2: Implementation

- [ ] Rename taxonomy directories and all listed underscore-bearing files.
- [ ] Update packet-local links and generated/path-valued references.

### Phase 3: Verification

- [ ] Resolve every benchmark resource and search for stale old taxonomy tokens.
- [ ] Compare discovery counts, shared assets, and payload contracts with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Full manifest and filesystem census |
| REQ-002 | Cross-domain link resolution and old-token search |
| REQ-003 | Shared asset target and diff audit |
| REQ-004 | Fixture/profile/schema content comparison |
| REQ-005 | Python path exemption audit |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared phase | Sibling path contract | Planned | Shared guide links may be stale |
| create-benchmark packet resources | Local surface | Available | Rename closure cannot be built |
| 001 convention policy | Naming authority | Required | Exemptions cannot be classified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A benchmark resource is unreachable, a shared asset drifts, or payload content changes.
- **Procedure**: Revert the component-local rename/reference commit and restore the original taxonomy and filenames.
<!-- /ANCHOR:rollback -->
