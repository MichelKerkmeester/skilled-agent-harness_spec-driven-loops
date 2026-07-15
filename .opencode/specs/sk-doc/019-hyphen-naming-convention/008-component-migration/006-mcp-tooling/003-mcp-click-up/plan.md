---
title: "Implementation Plan: mcp-click-up naming closure (017 phase 003)"
description: "This plan migrates the ClickUp component's catalog, playbook, reference, and index paths through a complete semantic map, then repairs links and path-derived values without changing cupt, MCP, package, or data identifiers."
trigger_phrases:
  - "mcp-click-up naming implementation plan"
  - "clickup catalog path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/006-mcp-tooling/003-mcp-click-up"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the ClickUp execution plan"
    next_safe_action: "Build the complete ClickUp source-to-target map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/mcp-click-up/feature_catalog/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/mcp-click-up/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-click-up Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling/mcp-click-up |
| **Change class** | Catalog/playbook filesystem rename plus reference-graph repair |
| **Execution** | One dependency-closed component batch from the frozen 017 map |

### Overview
The ClickUp component census contains 26 snake_case directories and 137 underscored files, including both catalog and manual-playbook roots. The implementation moves the roots, category directories, indexes, scenario files, and references together, then rewrites the full local link graph. The package/server layout and ClickUp vocabulary remain unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and map hash are recorded
- [ ] The 26-directory/137-file census and collision report are attached
- [ ] Catalog, playbook, reference, example, and frontmatter consumers are inventoried
- [ ] Package manifests and mcp-servers directories are marked preserved

### Definition of Done
- [ ] All mapped ClickUp paths use kebab-case
- [ ] Catalog-to-playbook links and indexes resolve with non-zero discovery
- [ ] cupt/MCP routing and package layout checks remain green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Catalog closure**: move feature-catalog, its categories, FEATURE_CATALOG.md, and all feature files together.
- **Playbook closure**: move manual-testing-playbook, its categories, the root index, and all scenarios together.
- **Reference closure**: update SKILL.md, README.md, examples, scripts, reference docs, catalog links, playbook links, and path-derived values.
- **Semantic boundary**: keep cupt tokens, MCP operation names, JSON/YAML/TOML keys, frontmatter fields, package manifests, and Python exemptions unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm a clean worktree
- [ ] Produce the complete 26-directory/137-file source-to-target map
- [ ] Capture catalog and playbook discovery counts before the move

### Phase 2: Implementation
- [ ] Rename feature_catalog and FEATURE_CATALOG.md to feature-catalog and feature-catalog.md
- [ ] Rename all catalog categories and files to semantic kebab targets
- [ ] Rename manual_testing_playbook, its categories, index, and scenarios
- [ ] Rename cupt_commands.md, install_guide.md, mcp_tools.md, and other underscored references
- [ ] Rewrite all links and path-derived category values

### Phase 3: Verification
- [ ] Confirm no in-scope underscore remains under mcp-click-up
- [ ] Resolve the catalog/playbook/reference link graph
- [ ] Compare non-zero catalog and scenario discovery counts with the pre-rename baseline
- [ ] Verify package/server paths and ClickUp identifiers are unchanged
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | All directories/files and target collisions | find, git ls-files, rename-map checker |
| Link graph | Catalog, playbook, README, SKILL, examples, scripts, and references | rg, Markdown-link resolver |
| Metadata | Category values versus frontmatter fields and data keys | YAML/JSON parser and focused diff |
| Discovery | Catalog and manual scenario inventories | component loaders and playbook checks |
| Integration | Package/server layout and hub navigation | parent-skill-check.cjs |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 hub boundary | Internal | Required | Root references may not follow the component path |
| Frozen 017 rename map | Internal | Required | No safe target or collision proof |
| Catalog/playbook discovery tools | Internal | Required | Silent feature/scenario loss |
| ClickUp package/server manifests | Tool contract | Preserve | Install and MCP layout could break |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any missing catalog entry, broken scenario, target collision, package-layout change, or changed identifier.
- **Procedure**: Revert the path-scoped ClickUp batch, restore the prior links and map, and rerun both pre-rename discovery counts before retrying.
<!-- /ANCHOR:rollback -->
