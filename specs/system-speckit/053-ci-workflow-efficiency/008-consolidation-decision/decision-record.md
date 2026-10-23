---
title: "Decision Record: consolidation decision"
description: "The six choices this phase freezes: D8's no-merge default, the eight-workflow FRESHNESS candidate set, the job-level measurement basis, the one-workflow one-job merge shape, the split between this file and the measured decision record, and D8 = yes as the confirmation a protected workflow needs."
trigger_phrases:
  - "consolidation decision record"
  - "d8 merge default adr"
  - "freshness candidate set adr"
  - "merged workflow shape adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/008-consolidation-decision"
    last_updated_at: "2026-10-23T14:10:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded six proposed ADRs for the planned phase"
    next_safe_action: "Answer D8 after the measurement, then run the phase's tasks from T001"
    blockers:
      - "D8 is unanswered; the default is no merge"
      - "002 to 007 have not landed, so every job count and line number is provisional"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-008-consolidation-decision"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: consolidation decision

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> **One operator decision gates this phase: D8, whether any always-run workflow is merged.** ADR-001 records it with its default and its alternative; T012 is the task that collects the answer, and every merge task is barred until it exists. ADR-002 to ADR-006 are design choices this plan freezes, not questions for the operator.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: No always-run workflow is merged without an operator yes, and the default is no merge

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D8); plan author for the default |

---

<!-- ANCHOR:adr-001-context -->
### Context

R27 asks for a re-measurement and then a decision, and it names the decision as the operator's (`final-review.md:495-503,621`). The saving it prices is an upper bound, the mechanism that produces it is the loss of twelve separate check contexts, and the volume it was priced on no longer exists once R1 removes 35 of 73 push SHAs. A phase that merged on its own authority would be trading a visible per-check signal for a number it derived itself.

### Constraints

- R27's risk note says the risk is high if merged and the per-check signal is lost (`final-review.md:500-501`).
- The bound is 1,241-1,606 runner-min/day at today's volume, and far less after R1 (`final-review.md:500`).
- `009-doctor-ci-review-wiring` reads the workflow count and switch state this decision can change, so the answer has to be recorded before that phase reports.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: no merge unless the operator answers D8 yes, with `no` as the default, recorded as one line in `scratch/d8-answer.md` before any merge task runs.

**How it works**: T011 writes the decision record with `D8: pending`. T012 puts the question to the operator with the `Measurements` and `Signal cost` sections in hand and writes `D8=no` or `D8=yes` to `scratch/d8-answer.md`. T013 copies the answer into the decision record. On `no`, T014 proves the workflow tree is unchanged and the phase closes. On `yes`, T015 to T020 run and T023 commits the merge separately.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **No merge unless the operator says yes (default)** | Keeps thirteen check contexts; changes no workflow; the measured number is still recorded for a later packet | The saving is not taken | 9/10 |
| Merge on the phase's own authority when the measured saving is large | Takes the saving without operator latency | Trades a per-check signal for a number the phase derived, on a volume that shrank after R1 | 3/10 |
| Merge every always-run workflow including message-contract | The largest possible saving | One job answering two switch variables, and a required context inside a merged job | 1/10 |

**Why this one**: The decision is a policy about signal, not a calculation. The phase produces the measurement that makes the policy answerable and then waits for the answer.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Thirteen check contexts survive by default, so a failing check still names itself.
- The measured before and after numbers exist either way, so a later packet can merge on evidence rather than on the research's projection.

**What it costs**:
- The bound is not taken on the default path. Mitigation: `scratch/consolidation-decision.md` carries the measured number and the exact merge shape, so taking it later is one commit rather than a re-measurement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator answers yes on the stale 1,241-1,606 bound | M | The decision record shows both bounds side by side and labels the first "today's volume" |
| The answer arrives before the measurement exists | M | T012 follows T011, and T011 cannot be written without `scratch/consolidation-cost.json` |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R27's acceptance gate is "a merge carried out only if the operator approves D8" (`final-review.md:598`) |
| 2 | **Beyond Local Maxima?** | PASS | Three options are scored: default no, phase-authorised merge, and the all-nine merge |
| 3 | **Sufficient?** | PASS | One line in one scratch file, one copy into the record, and one gate on the merge tasks |
| 4 | **Fits Goal?** | PASS | R27 exists to decide, and a decision without an owner is not a decision |
| 5 | **Open Horizons?** | PASS | The measured record and the merge shape stay usable after this phase, so a later yes costs one commit |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `scratch/d8-answer.md` gains one `D8=` line (T012).
- `scratch/consolidation-decision.md` carries the same answer (T013).
- No workflow file changes on `no`; eight files change on `yes` (T015 to T020).

