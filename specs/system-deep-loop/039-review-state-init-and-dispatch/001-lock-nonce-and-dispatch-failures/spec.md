---
title: "Feature Specification: Phase 1: lock-nonce-and-dispatch-failures"
description: "Three workflow defects from a live deep-review run: the review and council lock releases omit the acquire nonce, a failed dispatch leaves only iteration_file_missing behind, and the review codex branch cleans up an EVENT_DIR it never set."
trigger_phrases:
  - "lock release nonce"
  - "dispatch failed receipt"
  - "verify iteration dispatch failure"
  - "codex branch event dir"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: lock-nonce-and-dispatch-failures

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-05 |
| **Branch** | `worktrees/090-deep-review-okf-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 1 |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each defect has a test that fails on the old code and passes on the fix |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the review state-init and dispatch packet. The three defects came out of a five-iteration `/deep:review:auto` run on packet 050, whose report lists them in its audit appendix (`specs/system-speckit/050-open-knowledge-format-adoption/review/review-report.md`).

**Scope Boundary**: the lock release, the iteration verifier's reading of dispatch receipts, receipt retention across a retry, and the review codex branch's shell tail.

**Dependencies**:
- The dispatch receipts the audited wrapper already writes beside every CLI dispatch.

**Deliverables**:
- Four workflow YAMLs release with the nonce, `verify-iteration.cjs` reports `dispatch_failed`, retries keep earlier receipts, and the codex branch drops its unbound loop.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`step_release_lock` in the review and ai-council workflows passes only `--owner-pid`, but `acquire` stamps a nonce and `release` refuses without it, so the run ends with `released:false` and the lock left on disk. A failed dispatch shows only as `iteration_file_missing`: the wrapper returns 0 by contract and writes a `dispatch_failure` line to the state log, but the next gateway append rebuilds that log from the ledger and the line is gone. A retry under the same dispatch id overwrites the first attempt's receipt. And the review codex branch ends with a loop over `$EVENT_DIR` plus `rm -rf "$EVENT_DIR"`, a variable it never assigns.

### Purpose
A run releases its own lock, says why a dispatch failed, keeps every attempt's record, and never removes a directory it did not create.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--nonce {captured_acquire_nonce}` on every lock release in the review and ai-council workflows, matching the research workflows.
- A `dispatch_failed` reason in `verify-iteration.cjs`, read from the iteration's completion receipt.
- Moving an earlier attempt's receipt pair aside before a retry writes its own.
- Removing the unbound event loop from the review codex branch.

### Out of Scope
- A ledger stem that keeps `dispatch_failure` events in the state log - the receipt already holds the exit, and a stem means schema changes across two ledgers.
- Detecting a CLI that exits 0 after a quota error - the receipt cannot tell that apart from success.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-review-{auto,confirm}.yaml` | Modify | Nonce on release; `dispatch_failed` in the verifier note; auto drops the unbound loop |
| `.skilled/commands/deep/assets/deep-ai-council-{auto,confirm}.yaml` | Modify | Nonce on release |
| `.skilled/commands/deep/assets/deep-research-{auto,confirm}.yaml` | Modify | `dispatch_failed` in the verifier note |
| `.skilled/commands/deep/assets/compiled/*.contract.md` | Modify | Recompiled source digests |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | Modify | Reads the completion receipt when the narrative is missing |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | Keeps an earlier attempt's receipts |
| Three test files, one new | Modify/Create | One case per defect |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every lock release in the six lock-taking workflows passes the nonce | The lock-release test checks all six and releases a real review lock |
| REQ-002 | A missing narrative after a failed dispatch reports `dispatch_failed` with exit, signal and elapsed time | The new verifier test passes, and the 050 run's iteration 3 reads `cli-pi exited 143, after 899 s, at the 900 s executor timeout` |
| REQ-003 | A retry keeps the earlier attempt's receipts | The new receipt test passes |
| REQ-004 | No command block reads `$EVENT_DIR` without assigning it | The new structural test passes over every deep workflow YAML |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression in the deep-loop runtime suite | The full suite's failures match its HEAD baseline |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each new or widened test fails against the pre-fix source and passes against the fix.
- **SC-002**: The compiled command contracts are fresh for every edited workflow.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer reads receipts by a name the archive step changes | Low | The latest attempt keeps the base names, which are the only names the post-dispatch validator reads |
| Risk | `dispatch_failed` is a new reason string | Low | It is non-zero like every other reason, so `redispatch_once` treats it the same |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
