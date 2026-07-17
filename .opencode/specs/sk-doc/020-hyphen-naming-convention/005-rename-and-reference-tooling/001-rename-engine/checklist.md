---
title: "Checklist: semantic rename engine (032 phase 005.001)"
description: "Blocking SOL verifier contract for the semantic rename engine: preflight safety, dependency-closure batching, exemptions, dry-run/apply state, idempotency, mode preservation, and rollback."
trigger_phrases:
  - "semantic rename engine checklist"
  - "dependency-closure rename verifier"
  - "rename engine SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the semantic rename engine SOL verifier contract"
    next_safe_action: "Run the verifier against the disposable engine fixtures after implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Semantic Rename Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.001. The verifier records the candidate SHA, pinned BASE
SHA, semantic-map identifier or hash, commands, exit codes, operation counts, and mode-manifest comparison. It fails on a
zero-operation or zero-fixture run, any unexpected tracked mutation, any unreported partial apply, or any real repository
migration attempt.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 004's exemption boundary and phase 006's semantic map input contract are available to the engine; cite the reviewed policy and map schema in the verifier report.
- [ ] CHK-002 [P1] The fixture repository contains regular files, symlinks, executable files, leading/double underscore names, and a mixed-extension dependency closure; record the seeded path and mode manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The engine consumes explicit source-to-target entries and contains no fallback that replaces every underscore with a hyphen.
- [ ] CHK-004 [P0] Batch planning follows dependency closure and keeps a mixed-extension closure intact; verifier output lists closure membership and batch boundaries.
- [ ] CHK-005 [P1] Python files and package directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces are skipped with a reason rather than renamed.
- [ ] CHK-006 [P1] The engine scope is limited to the supplied map and repository root; no code identifier, JSON/YAML/TOML key, frontmatter field, or unrelated path is altered.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Dry-run produces zero filesystem writes, Git index changes, mode changes, or partial renames in a disposable repository.
- [ ] CHK-008 [P0] Exact, case-folded, and NFC-normalized collisions abort before the first write and identify the conflicting map entries.
- [ ] CHK-009 [P0] Symlink mode `120000` and executable bits are identical before and after an explicit apply; the verifier records the manifest delta.
- [ ] CHK-010 [P0] A second run after apply is idempotent: it reports no pending operations and does not rewrite already-targeted paths.
- [ ] CHK-011 [P0] An injected apply failure produces a non-zero result, records the partial state, and replays the inverse journal without hiding the failure.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] Every map entry has an operation state of applied, skipped-with-reason, already-at-target, or failed-with-evidence; no entry is silently dropped.
- [ ] CHK-013 [P1] The dry-run report is sufficient for phase 002 to reconcile source, target, batch, exemption, and operation-state information without re-deriving policy.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P1] The engine refuses paths outside the supplied repository root and does not follow an exempt or symlinked directory as a rename source.
- [ ] CHK-015 [P2] No executable behavior, allowlist, sandbox boundary, or tool-mandated filename exemption changes outside this phase's engine contract.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-016 [P2] The plan, tasks, decision record, and operation-state contract describe the same dry-run, closure, exemption, idempotency, and rollback behavior.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P1] Engine implementation and fixture changes are path-scoped to phase 005.001; no migration rename is mixed into the phase commit.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when every P0 check passes, the semantic map and operation evidence are pinned, all exemption and
mode checks are visible, and the engine has been exercised in disposable repositories without touching the real migration tree.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the operation journal can restore an applied fixture batch, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the phase scope.
<!-- /ANCHOR:sign-off -->
