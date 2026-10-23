---
title: "Decision Record: trigger and job hygiene"
description: "The eleven decisions behind this phase: five operator choices (D2 main cancellation, D3 the parity filter, D4 the guard shape, D7 the deep-loop depth, D10 the changed-packet filter) and six design choices the plan freezes (the concurrency block's shape, how a filter is derived, how a suppression is removed, how a checkout depth is chosen, what the inventory records, and how the change is committed)."
trigger_phrases:
  - "trigger and job hygiene decision record"
  - "concurrency group decision"
  - "path filter decision"
  - "cancel in progress adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/003-trigger-and-job-hygiene"
    last_updated_at: "2026-10-23T12:40:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded eleven proposed ADRs for the planned phase"
    next_safe_action: "Answer D2, D3, D4, D7 and D10, then run the phase's tasks"
    blockers:
      - "D2 unanswered"
      - "D3 unanswered"
      - "D4 unanswered"
      - "D7 unanswered"
      - "D10 unanswered"
      - "002-rebuild-fanout-removal baseline pending"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-003-trigger-and-job-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does cancel-in-progress on pull requests leave the required message-contract context satisfied on the newest head?"
      - "Do deep-loop-runtime's mode-event suites need anything older than the parent commit?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: trigger and job hygiene

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Cancel the superseded pull-request run, and leave main's runs alone

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D2, unanswered), plan author |

---

<!-- ANCHOR:adr-001-context -->
### Context

Thirty-one workflows answer a pull request, and 32 of the repository's 33 declare no `concurrency:` group (`research.md:101`). Two pushes to one pull request therefore leave two full runs racing, and the older verdict is paid for and then discarded.

On `main` the picture is different. The measured supersession is almost entirely self-inflicted by the rebuild commit: 177 pairs and 792 reclaimable wall-minutes per window before R1, and 23 pairs and 89 minutes after it (`final-review.md:76-79`). Cancelling on main would trade one verdict per commit for a number R1 has already shrunk.

### Constraints

- `trigger-index-rebuild.yml:21-23` already owns a group with `cancel-in-progress: false`, and its comment explains why a newer run must not be cancelled.
- GitHub keeps one running and one pending run per group, so a third push replaces the pending run rather than the running one.
- `message-contract` is the only required context, and it is PR-triggered.
- The measured window held no PR runs, so the PR-side saving cannot be measured here.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` on the 30 PR-triggered workflows other than `dependabot-auto-merge.yml`, so only a superseded pull-request run is cancelled.

**How it works**: Each file gains `concurrency:` above `jobs:` with `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}`. On a pull request the key is one slot per workflow per PR; on push and `workflow_dispatch` it is one slot per ref. Only the `pull_request` branch sets `cancel-in-progress` true.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **PR-only cancel (chosen)** | Stops paying for a verdict nobody reads; keeps one verdict per commit on main; no required-context risk on a branch that always gets a new run | PR-side saving is unmeasured; main keeps the 89 reclaimable wall-minutes | 8/10 |
| `cancel-in-progress: true` everywhere | Reclaims 817 wall-minutes per window standalone and about 89 after R1 | Cancels a superseded main run, so a commit can lose its only verdict | 5/10 |
| No concurrency block | No behaviour change | Two full runs race on every PR push, which is the problem this phase exists to fix | 2/10 |

**Why this one**: It removes the waste that is measurable today and leaves main's per-commit verdicts intact, and it cannot unset a required context because every new head starts its own run.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A superseded pull-request run stops consuming a runner instead of finishing into a discarded verdict.
- The same block on all 30 files means a reviewer can check one shape rather than 30.
- `trigger-index-rebuild.yml` is untouched, so its documented race behaviour keeps working.

**What it costs**:
- Main keeps the 89 reclaimable wall-minutes D2 declines. Mitigation: phase 008 re-measures and can reopen the choice with real numbers.
- A third push in quick succession leaves the middle SHA with no verdict. Mitigation: recorded as an edge case, and the newest head still reports.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A cancelled PR run leaves the required context unset | H | Only PR runs cancel, every new head gets a run, and T027 reads `gh pr checks` on the newest SHA |
| The block lands below `jobs:` and never applies | M | The anchor is the `jobs:` line at column 0, and T024 counts `^concurrency:` per file plus the YAML parse |
| A workflow that is not PR-triggered receives the block | L | T023's check lists every file that lacks the block, and only two may appear |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 32 of 33 workflows have no group, and every PR push currently races a full run |
| 2 | **Beyond Local Maxima?** | PASS | Three options were compared, including the one that cancels on main |
| 3 | **Sufficient?** | PASS | One block, one shape, 30 files; no other mechanism is needed to stop the race |
| 4 | **Fits Goal?** | PASS | It is R3, the phase's first recommendation |
| 5 | **Open Horizons?** | PASS | It removes runs rather than making them cheaper, so phase 008 measures a smaller total |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.github/workflows/*.yml`: the three-line block above `jobs:` in 30 files.

