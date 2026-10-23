---
title: "Decision Record: rebuild fanout removal"
description: "The decisions behind stopping the trigger-index rebuild fan-out: the operator's D1 choice between a commit-message token and 104 path-filter entries, the token's placement on the body line, the suite that guards it, the single commit that lands it, and the fresh 24 h baseline."
trigger_phrases:
  - "rebuild fanout removal decision record"
  - "skip ci token decision"
  - "rebuild commit fanout adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/002-rebuild-fanout-removal"
    last_updated_at: "2026-10-23T10:35:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded five proposed ADRs for the planned phase"
    next_safe_action: "Answer decision D1, then run the phase's tasks"
    blockers:
      - "D1 unanswered"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-002-rebuild-fanout-removal"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does [skip ci] suppress runs for a push made with the bypass-actor PAT?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: rebuild fanout removal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Skip CI with a commit-message token, not 104 path-filter entries

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D1, unanswered), plan author |

---

<!-- ANCHOR:adr-001-context -->
### Context

Every push to `main` that changes the spec-kit corpus is followed by a bot commit that rebuilds the trigger index. That commit starts the whole push gate again: 13 downstream workflows plus the rebuild's own skipped row, 14 runs per rebuild SHA. In the measured 23.5 h window, 35 of 73 push SHAs on `main` were rebuild commits, and the fan-out cost 2,073 of the repository's 3,812 runner-min/day, 54% of the total (`final-review.md:193-209`).

Two mechanisms can stop it. A `[skip ci]` token in the commit body asks GitHub to start no workflow for that commit. A push-only `paths-ignore:` in each downstream workflow tells those workflows not to run when only generated files change.

### Constraints

- `check-gate-inputs.sh:107-121` requires a `.opencode/` twin for every `.skilled/` filter entry, and `:336` raises `twin-one` when one is missing.
- A `paths-ignore` on 13 workflows is 8 entries each, 104 in total, because four `.skilled/` paths need four inert `.opencode/` twins.
- The rebuild workflow runs on `push` only (`trigger-index-rebuild.yml:6-9`), so any ignore belongs on `push:` and must leave `pull_request:` untouched; a generated-files-only pull request would otherwise deadlock on a required check.
- The repository has never exercised `[skip ci]`, and whether it holds for a push made with the bypass-actor PAT is UNVERIFIED.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Option A, the `[skip ci]` token on the rebuild commit's body line, as the default this phase plans and builds; option B stays the recorded alternative for an operator who rejects A.

**How it works**: `trigger-index-rebuild.yml:149` gains the token inside its existing `-m` argument, and `:150` keeps `Trigger-Index-Rebuild: ci` as the message's last line. GitHub then starts no push- or pull_request-triggered workflow for the pushed commit, and the loop guard's suffix match at `:33` still recognises a manual re-run.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A: `[skip ci]` token** | One line; no filter entries; no new YAML pattern; removes the 35 skipped rebuild rows too; ~2,073 runner-min/day | Documented by GitHub but unexercised here; the bypass-actor PAT case is unproven until the first three rebuilds; `main`'s HEAD ends with no statuses | 9/10 |
| **B: push-only `paths-ignore`** | Uses a mechanism the repository already runs; each workflow states its own inputs | 104 twin-matched entries across 13 files; an amendment to ordering rule 2; leaves the rebuild workflow's own skipped row; ~2,002 runner-min/day with `message-contract` unfiltered | 5/10 |

**Why this one**: Option A removes the fan-out with one line and leaves the twin gate and its ordering rule alone. Its one unknown, the bypass-actor push, is proved by the same three rebuilds the phase already waits for, and a no has a recorded fallback rather than a redesign.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- 2,073 of 3,812 runner-min/day stop being spent on four generated files no gate reads.
- The 35 rebuild SHAs in the window each drop from 14 runs to 0.
- No workflow file other than the producer changes, so no check name, trigger or permission moves.

