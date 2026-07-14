---
title: "Implementation Plan: code-review filesystem names (017 phase 008/004)"
description: "Plan for renaming code-review assets, review scenarios, references, and benchmark labels through the frozen map, then proving review navigation and findings behavior remain intact."
trigger_phrases:
  - "code-review naming implementation plan"
  - "review mode rename plan"
  - "review playbook reference repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-review phase plan"
    next_safe_action: "Execute the review packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
      - ".opencode/skills/sk-code/code-review/manual_testing_playbook/"
      - ".opencode/skills/sk-code/code-review/references/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: code-review filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/code-review |
| **Change class** | Review-mode filesystem rename plus path/reference repair |
| **Execution** | Dependency-closed frozen-map batch in the pinned BASE worktree |
| **Verification** | Scenario discovery, link/path scan, review behavior parity, benchmark path check |

### Overview

Move review assets, manual scenarios, reference files, and classified benchmark labels as a single navigation closure. Every old path is found before the rename and every scenario remains discoverable after it; review semantics and security rules are not rewritten.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map covers every review asset, category, scenario, reference, and benchmark candidate.
- [ ] BASE scenario IDs, discovery counts, and review behavior evidence are attached.
- [ ] Shared and surface path handoffs are available.

### Definition of Done

- [ ] Review filesystem names are kebab-case and all active path consumers resolve.
- [ ] Scenario IDs, categories, and discovery counts match BASE.
- [ ] Findings, security, and exemption checks show no semantic drift.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset closure**: move review checklist and removal-plan files with their incoming links.
- **Scenario closure**: move the manual-testing-playbook root, category directories, and scenario files while preserving scenario IDs and content.
- **Reference closure**: move the review reference set and update links from SKILL.md, README.md, and scenario documents.
- **Evidence boundary**: treat names in findings, identifiers, keys, frontmatter, generated reports, and frozen history as content/exemption data, not rename candidates.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load frozen map, BASE scenario inventory, and preceding path handoffs.
- [ ] Record review asset/reference/category names and every inbound/outbound path edge.
- [ ] Separate review identifiers and prose from filesystem names.

### Phase 2: Core Implementation

- [ ] Rename review assets to kebab-case.
- [ ] Rename the manual-testing-playbook root, nine listed review categories, and scenario files.
- [ ] Rename review references and classified benchmark labels.
- [ ] Update SKILL.md, README.md, indexes, scenario links, shared/surface references, and benchmark paths.

### Phase 3: Verification

- [ ] Resolve all review markdown and path-valued references.
- [ ] Run scenario discovery and confirm every BASE scenario ID remains present once.
- [ ] Run findings-first, security, and review-state checks against the renamed paths.
- [ ] Verify the final map, exemption ledger, and cross-component handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Frozen-map scan covers assets, categories, scenarios, references, and benchmark paths exactly once. |
| Navigation | Resolve packet links, scenario root links, shared/surface links, and benchmark paths; search old active basenames. |
| Scenario parity | Compare scenario IDs, category discovery, and non-zero counts with BASE. |
| Behavior parity | Run review/security/checklist checks and compare findings/evidence behavior with BASE. |
| Scope safety | Compare identifiers, keys, exact names, Python/package, generated, tool-mandated, and frozen surfaces. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001-003 sk-code handoffs | Internal | Required | Shared path consumers and mode interactions may remain stale. |
| 017 frozen rename map | Internal | Required | Scenario/identifier distinctions cannot be proven. |
| 000 baseline evidence | Internal | Required | Scenario and review parity cannot be measured. |
| 005 rename/reference tooling | Internal | Required | Dynamic review-resource references may be missed. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing scenario, review path failure, behavior drift, collision, or exemption violation.
- **Procedure**: Revert the review-mode closure, restore the pre-change scenario/reference manifest, and rerun the frozen-map preflight.
<!-- /ANCHOR:rollback -->
