---
title: "Implementation Plan: speckit command namespace naming (020 phase 008/013/007)"
description: "Plan for renaming the twelve maintained speckit workflow and presentation assets through the frozen map and repairing command/README paths while preserving /speckit:* behavior."
trigger_phrases:
  - "speckit namespace naming plan"
  - "speckit asset rename plan"
  - "speckit command path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/007-speckit-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored speckit namespace plan"
    next_safe_action: "Execute the speckit asset rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/*.md"
      - ".opencode/commands/speckit/assets/"
      - ".opencode/commands/speckit/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Speckit command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/speckit/` and its active consumers |
| **Change class** | Maintained workflow/presentation asset rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Reference checker, mode parity, asset existence, and command-ID review |

### Overview

Rename the 12 `speckit_*` asset files individually, update command and README path values, and verify complete, implement, plan, and resume loading remains equivalent. Public command IDs and workflow/data keys stay untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map contains all 12 speckit asset rows and targets.
- [ ] BASE references include all four command files, README, assets, tests, and external consumers.
- [ ] `/speckit:*` IDs, keys, and exemption classes are recorded.

### Definition of Done

- [ ] All 12 assets use mapped kebab-case targets and every active pointer resolves.
- [ ] Complete, implement, plan, and resume mode/presentation outcomes match BASE.
- [ ] No ID, key, or sibling namespace changed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset map**: map each complete, implement, plan, and resume auto/confirm/presentation triple.
- **Pointer layer**: update command tables, README trees, workflow selectors, and external path values only where a file moved.
- **Contract boundary**: preserve `/speckit:*` IDs, YAML/data keys, frontmatter fields, and non-path prose.
- **Evidence layer**: compare target existence, old-reference absence, mode outcomes, and path scope with BASE.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 12-row speckit map, BASE manifest, and commands-parent handoff.
- [ ] Capture old asset paths across command docs, README, assets, tests, and documentation.
- [ ] Confirm exact command IDs, keys, and compliant command files are excluded.

### Phase 2: Core Implementation

- [ ] Rename complete, implement, plan, and resume auto/confirm/presentation assets to kebab-case.
- [ ] Update command, README, asset-local, test, and external path references in one closure.
- [ ] Record dynamic, key, ID, and non-path occurrences in the disposition ledger.

### Phase 3: Verification

- [ ] Compare the final path manifest with all 12 rows and check collisions.
- [ ] Resolve every speckit asset pointer and run command-reference checks.
- [ ] Exercise all four command modes and compare IDs, workflow selection, and presentation outcomes with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 12 rows, distinct kebab-case targets, and zero unknowns. |
| Reference integrity | No old active speckit asset path remains and every target resolves. |
| Mode parity | Complete, implement, plan, and resume auto/confirm/presentation paths match BASE. |
| Contract safety | `/speckit:*` IDs, keys, frontmatter, Python/package, generated, tool-mandated, and frozen surfaces are unchanged. |
| Scope safety | Review a path-scoped diff limited to speckit and its proven consumers. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 020 phase 005 rename/reference tooling | Internal | Required before execution | Manual replacement can alter IDs/keys or miss consumers. |
| 020 phase 006 frozen map | Internal | Required before execution | Targets and ownership are not fixed. |
| 000 baseline speckit-flow evidence | Internal | Required before verification | Mode and command-ID parity lack a pinned comparison. |
| Commands parent handoff | Internal | Required before execution | Shared asset ownership may be duplicated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, missing target, stale pointer, command-ID drift, mode failure, exemption violation, or sibling change.
- **Procedure**: Revert only the path-scoped speckit asset/reference commit, restore the BASE manifest, and rerun map/reference checks before retrying.
<!-- /ANCHOR:rollback -->
