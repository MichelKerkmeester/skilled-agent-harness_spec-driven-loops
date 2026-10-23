---
title: "Decision Record: workflow hygiene on off control"
description: "The ten choices this phase freezes: D6's timeout floor, the R25-R24-R26 build order, job-time sampling, the sizing formula with thin and absent markers, the Dependabot split that keeps its check name, the ANDed switch, the message-contract switch that exists and must not be used, the README as the group taxonomy, the parameterised rule packet, and one commit per concern."
trigger_phrases:
  - "workflow hygiene on off control decision record"
  - "timeout floor adr"
  - "dependabot split adr"
  - "ci switch adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control"
    last_updated_at: "2026-10-23T13:45:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded ten proposed ADRs for the planned phase"
    next_safe_action: "Answer D6, then run the phase's tasks from T001"
    blockers:
      - "D6 is unanswered; the default is 10 minutes"
      - "003, 004, 005 and 006 have not landed, so every job line is provisional"
      - "No fork or throwaway test repository is recorded for the R26 probe"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-007-workflow-hygiene-on-off-control"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: workflow hygiene on off control

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> **One operator decision gates this phase: D6, the timeout floor.** ADR-001 records it with its default and its alternative; T001 is the task that collects the answer, and every timeout value is derived after it. ADR-002 to ADR-010 are design choices this plan freezes, not questions for the operator.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The timeout floor is D6's answer, 10 minutes by default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D6); plan author for the default |

---

<!-- ANCHOR:adr-001-context -->
### Context

A `timeout-minutes` value has two terms: a measured one, from the job's own samples, and a policy one, the smallest value the repository is willing to allow. The measured term cannot see a job that hangs before it produces a sample, and it cannot see a job that is legitimately fast today and slow tomorrow. The floor covers both. It is a policy, so the operator owns it; a phase that picked its own floor would be inventing a policy nobody approved.

### Constraints

- `final-review.md:619` names 10 minutes as the proposal and says a lower floor tightens hang detection and raises the false-kill risk.
- `006-sk-code-ci-surface` writes the formula with 10 as the default and `max(<floor>, ...)` as the parameterised form, so the packet does not need an edit whichever answer arrives.
- Every value must be derived after the answer, because changing the floor afterwards re-derives every value in the tree.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: D6's answer, with 10 minutes as the default, applied uniformly to every job as the first term of `max(floor, ceil(3 x p50), ceil(2 x p100))`.

**How it works**: T001 writes one `D6=<n>` line to `scratch/decisions.md` before any timeout is written. T026 passes that number to the sizing script as `--floor`, so the table's `final` column already carries the floor's effect. T027 to T060 copy the table's value into each job, and T060 asserts every value equals its row.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **10 minutes (default)** | Caps a hang at 10 minutes instead of 360; leaves room for a slow install on a cold runner; matches the packet's stated default | A hang still costs 10 billed minutes | 9/10 |
| 5 minutes | Detects a hang in half the time | Doubles the false-kill risk on the cold-install jobs, which are the slowest in the tree | 6/10 |
| No floor, formula only | Every value is purely measured | A job with a 40-second p50 would get a 2-minute timeout and be killed by a runner warm-up | 3/10 |

**Why this one**: The floor exists to cover what a sample cannot see. 10 minutes is the smallest value that still covers a cold install, and it is already the packet's stated default, so the tree and the rule agree without an edit.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A hung job is killed in 10 minutes rather than 360, which frees the runner for the next run.
- The floor is one number in one file, so a later change is one edit and one re-run of the sizing script.

