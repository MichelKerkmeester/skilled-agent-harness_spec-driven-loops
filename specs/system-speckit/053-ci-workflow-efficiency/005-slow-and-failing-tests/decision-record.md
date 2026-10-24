---
title: "Decision Record: slow and failing tests"
description: "The ten design choices this phase freezes: the one-setting probe copy, the CLI-only flip, the two-way shard fallback, the behavioural comment, the re-check before the fix, the no-retry rule, the fast-fail drift step, the filed-root-cause branch, the natural-run green watch, and the five stale confirmations. No operator decision gates this phase."
trigger_phrases:
  - "slow and failing tests decision record"
  - "file parallelism probe adr"
  - "cli vitest shard adr"
  - "contract drift fast fail adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/005-slow-and-failing-tests"
    last_updated_at: "2026-10-23T14:05:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded ten proposed ADRs for the planned phase"
    next_safe_action: "Run the phase's tasks from T001"
    blockers:
      - "002-rebuild-fanout-removal baseline pending; the 001 dataset stands in as provisional"
      - "runtime/cli/dist and the deep-loop and advisor trees are not installed in this worktree"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-005-slow-and-failing-tests"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Do the 183 CLI test files share a mutable fixture that only collides under parallelism?"
      - "Will 10 green runs accumulate at this repository's traffic?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: slow and failing tests

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Probe the setting on a copy, then change the real config

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Amended 2026-10-24, operator ruling recorded |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; operator ruling of 2026-10-24 (question tool) |

---

<!-- ANCHOR:adr-001-context -->
### Context

The `cli` project sets `fileParallelism: false` at `.skilled/skills/system-spec-kit/vitest.config.ts:67` without a stated reason, and 183 test files run one at a time. That makes the `CLI vitest project` step 791 s of the `check` job's 1,215 s in run `39909844384`. Turning the setting on in the real file before measuring would put the repository's slowest step behind an untested assumption.

### Constraints

- The project root is `runtime/cli`, and the config resolves `__dirname`, so a probe config must sit in the same directory to behave identically.
- A probe that edits the real config leaves a window in which any run picks up a half-flipped tree.
- The probe decides pass or fail, not duration: a local machine and the 4-vCPU runner differ.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: copy the real config to `vitest.config.parallel-probe.ts` beside it, flip only the `cli` project's `fileParallelism`, run the project three times, delete the copy, and edit the real file only when all three runs exit 0.

**How it works**: the copy is byte-identical apart from one line, which a `diff` against a `sed`-rewritten copy proves. The three runs write `scratch/r19-run-{1,2,3}.log`, and the copy is deleted in T009 before T011 or T013 touches a real file.

**Amendment (2026-10-24, operator ruling, written after the data)**: the probe did not run clean. The serial run passed all 183 collected files; parallel run 1 passed, and parallel runs 2 and 3 each failed one test with a 30-second timeout (`tests/auto-detection-fixes.vitest.ts` and `tests/trigger-phrase-no-prose-bigrams.vitest.ts`), with an empty collision log. The planned rules only named a collision token (`EEXIST`, `EADDRINUSE`, `SQLITE_BUSY`) as the shard trigger, so the planned T010 script would have stopped as unclassified and its Stop-if fired. The operator ruled on 2026-10-24, after seeing these rows, to accept the shard: a timeout that appears only in parallel rows while the serial row passed counts as a concurrency result alongside the collision tokens. This ruling is a disclosed deviation from the planned rule, not a reading of it.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A one-setting probe copy (chosen)** | The real config is untouched until the setting is proven, and the copy resolves `__dirname` identically | One extra file for the length of the probe | 9/10 |
| Flip the real config and revert on failure | One fewer step | A red `main` between the two commits, on the slowest step | 4/10 |
| Run a subset of the 183 files | Faster probe | It would miss exactly the fixture collision the probe exists to find | 3/10 |

**Why this one**: the probe is cheap, it leaves no window in which the shared config is half-changed, and the copy proves the one-line difference mechanically.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The shared config changes only after the real suite has passed three times with the setting on.
- A collision costs a probe run and a deleted file, not a red `main`.

