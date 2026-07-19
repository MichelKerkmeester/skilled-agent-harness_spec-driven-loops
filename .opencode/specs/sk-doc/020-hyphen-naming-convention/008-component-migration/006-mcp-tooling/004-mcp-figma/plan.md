---
title: "Implementation Plan: mcp-figma naming closure (020 phase 004)"
description: "This plan renames the Figma component's catalog, playbook, asset, reference, install-guide, and shared-helper paths through an explicit semantic map, then repairs Markdown and shell references while preserving transport and identifier semantics."
trigger_phrases:
  - "mcp-figma naming implementation plan"
  - "figma catalog helper path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/004-mcp-figma"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Figma execution plan"
    next_safe_action: "Build the complete Figma source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-figma/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-figma/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-figma/scripts/_common.sh"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-figma Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling/mcp-figma |
| **Change class** | Catalog/playbook/assets/scripts rename plus reference repair |
| **Execution** | One dependency-closed component batch from the frozen 020 map |

### Overview
The Figma component census contains 14 snake_case directories and 30 underscored files. The implementation moves the catalog, playbook, assets, references, install guide, and helper path together, with scripts/common.sh as the safe semantic target for scripts/_common.sh. It then repairs Markdown links and shell source paths while leaving shell variables and Figma identifiers unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and map hash are recorded
- [ ] The 14-directory/30-file census and collision report are attached
- [ ] All Markdown, frontmatter, and shell source consumers are inventoried
- [ ] The mcp-figma transport boundary and shell identifier exemption are recorded

### Definition of Done
- [ ] All mapped Figma paths use safe kebab-compatible targets
- [ ] Catalog/playbook/reference links and shell source paths resolve
- [ ] Figma transport and helper checks remain green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Catalog closure**: move feature-catalog, its categories, feature-catalog.md, and feature files together.
- **Playbook closure**: move manual-testing-playbook, its categories, the index, and scenario files together.
- **Support closure**: rename assets, references, install-guide, and common.sh in the same component dependency closure.
- **Identifier boundary**: preserve shell variables, Figma command names, Code Mode keys, frontmatter fields, package manifests, and the read-only transport policy.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm a clean worktree
- [ ] Produce the complete 14-directory/30-file source-to-target map
- [ ] Capture catalog/playbook discovery and shell-source inventories

### Phase 2: Implementation
- [ ] Rename feature_catalog, feature_catalog.md, and all catalog categories/files
- [ ] Rename manual_testing_playbook, its categories, index, and scenario files
- [ ] Rename env_template.md, utcp_figma_manual.md, references, and INSTALL_GUIDE.md
- [ ] Rename scripts/_common.sh to scripts/common.sh and update source commands
- [ ] Rewrite links and path-derived values without changing shell variables or transport identifiers

### Phase 3: Verification
- [ ] Confirm no in-scope underscore remains under mcp-figma
- [ ] Resolve all Markdown links and shell source paths
- [ ] Run shell syntax, Figma helper, discovery, and parent-hub checks
- [ ] Confirm the transport remains workspace read-only
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | All directories/files, leading-underscore target, and collisions | find, git ls-files, rename-map checker |
| Reference | Markdown links, path values, and source commands | rg, Markdown-link resolver, shell source scan |
| Syntax | Renamed shell helper and scripts | bash -n |
| Discovery | Catalog/playbook resources and helper binary resolution | component checks and non-zero resource scan |
| Integration | Hub layout and transport contract | parent-skill-check.cjs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 hub boundary | Internal | Required | Root Figma route references may be stale |
| Frozen 020 rename map | Internal | Required | No safe target or collision proof |
| bash | Runtime verifier | Required | Shared helper syntax cannot be proven |
| mcp-figma transport contract | Tool contract | Preserve | Workspace safety boundary could change |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Shell syntax failure, wrong helper resolution, missing catalog/playbook resource, collision, or transport-policy change.
- **Procedure**: Revert the path-scoped Figma batch, restore source commands and links, and rerun the helper and non-zero discovery checks before retrying.
<!-- /ANCHOR:rollback -->
