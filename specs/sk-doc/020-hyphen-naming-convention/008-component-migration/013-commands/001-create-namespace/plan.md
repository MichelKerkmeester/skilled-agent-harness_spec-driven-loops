---
title: "Implementation Plan: create command namespace naming (020 phase 008/013/001)"
description: "Plan for renaming the maintained create command asset files through the frozen semantic map, repairing mode and presentation pointers, and proving the command behavior remains equivalent."
trigger_phrases:
  - "create namespace naming plan"
  - "create asset rename plan"
  - "create command path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/001-create-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored create namespace plan"
    next_safe_action: "Execute the create asset rename and reference closure"
    blockers: []
    key_files:
      - ".opencode/commands/create/*.md"
      - ".opencode/commands/create/assets/"
      - ".opencode/commands/create/README.txt"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Create command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/create/` and its active consumers |
| **Change class** | Maintained asset rename plus reference repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Reference checker, asset existence scan, command-mode parity, and diff-scope review |

### Overview

Use the phase 005 rename/reference tooling and phase 006 map to rename the 30 create asset files one by one. Update only filesystem path literals and links; preserve command IDs, YAML keys, frontmatter, and the content contract of each workflow and presentation file.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map contains every create asset source and target.
- [ ] The BASE path/reference inventory includes command markdown, `README.txt`, and external consumers.
- [ ] Tool-mandated, generated, Python, package, key, and frozen exclusions are recorded.

### Definition of Done

- [ ] All 30 maintained assets use the mapped kebab-case target.
- [ ] Every active path pointer resolves and no old create asset path remains.
- [ ] Mode and presentation loading outcomes match BASE evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Semantic rename closure**: process each `create_*` asset through an explicit source-to-target row; do not substitute underscores in content globally.
- **Command pointer layer**: update asset tables, workflow selectors, presentation references, and README tree examples that point to filenames.
- **Content boundary**: leave workflow keys such as `operating_mode`, command IDs, frontmatter fields, and non-path prose unchanged.
- **Evidence layer**: compare target existence, old-reference absence, mode routing, and file modes against the BASE manifest.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 30-row create map, baseline manifest, and reference-checker rules.
- [ ] Capture all old asset path occurrences in create docs, asset files, indexes, tests, and install guides.
- [ ] Confirm the already-compliant command markdown files and exact-name exclusions.

### Phase 2: Core Implementation

- [ ] Rename the agent, benchmark, changelog, command, feature-catalog, flowchart, manual-testing-playbook, readme, skill, and skill-parent auto/confirm/presentation assets to kebab-case.
- [ ] Rewrite only path-valued links and pointers in `.opencode/commands/create/` and its external consumer closure.
- [ ] Record every dynamic or generated reference disposition instead of editing it by pattern.

### Phase 3: Verification

- [ ] Compare the final path manifest with all map rows and check exact/casefold/NFC collisions.
- [ ] Resolve every create asset link and exercise each auto/confirm/presentation selection.
- [ ] Confirm command IDs, keys, modes, file modes, and excluded names match BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Rename-map scan reports 30 source rows, 30 targets, and zero unknowns. |
| Reference integrity | Repository path scan and the command-reference checker find no active old asset path or missing target. |
| Mode parity | Auto, confirm, and presentation dispatch paths resolve the same create workflow content as BASE. |
| Exemption safety | Inspect keys, IDs, frontmatter, Python/package, generated, tool-mandated, and frozen surfaces for unchanged names/content. |
| Scope safety | Review the path-scoped diff and verify no sibling command namespace is included. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 020 phase 005 rename/reference tooling | Internal | Required before execution | Manual renames would violate the semantic-map contract. |
| 020 phase 006 frozen map | Internal | Required before execution | Source and target ownership cannot be proven. |
| 000 baseline manifest | Internal | Required before verification | Mode, link, and metadata parity lack a pinned reference. |
| Commands parent handoff | Internal | Required before execution | Sibling ownership and shared asset closure may overlap. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any collision, missing asset, stale active pointer, mode drift, exemption violation, or out-of-scope file change.
- **Procedure**: Stop the batch, revert only the path-scoped create rename/reference commit, restore the pre-change manifest, and rerun the map and reference scan before retrying.
<!-- /ANCHOR:rollback -->
