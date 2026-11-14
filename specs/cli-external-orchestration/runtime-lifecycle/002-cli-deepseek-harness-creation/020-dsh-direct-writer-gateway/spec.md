---
title: "Feature Specification: Phase 20: dsh-direct-writer-gateway"
description: "Three deep-loop writers still append straight into a state log that the append gateway rebuilds from its ledger, so a dispatch failure, a receipt write failure and the post-dispatch executor audit all vanish at the next refresh. This phase routes them through the gateway as phase 019 did for the opening row, with two new research stems and one survival test per writer."
trigger_phrases:
  - "dsh direct writer gateway"
  - "phase 20 dsh direct writer gateway"
  - "dispatch failure row lost on refresh"
  - "record executor audit gateway"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: dsh-direct-writer-gateway

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/394-dsh-executor-identity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-dsh-single-executor-hardening |
| **Successor** | None |
| **Handoff Criteria** | The two named executor-audit test files print `Tests  85 passed (85)`, the typecheck exits 0, the stem census prints `"registered":88` and the contract drift check prints `[CONTRACT DRIFT] OK commands=3` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the DeepSeek Harness creation specification. Phase 019 made the pre-dispatch executor row reach the ledger. The operator chose on 2026-11-14 to do the same for the three writers phase 019 left out.

**Scope Boundary**: the three named writers and what carrying their rows needs: the review gateway's row filter, two research stems, the four review and research workflow YAMLs and their compiled contracts. Other direct writers stay out, as section 3 lists.

**Dependencies**:
- Phase 019 committed as `55d2f35341`, because this phase reuses its `ledgerModeFor` and `appendThroughGateway` and matches its text

**Deliverables**:
- The three writers hand their rows to the gateway on a ledger-backed state log, with one survival test each for review and research
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In a deep review or deep research run, the JSONL state log beside a `deep-review-ledger/frames` or `deep-research-ledger/frames` folder is a projection. The append gateway rewrites the whole file from the ledger after every append, so a row written straight into it lasts only until the next append. `emitDispatchFailure`, `emitReceiptWriteFailure` and the post-dispatch `record_executor_audit` step still write straight into the file, so a run's record of a failed dispatch, a lost receipt or the executor that ran an iteration is gone one step later.

