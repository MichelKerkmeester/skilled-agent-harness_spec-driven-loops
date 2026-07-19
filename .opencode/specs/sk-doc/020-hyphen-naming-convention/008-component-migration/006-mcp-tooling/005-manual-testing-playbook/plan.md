---
title: "Implementation Plan: mcp-tooling hub manual-testing-playbook naming closure (020 phase 005)"
description: "This plan renames the hub-level manual-testing-playbook root, hub-routing category, index, and seven scenario files, then repairs hub navigation while keeping component-local playbooks out of scope."
trigger_phrases:
  - "mcp-tooling hub playbook implementation plan"
  - "hub routing scenario path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/006-mcp-tooling/005-manual-testing-playbook"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the hub playbook execution plan"
    next_safe_action: "Build the seven-file hub playbook map"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/manual_testing_playbook/"
      - ".opencode/skills/mcp-tooling/SKILL.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-tooling Hub Manual-Testing-Playbook Naming Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/mcp-tooling/manual_testing_playbook |
| **Change class** | Small documentation-tree rename plus link repair |
| **Execution** | One hub-level dependency closure from the frozen 020 map |

### Overview
The hub playbook census contains 2 underscored directories and 7 underscored files. The implementation renames the root, category, index, and scenario paths together, then updates the hub SKILL.md and playbook links. Component-local playbooks remain separate dependency closures.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and map hash are recorded
- [ ] The 2-directory/7-file hub census is attached
- [ ] Component-local playbook roots are explicitly excluded
- [ ] Hub SKILL.md and playbook link consumers are inventoried

### Definition of Done
- [ ] All hub playbook paths use kebab-case
- [ ] Seven scenarios are still discoverable and every link resolves
- [ ] No component-local path or scenario semantics changed
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Root move**: rename manual-testing-playbook to manual-testing-playbook and hub_routing to hub-routing.
- **Index move**: rename manual_testing_playbook.md to manual-testing-playbook.md.
- **Scenario move**: rename the six named underscored scenario files and preserve their IDs/content.
- **Reference closure**: update SKILL.md, the index, and scenario links while retaining frontmatter fields and labels.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Pin BASE and confirm a clean worktree
- [ ] Capture the two-directory/seven-file census and seven-scenario discovery count
- [ ] Mark all component-local manual-testing trees as excluded

### Phase 2: Implementation
- [ ] Rename the hub playbook root and hub-routing category
- [ ] Rename the index and six scenario files
- [ ] Update SKILL.md, playbook navigation, and all scenario hrefs

### Phase 3: Verification
- [ ] Confirm no in-scope underscore remains in the hub playbook
- [ ] Resolve all hub playbook links
- [ ] Compare the seven-scenario discovery count and inspect component path ownership
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Census | Hub root/category/index/scenario candidates | find, git ls-files, rename-map checker |
| Link graph | SKILL.md, index, and scenario hrefs | rg, Markdown-link resolver |
| Discovery | Seven hub routing scenarios | playbook index checker |
| Boundary | Component-local trees remain untouched | path-owner diff |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 hub boundary | Internal | Required | Root navigation may be stale |
| Frozen 020 rename map | Internal | Required | No safe targets |
| Component phase ownership | Internal | Required | Hub move could rewrite another phase |
| Markdown-link resolver | Internal verifier | Required | Dead scenario links could pass unnoticed |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing scenario, broken hub link, changed scenario semantics, or component-tree drift.
- **Procedure**: Revert the path-scoped hub-playbook commit, restore the prior index links, and rerun the seven-scenario census.
<!-- /ANCHOR:rollback -->
