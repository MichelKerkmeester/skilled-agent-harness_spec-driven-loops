---
title: "Implementation Plan: code-quality filesystem names (020 phase 008/003)"
description: "Plan for renaming code-quality checklist, playbook, and benchmark names through the frozen map, then proving that quality-mode routing and resource loading remain equivalent."
trigger_phrases:
  - "code-quality naming implementation plan"
  - "quality mode rename plan"
  - "quality checklist reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/003-code-quality"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-quality phase plan"
    next_safe_action: "Execute the quality packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-quality/SKILL.md"
      - ".opencode/skills/sk-code/code-quality/assets/"
      - ".opencode/skills/sk-code/code-quality/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: code-quality filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/code-quality |
| **Change class** | Quality-mode filesystem rename plus path repair |
| **Execution** | Dependency-closed map batch in the pinned BASE worktree |
| **Verification** | Quality resource-load check, path scan, benchmark path check, behavior parity |

### Overview

Rename the quality checklist tree, manual-testing-playbook tree, and nested benchmark labels from the frozen map, then update the mode documents and all links that consume them. The implementation does not alter quality rules or check identifiers; it proves the same quality resources are loaded under kebab-case paths.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map distinguishes tracked benchmark storage from generated report output.
- [ ] The preceding shared/OpenCode handoffs identify common path and symlink consumers.
- [ ] BASE quality-mode resource and checklist evidence is recorded.

### Definition of Done

- [ ] Checklist, playbook, and benchmark names are kebab-case.
- [ ] Quality-mode resource paths resolve and quality outcomes match BASE.
- [ ] No unrelated mode, script, identifier, or exemption surface changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Checklist closure**: assets/code_quality_checklist and its markdown consumers move together.
- **Playbook closure**: manual_testing_playbook, quality_gate, the root index, and scenario links move together.
- **Benchmark closure**: tracked run labels move only when classified as rename candidates; generated report contents remain generated.
- **Mode consumer closure**: SKILL.md, README.md, shared standards links, and resource indexes receive path-only updates.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the frozen map, BASE manifests, and shared/OpenCode handoffs.
- [ ] Record old quality checklist, playbook, and benchmark paths and their consumers.
- [ ] Mark generated reports, tool names, and content identifiers as non-rename surfaces.

### Phase 2: Core Implementation

- [ ] Rename assets/code-quality-checklist and its three checklist files.
- [ ] Rename the quality manual-testing-playbook root/category/index/scenario paths.
- [ ] Rename live-mode-b and router-mode-a labels when the map classifies them as tracked names.
- [ ] Update SKILL.md, README.md, quality references, scenario links, and benchmark commands.

### Phase 3: Verification

- [ ] Load the quality mode and confirm the expected checklist/resource set.
- [ ] Run quality-mode scenario and gate checks with the renamed paths.
- [ ] Search for old active basenames and verify the final component inventory.
- [ ] Compare behavior, executable modes, and exempt-name manifests with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Frozen-map and path scans cover every underscore directory/file under code-quality. |
| Reference repair | Resolve links and search old path literals in SKILL.md, README.md, assets, playbook, and benchmark docs. |
| Quality parity | Run the existing quality-mode checklist/routing checks and compare logical resource loads and outcomes with BASE. |
| Benchmark paths | Confirm router/live output discovery still points at the intended storage labels and reports. |
| Scope safety | Compare executable scripts, identifiers, keys, frontmatter, tool names, and frozen surfaces with BASE. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 shared hub closure | Internal | Required | Shared standards and workflow paths may remain stale. |
| 002 OpenCode closure | Internal | Required | Cross-surface path consumers may be unresolved. |
| 020 frozen rename map | Internal | Required | Generated benchmark output could be misclassified. |
| 000 baseline evidence | Internal | Required | Quality resource and behavior parity cannot be measured. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Quality resource load failure, stale playbook path, changed gate result, collision, or scope violation.
- **Procedure**: Revert the quality-mode path-scoped batch, restore the old manifest, and rerun the map/reference preflight before retrying.
<!-- /ANCHOR:rollback -->