**What it costs**:
- One untracked config exists for the length of the probe. Mitigation: T009 deletes it and proves it is gone before any real edit.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The probe copy drifts from the real config | M | T005's `diff` against a `sed`-rewritten copy prints nothing when the only difference is the flipped line |
| A local green does not hold on CI | M | The CI acceptance adds 5 green runs, and the shard is one task away |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 791 s of a 1,215 s job is one serial project, and the setting has no stated reason |
| 2 | **Beyond Local Maxima?** | PASS | Three probe shapes compared, including flipping the real file |
| 3 | **Sufficient?** | PASS | Three runs plus a collision grep answer the only open question |
| 4 | **Fits Goal?** | PASS | It is R19, the probe the review's phase plan names |
| 5 | **Open Horizons?** | PASS | The same probe shape works for the four other `fileParallelism` sites if a later phase needs them |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.skilled/skills/system-spec-kit/vitest.config.parallel-probe.ts`: created by T005, deleted by T009.
- `scratch/r19-probe.md` and the four `scratch/r19-*.log` files: the evidence.

**Gated tasks**: T003 to T010.

**How to roll back**: delete the probe config and the probe records. The real config was never touched, so nothing else changes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Flip the CLI project and leave the root project serial

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Not applied: the probe selected the shard (see Amendment, 2026-10-24) |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-002-context -->
### Context

Five `fileParallelism` sites live in four files, because `.opencode/skills` is a symlink to `../.skilled/skills`: `system-spec-kit/vitest.config.ts:50,67`, `system-spec-kit/runtime/vitest.config.ts:38`, `system-skill-advisor/runtime/vitest.config.ts:39` and `system-deep-loop/runtime/vitest.config.ts:20`. Only the `:67` site sets the wall-clock tail. The `root` project at `:50` collects the spec-kit runtime suites, which the runtime config marks serial because those suites share mutable state.

### Constraints

- The `root` project's suites share mutable state, which `system-spec-kit/runtime/vitest.config.ts:36-38` records.
- The phase's scope boundary names one setting and its comment.
- The saving belongs to the project that is the longest step, not to every project that sets the flag.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: set `fileParallelism: true` on the `cli` project only, and leave the four other sites serial.

**How it works**: T012 replaces the one line at `:67` with a three-line reason and the new value. The root project's `:50` line is untouched, and the acceptance proves one `true` and one `false` remain in that file.

**Amendment (2026-10-24)**: the probe selected the shard, so no `fileParallelism` site was flipped. `rg -n 'fileParallelism' .skilled/skills --glob 'vitest.config.ts'` still finds 5 sites in 4 files, all `false`, and `vitest.config.ts` is unmodified. The comment rewrite and the setting flip are skipped by the shard branch; the `cli` project stays serial inside each shard.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Flip the CLI project only (chosen)** | The saving lands on the longest step, and the suites that share state stay serial | One project keeps its serial tail | 9/10 |
| Flip every site | One rule everywhere | The root, advisor and deep-loop suites would run in parallel against state they share | 3/10 |
| Flip the root project instead | It also sets the flag | It is not the wall-clock tail, so the saving would be seconds | 2/10 |

**Why this one**: the review measures R20 on the CLI project, and the other four sites carry reasons for staying serial that this phase has no evidence to overturn.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- The step the review measures falls, and the four suites with shared state keep their serial guarantee.
- The same-class inventory is explicit: 5 sites, 4 files, 1 changed.

**What it costs**:
- Two projects in one file now differ in a second setting, so the comment must say why. Mitigation: ADR-004.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later reader copies the setting to the root project | M | The comment at `:14-17` states that only the CLI project runs in parallel and why |
| A second site is edited by mistake | L | `grep -c 'fileParallelism: true'` returns 1 and `false` returns 1 |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The CLI project is 65.1% of the check job |
| 2 | **Beyond Local Maxima?** | PASS | All five sites were inventoried and four were rejected with reasons |
| 3 | **Sufficient?** | PASS | One line plus one comment |
| 4 | **Fits Goal?** | PASS | It is R20's change |
| 5 | **Open Horizons?** | PASS | A later phase can revisit the other four with their own probes |
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.skilled/skills/system-spec-kit/vitest.config.ts:67`: the value and its reason.
- `.skilled/skills/system-spec-kit/vitest.config.ts:50`: unchanged.