**What it costs**:
- `message-contract` and the report-only freshness recheck no longer see the rebuild commit. Mitigation: the body is a fixed literal, and `validate-message.mjs` exits 0 on the same text offline.
- `main`'s tip carries no statuses after a rebuild. Mitigation: phase 009's `/doctor:ci report` resolves the newest non-rebuild SHA; the research phase found no current consumer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The token does not suppress a bypass-actor push | H | The first three rebuild SHAs are the proof; a no moves to option B with the assertion kept |
| A later edit drops the token | H | The vitest case fails, and spec-kit-check now runs it when the workflow changes |
| A reviewer treats the one-line edit as cosmetic | M | The token and the case land in one commit |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 2,073 of 3,812 runner-min/day, 54% of the total, is spent re-checking four generated files |
| 2 | **Beyond Local Maxima?** | PASS | Both mechanisms were measured; the 104-entry cost of B is counted, not estimated |
| 3 | **Sufficient?** | PASS | One line plus one assertion removes the fan-out and keeps it removed |
| 4 | **Fits Goal?** | PASS | It is the phase's first R-id and the baseline every later phase measures against |
| 5 | **Open Horizons?** | PASS | It removes runs rather than making them cheaper, so later caching work measures against a smaller total |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.github/workflows/trigger-index-rebuild.yml:149`: the body `-m` gains ` [skip ci]`.
- `.github/workflows/README.md:58` and `:75`: both rows state the skip.
- `trigger-index-rebuild-workflow.vitest.ts`: one case pins the token and the trailer.
- `.github/workflows/spec-kit-check.yml:9` and `:37`: both path lists name the workflow.

**Gated tasks**: T004 to T011, then T014.

**How to roll back**: Revert the body line to its quoted anchor. The next rebuild pushes a message without the token and the fan-out returns; the test stays and asserts the token, so the revert is visible as a red suite.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The token rides the body line and the trailer stays last

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-002-context -->
### Context

The commit step builds the message from three `-m` arguments: subject at `:148`, body at `:149`, trailer at `:150`. The loop guard at `:33` is `!endsWith(github.event.head_commit.message, 'Trigger-Index-Rebuild: ci')`, a suffix match, so the trailer's position is load-bearing.

### Constraints

- The trailer must remain the message's last line, or the guard stops recognising the job's own push and a rebuild can loop.
- The token must be inside the message GitHub evaluates; it is not a label, an annotation or a workflow input.
- No value from the corpus, the branch or the run may be interpolated into the message.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Put the token on the body line only, and leave the trailer untouched as the final `-m`.

**How it works**: The body becomes `The pushed corpus changed the committed trigger index, so this job rebuilt it. [skip ci]`. GitHub reads the whole message for the token, and the guard reads only the suffix, so both conditions hold at once.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Body line** | The trailer stays last; the token sits in a sentence a reader sees | The body grows by 10 characters | 9/10 |
| Trailer line | One line to edit | The message no longer ends with the trailer, so the loop guard stops matching | 1/10 |
| Subject line | Highly visible | Changes the subject the contract and the existing test pin, and crowds a 72-character line | 3/10 |
| Appended after the trailer | Easy to append | Same suffix break as the trailer option | 1/10 |

**Why this one**: It is the only placement that satisfies both readers: GitHub scans the whole message, and the guard scans only its end.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The loop guard needs no change, so a manual `workflow_dispatch` re-run still behaves as it does today.
- The assertion can check both facts from one `git log` read.

**What it costs**:
- A future reword of the body has to keep the token and the trailer order. Mitigation: the case fails on the reword and names both expectations.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later edit moves the token into the trailer | H | The case asserts the trailer is the last line and the body carries the token |
| The body line is reformatted across lines | M | The assertion compares whole message lines, so a wrapped body fails visibly |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The guard is a suffix match, so placement decides whether it still works |
| 2 | **Beyond Local Maxima?** | PASS | Four placements were compared against both readers |
| 3 | **Sufficient?** | PASS | One line changes; no other message part moves |
| 4 | **Fits Goal?** | PASS | It keeps R1 from breaking the loop guard it depends on |
| 5 | **Open Horizons?** | PASS | The message shape stays stable for any later token consumer |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `trigger-index-rebuild.yml:149`: the body line gains the token.
- `trigger-index-rebuild.yml:147`: a two-line comment states why the token exists and why the trailer stays last.
- `trigger-index-rebuild-workflow.vitest.ts`: the case asserts the body line and the final line.

**Gated tasks**: T004, T005, T009, T016.

**How to roll back**: Revert `:149` to the quoted anchor; the comment and the case are reverted with the same commit.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The workflow's own vitest suite is the guard

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

`trigger-index-rebuild-workflow.vitest.ts` already runs the workflow's `run:` blocks under bash against local fixtures, reads the produced commit message from the fixture origin (`:887-892`), and supports a `TRIGGER_INDEX_REBUILD_WORKFLOW_PATH` override (`:32-35`) so an assertion can be shown failing against a broken copy. Its only CI host is spec-kit-check, whose filters omit `.github/workflows/trigger-index-rebuild.yml` (`spec-kit-check.yml:6-9,34-37`).

### Constraints

- A new test file would need a new suite wiring, a new CI host and its own fixtures.
- Under option B the natural host is `check-gate-inputs.sh` plus its fixture test; under option A the token lives in a commit message, which only the vitest suite already produces.
- The case must fail when the token is removed and pass on the real workflow.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: Add one case to the existing suite and make spec-kit-check run that suite when the rebuild workflow changes.

**How it works**: The case reads the fixture origin's message, asserts the body line contains the token through `SKIP_TOKEN`, and asserts the last line is `LOOP_GUARD_TRAILER`. The negative proof copies the workflow, strips the token, and runs the same suite through the path override.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing suite** | Fixtures, message reader and override already exist; no new CI host | The case depends on the suite's fixture shape | 9/10 |
| New test file | Isolates the assertion | Duplicates the fixture machinery and needs its own host | 4/10 |
| `check-gate-inputs.sh` fixture | Fits the option B mechanism | Cannot see a commit message, which is what option A changes | 2/10 |

**Why this one**: The suite already produces the exact artifact the assertion needs, and the override already exists to prove the assertion is not vacuous.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The guard costs one case, not a new suite.
- The negative proof runs with one environment variable, so a reviewer can reproduce it locally.

**What it costs**:
- The guard only runs when spec-kit-check runs. Mitigation: both path lists now name the rebuild workflow.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The suite is not triggered by a workflow-only change | H | Both `spec-kit-check.yml` lists name the workflow; a probe pull request proves it |
| The fixture stops producing a message | M | The existing trailer case would fail first, so the break is visible |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Nothing asserts the message shape today |
| 2 | **Beyond Local Maxima?** | PASS | Three hosts were compared, including option B's |
| 3 | **Sufficient?** | PASS | One case plus two filter entries |
| 4 | **Fits Goal?** | PASS | R2 exists only to protect R1 |
| 5 | **Open Horizons?** | PASS | The case sits beside the trailer case it extends |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `trigger-index-rebuild-workflow.vitest.ts`: `SKIP_TOKEN` and one case.
- `spec-kit-check.yml:9` and `:37`: the workflow path in both lists.

**Gated tasks**: T008, T009, T010, T011, T012, T018.

**How to roll back**: Delete the case and the constant, and remove the two filter entries. The suite returns to its pre-phase shape.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The token, its test, the filters and the README land as one commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-004-context -->
### Context

spec-kit-check runs on any change under `.skilled/skills/system-spec-kit/**`, so a test-only commit is red until the workflow carries the token. A workflow-only commit is green but ships an unguarded token, and if the test is added later the guard's first run is after the behaviour is already live.

### Constraints

- No commit on `main` may be red: the branch is the integration line for every later phase.
- No commit on `main` may carry the token without the assertion that protects it.
- The change spans four files across three concerns: producer, test, trigger.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: Land the token, the comment, both README rows, the constant, the case and both filter entries as one commit.

**How it works**: T014 stages exactly four paths and commits them with a message that passes `validate-message.mjs`. The commit is the unit a reviewer reads and the unit a revert restores.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One commit** | No red intermediate state; one revert unit; the guard is reviewed beside the change | A larger diff for one line of behaviour | 9/10 |
| Two commits, test first | The guard exists before the behaviour | The first commit is red on `main` | 3/10 |
| Two commits, workflow first | Each commit is green | The token ships unguarded until the second commit lands | 4/10 |

**Why this one**: It is the only order in which neither a red commit nor an unguarded token ever exists on `main`.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A revert restores the producer, the assertion and the trigger together.
- The reviewer sees the token and the proof in one diff.

**What it costs**:
- The commit is four files for one line of behaviour. Mitigation: the message states why, and the README rows explain the mechanism.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reviewer splits the commit during review | M | The message states that the test and the token are one unit |
| A partial revert leaves a filter entry behind | L | AC-004 counts the two entries in one file |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | spec-kit-check runs on every spec-kit change, so a split commit is red |
| 2 | **Beyond Local Maxima?** | PASS | Three commit orders were compared |
| 3 | **Sufficient?** | PASS | One commit, four paths |
| 4 | **Fits Goal?** | PASS | It keeps `main` green for phases 003 to 009 |
| 5 | **Open Horizons?** | PASS | One revert unit stays one revert unit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- One commit stages `trigger-index-rebuild.yml`, `README.md`, `spec-kit-check.yml` and `trigger-index-rebuild-workflow.vitest.ts`.

**Gated tasks**: T014.

**How to roll back**: `git reset --soft HEAD~1` before the push; after the push, `git revert <sha>`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The baseline is a fresh 24 h snapshot, not a scaled window

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-005-context -->
### Context

The research phase measured 23.5 h and scaled its figures by 24/23.5 (factor 1.021) to state per-day numbers. That is the right method for a before-state. Every later phase needs an after-state measured on the deployed behaviour, and a scaled short window hides variance at this repository's push rate.

### Constraints

- The snapshot must use the same billing method as `001-research/scratch/ci-run-data/summary.md`: `sum over non-skipped jobs of ceil(job seconds / 60)` per run.
- `gh run list` returns at most 1,000 runs per call, which covers a 24 h window at this volume.
- A rebuild SHA can land inside the window and must show 0 runs.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: Collect a full 24 h window after the merge, with per-workflow run counts, per-job samples and the window bounds recorded in `scratch/baseline-24h/summary.md`.

**How it works**: T019 pulls `runs-last-1000.json`, filters it to the 24 h window, samples five completed runs per workflow with `gh run view --json jobs`, and writes the total with the same formula the research phase used.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fresh 24 h window** | Measures the deployed state; same method as the before number | Costs a day of wall clock | 9/10 |
| Reuse 001's window | No wait | Measures the pre-change state | 0/10 |
| Seven-day window | Less variance | Slower than every later phase can wait | 4/10 |
| Trust 3,812 minus 2,073 | Instant | An arithmetic claim, not a measurement | 2/10 |

**Why this one**: Later phases state deltas against this file, so it has to measure what is deployed rather than what the plan expects.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Phases 003 to 009 get a measured total and a per-workflow table.
- A quiet day is visible in the recorded sample size instead of being hidden by scaling.

**What it costs**:
- The phase waits 24 h after the merge. Mitigation: T015 to T018 run during the wait.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The total falls outside 1,700-1,850 | H | Report the measured number; do not rescale it |
| Too few runs land in the window | M | The window bounds and run count are recorded with the total |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every later phase measures against this file |
| 2 | **Beyond Local Maxima?** | PASS | Four measurement options were compared |
| 3 | **Sufficient?** | PASS | One snapshot with the research phase's own formula |
| 4 | **Fits Goal?** | PASS | It is the phase plan's closing acceptance gate |
| 5 | **Open Horizons?** | PASS | The method survives every later phase |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scratch/baseline-24h/` holds `runs-last-1000.json`, `window.json`, `jobs/<id>.json` and `summary.md`.

**Gated tasks**: T019, T020.

**How to roll back**: Delete `scratch/baseline-24h/` and re-collect after another 24 h. No tracked file changes.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

## Decision Index

| ADR | Subject | Status | Gates |
|-----|---------|--------|-------|
| ADR-001 | D1: the `[skip ci]` token over 104 path-filter entries | Proposed | T004 to T011, T014 |
| ADR-002 | The token on the body line, the trailer last | Proposed | T004, T005, T009, T016 |
| ADR-003 | The workflow's own vitest suite is the guard | Proposed | T008 to T012, T018 |
| ADR-004 | One commit carries token, test, filters and README | Proposed | T014 |
| ADR-005 | A fresh 24 h baseline, not a scaled window | Proposed | T019, T020 |
