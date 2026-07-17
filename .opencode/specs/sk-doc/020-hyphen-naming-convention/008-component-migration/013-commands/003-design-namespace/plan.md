---
title: "Implementation Plan: design command namespace naming (032 phase 008/013/003)"
description: "Plan for renaming the maintained design workflow and presentation assets through the frozen map and repairing all path-valued consumers without changing design command behavior."
trigger_phrases:
  - "design namespace naming plan"
  - "design asset rename plan"
  - "design command path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/003-design-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored design namespace plan"
    next_safe_action: "Execute the design asset rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/commands/design/*.md"
      - ".opencode/commands/design/assets/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Design command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/design/` and its active consumers |
| **Change class** | Maintained asset rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Reference checker, asset existence scan, and design-route parity |

### Overview

Rename the 15 `design_*` asset files individually, then repair the command and asset path values that select their auto, confirm, and presentation contracts. The content boundary keeps design command IDs, configuration keys, and non-path data unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map identifies all 15 design asset candidates and targets.
- [ ] BASE references include all five design commands, asset-local pointers, and external consumers.
- [ ] Exact IDs, configuration keys, and exemption classes are recorded.

### Definition of Done

- [ ] All 15 assets use the mapped kebab-case target and every active pointer resolves.
- [ ] All five design command modes retain BASE route and presentation outcomes.
- [ ] No sibling namespace or non-path content changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset map**: model the `audit`, `foundations`, `interface`, `md-generator`, and `motion` triples as explicit source-to-target rows.
- **Pointer layer**: update command tables, workflow selectors, presentation references, and external path values only when they name a moved file.
- **Name boundary**: preserve command IDs, config keys, YAML keys, frontmatter fields, and prose occurrences that are not paths.
- **Evidence layer**: compare target existence, old-reference absence, route outcomes, and scope against BASE.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 15-row design map, baseline manifest, and reference-checker rules.
- [ ] Capture old asset paths from the five command files, asset files, indexes, tests, and documentation.
- [ ] Confirm the command markdown files and all non-path values are excluded.

### Phase 2: Core Implementation

- [ ] Rename the audit, foundations, interface, md-generator, and motion auto/confirm/presentation assets.
- [ ] Update command and asset-local path values plus external consumers in the same dependency-closed batch.
- [ ] Record dynamic or non-path occurrences in the disposition ledger.

### Phase 3: Verification

- [ ] Compare the final path manifest with every design map row and check collisions.
- [ ] Resolve all design asset pointers and run the command-reference scan.
- [ ] Exercise all five design modes and compare their loading outcomes with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 15 rows, distinct kebab-case targets, and zero unknowns. |
| Reference integrity | Path scan reports no old active design asset path and every target resolves. |
| Route parity | Audit, foundations, interface, md-generator, and motion auto/confirm/presentation paths match BASE. |
| Exemption safety | Inspect IDs, config/YAML keys, frontmatter, Python/package, generated, tool-mandated, and frozen surfaces. |
| Scope safety | Review the path-scoped diff for design-only changes. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 phase 005 rename/reference tooling | Internal | Required before execution | Manual replacement can alter keys or miss path consumers. |
| 032 phase 006 frozen map | Internal | Required before execution | Targets and ownership are not fixed. |
| 000 baseline route evidence | Internal | Required before verification | Design behavior parity lacks a pinned comparison. |
| Commands parent handoff | Internal | Required before execution | Shared asset ownership may be duplicated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, missing target, stale pointer, design-route drift, exemption violation, or sibling file change.
- **Procedure**: Revert only the path-scoped design commit, restore the BASE manifest, and rerun the map/reference checks before retrying.
<!-- /ANCHOR:rollback -->