**Gated tasks**: T012, T032.

**How to roll back**: `git revert` the R20 commit, or restore the one anchor line and its four-line comment.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: The fallback is a two-way shard inside the existing step

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Amended 2026-10-24, operator ruling recorded |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; operator ruling of 2026-10-24 (question tool) |

---

<!-- ANCHOR:adr-003-context -->
### Context

If the probe collides, the config stays serial and the step still has to fall under 400 s. The `CLI vitest project` step at `.github/workflows/spec-kit-check.yml:124-128` runs one command in the `check` job. A second job or a matrix would change the job count and the check name, which this phase's scope boundary forbids and which phase 007 would then have to re-measure.

### Constraints

- No check name, trigger or job count changes.
- Both halves' failures must fail the step; a swallowed half would make the shard worse than the serial run.
- `set -e` would abort at the first `wait`, so it cannot be used.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: run `--shard=1/2` and `--shard=2/2` as two background processes inside the existing step, capture both pids, wait for each with `|| status=1`, and exit with the accumulated status.

**How it works**: T013 replaces the three-line `run:` block with ten lines: `set -uo pipefail`, the same `cd`, the two shards with `&`, `first=$!`, `second=$!`, `status=0`, two `wait` lines and `exit "$status"`. T014 proves both halves locally.

**Amendment (2026-10-24, operator ruling)**: the count-based `--shard=1/2` and `--shard=2/2` split was committed and measured, and it did not reach the ceiling. Spec-Kit Check run 40090109005 timed the `CLI vitest project` step at 643 s and run 40094302049 at 482 s, against 791 s in run 39909844384; the reference moved between 776 s and 950 s across four planning samples, so two samples do not establish a gain, and both are over 400 s. The cause is the split: the local sequential halves took 145.13 s and 561.58 s, and one file, `tests/upgrade-legacy.vitest.ts`, takes about half of the project's serial time (369.0 of 709 s of per-file time in a timing run), so a file-count split cannot balance it. The spec's rule for a miss is to re-measure and not relax the ceiling, and the operator ruled on 2026-10-24 to keep two shards and rebalance them by hand. The step now runs two concurrent processes inside the existing step, with the same wait-and-propagate block: the first runs `tests/upgrade-legacy.vitest.ts` alone and the second runs every other file through `--exclude`. This stays inside G3 (two shards, one step, no job count or check name change). Local check, one process after the other: 313.90 s for the heavy file (exit 0, 67 tests) and 356.56 s for the 182 others (exit 0, 1995 passed, 20 skipped), covering all 183 files and the serial run's 2062 passed and 20 skipped. AC-003 stays Unmet, awaiting CI measurement after the commit; the cost of the hand-kept split is that a new slow file, or a rename of the heavy one, changes the balance (a rename fails loudly, because the first process then finds no test file).
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Two shards in the existing step (chosen)** | No job count or check name changes, and both statuses propagate | One step runs two processes | 8/10 |
| A two-leg matrix job | Each half gets its own log | The job count and the check name change, and phase 007 must re-measure | 4/10 |
| A second job with `needs:` | Clear separation | Same rename problem, plus a second checkout and install | 3/10 |

**Why this one**: the shard is a fallback, so it should cost the smallest possible structural change. Two processes in one step keep the workflow's shape and the check name.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The step still halves its wall time when the config cannot go parallel.
- The workflow keeps one job, one check name and one install.

