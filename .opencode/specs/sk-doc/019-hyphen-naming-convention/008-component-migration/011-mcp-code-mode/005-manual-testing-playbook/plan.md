---
title: "Implementation Plan: mcp-code-mode manual-testing playbook (017 component 011 phase 005)"
description: "Rename the complete manual_testing_playbook tree through an explicit root, category, index, and scenario map. Rewrite active Markdown links and path pointers, then prove the 27-scenario inventory and scenario semantics are preserved."
trigger_phrases:
  - "mcp-code-mode manual playbook implementation plan"
  - "mcp-code-mode phase 005 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual-playbook plan"
    next_safe_action: "Inventory category and scenario paths"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-code-mode manual-testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | mcp-code-mode/manual_testing_playbook and its active consumers |
| **Change class** | Root, directory, Markdown filename, and link closure |
| **Execution** | Isolated worktree pinned to BASE; dependency-closed manual-tree batch |

### Overview
The observed tree has one snake_case root, eight snake_case category directories, one snake_case index filename, and 27
snake_case scenario filenames. The plan freezes that complete map, applies it as one playbook closure, and compares the
final scenario inventory and scenario IDs to the baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The root, eight categories, index, and 27 scenario files are enumerated from BASE
- [ ] Active links and path consumers are inventoried
- [ ] Scenario IDs and expected file counts are captured for parity

### Definition of Done
- [ ] Every in-scope playbook filesystem name is kebab-case
- [ ] Active Markdown links and path pointers resolve with no stale old-tree path
- [ ] Scenario count, IDs, and content parity are proven
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

| Current category | Target category | Scenarios |
|------------------|-----------------|-----------|
| clickup_and_chrome_via_cm | clickup-and-chrome-via-cm | 3 |
| core_tools | core-tools | 4 |
| env_var_prefixing | env-var-prefixing | 3 |
| manual_namespace_contract | manual-namespace-contract | 3 |
| multi_tool_workflows | multi-tool-workflows | 3 |
| plugins_and_hooks | plugins-and-hooks | 1 |
| recovery_and_config | recovery-and-config | 6 |
| third_party_via_cm | third-party-via-cm | 4 |

The root and index become manual-testing-playbook/manual-testing-playbook.md. The link closure includes the skill guide,
README, active references, scripts, scenario cross-references, and any external active consumer found by the map-driven
scan; frozen changelog mentions receive a frozen disposition.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the root, category, index, and scenario map and record scenario IDs/content hashes.
- Inventory every active link, table pointer, and path value that names the old tree.

### Phase 2: Implementation
- Rename the root and index, then rename the eight category directories.
- Rename the 27 scenario files in category batches.
- Rewrite active links and path values in the index, scenarios, guides, scripts, and consumers.

### Phase 3: Verification
- Resolve all Markdown links and scan for stale old-tree paths.
- Compare category counts, scenario IDs, and content hashes against BASE.
- Verify that only filesystem paths changed and that exemptions/frozen history were preserved.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Root/category map and final tree census contain one root and eight final category directories |
| REQ-002 | Final tree has 27 scenario files with every listed source mapped to a target |
| REQ-003 | Index and category/scenario links resolve under manual-testing-playbook |
| REQ-004 | Whole-surface stale-path scan reports no active old root, category, or scenario path |
| REQ-005 | Scenario IDs, objectives, prompts, expected signals, and content hashes match BASE |
| REQ-006 | Diff/disposition ledger proves exemptions and frozen history were not changed |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on the prior four component closures and the semantic rename/reference tooling. The playbook's
references to runtime, scripts, and references/assets consume their final paths but do not move those files here.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Reverse the recorded root, category, index, and scenario map and restore active links in one path-scoped revert. Use
the baseline scenario inventory to confirm rollback restored all 27 files and their original relative paths.
<!-- /ANCHOR:rollback -->
