---
title: "Implementation Plan: system-code-graph manual testing playbook"
description: "Rename the manual-testing-playbook root, nine categories, and 29 files with a bijective path map, then repair playbook and cross-surface links while keeping scenario content and coverage stable."
trigger_phrases:
  - "system-code-graph manual testing playbook implementation plan"
  - "code graph manual-playbook path closure"
  - "manual scenario rename map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored playbook implementation plan"
    next_safe_action: "Freeze 29-file scenario map and cross-links"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/manual_testing_playbook"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-code-graph/feature_catalog"
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current playbook contains nine snake_case category directories and 29 files including the root index."
      - "Scenario identity and content stay unchanged; only filesystem path segments and their references are rewritten."
---

# Implementation Plan: system-code-graph manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown manual-test scenarios, sk-doc routing metadata, path-aware validators |
| **Framework** | Manual-playbook index, scenario links, catalog/reference pointers, and evidence contracts |
| **Storage** | Version-controlled 29-file Markdown tree and derived metadata |
| **Testing** | Inventory/map check, link scan, scenario identity parity, coverage and content comparison |

### Overview
Use a bijective map for the manual-testing-playbook root, root index, nine category directories, and 28 scenario
files. Update only filesystem path contexts in the playbook and consumers. Keep scenario documents semantically
identical so manual evidence remains comparable before and after the naming migration.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 29-file inventory, nine category list, and target map are pinned.
- [ ] Catalog, reference, top-level-doc, test, and sibling-phase consumers are enumerated.
- [ ] BASE scenario IDs, category membership, link counts, and content fingerprints are recorded.

### Definition of Done
- [ ] One manual-testing-playbook root and nine kebab-case categories exist.
- [ ] All playbook links and path-valued consumer references resolve.
- [ ] Scenario IDs, frontmatter, titles, steps, expected results, commands, and evidence rules are unchanged.
- [ ] Scenario counts, category membership, and cross-link coverage match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-closed documentation-tree rename with path-only link rewriting.

### Key Components
- Playbook root/index: manual_testing_playbook and manual_testing_playbook.md.
- Category groups: context_retrieval, coverage_graph, detect_changes, doctor_code_graph,
  manual_scan_verify_status, mcp_tool_surface, plugins_and_hooks, post_rename_infrastructure, and
  read_path_freshness.
- Consumers: playbook navigation, feature catalog, SKILL/README/INSTALL/ARCHITECTURE docs, references, tests, and
  live path-aware validators.

### Data Flow
Operators discover the root index, select a category, and execute a scenario that points to code, tools, catalog
features, or reference material. The map updates path segments and link targets while preserving scenario identity,
manual evidence requirements, and the program's filesystem exemptions.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all 29 files and nine categories; calculate kebab targets and collision checks.
- [ ] Scan playbook, catalog, skill docs, references, tests, validators, and other live consumers for old paths.
- [ ] Capture BASE scenario IDs, category membership, link counts, content fingerprints, and referenced feature IDs.

### Phase 2: Implementation
- [ ] Rename the root, root index, categories, and all 28 scenario files in dependency-closed groups.
- [ ] Update path-valued links and root/category/file examples in the enumerated consumers.
- [ ] Leave scenario IDs, frontmatter, titles, steps, expected results, commands, evidence rules, and content keys
  unchanged.

### Phase 3: Verification
- [ ] Scan for duplicate roots, stale live old paths, and missing scenario targets.
- [ ] Resolve every playbook navigation, scenario, catalog, reference, and sibling-phase pointer.
- [ ] Compare scenario IDs, category membership, content fingerprints, and coverage counts to BASE.
- [ ] Record the target map and cross-link evidence for the subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Root, categories, files, and collisions | rg, filesystem manifest, rename-map checker |
| Links | Root index, scenarios, catalog/reference pointers, and consumers | Markdown/path resolver |
| Identity | Scenario IDs, frontmatter, titles, steps, and expected results | parser and BASE comparison |
| Coverage | Categories, feature references, commands, and evidence contracts | scenario inventory and normalized diff |
| Integration | Top-level docs, tests, and path-aware consumers | targeted generator/validator/link smoke |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature-catalog map | Internal | Required | Catalog-to-playbook links cannot be closed |
| Sibling component maps | Internal | Required | Scenario pointers can remain stale or ambiguous |
| Frozen playbook map | Internal | Required | Partial tree rename breaks manual navigation |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing scenario target, duplicate root, changed scenario identity, or coverage/link drift.
- **Procedure**: Restore the playbook map and path-only link edits in the isolated worktree, retain the old-path
  disposition report, and rerun the BASE scenario and link comparison before retrying.
<!-- /ANCHOR:rollback -->

