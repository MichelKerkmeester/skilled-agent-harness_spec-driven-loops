---
title: "Checklist: root-name consumer migration (020 phase 002)"
description: "Checklist for phase 002 of the 020 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration checklist"
  - "hyphen naming phase 002 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Added per-skill P0 fail-closed coexistence checks to the SOL verifier contract"
    next_safe_action: "Verify every active consumer row refuses unsupported or un-migrated names"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Root-name consumer migration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 002. Every item is a check the paired
verify agent runs BEFORE the candidate commit lands; each SOL report pins the candidate SHA, BASE SHA, and rename-map
hash, records commands + exit codes + discovery counts, and fails on zero tests/scenarios or unexpected tracked mutation.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-006 [P0] Predecessor phases have landed and the tracked baseline is pinned to `1ec0ad2947b`; `git status --short` identified only two pre-existing untracked node-version markers before implementation
- [ ] CHK-007 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-008 [P1] `git diff --check` passes across the 19 reviewed implementation and matrix paths; the two node-version markers remain excluded
- [x] CHK-009 [P2] `test_root_name_consumer_matrix.py` proves root aliases change filesystem interpretation only; stable type ids and frontmatter keys remain unchanged
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-001 [P0] `test_root_name_consumer_matrix.py` covers POSIX and Windows separators, typed leaf parity, root-index exclusion and unsupported near-match refusal
- [x] CHK-002 [P0] `git ls-files -s .opencode/skills/sk-doc/scripts/validate_document.py` reports mode `120000`
- [x] CHK-003 [P0] `test-root-name-consumer-matrix.cjs` covers old-only, new-only, coexisting, missing-root and unsupported-index Lane C fixtures
- [x] CHK-004 [P0] `test_category_classification_denumbered.py` passes 14/14 checks across legacy-default and `--enforce-hyphen-target` modes
- [x] CHK-013 [P0] `test_root_name_consumer_matrix.py` derives and covers 13/13 filesystem consumer rows from `consumer-manifest.md`
- [x] CHK-014 [P0] `test_root_name_consumer_matrix.py` verifies classifier, packager, leaf generator, topology and three guards refuse unsupported roots before typing or emission
- [x] CHK-015 [P0] `canonicalSkillScopeSubtree()` returns `null` for unsupported code-quality roots before `resolveDispatch()` selects a checker
- [x] CHK-016 [P0] The 11-family classifier matrix includes `sk-design` and returns `UnsupportedRootError` before discovery
- [x] CHK-017 [P0] The 11-family classifier matrix includes `sk-prompt`; unsupported roots raise before typed lookup
- [x] CHK-018 [P0] The 11-family classifier matrix includes `mcp-code-mode` and `mcp-tooling`; unsupported roots raise before scenario selection
- [x] CHK-019 [P0] The 11-family classifier matrix includes `system-code-graph`; unsupported roots raise before any typed attachment
- [x] CHK-020 [P0] `PlaybookLoadError` blocks missing, coexisting and unsupported roots before Lane C discovery; live counts remain 32/30
- [x] CHK-021 [P0] The manifest records `explicit.ts` as identifier-only; the `system-skill-advisor` filesystem fixture fails at the shared classifier boundary
- [x] CHK-022 [P0] The 11-family classifier matrix includes `system-spec-kit`; unsupported roots raise before fixture enumeration
- [x] CHK-023 [P0] The 11-family classifier matrix includes `cli-external-orchestration`; unsupported roots raise before dispatch
- [x] CHK-024 [P0] `test_root_name_consumer_matrix.py` proves typed old/new parity and `RootCoexistenceError` for both catalog and playbook root pairs
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 [P1] `consumer-manifest.md` retains 18 reviewed rows and corrects `explicit.ts` to identifier-only; 13/13 active filesystem rows have matrix coverage
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-010 [P2] `git diff --check` and the scoped diff show no allowlist, sandbox or executable-permission changes
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-011 [P2] `implementation-summary.md` records delivered behavior, verification and the Git index-lock blocker
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-012 [P1] Renames land in dependency-closed, path-scoped commits on the pinned worktree branch
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the SHAs + map hash, every active
consumer row has fail-closed evidence, and the gate (validate/build/test/link/benchmark as applicable) is green with
discovery-count parity against the 000 baseline.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract and `git diff-index --quiet HEAD --` shows no unexpected
tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
