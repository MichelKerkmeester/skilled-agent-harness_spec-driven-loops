---
title: "Implementation Plan: system-skill-advisor manual testing playbook"
description: "Rename the manual-testing-playbook root, nine categories, and 48 files with a complete path map, repair catalog and operator links, and prove scenario identity and discovery parity."
trigger_phrases:
  - "manual testing playbook implementation plan"
  - "manual-testing-playbook path closure"
  - "advisor scenario rename map"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/009-system-skill-advisor/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the manual-playbook implementation plan"
    next_safe_action: "Freeze the 48-file playbook map and scenario-link inventory"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/system-skill-advisor/feature_catalog"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/manual-testing-playbook.vitest.ts"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current tree contains nine snake_case category directories and 48 files including the root index."
      - "Scenario IDs and contract content are the parity baseline."
---

# Implementation Plan: system-skill-advisor manual testing playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown scenario contracts, path-aware tests, operator shell commands |
| **Framework** | sk-doc manual-testing-playbook conventions and Vitest discovery |
| **Storage** | Version-controlled Markdown scenarios and derived metadata |
| **Testing** | Scenario inventory, link scan, parser/test discovery, representative operator runs |

### Overview
Map the playbook root, root index, nine categories, and 48 files to kebab-case. Rewrite only filesystem path
segments in links and commands, then compare scenario IDs, titles, steps, expected results, and discovery counts to
BASE so the migration cannot silently lose manual coverage.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The 48-file inventory, nine categories, and target map are pinned.
- [ ] Catalog links, top-level docs, tests, and operator command consumers are enumerated.
- [ ] BASE scenario IDs, parsed count, and representative outputs are recorded.

### Definition of Done
- [ ] One manual-testing-playbook root and nine kebab-case categories exist.
- [ ] All catalog, docs, tests, and operator links resolve.
- [ ] Scenario identity and contract content match BASE.
- [ ] Representative manual/test discovery remains green.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Content-tree rename with scenario-contract parity.

### Key Components
- Playbook root/index: manual_testing_playbook and manual_testing_playbook.md.
- Category groups: auto_indexing, auto_update_daemon, cli_hooks_and_plugin, compat_and_disable,
  lifecycle_routing, native_mcp_tools, operator_h5, python_compat, and scorer_fusion.
- Consumers: feature catalog, top-level docs, tests, references, and operator commands.

### Data Flow
Operators and automated checks discover the root/index, select a category/scenario, and execute the documented
contract against the advisor runtime. Renaming changes only the path used to reach the same scenario content and IDs.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Enumerate all 48 files and nine categories; calculate targets and collision checks.
- [ ] Scan catalog, docs, tests, references, and commands for old playbook paths.
- [ ] Capture scenario IDs, parsed counts, link counts, and representative outputs at BASE.

### Phase 2: Implementation
- [ ] Rename the root, index, categories, and scenario files in dependency-closed groups.
- [ ] Update catalog links, docs, tests, references, and operator command paths.
- [ ] Preserve scenario IDs, frontmatter, steps, expected results, and Python/tool exemptions.

### Phase 3: Verification
- [ ] Scan for duplicate roots and stale live old paths.
- [ ] Resolve every playbook link and command target.
- [ ] Run scenario parser/test discovery and representative operator checks.
- [ ] Compare IDs, counts, and outcomes to BASE; hand off the map to the subtree gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Root, categories, files, collisions | rg, filesystem manifest, rename-map checker |
| Links | Catalog/docs/reference links | Markdown/path resolver |
| Discovery | Scenario parser and Vitest suite | manual-testing-playbook test and parser |
| Content | IDs, steps, expected results, frontmatter | structured comparison to BASE |
| Operator | Representative happy/degraded/unavailable scenarios | documented shell/CLI flows |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Feature-catalog map | Internal | Required | Catalog-to-playbook links cannot be closed |
| Advisor runtime/package map | Internal | Required | Operator commands may point at stale runtime paths |
| BASE scenario manifest | Internal | Required | Coverage parity cannot be proven |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing scenario, changed ID/content, broken link, or discovery-count drift.
- **Procedure**: Restore the playbook path map and path-only link edits in the isolated worktree, preserve the
  scenario comparison report, and retry only after the missing consumer or collision is classified.
<!-- /ANCHOR:rollback -->
