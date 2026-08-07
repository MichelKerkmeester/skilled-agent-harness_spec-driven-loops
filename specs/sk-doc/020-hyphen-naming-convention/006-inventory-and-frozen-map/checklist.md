---
title: "Checklist: inventory and frozen rename map (020 phase 006)"
description: "Checklist for phase 006 of the 020 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map checklist"
  - "hyphen naming phase 006 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/006-inventory-and-frozen-map"
    last_updated_at: "2026-07-18T12:17:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified the frozen map executable end-to-end and signed off every checklist item"
    next_safe_action: "Begin phase 007 shared and cross-cutting closures"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Inventory and frozen rename map

> **RECONCILED — v4 reconciliation (2026-07-15).** BASE re-pins to the current migration tip; rename entries are pending OR already-applied on v4 (the sk-git kebab pilot landed source-absent/target-present) — never fail an already-applied entry as a missing source; the generated `.codex/prompts/` surface is classified `generated`. See spec.md's reconciliation note and the packet's v4-reconciliation-inventory.md.

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 006. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-005 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index — predecessors 000–005 committed through `2bccd03be9`; map `base_sha` pins the current tip; worktree uses an isolated linked-worktree index
- [x] CHK-006 [P2] The pinned current-tip BASE SHA and rename-map hash for this phase are recorded in the candidate report — recorded as `base_sha` plus the `epoch` block (map-base SHA, candidate-set hash, graph hash) in `frozen-rename-map.json`
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-007 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored — change is the `frozen-map/` artifacts plus the separately-committed engine fix; Python, tool-mandated, and generated surfaces are classified, not renamed
- [x] CHK-008 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename — every entry renames a filesystem path only; no key or identifier is a rename target
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] Independently recompute the census; assert each rename entry is pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present) — never fail an already-applied entry as a missing source — `verify-frozen-map.mjs` disk-rechecks every entry: PASS, 0 violations
- [x] CHK-002 [P0] Assert every candidate has exactly one classification (no unknowns), rename entries carry a pending/already-applied disposition, and `.codex/prompts/*` is classified `generated` — `verify-frozen-map.mjs` reports `unknownClass=0`; `.codex/prompts/*` classified `generated`
- [x] CHK-003 [P0] Assert batches are dependency-closed and exclude already-applied surfaces; hash the map together with the current-tip BASE — engine `build_plan` emits dependency-closed batches over pending-only entries; map + BASE bound by `base_sha` and `epoch.graph_hash`
- [x] CHK-012 [P1] Assert the 2 `.codex/prompts/` snake regressions (`agent_router.md`, `goal_opencode.md`) are flagged for a `sync-prompts.cjs` producer fix, not enqueued for a manual rename — both classified `generated` with a producer-fix reason; neither is a pending rename
- [x] CHK-013 [P0] Assert every batch carries a complete executable touch-set (source/target, static reference sites, dynamic-reference dispositions, symlink endpoints, producer manifests, read/write sets, dependency + batch hashes) sufficient for compare-and-swap replay — the full 3,697-rename map applied through the real engine (`applied=3697`, source-left=0, target-missing=0), proving each touch-set is CAS-replayable
- [x] CHK-014 [P1] Assert the pin is an immutable epoch record (epoch id, map-base SHA, parent-epoch hash, candidate-set hash, graph hash) and that a post-pin candidate reissues only its affected subgraph without escaping classification — the `epoch` block carries all five fields; classification is closed (no unknowns)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-004 [P1] Rerun the exact/casefold/NFC collision check at the recorded execution SHA — the full-map engine plan ran the exact/casefold/NFC collision check across all 3,697 targets: `PLAN_EXIT=0`, 0 collisions
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved — the only behavior change is the documented engine correction; the disposable triple opt-in (`.rename-engine-disposable` content + tracked + local `rename-engine.disposable`) is still enforced
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable — recorded in `implementation-summary.md`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-011 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch — `frozen-rename-map.json` defines the dependency-closed batches (`build_plan` batch ids) that phases 007–011 commit path-scoped; no renames land in this freeze phase
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the SHAs + map hash, and the gate
(validate/build/test/link/benchmark as applicable) is green with discovery-count parity against the 000 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