**What it costs**:
- One step now runs two processes, so a reader must follow the `wait` lines to see that either failure fails the step. Mitigation: the comment in the block and ADR-003.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| One half's failure is hidden | H | `set -uo pipefail` without `-e`, two `wait ... \|\| status=1`, `exit "$status"` |
| Two vitest processes collide on a snapshot folder | L | Snapshots are read-only during a run; the local T014 proves both halves |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The probe may collide, and the 400 s ceiling still applies |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared, two rejected for structural churn |
| 3 | **Sufficient?** | PASS | Two halves cover every file exactly once |
| 4 | **Fits Goal?** | PASS | It is R20's fallback, named in the review |
| 5 | **Open Horizons?** | PASS | The same block can become four shards if the file count grows |
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.github/workflows/spec-kit-check.yml:126-128`: the `run:` block becomes ten lines.

**Gated tasks**: T013, T014, T032.

**How to roll back**: restore the three anchor lines, or `git revert` the shard commit.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The setting's comment states behaviour, never a packet id

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Not applied: the probe selected the shard (see Amendment, 2026-10-24) |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-004-context -->
### Context

The repository bans ephemeral identifiers in code comments: no spec path, packet number, R-id or D-id. A config comment that says "R20" or "phase 005" is unreadable to the next maintainer once the packet closes, and the pre-commit gate blocks it. The comment has to explain why the two projects differ in a way that survives the packet.

### Constraints

- The pre-commit gate rejects an ephemeral id in a comment or a step name.
- The comment sits in a TypeScript config, so it is read by anyone who opens the file, not only by this packet's readers.
- The reason must be behavioural, because the setting's correctness rests on how the suites build their fixtures.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: write the reason as behaviour. The CLI suites that write build their own fixture roots under the OS temp directory, three consecutive parallel runs passed, and serial execution made the project the check job's longest step. No packet id appears.

**How it works**: T011 rewrites the shared comment to say only the CLI project runs in parallel, and T012 puts the three-line reason above the value. T032's ephemeral-id grep proves nothing leaked into the diff.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A behavioural reason (chosen)** | Readable after the packet closes, and it states the fact the setting rests on | Longer than one line | 9/10 |
| A one-line "see the spec" comment | Short | The path rots, and the gate blocks it | 1/10 |
| No comment | Shortest | The next reader cannot tell why the two projects differ | 3/10 |

**Why this one**: the reason is the evidence. A reader can check it against the suites, and it stays true when the packet is archived.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The comment explains the setting without depending on a document that may move.
- The pre-commit gate passes without an exemption.

**What it costs**:
- Three comment lines in a config file. Mitigation: they sit beside the value they explain.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The behavioural claim goes stale if the suites change | L | A suite that starts sharing a fixture would fail under parallelism, which the CI runs would show |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The gate blocks ephemeral ids, and the current comment is wrong about both projects |
| 2 | **Beyond Local Maxima?** | PASS | Three comment shapes compared |
| 3 | **Sufficient?** | PASS | Two comments, one per fact |
| 4 | **Fits Goal?** | PASS | It is part of R20's change |
| 5 | **Open Horizons?** | PASS | The reason stays valid after the packet closes |
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/skills/system-spec-kit/vitest.config.ts:14-17` and `:67`: the two comments.

**Gated tasks**: T011, T012, T032.

**How to roll back**: restore the two anchor comment blocks.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Re-pull the latest 40 runs before fixing anything

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending: the plan is accepted and the 40-run re-pull is done (AC-004 is Met), but it stays Pending until the packet's closure gate passes |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-005-context -->
### Context

The research phase recorded deep-loop-runtime at 13 failures in 40, diagram-corpus at 12 and skill-advisor-stress at 10. The newest runs of all three now pass: three, one and three consecutive successes. A phase that fixes the research phase's list would edit files that are already correct and miss whatever is failing now.

### Constraints

- The failure counts move with every push, so a plan cannot carry them as fact.
- Two of the three workflows are path-filtered, so a fresh run may not exist.
- The newest green run is the evidence that a fix landed, not the absence of a failure in an older sample.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: pull the latest 40 runs of each workflow at execution time, write one run table and one summary row per workflow, and derive every root cause from the failed logs of that window.