**Gated tasks**: T001, then T022, T023 and T024.

**How to roll back**: Delete the three `concurrency:` lines and the blank line from each file. No state is created; the next push behaves as it did before the edit.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Approve the command-tree-parity filter, derived from a full checker read

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D3, unanswered), plan author |

---

<!-- ANCHOR:adr-002-context -->
### Context

`command-tree-parity.yml:47-50` says in so many words that the workflow is unfiltered on purpose: "no path filter narrow enough to keep a heavier workflow cheap sees every such edit". That claim was never tested against the checkers' actual inputs. Classifying the 38 human push SHAs in the measured window, a correct filter fires on 8 of them, so 30 pushes would skip the workflow (`final-review.md:93-98`).

### Constraints

- `check-gate-inputs.sh:110-122` requires a `.opencode/` twin for every `.skilled/` entry in the same filter group, and `:336` raises `filter-twins` when one is missing.
- `sync-runtime-mirrors.cjs` derives its expected links from `.claude/agents`, `.skilled/commands`, and four hook configs whose contents name the hook sources (`:39,46-54,125-143`).
- `sync-skills-hermes.cjs` reads `.skilled/skills/**/SKILL.md` and `.skilled/agents` (`:20,27,61,212-221`); `sync-prompts-hermes.cjs` reads `.skilled/commands` (`:21`).
- The workflow has two jobs, and both must keep running on a matching change.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: a 23-entry `paths:` list on both `pull_request:` and `push:`, and a comment that describes the filter instead of denying it.

**How it works**: The list names the command trees, the agent trees, `SKILL.md`, `.hermes/**`, the spec-kit package, the four hook configs and their four hook mirrors, and the workflow file. Every `.skilled/` entry carries its `.opencode/` twin in the same list. The comment at `:47-50` states that a missed input is what lets a stale copy land green.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **23-entry filter on both events (chosen)** | ~265 runner-min/day standalone and ~123 after R1; the comment becomes true | A missed input is silent; medium risk | 8/10 |
| Keep the workflow unfiltered | No risk of a missed input | 30 of 38 human pushes pay for a check that cannot fail | 4/10 |
| Filter on `pull_request:` only | Smaller blast radius | Push runs, which are the measured volume, keep the full cost | 3/10 |

**Why this one**: The filter is derived from the checkers rather than from the review's summary, so the "no narrow filter sees every edit" claim is replaced by a list that names each input, and both probes prove the two directions.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- 30 of 38 human pushes stop starting two jobs that compare trees they did not touch.
- The workflow's own comment stops contradicting the file.
- A change to a hook config or a hook mirror now runs the job that derives links from it.

