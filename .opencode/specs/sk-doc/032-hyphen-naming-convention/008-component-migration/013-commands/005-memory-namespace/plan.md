---
title: "Implementation Plan: memory command namespace naming (032 phase 008/013/005)"
description: "Plan for renaming the four maintained memory presentation assets and repairing every command, README, and external path pointer without changing memory tool behavior."
trigger_phrases:
  - "memory namespace naming plan"
  - "memory asset rename plan"
  - "memory presentation path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/005-memory-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored memory namespace plan"
    next_safe_action: "Execute the memory presentation asset closure"
    blockers: []
    key_files:
      - ".opencode/commands/memory/*.md"
      - ".opencode/commands/memory/assets/"
      - ".opencode/commands/memory/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Memory command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/memory/` and its active consumers |
| **Change class** | Maintained presentation asset rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Reference checker, presentation existence scan, and tool-flow parity |

### Overview

Rename the four presentation files individually, update command and README path literals, and verify the memory command flows still load the same presentation content. Only filesystem path values move; memory tool IDs, plugin names, and data keys remain unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map contains all four memory asset rows and targets.
- [ ] BASE references include all memory command files, `README.txt`, assets, and external consumers.
- [ ] Tool IDs, plugin contracts, keys, and exemption classes are recorded.

### Definition of Done

- [ ] All four presentation assets use the mapped target and every active pointer resolves.
- [ ] Learn, manage, save, and search tool/presentation outcomes match BASE evidence.
- [ ] No sibling namespace or non-path content changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Presentation map**: map learn, manage, save, and search sources to their kebab-case targets.
- **Pointer layer**: update command tables, README tree entries, presentation loading instructions, and external path values.
- **Content boundary**: leave tool IDs, plugin names, YAML/data keys, frontmatter fields, and non-path prose unchanged.
- **Evidence layer**: compare target existence, old-reference absence, tool-flow outcomes, and scope against BASE.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the four-row memory map, BASE manifest, and reference-checker rules.
- [ ] Capture old presentation paths from command files, README, assets, tests, and documentation.
- [ ] Confirm compliant command names and tool/data exclusions.

### Phase 2: Core Implementation

- [ ] Rename `learn_presentation.txt`, `manage_presentation.txt`, `save_presentation.txt`, and `search_presentation.txt` to kebab-case.
- [ ] Update command, README, asset-local, test, and external path references in one closure.
- [ ] Record dynamic, key, and non-path occurrences in the disposition ledger.

### Phase 3: Verification

- [ ] Compare the final path manifest with all four map rows and check collisions.
- [ ] Resolve all memory presentation pointers and run the command-reference checker.
- [ ] Exercise learn, manage, save, and search flows and compare outcomes with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports four rows, distinct kebab-case targets, and zero unknowns. |
| Reference integrity | Path scan reports no old active presentation path and every target resolves. |
| Flow parity | Learn, manage, save, and search command presentation/tool paths match BASE. |
| Exemption safety | Inspect tool IDs, plugin names, keys, frontmatter, Python/package, generated, tool-mandated, and frozen surfaces. |
| Scope safety | Review a path-scoped diff limited to memory and its proven consumers. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 phase 005 rename/reference tooling | Internal | Required before execution | Manual replacement can alter data keys or miss path consumers. |
| 032 phase 006 frozen map | Internal | Required before execution | Targets and ownership are not fixed. |
| 000 baseline memory-flow evidence | Internal | Required before verification | Presentation/tool parity lacks a pinned comparison. |
| Commands parent handoff | Internal | Required before execution | Shared asset ownership may be duplicated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any missing presentation, stale path, tool-flow drift, collision, exemption violation, or sibling file change.
- **Procedure**: Revert only the path-scoped memory asset/reference commit, restore the BASE manifest, and rerun map/reference checks before retrying.
<!-- /ANCHOR:rollback -->