**What it costs**:
- A job that legitimately needs more than 10 minutes and has a thin sample gets 10 minutes and can be killed. Mitigation: the formula's p100 term lifts any job with a measured slow run, and T100 reads the next 24 hours for the kill message.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator picks 5 and a cold-install job is killed | M | T100 reads the kill message; the value is raised from a fresh sample, never by relaxing the 50% rule |
| The floor is applied per job rather than uniformly | L | T026 passes one `--floor` value to the whole table |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A measured-only value cannot cover a job whose first run is slow; `final-review.md:619` records the floor as a proposal the operator must answer |
| 2 | **Beyond Local Maxima?** | PASS | Three options are scored: a floor, a lower floor, and no floor |
| 3 | **Sufficient?** | PASS | One integer in one scratch file; no per-job override exists |
| 4 | **Fits Goal?** | PASS | R24's whole purpose is a timeout that caps a hang without killing a green run |
| 5 | **Open Horizons?** | PASS | The packet keeps the floor as a parameter, so a fork can choose its own without editing the standard |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/decisions.md` gains one `D6=<n>` line (T001).
- Every job gains a `timeout-minutes` whose value is at least that number (T027 to T060).

**How to roll back**: Delete the `D6=` line and every `timeout-minutes` line the phase added, and restore the six values T033, T041, T042, T051 and T054 replaced. No other file reads the floor.

**Gated tasks**: T001 gates T026, which gates T027 to T060 and T060's assertion.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Build order is R25, then R24, then R26

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-002-context -->
### Context

The review lists the three R-ids as R24, R25, R26. The build order is a different question: which pass must land before which, so no pass edits a line another pass is about to move or a job another pass is about to create.

### Constraints

- R25's Dependabot split creates one job. A timeout pass that ran first would leave that job without a value, and a second pass would be needed.
- R26 inserts a line above `runs-on:`. R24 inserts a line below it. Either order works for the anchor, but the phase's own checks read a stable job shape.
- `003` moves every line below `jobs:` in about 30 files, so the phase re-derives its inventory rather than trusting this plan's numbers.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: R25 first, R24 second, R26 third, with the job graph frozen before anything is sized or gated.

**How it works**: Phase 2 edits 12 headers and one job graph, then gates. Phase 3 samples the frozen graph and writes one value per job. Phase 4 inserts the switch above each `runs-on:` and the three ANDed conditions, then the README. The task numbering follows that order, so a reader can see the passes in the file.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **R25, R24, R26** | The job count is final before sizing; each pass has one anchor kind | The task order does not match the review's numbering | 9/10 |
| R24, R25, R26 (the id order) | Matches the review's numbering | Sizing runs before the split, so the new `metadata` job has no row and needs a second pass | 5/10 |
| R26, R24, R25 | The switch lands before any value | The switch sits above the line the timeout pass rewrites, so every timeout anchor moves | 4/10 |

**Why this one**: Only this order gives every job exactly one sizing row and every pass exactly one anchor position.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The sizing table covers every job, including the one the split creates.
- Each pass's check is independent: a permissions failure cannot hide a timeout failure.

**What it costs**:
- A reader who expects R24 first sees the phases out of id order. Mitigation: `plan.md`'s Implementation Notes state the reason in one sentence.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later editor reorders the tasks to match the ids | M | The note in `plan.md` and this ADR both state the dependency |
| The split is rejected by the operator | L | D5 is `004`'s decision; a rejection leaves one job, and T059 records that world |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The split creates a job, and a timeout pass cannot size a job that does not exist |
| 2 | **Beyond Local Maxima?** | PASS | All three orders are scored against the same two constraints |
| 3 | **Sufficient?** | PASS | Three passes, one order, no fourth pass |
| 4 | **Fits Goal?** | PASS | Each pass is proved by its own gate before the next begins |
| 5 | **Open Horizons?** | PASS | The order survives a rejected D5, because T059 has an outcome for each world |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Task order in `tasks.md`: Phase 2 is R25, Phase 3 is R24, Phase 4 is R26.
- `plan.md`'s phase-dependency table and critical path follow the same order.

**How to roll back**: Not applicable; this is an ordering choice in a plan, not a runtime behaviour. Reverting the phase's commits in reverse order restores the tree either way.

**Gated tasks**: Every task after T005 depends on it.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Timeouts are sized on job execution time, never run wall time

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

`timeout-minutes` counts the time a job executes, from the moment a runner picks it up. A run's wall clock also includes the wait for a runner and the gaps between jobs. The review found run-level maxima of 603 s and 2,257 s whose jobs may have spent most of that time queued, and marked the split between execution and queueing UNVERIFIED (`final-review.md:28-33`).

### Constraints

- `gh run view <id> --json jobs` returns each job's own `startedAt` and `completedAt`; the run list returns only the run's own timestamps.
- The 001 dataset stores both shapes, so the sample can reuse its layout.
- A run-level figure would overstate every value and hide the jobs that actually need headroom.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: every percentile comes from job-level `startedAt` to `completedAt` samples, never from a run's wall clock.

**How it works**: T024 writes one `jobs/<run-id>.json` per run, and T025 groups by job `name` and computes seconds from each job's own timestamps. A job that appears in one run and not another contributes only the runs it appears in, and its sample count is recorded.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Job-level samples** | Matches what `timeout-minutes` measures | One API call per run, about 1,280 in total | 9/10 |
| Run-level wall time | One call per run list | Includes queueing, so every value is too high and the 50% rule proves nothing | 2/10 |
| A fixed multiplier on the existing values | No sample needed | Copies a number nobody measured, which the review's acceptance cannot detect | 1/10 |

**Why this one**: A timeout is enforced against execution time, so a sample of anything else measures a different quantity.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- Every value is comparable to the thing GitHub enforces.
- The 50% acceptance rule becomes meaningful: a successful sample above half the timeout would be visible.

**What it costs**:
- About 1,280 `gh run view` calls, the phase's largest single cost. Mitigation: T024 keeps every JSON, so a second sizing pass re-reads rather than re-spends.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A job's `completedAt` is missing for a cancelled run | L | Cancelled and failed runs are excluded from the success sample; a failed-only job is marked and sized from its failures |
| A matrix leg reports the same job name twice in one run | L | The script groups by job name and records the sample count, so a doubled leg shows as a larger sample, not a wrong percentile |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | `final-review.md:28-33` rejects run-level maxima as an overstatement |
| 2 | **Beyond Local Maxima?** | PASS | Three sample shapes are scored |
| 3 | **Sufficient?** | PASS | One JSON per run, one script, one table |
| 4 | **Fits Goal?** | PASS | R24's acceptance requires no successful sample above 50% of the value, which only a job-level sample can test |
| 5 | **Open Horizons?** | PASS | The JSON is kept, so a later re-measure costs no API calls |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `scratch/r24/jobs/<run-id>.json` holds each run's job timings (T024).
- `scratch/r24/size-timeouts.mjs` computes from those files (T025).

**How to roll back**: Delete `scratch/r24/`; no workflow file depends on it once the values are written.

**Gated tasks**: T024 gates T025, which gates T026 and every timeout task.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The formula is `max(floor, ceil(3 x p50), ceil(2 x p100))`, with thin and absent markers

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-004-context -->
### Context

A single percentile is fooled by one slow run and by one fast one. The review's original proposal, 3x the median, was rejected because for a 70-second job it yields about 4 minutes, which is too little margin (`final-review.md:28-33`). The replacement needs a term that covers the observed worst case and a floor for the jobs with no sample at all.

### Constraints

- R24's acceptance requires no successful job in the sample to exceed 50% of its value.
- Some workflows have two runs in the window, so a p100 from two runs is noise and must be visible as such.
- The value is written in the workflow file, where no reader can see its sample size.

<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `max(F, ceil(3 x p50), ceil(2 x p100))`, with a `thin` marker under 5 successful samples, a `no-sample` marker at the floor, and a `failed-only` marker for a job sized from its failures.

**How it works**: T025 computes both percentiles per job and prints the formula value, the final value and the marker in one row. The final value already includes the floor, so T027 to T060 copy one number rather than recomputing. T060 asserts every tree value equals its row and that no successful sample exceeds 50% of it.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **3x p50 and 2x p100, with a floor** | Covers both the typical run and the observed worst case | Two percentiles to explain | 9/10 |
| 3x median only | Simple | Too little margin on a fast job, which the review rejected | 3/10 |
| p100 plus 20% | Covers the worst case exactly | One noisy run inflates every value, and a job with no sample has nothing | 5/10 |

**Why this one**: The p50 term keeps the value proportional to normal work, the p100 term covers the slow run that actually happened, and the floor covers the job with no sample.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- A single slow run cannot set a value 10x the normal one, because the p50 term dominates.
- A two-run sample is visible as `thin` rather than reading as a measurement.

**What it costs**:
- A job whose p50 and p100 are close gets a value close to 2x p100, which is generous. Mitigation: the 50% acceptance rule keeps the value honest against the sample.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A job's p100 comes from a run that was itself queued | M | Job-level timestamps exclude queueing (ADR-003) |
| A marker is dropped when the value is copied | L | T060 counts the marked rows and requires each to carry its sample count |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The review rejects 3x median alone as too tight |
| 2 | **Beyond Local Maxima?** | PASS | Three formulas are scored against the same sample |
| 3 | **Sufficient?** | PASS | Two percentiles, one floor and three markers |
| 4 | **Fits Goal?** | PASS | The 50% rule and the p100 term are the same idea from two sides |
| 5 | **Open Horizons?** | PASS | The script is kept, so a later sample re-derives every value |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `scratch/r24/size-timeouts.mjs` implements the formula and the markers (T025).
- `scratch/r24/timeouts.md` carries one row per job (T026).

**How to roll back**: Delete the two scratch files; the workflow values they produced are reverted by ADR-001's rollback.

**Gated tasks**: T025 and T026 gate every timeout task.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The Dependabot split keeps the existing check name on the merge job

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-005-context -->
### Context

`dependabot-auto-merge.yml` hands `contents: write` and `pull-requests: write` to the same job that runs a third-party metadata action (`:10-12`, `:22`). The split is the phase's security change: the metadata action must run without a write token, and the merge must run with one. The workflow has one check name today, and a rename is visible to every reviewer and bookmark.

### Constraints

- The active ruleset requires only `message-contract.yml`'s context (`final-review.md:67-71`), so this workflow's names are not required checks.
- `dependabot/fetch-metadata` needs `pull-requests: read` and nothing more.
- `gh pr merge` needs both write scopes and no repository code.
- The three-term `if:` that decides which updates merge must keep working against the metadata job's outputs.

<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: two jobs. `metadata` runs the action read-only and exposes `package-ecosystem`, `dependency-group` and `update-type` as outputs; `auto-merge` needs it, holds both write scopes, and runs only `gh pr merge`. The name `Auto-merge Dependabot security patch updates` stays on `auto-merge`.

**How it works**: The workflow-level block becomes `contents: read`. `metadata` keeps the original job condition and declares `contents: read` and `pull-requests: read` at job level. `auto-merge` rewrites the three-term `if:` against `needs.metadata.outputs.*` and carries no checkout and no repository step.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two jobs, name kept on the merge** | The write token never sits beside a third-party action; no name changes | One more job and one more run row | 9/10 |
| One job with step-level scopes | No new job | GitHub applies `permissions` per job, not per step, so this cannot express the split | 1/10 |
| Two jobs, both renamed | Clearer names | A reviewer's bookmark and the README row both break for no gain | 6/10 |

**Why this one**: The split's purpose is to keep the write token away from the action. Renaming would add a second, unrelated change to the same commit.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A hijacked `dependabot/fetch-metadata` release has no write token to use.
- The merge job runs no repository code, so no checkout and no install can run under its token.

**What it costs**:
- One extra job per Dependabot pull request, which is one extra run row. Mitigation: the workflow already runs only on Dependabot pull requests, so the volume is small.
- The `if:` now reads through `needs.metadata.outputs.*`. Mitigation: T019 quotes the exact new expression and T022 proves it on a live pull request.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An output name is mistyped, so `auto-merge` never runs | M | T019 checks the three output keys and T022 reads a live run's job conclusions |
| A non-patch update starts merging | H | The three-term `if:` is copied term for term, only its source changes |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A write token beside a third-party action is the finding this phase exists to close |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes are scored, including the impossible per-step one |
| 3 | **Sufficient?** | PASS | Two jobs, three outputs, one merge command |
| 4 | **Fits Goal?** | PASS | R25's acceptance requires the read-only job and the write-scoped one |
| 5 | **Open Horizons?** | PASS | The shape is the same one `trigger-index-rebuild.yml` already uses, so a reader has one pattern to learn |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.github/workflows/dependabot-auto-merge.yml` becomes a two-job file (T019).
- Both jobs gain a timeout (T034); neither gains a switch.

