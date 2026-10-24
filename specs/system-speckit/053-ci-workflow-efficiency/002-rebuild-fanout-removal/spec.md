---
title: "Feature Specification: Phase 2: rebuild-fanout-removal"
description: "The trigger-index rebuild commit re-runs 13 workflows on four generated files whose content no job reads as a gate; the report-only freshness step at `advisory-checks.yml:66-68` does read it and its loss is accepted. The fan-out costs 2,073 of 3,812 runner-min/day. This phase appends a [skip ci] token to that commit body so the pushed rebuild starts no workflow run, asserts the token in the workflow's own vitest suite, and makes spec-kit-check run when the rebuild workflow changes. It also records the fresh 24 h run-data baseline every later phase measures against."
trigger_phrases:
  - "rebuild fanout removal"
  - "phase 2 rebuild fanout removal"
  - "trigger index rebuild skip ci"
  - "rebuild commit ci fan-out"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: rebuild-fanout-removal

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

The rebuild commit that repairs the trigger index after every corpus push re-runs the whole push gate: 13 downstream workflows plus the rebuild's own skipped row, 14 runs for each of the 35 rebuild SHAs in the measured 23.5 h window. That fan-out is 2,073 of the repository's 3,812 runner-min/day, 54% of the total. This phase appends `[skip ci]` to that commit's body line so GitHub starts no workflow for the pushed commit, keeps `Trigger-Index-Rebuild: ci` last so the loop guard still matches, and asserts both facts in the rebuild workflow's own vitest suite, which spec-kit-check now runs whenever that workflow changes.

**Key Decisions**: D1 option A, the `[skip ci]` token, over option B's 104 `paths-ignore` entries; the token goes on the body line and never in the trailer; the token, its test, the two filter entries and the two README rows land as one commit.

**Critical Dependencies**: the operator's D1 answer, and a `gh` client with `repo` and `actions` scopes for the pre-change capture, the three-rebuild check and the 24 h baseline.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In progress |
| **Created** | 2026-10-23 |
| **Branch** | `main (work in any checkout level with origin/main; push with git push origin HEAD:main)` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 9 |
| **Predecessor** | 001-research |
| **Successor** | 003-trigger-and-job-hygiene |
| **Handoff Criteria** | Three consecutive rebuild SHAs on `main` each show 0 workflow runs, `check-gate-inputs.sh` prints `RESULT: PASSED`, spec-kit-check is green on the change, and `scratch/baseline-24h/summary.md` records the post-change 24 h total |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the CI efficiency implementation phases specification. It carries R1 and R2 of `001-research/research/synthesis-reviews/final-review.md` (`:193-222`) and the baseline clause of that review's phase plan (`:534-607`).

**Scope Boundary**: One commit-message token, two README rows, one vitest case, two `spec-kit-check.yml` filter entries, and one measured snapshot. No job, check name, trigger event, permission, timeout or concurrency setting changes. The 13 downstream workflows are not edited.

**Dependencies**:
- Operator decision D1 (`final-review.md:611-615`), recorded as D1=A on 2026-10-23: the `[skip ci]` token, verified by T001.
- `gh` authenticated with `repo` and `actions` scopes, for the run-data snapshot and the three-rebuild check.
- A checkout with `.skilled/skills/system-spec-kit` dependencies installed (`npm --prefix .skilled/skills/system-spec-kit ci`, the install `spec-kit-check.yml:83` uses); the worktree that authored this plan has no build, so its vitest suite cannot run there.
- No other phase. `003-trigger-and-job-hygiene`, `004-setup-caching-provisioning`, `005-slow-and-failing-tests`, `006-sk-code-ci-surface`, `007-workflow-hygiene-on-off-control`, `008-consolidation-decision` and `009-doctor-ci-review-wiring` all measure against this phase's baseline.

