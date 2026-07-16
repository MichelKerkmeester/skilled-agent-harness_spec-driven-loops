---
title: "Checklist: inventory and frozen rename map (032 phase 006)"
description: "Checklist for phase 006 of the 032 kebab-case filesystem-naming program: inventory and frozen rename map."
trigger_phrases:
  - "inventory and frozen rename map checklist"
  - "hyphen naming phase 006 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/006-inventory-and-frozen-map"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/006-inventory-and-frozen-map"
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

- [ ] CHK-005 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index
- [ ] CHK-006 [P2] The pinned current-tip BASE SHA and rename-map hash for this phase are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-007 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored
- [ ] CHK-008 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Independently recompute the census; assert each rename entry is pending (source exists, target unique and absent) or already-applied on v4 (source absent, target present) — never fail an already-applied entry as a missing source
- [ ] CHK-002 [P0] Assert every candidate has exactly one classification (no unknowns), rename entries carry a pending/already-applied disposition, and `.codex/prompts/*` is classified `generated`
- [ ] CHK-003 [P0] Assert batches are dependency-closed and exclude already-applied surfaces; hash the map together with the current-tip BASE
- [ ] CHK-012 [P1] Assert the 2 `.codex/prompts/` snake regressions (`agent_router.md`, `goal_opencode.md`) are flagged for a `sync-prompts.cjs` producer fix, not enqueued for a manual rename
- [ ] CHK-013 [P0] Assert every batch carries a complete executable touch-set (source/target, static reference sites, dynamic-reference dispositions, symlink endpoints, producer manifests, read/write sets, dependency + batch hashes) sufficient for compare-and-swap replay
- [ ] CHK-014 [P1] Assert the pin is an immutable epoch record (epoch id, map-base SHA, parent-epoch hash, candidate-set hash, graph hash) and that a post-pin candidate reissues only its affected subgraph without escaping classification
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-004 [P1] Rerun the exact/casefold/NFC collision check at the recorded execution SHA
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-009 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-010 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-011 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch
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
