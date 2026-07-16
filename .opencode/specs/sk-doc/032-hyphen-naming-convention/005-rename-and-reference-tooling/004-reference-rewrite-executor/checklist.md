---
title: "Checklist: static reference-rewrite executor (032 phase 005.004)"
description: "Blocking SOL verifier contract for the static reference-rewrite executor: ledger-bounded rewrites, compare-and-swap on the preimage blob, batch isolation, dynamic-site safety, idempotency, and rollback."
trigger_phrases:
  - "reference-rewrite executor checklist"
  - "compare-and-swap rewrite verifier"
  - "reference-rewrite SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the static reference-rewrite executor SOL verifier contract"
    next_safe_action: "Run the verifier against the disposable rewrite fixtures after implementation"
    blockers: []
    key_files: []
    completion_pct: 0
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

- [ ] CHK-001 [P0] The phase 002 ledger and phase 006 map input contracts are available to the executor; cite the reviewed ledger and map schema in the verifier report.
- [ ] CHK-002 [P1] The fixture repository contains each static reference class, an exempt/generated surface, a dynamic site, and a mutated-blob drift case; record the seeded paths and preimage manifest.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] The executor rewrites only sites present in the phase 002 ledger, keyed to a phase 006 map entry; no off-ledger site is touched.
- [ ] CHK-004 [P0] Each rewrite records the preimage blob hash and semantic site ID, and a mismatched preimage regenerates the batch plan instead of applying a stale patch.
- [ ] CHK-005 [P1] Exempt, generated, vendored, and tool-mandated surfaces are never rewritten, and a dynamic site is routed to its producer or flagged with a reason.
- [ ] CHK-006 [P1] The executor alters only static reference values; no code identifier, JSON/YAML/TOML key, or frontmatter field is changed.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Dry-run produces zero filesystem writes, Git index changes, or partial rewrites in a disposable repository.
- [ ] CHK-008 [P0] A mutated-blob fixture never receives the stale textual patch; the verifier records the preimage mismatch and the regenerated plan.
- [ ] CHK-009 [P0] Regenerating one drifted batch touches no site of any other batch; the verifier lists per-batch site membership.
- [ ] CHK-010 [P0] A second run after apply is idempotent: it reports no pending rewrites and does not rewrite already-satisfied sites.
- [ ] CHK-011 [P0] An injected apply failure produces a non-zero result, records the partial state, and replays the inverse journal without hiding the failure.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] Every ledger site has a rewrite state of applied, regenerated, skipped-with-reason, routed-to-producer, or failed-with-evidence; no site is silently dropped.
- [ ] CHK-013 [P1] The rewrite journal is sufficient for the phase 003 harness and the verifier to reconcile preimage, target, batch, and applied state without re-deriving the ledger.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P1] The executor refuses sites outside the supplied repository root and does not follow an exempt or symlinked directory as a rewrite target.
- [ ] CHK-015 [P2] No executable behavior, allowlist, sandbox boundary, or tool-mandated exemption changes outside this phase's executor contract.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-016 [P2] The plan, tasks, and rewrite-state contract describe the same dry-run, compare-and-swap, batch-isolation, dynamic-site, idempotency, and rollback behavior.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P1] Executor implementation and fixture changes are path-scoped to phase 005.004; no migration rewrite is mixed into the phase commit.
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