**How to roll back**: Restore the quoted single-job block T019 replaced, with the original `permissions: contents: write` and `pull-requests: write` at workflow level.

**Gated tasks**: T019 gates T020, T022 and T034.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: The switch is ANDed onto an existing condition, both sides parenthesised

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-006-context -->
### Context

Four jobs already carry a job-level `if:`. One is the rebuild loop guard (`trigger-index-rebuild.yml:33`), one is the `needs` gate that stops the push job running without a rebuild (`:186`), one is the PR-only condition on `skill-doc-frontmatter.yml:52`, and one is Dependabot's author check. A switch line that replaced any of them would silently delete the guard, and the rebuild would run on its own commit.

### Constraints

- GitHub evaluates a job `if:` as one expression; there is no second condition slot.
- The rebuild guard is a suffix match on the commit message, so its text must survive byte for byte.
- The `needs` gate must survive, or the push job could start without a bundle.
- A YAML value that starts with `!` must stay quoted.

<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: insert the switch as the first conjunct and keep the original expression as the last one, with each conjunct parenthesised, in the file's existing quoting style.

**How it works**: T092 and T093 rewrite the two `trigger-index-rebuild.yml` conditions and T094 rewrites `skill-doc-frontmatter.yml:52`. Each check asserts three things: the switch is present, the original term is present, and the parentheses balance. T096 copies the file, replaces the condition with a bare switch, and requires the assertion to fail on the copy.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Consequences | Score |
|--------|------|--------------|-------|
| **AND with both sides parenthesised** | The original condition survives; one line | A long line in three files | 9/10 |
| A separate `if:` key | Impossible: YAML keeps the last key | The original condition is silently dropped | 1/10 |
| Move the switch into each step's `if:` | Keeps the job condition untouched | A skipped job would still start a runner, so the switch would save nothing | 3/10 |

