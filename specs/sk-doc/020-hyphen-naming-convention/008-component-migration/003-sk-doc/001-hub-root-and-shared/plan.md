---
title: "Implementation Plan: sk-doc hub root and shared backbone"
description: "Execution plan for the sk-doc hub/shared kebab-case rename map, including facade-link preservation and path-reference closure."
trigger_phrases:
  - "sk-doc hub shared implementation plan"
  - "shared backbone rename plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/003-sk-doc/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared plan"
    next_safe_action: "Build the shared rename manifest"
    blockers: []
    key_files: [".opencode/skills/sk-doc/shared/", ".opencode/skills/sk-doc/scripts/"]
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-doc hub root and shared backbone

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-doc/shared/` and root facade references |
| **Change class** | Filesystem rename plus path-reference update |
| **Execution** | Isolated worktree at the pinned 020 baseline |

### Overview

Inventory the actual shared tree, classify every underscore-bearing path against the 001 exemption set, apply only the eleven non-exempt name changes, and update consumers as one dependency-closed batch. Keep symlink paths, Python names, metadata names, and tool-mandated names unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The baseline inventory includes shared assets, references, scripts, and root facade links.
- [ ] The rename map lists the five asset names, five reference names, and `skill_contract.cjs` target.
- [ ] All Python and tool-mandated paths are explicitly classified as exempt.
- [ ] Consumers and symlink targets are identified before any rename.

### Definition of Done

- [ ] Every changed path resolves and no old shared path remains in live consumers.
- [ ] Symlink target and executable-mode parity are proven.
- [ ] The phase checklist has evidence for collision, reference, and exemption checks.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Rename manifest**: semantic source-to-target rows for shared assets, references, and the CommonJS script.
- **Reference closure**: static search across `SKILL.md`, READMEs, packet resources, and registries, plus review of dynamic path joins.
- **Facade preservation**: root `scripts/` links remain links; only moved targets and path-valued references change.
- **Exemption filter**: Python `.py`, Python package directories, mandated names, keys, and identifiers are never passed to the rename step.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Capture the shared-tree census, symlink target/mode inventory, and baseline reference search.
- [ ] Pin the rename manifest and classify every underscore-bearing candidate.

### Phase 2: Implementation

- [ ] Rename `changelog_template.md`, `frontmatter_templates.md`, `llmstxt_templates.md`, `skill_contract.json`, and `template_rules.json`.
- [ ] Rename `core_standards.md`, `evergreen_packet_id_rule.md`, `frontmatter_versioning.md`, `hvr_rules.md`, `quick_reference.md`, and `skill_contract.cjs`.
- [ ] Update only path-valued consumers and preserve facade links.

### Phase 3: Verification

- [ ] Re-run the candidate census and prove no unclassified shared name remains.
- [ ] Resolve every changed path from the hub, shared README, and packet consumers.
- [ ] Compare symlink targets, modes, and executable behavior with the baseline.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Manifest-to-filesystem count parity and collision checks |
| REQ-002 | Exemption report for `.py`, package directories, mandated names, and metadata |
| REQ-003 | Whole-repository search for each old shared path and target resolution checks |
| REQ-004 | `find -type l`, `readlink`, mode comparison, and representative facade invocation |
| REQ-005 | Diff review of keys, identifiers, and frontmatter fields |
| REQ-006 | Link/resource load checks for the hub and every create-* packet |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 convention policy and scope | Internal contract | Required | Rename boundary is undefined |
| `shared/` and root `scripts/` tree | Local surface | Available | No safe manifest can be built |
| Later create-* phases | Downstream consumers | Pending | Their specs must use the final shared paths |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A collision, unresolved consumer, broken symlink, mode drift, or exemption leak appears.
- **Procedure**: Revert the path-scoped rename/reference commit, restore the original relative symlink targets, and rerun the baseline census before resuming.
<!-- /ANCHOR:rollback -->
