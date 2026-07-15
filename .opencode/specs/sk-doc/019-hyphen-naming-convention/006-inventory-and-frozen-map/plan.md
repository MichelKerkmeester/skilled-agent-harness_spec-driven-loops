---
title: "Implementation Plan: inventory and frozen rename map (017 phase 006)"
description: "Implementation Plan for phase 006 of the 017 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map implementation plan"
  - "hyphen naming phase 006 implementation plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Reconciled to v4 (current-tip BASE, pending/already-applied, .codex generated)"
    next_safe_action: "Pin BASE to current tip, reconcile already-applied, classify .codex"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Inventory and frozen rename map

> **RECONCILED — v4 reconciliation (2026-07-15).** BASE re-pins to the current migration tip (not the authoring SHA); rename entries carry a pending vs already-applied disposition (v4 already landed the sk-git kebab pilot); the generated `.codex/prompts/` surface is classified `generated` (fix at the `sync-prompts.cjs` producer, never hand-rename). See spec.md's reconciliation note and the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-doc + repo (phase 006) |
| **Change class** | Rename map |
| **Execution** | Isolated worktree pinned to the current migration tip (re-pinned from phase 000's BASE) |

### Overview
Before any rename, the in-scope surface must be frozen into a fully-classified rename map (pending vs already-applied dispositions) partitioned by dependency closure, pinned to the current migration tip. Detailed design is finalized when this phase is picked up for execution against the pinned baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The inventory counts only in-scope names with every exemption applied
- [ ] Each rename entry is pending (source exists, target absent) or already-applied on v4 (source absent, target present) — no both-present/both-absent
- [ ] Every candidate has exactly one classification with no "unknown" bucket
- [ ] Batches are dependency-closed (reference-graph SCCs) and exclude already-applied surfaces
- [ ] The map is hashed together with the current-tip BASE for reproducibility

### Definition of Done
- [ ] A trustworthy, frozen, classified rename map exists with pending/already-applied dispositions
- [ ] Execution batches are dependency-closed and reproducible
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- A full repo inventory (recomputed independently of 000) with every exemption applied.
- A source->target rename map where each entry is pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present), plus the generated `.codex/prompts/` surface classified `generated` (fix at the `sync-prompts.cjs` producer, never hand-rename outputs).
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown". Rename entries additionally record a pending vs already-applied disposition.
- Partition into dependency-closed batches (reference-graph SCCs) that exclude already-applied surfaces, hashed together with the current-tip BASE.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm predecessor phases landed; verify the worktree is clean, pinned to BASE, and scoped.

### Phase 2: Implementation
- A full repo inventory (recomputed independently of 000) with every exemption applied.
- A source->target rename map where each entry is pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present), plus the generated `.codex/prompts/` surface classified `generated` (fix at the `sync-prompts.cjs` producer, never hand-rename outputs).
- A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown". Rename entries additionally record a pending vs already-applied disposition.
- Partition into dependency-closed batches (reference-graph SCCs) that exclude already-applied surfaces, hashed together with the current-tip BASE.

### Phase 3: Verification
- Vendored/.py/package-dir/generated/tool-mandated names are excluded
- Each rename entry is pending (source exists, target absent) or already-applied on v4 (source absent, target present)
- The classification report has 0 un-classified candidates; `.codex/prompts/*` is classified `generated`
- No batch references a rename in another un-landed batch
- A stored digest binds the map to the current-tip BASE SHA
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Vendored/.py/package-dir/generated/tool-mandated names are excluded |
| REQ-002 | Each rename entry is pending (source exists, target absent) or already-applied on v4 (source absent, target present) |
| REQ-003 | The classification report has 0 un-classified candidates; `.codex/prompts/*` classified `generated` |
| REQ-004 | No batch references a rename in another un-landed batch |
| REQ-005 | A stored digest binds the map to the current-tip BASE SHA |
| REQ-006 | `.codex/prompts/*` is classified `generated`; the 2 snake regressions are flagged for a `sync-prompts.cjs` producer fix |
| REQ-007 | The sk-git kebab-pilot surfaces are recorded `already-applied` and excluded from pending batches |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Inherits the 017 program dependencies: the Lane C benchmark harness (regression check), the spec-kit validator
(rebuilt in the worktree), and sk-git for the worktree lifecycle. Phase-specific dependencies are the predecessor
phases named in this phase's spec adjacency.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lands on the dedicated worktree in path-scoped commits, so `git revert` of this phase's commits restores the
prior state (or a stopped, disposable satellite worktree is discarded). No data migration beyond git-reversible
filesystem renames and reference rewrites — except the SQLite handling in phase 013, which is schema-aware.
<!-- /ANCHOR:rollback -->