**Deliverables**:
- `.github/workflows/trigger-index-rebuild.yml`: `[skip ci]` in the rebuild commit body, trailer still last.
- `.github/workflows/README.md`: the rebuild row and the push/PR row state the skip.
- `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts`: a case asserting the token and the trailer, with a negative proof.
- `.github/workflows/spec-kit-check.yml`: `.github/workflows/trigger-index-rebuild.yml` in both path lists.
- `scratch/baseline-24h/`: raw `gh` JSON and `summary.md`, the new baseline for phases 003 to 009.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Every push to `main` that changes the spec-kit corpus is followed by a bot commit that rebuilds the trigger index, and that commit starts the whole push gate again. In the measured 23.5 h window, 35 of 73 push SHAs on `main` were rebuild commits, and every one of them started exactly 14 workflow runs: 13 downstream workflows plus the rebuild workflow's own skipped row. The 13 downstream jobs re-run checks over four generated files whose content no job reads as a gate; the report-only freshness step at `advisory-checks.yml:66-68` does read it and its loss is accepted. That fan-out costs 2,073 of the 3,812 runner-min/day the repository spends, 54% of the total (`final-review.md:193-209`). Nothing asserts the shape of that commit message, and `spec-kit-check.yml` does not list `.github/workflows/trigger-index-rebuild.yml`, so a change to the workflow that owns the rebuild is not tested by the workflow that hosts its suite (`final-review.md:174`, `spec-kit-check.yml:6-9,34-37`).

### Purpose
One commit-message token removes the whole fan-out with no filter entries and no new YAML pattern, and one test keeps the token there and runs whenever the workflow changes.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R1: append `[skip ci]` to the body line of the rebuild commit (`trigger-index-rebuild.yml:150-152`), keeping `Trigger-Index-Rebuild: ci` as the final line so the loop guard at `:33` still matches.
- R1 documentation: the rebuild row (`README.md:58`) and the push/PR row (`README.md:75`) in `.github/workflows/README.md`.
- R2: a vitest case in `trigger-index-rebuild-workflow.vitest.ts` asserting the token and the trailer, plus a recorded negative proof.
- R2 trigger: `.github/workflows/trigger-index-rebuild.yml` added to both `spec-kit-check.yml` path lists (`:9`, `:37`).
- The fresh 24 h run-data baseline under `scratch/baseline-24h/`, which every later phase measures against.

