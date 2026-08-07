---
title: "Checklist: reference checker and disposition ledger (020 phase 005.002)"
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

- [x] CHK-001 [P0] `test_map_hash_is_bound_to_exact_map_bytes` proves the ledger pins BASE and the engine map's exact byte hash.
- [x] CHK-002 [P1] `test_complete_matrix_emits_cas_ready_read_only_ledger` records 18 tracked files, 17 regular files and 1 symlink.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `test_complete_matrix_emits_cas_ready_read_only_ledger` excludes `old_config` and `snake_case_identifier` while resolving frontmatter path values.
- [x] CHK-004 [P1] `m-python`, `m-tool`, `m-generated` and `m-frozen` finish with evidence-bearing preserve rows.
- [x] CHK-005 [P1] `git_snapshot` matches before and after the full fixture scan; production code contains no filesystem write path.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-006 [P0] `test_ambiguous_extension_and_index_resolution_fails` and `test_missing_mapped_source_fails_with_map_location` prove non-zero failures with site or map evidence.
- [x] CHK-007 [P0] `test_complete_matrix_emits_cas_ready_read_only_ledger` covers all 7 resolver kinds plus JSON, YAML, TOML and frontmatter values.
- [x] CHK-008 [P0] The full fixture reconciles 13/13 engine map entries in original order with rationale, status and evidence.
- [x] CHK-009 [P0] `test_dynamic_sites_require_disposition` proves the full fixture dispositions dynamic require, source and glob rows; its first undispositioned run exits 2.
- [x] CHK-010 [P0] `test_zero_tracked_files_is_a_hard_failure` exits 2 with the `zero files` diagnostic.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P1] `test_post_state_rejects_stale_source_reference` and the accepted pre-state fixture distinguish source, target, preserve and stale outcomes.
- [x] CHK-012 [P1] `validate_ledger` blocks `unresolved`, `ambiguous`, `stale`, `pending` and `invalid`; 5 failure-gate tests exercise those paths.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-013 [P1] `test_complete_matrix_emits_cas_ready_read_only_ledger` proves the mode-120000 fixture hashes the stored link text and keeps the repository snapshot unchanged.
- [x] CHK-014 [P2] `git status --short` shows no checker change outside the shared script, shared test and child packet paths.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P2] `LEDGER_SCHEMA_VERSION = 1`, `DYNAMIC_DISPOSITIONS` and the resolver fixtures match the four child contract documents.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-016 [P1] `reference_checker*.py` and `test_reference_checker.py` add read-only checker behavior only; no real rename or rewrite command ran.
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
