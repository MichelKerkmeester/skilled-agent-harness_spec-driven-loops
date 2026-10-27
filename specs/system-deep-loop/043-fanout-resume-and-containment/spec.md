---
title: "Feature Specification: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit"
description: "An interrupted fan-out lineage could not be dispatched again because its effect ledger refused the repeat dispatch, and the write-containment guard filed a concurrent operator edit under the lane. Both are fixed in the deep-loop runtime with failing-first tests."
trigger_phrases:
  - "fanout resume and containment"
  - "fix the deep loop fan out s failed"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Fix the deep-loop fan-out's failed lineage resume and its containment guard quarantining a concurrent operator edit

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A deep-research fan-out lane that was interrupted (the network dropped mid-run) could not be resumed: two resume attempts exited 1 before the executor ran, and the lane had to be rerun as a new lineage. Separately, the fan-out's write-containment guard filed a file that another session was editing in the same checkout under the lane, quarantining a copy of it and listing it as the lane's out-of-scope write. Both were seen on 2026-10-27 while running the fan-out for `specs/sk-git/035-fsmonitor-daemon-and-worktree-relocation-regression/001-deep-research`.

### Purpose
An interrupted lineage resumes from its last completed iteration, and the containment guard stops attributing a concurrent operator's edits to the lane while it still catches the lane's own stray writes.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Resume. The interrupted lineage `llmgateway-flash-undated` holds a confirmed dispatch in its effect ledger (frame 1 is the intent, recorded 08:31:45Z, frame 2 the confirmation, recorded 09:05:06Z) and a config with `status: "initialized"` and a stored `lineage.sessionId`, so the next dispatch reuses that session id. `orchestration-status.log` shows the two resume attempts ending in `lineage llmgateway-flash-undated exited with code 1` after 18 s and 71 s. The new test file run against the unfixed runtime:

```text
$ npx vitest run --no-coverage tests/unit/fanout-effect-dispatch.vitest.ts
 FAIL  ... > reaches the executor when the resumed prompt differs from the one first dispatched
AssertionError: expected 1 to be 2 // Object.is equality
 FAIL  ... > reaches the executor when the earlier dispatch died before it was confirmed
AssertionError: expected +0 to be 1 // Object.is equality
 FAIL  ... > keeps one dispatch per ledger identity across three consecutive resumes
ReceiptEffectError { "message": "Effect confirmation requires a conclusive external postcondition query", "code": "OUTCOME_UNVERIFIED" }
 Test Files  1 failed (1)
      Tests  4 failed (4)
```

Containment. The quarantine manifests under `001-deep-research/research/lineages/opencode-go-flash/containment/quarantine/1/` and `.../llmgateway-flash-1017/containment/quarantine/1/` each hold one entry, `specs/sk-git/035-.../scratch/findings.md`, with a `patch-baseline` diff. A baseline diff exists only for a path that was already dirty when the lane started, so the file was the operator's own draft and it changed again during the run. `orchestration-status.log` lines 4 and 16 list it as a `containment_advisory` violation of the lane.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `dispatchExecutorEffect` in `lib/deep-loop/fanout-effect-dispatch.ts` treat every dispatch of a lineage as its own logical effect, so a resumed dispatch reaches the executor.
- Add a `contested` class to `enforceWriteContainment` in `lib/deep-loop/write-containment.ts`, and wire it into `scripts/fanout-run.cjs` as a `containment_contested` ledger event and a `containmentContested` field on the lineage output.
- Add failing-first tests for both next to the existing fan-out tests.
- Document the attribution trade-off.

### Out of Scope
- A new opt-in flag or config key for contested handling - the behavior follows the existing `containmentMode`, so no new surface is added.
- Attributing a brand-new file that a second session creates mid-run - git status alone cannot do it, see section 6.
- README and changelog edits - listed for the maintainer in `implementation-summary.md`.
- Any real model dispatch - the tests use the runtime's own stub executors.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/fanout-effect-dispatch.ts` | Modify | Count prior dispatches of the lineage and give the next one a fresh logical effect id |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Mark a baseline-dirty path that changed again and hold it out of quarantine, patch and revert under the default remedy |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Emit the `containment_contested` event and the `containmentContested` output field |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-effect-dispatch.vitest.ts` | Create | Four resume cases against the effect gateway |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | One resume case and one concurrent-operator case through the real script |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Four contested-path cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A lineage dispatched again under its stored session id reaches the executor, whether the earlier dispatch was confirmed, left unconfirmed, or carried a different prompt. `npx vitest run --no-coverage tests/unit/fanout-effect-dispatch.vitest.ts` prints 4 passed. |
| REQ-002 | A path that was dirty before the dispatch and changed again during it is reported as contested under the default remedy: no quarantine copy, no patch, no revert, not a violation, with a note saying why. A path the lane alone changed is still a violation. The `write-containment.vitest.ts` contested block passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The two fixes are visible through `fanout-run.cjs`: a three-run resume of one lineage completes three times with no `failed` ledger event, and a concurrent operator edit yields one `containment_contested` event while the lane's own stray file stays in `containment_advisory`. |
| REQ-004 | `restore` mode keeps its single-owner reading, and the full runtime suite, the contract-drift check and strict packet validation all pass. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `fanout-effect-dispatch.vitest.ts` goes from 4 failed to 4 passed with the fix and nothing else changed.
- **SC-002**: The concurrent-operator case in `fanout-run.vitest.ts` goes from failing to passing, and the full runtime suite has no new failure against the pre-change baseline.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The effect gateway's idempotency contract (`EffectRecoveryGateway.execute`) | A change to how it derives the effect key would move the collision | The fix only chooses the logical effect id the gateway already keys on; the gateway is untouched |
| Risk | Contested classification hides a real lane write to a file an operator already had dirty | Med | The path is still reported: a ledger event, an output field and a note say so. The pre-dispatch bytes stay in the baseline capture. Restore mode keeps the old reading |
| Risk | A brand-new file created by a second session mid-run is still filed as a lane advisory | Low | git status gives no way to tell it from a lane write. The default remedy never deletes it and the advisory is non-fatal. Attribution would need the executor's own write log, which no executor kind exposes uniformly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The resume fix adds one ledger read per dispatch, on a ledger that holds two frames per dispatch.

### Security
- **NFR-S01**: N/A - no auth, credential or network surface is touched.

### Reliability
- **NFR-R01**: The containment change never deletes or rewrites a file, as before: contested paths are not touched at all.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a lineage with no earlier dispatch counts 0 and keeps the original logical effect id, so existing ledgers replay unchanged.
- Maximum input: each resume adds one `:redispatch-N` suffix, counted from the ledger, so N is the number of earlier dispatches and never repeats.
- Failure path: a dispatch the supervisor lost before its confirmation leaves an unresolved intent; it counts as a prior dispatch, and the next dispatch is a new effect rather than a refused replay.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three runtime files, three test files |
| Risk | 9/25 | Containment is a safety guard; the change only narrows what it files under the lane |
| Research | 8/20 | Two root causes traced through the ledger and the git status attribution |
| **Total** | **25/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Decision recorded: contested handling is keyed on the path having been dirty before the dispatch, because that is the one fact git status and the baseline together prove about a second writer.
<!-- /ANCHOR:questions -->

---