**How it works**: T015 to T018 write the three JSON files and the tables; T019 to T021 extract the terminal failure lines; T022 writes one root-cause row per class the extracts name. The plan's expected values are a sanity check, not a substitute for the pull.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Re-pull 40 runs at execution time (chosen)** | The phase fixes what is red now | One `gh` pull per workflow | 9/10 |
| Trust the research phase's counts | No pull | It would fix two already-green workflows and could miss a new class | 2/10 |
| Pull only the newest run per workflow | Cheapest | It hides a class that appears in the window but not in the newest run | 4/10 |

**Why this one**: the review's own N15 finding says the counts changed, so the only honest source is a fresh pull.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Every fix is aimed at a failure that exists at execution time.
- A workflow that is already green is recorded closed with its newest run id, which is the evidence R21 asks for.

**What it costs**:
- The plan's numbers may differ from what the pull reads. Mitigation: the tasks treat a different count as the re-check working, not as an error.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `gh` cannot read a failed log | M | T019 to T021 record the error and stop; a missing scope is a blocker |
| A workflow has fewer than 40 runs | L | T017 accepts 36 to 40 and the summary records the actual count |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The newest runs of two workflows already pass, so the research counts are stale |
| 2 | **Beyond Local Maxima?** | PASS | Three pull depths compared |
| 3 | **Sufficient?** | PASS | 40 runs cover every class the review names |
| 4 | **Fits Goal?** | PASS | It is R21's first step |
| 5 | **Open Horizons?** | PASS | The same pull shape works for any later workflow |
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scratch/r21-*-runs.json`, `scratch/r21-*-failures.log` and `scratch/r21-recheck.md`: created.

**Gated tasks**: T015 to T022.

**How to roll back**: delete the three JSON files, the three logs and the re-check file.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Fix causes; never add a retry, rerun or continue-on-error

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending: the plan is accepted and the no-retry check is done (AC-007 is Met), but it stays Pending until AC-006 settles, because that is where a workflow that stays red is filed and not retried |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-006-context -->
### Context

The research phase found no flake signature: the failures correlate across independent workflows on the same commits, which is what a real defect looks like, not a flaky runner. A retry would turn a deterministic failure into an intermittent green, and the phase would close with the defect still in the tree.

### Constraints

- Three workflows carry the failures, and a retry could be added to any of them without touching a test.
- The green streaks in the acceptance would be worthless if a failed run could be rerun into a pass.
- A workflow that stays red still has to be reportable, or the phase would never close honestly.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: fix the cause the log names, and add no `retry`, `rerun` or `continue-on-error` to any of the three workflows. A workflow that stays red after its fix gets a filed root cause instead of a retry.

**How it works**: T029 greps the three workflows and the unstaged diff of the workflow files for the three tokens and records `retry-proof: clean`. T037 appends a `filed` row for any workflow still red, and AC-006 accepts that branch.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Fix the cause, no retry (chosen)** | A red run keeps meaning a defect | The phase may stay open while a cause is found | 9/10 |
| Add `retry` to the three workflows | The streaks would turn green quickly | It hides the defect the phase exists to find | 1/10 |
| Add `continue-on-error` | The workflow would stop blocking | The check would report success while its suite fails | 1/10 |

**Why this one**: the phase's value is the signal, not the colour. A retry would spend the phase's cost and lose its only product.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- A green run means the suite passed, not that it passed on a second attempt.
- The filed-root-cause branch lets the phase close without pretending a red workflow is green.

**What it costs**:
- The phase may wait on a cause that takes longer than a retry would. Mitigation: T037's filed row records the test, the class and the SHA, and the phase closes on that branch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A retry is added by a later phase | M | The no-retry rule is recorded here and in the plan's execution rules |
| A red workflow is filed without a real cause | M | T037 requires the failing test, the class and the first failing SHA before it writes `filed` |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The failures correlate across workflows, so they are not flake |
| 2 | **Beyond Local Maxima?** | PASS | Retry, continue-on-error and a real fix compared |
| 3 | **Sufficient?** | PASS | One grep and one filed branch cover both outcomes |
| 4 | **Fits Goal?** | PASS | It is the no-retry rule the review states |
| 5 | **Open Horizons?** | PASS | The rule keeps the workflow suite meaningful for later phases |
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- No workflow gains a retry. `scratch/r21-recheck.md` records the proof.

**Gated tasks**: T029, T030, T037.

**How to roll back**: nothing to roll back; a retry that was never added needs no revert.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: The drift class fails fast before the full suite

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending: the plan is accepted and the fast-fail step is added and proven (AC-009 is Met), but it stays Pending until the packet's closure gate passes |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-007-context -->
### Context

`check-contract-drift.cjs` exits 2 on `STALE_SOURCE_DIGEST` and names the contract to rebuild. The deep-loop suite already asserts the same fact, but only after the whole run, so a stale contract costs about 12 minutes before the first signal. Thirteen of the latest 40 runs carry the class, and it recurs whenever a commit edits a contract source without recompiling.

### Constraints

- The checker needs the shared package and the runtime's dependencies, so the step must follow the install step at `deep-loop-runtime.yml:51-57`.
- The existing `check-contract-drift.vitest.ts` must keep its assertion, or the suite would stop checking the fact.
- The step must not add a permission, a secret or a retry.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: add one step that runs `check-contract-drift.cjs` between the install step and the suite, and keep the vitest assertion.

**How it works**: T025 inserts four lines before `Run the deep-loop runtime suites`. T023 records whether the tree is fresh, T024 regenerates the contract when it is stale, and T026 proves the step fails on the `b1f6c78` contract with exit 2 and passes again after the restore.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **A fast-fail step plus the assertion (chosen)** | The fact fails in seconds and the suite still checks it | One more step | 9/10 |
| Only regenerate the contract | No workflow change | The next stale contract costs 12 minutes again | 4/10 |
| Only add the step | Fast signal | The suite would lose its own assertion if the step replaced it | 5/10 |

**Why this one**: the step shortens the feedback loop, and the assertion keeps the check inside the suite where a local run also sees it.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- A stale contract fails in seconds and names the contract to rebuild.
- The class's cost falls from a full suite to one checker run.

**What it costs**:
- One step and one dependency on the install order. Mitigation: the step sits directly below the install step.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The step runs before the install and fails on a missing module | M | T025 places it after the install step, and T023's local run proves it resolves |
| A false failure blocks every deep-loop run | M | T026 proves a fresh tree exits 0 |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 13 of 40 runs carry the class, and each costs about 12 minutes |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One step plus the existing assertion |
| 4 | **Fits Goal?** | PASS | It is R21's deep-loop fix |
| 5 | **Open Horizons?** | PASS | The same checker can gate any workflow that consumes a compiled contract |
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.github/workflows/deep-loop-runtime.yml:59`: four lines inserted above the suite step.
- `.skilled/commands/deep/assets/compiled/`: regenerated when T023 records `stale`.

