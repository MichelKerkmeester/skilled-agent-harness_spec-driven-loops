---
title: "Implementation Plan: command asset and reference closure (032 phase 008/013/009)"
description: "Build a residual ownership map, rename only unassigned maintained command assets, and close every active path pointer against final sibling targets."
trigger_phrases:
  - "command asset closure plan"
  - "residual command file plan"
  - "command reference reconciliation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored command asset plan"
    next_safe_action: "Build the residual asset map after sibling maps"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - "008-component-migration/013-commands/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Command asset and reference closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

This phase is the residual owner for maintained command-surface files and pointers that are not assigned to a namespace or loose-command phase. It first freezes sibling ownership, then scans and classifies the residual set, performs only approved renames, updates active references to final targets, and supplies whole-surface closure evidence.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Sibling maps for 001–008 are present or explicitly marked pending; no row is claimed twice.
- [ ] The complete `.opencode/commands/**` inventory and final target pins are available.
- [ ] Generated, tool-mandated, Python, fixture, and historical boundaries are identified.

### Definition of Done

- [ ] Every residual file and directory has one disposition and an owner.
- [ ] Approved maintained renames and active pointer rewrites are dependency-closed.
- [ ] Path closure, collision checks, link checks, and scoped diff evidence pass before handoff.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The command surface has namespace-owned assets, loose root commands, and special generated/tool infrastructure. Phase 009 is an ownership and pointer-closure layer, not a second namespace migration. Its map is authoritative only for residual maintained files; references into sibling-owned files are rewritten to the sibling's final target and remain attributed to the owning phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Import sibling maps and capture the full `.opencode/commands/**` inventory.
- [ ] Record source revisions, target pins, and the commands-parent handoff.

### Phase 2: Implementation

- [ ] Subtract owned rows and classify residual assets, reference/template files, generated output, tool manifests, fixtures, and exact names.
- [ ] For maintained residuals, reserve kebab-case targets and check exact/casefold/NFC collisions.
- [ ] Apply physical moves and update all active links/pointers in one dependency-closed batch.

### Phase 3: Verification

- [ ] Run link/reference checks and search for old active paths.
- [ ] Inspect generated freshness boundaries and boundary-specific fixture evidence.
- [ ] Compare ownership and residual results with the full inventory and hand evidence to `010-commands-gate`.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Use a full command-surface file inventory, an ownership-uniqueness check, path/link resolution, repository-wide old/new path searches, exact/casefold/NFC collision checks, and the relevant command-reference checker. Generated contracts and negative fixtures require boundary-specific evidence rather than a blanket “all strings changed” assertion.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Naming policy and exemptions | Internal | Required | Residual rows could be assigned the wrong disposition. |
| Direct namespace ownership | Internal | Required before residual assignment | Duplicate physical ownership could occur. |
| Loose root ownership | Internal | Required before residual assignment | Root command paths could be moved twice. |
| `010-commands-gate` rollup | Internal | Required for handoff | The final map and pointer closure lack a blocking acceptance owner. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Capture the residual map, target reservations, and consumer list before any move. If a link or ownership check fails, restore only the 009-owned source/target paths and their reference edits to the captured BASE state; leave sibling-owned changes intact and report the dependency conflict.
<!-- /ANCHOR:rollback -->