**How to roll back**: Delete `scratch/d8-answer.md` and restore `D8: pending` in the decision record. On a `yes` that has already merged, `git revert` the merge commit, which restores the eight files and the README rows.

**Gated tasks**: T012 gates T014 on `no` and T015 to T020 on `yes`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The candidate set is the eight always-run FRESHNESS workflows

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-002-context -->
### Context

The nine always-run workflows are not all in the same switch group. Phase 007 assigns eight of them to FRESHNESS and puts `message-contract.yml` in MESSAGES (`007-workflow-hygiene-on-off-control/spec.md:149`). A merged job that answered both variables would let one group's switch silence the other group's checks, and `message-contract.yml` carries a required status context, so silencing it would block every merge rather than save a run.

### Constraints

- `message-contract.yml`'s context is required by the ruleset, and the research's safety rule says never disable it while that holds (`001-research/research/research.md:189`).
- `naming-standard-guard.yml` sits in FRESHNESS but is not always-run: it answers `skilled/v*` pushes and every pull request, so merging it would change its trigger.
- The FRESHNESS group is 9 files and 13 jobs; removing `naming-standard-guard.yml` leaves 8 files and 12 jobs.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the candidate set is exactly the eight always-run FRESHNESS workflows, 12 jobs: `advisory-checks.yml`, `changed-packet-validation.yml`, `command-tree-parity.yml`, `dispatch-enforcement-guard.yml`, `gate-inputs.yml`, `playbook-operator-contract.yml`, `rule-canary-sync.yml` and `sk-doc-script-tests.yml`.

**How it works**: T015 assembles those eight files' steps into one job and T016 deletes the eight. `message-contract.yml` and `naming-standard-guard.yml` keep their files and their groups. D8 offers two answers only; a subset answer is a re-plan, because the arithmetic, the step order and the README edits are all written for the full set.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **The eight always-run FRESHNESS workflows** | One switch group; the twelve check contexts that exist are the ones that merge; the arithmetic is fixed | Leaves `message-contract.yml` and `naming-standard-guard.yml` outside | 9/10 |
| All nine always-run workflows | The largest saving, 13 jobs into one | Crosses into MESSAGES and puts a required context inside a merged job | 1/10 |
| A subset chosen from the measurement | Could avoid the slowest member | Every task's arithmetic, step order and README edit would differ, and a subset chosen after the numbers exist cannot be planned in advance | 3/10 |

**Why this one**: The switch group is the boundary the repository already maintains, and a merge that crosses it would make one variable govern another group's checks.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The merge stays inside one switch group, so `SKILLED_CI_FRESHNESS=off` still turns off exactly the freshness checks.
- The candidate set is fixed before the numbers exist, so no task's arithmetic depends on an answer given later.