**Gated tasks**: T023 to T026.

**How to roll back**: delete the four inserted lines, and `git checkout -- .skilled/commands/deep/assets/compiled/`.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: A workflow that stays red is filed, not forced green

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending: the plan is accepted and it becomes Accepted when AC-006 is Met, with either three all_green=true lines or a filed row for each red workflow |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-008-context -->
### Context

R21's acceptance is 10 consecutive green runs for each of three workflows, or a filed root cause for each that stays red. The second branch exists because a cause can sit outside this phase's scope: a fixture that belongs to another skill, or a defect that needs a design change. Without that branch the phase would either stay open indefinitely or be tempted to retry.

### Constraints

- A filed row has to be as specific as a fix: the failing test, the error class and the first failing SHA.
- The branch must not become an escape hatch for a cause this phase could fix.
- The phase's closure gate reads the acceptance file, so the branch has to be visible there.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: when a workflow is still red after its fix, append a `filed` row that names the test, the class and the first failing SHA, plus one sentence on why the fix is not in this phase.

**How it works**: T037 reads the `## Green streaks` lines and writes one `filed` row per `all_green=false` workflow. AC-006 accepts either three `all_green=true` lines or a `filed` row for each red workflow.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **File a specific root cause (chosen)** | The phase closes honestly and the next owner has a starting point | The workflow stays red | 8/10 |
| Keep the phase open until every workflow is green | The phase ends fully green | It has no bound, and a cause outside the scope would block it forever | 5/10 |
| Retry until green | Fast closure | It hides the defect, which ADR-006 rejects | 1/10 |

