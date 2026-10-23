---
title: "Decision Record: setup caching provisioning"
description: "The eleven decisions behind this phase: one operator choice (D5, the hook-and-plugin merge) and ten design choices the plan freezes (the gate-before-action order, the composite action's shape, the cache key, the cache path set, the cold path, the pinned bun setup, the conditional install substitution, the pip cache, the checkout trial, and the commit and comment hygiene)."
trigger_phrases:
  - "setup caching provisioning decision record"
  - "composite action cache decision"
  - "provision worktree cache adr"
  - "pip cache and checkout trial adr"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency/004-setup-caching-provisioning"
    last_updated_at: "2026-10-23T13:20:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Recorded eleven proposed ADRs for the planned phase"
    next_safe_action: "Answer D5, then run the phase's tasks from T002"
    blockers:
      - "D5 unanswered"
      - "002-rebuild-fanout-removal baseline pending"
      - "003-trigger-and-job-hygiene R8 pending for R18"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-004-setup-caching-provisioning"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does a 2.22 GB tree set compress under the 10 GB budget with room for dependabot churn?"
      - "Does filter: blob:none save anything on a single-commit checkout?"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: setup caching provisioning

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Merge the hook tests into the plugin workflow, and rename one check

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Operator (D5, unanswered), plan author |

---

<!-- ANCHOR:adr-001-context -->
### Context

`hooks-node-tests.yml` and `opencode-plugin-tests.yml` answer nearly the same path set and each runs its own checkout and its own `provision_worktree` over the 2.22 GB tree set. One commit that touches both pays two provisions of 56-67 s. The review measures the merge at 124 runner-min/day standalone, about 53 after R1 and about 27 after R1 and R14.

### Constraints

- The hook job carries a git identity step, a `node:test` collection and the installer test; the plugin job runs a single glob.
- `hooks-node-tests.yml:22,35` adds `.hermes/**`, which the plugin lists lack; `.env.example` is already in both plugin lists (`:22`, `:39`).
- `message-contract.yml` is the only required context, so renaming this check breaks no ruleset.
- The merged job must keep the cold path R14 adds, or the merge would hide a broken install behind a warm cache.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: with D5 approved, delete `hooks-node-tests.yml` and move its three steps, its rationale and `.hermes/**` into `opencode-plugin-tests.yml`, whose job becomes `plugin-and-hook-tests` titled `OpenCode plugin and hook node:test suites`.

**How it works**: one checkout, one action call, then the git identity step, the `node:test` collection and run, the installer test and the plugin suite, in that order. The timeout becomes 40 minutes, the union of the two current 20-minute values, and the weekly cold schedule rides the merged workflow.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Merge into the plugin workflow (chosen)** | One provision, one check name, and the wider plugin path set keeps every plugin suite running | One check is renamed, and the merged job is longer | 8/10 |
| Keep both workflows and share only the cache | No rename, no step move | Two checkouts and two provisions remain, and 124 runner-min/day is forgone | 4/10 |
| Merge into `hooks-node-tests.yml` | The smaller file survives | Its path set omits `src/**`, `manifest.json` and the plugin trees, so plugin-only changes stop running the plugin suites | 2/10 |

**Why this one**: the merge is the only option that removes the second provision without narrowing the trigger, and the rename reaches no required context.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One provision replaces two, worth 124 runner-min/day standalone and about 27 after R1 and R14.
- One check name replaces two, and the README lists one row.