### Purpose
On a ledger-backed state log, every row these three writers produce reaches the ledger and is still in the state log after any later refresh, and a state log with no ledger beside it gets the same bytes as today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
A scratch script opened a real review run and a real research run through the gateway, called each writer, then appended the leaf's iteration record through the gateway. It ran against this worktree on 2026-11-14 with phase 019's edits in place. The last field shows what the gateway says when it is handed a dispatch failure row today.
```text
$ node --import <tsx> scratchpad/probe/measure.mts <worktree>
review: dispatch_failure rows before refresh=1 after refresh=0; iteration rows with executor before refresh=1 after refresh=0; gateway on a raw dispatch_failure row: 1 {"ok":false,"phase":"runtime","reason":"Unrecognized event format: expected object with stem or event_type","code":"RUNTIME_ERROR"}
research: dispatch_failure rows before refresh=1 after refresh=0; iteration rows with executor before refresh=1 after refresh=0; gateway on a raw dispatch_failure row: 1 {"ok":false,"phase":"runtime","reason":"Legacy deep-research record refused: unknown-legacy-record","code":"RUNTIME_ERROR"}
$ node --import <tsx> scratchpad/probe/receipt.mts <worktree>
review: dispatch_receipt_write_failed rows before refresh=2 after refresh=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Hand the dispatch failure row and the receipt write failure row to the append gateway when the state log sits beside ledger frames, and write them directly as today otherwise.
- Carry both rows in review whole under the existing `deep_review.iteration_recorded` stem, and in research under two new reducer-read stems, `deep_research.dispatch_failure` and `deep_research.dispatch_receipt_write_failed`.
- Make the `record_executor_audit` step call `appendExecutorAuditToLastRecord`, which on a ledger-backed log records the executor on the iteration's opening row through the gateway, at most once per iteration.
- Pass the run's session id to all sixteen audited runner calls and both audit steps, so the gateway scopes each row to its run.
- Compare a repeated dispatch failure by content, because the projection writes the executor object back with sorted keys.

### Out of Scope
- The `verification_degraded` row from `post-dispatch-validate.ts` and the `containment_violation` and `containment_contested` rows from `write-containment.ts` - they also write straight into the state log, but the operator named three writers, so they are raised in section 7 and not changed.
- The research prompt pack's sentence that the workflow patches the iteration record with the executor block - it is guidance for the leaf, and on a ledger-backed log the executor now lands on the opening row, so section 7 asks whether to reword it.
- The `executor_missing` check in `validateIterationOutputs` - the executed gate is `verify-iteration.cjs`, which does not read the executor, and section 7 asks what the documented validator should accept.
- A hub changelog entry and version bump - section 7 asks how the operator wants this phase released.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modify | `sessionId` on the runner input, `appendFailureRow` and `canonicalJson`, both failure writers through the helper, every runner failure call passing the session id, and the ledger branch of `appendExecutorAuditToLastRecord` |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modify | The review gateway accepts the two failure rows under `deep_review.iteration_recorded` |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Register the two stems with their data types, census entries, wire types and scope |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | Modify | Required and optional data fields and scope fields for the two stems |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | Modify | Map the two legacy event names to the stems and carry the rows field for field |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | Modify | Write the two rows back in the runner's key order |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | Modify | Route the two stems to no plane in the plane map and three switches |
| `.skilled/commands/deep/assets/deep-review-auto.yaml`, `deep-review-confirm.yaml`, `deep-research-auto.yaml`, `deep-research-confirm.yaml` | Modify | The audit step names its call and session id, and each audited runner call passes the session id |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown`, `deep-research.contract.markdown`, `deep-ai-council.contract.markdown` | Regenerate | The contracts pin each workflow's digest |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/executor-audit-ledger-projection.vitest.ts` | Modify | One survival test per writer for review and research, and the no-session fallback |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-ledger-schema.vitest.ts` | Modify | Fixtures and round-trip cases for the two stems |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/check-ledger-stem-producers.vitest.ts` | Modify | The pinned stem census counts 88 registered and 65 reserved |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A dispatch failure on a ledger-backed state log, with a session id, reaches the ledger and survives a refresh, in review and in research | The two `keeps one ... dispatch_failure row through a projection refresh` cases in `executor-audit-ledger-projection.vitest.ts` pass, and fail with today's writer |
| REQ-002 | A receipt write failure on a ledger-backed state log survives a refresh, one row per receipt, in review and in research | The two `keeps the ... receipt write failure rows` cases pass and read the phases `intent` then `completion` |
| REQ-003 | The post-dispatch audit on a ledger-backed state log leaves exactly one executor-bearing opening row for the iteration after a refresh, and a second audit changes nothing | The two `keeps the ... post-dispatch executor audit` cases pass |
| REQ-004 | Research carries both failure rows losslessly: the projection writes back the same fields in the same key order | The two new round-trip cases in `deep-research-ledger-schema.vitest.ts` pass, and that file prints `Tests  54 passed (54)` |
| REQ-005 | A state log with no ledger beside it gets the same rows as today from all three writers | `tests/unit/executor-audit.vitest.ts` still prints 75 passed with no test changed |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Recording a failure never throws. With no session id, or when the gateway refuses, the row is written directly and one stderr line says the next refresh drops it | The `writes a failure row straight into a ledger-backed log` case passes |
| REQ-007 | A repeated identical dispatch failure adds no second row on a ledger-backed log, although the projection reorders the executor's keys | The dispatch case's second call leaves one row |
| REQ-008 | Every audited runner call and both audit steps in the four workflows pass the run's session id, and the compiled contracts match the workflows | The E15 script prints the counts 7, 1, 7 and 1, and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3` |
| REQ-009 | The two research stems are registered and declared reserved | `check-ledger-stem-producers.cjs` prints `"ok":true` with `"registered":88` and `"reserved":65`, and `npm run typecheck` exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/executor-audit.vitest.ts tests/unit/executor-audit-ledger-projection.vitest.ts` prints `Tests  85 passed (85)`, up from 78.
- **SC-002**: The same command run with only the new tests applied prints `6 failed | 4 passed (10)`, so each survival case proves a loss that happens today.
- **SC-003**: `npm run typecheck` exits 0 and `check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 019's helpers and its text, committed as `55d2f35341` | Five search texts count 0 without them | The plan's count script checks every search text before any edit |
| Risk | Each failure row now spawns the gateway, about one second per row in the tests, on a path that is already failing | Low | Only ledger-backed logs pay it, and phase 019 accepted the same cost for the opening row |
| Risk | A research row with a `detail` longer than 4,096 characters fails the `prose` rule, so the gateway refuses it | Low | The writer falls back to the direct write and says so on stderr. Today's details are one-line messages |
| Risk | A ledger that holds one of the two new research stems does not replay on a runtime without them | Med | Section 7 of `plan.md` names the revert check, and the stems are additive |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should review carry the failure rows under a dedicated stem instead of `deep_review.iteration_recorded`? Recommended: no. The stem carries any record whole, and its name is the only thing that does not fit.
- Is threading the session id through sixteen runner calls worth it, against letting the gateway scope failure rows to its default `run-cli` as research already does for idea rows? Recommended: thread it, as phase 019 required for the opening row.
- Should the three other direct writers, `verification_degraded`, `containment_violation` and `containment_contested`, get a phase of their own? They lose their rows the same way.
- Should `validateIterationOutputs` accept the executor from the iteration's opening row on a ledger-backed log, and should the research prompt pack's sentence about patching the iteration record be reworded?
- Does this phase get its own hub changelog and version bump after `v1.6.27.0`, or does it ship with the next release note?
<!-- /ANCHOR:questions -->

---