**Why this one**: a filed cause with a test, a class and a SHA is a usable handoff; a retry is not.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- The phase can close on evidence rather than on a colour.
- The next owner starts from a named test and SHA.

**What it costs**:
- A red workflow remains red at closure. Mitigation: the filed row is the deliverable, and phase 008's consolidation re-measures after it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The filed row is too vague to act on | M | T037 requires all three fields before it writes `filed` |
| A fixable cause is filed instead of fixed | M | T027 and T028 fix what their logs name before T037 runs |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A cause can sit outside this phase's files |
| 2 | **Beyond Local Maxima?** | PASS | Three closure rules compared |
| 3 | **Sufficient?** | PASS | One row per red workflow |
| 4 | **Fits Goal?** | PASS | It is R21's stated alternative |
| 5 | **Open Horizons?** | PASS | The row is the input to a later fix |
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `scratch/r21-recheck.md`: one `filed` row per red workflow, and none when all three are green.

**Gated tasks**: T037, T038.

**How to roll back**: delete the `filed` rows.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: The green watch waits for natural runs, and only one workflow is dispatched

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Pending: the plan is accepted and it becomes Accepted when the ten-run watch in AC-006 finishes, which for the two path-filtered workflows waits on natural runs |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; no operator decision |

---

<!-- ANCHOR:adr-009-context -->
### Context

The 10-green acceptance needs ten runs per workflow. `diagram-corpus.yml` declares `workflow_dispatch` at `:15`, so it can be dispatched. `deep-loop-runtime.yml` and `skill-advisor-stress.yml` are path-filtered and declare no dispatch trigger, so their runs arrive only when a commit touches their paths. Rerunning a failed run would manufacture a streak and hide the failure.

### Constraints

- A dispatched run is a real run of the same workflow on the same commit, so it counts.
- A rerun of a failed run is the same commit and the same failure, so it does not count.
- The phase cannot invent traffic for a path-filtered workflow.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: dispatch diagram-corpus one run at a time until it has ten green runs, and wait for natural runs on the other two. Never rerun a failed run.

**How it works**: T036 reads ten runs per workflow and writes one `all_green=` line each. When diagram-corpus has fewer than ten, it runs `gh workflow run diagram-corpus.yml --ref main` one at a time and waits for each. The other two wait.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dispatch one, wait for two (chosen)** | The streak is real and the phase can finish | The wait depends on traffic | 8/10 |
| Rerun failed runs until green | Fast | It manufactures a streak and hides the failure | 1/10 |
| Lower the acceptance to 3 runs | Quick closure | It weakens the signal the review asks for | 3/10 |

**Why this one**: ten real runs are the evidence. A dispatched run is real; a rerun is not.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Every counted run is a genuine execution of the workflow at that commit.
- The phase has a bounded way to move diagram-corpus forward.

**What it costs**:
- The phase waits on repository traffic for two workflows. Mitigation: ADR-008's filed branch covers a workflow that cannot reach ten.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| No commit touches the two path-filtered workflows for days | M | T037 files a cause rather than leaving the phase open, and phase 008 re-measures |
| A dispatched run is mistaken for a natural one | L | T036 records the run ids, so the dispatch is visible |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two workflows have no dispatch trigger |
| 2 | **Beyond Local Maxima?** | PASS | Three streak rules compared |
| 3 | **Sufficient?** | PASS | Ten runs per workflow, or a filed row |
| 4 | **Fits Goal?** | PASS | It is R21's acceptance shape |
| 5 | **Open Horizons?** | PASS | The dispatch route stays available for later phases |
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `scratch/r21-recheck.md`: the `## Green streaks` section.