**What it costs**:
- `message-contract.yml` and `naming-standard-guard.yml` keep separate jobs and separate checkouts. Mitigation: they are outside R27's always-run set, so their cost is not part of the bound.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later phase adds a workflow to FRESHNESS | L | The candidate set is named by file, so a new member is a new decision, not a silent inclusion |
| The operator wants a subset | M | T012 stops on a subset answer and the phase returns to planning rather than improvising |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The nine span two switch groups, and a merged job cannot answer both variables |
| 2 | **Beyond Local Maxima?** | PASS | Three sets are scored: eight, nine, and a measurement-chosen subset |
| 3 | **Sufficient?** | PASS | Eight file names and one exclusion rule; no per-file exception exists |
| 4 | **Fits Goal?** | PASS | R27's saving is the merge of the always-run guards, which is exactly this set |
| 5 | **Open Horizons?** | PASS | A future workflow joins by a new decision, and the exclusion rule survives the merge |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.github/workflows/always-run-guards.yml` carries the eight files' steps (T015).
- The eight files are deleted (T016).
- `.github/workflows/README.md` names the merged file once in each of its three tables (T017 to T019).

**How to roll back**: `git revert` the merge commit; it restores the eight files and the README rows in one step.

**Gated tasks**: T015 to T020, all of them inside `D8=yes`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The measurement is job-level seconds, `ceil(seconds / 60)` per job, scaled by `24 / 23.5`

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

The before number and the after number have to be comparable, or the decision compares two different measurements. The 001 dataset measured job seconds and billed them at `ceil(seconds / 60)` per job (`001-research/scratch/ci-run-data/summary.md:5`). A run's wall clock is not that number: it includes the wait for a runner and the gaps between jobs, and `timeout-minutes` and billing both see job execution only (`final-review.md:28-33`).

### Constraints

- The before number is 1,065 job-seconds and 25 billed minutes per push across 13 jobs, from a 23.5 h window of 73 runs per workflow.
- The merge saving is a difference of billed minutes, so the per-job ceiling has to be applied to each job before the sum, and again to the merged job after it.
- A snapshot may hold fewer than 40 runs per workflow, so every median needs its sample count beside it.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: job seconds from `startedAt` to `completedAt`, billed as `Math.ceil(seconds / 60)` per job, summed per push, and scaled to a day by the measured window's own hours.

**How it works**: T006 fetches `gh run view <id> --json jobs` per run. T008's script computes each job's seconds and ceiling, the per-workflow medians, the per-day figures at `24 / hours`, and the merged job's ceiling from the sum minus the checkouts. T010's `--check` re-derives every number from the saved JSON, so a mistyped figure fails rather than reaches the decision record.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **Job-level seconds, `ceil(seconds / 60)`, `24 / hours`** | Matches the before number and the billing rule; the ceiling collapse is inside the measurement | Needs one `gh run view` per run, about 360 calls | 9/10 |
| Run-level wall clock | One number per run, cheap to collect | Includes queueing and inter-job gaps, so it overstates every job and cannot be compared with the 001 dataset | 2/10 |
| Median of per-run totals without the per-job ceiling | Simpler arithmetic | Loses the ceiling collapse, which is the mechanism that produces part of the saving | 4/10 |

**Why this one**: The before number was measured this way, and a saving computed on a different basis cannot be subtracted from it.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### What improves

- The after number is directly comparable with the 1,241-1,606 bound and with the 1,866 runner-min/day before figure.
- `--check` turns a mistyped figure into a failing exit rather than a wrong decision.

**What it costs**:
- About 360 `gh run view` calls per snapshot. Mitigation: they are taken once and kept as JSON, and a second arithmetic pass re-reads the files.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A workflow returns fewer than 20 runs | M | T005 stops the snapshot and the 48 h extension in T007 records both spans |
| A job has no successful run | L | The script marks it `failed-only` and sizes it from its failed runs |
| `gh` rate-limits mid-snapshot | M | T004 and T006 stop on a non-zero exit and the saved pages are resumed, never interpolated |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The decision subtracts one number from another, and both have to share a basis |
| 2 | **Beyond Local Maxima?** | PASS | Three bases are scored: job seconds, run wall clock, and per-run totals without the ceiling |
| 3 | **Sufficient?** | PASS | One script, one JSON, one `--check`; no manual figure enters the record |
| 4 | **Fits Goal?** | PASS | R27's acceptance is a decision record with before and after numbers, which requires one basis |
| 5 | **Open Horizons?** | PASS | The JSON stays readable, so a later packet can re-derive the same numbers without a new snapshot |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `scratch/jobs/` holds the raw `gh run view --json jobs` output (T006).
- `scratch/consolidation-cost.mjs` holds the arithmetic and `--check` (T008).
- `scratch/consolidation-cost.json` and `.md` hold the computed table (T009).

**How to roll back**: Delete the four artifacts. No repository file depends on them, and the decision record is the only consumer.

**Gated tasks**: T006 gates T008; T008 gates T009; T009 gates T011.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: A merge is one workflow, one job, the trigger union, steps ordered by Node major, `fetch-depth: 0` and `if: always()` after the checkout

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-004-context -->
### Context

The saving comes from paying one checkout instead of twelve, and from collapsing twelve job ceilings into one. Everything else about the merge is a risk to the checks themselves: a dropped trigger ends a scheduled run, a shallow checkout breaks the one member that diffs against its base, a step order that changes the Node major changes what a check executes, and a default `if` stops every later step after the first failure.

### Constraints

- `playbook-operator-contract.yml:9-10` carries `schedule: - cron: '17 6 * * *'`; `advisory-checks.yml`, `gate-inputs.yml` and `playbook-operator-contract.yml` answer every pull request, so the merged `pull_request:` cannot carry a branch filter.
- `changed-packet-validation.yml:17-19` and `citation-drift` in `sk-doc-script-tests.yml` both check out with `fetch-depth: 0`; a shallow merged checkout breaks them.
- `rule-canary-sync.yml:13-15` has no `setup-node`, so its step ran on the runner's default major.
- Phase 003 adds a `concurrency:` block to every PR-triggered workflow, and phase 007 gives every job a timeout and a switch; the merged file copies both shapes rather than inventing one.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: one workflow `.github/workflows/always-run-guards.yml`, one job `always-run-guards`, the trigger union with the schedule, one `fetch-depth: 0` checkout, the Node 20 group before the Node 22 group, and `if: always()` on every step after the checkout.

**How it works**: T015 writes the header, copies phase 003's `concurrency:` block verbatim and assembles the steps in member order inside each Node group. Every step keeps its `name:` and its `run:` body. A step with no condition gets `if: always()`; a step with one gets `if: always() && (<original condition>)`. The timeout is the sum of the eight members' phase-007 values, re-sized after the first green run. T020 proves a forced failure does not stop the later steps.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **One job, trigger union, Node-major order, `fetch-depth: 0`, `if: always()`** | One checkout and one ceiling; every member keeps its trigger and its major; every step runs after a failure | A serial job of about 8-10 minutes; one failure produces one red job rather than one red check | 8/10 |
| One job with a shallow checkout | Saves about 20 s of checkout | Breaks `changed-packet-validation` and the citation gate, which need the base commit | 1/10 |
| Two jobs split by Node major | Each job keeps one major without ordering steps | Two checkouts, so half the saving disappears | 5/10 |

**Why this one**: The checkout is the saving, and the four constraints are the minimum needed to keep every member behaving as it did.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- One checkout and one job ceiling replace twelve, which is the measured saving.
- Shared installs: `sk-doc-script-tests`' three jobs now share one `npm ci` and one Python setup.

**What it costs**:
- The merged job is serial, about 8-10 minutes against a 167 s worst single job today. Mitigation: `spec-kit-check.yml`'s 1,178 s remains the push tail, so the merged job does not become the slowest.
- A failing step makes the whole job red, so one red job stands for twelve checks. Mitigation: every step keeps its name and shows its own conclusion in the run view.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The merged `on:` drops the daily schedule | M | T015 copies `schedule: - cron: '17 6 * * *'` and the check asserts the key exists |
| The single checkout is shallow | H | T015 uses the quoted three-line checkout with `fetch-depth: 0` |
| A step lands in the wrong Node group | M | A member without `setup-node` goes in the Node 20 group; T020 reads every step's conclusion |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the one-checkout shape there is no saving to decide about |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes are scored: one job at depth 0, one job shallow, and two jobs by major |
| 3 | **Sufficient?** | PASS | The shape is a header block plus a copying rule; no step is rewritten |
| 4 | **Fits Goal?** | PASS | The saving is exactly the checkouts and ceilings the shape removes |
| 5 | **Open Horizons?** | PASS | The step list is copied, so a later edit to a member is an edit to one file |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.github/workflows/always-run-guards.yml` is created (T015).
- The eight member files are deleted (T016).
- `.github/workflows/README.md` names the merged file in its three tables (T017 to T019).

