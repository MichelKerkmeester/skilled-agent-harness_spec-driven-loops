---
title: "Tasks: harden fan-out write containment for shared checkouts"
description: "Ordered tasks and the verification checklist for the containment quarantine mode, the outcome separation, the lineage worktrees and the churn detector."
trigger_phrases:
  - "containment task breakdown"
  - "quarantine implementation tasks"
  - "worktree phase tasks"
  - "containment verification checklist"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: harden fan-out write containment for shared checkouts

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Reproduce the incident as a failing test: a temp repo, a lane that trips containment, a simulated neighbour dirtying tracked files mid-lane, asserting the current guard rewinds them (`runtime/tests/unit/write-containment.vitest.ts`)
- [ ] T002 Add the `containment` block to the fan-out control shape with mode and churn threshold, defaulting to preserve, rejecting an unknown mode (`runtime/lib/deep-loop/executor-config.ts`)
- [ ] T003 [P] Add the runner flag that overrides the config mode, and thread it to the containment call sites (`runtime/scripts/fanout-run.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Phase 2a — quarantine and baseline, satisfying the first two requirements.

- [ ] T004 Write the quarantine tree per finding: manifest, content copy, patch against HEAD and, where a baseline exists, patch against baseline (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T005 Capture baseline content alongside the existing path and hash entries, bounded per file and per lane, marking a path baseline-truncated when it exceeds either bound (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T006 Add the mode parameter and make preserve the remedy that copies and returns, leaving the working tree untouched (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T007 Under restore, target the baseline bytes for a path that was already dirty at baseline, and HEAD only for a path that was clean; a baseline-truncated path preserves regardless of mode (`runtime/lib/deep-loop/write-containment.ts`)
- [ ] T008 Record the finding on the status ledger and the observability stream in both modes, with the quarantine location on the event (`runtime/scripts/fanout-run.cjs`)

Phase 2b — outcome separation, satisfying the third requirement.

- [ ] T009 Move the containment block below artefact validation and the max-iterations policy check so a complete lane is judged on its own artefacts first (`runtime/scripts/fanout-run.cjs`)
- [ ] T010 Settle a complete lane with containment findings as `completed_with_containment_advisory` instead of throwing, carrying the findings on the result (`runtime/scripts/fanout-run.cjs`)
- [ ] T011 Count the new state separately in the pool summary and map it in the ledger status resolver (`runtime/scripts/fanout-pool.cjs`)
- [ ] T012 Accept the new state in the max-iterations policy check, so forced-depth validation is not defeated by a containment finding (`runtime/scripts/fanout-run.cjs`)
- [ ] T013 [P] Add error handling for a failed quarantine write: the finding is still recorded with the write error, and nothing was destroyed in the meantime (`runtime/lib/deep-loop/write-containment.ts`)

Phase 3 — caller and documentation migration, satisfying the sixth requirement.

- [ ] T014 Pass the containment mode from the four command YAMLs and align their inline containment calls with the new signature (`.opencode/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, `deep-review-auto.yaml`, `deep-review-confirm.yaml`)
- [ ] T015 [P] Rewrite the containment paragraph in both loop protocols and the hub SKILL.md bullet that tells operators not to edit a checkout with a live lineage (`deep-research/references/protocol/loop-protocol.md`, `deep-review/references/protocol/loop-protocol.md`, `system-deep-loop/SKILL.md`)
- [ ] T016 [P] Update the containment role line and the fan-out feature catalog entry (`runtime/lib/deep-loop/README.md`, `runtime/feature-catalog/fanout/fanout-run.md`)

Phase 4 — lineage worktrees, satisfying the fifth requirement.

- [ ] T017 Create one detached worktree per lineage from HEAD, named by run and label under the resolved worktree base, and symlink the shared dependency directories into it (`runtime/scripts/fanout-run.cjs`)
- [ ] T018 Seed the worktree with the target packet's uncommitted working-tree content so a lineage can read a spec that is not yet committed (`runtime/scripts/fanout-run.cjs`)
- [ ] T019 Rewrite every path handed to the executor — the rendered prompt's write-surface paths, the artifact-directory override and the per-kind directory flags — to the worktree, and run the directory-flagless kind with the worktree as its working directory (`runtime/scripts/fanout-run.cjs`)
- [ ] T020 Copy the lineage directory back into the main checkout after the lane, and remove the worktree; on a copy-back failure retain the worktree and name it on the failure event (`runtime/scripts/fanout-run.cjs`)
- [ ] T021 Sweep the runner's own ephemeral worktree prefix at startup so an interrupted run does not accumulate checkouts (`runtime/scripts/fanout-run.cjs`)
- [ ] T022 Degrade to the main checkout under forced preserve, with a warning event, when a worktree cannot be created (`runtime/scripts/fanout-run.cjs`)

Phase 5 — churn detection, optional, satisfying the fourth requirement.

