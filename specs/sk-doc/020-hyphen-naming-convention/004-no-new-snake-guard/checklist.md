---
title: "Checklist: no-new-snake_case guard (020 phase 004)"
description: "Checklist for phase 004 of the 020 kebab-case filesystem-naming program: no-new-snake_case guard."
trigger_phrases:
  - "no-new-snake_case guard checklist"
  - "hyphen naming phase 004 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/004-no-new-snake-guard"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/004-no-new-snake-guard"
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "SOL verifier contract authored from the design review"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: No-new-snake_case guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 004. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-005 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index — phases 000-003 landed (latest `68c69e3123`); worktree pinned to BASE `1ec0ad2947b` with an isolated git index
- [ ] CHK-006 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report — BASE recorded; rename-map hash is a phase-006 artifact, N/A here
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-007 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored — new guard `check_no_new_snake_case.py` + its fixtures, plus the guard's first genuine catch: the leaked `test-root-name-consumer-matrix.cjs` rename (was snake_case, non-exempt) and its one reference; no adjacent cleanup
- [x] CHK-008 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename — the `.cjs` rename changed only the filename and its one path-string reference; no identifier, key, or frontmatter field touched
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] A synthetic snake_case file fails the guard; a hyphenated one passes — `test_no_new_snake_case_guard.py` fixtures pass (4/4): a synthetic snake_case name fails, a hyphenated one passes
- [x] CHK-002 [P0] Exemption classes (.py, package dir, vendored, generated, tool-mandated) never trip the guard — `test_no_new_snake_case_guard.py` covers `.py`, Python package dirs, vendored, generated (incl `.codex/` mirror), and tool-mandated names as non-tripping
- [x] CHK-003 [P0] The `--changed-since $BASE` mode ignores pre-existing debt; `--all` reports the full census — `check_no_new_snake_case.py --changed-since 1ec0ad2947b` PASSES on the current tree (pre-existing `.mjs` debt ignored); `--all` enumerates the whole tree deterministically
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-004 [P1] Positive + negative fixtures are committed and green — `test_no_new_snake_case_guard.py` positive + negative fixtures pass 4/4
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-009 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved — phase 004 adds a read-only guard + fixtures; no executable behavior or allowlist changed
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-010 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable — `implementation-summary.md` records the guard, its two modes, and the leaked-name catch
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-011 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch — the single `git mv` of `test-root-name-consumer-matrix.cjs` (R-status, history preserved) lands with its reference in this path-scoped commit
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