**What it costs**:
- The check is renamed, so the README and any personal bookmark change. Mitigation: D5 records the new title, and AC-015 checks it matches.
- The merged job's timeout is 40 minutes until phase 007 re-sizes it. Mitigation: phase 007 owns timeouts and measures job samples.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A suite is lost in the move | H | T035 copies the three steps verbatim and T041 reads the run log for every suite and the installer line |
| A `.hermes`-only change starts no run | M | T031 and T032 add the entry to both lists, and T041 opens a `.hermes`-only pull request |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two workflows provision the same 2.22 GB set for one commit |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared, including keeping both files |
| 3 | **Sufficient?** | PASS | One job, one provision, one trigger union; nothing else is needed |
| 4 | **Fits Goal?** | PASS | It is R15, the phase's fourth recommendation |
| 5 | **Open Horizons?** | PASS | It removes a job rather than making it cheaper, so phase 008 measures a smaller total |
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.github/workflows/opencode-plugin-tests.yml`: the rationale, both `.hermes/**` entries, the job rename, the timeout, the three hook steps, the cache expression and the schedule.
- `.github/workflows/hooks-node-tests.yml`: deleted.
- `.github/workflows/README.md`: two rows become one.

**Gated tasks**: T001, then T030 to T041.

**How to roll back**: `git checkout -- .github/workflows/hooks-node-tests.yml .github/workflows/README.md` and revert the single merge commit that changed `opencode-plugin-tests.yml`. No state is created.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Teach the gate to read composite actions before the first action exists

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-002-context -->
### Context

`check-gate-inputs.sh:481-484` scans `.github/workflows/*.yml` and `*.yaml` only, and `.github/actions/` does not exist today. The action this phase adds holds five `uses:` call sites and one `run:` block with literal `.skilled/` paths, so without a scan the one CI surface no gate reads would be the one this phase creates.

### Constraints

- The gate is a protected workflow by function: it is the sole enforcer of the twin and input rules, with no local equivalent.
- A composite action's `description:` is prose exactly like a step's `name:`, and an action whose prose names a path that no job runs must not fail the gate.
- The parser is text-based and fail-closed: a shape it cannot read fails `parser-miss`.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: add a guarded `find` over `.github/actions` that feeds the existing `scan_workflow`, and extend the `name:` label branch to `(name|description):`, both before any action file exists.

**How it works**: the loop increments `FILES` and calls the same parser per `action.yml` or `action.yaml`, so the twin and input rules apply unchanged. The directory test keeps the file count at 45 until the action lands, then 46. Four fixture cases prove the scan, the unresolved path, the unreadable shape and the label branch.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scan first, with fixtures (chosen)** | The action's first commit is already read; each branch has a failing fixture | One script and one test change before the action exists | 9/10 |
| Add the scan in the same commit as the action | One commit fewer | A gate bug and an action bug land together, and the gate cannot be proven against a real action | 5/10 |
| Scan actions without the `description:` branch | Smaller change | Prose naming a path fails the gate, and the only fix is to edit documentation around the parser | 3/10 |

**Why this one**: the gate's failure mode is silence, so the scan and its fixtures land where a failure is visible and the action arrives into a surface already under test.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- `.github/actions/**` joins the gate's scan surface, and the file count reports it.
- An action with an unresolved path or a one-root filter fails CI before merge.

**What it costs**:
- One more branch in the awk program, which every workflow line now runs. Mitigation: the branch is a regex alternation on an existing pattern, and the fixture suite runs in seconds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The branch hides a real `description:`-shaped input | M | Only `name:` and `description:` keys are labels; `run:` handling is untouched, and T007 and T008 prove the failing shapes |
| The file count changes before the action exists | L | The directory test keeps it at 45, and T004 checks that exact value |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The phase creates the first action, and no gate reads that directory |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared, including landing both changes together |
| 3 | **Sufficient?** | PASS | One loop, one alternation and four fixtures |
| 4 | **Fits Goal?** | PASS | It is R12, and the review orders it before R14 |
| 5 | **Open Horizons?** | PASS | Every later action is covered without another edit |
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `.github/scripts/check-gate-inputs.sh`: the scan loop, the label branch and the rule comment.
- `.github/scripts/tests/check-gate-inputs.test.sh`: four cases.

**Gated tasks**: T004 to T011.

**How to roll back**: delete the scan block, restore the `name:`-only branch and remove the four cases. The gate returns to 45 files and 50 passing cases.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: One composite action with restore, provision and a conditional save

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-003-context -->
### Context

Five provisioning sites in three workflows repeat the same eleven lines: install bun, export `PATH`, source the provisioner, call `provision_worktree`. A cache can shorten that work, but `_wn_deps_satisfied` accepts a tree by dependency name, not version, so a restored tree can be wrong without failing.

### Constraints

- `actions/checkout` creates a fresh `.git` every run, so a restored tree's build stamps read `unrecorded` and every artifact rebuilds.
- A composite action cannot carry a cache post-step condition of its own; restore and save must be separate steps.
- Every `uses:` in this tree is pinned to a full commit SHA with a trailing version comment.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: `.github/actions/setup/action.yml` with four steps — `actions/cache/restore`, `oven-sh/setup-bun`, `provision_worktree`, `actions/cache/save` — where provisioning runs on every path including a hit, and the save runs only on a miss after a successful provision.

**How it works**: the restore is conditioned on `inputs.cache`, the provision step is unconditional and is the authority, and the save is conditioned on `inputs.cache == 'true' && steps.restore.outputs.cache-hit != 'true'`. A failed provision fails the job before the save step can run.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Restore, provision, conditional save (chosen)** | A hit shortens the work; the walk still decides whether the tree is usable; a failed provision cannot be saved | Four steps in one file, and five call sites depend on it | 9/10 |
| The combined `actions/cache` action | One step | Its post-step save behaviour after a failed job is not verified here | 5/10 |
| Inline the same four steps in each workflow | No new file | Five copies of the key and five places a future edit must land, which is the duplication being removed | 3/10 |

**Why this one**: it keeps the provisioner as the only authority and makes the save condition explicit rather than dependent on a post-step.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One file holds the cache shape, and five sites adopt it.
- A hit turns a 56-67 s provision into a restore plus the verification walk, about 40 s shorter per job.

**What it costs**:
- Five jobs now depend on one file, so an error there fails all five at once. Mitigation: the failure is loud and has the same blast radius the workflows already share through `worktree-naming.sh`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A half-provisioned tree is saved | H | The save step's condition requires `cache-hit != 'true'` and a successful provision step |
| A restored tree is accepted while wrong | H | The provision walk still runs and reinstalls what it rejects; the key globs every lockfile |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five sites repeat the same eleven lines |
| 2 | **Beyond Local Maxima?** | PASS | Three shapes compared, including the combined cache action |
| 3 | **Sufficient?** | PASS | Four steps and three inputs |
| 4 | **Fits Goal?** | PASS | It is R14, the phase's largest recommendation |
| 5 | **Open Horizons?** | PASS | A later action can be added beside it without touching the call sites |
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `.github/actions/setup/action.yml`: created.

**Gated tasks**: T014.

**How to roll back**: `rm -r .github/actions/setup`. Every call site fails until its own adoption is reverted, so revert the adoptions first.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Key the cache on every lockfile and the Node major, with no fallback key

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-004-context -->
### Context

`_wn_deps_satisfied` (`worktree-naming.sh:486-506`) compares a dependency name against the `node_modules` chain, so a restored tree with the wrong version is accepted silently. The repository holds 13 lockfiles today, two of them bun, and `setup-node` uses Node 20 on 13 lines and Node 22 on 22.

### Constraints

- A key that enumerates today's lockfiles misses the next one added.
- `restore-keys` restores a tree from a different lockfile set, which the walk accepts without a word.
- A change in what gets provisioned must invalidate the entry, not only a change in versions.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: `key: provision-${{ runner.os }}-node${{ inputs.node-major }}-${{ hashFiles('**/package-lock.json', '**/bun.lock', '**/bun.lockb', '.skilled/skills/sk-git/scripts/worktree-provision-paths.txt', '.skilled/skills/sk-git/scripts/worktree-naming.sh') }}`, with no `restore-keys`.