**Why this one**: It is the only shape that both keeps the guard and skips the job before a runner is allocated.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The loop guard, the `needs` gate and the PR-only condition all survive, and each has its own assertion.
- A reader sees the switch and the original condition on one line.

**What it costs**:
- Three long lines that a formatter could wrap badly. Mitigation: T092 to T094 quote the exact new line, and T096's mutant proves a replacement is rejected.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A parenthesis is dropped and GitHub reads a different expression | H | Every check asserts `c.count('(') == c.count(')')` |
| The `!endsWith` value loses its quotes and YAML reads a tag | H | T093 keeps the surrounding double quotes and the check loads the file |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A replacement would delete the loop guard, which the review names as a risk |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes are scored, one of them impossible |
| 3 | **Sufficient?** | PASS | One line per job, three jobs, one mutant test |
| 4 | **Fits Goal?** | PASS | R26's acceptance requires the original condition as a conjunct |
| 5 | **Open Horizons?** | PASS | A later job that adds a condition follows the same pattern |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- Three job conditions gain two conjuncts each (T092, T093, T094).
- `scratch/pass-switch.md` records the mutant rejection (T096).

**How to roll back**: Replace each of the three lines with the anchor its task quotes.

**Gated tasks**: T092 to T094 gate T096's proof.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: `SKILLED_CI_MESSAGES` exists and is documented as never-off

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-007-context -->
### Context

