---
title: "Implementation Plan: static reference-rewrite executor (020 phase 005.004)"
description: "Implementation plan for the CAS-protected static reference-rewrite executor: load the disposition ledger and semantic map, plan per-site rewrites keyed to preimage blob hashes, apply one dependency-closed batch at a time, and regenerate rather than force-apply when a blob drifts."
trigger_phrases:
  - "reference-rewrite executor implementation plan"
  - "compare-and-swap rewrite plan"
  - "preimage blob rewrite plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/005-rename-and-reference-tooling/004-reference-rewrite-executor"
    last_updated_at: "2026-07-18T08:08:15Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified every planned executor phase"
    next_safe_action: "Use the phase 006 frozen map to generate a reviewed dry-run plan"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_core.py"
      - ".opencode/skills/sk-doc/shared/scripts/reference_rewrite_executor.py"
      - ".opencode/skills/sk-doc/scripts/tests/test_reference_rewrite_executor.py"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The executor is a plan-then-apply operation over one dependency-closed batch, gated by a preimage compare-and-swap."
      - "A drifted blob regenerates its batch's rewrite plan; it never receives a stale textual patch."
---
# Implementation Plan: Static Reference-Rewrite Executor

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Rename tooling in the isolated 020 worktree |
| **Change class** | Deterministic, compare-and-swap-protected static reference rewriter |
| **Execution** | Dry-run first; explicit apply only against a validated ledger, map, and matching preimage blobs |

### Overview
The executor reads the phase 002 disposition ledger and the phase 006 semantic map, then builds a per-site rewrite plan in which
every site carries its preimage blob hash and a stable semantic identifier. It applies one dependency-closed batch at a time. At
apply, each site's current blob is compared against the recorded preimage; a match rewrites the static reference, a mismatch
regenerates that batch's plan from the current blob rather than applying a stale patch. Dynamic sites are routed to their producer
or flagged. The executor emits a rewrite journal, is idempotent, and exposes an inverse path for rollback. The completed
implementation was exercised only in disposable Git fixtures and never against this migration tree.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase 002 ledger schema is consumed through `load_inputs` and its accepted-ledger validator.
- [x] Fixture semantic maps use the phase 006 schema and checker-owned `reference-graph-scc` batch identity.
- [x] `test_dry_run_is_deterministic_complete_and_read_only` covers all seven static classes plus exempt and dynamic surfaces.
- [x] `apply_plan`, `_regenerate_file_sites`, and `rollback_plan` define the state transitions behind the CLI.

### Definition of Done
- [x] `ReferenceRewriteExecutorTests` passes 9/9 for dry-run, apply, CAS regeneration, skips, rerun and rollback.
- [x] `test_blob_drift_regenerates_only_the_selected_scc` proves stale-patch rejection and cross-batch isolation.
- [x] The dry-run harness reports `routed-to-producer` and `skipped-with-reason` without a dynamic write.
- [x] `test_injected_failure_reports_and_replays_inverse_journal` verifies preimage, postimage, batch and per-site state evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plan-then-apply static reference rewriting with a per-site compare-and-swap guard and a journaled inverse.

### Key Components
- **Ledger and map loader**: ingests the phase 002 static reference sites and the phase 006 map; rejects a site with no map entry.
- **Preimage planner**: records each site's current blob hash and semantic ID, and groups sites by dependency-closed batch.
- **Compare-and-swap gate**: at apply, matches current blob to recorded preimage; a mismatch defers the site to batch regeneration.
- **Static rewriter**: rewrites only the dispositioned static reference classes; it never edits identifiers, keys, or frontmatter.
- **Dynamic-site router**: routes a dynamic reference to its producer or flags it with a reason instead of guessing a path.
- **State and rollback journal**: records planned, applied, regenerated, skipped, and reverted sites for idempotent reruns.

### Data Flow
The ledger and map enter the loader, which pairs each static site with its map entry. The preimage planner hashes each site and
partitions batches. At apply, the compare-and-swap gate confirms each blob; matched sites are rewritten and journaled, mismatched
sites drop into batch regeneration. Dynamic sites exit to the router. Dry-run stops after planning; apply commits one batch and
exposes the resulting state to the harness and verifier.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Disposition ledger | Source of dispositioned static reference sites | Consume static sites and IDs; never rewrite an undispositioned site | Every rewrite cites a ledger site ID; no off-ledger site is touched |
| Semantic map | Source of source-to-target truth | Rewrite references to the map's target only | Each rewrite cites the satisfied map entry |
| Reference file blob | Compare-and-swap subject | Verify the preimage before writing; regenerate on mismatch | A mutated-blob fixture regenerates rather than force-applying |
| Dependency-closed batch | Isolation unit | Rewrite one SCC at a time; regenerate a drifted batch alone | A drifted batch's regeneration touches no other batch |
| Exemption and dynamic boundary | Protects frozen/generated/tool-mandated and dynamic sites | Skip or route; never patch a guessed dynamic path | Positive and negative exemption/dynamic fixtures pass |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Define the rewrite-plan schema, preimage hashing rule, batch identity, and state transitions with phases 002 and 006.
- Build disposable Git fixtures for each static reference class, an exempt/generated surface, a dynamic site, and a mutated-blob drift case.

### Phase 2: Implementation
- Implement ledger/map loading, preimage planning, batch partitioning, and the compare-and-swap apply gate.
- Implement static rewriting, dynamic-site routing, dry-run output, explicit apply, rewrite journaling, idempotent state, and inverse rollback.

### Phase 3: Verification
- Run the executor against static-class, exemption, dynamic-site, drift/regeneration, idempotency, and rollback fixtures.
- Verify that dry-run produces zero writes and that a mismatched preimage never applies a stale textual patch.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Ledger/map loading, preimage hashing, batch identity, state transitions | Executor test runner and filesystem test doubles |
| Integration | Static rewriting, compare-and-swap apply, batch isolation, dynamic-site routing | Disposable Git repositories |
| Drift | Mutated-blob regeneration, cross-batch isolation, idempotent rerun | Disposable repositories with injected concurrent edits |
| Recovery | Apply, injected failure, inverse rollback | Journal replay against disposable repositories |
| Manual | Review dry-run rewrite plan and journal before apply | Human inspection of emitted reports |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 disposition ledger | Internal contract | Available and exercised | The executor has no dispositioned static sites to rewrite |
| Phase 006 frozen semantic map | Internal contract | Fixture schema exercised, real map pending | The executor cannot bind a rewrite to a validated target |
| Phase 001 rename engine | Internal predecessor | Available and exercised | Path moves and reference rewrites cannot be sequenced into one closure |
| Disposable fixture harness | Internal evidence | Available and exercised | The executor lacks a disposable proving ground |
| Git worktree and Git index | Runtime | Required | Compare-and-swap and rollback semantics cannot be verified |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any preimage mismatch that cannot be regenerated, an undispositioned or exempt site reached during apply, or a failed rewrite operation.
- **Procedure**: In dry-run, stop with the plan and no writes. After an explicit apply failure, persist the partial state and replay the
  journal's inverse rewrites for the completed batch. A cleanly applied batch can be reverted with the same inverse journal or by discarding
  the disposable worktree. Verification never invoked either path on the real repository.
<!-- /ANCHOR:rollback -->
