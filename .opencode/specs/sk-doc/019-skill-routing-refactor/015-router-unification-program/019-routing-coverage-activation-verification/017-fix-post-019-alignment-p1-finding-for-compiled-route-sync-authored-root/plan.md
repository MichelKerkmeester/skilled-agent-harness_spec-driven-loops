---
title: "Implementation Plan: Compiled-Route Sync Authored-Root Repair"
description: "Trace the renumbered authored closure, stage it beside the serving root, verify it without spec reads, and atomically publish it with rollback retained."
trigger_phrases:
  - "compiled route sync repair plan"
  - "atomic promoted closure rebuild"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/019-routing-coverage-activation-verification/017-fix-post-019-alignment-p1-finding-for-compiled-route-sync-authored-root"
    last_updated_at: "2026-07-26T07:59:02Z"
    last_updated_by: "opencode"
    recent_action: "Completed live publication, backup cleanup, metadata reconciliation, and strict validation."
    next_safe_action: "No packet-local work remains."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Compiled-Route Sync Authored-Root Repair

<!-- SPECKIT_LEVEL: 3 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Stack** | Node.js CommonJS, filesystem promotion |
| **Source** | Current spec-authored compiled-routing phases |
| **Serving** | Stable `.opencode/bin/lib/compiled-routing` root |
| **Testing** | Node test runner, sync check/verify, serving status, parity gates |

The sync tool will trace the current authored resolver at `014-runtime-engine`, copy the touched closure with current relative phase names into a sibling staging directory, verify that staged resolver without spec reads, and then atomically rename the staged directory into the stable serving root. The prior closure remains as a rollback sibling until publication succeeds.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Missing old source root reproduced.
- [x] Current authored phase topology identified from the live tree and rename history.
- [x] Runtime consumers of old promoted paths inventoried.

### Definition of Done

- [x] Read-only sync check resolves seven hubs.
- [x] Staged closure verifies before publication.
- [x] Runtime status and route tests pass after publication.
- [x] Frozen scorer hashes remain unchanged.
- [x] Strict packet validation passes with rollback evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Verified staging with atomic directory publication, publication-bound exact rollback, fixed writer exclusion, and baseline-aware three-way reconciliation.

### Data Flow

`authored resolver -> traced closure -> staged verification -> shared lease -> atomic publish -> three-way reconciliation -> terminal receipt -> unlock`

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Sync source constants | Point at removed tree | Target current parent and `014-runtime-engine` | `--check` |
| Authored rollout inputs/manifests | Missing one workflow input and three current identities | Synchronize to current hub sources | Seven-hub source trace |
| Promotion algorithm | Deletes serving root before copy | Stage, verify, atomic swap, retain rollback | Failure-path and integration tests |
| Runtime path consumers | Import old internal phase numbers | Move to current internal numbers | Node tests and exact-text search |
| Activation manifests | Serving authority and policy identity | Preserve bytes/state | Capture/restore tests and status |
| Publication lifecycle | No cross-command identity or writer exclusion | Bind rollback, serving root, fingerprints, and lock to one publication | Hostile path, lock, finalize, and revert tests |
| External activation state | Copy-forward after publication | Reconcile against baseline and halt on two-sided divergence | One-sided and divergent-write tests |
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Read-Only Topology Repair

- Add the registered CLI workflow input and refresh the three authored selected-policy identities from compiled snapshot evidence.
- Update authored-root and resolver constants.
- Update closure tracing and manifest metadata for the flattened current source.
- Add a regression asserting the current source exists and `--check` resolves all hubs.

### Phase 2: Atomic Promotion

- Parameterize trace/verify roots so staging can be verified before publication.
- Copy into a unique sibling staging directory.
- Rename current serving root to rollback, then staging to serving; restore rollback on publication failure.
- Retain a shared sibling lease and publication-state binding while rollback is active.
- Reconcile external manifests against captured baseline fingerprints; never propagate deletions automatically.
- Bind rollback to ordered closure paths, modes, and file-content hashes.
- Remove rollback or the displaced root before unlock; retain terminal state as the retry receipt.
- Retry verified staging installation before retaining staging and rollback for manual recovery.

### Phase 3: Consumer Migration And Verification

- Update runtime CLIs, manifest helper, and tests to current internal phase paths.
- Run the operator-approved build only after separate authorization.
- Run check, verify, status, route/manifest tests, frozen-scorer checks, and strict packet validation.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Root/path constants and external manifest preservation | `node --test` |
| Integration | Authored trace, staged build, promoted verification | sync CLI modes |
| Regression | Serving status and route behavior | compiled-route status and existing parity suites |
| Safety | No spec imports and frozen scorer hashes | existing drift guards |
| Packet | Documentation consistency | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Current authored closure phases | Green | Cannot rebuild runtime closure |
| Existing promoted closure | Green | Continues serving until atomic publish |
| Operator approval for serving-root replacement | Green; recorded before publication | Required before live build and final status gates |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Staged verification fails, publish rename fails, post-publish verification fails, or route/status output changes.
- **Procedure**: Before publication, delete only the failed staging sibling. During publication, validate the shared lease and publication binding, reconcile one-sided external state, and rename the retained prior closure back to `.opencode/bin/lib/compiled-routing`. On reconciliation divergence or failed revert verification, retain both recoverable roots and abort cleanup. If all serving-path renames fail, retain verified staging, rollback, terminal state, and the lease for manual recovery.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Current authored phases -> traced staging closure -> staged verification
                                                     |
Existing serving closure -> retained rollback -------+-> atomic publication -> post-publish gates
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Source tracing | Current authored phases | Closure inventory | Staging |
| Staging | Closure inventory | Candidate runtime root | Verification |
| Verification | Candidate runtime root | Publish approval evidence | Publication |
| Publication | Operator approval | New serving root plus rollback | Final gates |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Repair read-only source tracing.
2. Implement and test staging verification.
3. Migrate bounded runtime consumers.
4. Obtain operator approval and publish atomically.
5. Run post-publish status, parity, kill-switch, and scorer gates.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Source Reconnected | Complete: `--check` resolves seven hubs |
| M2 | Staging Safe | Complete: isolated candidate verifies before publication |
| M3 | Runtime Published | Complete: atomic swap succeeded with rollback retained through post-publish gates |
| M4 | Closure Verified | Complete: live status, parity, kill-switch, scorer, and no-spec-read gates passed before finalize |
<!-- /ANCHOR:milestones -->

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm source and serving roots before each mutation.
- Confirm frozen scorer files remain outside the edit set.
- Record the exact rollback sibling before publication.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Source first | Trace and verify current authored files before copying. |
| No partial publish | Never mutate the live root until staging passes. |
| Stop on drift | Halt on any routing, manifest, or scorer mismatch. |

### Status Reporting Format

Report the current milestone, commands run, exact pass/fail evidence, serving-root state, and rollback path.

### Blocked Task Protocol

If publication approval, source integrity, or parity evidence is missing, leave the live root unchanged, preserve staging evidence, and report the blocking decision.