R26 puts a switch on every job except Dependabot's two. `message-contract.yml` holds the only required context in the active ruleset, and a skipped job reports Success, so switching it off would let a pull request merge without the message check. The phase must satisfy both the uniform rule and the prohibition.

### Constraints

- `research.md:189` says never disable message-contract while its context is required.
- The review's change line names every job except Dependabot's two, so an omission is a deviation.
- A fork with no ruleset has no required context, so the prohibition is a property of this repository, not of the variable.

<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: add the `SKILLED_CI_MESSAGES` switch to the job and document in the README that it must stay unset while the ruleset requires the context.

**How it works**: T072 inserts the switch, T095 writes the prohibition into the README section, and `006`'s protected set records the same rule for the review surface. No YAML can enforce "do not set this", so the documentation and the later `/doctor:ci report` warning are the enforcement.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Switch plus a documented prohibition** | The group list is complete; a fork can use it | A reader who ignores the README can still switch it off | 8/10 |
| No switch on that job | The prohibition cannot be violated | The group list has a hole, and a fork cannot see the variable exists | 5/10 |
| A switch that ignores `off` for this job | Enforced in YAML | The variable would exist and do nothing, which is worse than either | 2/10 |

**Why this one**: The variable's value is that a fork can quiet a group it does not need. This repository's ruleset is what makes one group special, and the README is where that rule is read.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Every job except Dependabot's two answers a variable, so the rule has no exception a reader must remember.
- The prohibition sits beside the variable's own description, not in a separate policy document.

