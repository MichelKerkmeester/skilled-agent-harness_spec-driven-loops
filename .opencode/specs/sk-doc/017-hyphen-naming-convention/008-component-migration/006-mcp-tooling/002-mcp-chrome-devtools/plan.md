---
title: "Implementation Plan: mcp-chrome-devtools naming closure (017 phase 002)"
description: "This plan renames the Chrome DevTools component's underscored playbook, scenario, reference, and install-guide paths using an explicit map, then repairs links and path-derived metadata while preserving identifiers and tool contracts."
trigger_phrases:
  - "mcp-chrome-devtools naming implementation plan"
  - "chrome devtools playbook path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/002-mcp-chrome-devtools"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the Chrome DevTools execution plan"
    next_safe_action: "Build the component rename map from the current path census"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-chrome-devtools/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-chrome-devtools Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling/mcp-chrome-devtools |
| **Change class** | Filesystem rename plus Markdown/frontmatter path repair |
| **Execution** | Dependency-closed component batch from the frozen 017 map |

### Overview
The packet's 8 snake_case directories and 28 underscored files are concentrated in its manual-testing-playbook and references trees, with INSTALL_GUIDE.md as the top-level documentation exception. The implementation renames those paths in one component closure, then updates every path reference and path-derived category value. Tool names, identifiers, and frontmatter keys remain untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and map hash are recorded
- [ ] The complete 8-directory/28-file component census is attached
- [ ] The target for INSTALL_GUIDE.md is fixed as install-guide.md
- [ ] Component-local references and path-derived frontmatter values are inventoried

### Definition of Done
- [ ] All mapped Chrome paths use kebab-case
- [ ] Markdown links and path-derived values resolve
- [ ] The scenario inventory and parent-hub invariants remain green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Directory closure**: rename manual-testing-playbook, its seven category directories, and every scenario file as one dependency-closed documentation batch.
- **Reference closure**: update index tables, relative links, reference tables, root-relative links, and frontmatter category values after the path move.
- **Contract boundary**: preserve SKILL.md, README.md, CLI names, CDP names, scenario IDs, and frontmatter field names.
- **Verification boundary**: require a non-zero scenario discovery result and a clean path/link scan before handoff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm the worktree is clean
- [ ] Generate the explicit source-to-target map for all 8 directories and 28 files
- [ ] Inventory references in SKILL.md, README.md, the playbook index, scenario docs, and references

### Phase 2: Implementation
- [ ] Rename INSTALL_GUIDE.md to install-guide.md
- [ ] Rename manual_testing_playbook and each category/file to its map target
- [ ] Rename cdp_patterns.md and session_management.md
- [ ] Rewrite links and path-derived frontmatter values without changing fields or identifiers

### Phase 3: Verification
- [ ] Confirm no in-scope underscore remains in the component path
- [ ] Resolve all Markdown links and path tables
- [ ] Run Chrome scenario discovery and parent-hub checks
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | Every component directory/file candidate and target collision | find, git ls-files, rename-map checker |
| Reference | Relative links, path tables, frontmatter category values | rg, Markdown-link resolver, YAML parser |
| Scenario | Manual-testing playbook index and scenario discovery | component playbook checks |
| Integration | Hub routing and layout invariants | parent-skill-check.cjs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 hub boundary | Internal | Required | Root route references may be stale |
| Frozen 017 rename map | Internal | Required | No safe rename targets |
| Markdown/link resolver | Internal | Required | Broken playbook navigation can escape review |
| Chrome scenario inventory | Internal | Required | Silent scenario loss |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Collision, missing scenario, broken link, changed identifier, or failed parent-hub check.
- **Procedure**: Revert the path-scoped Chrome commit, restore the previous map and references, and rerun the non-zero scenario census before retrying.
<!-- /ANCHOR:rollback -->
