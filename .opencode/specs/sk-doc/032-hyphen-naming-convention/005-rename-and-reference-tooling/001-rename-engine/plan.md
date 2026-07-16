---
title: "Implementation Plan: semantic rename engine (032 phase 005.001)"
description: "Implementation plan for the semantic, exemption-aware git-mv engine: validate the explicit map, derive dependency-closure batches, preflight collisions, execute only on explicit apply, and journal idempotent rollback."
trigger_phrases:
  - "semantic rename engine implementation plan"
  - "dependency-closure rename plan"
  - "git-mv dry-run rollback plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/001-rename-engine"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the semantic rename engine implementation plan"
    next_safe_action: "Implement map validation and closure planning"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "All execution begins with a read-only preflight and a complete operation plan."
      - "The engine is a Git-index-aware operation over one dependency-closed batch at a time."
---
# Implementation Plan: Semantic Rename Engine

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Rename tooling in the isolated 032 worktree |
| **Change class** | Deterministic filesystem rename engine |
| **Execution** | Dry-run first; explicit apply only against a validated semantic map |

### Overview
The engine reads a semantic source-to-target map, validates policy and collisions, and constructs dependency-closure batches
before it can call `git mv`. It emits a stable plan and operation journal, preserves symlink and executable semantics, treats
already-applied entries as idempotent, and exposes an inverse path for rollback. The implementation is specified here; this
authoring pass does not invoke it.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The phase 001 policy and exemption boundary is available as an input contract.
- [ ] Phase 006's semantic map fields and dependency-closure identity are agreed before the engine accepts a map.
- [ ] A disposable Git fixture can represent regular files, symlinks, executable files, leading underscores, and double underscores.
- [ ] Apply and rollback state transitions are defined independently of the eventual CLI surface.

### Definition of Done
- [ ] Dry-run, explicit apply, collision abort, exemption skip, idempotent rerun, and rollback behavior meet the phase requirements.
- [ ] A mixed-extension dependency closure stays in one batch and produces a deterministic operation order.
- [ ] Symlink mode `120000` and executable bits are verified against a pre-operation manifest.
- [ ] The engine emits enough map and operation evidence for phase 002's checker and ledger.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Plan-then-apply, Git-index-aware filesystem operations with a journaled inverse.

### Key Components
- **Map validator**: accepts explicit source/target paths, rejects duplicate or unsafe targets, and validates path boundaries.
- **Policy classifier**: applies the phase 001 exemptions and reports `skip` with a durable reason instead of guessing.
- **Closure planner**: groups mapped paths with their reference dependencies; batch membership is independent of extension.
- **Collision preflight**: checks exact, case-folded, and NFC-normalized target occupancy before any write.
- **Git operation runner**: executes ordered `git mv` operations only after explicit apply, preserving mode and symlink state.
- **State and rollback journal**: records planned, applied, skipped, failed, and reverted entries for idempotent reruns.

### Data Flow
The map enters validation, then policy classification and closure planning. The preflight compares the complete target set with
the repository manifest and emits a deterministic plan. Dry-run stops there; apply executes one closure batch, records each
operation and inverse, and exposes the resulting state to the reference checker.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Semantic rename map | Source of source-to-target truth | Consume explicit entries; do not infer names from characters | Duplicate, unsafe, exempt, and collision cases are reported before apply |
| Dependency/reference graph | Defines batch closure | Keep every connected rename and required reference in one batch, including mixed extensions | A mixed `.ts`/`.json`/`.md` closure is never split by extension |
| Git index and filesystem | Applies the rename | Use `git mv` after a complete preflight; preserve symlinks and executable bits | Before/after mode manifest and Git status match the plan |
| Reference checker and ledger | Downstream consumer | Emit map IDs, operation states, and skipped-path reasons | Phase 002 can reconcile every map row without reinterpreting engine output |
| Exemption boundary | Protects Python, generated, tool-mandated, and frozen names | Skip and report, never normalize by heuristic | Positive and negative exemption fixtures pass |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Define the map schema, path normalization rules, operation states, and closure identity with phase 006.
- Build disposable Git fixtures and capture file type, symlink, mode, and executable-bit baselines.

### Phase 2: Implementation
- Implement map validation, exemption classification, closure batching, and exact/casefold/NFC collision preflight.
- Implement dry-run output, explicit apply, Git operation journaling, idempotent state handling, and inverse rollback.

### Phase 3: Verification
- Run the engine against positive, exempt, collision, symlink, executable, idempotency, and rollback fixtures.
- Verify that dry-run produces zero writes and that a failed preflight produces zero partial renames.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Map validation, exemption classification, target normalization, state transitions | Engine test runner and filesystem test doubles |
| Integration | Git `mv`, closure batching, symlink mode, executable bits, collision preflight | Disposable Git repositories |
| Recovery | Apply, rerun, injected failure, inverse rollback | Journal replay against disposable repositories |
| Manual | Review dry-run plan and operation journal before apply | Human inspection of emitted reports |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 convention and exemptions | Internal policy | Defined | The engine cannot classify safe skips consistently |
| Phase 004 no-new-snake guard | Internal predecessor | Planned predecessor | The migration toolchain lacks the matching regression boundary |
| Phase 006 frozen semantic map | Internal contract | Downstream contract | The engine cannot safely accept the final repository inventory |
| Git worktree and Git index | Runtime | Required | Rename and rollback semantics cannot be verified |
| Reference graph input | Internal data | Required | Per-extension batching could split a closure |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any preflight collision, policy ambiguity, unexpected source/target occupancy, mode mismatch, or failed operation.
- **Procedure**: Abort before writes on preflight failure; after an explicit apply failure, stop, persist the partial state, and replay
  the journal's inverse operations for the completed batch. A cleanly applied batch can be reverted with the same inverse journal
  or by discarding the disposable worktree. The authoring pass never invokes either path on the real repository.
<!-- /ANCHOR:rollback -->