**What it costs**:
- The filter must be maintained when a checker gains an input. Mitigation: the twin gate fails a missing `.opencode/` partner, and the comment names the failure a missed input causes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed input lets a stale Hermes copy land green | H | The list comes from a full read of all four checkers; T028 records a positive and a negative probe |
| A `.skilled/` entry lands without its twin | M | `check-gate-inputs.sh` fails the build; T010 runs it |
| `.hermes/**` is filtered out although it is generated | L | It is in the list on purpose, so a hand edit there still runs the comparison |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 30 of 38 human pushes touch none of the inputs and still run two jobs |
| 2 | **Beyond Local Maxima?** | PASS | The unfiltered file was read, its comment tested, and a narrower alternative compared |
| 3 | **Sufficient?** | PASS | One list per event names every input the four checkers read |
| 4 | **Fits Goal?** | PASS | It is R4 and the phase's largest measured saving after R3 |
| 5 | **Open Horizons?** | PASS | The list is a statement of inputs, so a later checker change has one place to update |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.github/workflows/command-tree-parity.yml:47-50`: the comment is rewritten.
- `.github/workflows/command-tree-parity.yml:7-8` and `:5-6`: both events gain the 23 entries.
- `.github/workflows/README.md:66` and `:69`: the workflow moves to the path-filtered row.

**Gated tasks**: T002, then T007, T008, T009, T010, T021 and T028.

**How to roll back**: Delete both `paths:` blocks and restore the four comment lines. The workflow returns to running on every push and pull request.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Keep the guard's two jobs and delete only the duplicate step

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D4, unanswered), plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

`dispatch-enforcement-guard.yml` runs `dispatch-audit.test.mjs` twice per run: explicitly at `:41-50`, and again through the whole-tree vitest run at `:67`, whose include collects it. Both jobs pay their own checkout and `npm --prefix .skilled ci` (`:44`, `:61`).

The workflow is a protected guard: its failure invalidates other workflows' inputs (`research.md:187`). A merge would rename both check names, and the review's original recommendation to narrow `hooks-vitest` would have dropped two suites that live outside `dispatch/` (`final-review.md:35-40`).

### Constraints

- `.skilled/hooks/vitest.config.ts:38` collects every `*.{test,spec}.*` under `.skilled/hooks`; `:17-23` excludes the JS tests that do not import vitest.
- Seven suites survive: five under `dispatch/` and two outside it (`session-relaunch/pi`, `classifier-injection-screen/pi`).
- `dispatch-rule-checks.test.mjs` is a `node --test` file the vitest config excludes, so its own step is not a duplicate.
- A merge changes the check names a branch protection rule may reference.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: keep both jobs and delete the explicit `Run the dispatch audit core suite` step at `:41-50`.

**How it works**: The whole-tree vitest run at `:67` already collects `dispatch-audit.test.mjs`, so the suite still executes exactly once. The fail-closed rule-suite guard at `:31-35` stays byte-identical, and no check name changes.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Delete the duplicate step (chosen)** | One execution, no rename, fail-closed guard intact; removes one install with the step | Saves less than a merge: one install and one explicit suite run, not a whole job | 8/10 |
| Merge the two jobs | One checkout and one install per run, inferred at 1-2 billed minutes | Renames both checks; a protected guard's identity changes | 5/10 |
| Narrow `hooks-vitest` | Would shorten one job | Drops two suites that live outside `dispatch/`, and the remaining run still costs a checkout | 1/10 |

**Why this one**: It removes the duplicate execution without touching the guard's identity or its fail-closed path, and the measured shape can be revisited once phase 008 has numbers.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One `npm --prefix .skilled ci` and one explicit suite run disappear per run.
- No check name changes, so a branch protection rule and a bookmark keep working.
- The seven suites keep running, including the two outside `dispatch/`.

**What it costs**:
- The saving is smaller than a merge's. Mitigation: T036 re-measures the run and records the figure, so a later phase can decide whether the merge is worth the rename.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The whole-tree run does not collect the audit suite | H | `.skilled/hooks/vitest.config.ts:38` collects it, and T013 proves the seven paths locally |
| The fail-closed guard is edited by accident | H | T012 requires a diff with no added line, and the guard's lines are quoted |
| A deleted rule suite stops failing the job | H | T030 pushes a branch that deletes it and expects a failed run |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The audit suite runs twice, and both jobs pay an install |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes were compared, including the review's narrowing recommendation |
| 3 | **Sufficient?** | PASS | Deleting one step removes the duplicate without touching the guard |
| 4 | **Fits Goal?** | PASS | It is R6, and it protects a check while removing waste |
| 5 | **Open Horizons?** | PASS | The guard keeps its identity, so phase 007's timeouts and switches apply to a stable job |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.github/workflows/dispatch-enforcement-guard.yml:41-50`: the step is deleted.

**Gated tasks**: T003, then T012, T013 and T030.