### Out of Scope
- Option B's `paths-ignore` and `!` negations: 8 twin-matched entries in each of 13 workflows, 104 in total, plus amended ordering rule 2 (`final-review.md:199-202`). Planned only as the D1 fallback; not built unless D1 rejects option A.
- Concurrency groups (R3), path filters on other workflows (R4, R5), caching and provisioning (R12 to R18), timeouts (R24), permissions (R25), the on/off switch (R26): other phases own them.
- Any edit to `message-contract.yml`, the required-check ruleset, or the 13 downstream workflows.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/trigger-index-rebuild.yml` | Modify | Append `[skip ci]` to the commit body line at `:151`; trailer at `:152` stays last |
| `.github/workflows/README.md` | Modify | Rebuild row `:58` and push/PR row `:75` state that the pushed rebuild starts no workflow run |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` | Modify | Add `SKIP_TOKEN` beside `:83-84` and one case after `:887-892` asserting the token in the body and the trailer last |
| `.github/workflows/spec-kit-check.yml` | Modify | Add `.github/workflows/trigger-index-rebuild.yml` to the push list after `:9` and the PR list after `:37` |
| `scratch/baseline-24h/` | Create | `runs-last-1000.json`, `jobs/<run-id>.json` samples, `summary.md` |
| `scratch/pre-change/` | Create | One `gh run list` JSON per rebuild SHA, captured before the change as the before number |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R1.** The rebuild commit body line at `trigger-index-rebuild.yml:151` carries the `[skip ci]` token, and the last `-m` argument at `:152` is still `Trigger-Index-Rebuild: ci`, so `endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')` at `:33` still matches |
| REQ-002 | **R1.** `.github/workflows/README.md:58` and `:75` state that the rebuild commit carries `[skip ci]` and starts no downstream workflow run, and that the loop guard remains as the second line of defence |
| REQ-003 | **R2.** `trigger-index-rebuild-workflow.vitest.ts` has a case that fails when the token is removed from the workflow and passes when it is restored, and that also asserts the trailer is still the message's last line |
| REQ-004 | **R2.** `.github/workflows/spec-kit-check.yml` names `.github/workflows/trigger-index-rebuild.yml` in both the `push:` list (after `:9`) and the `pull_request:` list (after `:37`) |
| REQ-005 | **R1.** Three consecutive rebuild SHAs on `main` after the change each show 0 workflow runs by `gh run list --commit <sha>`, against 14 runs per rebuild SHA today |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | A 24 h run-data snapshot is recorded in `scratch/baseline-24h/` with the same billing method as `001-research/scratch/ci-run-data/summary.md`, giving the post-R1 total and a per-workflow table for phases 003 to 009 |
| REQ-007 | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` after the filter edit, and spec-kit-check is green on the change |

R1's saving is ~2,073 runner-min/day standalone, 54% of 3,812, or ~2,002 under option B with message-contract left unfiltered. R2's saving is 0: it protects R1, and its value is that the token cannot be dropped silently.

### Functional Requirements by R-id

Each row states what the R-id must do, the edges it must survive, what can go wrong, and how it is undone.

| R-id | Functional requirements | Edge cases | Risks and mitigation | Rollback |
|------|-------------------------|------------|----------------------|----------|
| R1 | REQ-001, REQ-002, REQ-005. The rebuild commit's body line carries `[skip ci]`; the message still ends with the `Trigger-Index-Rebuild: ci` trailer; the two README rows state the skip; three consecutive rebuild SHAs show 0 workflow runs | An unchanged corpus writes no commit, so the token is never exercised; `workflow_dispatch` ignores the token and the loop guard decides; a rejected push exits 0 and the newer commit's own rebuild carries its own token; `message-contract` does not see the rebuild commit under option A | The token is documented by GitHub but never exercised here, and whether it holds for a bypass-actor PAT is UNVERIFIED. REQ-005 proves it on the first three rebuilds; a no moves to D1 option B without reverting the test | Revert the body line to the quoted anchor. The next rebuild pushes a message without the token and the fan-out returns |
| R2 | REQ-003, REQ-004. One vitest case fails when the token is removed and passes on the real workflow, and asserts the trailer is the message's last line; both `spec-kit-check.yml` path lists name `.github/workflows/trigger-index-rebuild.yml` | The assertion reads the body line exactly, so a token in the subject or the trailer fails it; without `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` the suite reads the real workflow; a pull request that touches only the workflow starts spec-kit-check | A later legitimate reword of the message breaks the case. That failure is the guard working; the reword updates the assertion in the same commit. Two filter entries can drift apart; AC-004 counts both in one file | Revert the case, the `SKIP_TOKEN` constant and the two filter entries. The suite returns to its pre-phase shape and the workflow stops triggering spec-kit-check |
| Baseline clause | REQ-006, REQ-007. A fresh 24 h `gh run list` snapshot with per-workflow rows and a total, using the same billing method as `001-research/scratch/ci-run-data/summary.md`; gate-inputs and spec-kit-check green on the change | A quiet day records its own small sample rather than scaling a shorter window; `gh run list --limit 1000` is the pagination cap; a rebuild SHA can land inside the window and must show 0 runs | Waiting for traffic can stretch the phase; the snapshot records its window bounds so a later phase sees the sample size. A short window scaled up would hide variance, so the task waits for 24 h | None required. The snapshot is a record, not state; delete and re-collect it only if its window bounds are wrong |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The push-to-`main` total falls from 3,812 to about 1,739 runner-min/day, a drop of about 2,073 (`final-review.md:193-209`), measured on the fresh 24 h snapshot rather than asserted.
- **SC-002**: Every rebuild SHA on `main` after the change shows 0 workflow runs, where each of the 35 rebuild SHAs in the measured window showed 14.
- **SC-003**: The token is guarded: removing it makes the vitest suite fail, and a pull request that touches only the rebuild workflow starts spec-kit-check.
- **SC-004**: `scratch/baseline-24h/summary.md` exists with the total and the per-workflow rows, so phases 003 to 009 can state deltas against it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Operator decision D1 | None; D1=A (2026-10-23) recorded and T001 only verifies `scratch/d1-answer.md` | Option A is planned end to end; option B is one paragraph in `plan.md` and its 104 entries stay out of scope because D1 chose A |
| Dependency | `gh` authenticated with `repo` and `actions` scopes | No baseline and no three-rebuild check | Record the commands and their output in `scratch/baseline-24h/`; a missing scope is a blocker, not a workaround |
| Risk | GitHub documents `[skip ci]` but this repository has never exercised it, and whether it holds for a push made with the bypass-actor PAT is UNVERIFIED (`final-review.md:173`) | The fan-out stays and the phase's saving is 0 | REQ-005 proves it on the first three rebuilds; if it fails, fall back to option B (104 entries) without reverting the R2 test, which then asserts the ignore instead |
| Risk | `main`'s tip carries no statuses after the change (N17, `final-review.md:186`) | A tool that reads statuses on `HEAD` sees none | Recorded here for phase 009: `/doctor:ci report` must resolve the newest non-rebuild SHA. No current consumer found |
| Risk | The change is a one-line YAML edit that a reviewer may treat as cosmetic | The token is silently dropped later | R2's test is the guard, and `spec-kit-check.yml` now runs it when the workflow changes |
| Risk | The baseline needs 24 h of post-merge traffic | Later phases start without a number | The task waits for the window rather than scaling a shorter one; 001's 23.5 h dataset and its 1.021 factor are the fallback method |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Push-to-`main` runner-minutes per day fall by about 2,073, from 3,812 to about 1,739, measured on a 24 h window.
- **NFR-P02**: The rebuild workflow's own cost does not change: the commit step gains no command, and the token is one string in an existing `-m` argument.

### Security
- **NFR-S01**: No new secret, token, permission or scope. The push keeps `secrets.TRIGGER_INDEX_PUSH_TOKEN` and the ruleset bypass at `trigger-index-rebuild.yml:274`.
- **NFR-S02**: The commit body text is a fixed literal. No value from the pushed corpus, the branch name or the run environment is interpolated into it.

### Reliability
- **NFR-R01**: The loop guard keeps matching: the message still ends with `Trigger-Index-Rebuild: ci`, so a manual re-run of the rebuild workflow cannot loop.
- **NFR-R02**: The new vitest case fails on the broken variant and passes on the real workflow, proven by the `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` override the suite already supports (`trigger-index-rebuild-workflow.vitest.ts:32-35`).
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty change: the generator writes nothing different, the commit step exits 0 with `committed=false`, and no commit and no push happen (`trigger-index-rebuild.yml:138-142`). The token is never exercised.
- Message length: the body line grows by 10 characters; nothing parses its length, and the trailer stays a separate paragraph.
- Multiple rebuilds in a row: each pushed rebuild is skipped, so no second rebuild starts from it; the next human push triggers the workflow normally.

### Error Scenarios
- The token does not skip: the fan-out returns exactly as today, and D1's fallback (option B) becomes the plan. The test still passes, because it asserts the token, not GitHub's behaviour.
- Push rejected by a race: the run exits 0 with a notice (`:317-320`), and the newer push's rebuild carries the token on its own commit.
- `workflow_dispatch` run: unaffected, because `[skip ci]` applies to `push` and `pull_request` events only.
- Under option A, `message-contract` does not run on the rebuild commit; the loss is accepted because the body is a fixed literal, and `node .skilled/skills/sk-git/scripts/validate-message.mjs --commit <file>` exits 0 on the same text offline. Under option B with `message-contract` kept unfiltered, it runs and passes.

### State Transitions
- Partial completion: the token and its assertion land in one commit, so no commit is red and none carries an unguarded token. A split would leave either a failing suite or an unguarded token on `main`.
- Rollback: reverting the workflow line restores the fan-out on the next push, with no state to clean up.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 4 files, 1 added line in the workflow, 1 test case, 2 filter entries, 1 dataset |
| Risk | 8/25 | A one-line change with a 2,073 runner-min/day effect; the skip behaviour is documented but unexercised here |
| Research | 4/20 | The research phase measured the fan-out; this phase re-reads 5 files and proves one behaviour |
| Multi-Agent | 2/15 | One executor and one workstream; no second agent owns a file |
| Coordination | 3/15 | One operator decision (D1) and three external waits: the pre-change capture, three real rebuilds, and the 24 h window |
| **Total** | **23/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The token does not suppress runs for a push made with the bypass-actor PAT | H | M | REQ-005 proves it on the first three rebuilds; a no moves to D1 option B with the test kept |
| R-002 | `main`'s HEAD carries no statuses after the change, so a status reader sees an empty list | M | H | Phase 009's `/doctor:ci report` resolves the newest non-rebuild SHA; the research phase found no current consumer |
| R-003 | A later edit drops the token or moves it into the trailer | H | L | AC-003's negative proof plus the spec-kit-check trigger keep the assertion running whenever the workflow changes |
| R-004 | The 24 h baseline waits for traffic that does not arrive | M | L | The snapshot records its own window bounds and run counts; 001's 23.5 h dataset and its 1.021 factor are the fallback method |
| R-005 | `message-contract` no longer sees the rebuild commit under option A | L | H | The body is a fixed literal, and `validate-message.mjs` exits 0 on the same text offline |
| R-006 | A reviewer treats the one-line YAML edit as cosmetic and merges it without the test | M | M | One commit carries the token and the test; AC-003 fails when the case is absent |
| R-007 | The two spec-kit-check entries drift apart | L | M | AC-004 counts 2 occurrences of the workflow path in the one file |
| R-008 | The pre-change capture names a SHA whose runs were pruned | L | M | Three SHAs are captured, and a pruned one is replaced by the next rebuild SHA before the change lands |

## 11. USER STORIES

### US-001: Stop paying for a gate that re-checks generated files (Priority: P0)

**As a** maintainer who pays for the repository's CI minutes, **I want** the trigger-index rebuild commit to start no workflow run, **so that** the 2,073 of 3,812 runner-min/day the fan-out costs stop being spent on four generated files no gate reads.

**Acceptance criteria:** AC-001, AC-002, AC-005.

---

### US-002: Keep the skip from being dropped silently (Priority: P1)

**As a** reviewer of the rebuild workflow, **I want** its commit-message contract asserted by a test that runs whenever the workflow changes, **so that** the token and the trailer cannot be removed by a later edit without a red suite.

**Acceptance criteria:** AC-003, AC-004.

---

### US-003: Give the later phases a measured baseline (Priority: P1)

**As the** author of phases 003 to 009, **I want** a post-change 24 h run-data snapshot with per-workflow rows, **so that** every later saving is a delta against a measured total rather than an estimate.

**Acceptance criteria:** AC-006, AC-007.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Does `[skip ci]` suppress workflows for a push made with the bypass-actor PAT? UNVERIFIED by the research phase (`final-review.md:173`). REQ-005 answers it on the first three rebuilds; a no is the D1 fallback trigger, not a redesign.
- Which tool, if any, reads statuses on `main`'s `HEAD` and would see an empty list after this change (N17, `final-review.md:186`)? The research phase found no current consumer. Phase 009's `/doctor:ci report` must resolve the newest non-rebuild SHA either way, so this phase records the constraint and does not block on it.
- Is a 24 h window enough for the baseline to be stable at this repository's push rate? The measured window held 73 push SHAs, so 24 h carries roughly 70; the snapshot records its own window bounds and per-workflow run counts, so a later phase can see the sample size instead of trusting a single total.
<!-- /ANCHOR:questions -->

---