**How to roll back**: `git revert` the merge commit, which restores the eight files and the README rows and leaves the decision record in place.

**Gated tasks**: T015 gates T016 and T020; T016 gates T017 to T019.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: This phase keeps two decision documents, one for design and one for the measured decision

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-005-context -->
### Context

R27's acceptance is "a decision record with the before and after numbers" (`final-review.md:499`). A spec packet's `decision-record.md` is a different artifact: it records frozen choices with context, alternatives and five checks, and it is written before the work runs. Filling it with measurements would put a document that must not change after approval in front of numbers that do not exist yet.

### Constraints

- `decision-record.md` must exist at Level 3 and its ADRs must carry the template's anchors.
- The measured record has to quote numbers from `scratch/consolidation-cost.json`, which is written during the phase.
- Both documents are read by `009-doctor-ci-review-wiring` and by a later packet that wants to take the merge.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: `decision-record.md` holds the six design ADRs, and `scratch/consolidation-decision.md` holds the measured decision with Context, Candidates, Measurements, Signal cost, Recommendation and D8 answer.

**How it works**: T011 writes the measured record from `scratch/consolidation-cost.json`. The ADRs here name the shapes and the boundaries and cite the record rather than repeating a number. T024 closes the acceptance criteria against the measured record's evidence.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **Two documents, one each** | Each document keeps one purpose; the ADRs stay stable after approval and the measured record carries the numbers | Two files to read | 9/10 |
| One document, the measured record promoted into `decision-record.md` | One place to read | The ADRs would have to be rewritten once the numbers exist, and a number inside an approved ADR is a claim that goes stale | 4/10 |
| The measured record only, with no ADR file | Less duplication | Level 3 requires `decision-record.md`, and the frozen shapes need a record before the numbers exist | 3/10 |