**How to roll back**: Restore the ten quoted lines above the `hooks-vitest` job. The second execution returns.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Set deep-loop-runtime to depth 2 rather than the default

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D7, unanswered), plan author |

---

<!-- ANCHOR:adr-004-context -->
### Context

`deep-loop-runtime.yml:42` checks out full history. Its own comment at `:38-39` says the mode-event suites bind each run to a commit and its parent, which a depth-one checkout does not have. Depth 0 is therefore more history than the job needs.

### Constraints

- The suites need the parent commit, so `fetch-depth: 1` is not enough.
- The workflow's other steps read the working tree only.
- `fetch-depth: 0` remains correct for seven other workflows that diff against a PR base or walk history.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `fetch-depth: 2` at `deep-loop-runtime.yml:42`.

**How it works**: The checkout fetches the commit and its parent, which is exactly what the mode-event suites read. The comment at `:38-39` stays, because it explains why more than one commit is needed.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Depth 2 (chosen)** | Keeps the parent the suites read; shorter checkout | Needs the suites' parent-only assumption to hold, which the workflow comment states | 8/10 |
| Keep depth 0 | No risk | Pays for history no step reads | 4/10 |
| Depth 1 | Shortest checkout | The suites need the parent commit and would fail | 1/10 |

**Why this one**: It matches the depth to what the suites read, and the comment above the step already records the parent-commit requirement.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The job stops fetching history it never reads, and its checkout step shortens.
- The `fetch-depth: 0` count falls from 10 to 7, which makes the remaining history readers easy to review.

