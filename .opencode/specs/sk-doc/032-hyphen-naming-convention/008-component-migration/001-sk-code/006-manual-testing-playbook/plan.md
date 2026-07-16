---
title: "Implementation Plan: sk-code manual-testing-playbook tree (032 phase 008/006)"
description: "Plan for renaming the hub-level sk-code manual-testing-playbook root, categories, and scenario files through the frozen map, then proving scenario-ID and benchmark-corpus parity."
trigger_phrases:
  - "manual playbook naming implementation plan"
  - "sk-code scenario rename plan"
  - "manual-testing-playbook reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/006-manual-testing-playbook"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored manual playbook phase plan"
    next_safe_action: "Execute the hub playbook rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/manual_testing_playbook/"
      - ".opencode/skills/sk-code/benchmark/README.md"
      - ".opencode/skills/sk-code/code-webflow/assets/animation/playbook_entries.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: sk-code manual-testing-playbook tree

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/manual_testing_playbook and its active consumers |
| **Change class** | Playbook filesystem rename plus scenario-link repair |
| **Execution** | Frozen semantic map in the pinned BASE worktree |
| **Verification** | Scenario-ID extraction, link scan, category counts, benchmark corpus parity |

### Overview

Move the hub playbook root, categories, index, and scenarios as one graph closure. Rewrite only path-derived references, then compare scenario IDs, category membership, expected resource paths, and benchmark discovery with the phase 000 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers every category, scenario, root index, and empty-directory disposition.
- [ ] BASE scenario IDs, category counts, and benchmark corpus evidence are attached.
- [ ] Component-local playbook ownership is recorded so no sibling tree is accidentally moved.

### Definition of Done

- [ ] The hub playbook tree is kebab-case and all links resolve.
- [ ] Scenario IDs, category counts, prompts, and expected resource loads match BASE.
- [ ] Benchmark corpus discovery and cross-surface references use the new root.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Root/index closure**: move manual_testing_playbook and manual_testing_playbook.md together.
- **Category closure**: move each category directory with its complete scenario set, including empty-directory evidence.
- **Consumer closure**: update hub docs, benchmark README, asset playbook entries, and cross-surface links.
- **Semantic boundary**: preserve scenario IDs and prose; change only filesystem names and path-derived values.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load frozen map, BASE scenario inventory, and component ownership handoffs.
- [ ] Extract scenario IDs, category membership, relative links, and benchmark corpus references.
- [ ] Record the existing root/category/file manifest, including empty directories.

### Phase 2: Core Implementation

- [ ] Rename the hub root and root index.
- [ ] Rename the ten category directories and every in-scope scenario filename.
- [ ] Update scenario cross-links, hub navigation, benchmark README, asset entries, and active cross-surface references.
- [ ] Preserve component-local playbook paths and benchmark report/storage paths for sibling phases.

### Phase 3: Verification

- [ ] Re-extract scenario IDs and compare counts/category membership with BASE.
- [ ] Resolve every markdown link and root/category index path.
- [ ] Confirm benchmark corpus discovery reaches all expected scenarios.
- [ ] Verify no content, identifier, key, exemption, or sibling-owned path changed.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Compare frozen map with root/category/file manifest and empty-directory dispositions. |
| Link integrity | Resolve all playbook, hub, benchmark, asset, and cross-surface markdown links. |
| Scenario parity | Compare scenario IDs, category counts, prompts, and expected resource paths with BASE. |
| Benchmark parity | Load the playbook corpus through the benchmark README/loader path and compare corpus membership. |
| Scope safety | Check component-local playbooks, identifiers, keys, exact names, generated output, Python/package, and frozen surfaces. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-005 component path handoffs | Internal | Required | Cross-surface scenario links may be unresolved. |
| 032 frozen map | Internal | Required | Category and scenario ownership is ambiguous. |
| 000 scenario baseline | Internal | Required | Loss or duplication of scenarios cannot be detected. |
| 007 benchmark child | Internal | Downstream | Benchmark storage is not renamed here, but its corpus path must be handed off. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Lost/duplicated scenario, broken link, changed corpus membership, collision, or ownership violation.
- **Procedure**: Revert the root/category/file closure, restore the scenario manifest, and rerun the ID/link preflight before retrying.
<!-- /ANCHOR:rollback -->
