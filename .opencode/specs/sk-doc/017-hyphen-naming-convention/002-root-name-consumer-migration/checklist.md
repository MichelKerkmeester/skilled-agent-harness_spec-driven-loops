---
title: "Checklist: root-name consumer migration (017 phase 002)"
description: "Checklist for phase 002 of the 017 kebab-case filesystem-naming program: root-name consumer migration."
trigger_phrases:
  - "root-name consumer migration checklist"
  - "hyphen naming phase 002 checklist"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/002-root-name-consumer-migration"
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

- [ ] CHK-006 [P0] Predecessor phases have landed and the worktree is clean, pinned to BASE, with an isolated git index
- [ ] CHK-007 [P2] The pinned BASE SHA and rename-map hash for this phase are recorded in the candidate report
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-008 [P1] Changes are scoped to this phase; no adjacent cleanup; exemptions honored
- [ ] CHK-009 [P2] No code identifier / JSON-YAML-TOML key / frontmatter field was altered by a filesystem rename
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-001 [P0] Matrix-test old/new roots on POSIX and Windows paths; the root index is excluded; real leaves never classify as `readme`; near-matches stay negative
- [ ] CHK-002 [P0] Verify the `sk-doc/scripts/validate_document.py` symlink and mode 120000 are preserved after the edit
- [ ] CHK-003 [P0] Run Lane C against old-only, new-only, both, and missing-root fixtures; coexistence and missing-root fail loudly
- [ ] CHK-004 [P0] The inverse guard + redefined tests reject underscore catalog content and accept hyphenated content
- [ ] CHK-013 [P0] Build the fail-closed matrix from the reviewed consumer manifest; every active skill family has a named consumer row and unsupported/un-migrated input fixture
- [ ] CHK-014 [P0] `sk-doc` and its `create-*` packets refuse an un-migrated or unsupported root/index before typing or emission; no generic `readme` result is returned
- [ ] CHK-015 [P0] `sk-code` and nested code packets refuse an unsupported path before routing or quality handling; no unrelated scope is selected
- [ ] CHK-016 [P0] `sk-design` and nested design packets refuse an unsupported root/index before discovery; no empty or unrelated design result is returned
- [ ] CHK-017 [P0] `sk-prompt` and `prompt-improve` refuse an un-migrated name before lookup; no guessed prompt path is returned
- [ ] CHK-018 [P0] `mcp-code-mode` and `mcp-tooling` consumers refuse an unsupported playbook/catalog path before workflow or tool-scenario selection
- [ ] CHK-019 [P0] `system-code-graph` refuses an un-migrated path before graph attachment; no node is linked to a guessed location
- [ ] CHK-020 [P0] `system-deep-loop` and nested deep/runtime packets refuse an unsupported name before scenario discovery; no zero-scenario success or benchmark downgrade occurs
- [ ] CHK-021 [P0] `system-skill-advisor` refuses an un-migrated root/index before inventory or projection; no empty or misrouted skill result is emitted
- [ ] CHK-022 [P0] `system-spec-kit` refuses an unsupported name before runner execution or fixture enumeration; no workflow is silently skipped or misclassified
- [ ] CHK-023 [P0] `cli-external-orchestration` and nested CLI packets refuse an un-migrated name before dispatch; no fallback to another CLI packet occurs
- [ ] CHK-024 [P0] For every row intentionally served by the shared dual-name resolver, recognized old/new reads have typed parity and both physical roots fail with an explicit conflict
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 [P1] The reviewed consumer manifest enumerates every root-name consumer and each is updated
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-010 [P2] No executable behavior or allowlist changed beyond the intended logic/rename; sandbox and gate posture preserved
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-011 [P2] The phase outcome is reflected in the packet docs and the convention doc where applicable
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