**How it works**: the glob covers all 13 lockfiles and every one added later; the provision list and the provisioner join the hash, so a change in what is installed or how invalidates the entry; `node-major` is an input, so a Node bump misses instead of restoring an ABI-mismatched tree.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Glob every lockfile, no fallback (chosen)** | Covers future lockfiles; a mismatch is a miss, not a green run with wrong versions | A Code Mode lockfile that provisions nothing still invalidates | 9/10 |
| Enumerate the 13 lockfiles | An exact key | The next lockfile is missed, which is the silent-staleness path | 4/10 |
| Add `restore-keys: provision-${{ runner.os }}-` | Fewer cold runs | Restores a tree from another lockfile set, which the walk accepts | 2/10 |

**Why this one**: a cold run costs about 62 s; a wrong-version green run costs the point of the gate.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- The silent-staleness path is closed structurally rather than by discipline.
- A Node major change invalidates the entry.

**What it costs**:
- Any lockfile change turns the next run cold in whichever workflow runs first. Mitigation: the key is shared across workflows, so one cold run seeds every consumer.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An over-invalidating lockfile costs a cold run | L | The Code Mode lockfile is the known case, and it is accepted as the price of the glob |
| A lockfile outside the glob is added | M | The three globs cover every name npm, bun text and bun binary use |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The walk accepts wrong versions, so the key is the only guard |
| 2 | **Beyond Local Maxima?** | PASS | Three key shapes compared |
| 3 | **Sufficient?** | PASS | Three globs plus two definition files plus the Node major |
| 4 | **Fits Goal?** | PASS | It is the core of R14 |
| 5 | **Open Horizons?** | PASS | New lockfiles need no edit |
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.github/actions/setup/action.yml`: the `key:` expression and the absence of `restore-keys`.

**Gated tasks**: T014.

**How to roll back**: restore the previous key expression. No entry is deleted; an orphan expires unused.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Cache the trees, the build outputs and the stamps, and drop `~/.npm` first

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-005-context -->
### Context

The provisioned set is 2.22 GB uncompressed, and only about 3.6 MB of it is build output (`iteration-012.md:79-101`). The five build artifacts are stamped under the worktree's own git directory, and a fresh `.git` makes every stamp `unrecorded`, so a cache without the stamps rebuilds all five artifacts on every hit.

### Constraints

- The cache budget is 10 GB per repository, and entries are evicted after seven days unused.
- The 2.22 GB set is documented to compress to roughly 0.7-1 GB per entry, which was not re-verified here.
- A restored stamp is content-validated against the tree, so a mismatched stamp triggers the rebuild it would have triggered anyway.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: cache the 11 `node_modules` trees, the five `dist` outputs, `.git/provision-stamps` and `~/.npm` in one entry, and drop `~/.npm` first when T013 measures the entry over budget.

**How it works**: the stamp is the one cache entry that cannot go stale silently, because its content is a fingerprint of the tree it was built from. `~/.npm` only shortens a cold run, so it is the cheapest component to lose.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Trees, outputs, stamps and `~/.npm` (chosen)** | A hit skips the installs and the builds; the stamps make the hit stable | The largest entry against a 10 GB budget | 8/10 |
| Trees and outputs, no stamps | Smaller entry | All five artifacts rebuild on every hit, which removes most of the gain | 3/10 |
| Trees only | Smallest entry | The artifacts rebuild, and the sk-vision bundle is missing for the plugin tests | 2/10 |

**Why this one**: the stamps are what make a hit skip the builds, and they are safe because they are content-validated rather than time-validated.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A hit skips both the installs and the five artifact builds.
- The entry's size is a measured number from T013, not an assumption.

**What it costs**:
- Dependabot churn can evict entries. Mitigation: T013's go/no-go and the `~/.npm` drop keep the entry inside budget.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The entry exceeds the budget | M | T013 returns `no-go` and R14 stops; `~/.npm` is the first component dropped |
| A restored stamp mismatches and rebuilds | L | That is the intended behaviour and costs one build, not a wrong tree |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without the stamps every artifact rebuilds on a hit |
| 2 | **Beyond Local Maxima?** | PASS | Three path sets compared |
| 3 | **Sufficient?** | PASS | 11 trees, five outputs, one stamp directory, one download cache |
| 4 | **Fits Goal?** | PASS | It is the saving R14 measures |
| 5 | **Open Horizons?** | PASS | A new provisioned tree is a one-line addition |
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `.github/actions/setup/action.yml`: the two `path:` blocks.
- `.github/workflows/cache-probe.yml`: the same list, on the throwaway branch.

**Gated tasks**: T012, T013, T014.

**How to roll back**: remove `.git/provision-stamps` or `~/.npm` from both `path:` blocks. The next run rebuilds what the removed entry held.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Keep the cold path alive with a dispatch input and a weekly schedule

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-006-context -->
### Context

A warm cache stops exercising `provision_worktree`, which is the only path that proves the install still works against today's lockfiles. A removed tarball or a `--frozen-lockfile` mismatch would merge green and appear later.

### Constraints

- A scheduled run has no `inputs`, so the cache expression must read the event name as well as the input.
- The cold path must not run on every push, or the cache saves nothing.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We chose**: a `workflow_dispatch` input `cold` on the two surviving workflows, and a weekly `schedule` on the merged workflow, with `cache: ${{ github.event_name != 'schedule' && inputs.cold != 'true' }}`.

**How it works**: on push and pull request `inputs.cold` is null, so the comparison is true and the cache is on. A dispatch with `cold=true` and every scheduled run force a miss, so the install path runs at least once a week.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Dispatch input plus weekly schedule (chosen)** | The cold path runs on a calendar and on demand | One input, one expression and one schedule | 9/10 |
| A dispatch input only | No scheduled cost | Nothing exercises the cold path unless a person remembers | 4/10 |
| No cold path | Simplest | A broken cold install merges green | 1/10 |

**Why this one**: the weekly run costs one cold provision and keeps the claim "the tests pass" meaning what it says.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- The miss path is exercised at least weekly and on demand.
- A cache-related regression surfaces on a schedule rather than at a dependabot bump.

**What it costs**:
- One cold run a week, about 62 s of provision plus the installs. Mitigation: it runs once, on a Monday morning, on a low-traffic branch.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The schedule's expression keeps the cache on | H | T036 changes the expression and T037's YAML parse plus the first scheduled run prove it |
| A scheduled run fails for an unrelated reason | L | The run is recorded in `scratch/phase-result.md` and does not gate a merge |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without it, no job installs once the cache is warm |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One input and one cron entry |
| 4 | **Fits Goal?** | PASS | It protects R14's saving from becoming a silent regression |
| 5 | **Open Horizons?** | PASS | A later workflow adopts the same input |
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `.github/workflows/opencode-plugin-tests.yml`: the dispatch input, the cache expression and the schedule.
- `.github/workflows/opencode-dual-version.yml`: the dispatch input and two cache expressions.

**Gated tasks**: T019, T020, T025, T026, T027, T036, T037.

**How to roll back**: delete the `cold` input, restore `cache: ${{ inputs.cold != 'true' }}`, and delete the schedule block.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Set bun up from a pinned action instead of an npm bootstrap

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-007-context -->
### Context

Five sites run `npm install --no-save --prefix "$RUNNER_TEMP/bun" bun@1.3.9` and then export its `node_modules/.bin` onto `PATH`: `hooks-node-tests.yml:60`, `opencode-plugin-tests.yml:69`, `opencode-dual-version.yml:101,184` and `spec-kit-check.yml:100`. The review names three of the five.

### Constraints

- The composite action must provide bun for the provisioner, which uses `bun install --frozen-lockfile` and `bun run build` for two packages.
- Every `uses:` is SHA-pinned in the tree's existing form.
- The bun version must stay at 1.3.9, which the two bun lockfiles pin.
<!-- /ANCHOR:adr-007-context -->

---

<!-- ANCHOR:adr-007-decision -->
### Decision

**We chose**: `oven-sh/setup-bun` pinned to a full commit SHA with `bun-version: ${{ inputs.bun-version }}` (default `'1.3.9'`) inside the composite action, and delete every npm bootstrap.

**How it works**: setup-bun puts bun on `PATH` for the rest of the job, so the `PATH` export and the bootstrap line both disappear. The fifth site, `spec-kit-check.yml:100`, goes with the whole sk-vision step, because the provision list already builds `dist/plugin.js`.
<!-- /ANCHOR:adr-007-decision -->

---

<!-- ANCHOR:adr-007-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pinned `setup-bun` in the action (chosen)** | One setup, cached toolchain, no npm bootstrap | One more pinned action on the supply-chain surface | 9/10 |
| Keep the npm bootstrap inside the action | No new action | Installs bun with npm on every cold run and needs the `PATH` export | 4/10 |
| Use the runner's preinstalled bun | Nothing to pin | The runner's version is not 1.3.9, and the bun lockfiles pin it | 1/10 |

**Why this one**: it removes five bootstraps and one `PATH` export, and the version stays a declared input.
<!-- /ANCHOR:adr-007-alternatives -->

---

<!-- ANCHOR:adr-007-consequences -->
### Consequences

**What improves**:
- Five bootstrap lines and one `PATH` export disappear.
- Bun is set up once per job instead of once per step that needs it.

**What it costs**:
- One more SHA-pinned action. Mitigation: NFR-S01 requires the pin, and T014 resolves it with `gh api`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| setup-bun installs a different version | M | `bun-version` is an input defaulting to `1.3.9`, and the two bun packages fail loudly on a mismatch |
| A job loses bun from `PATH` | M | setup-bun writes `PATH` for the job, and T023 removes the export only after T021 and T022 adopt the action |
<!-- /ANCHOR:adr-007-consequences -->

---

<!-- ANCHOR:adr-007-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Five sites install bun with npm on every cold run |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | One pinned action and one input |
| 4 | **Fits Goal?** | PASS | It is part of R14 |
| 5 | **Open Horizons?** | PASS | A later workflow adopts the action and inherits bun |
<!-- /ANCHOR:adr-007-five-checks -->

---

<!-- ANCHOR:adr-007-impl -->
### Implementation

**What changes**:
- `.github/actions/setup/action.yml`: the setup-bun step and the `bun-version` input.
- Three workflows: the bootstrap lines and the `PATH` export.

**Gated tasks**: T014, T015, T017, T021, T022, T023.

**How to roll back**: restore the bootstrap line and the `PATH` export in the affected step, and remove the setup-bun step from the action.
<!-- /ANCHOR:adr-007-impl -->
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Adopt the action per file, and keep a block only when its warm step drops

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-008-context -->
### Context

Eleven workflows run two to eight `npm ci` commands inside their jobs, and `spec-kit-check.yml` runs nine install commands across three jobs. Routing them through the action makes a cold run install the whole 2.22 GB provision list, which is more than a lean job needs; on a hit it is a restore plus the verification walk. The review estimates 20-40 runner-min/day standalone, smaller after R1.

### Constraints

- `routing-registry-drift.yml:148-153` deliberately avoids the advisor runtime's native and ML dependencies in its lean job.
- A cold run costs one heavy install in whichever workflow runs first after a lockfile change.
- Each file's install step is measured against the 002 baseline, not against an estimate.
<!-- /ANCHOR:adr-008-context -->

---

<!-- ANCHOR:adr-008-decision -->
### Decision

**We chose**: replace every install block with one action call, starting with `routing-registry-drift.yml` and `spec-kit-check.yml`, and keep each substitution only when its warm install step is at least 10 s shorter than its baseline.

**How it works**: T042 to T061 replace the blocks and T062 records one row per file with the baseline seconds, the warm seconds and `keep` or `revert`. A file marked `revert` goes back to its inline block and its row records why.
<!-- /ANCHOR:adr-008-decision -->

---

<!-- ANCHOR:adr-008-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Replace and keep per measured file (chosen)** | A measured keep-or-revert per file; the lean job's cold cost is recorded | Ten files to edit and measure | 8/10 |
| Replace every block unconditionally | Uniform | A lean job pays a heavy cold install with no measurement to justify it | 4/10 |
| Replace only the two named files | Smallest change | Leaves eight files' installs duplicated | 3/10 |

**Why this one**: the saving is arithmetic on medians until a warm run measures it, and a file that does not drop is a revert rather than an argument.
<!-- /ANCHOR:adr-008-alternatives -->

---

<!-- ANCHOR:adr-008-consequences -->
### Consequences

**What improves**:
- One action call replaces two to eight install commands per file.
- Every kept substitution has a measured warm step behind it.

**What it costs**:
- A cold run in a lean job installs the whole list. Mitigation: the shared key makes a hit the common case, and T062 records the cold cost beside the warm one.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A warm step does not drop and the block stays | M | T062's revert rule and the per-file row |
| A job times out on its first cold run | M | The heaviest job's timeout is 45 minutes, and the provision step fails fast on a broken install |
<!-- /ANCHOR:adr-008-consequences -->

---

<!-- ANCHOR:adr-008-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Eleven workflows repeat installs the action already performs |
| 2 | **Beyond Local Maxima?** | PASS | Three scopes compared |
| 3 | **Sufficient?** | PASS | One call per block and one record per file |
| 4 | **Fits Goal?** | PASS | It is R16 |
| 5 | **Open Horizons?** | PASS | A later workflow adopts the same call |
<!-- /ANCHOR:adr-008-five-checks -->

---

<!-- ANCHOR:adr-008-impl -->
### Implementation

**What changes**:
- Ten workflows: one action call per install block, plus `.github/actions/**` in the filters where a filter exists.
- `scratch/npm-dedupe.md`: ten rows.

**Gated tasks**: T042 to T062.

**How to roll back**: `git checkout -- .github/workflows/<file>.yml` for a file marked `revert`, or restore the quoted install block for a kept file that later fails.
<!-- /ANCHOR:adr-008-impl -->
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Cache pip through the pinned `setup-python`, keyed on the workflow file

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-009-context -->
### Context

Four workflows install one or two pinned Python packages: `naming-standard-guard.yml:28`, `sk-doc-rename-harness.yml:46`, `sk-doc-script-tests.yml:37` and `spec-kit-check.yml:208`. The saving is negligible, and the review keeps it only as a by-product of R14.

### Constraints

- The repository holds no `requirements.txt`, so `cache: pip` without `cache-dependency-path` finds no file to hash.
- Each of the four files already has a pinned `actions/setup-python` step.
- A `python` input on the composite action would drag the whole provision into four light workflows.
<!-- /ANCHOR:adr-009-context -->

---

<!-- ANCHOR:adr-009-decision -->
### Decision

**We chose**: add `cache: pip` and `cache-dependency-path: .github/workflows/<file>.yml` to each existing `setup-python` step.

**How it works**: the workflow file is what holds the pins, so it is the file whose change should invalidate the cache. No new action and no new file.
<!-- /ANCHOR:adr-009-decision -->

---

<!-- ANCHOR:adr-009-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`cache: pip` with the workflow file as the path (chosen)** | Two lines per file, no new dependency | The cache misses when an unrelated line in the workflow changes | 8/10 |
| A `requirements.txt` per workflow | A conventional key | Adds four files for one or two packages each | 4/10 |
| A `python` input on the composite action | One call | Drags the full provision into four light workflows | 2/10 |

**Why this one**: it is the smallest change that gives pip a real key, and the pins are already in the workflow file.
<!-- /ANCHOR:adr-009-alternatives -->

---

<!-- ANCHOR:adr-009-consequences -->
### Consequences

**What improves**:
- Four pip steps restore a wheel cache instead of downloading.
- No new file, no new action.

**What it costs**:
- A workflow edit invalidates its own pip cache. Mitigation: the pins are the lines that matter, and the download is one or two packages.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `setup-python` fails to find the dependency file | M | `cache-dependency-path` names a file that always exists, and T063 to T066 each parse the YAML |
<!-- /ANCHOR:adr-009-consequences -->

---

<!-- ANCHOR:adr-009-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Four jobs download the same wheels on every run |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Two lines per file |
| 4 | **Fits Goal?** | PASS | It is R17 |
| 5 | **Open Horizons?** | PASS | A fifth pip workflow copies two lines |
<!-- /ANCHOR:adr-009-five-checks -->

---

<!-- ANCHOR:adr-009-impl -->
### Implementation

**What changes**:
- Four workflows: two lines under `python-version`.

**Gated tasks**: T063 to T066.

**How to roll back**: delete the two added lines.
<!-- /ANCHOR:adr-009-impl -->
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Trial `blob:none`, then a sparse cone that names the `.skilled` targets

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-010-context -->
### Context

A default-depth checkout still costs about 50 s per job in the samples. `rule-canary-sync.yml` is the lightest workflow whose checker reads a bounded set: `check-rule-copies.js` reads `AGENTS.md` and seven files under `.skilled/skills/sk-code/`.

### Constraints

- `.opencode/skills`, `.opencode/commands`, `.opencode/agents` and `.opencode/bin` are symlinks into `.skilled`, so a cone naming `.opencode` names links, not files.
- Phase 003's R8 removes `fetch-depth: 0` from this file, so the trial has no history to fetch.
- `gate-inputs` and the citation walkers need the whole tree, so this never applies to them.
<!-- /ANCHOR:adr-010-context -->

---

<!-- ANCHOR:adr-010-decision -->
### Decision

**We chose**: add `filter: blob:none` to the checkout, and fall through to a sparse cone of `/AGENTS.md` and `/.skilled/skills/sk-code/` with `sparse-checkout-cone-mode: false` when `blob:none` saves less than 10 s.

**How it works**: the cone names the `.skilled` targets the checker reads, and the canary job proves the checkout by logging `All rule invariants present`. A variant that is not at least 10 s shorter than the baseline is reverted.
<!-- /ANCHOR:adr-010-decision -->

---

<!-- ANCHOR:adr-010-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`blob:none`, then sparse (chosen)** | Measured in two steps, and the cheaper variant is kept | Two runs | 8/10 |
| Sparse only | One run | Skips the cheaper test | 5/10 |
| Leave the checkout alone | No risk | The 50 s checkout stays | 3/10 |

**Why this one**: `blob:none` is one line and may be enough; the sparse cone is the fallback with the symlink trap already mapped.
<!-- /ANCHOR:adr-010-alternatives -->

---

<!-- ANCHOR:adr-010-consequences -->
### Consequences

**What improves**:
- The canary's checkout may drop by about 20 s or more.
- The symlink layout is recorded for the next sparse trial.

**What it costs**:
- One or two canary runs. Mitigation: the runs are cheap and the verdict is recorded.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The cone omits a file the checker reads | H | The canary run fails loudly, and T069's stop condition names it |
| Phase 003's R8 has not landed | M | T067 marks R18 blocked and the phase closes without it |
<!-- /ANCHOR:adr-010-consequences -->

---

<!-- ANCHOR:adr-010-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The checkout is the second-largest per-job cost after the install |
| 2 | **Beyond Local Maxima?** | PASS | Three variants compared |
| 3 | **Sufficient?** | PASS | One `with:` block |
| 4 | **Fits Goal?** | PASS | It is R18, the phase's last recommendation |
| 5 | **Open Horizons?** | PASS | A measured result tells a later phase whether to widen it |
<!-- /ANCHOR:adr-010-five-checks -->

---

<!-- ANCHOR:adr-010-impl -->
### Implementation

**What changes**:
- `.github/workflows/rule-canary-sync.yml`: the checkout step's `with:` block.
- `scratch/checkout-probe.md`: three rows and a verdict.

**Gated tasks**: T067 to T070.

**How to roll back**: delete the `with:` block, restoring the T067 state.
<!-- /ANCHOR:adr-010-impl -->
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: One commit per concern, and no ephemeral ids in code

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-10-23 |
| **Deciders** | Plan author |

---

<!-- ANCHOR:adr-011-context -->
### Context

The phase touches one gate, one test, one new action, 13 workflow files and one README. A single commit would make a failed probe name the whole phase. The repository's comment-hygiene gate rejects ephemeral artifact pointers in code comments.

### Constraints

- A probe that fails must name the commit that caused it.
- No R-id, D-id or phase number may appear in a workflow comment, a step name, an action input, a cache key or a README row.
- The gate scan, the action, the adoptions, the merge, the install substitutions, the pip cache and the checkout trial are independent concerns.
<!-- /ANCHOR:adr-011-context -->

---

<!-- ANCHOR:adr-011-decision -->
### Decision

**We chose**: commit one concern at a time, and carry the durable WHY in every comment instead of a packet id.

**How it works**: eight content commits, in the order the tasks run. Each content commit task runs `git diff --cached | grep -nE '\bR[0-9]+\b|\bD[0-9]+\b|[Pp]hase 0[0-9]'` on its staged set and expects no output, and T071 re-scans the eight committed diffs.
<!-- /ANCHOR:adr-011-decision -->

---

<!-- ANCHOR:adr-011-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One commit per concern (chosen)** | A failed probe names one commit; a revert is one commit | Eight commits | 9/10 |
| One commit for the phase | Simplest history | A failed probe names everything, and a partial revert is a manual edit | 3/10 |
| One commit per file | Finest granularity | The action and its five adoptions land separately, so an intermediate state is broken | 4/10 |

**Why this one**: the probes in this phase fail one file at a time, and a one-commit revert is what makes the rollback plan real.
<!-- /ANCHOR:adr-011-alternatives -->

---

<!-- ANCHOR:adr-011-consequences -->
### Consequences

**What improves**:
- A failed probe names the concern it belongs to.
- A revert is one commit, and the cache entries expire unused.

**What it costs**:
- Seven commits to review. Mitigation: each carries one subject and one file group.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An ephemeral id reaches a comment | M | T071's grep blocks the commit, and the pre-commit gate repeats it |
| An intermediate commit leaves a workflow broken | M | The install and its filters land in the same concern, and the merge lands as one commit over two files |
<!-- /ANCHOR:adr-011-consequences -->

---

<!-- ANCHOR:adr-011-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A phase-wide commit makes every probe ambiguous |
| 2 | **Beyond Local Maxima?** | PASS | Three granularities compared |
| 3 | **Sufficient?** | PASS | Seven commits, one per concern |
| 4 | **Fits Goal?** | PASS | The rollback plan depends on it |
| 5 | **Open Horizons?** | PASS | A later phase reverts one concern without touching the rest |
<!-- /ANCHOR:adr-011-five-checks -->

---

<!-- ANCHOR:adr-011-impl -->
### Implementation

**What changes**:
- No file; the commit set and the staged-diff check.

**Gated tasks**: T071, and every commit in the phase.

**How to roll back**: `git revert <sha>` for the one concern, then re-run the probe that failed.
<!-- /ANCHOR:adr-011-impl -->
<!-- /ANCHOR:adr-011 -->

---
