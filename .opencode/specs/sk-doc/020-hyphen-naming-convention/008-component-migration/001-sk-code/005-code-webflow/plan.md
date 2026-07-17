---
title: "Implementation Plan: code-webflow filesystem names (032 phase 008/005)"
description: "Plan for renaming code-webflow assets, playbook categories, references, symlink consumers, and benchmark labels through the frozen map, then proving browser-surface resource and scenario parity."
trigger_phrases:
  - "code-webflow naming implementation plan"
  - "Webflow packet rename plan"
  - "Webflow asset reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-webflow phase plan"
    next_safe_action: "Execute the Webflow packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-webflow/assets/"
      - ".opencode/skills/sk-code/code-webflow/references/"
      - ".opencode/skills/sk-code/code-webflow/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: code-webflow filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/code-webflow |
| **Change class** | Webflow surface filesystem rename plus reference/symlink repair |
| **Execution** | Dependency-closed frozen-map batch in the pinned BASE worktree |
| **Verification** | Link/path scan, resource discovery, symlink manifest, browser/runtime smoke, benchmark path check |

### Overview

Group the rename by actual closure: assets and their indexes, manual scenarios, the deep reference tree, benchmark labels, and workflow symlinks. Update path consumers in the same batch, then compare Webflow and Motion.dev logical resource loads and smoke behavior with BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers every underscore-bearing asset, directory, reference, symlink, and benchmark label.
- [ ] BASE Webflow/Motion.dev resource-load, scenario, and browser evidence is attached.
- [ ] Shared workflow and prior mode handoffs are available.

### Definition of Done

- [ ] All in-scope Webflow names are kebab-case and all path consumers resolve.
- [ ] Asset, reference, scenario, symlink, and benchmark parity is proven.
- [ ] No runtime semantics, identifier, or exemption surface changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset closure**: animation, integration, pattern, template, and checklist assets move with their indexes and inbound links.
- **Playbook closure**: category directories and routing scenarios move with the root index and scenario cross-references.
- **Reference closure**: nested animation, implementation, language, debugging, deployment, and verification trees move with all markdown links.
- **Symlink/benchmark closure**: workflow link nodes and classified benchmark labels move with their path consumers; generated report contents stay generated.
- **Behavior boundary**: preserve surface detection, Motion.dev overlay, browser selectors, code identifiers, and path-independent content.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load frozen map, BASE manifests, Webflow resource inventory, and prior shared/mode handoffs.
- [ ] Record asset files, playbook categories, reference directories, symlink targets, benchmark labels, and every path edge.
- [ ] Mark generated reports, exact names, identifiers, selectors, keys, and frozen content as non-rename surfaces.

### Phase 2: Core Implementation

- [ ] Rename animation, integrations, patterns, templates, and root asset checklist names.
- [ ] Rename the Webflow manual-testing-playbook root/categories/scenario files.
- [ ] Rename the reference tree groups and nested files, including workflow, form, observer, performance, security, and deployment names.
- [ ] Rename classified benchmark labels and repair SKILL.md, README.md, indexes, links, symlink target strings, and benchmark paths.

### Phase 3: Verification

- [ ] Resolve every markdown link and asset/reference path with a non-zero inventory.
- [ ] Verify WEBFLOW, OPENCODE-over-WEBFLOW precedence, Motion.dev, and language/resource discovery behavior.
- [ ] Run relevant browser/runtime smoke and benchmark path checks against BASE.
- [ ] Verify symlink modes/targets, exemptions, and the final cross-component handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Frozen-map scan covers every Webflow asset, playbook, reference, symlink, and benchmark candidate exactly once. |
| Reference integrity | Resolve all markdown links and search old path basenames across markdown, JS, CSS, HTML, and config path values. |
| Resource parity | Compare surface/animation/language resource load sets and scenario IDs with BASE. |
| Runtime parity | Run browser/runtime smoke for Webflow and Motion.dev paths and compare route outcomes. |
| Scope safety | Compare symlink manifests, identifiers/selectors, exact names, generated output, keys, package/Python, and frozen surfaces. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 shared hub closure | Internal | Required | Shared workflow source and link paths may be stale. |
| 002-004 mode closures | Internal | Required | Cross-mode resource edges may be unresolved. |
| 032 frozen rename map | Internal | Required | Asset/reference/generated classification is ambiguous. |
| 000 baseline evidence | Internal | Required | Resource and browser parity cannot be measured. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken asset/reference link, missing scenario, browser/resource drift, symlink failure, collision, or exemption violation.
- **Procedure**: Revert the Webflow closure, restore the pre-change link and resource manifest, and rerun the frozen-map preflight before retrying.
<!-- /ANCHOR:rollback -->
