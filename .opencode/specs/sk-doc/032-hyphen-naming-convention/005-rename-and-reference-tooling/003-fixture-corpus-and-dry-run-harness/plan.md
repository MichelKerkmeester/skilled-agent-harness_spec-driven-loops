---
title: "Implementation Plan: fixture corpus and dry-run harness (032 phase 005.003)"
description: "Implementation plan for disposable Git fixtures and a deterministic harness that exercises the rename engine and reference checker across semantic, exemption, collision, reference, idempotency, rollback, and zero-scan cases without touching the real migration tree."
trigger_phrases:
  - "fixture corpus implementation plan"
  - "rename dry-run harness plan"
  - "pre-migration fixture testing"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/005-rename-and-reference-tooling/003-fixture-corpus-and-dry-run-harness"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the fixture corpus and dry-run harness implementation plan"
    next_safe_action: "Implement the fixture seed and disposable Git lifecycle"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Every harness run starts from a fresh disposable repository and compares against a captured baseline."
      - "The real migration worktree is never an apply target for fixture tests."
---
# Implementation Plan: Fixture Corpus and Dry-Run Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Disposable Git repositories and engine/checker test harness |
| **Change class** | Verification fixtures and non-mutating preflight tooling |
| **Execution** | Fresh fixture per scenario; explicit apply only inside the disposable repository |

### Overview
The harness seeds a deterministic repository from a scenario definition, records content, path, symlink, and mode baselines,
then invokes the rename engine and reference checker through their documented contracts. It asserts dry-run non-mutation,
explicit apply boundaries, idempotent reruns, journaled rollback, ledger completeness, and fail-closed outcomes for collisions,
missing references, dynamic sites, and zero scans.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 engine and phase 002 checker contracts define inputs, outputs, statuses, and failure semantics.
- [ ] The fixture matrix names every supported reference class and every exemption class from the 032 policy.
- [ ] The harness can create an isolated temporary Git repository and capture its baseline without using the real worktree.

### Definition of Done
- [ ] Positive and negative scenarios cover the full engine/checker contract, including empty scans and dynamic sites.
- [ ] Repeated seeded runs produce the same plans, ledger outcomes, counts, and exit codes.
- [ ] Apply and rollback tests prove the fixture returns to its baseline and the real repository remains untouched.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Scenario-driven test harness with disposable Git repositories and golden baseline assertions.

### Key Components
- **Scenario definitions**: declare paths, file content, modes, symlinks, semantic map rows, expected references, exemptions, and expected result.
- **Repository seeder**: creates a fresh temporary Git repository, writes only fixture content, stages a baseline, and records hashes/modes.
- **Engine runner**: invokes dry-run, explicit apply, rerun, and rollback actions inside the fixture repository.
- **Checker runner**: invokes pre/post state scans and captures ledger rows, scan counts, dynamic dispositions, and exit codes.
- **Assertion layer**: compares content, names, modes, plans, ledgers, counts, and Git status with scenario expectations.

### Data Flow
The harness selects a scenario seed, creates a disposable repository, and captures its baseline. It runs the engine in dry-run
mode first, optionally applies only inside that repository, then runs the checker and ledger assertions. Each scenario ends by
rolling back or deleting the disposable repository and verifying that the real worktree has no mutation from the run.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Semantic map and closure batch | Engine input | Seed explicit safe and unsafe map rows, including mixed extensions | Plan and batch assertions match the scenario |
| Policy exemptions | Engine/checker boundary | Seed Python, package, generated, tool-mandated, test-magic, vendored, and frozen cases | Skip/preserve dispositions are expected and no exempt path moves |
| Reference classes | Checker input | Seed module, docs, data value, shell, registry, symlink, and dynamic references | Resolver and ledger rows cover every scenario reference |
| Filesystem modes | Rename safety | Seed symlink mode `120000` and executable files | Baseline and post-apply manifests match |
| Real migration worktree | Safety boundary | Never use it as a harness apply target | Worktree status/content hashes remain unchanged |
<!-- /ANCHOR:affected-surfaces -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Define the scenario schema, deterministic seed, disposable repository lifecycle, and baseline manifest.
- Add one fixture per supported engine/checker surface before adding combined scenarios.

### Phase 2: Core Implementation
- Add positive, exemption, collision, reference, dynamic-site, zero-scan, idempotency, and rollback scenarios.
- Implement engine/checker runners and assertions for plans, ledgers, exit codes, path state, content, symlink modes, and executable bits.

### Phase 3: Verification
- Run the full matrix twice from the same seed and compare all evidence.
- Confirm the real worktree remains unchanged and every failure scenario fails for the intended reason.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Corpus coverage | One positive and negative scenario per engine/checker contract | Scenario manifest and fixture assertions |
| Integration | Dry-run, explicit apply, checker scan, rerun, ledger, rollback | Disposable Git repositories |
| Determinism | Same seed, repeated plan/ledger/count/exit comparison | Harness repeat mode |
| Safety | Real worktree content, modes, and Git index before/after harness execution | Git status and manifest hashes |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 rename engine | Internal predecessor | Planned | Engine scenarios cannot run |
| Phase 002 reference checker and ledger | Internal predecessor | Planned | Reference and disposition scenarios cannot run |
| Git executable and filesystem metadata | Runtime | Required | Baseline, `git mv`, symlink, and rollback assertions cannot run |
| 032 policy exemption boundary | Internal policy | Defined | Negative fixtures would not prove the correct scope |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A scenario writes outside its temporary repository, produces non-deterministic evidence, or leaves a fixture repository in an unrecoverable state.
- **Procedure**: Stop the harness, remove only the disposable repository and generated evidence, and rerun from the scenario seed. No
  harness action may use rollback or cleanup against the real migration worktree.
<!-- /ANCHOR:rollback -->