- [ ] T023 Sample out-of-lineage tracked churn on the existing progress heartbeat and count newly-dirty paths since the previous sample (`runtime/scripts/fanout-run.cjs`)
- [ ] T024 Emit `shared_checkout_detected` above the threshold and latch preserve mode for the remainder of the run, overriding any restore opt-in (`runtime/scripts/fanout-run.cjs`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T025 Run the deep-loop runtime Vitest suite and read the output and exit status
- [ ] T026 Run the incident reproduction from Phase 1 and confirm it now passes with the neighbour's files byte-identical
- [ ] T027 Run one real research fan-out on the main checkout with a second session editing tracked files, and confirm the tree is untouched and the lane completes
- [ ] T028 Run one fan-out with the worktree option on against an uncommitted packet, and confirm every lineage directory is present in the main checkout afterwards and no worktree remains
- [ ] T029 Grep the five documentation surfaces and the four command YAMLs for the old containment wording and confirm none remains
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or the optional Phase 5 tasks deferred with the operator's agreement recorded in `goal.md`
- [ ] No `[B]` blocked tasks remaining
- [ ] The manual verification runs in T027 and T028 have both been performed on a real checkout
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The problem, the four hardening requirements and their ordering are documented in `spec.md`
- [ ] CHK-002 [P0] The mode seam, the quarantine layout and the worktree lifecycle are defined in `plan.md`
- [ ] CHK-003 [P1] The worktree lane and the containment default are decided in `decision-record.md` before the first line of Phase 4
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runtime type check and lint pass over the changed TypeScript and CommonJS files
- [ ] CHK-011 [P0] The runner emits no unhandled rejection when a quarantine write fails mid-lane
- [ ] CHK-012 [P1] Every new failure path has an error branch that records the finding rather than dropping it
- [ ] CHK-013 [P1] The guard keeps its fail-open posture: no git, bare repo, or artefact directory outside the worktree still returns empty
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every criterion in `acceptance-criteria.md` is met or waived against an existing decision record
- [ ] CHK-021 [P0] The incident reproduction test passes with the neighbour's tracked files byte-identical
- [ ] CHK-022 [P1] The mode-by-path-state matrix is covered, including the eight rows that combine restore with a baseline-dirty in-HEAD path
- [ ] CHK-023 [P1] A quarantine write failure, a baseline-truncated path and a worktree creation failure each have a test
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. The containment remedy is `algorithmic`; the outcome ordering is `class-of-bug`; the caller migration is `cross-consumer`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Search the runtime for every emitter of a containment action or event.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the guard's exported functions, the lane status vocabulary, the fan-out config schema, the four command YAMLs, the loop protocols and the tests.
- [ ] CHK-FIX-004 [P0] Path-handling changes include adversarial table tests: a symlink under the lineage directory pointing at the quarantine target, an outside-root path, a path deleted mid-lane, and a no-op run.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed: mode, path state, artefact completeness and churn, twenty-four rows.
- [ ] CHK-FIX-006 [P1] Hostile env variant executed: the containment tests already strip the git environment redirectors, and the new cases keep that.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential, token or absolute home path is written into a quarantine manifest
- [ ] CHK-031 [P0] The quarantine writer refuses a destination that canonicalizes outside the lineage directory
- [ ] CHK-032 [P1] No containment path deletes a file; preservation remains the only outcome for a not-in-HEAD path
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` describe the same shipped behaviour
- [ ] CHK-041 [P1] The containment module's own header comment describes preserve-by-default rather than the revert-and-fail model
- [ ] CHK-042 [P2] The runtime library README and the fan-out feature catalog entry are updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 0/14 |
| P1 Items | 17 | 0/17 |
| P2 Items | 5 | 0/5 |

**Verification Date**: 2026-09-08
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [ ] CHK-100 [P0] The containment default and the worktree lane are documented in `decision-record.md`
- [ ] CHK-101 [P1] Both decision records carry a status
- [ ] CHK-102 [P1] Both decision records name the rejected alternative and why it lost
- [ ] CHK-103 [P2] The migration path for a caller still passing the old containment signature is documented
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] The churn sampler adds no more than one status invocation per heartbeat per lane
- [ ] CHK-111 [P1] Baseline capture stays inside the per-file and per-lane bounds on a run with a noisy neighbour
- [ ] CHK-112 [P2] A six-lineage worktree run is measured for wall-clock setup cost against the same run without worktrees
- [ ] CHK-113 [P2] The measured setup cost and the disk footprint per worktree are recorded in `implementation-summary.md`
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] The rollback in `plan.md` has been exercised: setting the mode back to restore recovers the previous remedy with no code change
- [ ] CHK-121 [P0] The containment mode and the worktree option are both settable per run, so neither needs a code change to disable
- [ ] CHK-122 [P1] The new ledger events appear in the observability stream with a resolved status, not `unknown`
- [ ] CHK-123 [P1] The manual testing playbook entry for a shared-checkout run exists
- [ ] CHK-124 [P2] An interrupted-run worktree sweep has been observed cleaning up after a killed driver
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] The change has been reviewed against the repository rule that worktree creation is not an autonomous AI decision; the runner's ephemeral lane is justified in `decision-record.md`
- [ ] CHK-131 [P1] No new dependency is introduced; the change uses the Node standard library and the git binary only
- [ ] CHK-132 [P2] The quarantine tree is confirmed not to capture files outside the repository
- [ ] CHK-133 [P2] Quarantine retention is stated so an operator knows what accumulates and where
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All packet documents are synchronized with the shipped behaviour
- [ ] CHK-141 [P1] The guard's exported function signatures are documented where they changed
- [ ] CHK-142 [P2] The operator-facing guidance about editing during a live lineage reflects preserve-by-default
- [ ] CHK-143 [P2] The incident and its resolution are summarized in `implementation-summary.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [ ] Approved | |
| Operator | Deep-loop runtime owner | [ ] Approved | |
| Operator | Verification | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