**What it costs**:
- One more variable name to keep consistent across three places. Mitigation: AC-013 compares the workflows, the README and `scratch/switch-groups.md`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator sets it to `off` and a PR merges without the check | H | The README states the prohibition in the same section, and `009`'s report warns |
| The name is dropped from the README table | M | T095's loop fails when any of the six names is missing |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R26 names every job except Dependabot's two, and this is one of them |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes are scored, including an inert variable |
| 3 | **Sufficient?** | PASS | One line of YAML and one paragraph of README |
| 4 | **Fits Goal?** | PASS | The goal is a clone that can turn a group off without editing YAML |
| 5 | **Open Horizons?** | PASS | If the context stops being required, the README sentence is the one line to change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.github/workflows/message-contract.yml` gains one `if:` line (T072).
- `.github/workflows/README.md` gains the prohibition (T095).

**How to roll back**: Delete the `if:` line and the README sentence.

**Gated tasks**: T072 and T095.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: The group taxonomy is the README push-versus-pull-request table

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-008-context -->
### Context

Six variables need a membership rule. The README already classifies every workflow by trigger and purpose in one table (`:60-75`), and that table is the document a maintainer reads when adding a workflow. A second list of group membership would be a second answer to the same question.

### Constraints

- The table's rows are purpose groups, not switch groups: the guards row and three single-file rows make FRESHNESS, and the path-filtered row makes TESTS.
- `trigger-index-rebuild.yml` and `strict-pass-freshness-report.yml` are report-shaped, and `message-contract.yml` is the one required context.
- `009-doctor-ci-review-wiring` reads the README section rather than keeping its own list.

<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: derive the five groups from the README table's rows, record the mapping once in `scratch/switch-groups.md`, and have T095 write the README section from it.

**How it works**: T004 maps each row to a variable and records the file and job counts. T062 to T091 read one row each. T095 writes the table's membership into the new section, so the README is both the source and the description.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Derive from the README table** | One taxonomy, already maintained | The mapping needs one scratch record to be explicit | 9/10 |
| A new group list in `plan.md` | Explicit membership | A second list that drifts from the README | 4/10 |
| One variable per workflow | Maximum control | 32 names to document and set | 2/10 |

**Why this one**: The README table already answers "what does this workflow do", which is the question a group assignment asks.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
**What improves**:
- A maintainer who adds a workflow to the README table knows which variable it needs.
- There is one place to change a group's membership.

**What it costs**:
- The mapping is not one-to-one: FRESHNESS spans four rows. Mitigation: T004 records the mapping explicitly and AC-006 checks the counts sum to the tree.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A workflow is added to the README but not to a group | M | AC-006's set comparison fails on a missing file |
| A group name drifts between the three places | M | AC-013 compares the workflows, the README and the scratch table |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Six variables need a membership rule that a reader can apply |
| 2 | **Beyond Local Maxima?** | PASS | Three taxonomies are scored |
| 3 | **Sufficient?** | PASS | One table, one mapping record, five names |
| 4 | **Fits Goal?** | PASS | R26's acceptance requires a workflow and job count per group |
| 5 | **Open Horizons?** | PASS | A new workflow follows the table it is already added to |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `scratch/switch-groups.md` records the mapping (T004).
- `.github/workflows/README.md` gains the section (T095).

**How to roll back**: Delete the scratch record and the README section; the switch lines are unaffected.

**Gated tasks**: T004 gates T062 to T091 and T095.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: `006`'s rule data keeps `max(<floor>, ...)`; this phase records the value

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-009-context -->
### Context

`006-sk-code-ci-surface` writes the timeout rule as `max(<floor>, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes))` with 10 minutes as the default, and its acceptance criterion greps for `max(<floor>`. This phase must apply the rule with one concrete floor. The obvious move, rewriting the packet to `max(10, ...)`, would break that criterion and hard-code one repository's policy into a standard another repository is meant to read.

### Constraints

- `006`'s AC-002 requires `max(<floor>` to remain in the packet.
- The floor is D6's answer, which belongs to this repository at this moment.
- This phase's write scope is `.github/workflows/**` and its own folder; the packet is not in it.

<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: leave the packet parameterised and record the chosen floor in `scratch/decisions.md` as one `D6=<n>` line.

**How it works**: T001 writes the line, T026 passes it to the sizing script, and T060 asserts every tree value is at least the floor. No file outside `.github/` and the phase folder changes, and `006`'s criterion keeps passing.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Keep the parameter, record the value here** | The standard stays reusable; `006`'s check keeps passing | The floor is in two documents: the packet's default and this phase's record | 9/10 |
| Rewrite the packet to `max(10, ...)` | One place states the number | Breaks `006`'s criterion and makes the standard repository-specific | 2/10 |
| Drop the floor from the packet | No parameter to explain | A fork would have no stated minimum | 4/10 |

**Why this one**: A standard describes a shape; a phase records the value it chose. Mixing the two makes both harder to change.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- `006`'s acceptance criterion keeps passing, and the packet stays readable by another repository.
- This phase's write scope stays inside `.github/` and its own folder.

**What it costs**:
- A reader who wants the floor must read `scratch/decisions.md` rather than the packet. Mitigation: T095's README section does not state the floor, and the packet states 10 as the default, so the two agree on the default path.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator picks 5 and a reader assumes 10 | L | T001 records the answer, and T060 asserts the minimum value is at least the recorded floor |
| A later phase edits the packet anyway | L | ADR-009 names the reason not to; `006`'s AC-002 fails if the parameter is removed |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase needs a floor, and the packet needs to stay generic |
| 2 | **Beyond Local Maxima?** | PASS | Three placements are scored |
| 3 | **Sufficient?** | PASS | One line in one scratch file |
| 4 | **Fits Goal?** | PASS | R24 needs a value, not a new standard |
| 5 | **Open Horizons?** | PASS | A fork reads the packet, picks its own floor and records it the same way |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `scratch/decisions.md` holds `D6=<n>` (T001).
- No file in `.skilled/` changes.

**How to roll back**: Delete the `D6=` line.

**Gated tasks**: T001 gates T026 and every timeout task.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: The phase commits per concern, not as one commit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-010-context -->
### Context

The phase edits 32 workflow files three times. One commit would be a 90-line diff across 32 files, and a rollback would have to unpick the concern that failed from the two that did not. The most likely failure is a timeout that killed a green run, and that failure says nothing about the permissions or the switch.

### Constraints

- A revert must name one concern and leave the other passes in place.
- The gate runs after each pass, so each commit can carry a green gate.
- The Dependabot split is the one change that alters a job graph, so it must be separable from the 12 permission headers.

<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: five commits: the permissions headers, the Dependabot split, the timeout pass, the switch pass, and the README section.

**How it works**: T020 gates the permissions pass, T060 the timeout pass and T096 the switch pass. Each commit carries its pass and its scratch record, so a revert of one leaves the others and their evidence intact.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Five commits, one per concern** | A revert names one concern; each commit has a green gate | Five commits for one phase | 9/10 |
| One commit for the phase | One revert for everything | A timeout failure forces a revert of the permissions and the switch too | 3/10 |
| One commit per workflow file | The smallest possible revert | 32 commits, and a rollback of one pass becomes 32 reverts | 4/10 |

**Why this one**: The concern is the unit an operator reasons about when something breaks, so it is the unit a revert should name.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- A killed timeout is reverted without touching the permissions or the switch.
- Each commit's gate result is evidence for that concern alone.

**What it costs**:
- Five commits and five gate runs. Mitigation: the gate is fast and the phase is one branch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later pass depends on an earlier commit that was reverted | M | The passes are independent by construction: a switch line does not read a timeout, and a timeout does not read a permission |
| The split's revert leaves a timeout on a job that no longer exists | L | The timeout commit is separate, so it is reverted second |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The three concerns fail independently and are reverted independently |
| 2 | **Beyond Local Maxima?** | PASS | Three commit shapes are scored |
| 3 | **Sufficient?** | PASS | Five commits, five gates, no extra branch |
| 4 | **Fits Goal?** | PASS | R25, R24 and R26 are three concerns by definition |
| 5 | **Open Horizons?** | PASS | A later phase that edits the same files adds its own commit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- The phase lands as five commits, in the order of ADR-002: the permissions pass (T021), the Dependabot split (T023), the timeout pass (T061), the switch pass (T097) and the README section (T098).
- `scratch/phase-result.md` names each commit and its gate result.

**How to roll back**: `git revert` the commit for the failing concern, then re-run the gate and one dispatch of the affected workflow.

**Gated tasks**: T020, T060 and T096 are the three gate points that make the split safe.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---
