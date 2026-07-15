---
title: "Tasks: inventory and frozen rename map (017 phase 006)"
description: "Tasks for phase 006 of the 017 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map tasks"
  - "hyphen naming phase 006 tasks"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/006-inventory-and-frozen-map"
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
# Tasks: Inventory and frozen rename map

> **RECONCILED — v4 reconciliation (2026-07-15).** BASE re-pins to the current migration tip (not the authoring SHA); rename entries carry a pending vs already-applied disposition (v4 already landed the sk-git kebab pilot); the generated `.codex/prompts/` surface is classified `generated` (fix at the `sync-prompts.cjs` producer). See spec.md's reconciliation note and the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm predecessor phases landed and the pinned worktree is clean (per this phase's spec adjacency)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 A full repo inventory (recomputed independently of 000) with every exemption applied, taken against the current migration tip
- [ ] T003 A source->target rename map where each entry is pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present)
- [ ] T004 A complete classification: every candidate is exactly one of rename/exempt/frozen/generated/tool-mandated; no "unknown"; rename entries record a pending/already-applied disposition
- [ ] T005 Classify the generated `.codex/prompts/` surface as `generated` (fix at the `sync-prompts.cjs` producer, never hand-rename); flag the 2 snake regressions (`agent_router.md`, `goal_opencode.md`) for a producer fix
- [ ] T006 Partition into dependency-closed batches (reference-graph SCCs) that exclude already-applied surfaces, hashed together with the current-tip BASE
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Verify: The inventory counts only in-scope names with every exemption applied — Vendored/.py/package-dir/generated/tool-mandated names are excluded
- [ ] T008 Verify: Each rename entry is pending or already-applied — pending entries have source present + target absent; already-applied entries (v4's sk-git pilot) have source absent + target present, recorded as such, never flagged as missing sources
- [ ] T009 Verify: Every candidate has exactly one classification with no "unknown" bucket — 0 un-classified candidates; `.codex/prompts/*` classified `generated`
- [ ] T010 Verify: Batches are dependency-closed (reference-graph SCCs) and exclude already-applied surfaces — No batch references a rename in another un-landed batch
- [ ] T011 Verify: The map is hashed together with the current-tip BASE for reproducibility — A stored digest binds the map to the current-tip BASE SHA
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