**Why this one**: A decision that must not change and a measurement that does not exist yet cannot live in the same document.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### What improves

- The ADRs are stable from planning to closure, and the measured record can be rewritten if a number is corrected.
- A later packet that takes the merge reads one file, not a diff of two.

**What it costs**:
- A reader has to know which file answers which question. Mitigation: this ADR and `plan.md`'s Implementation Notes say so in one line each.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The two documents disagree on D8's answer | M | T013 writes the answer into the measured record, and T012's file is the single source |
| A reader quotes an ADR for a number | L | No ADR states a measured figure; each cites the record instead |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | R27 asks for a record with numbers and the packet requires a design record |
| 2 | **Beyond Local Maxima?** | PASS | Three arrangements are scored: two documents, one merged document, and no ADR file |
| 3 | **Sufficient?** | PASS | Two files, one purpose each, one cross-reference line |
| 4 | **Fits Goal?** | PASS | R27's deliverable is the measured record; the ADRs are this packet's own requirement |
| 5 | **Open Horizons?** | PASS | A later merge reuses the measured record without touching an approved ADR |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scratch/consolidation-decision.md` is created (T011) and its D8 line is filled (T013).
- `decision-record.md` stays as written.

**How to roll back**: Delete `scratch/consolidation-decision.md` and re-run T011. No ADR depends on its content.

**Gated tasks**: T011 gates T012; T013 gates T022's commit.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: D8 = yes is the second named confirmation a protected workflow needs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; operator for the confirmation itself |

---

<!-- ANCHOR:adr-006-context -->
### Context

The research's safety rules name a protected set: a workflow is protected by function, not by list, and the rule is never to edit a protected workflow without a second, named confirmation that restates the workflow's role (`001-research/research/research.md:185-187`). Two members of the candidate set are protected: `gate-inputs.yml`, the sole enforcer of an invariant with no local gate, and `dispatch-enforcement-guard.yml`, a guard whose failure invalidates other workflows' inputs.

### Constraints

- A merge deletes both files and moves their steps, which is an edit to a protected workflow.
- The confirmation has to be named and recorded before the edit, not after it.
- D8 is already a recorded operator answer, so a second channel would ask the same person the same question twice.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: D8 = yes is the second named confirmation, and the question T012 puts to the operator names both protected workflows and their roles.

**How it works**: T012's alternative states that a yes is the confirmation that `dispatch-enforcement-guard.yml` and `gate-inputs.yml` may be edited. `scratch/d8-answer.md` records the answer, and `scratch/consolidation-decision.md` carries it. No merge task runs before that file holds `D8=yes`.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Disadvantages | Score |
|--------|------|---------------|-------|
| **D8 = yes, with the question naming both protected workflows** | One recorded answer, named and dated, before the edit | The operator answers two questions in one | 9/10 |
| A separate confirmation task after D8 | A dedicated record for the protected set | Two tasks asking the same person, and the second can be skipped under time pressure | 6/10 |
| Treat the merge as a non-edit because the steps move rather than change | No extra confirmation | The files are deleted and their checks change name, which is the edit the rule guards | 1/10 |

**Why this one**: The rule asks for a named confirmation that restates the role. Putting both roles in the D8 question does that in one recorded answer.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### What improves
- The protected set's confirmation exists, is dated, and names the two workflows and their roles.
- No merge can start on an unanswered D8, which is also the confirmation.

**What it costs**:
- The D8 question carries more than a cost trade-off. Mitigation: T012's alternative spells out the protected set so the answer is informed.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The operator answers yes without reading the protected-set sentence | M | The sentence sits in the alternative, immediately above the `D8=yes` line T012 writes |
| A later phase adds a protected workflow to the candidate set | L | The candidate set is fixed by file, so a new member is a new ADR |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two candidate members are protected by function and the merge deletes them |
| 2 | **Beyond Local Maxima?** | PASS | Three arrangements are scored: D8 as the confirmation, a separate task, and no confirmation |
| 3 | **Sufficient?** | PASS | One sentence in T012's alternative plus the recorded answer |
| 4 | **Fits Goal?** | PASS | A merge that skips the rule would be the one outcome the safety rules exist to prevent |
| 5 | **Open Horizons?** | PASS | The rule stays visible in the phase that would break it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- T012's alternative names both protected workflows and their roles.
- `scratch/d8-answer.md` records the answer before T015 runs.

**How to roll back**: Delete `scratch/d8-answer.md` and re-ask. On a merged tree, `git revert` the merge commit.

**Gated tasks**: T012 gates every merge task, T015 to T020.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---
