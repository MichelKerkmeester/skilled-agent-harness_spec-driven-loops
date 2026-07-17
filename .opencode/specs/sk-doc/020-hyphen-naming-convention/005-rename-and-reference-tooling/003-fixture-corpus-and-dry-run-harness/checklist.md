---
title: "Checklist: fixture corpus and dry-run harness (032 phase 005.003)"
description: "Blocking SOL verifier contract for deterministic disposable fixtures, engine/checker dry runs, exemption and collision coverage, reference ledger completeness, idempotency, rollback, and real-worktree safety."
trigger_phrases:
  - "fixture corpus checklist"
  - "dry-run harness verifier"
  - "pre-migration tooling SOL contract"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the fixture corpus and dry-run harness SOL verifier contract"
    next_safe_action: "Run the complete scenario matrix after engine and checker implementation"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Fixture Corpus and Dry-Run Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 005.003. The verifier records the candidate SHA, BASE SHA,
scenario seed or corpus version, scenario counts, commands, exit codes, plan and ledger hashes, fixture baseline manifests, and
the real-worktree before/after status. It fails on missing scenario classes, zero executed scenarios, unexpected writes outside a
temporary repository, non-deterministic evidence, or a harness apply against the real migration worktree.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase 001 and 002 contracts are pinned: map fields, operation states, resolver classes, ledger rows, and failure semantics are recorded with the scenario corpus.
- [ ] CHK-002 [P1] The corpus contains positive and negative scenarios for every engine/checker reference class and every policy exemption; record the non-zero scenario count.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-003 [P0] Each scenario declares its expected map, closure, exemption, reference, dynamic-site, and outcome state; no expected result is inferred from a broad substring search.
- [ ] CHK-004 [P1] The harness creates and removes only disposable repositories and evidence; the real migration worktree is not an apply, rollback, or cleanup target.
- [ ] CHK-005 [P1] Fixtures preserve the policy boundary: Python files and package directories, vendored/third-party trees, generated or lockfile output, tool-mandated names, test-runner magic, frozen surfaces, identifiers, and keys are not treated as ordinary rename targets.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-006 [P0] The corpus covers explicit semantic targets, leading/double underscores, exact/case-fold/NFC collisions, dependency-closure batches, symlink mode `120000`, and executable bits.
- [ ] CHK-007 [P0] Dry-run leaves fixture content, path names, Git index, symlink modes, executable bits, and the real worktree unchanged.
- [ ] CHK-008 [P0] Explicit apply changes only mapped fixture paths; rerun is idempotent; rollback restores the complete fixture baseline.
- [ ] CHK-009 [P0] JS/TS, Markdown, JSON/YAML/TOML path values, shell, registry, symlink, and dynamic `require`, `source`, and glob scenarios produce the expected checker and ledger evidence.
- [ ] CHK-010 [P0] Collision, missing-target, ambiguous-reference, undispositioned dynamic-site, and zero-scan scenarios fail non-zero for the intended reason.
- [ ] CHK-011 [P1] Two runs from the same seed produce identical plans, ledger statuses, scan counts, mode manifests, and exit codes.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-012 [P1] The harness reports scenario-level evidence that phase 006 can use before freezing the repository rename map.
- [ ] CHK-013 [P1] No scenario passes solely because the engine or checker scanned zero files or skipped an unrecognized reference class.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-014 [P1] The harness rejects an apply target outside its temporary repository and never executes fixture shell/module code to discover references.
- [ ] CHK-015 [P2] No executable behavior, allowlist, sandbox boundary, or tool-mandated filename exemption changes outside this phase's harness contract.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-016 [P2] The scenario matrix, seed/determinism rule, fixture boundary, and no-real-migration rule agree across `spec.md`, `plan.md`, and `tasks.md`.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-017 [P1] Fixture and harness changes are path-scoped to phase 005.003; no production migration rename or reference rewrite is mixed into the phase commit.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is accepted only when every P0 scenario and safety check passes, repeated seeded runs are deterministic, rollback
restores the fixture baseline, and the real migration worktree remains untouched.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the scenario evidence is non-empty and reproducible, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation outside the phase scope.
<!-- /ANCHOR:sign-off -->
