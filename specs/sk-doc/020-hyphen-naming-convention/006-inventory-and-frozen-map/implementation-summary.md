---
title: "Implementation Summary: inventory and frozen rename map (020 phase 006)"
description: "Phase 006 froze the executable bijective rename map for the kebab-case migration and, verifying it against the real engine, found and fixed a directory-emptying defect plus quadratic planning in the phase-005 apply tooling."
trigger_phrases:
  - "inventory and frozen rename map summary"
  - "hyphen naming phase 006 implementation"
  - "frozen rename map executable"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-18T12:17:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the frozen rename map executable via the fixed rename engine"
    next_safe_action: "Begin phase 007 shared and cross-cutting closures (first destructive phase)"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/frozen-map/frozen-rename-map.json"
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map/frozen-map/verify-frozen-map.mjs"
      - ".opencode/skills/sk-doc/shared/scripts/rename_engine_core.py"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The frozen map's intents are correct; the earlier apply failures were an engine bug, not a map bug"
      - "The full map applies through the fixed engine with zero failures, zero source-left, zero target-missing"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-inventory-and-frozen-map |
| **Completed** | 2026-07-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The migration now has a single executable source of truth for every rename: a frozen, bijective
rename map pinned to the current migration tip. It classifies every in-scope candidate as rename,
exempt, frozen, generated, or tool-mandated (no unknowns), records each rename as pending or
already-applied on v4, carries an immutable epoch record, and ships with an independent verifier.
Verifying the map against the real rename engine surfaced — and this phase fixed — a
directory-emptying defect and quadratic planning in the phase-005 apply tooling.

### The frozen map

`frozen-rename-map.json` holds 3,697 pending renames (553 directories + 3,144 files; zero symlinks),
each with source, target, kind, classification, disposition, and observed SHA, pinned to BASE. The
`.codex/prompts/*` surface is classified `generated`; the two snake regressions there
(`agent_router.md`, `goal_opencode.md`) are flagged for a producer fix, not a manual rename. The pin
is an epoch record (epoch id, map-base SHA, parent-epoch hash, candidate-set hash, graph hash) so a
post-pin candidate reissues only its affected subgraph.

### The verifier

`verify-frozen-map.mjs` re-checks every invariant against the live tree: BASE equals tip, existence
flags match disk, both-present and both-absent are impossible, targets are unique, targets are kebab
(Python exempt), and no unknown classification. Result: PASS, zero violations.

### The engine correction (phase-005 tooling, found here)

The rename engine's apply executor moved every source into a flat staging area deepest-first, then
placed each to its target. That crashes whenever every tracked file under a directory is itself
renamed: staging the files empties the directory, and `git mv` then refuses the empty directory. The
executor was rewritten to rename directories shallowest-first (each move carries its subtree intact)
and then files, rewriting each source to its current on-disk path. Planning was also quadratic on a
whole-repo rename set; indexing existing paths by their normalized forms and testing rename-vacated
paths against a source set cut full-map planning from a >10-minute timeout to about 75 seconds. A
regression test for the all-children-renamed case was added. This correction is committed separately
as a phase-005 tooling fix.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `frozen-map/frozen-rename-map.json` | Created | The executable bijective rename map, pinned and epoched |
| `frozen-map/verify-frozen-map.mjs` | Created | Independent invariant verifier (PASS, 0 violations) |
| `frozen-map/build_frozen_map.py`, `frozen-map/verification-report.txt` | Created | Builder and recorded verification output |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The map was frozen at the current tip and verified statically, then executed against the real engine
on throwaway clones. The engine defect was proven empirically (a fully-renamed subtree aborted with
"source directory is empty"), root-caused to the flat-staging order, fixed, and re-verified end to
end. The whole 3,697-rename map then applied through the fixed engine with zero failures.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the engine, not the map | The map's intents verified correct; the failure was the apply order, so the engine owned the bug |
| Directories-first with cumulative sources | A directory can only move while it still holds tracked entries, so descendants must move after it |
| Verify against the real engine on clones | A static map check cannot prove executability; only a real apply catches an executor defect |
| Optimize planning now | Quadratic planning would make phase 008's per-component runs slow; the fix is on the destructive critical path |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Static map invariants (`verify-frozen-map.mjs`) | PASS, 0 violations across all invariants |
| Engine suite (`test_semantic_rename_engine.py`) | PASS 18/18 (incl. new all-children-renamed regression) |
| Real-engine apply, all-children subtree (`feature_catalog`, 3 dirs / 6 files) | PASS: 9/9, source gone, target present, modes and history preserved |
| Real-engine apply, 11 previously-flagged leaf renames | PASS: 11/11, 0 target-missing |
| Real-engine apply, full map | PASS: `applied=3697`, correct=3697/3697, source-left=0, target-missing=0, mode-delta empty |
| Collision / casefold / NFC check | PASS via engine plan across the full 3,697-entry set |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Full-map apply is a one-time ~9-minute run** (3,697 `git mv` operations with a journaled write
   each). Phase 008 executes per-component batches, which are far smaller; the whole-map apply is a
   verification convenience, not the migration path.
2. **The engine fix is a phase-005 tooling correction** discovered during phase-006 verification. It
   is committed separately and noted against phase 005's continuity.
<!-- /ANCHOR:limitations -->