**What it costs**:
- A future suite that reads a grandparent commit would fail. Mitigation: the failure is loud, and the comment above the step names the requirement.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A suite reads more than the parent | M | The workflow comment states the parent requirement; T032 runs the job and reads its conclusion |
| The wrong `fetch-depth` line is edited | L | The anchor is quoted and the file has exactly one such line |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The job fetches full history to read one parent commit |
| 2 | **Beyond Local Maxima?** | PASS | Depth 0, 1 and 2 were compared against the stated requirement |
| 3 | **Sufficient?** | PASS | One value, one file |
| 4 | **Fits Goal?** | PASS | It is half of R8 |
| 5 | **Open Horizons?** | PASS | The depth is stated next to the comment that justifies it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.github/workflows/deep-loop-runtime.yml:42`: `fetch-depth: 0` becomes `fetch-depth: 2`.

**Gated tasks**: T004, then T017 and T032.

**How to roll back**: Restore `fetch-depth: 0`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Skip the changed-packet-validation filter

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D10, unanswered), plan author |

---

<!-- ANCHOR:adr-005-context -->
### Context

`changed-packet-validation.yml` runs on every push and every pull request to `main`. A filter naming `specs/**` looks obvious, but 33 of the 38 human pushes in the measured window touch `specs/`, so the filter would skip about 5 runs per window: about 10 runner-min/day after R1 (`final-review.md:98`).

### Constraints

- The workflow validates only packets a change touches, so a run that finds none exits early.
- The validator lives in the spec-kit package, so a filter must name that package as well as `specs/**`.
- The default must be explicit, or a later reader cannot tell a skip from an oversight.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: no filter, and a recorded skip with its figure.

**How it works**: The workflow keeps both triggers unfiltered. The decision line `D10=skip` and the Implementation Notes in `plan.md` record why, so the next phase can reopen it with a measured delta rather than a guess.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Skip (chosen)** | No new filter to maintain for ~10 runner-min/day | Leaves a small saving unclaimed | 8/10 |
| Four-entry filter on both events | Saves about 10 runner-min/day after R1 | A new filter whose missed input is silent, for a figure the phase cannot measure reliably | 5/10 |

**Why this one**: The saving is too small to justify a third filtered workflow in a phase that already carries two, and the decision is recorded rather than implied.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The phase carries one fewer filter, so its risk surface stays at two.
- The skip is recorded with its figure, so a later phase can act on evidence.

**What it costs**:
- About 10 runner-min/day stay unclaimed. Mitigation: phase 008 re-measures the always-run workflows and can reopen it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader assumes the workflow was overlooked | L | The skip is recorded in `scratch/decisions.md` and in the plan's notes |
| A later phase adds the filter without its package entry | M | The alternative's four entries are written down in `spec.md` and T011 |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The choice must be recorded either way, because the review asked for it |
| 2 | **Beyond Local Maxima?** | PASS | Both the skip and the filter were costed |
| 3 | **Sufficient?** | PASS | One recorded line, no YAML change |
| 4 | **Fits Goal?** | PASS | It is R5, the phase's smallest recommendation |
| 5 | **Open Horizons?** | PASS | The alternative is written down, so a later phase does not re-derive it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `scratch/decisions.md`: one line, `D10=skip`.
- No workflow file changes.

**Gated tasks**: T005, then T011 and T029.

**How to roll back**: Delete the `D10=` line. Nothing else was changed.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: One concurrency shape, placed above jobs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-006-context -->
### Context

Thirty files need the same block. `trigger-index-rebuild.yml:21-23` is the only existing example, and it uses a literal group string with `cancel-in-progress: false`. The block must work in files with and without a `permissions:` key, and it must not depend on a key that 12 of the files lack.

### Constraints

- The block must sit at column 0, above `jobs:`.
- The group key may interpolate only values GitHub supplies on every event, including `workflow_dispatch`.
- No secret, run id or timestamp may reach the group name.
- A reviewer must be able to check one shape across 30 files.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: one three-line block, identical in all 30 files, inserted immediately above `jobs:`.

**How it works**: `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` gives one slot per workflow per PR, and one per ref otherwise. `cancel-in-progress` reads the event name, so the value is false on push and `workflow_dispatch` without a second edit.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One block above `jobs:` (chosen)** | Works in all 30 files; one shape to review | Sits below `permissions:` in some files and above it in none | 9/10 |
| Per-file groups | Can express per-workflow policy | 30 different strings to review and 30 chances to typo | 3/10 |
| Place it after `permissions:` where one exists | Groups related keys | Depends on a key 12 files lack, so the insertion point differs by file | 4/10 |

**Why this one**: One anchor and one shape make the edit mechanical and the review a single comparison.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The edit is the same five-line replacement in every file, so a diff review is one comparison repeated.
- The group key needs no per-file knowledge.

**What it costs**:
- A workflow that later needs a different group must deviate from the shape. Mitigation: `trigger-index-rebuild.yml` already does, and it is excluded by name.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The block lands inside another mapping | M | The anchor is `jobs:` at column 0, and T024 parses all 33 files |
| A per-run value reaches the group key | M | Only `github.workflow`, the PR number and `github.ref` are interpolated |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 30 files need the same block |
| 2 | **Beyond Local Maxima?** | PASS | Three placements were compared against the files' key sets |
| 3 | **Sufficient?** | PASS | Three lines express the policy for all three events |
| 4 | **Fits Goal?** | PASS | It is the mechanical form of R3 |
| 5 | **Open Horizons?** | PASS | A later switch or timeout edit can anchor on the same `jobs:` line |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `.github/workflows/*.yml`: the same five-line replacement in 30 files.

**Gated tasks**: T022, T023 and T024.

**How to roll back**: Delete the three `concurrency:` lines and the blank line from each file.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: A filter names every checker input, its own guard and its workflow

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-007-context -->
### Context

Three filter changes land in this phase: `command-tree-parity.yml`, `agent-mirror-sync.yml`, and the two lists in `skill-doc-frontmatter.yml`. Each has the same failure mode: a filter that omits an input runs nothing on the change that breaks the check, and the drift lands green.

`skill-doc-frontmatter.yml` already has that gap: neither list names `check-skill-doc-frontmatter.sh`, which the workflow runs at `:34`, nor the workflow file itself.

### Constraints

- Every `.skilled/` entry needs its `.opencode/` twin in the same list.
- A workflow's own file belongs in its filter, or a change to the workflow is never exercised.
- The agent checker reads `.opencode/agents`, `.claude/agents`, `.codex/agents` and the built frontmatter parser under the spec-kit package; it does not read `.cursor/agents` or `.devin/agents`.
- `comment-hygiene` scans changed code files of any type, so no filter can name its inputs.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: every filter names each file its checker reads, the checker itself at both roots where a twin exists, and the workflow file.

**How it works**: The parity list carries 23 entries, the agent list 11, and each frontmatter list gains the guard at both roots plus the workflow file. The twin gate enforces the pairing, and a probe per workflow proves one matching and one non-matching change.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Name every input, the guard and the workflow (chosen)** | Closes the existing frontmatter gap; a workflow change is exercised | Lists grow, and each new input is a maintenance point | 9/10 |
| Name only the obvious source trees | Shorter lists | Leaves the guard and the workflow outside their own gate, which is the gap this phase exists to close | 3/10 |
| Leave the frontmatter lists alone | No change | A guard-only pull request runs no job that uses the guard | 1/10 |

**Why this one**: A filter is a statement of inputs. Naming the guard and the workflow is the same statement, and it closes a gap that already exists rather than adding a new convention.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- A change to a checker, a workflow file or a hook config runs the job that uses it.
- The three filters follow one rule, so a reviewer checks one property rather than three lists.

**What it costs**:
- Each new checker input needs a filter entry. Mitigation: the twin gate fails a missing partner, and the probes record both directions.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A missed input lands green | H | Each list comes from a full checker read; T028, T033 and T034 probe both directions |
| A twin is missing | M | `check-gate-inputs.sh` fails before merge; T010 and T025 run it |
| A list names a tree the checker does not read | L | `.cursor/agents` and `.devin/agents` are deliberately absent from the agent list |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The frontmatter gap exists today, and two workflows run on unrelated changes |
| 2 | **Beyond Local Maxima?** | PASS | Narrower lists were compared and rejected on the guard and workflow entries |
| 3 | **Sufficient?** | PASS | One rule covers all three filters |
| 4 | **Fits Goal?** | PASS | It is R4, R9 and R10 together |
| 5 | **Open Horizons?** | PASS | The rule is written down once, so a new filter has a pattern to follow |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.github/workflows/command-tree-parity.yml`: 23 entries on both events.
- `.github/workflows/agent-mirror-sync.yml`: 11 entries under `pull_request:`.
- `.github/workflows/skill-doc-frontmatter.yml`: three entries per list.

**Gated tasks**: T007 to T010, T018, T019, T028, T033 and T034.

**How to roll back**: Delete the `paths:` block each task added, and the six frontmatter entries.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Remove the inner suppression and keep the hint and the green job

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-008-context -->
### Context

`advisory-checks.yml` pairs `continue-on-error: true` with a second `|| true` or `|| echo` on the same command (`:38`, `:52`, `:68`), and `strict-pass-freshness-report.yml` does the same at `:172`. A failing command therefore reports success twice over: the inner operator swallows the exit code and `continue-on-error` keeps the job green.

The `|| echo` branches carry the repair hint, so removing them naively would remove the instruction a reader needs.

### Constraints

- `continue-on-error: true` stays: the jobs are advisory by design.
- The repair report at `strict-pass-freshness-report.yml:176` must print before the step exits, and the step runs under `set -euo pipefail`.
- The step's own conclusion must become `failure` while the job's stays `success`.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: an explicit failing branch that keeps the hint, and a captured status that exits after the report prints.

**How it works**: In `advisory-checks.yml` each suppressed command becomes `if ! node ...; then echo "::error::<hint>"; exit 1; fi`. In `strict-pass-freshness-report.yml` the command captures its status with `|| status=$?`, the report still prints, and `exit "$status"` is the step's last line.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Explicit branch plus captured status (chosen)** | Step fails, job stays green, hint survives, report prints | Four edits rather than four deletions | 9/10 |
| Drop `continue-on-error` as well | One mechanism instead of two | The jobs stop being advisory, which is not this phase's decision | 2/10 |
| Delete only the `||` operators | Smallest diff | The hint disappears, and the freshness step would abort before printing under `set -e` | 3/10 |

**Why this one**: It removes the suppression without removing the two things that make the report useful: its instruction and its output.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- A failing report shows as a failed step on the run page instead of hiding behind a green check.
- The repair hint still prints, now as an `::error::` annotation.

**What it costs**:
- A red step under a green job can alarm a reader. Mitigation: that is the signal the phase restores, and the job's conclusion still means "advisory".

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The report is lost when the step exits | M | The status is captured and the exit follows `cat` and `rm`; T015 checks the order |
| A consumer reads the run status as the report status | M | The job stays green, so no consumer changes behaviour |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four commands currently report success on failure |
| 2 | **Beyond Local Maxima?** | PASS | Three forms were compared, including dropping `continue-on-error` |
| 3 | **Sufficient?** | PASS | The step's conclusion is the only thing that changes |
| 4 | **Fits Goal?** | PASS | It is R7 |
| 5 | **Open Horizons?** | PASS | The pattern is reusable for any report-only step |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- `.github/workflows/advisory-checks.yml:38,52,68`.
- `.github/workflows/strict-pass-freshness-report.yml:172` and the exit line after `rm -f "$report"`.

**Gated tasks**: T014, T015 and T031.

**How to roll back**: Restore the three suppressed command lines and delete `exit "$status"`.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: A checkout depth follows the reader, not the workflow

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-009-context -->
### Context

Ten workflows check out `fetch-depth: 0`. Two of them run checkers that read no history at all: `rule-canary-sync.yml:15` and `repo-rules-corpus.yml:33`. Two others diff against the PR base (`comment-hygiene.yml`, `agent-mirror-sync.yml`) and one needs the parent commit (`deep-loop-runtime.yml`).

### Constraints

- A default-depth checkout still contains the full working tree, so a file-only checker is unaffected.
- `comment-hygiene` and `agent-mirror-sync` run `git diff "$BASE" "$HEAD"` and need the base.
- `deep-loop-runtime` needs the parent, so its depth is 2 rather than 1.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: default depth for the two checkers that read no history, depth 2 for `deep-loop-runtime`, and depth 0 for the seven that read history.

**How it works**: The two `with: fetch-depth: 0` blocks are deleted, so the checkout uses the action's default. The deep-loop value becomes 2. Nothing else changes.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Depth per reader (chosen)** | Each job fetches what it reads | Three different depths to explain | 8/10 |
| Default depth everywhere | Simplest rule | Breaks the PR-base diffs and the parent-commit suites | 1/10 |
| Depth 0 everywhere | No risk | Pays for history no checker reads | 4/10 |

**Why this one**: The depth is a property of what a job reads, and the three values follow from three reader types.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Two checkouts stop fetching history, and the deep-loop checkout fetches one commit instead of all.
- The remaining `fetch-depth: 0` sites are exactly the seven that read history, which makes the next review shorter.

**What it costs**:
- Three depths to keep straight. Mitigation: each is stated next to the job it serves, and T032 records each job's duration.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A checker shells out to git | M | Both were read and match no git invocation; T032 runs both jobs |
| The deep-loop suites read more than the parent | M | D7 gates the change, and the comment states the requirement |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Three jobs fetch history no step reads |
| 2 | **Beyond Local Maxima?** | PASS | Three depth policies were compared |
| 3 | **Sufficient?** | PASS | One deletion per file and one value |
| 4 | **Fits Goal?** | PASS | It is R8 |
| 5 | **Open Horizons?** | PASS | The rule survives new workflows: state the reader, then the depth |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- `.github/workflows/rule-canary-sync.yml:14-15` and `.github/workflows/repo-rules-corpus.yml:32-33`: the `with:` blocks are deleted.
- `.github/workflows/deep-loop-runtime.yml:42`: the value becomes 2.

**Gated tasks**: T016, T017 and T032.

**How to roll back**: Restore each `with: fetch-depth: 0` block and the deep-loop value.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: The pre-commit inventory is a record, not an action list

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-010-context -->
### Context

No document records which CI jobs repeat a pre-commit gate (`research.md:309`). Without one, a later phase cannot tell a deliberate backstop from an accident, and `README.md:71` already names `prompt-card-sync` alongside two other duplicated checkers without saying what to do about any of them.

### Constraints

- The installed hook is `.skilled/scripts/git-hooks/pre-commit`, with 12 gate keys. `.skilled/hooks/git/pre-commit` is a 115-line compatibility helper and is not the source of the list.
- A fork or a `--no-verify` commit skips the hook, so a CI copy is a backstop rather than a duplicate.
- Nothing in this phase may drop a gate: the phase's scope is triggers and job shape.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: one row per gate key with a verdict of `keep CI`, `drop CI` or `local only`, and no action taken on any verdict.

**How it works**: The document names the checker path, the installed-hook line and the CI counterpart for each key. A gate with no workflow counterpart is `local only`, never `drop CI`, and the header states that nothing in this phase acts on the list.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Record with a fixed vocabulary (chosen)** | A later phase can act on it; no gate moves in this phase | One more document to keep current | 9/10 |
| Drop the duplicated CI jobs now | Removes the duplication immediately | Changes what a check verifies, which is outside this phase's scope | 1/10 |
| Record free-text notes | Less structure | No two rows are comparable | 4/10 |

**Why this one**: The inventory is evidence for a later decision, and a fixed vocabulary makes 12 rows comparable at a glance.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- A later phase can decide about a duplicated gate by reading one table.
- `hook-flags` and `hook-trust` are recorded as having no CI counterpart by design, so nobody adds one by mistake.

**What it costs**:
- The document can drift from the hook. Mitigation: T035 recounts the keys from the hook and compares.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A reader treats a verdict as an instruction | L | The header states that nothing acts on it |
| The compatibility helper is mistaken for the hook | M | The task names the installed hook by path and line count |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | No document records the overlap today |
| 2 | **Beyond Local Maxima?** | PASS | Acting now and free text were both compared |
| 3 | **Sufficient?** | PASS | 12 rows, three verdicts |
| 4 | **Fits Goal?** | PASS | It is R11 |
| 5 | **Open Horizons?** | PASS | It is the input to a later cleanup rather than a partial version of it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `scratch/pre-commit-inventory.md`: a new document with 12 rows.

**Gated tasks**: T020 and T035.

**How to roll back**: Delete the file. It is a record, not state.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: One commit per concern, and no ephemeral id in the diff

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-011-context -->
### Context

The phase changes 30 workflow files plus a README table and three scratch documents. A single commit would make a failed probe impossible to attribute. A comment that names the packet, the recommendation or the phase would outlive the plan that gave it meaning, and the repository's comment-hygiene gate blocks such markers.

### Constraints

- Six concerns: concurrency, the parity filter, the guard step, the suppression, the checkout depth, and the documentation.
- A probe that fails must name one commit.
- No R-id, D-id or phase number may appear in a workflow comment, a step name, a filter entry, a README row or an inventory row.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: six concern commits with the subjects T026 names, one closure commit for the acceptance evidence, and a diff check that no ephemeral id entered the tree.

**How it works**: Each concern commit carries one concern, so `git revert` of one restores exactly one behaviour. After the six concern commits, `git diff HEAD~6...HEAD` is searched for `R<digits>`, `D<digits>` and `Phase 0<digit>`, and the search must print nothing. The closure commit follows once the acceptance rows are marked `Met`.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Six concern commits, no ids (chosen)** | A failed probe names one commit; comments stay durable | Six messages to validate, plus the closure message | 9/10 |
| One commit | One revert point | A probe failure cannot be attributed to a concern | 2/10 |
| Ids in comments | Easy traceability to the plan | They outlive the plan and the comment-hygiene gate blocks them | 1/10 |

**Why this one**: The commit boundary is the rollback boundary, and a comment should explain why the code is the way it is rather than which plan asked for it.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- A revert restores one behaviour, and a probe failure points at one commit.
- Workflow comments stay readable after the plan is archived.

**What it costs**:
- Six message validations instead of one. Mitigation: T026 gives the exact command and the six subjects.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An id slips into a comment | M | T026's diff grep must print nothing |
| A commit mixes two concerns | L | The six subjects are written down, and T026 validates each message |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A failed probe must name its cause |
| 2 | **Beyond Local Maxima?** | PASS | One commit and id-carrying comments were both compared |
| 3 | **Sufficient?** | PASS | Six commits cover six concerns |
| 4 | **Fits Goal?** | PASS | It is how R3 to R11 land without becoming one unreviewable diff |
| 5 | **Open Horizons?** | PASS | The comment rule outlives this packet |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- The repository history: six concern commits and one closure commit.
- No file content beyond what T007 to T025 already changed.

**Gated tasks**: T026.

**How to roll back**: `git reset --soft HEAD~6` restores the staged tree without losing a file.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---
