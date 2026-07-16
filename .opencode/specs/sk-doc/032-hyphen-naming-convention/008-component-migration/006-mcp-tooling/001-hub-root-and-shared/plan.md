---
title: "Implementation Plan: mcp-tooling hub root and shared naming closure (032 phase 001)"
description: "This plan classifies the mcp-tooling root and any real shared support paths, applies the 032 exemption boundary, and updates hub navigation path values without changing routing keys or tool-mandated filenames."
trigger_phrases:
  - "mcp-tooling hub root implementation plan"
  - "mcp-tooling shared path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the root/shared execution plan"
    next_safe_action: "Run the scoped census before any path rename"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/hub-router.json"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-tooling Hub Root and Shared Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling root and any physical shared/ support tree |
| **Change class** | Filesystem rename plus path-value reference repair |
| **Execution** | Frozen 032 rename map in the isolated migration worktree |

### Overview
The root hub owns routing and navigation, but the current baseline has no shared/ directory. The implementation first proves the physical boundary, then applies only the root/shared map and repairs path values in the hub documents and router metadata. The manual-testing-playbook, benchmark, and component trees remain with their assigned child phases.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and the 032 rename-map hash are recorded
- [ ] Root/shared census is complete and the absent shared/ directory is recorded
- [ ] Path owners for manual-testing-playbook, benchmark, and all three components are excluded
- [ ] Tool-mandated filenames and JSON field/key boundaries are listed

### Definition of Done
- [ ] Every root/shared candidate is classified and renamed or explicitly exempted
- [ ] Root path references resolve against the canonical child names
- [ ] Parent-hub routing and link checks pass with no unexpected tracked mutation
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Census boundary**: inspect only the hub root and any physical shared/ directory; record delegated child roots separately.
- **Semantic map**: map each source path to one explicit target or exemption class; do not replace underscores mechanically.
- **Reference closure**: update Markdown links and path-valued JSON metadata while leaving routing keys and identifiers untouched.
- **Contract preservation**: keep SKILL.md and mode-registry.json exact and verify the hub's route registry after the rename.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm the candidate worktree is clean
- [ ] Census root siblings and confirm no physical shared/ directory exists at the baseline
- [ ] Load the frozen map and mark delegated child roots as out of scope

### Phase 2: Implementation
- [ ] Rename any mapped root/shared filesystem names to their semantic kebab targets
- [ ] Update root SKILL.md and README.md navigation paths
- [ ] Update path-valued router/registry metadata without changing JSON keys or mode identifiers

### Phase 3: Verification
- [ ] Scan root/shared paths for remaining in-scope underscores
- [ ] Resolve every root route resource and Markdown path
- [ ] Run the parent-hub invariant check and confirm no unexpected tracked mutation
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | Root/shared candidate classification and delegated-root exclusions | find, git ls-files, frozen-map report |
| Reference | Hub Markdown links and path-valued JSON resources | rg, JSON parser, path resolver |
| Integration | Router/registry contract and hub layout | node .opencode/commands/doctor/scripts/parent-skill-check.cjs |
| Negative | Exact tool names, keys, and identifiers remain unchanged | targeted diff and exemption scan |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 frozen rename map | Internal | Required | No safe source-to-target operation |
| 032 exemption policy | Internal | Required | Risk of renaming tool contracts or identifiers |
| Phases 002-006 ownership boundaries | Internal | Required | Root phase can move another phase's files |
| parent-skill-check.cjs | Internal verifier | Required | Hub routing cannot be proven |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, cross-phase path discovery, changed routing key, or failed hub invariant.
- **Procedure**: Stop before the next rename batch, restore the path-scoped root/shared commit with git revert, and rerun the census. No delegated child surface is repaired from this phase.
<!-- /ANCHOR:rollback -->
