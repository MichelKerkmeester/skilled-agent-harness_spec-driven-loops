---
title: "Checklist: reference checker and disposition ledger (032 phase 005.002)"
description: "Blocking SOL verifier contract for whole-repository reference coverage, path resolution, dynamic-site disposition, ledger completeness, zero-scan failure, and read-only behavior."
trigger_phrases:
  - "reference checker checklist"
  - "disposition ledger verifier"
  - "whole-repo reference SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/002-reference-checker-and-disposition-ledger"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the reference checker and ledger SOL verifier contract"
    next_safe_action: "Run the verifier against the checker fixture matrix after implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Reference Checker and Disposition Ledger

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.002. The verifier pins the candidate SHA, BASE SHA, semantic
map identifier or hash, scanned-file and symlink counts, ledger row counts, commands, and exit codes. It fails on zero scan,
missing coverage, unresolved or ambiguous references, undispositioned dynamic sites, invalid statuses, or unexpected tracked
mutation. The checker is read-only; it must not execute the migration.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001's semantic map fields and operation states are available; the report pins the map identity consumed by the checker.
- [ ] CHK-002 [P1] The scan manifest covers tracked regular files, symlink entries, and every supported reference class; record counts that are greater than zero.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The checker distinguishes filesystem path values from code identifiers, JSON/YAML/TOML keys, and frontmatter fields; boundary fixtures prove no false path finding.
- [ ] CHK-004 [P1] Python files and package directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, and frozen surfaces receive explicit skip or preserve rationale.
- [ ] CHK-005 [P1] The checker is read-only and does not execute repository code, follow symlinked directories, rewrite references, or mutate the Git index.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] JS/TS module references resolve relative, extension, and index cases; missing and ambiguous modules fail non-zero with source locations.
- [ ] CHK-007 [P0] Markdown links, JSON/YAML/TOML path values, shell sourcing/executable paths, registry paths, and symlink targets are found and reconciled against the map.
- [ ] CHK-008 [P0] Every rename-map entry appears exactly once in the ledger with decision, rationale, status, and evidence; no map row is silently dropped.
- [ ] CHK-009 [P0] Every dynamic `require`, `source`, and glob site appears in the ledger with a terminal disposition; an undispositioned site fails non-zero.
- [ ] CHK-010 [P0] A zero-file or wrong-root scan fails non-zero and identifies the scan configuration error instead of passing vacuously.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P1] Pre-rename and post-rename checks distinguish an allowed source path, an expected target path, a preserved exemption, and an unresolved stale reference.
- [ ] CHK-012 [P1] Ledger statuses are validated against the schema; unresolved, ambiguous, stale, and pending rows block acceptance.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] Symlink targets are inspected as data without traversing arbitrary directories or executing sourced modules/scripts.
- [ ] CHK-014 [P2] No executable behavior, allowlist, sandbox boundary, or naming exemption changes outside the checker contract.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-015 [P2] The ledger schema, resolver matrix, dynamic-site rule, zero-scan failure, and exemption boundary agree across `spec.md`, `plan.md`, `tasks.md`, and `decision-record.md`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Checker, ledger, and fixture changes are path-scoped to phase 005.002; no rename or reference rewrite is mixed into the phase commit.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when the scan denominator, resolver observations, map rows, dynamic-site rows, and terminal ledger
statuses reconcile, all P0 checks pass, and the read-only checker leaves the repository unchanged.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the ledger is complete and evidence-bearing, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
