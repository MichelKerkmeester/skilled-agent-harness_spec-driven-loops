---
title: "Checklist: static reference-rewrite executor (020 phase 005.004)"
description: "Blocking SOL verifier contract for the static reference-rewrite executor: ledger-bounded rewrites, compare-and-swap on the preimage blob, batch isolation, dynamic-site safety, idempotency, and rollback."
trigger_phrases:
  - "reference-rewrite executor checklist"
  - "compare-and-swap rewrite verifier"
  - "reference-rewrite SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-18T08:08:15Z"
    last_updated_by: "codex"
    recent_action: "Verified and signed off the static reference-rewrite executor"
    next_safe_action: "Use the phase 006 frozen map for a reviewed dry-run plan"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_executor.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_reference_rewrite_executor.py"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Static Reference-Rewrite Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.004. The verifier records the candidate SHA, pinned BASE
SHA, semantic-map identifier or hash, ledger identifier, commands, exit codes, rewrite counts, and per-batch preimage results.
It fails on a zero-rewrite or zero-fixture run, any rewrite of an off-ledger site, any stale patch applied over a mismatched
preimage, any unreported partial apply, or any real repository migration attempt.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `load_inputs` consumes the accepted phase 002 ledger and the rename engine semantic-map schema with exact map-byte identity.
- [x] CHK-002 [P1] `test_dry_run_is_deterministic_complete_and_read_only` seeds seven static classes, protected surfaces, a dynamic site and drift input.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-003 [P0] `test_apply_idempotent_rerun_and_rollback_preserve_modes` proves `notes/off-ledger.txt` stays unchanged.
- [x] CHK-004 [P0] `test_blob_drift_regenerates_only_the_selected_scc` proves blob-hash CAS and regeneration.
- [x] CHK-005 [P1] The dry-run harness reports `routed-to-producer` and `skipped-with-reason` with no protected-surface write.
- [x] CHK-006 [P1] The apply test preserves `old_config` key text and `frontmatter_field` while rewriting only reference spans.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Dry-run harness reports `working_tree_unchanged=true` and exit code 0.
- [x] CHK-008 [P0] `test_blob_drift_regenerates_only_the_selected_scc` records `regenerated=true` and applies the current-blob plan.
- [x] CHK-009 [P0] The drift test leaves `config/old_routes.toml` byte-identical outside the selected SCC.
- [x] CHK-010 [P0] `test_apply_idempotent_rerun_and_rollback_preserve_modes` reports zero pending rewrites on rerun.
- [x] CHK-011 [P0] `test_injected_failure_reports_and_replays_inverse_journal` records `failed-rolled-back` and preserves the fixture snapshot.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-012 [P1] Plan and journal states cover `applied`, `regenerated`, `skipped-with-reason`, `routed-to-producer` and `failed-with-evidence`.
- [x] CHK-013 [P1] Journal records include `plan_id`, `batch_id`, preimage, postimage, replacement and per-site state.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] `test_outside_and_symlink_ancestor_sites_are_rejected` passes both root-escape and symlink-ancestor cases.
- [x] CHK-015 [P2] Scope audit shows only the executor core, CLI, tests and this child packet were changed by this child.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-016 [P2] `plan.md`, `tasks.md` and `implementation-summary.md` use the same six-behavior contract.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Child files are scoped to `reference_rewrite_*.py`, `test_reference_rewrite_executor.py` and this packet. No real migration rewrite ran.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when every P0 check passes, the ledger and map evidence are pinned, every compare-and-swap result is
visible, and the executor has been exercised in disposable repositories without touching the real migration tree.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the inverse journal can restore an applied fixture batch, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the phase scope.
<!-- /ANCHOR:sign-off -->