**Gated tasks**: T036, T037.

**How to roll back**: delete the `## Green streaks` section.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: The five single old failures are recorded closed

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Amended 2026-10-24, operator ruling recorded |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author; operator ruling of 2026-10-24 (question tool) |

---

<!-- ANCHOR:adr-010-context -->
### Context

Five workflows carry one old failure each: repo-rules-corpus on 2026-09-18 at `6cbaf58`, chart-corpus on 2026-10-12 at `f3b4e90`, opencode-dual-version on 2026-10-20 at `7584ad7`, routing-registry-drift on 2026-10-17 at `407de0d` and strict-pass-freshness-report on 2026-09-07 at `bbf1ffa`. Each has been green since. The review rejected a repo-rules-corpus fix and kept it as a confirm-stale line.

### Constraints

- A stale failure needs a later green run as evidence, not just an old date.
- A re-fix would change files the failure no longer touches.
- The row has to name the failure run and the green run, so a reader can check both.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: record one row per workflow with the failure date, the failure SHA, the failure run id, the newest green run id and the verdict `closed`, and change no file for them.

**How it works**: T029 reads the newest failure in the last 100 runs and the newest run for each workflow, writes the five rows, and requires the newest run to be `success`. A workflow with no failure in its last 100 runs gets a `no failure in 100` row instead.

**Amendment (2026-10-24, operator ruling)**: T029's Stop-if fired on routing-registry-drift. Its newest failures are `e3beac65f4` (run 40089268105) and `db30b0f543` (run 40089318887), both dated 2026-10-24 and newer than the planned 2026-10-17 `407de0d` failure. Both failed with `STALE COMPILED: skill-graph.json generated_at 2026-10-17T10:21:42 is older than the newest source stamp 2026-10-24T00:00:00Z (sk-code)`. `e3beac65f4` is the sk-code hub commit that moved the stamp; `db30b0f543` is an OpenCode pin commit stacked on it. The fix is `1218b94938`, which regenerated the compiled skill graph, and all 15 workflow runs on that commit are `success` (`gh api repos/{owner}/{repo}/actions/runs?head_sha=1218b94938b2e0b1bed55907425f50368caf8537` returned `total_count` 15, all `success`), including routing-registry-drift run 40089725657. The operator ruled on 2026-10-24 to close the workflow on this evidence: the row records the 2026-10-24 failures and the `1218b94938` fix, and the verdict is `closed`.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record them closed (chosen)** | No code change, and the evidence is a green run | Five rows of bookkeeping | 9/10 |
| Re-fix each workflow | The failure would be investigated | It edits files the failure no longer touches, outside the scope | 3/10 |
| Ignore them | No work | The research phase's list stays unresolved | 2/10 |

**Why this one**: a green run after the failure is the proof. Re-fixing a fixed failure spends the phase's scope on nothing.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- The five items leave the phase's open list with evidence a reader can re-check.
- No file outside the phase changes for them.

**What it costs**:
- Five rows in the re-check file. Mitigation: the table is the record, and it takes one command per workflow.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A failure is newer than the recorded date | M | T029 stops when the read differs from the expected date |
| A workflow has no later green run | M | T029 records `no failure in 100` only when the failure list is empty; otherwise the row stays open |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five workflows carry a failure the research phase listed |
| 2 | **Beyond Local Maxima?** | PASS | Three treatments compared |
| 3 | **Sufficient?** | PASS | One command per workflow and one row each |
| 4 | **Fits Goal?** | PASS | It is R21's stale-confirmation clause |
| 5 | **Open Horizons?** | PASS | The table is the baseline a later failure check compares against |
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `scratch/r21-recheck.md`: the `## Stale failures` section.

**Gated tasks**: T029, T038.

**How to roll back**: delete the `## Stale failures` section.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---
