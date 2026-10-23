---
title: "Implementation Plan: Phase 7: workflow-hygiene-on-off-control"
description: "Three passes over the same 32 workflow files: declare least-privilege permissions and split the Dependabot workflow, then size a timeout for every job from 40 runs of job-level samples, then put a vars.SKILLED_CI switch on every job except Dependabot's two and document the six variables in the workflows README. Each pass is proved by a parse of every workflow and by the gate-input check, and the switch is proved behaviourally on a fork."
trigger_phrases:
  - "workflow hygiene on off control plan"
  - "phase 7 workflow hygiene on off control plan"
  - "per job timeout sizing plan"
  - "ci switch variables plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: workflow-hygiene-on-off-control

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions workflow YAML, bash, Python 3 for the job inventory and the timeout arithmetic |
| **Framework** | The Actions workflow engine's `vars` context and job-level `if:`, the `gh` CLI, and `.github/scripts/check-gate-inputs.sh`, which parses every workflow as text |
| **Storage** | None shipped. `scratch/r24/` holds the per-run job JSON and the sizing table; `scratch/r26-probe.md` holds the two probe run ids |
| **Testing** | A YAML parse of every workflow, a job inventory that asserts one timeout and one switch per job, `check-gate-inputs.sh`, a fork probe through `gh variable set` and `gh workflow run`, and `validate.sh --strict` |

### Overview
The phase is three passes over the same 32 files, ordered so the job graph stops moving before anything is sized or gated. R25 first: a workflow-level `permissions: contents: read` on the 12 files that declare none, and `dependabot-auto-merge.yml` split into a read-only metadata job and a write-scoped merge job. R24 second: 40 runs per workflow of job-level timings, the formula `max(floor, ceil(3 x p50), ceil(2 x p100))`, and a value on every job with its p100 recorded beside it. R26 third: the `vars.SKILLED_CI` switch on every job except Dependabot's two, ANDed onto the three existing conditions, plus the README section that names the six variables.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified: `003`, `004`, `005` and `006` landed, the 002 baseline or the 001 dataset in hand, `gh` with `repo` and `actions` scopes, a fork or throwaway test repository, and D6 answered

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `grep -L 'permissions:' .github/workflows/*.yml` returns nothing; every job parses with a `timeout-minutes`; every job except Dependabot's two parses with a `vars.SKILLED_CI` switch
- [ ] `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, every workflow parses, and the fork probe is recorded
- [ ] Docs updated: the `### On/off switches` section in `.github/workflows/README.md`, and `scratch/phase-result.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Measure-then-write sweep, one pass per concern, each pass proved by a parse of every workflow before the next begins.

### Key Components
- **The job inventory** (`scratch/inventory.md`, derived by a Python one-liner): the `(workflow file, job id)` pairs, their current `timeout-minutes`, their current job-level `if:`, and their workflow's group. It is re-derived after `003`, `004` and `005` land, because every number in this plan predates them.
- **The job timing sample** (`gh run list --workflow <file> --limit 40 --json databaseId,conclusion`, then `gh run view <id> --json jobs`): the same shape `001-research/scratch/ci-run-data/` already holds, where `per-workflow/<name>.json` is the run list and `jobs/<run-id>.json` carries `jobs[].startedAt` and `completedAt`.
- **The sizing table** (`scratch/r24/timeouts.md`): one row per job with the sample count, p50, p100, the formula's value, the floor's effect and the final value.
- **`dependabot-auto-merge.yml`** (`:10-12`, `:18`, `:22`, `:30-40`): the only workflow whose job graph changes. `fetch-metadata` moves to a read-only job and `gh pr merge` keeps the write scopes.
- **The switch line**: `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_<GROUP> != 'off'`, inserted between a job's `name:` and its `runs-on:`, modelled on `trigger-index-rebuild.yml:33` for the bare form and on `gate-inputs.yml:12-14` for the position.
- **`.github/workflows/README.md:60-75`**: the push-versus-pull-request table whose rows are the five groups. The row a workflow sits in decides its variable, so the README stays the source of the taxonomy rather than a second list.

### Data Flow
The inventory fixes the target set. The permissions pass edits 12 headers and one job graph, then the gate runs. The sampling pass writes one JSON per run per workflow, the sizing script reduces it to the table, and the values are written per workflow. The switch pass inserts one line per job from the group assignment, then the gate and the parse run again. The fork probe is the only behavioural proof, and it runs last because it needs the switch lines in place.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/*.yml` job blocks | Producer of every job's timeout and switch | update: one `timeout-minutes` and one `if:` line per job | `python3` over all files reports every job with both keys (T027 to T058, T062 to T094, T060, T096) |
| `.github/workflows/dependabot-auto-merge.yml:10-12` | Producer of the only workflow-level write scopes | update: workflow block becomes `contents: read`; writes move to the `auto-merge` job | `grep -n 'contents: write'` returns one line, inside `auto-merge` (T019, T034) |
| `.github/workflows/trigger-index-rebuild.yml:33` | Producer of the rebuild loop guard | update: the switch is ANDed on, the trailer test survives | `grep -c 'Trigger-Index-Rebuild: ci' .github/workflows/trigger-index-rebuild.yml` is unchanged (T092, T093, T096) |
| `.github/workflows/skill-doc-frontmatter.yml:52` | Producer of the PR-only job condition | update: the switch is ANDed on | `grep -n 'github.event_name == .pull_request.' .github/workflows/skill-doc-frontmatter.yml` still returns the line (T094, T096) |
| `.github/workflows/message-contract.yml:17-19` | Consumer of the switch; holds the only required context | update: the switch and a timeout; the prohibition is documented, not enforced in YAML | `grep -c 'SKILLED_CI_MESSAGES' .github/workflows/message-contract.yml` returns 1, and the README section states the prohibition (T039, T083, T095) |
| `.github/workflows/README.md:60-75` | Producer of the group taxonomy | unchanged rows; one new `### On/off switches` section after `:75` | `git diff --stat .github/workflows/README.md` shows one file and the section is below the table (T095) |
| `.github/scripts/check-gate-inputs.sh` | Consumer that parses every workflow as text and fails closed on an unreadable shape | unchanged | `RESULT: PASSED` after each pass (T020, T060, T096, T101) |
| `006-sk-code-ci-surface` rule data | Producer of the timeout formula, the least-privilege rule and the switch shape | unchanged; the packet keeps `max(<floor>, ...)` and this phase records the floor in `scratch/decisions.md` | `grep -c 'max(<floor>' .skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` returns 1 (T003, ADR-009) |
| `009-doctor-ci-review-wiring` `/doctor:ci report` | Consumer of the variable names and the switch line | unchanged; it reads what this phase writes | the six names in `scratch/switch-groups.md` match the README section (T004, T095) |

Required inventories:
- Same-class producers: `grep -n '^    if:' .github/workflows/*.yml` returns the four job-level conditions (`dependabot-auto-merge.yml:18`, `skill-doc-frontmatter.yml:52`, `trigger-index-rebuild.yml:33`, `:186`); `grep -n 'timeout-minutes' .github/workflows/*.yml` returns seven lines in six files; `grep -L 'permissions:' .github/workflows/*.yml` returns twelve files. The inventory task re-runs all three after the dependency phases land.
- Consumers of changed symbols: `rg -n 'timeout-minutes|SKILLED_CI|permissions:' .github .skilled --glob '!**/node_modules/**'` finds the workflow sites, `check-gate-inputs.sh`, the 006 rule data and the 009 command plan. No runtime code reads a workflow's timeout or switch.
- Matrix axes: workflow class (permissions-only, plain, special) x change (permissions, split, timeout, switch) x group (FRESHNESS, TESTS, REVIEW, REPORTS, MESSAGES, none). Required rows: permissions-only + permissions; plain + timeout + switch; special + ANDed switch; special + split; none + neither. Every one of the 33 workflows falls in exactly one row.
- Algorithm invariant: after the phase every job has exactly one `timeout-minutes` and exactly one switch unless it is one of Dependabot's two jobs, and where a job had an `if:` its original expression survives as a conjunct. Adversarial cases: an `if:` that is a quoted `${{ }}` string, an `if:` that spans a `>-` block, a job with a matrix, a job with `needs:`, and a job whose `name:` contains a colon.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Implementation Notes

- **D6 is the only operator decision, and its default is 10 minutes.** A lower floor tightens hang detection and raises the false-kill risk (`final-review.md:619`). The alternative, 5 minutes, is applied uniformly if the operator chooses it, never per job. T001 records the answer as one `D6=<n>` line in `scratch/decisions.md` before the first timeout is written, because changing the floor afterwards means re-deriving every value. The answer lives in the phase's scratch record, not in this plan, so the plan stays a plan and the record stays evidence.
- **Internal order is R25, then R24, then R26.** The review numbers them R24, R25, R26, but the build order follows the job graph rather than the numbering: R25's split creates a job, R24 must size that job, and R26 must leave it alone. Sizing first would leave the new job uncovered, and switching first would put a line above every `runs-on:` that the timeout pass then has to step over.
- **The timeout key sits after `runs-on:`, not before it.** All seven existing `timeout-minutes` lines in the tree sit on the line after `runs-on: ubuntu-latest` (`opencode-dual-version.yml:73-74`, `deep-loop-runtime.yml:35-36`, `hooks-node-tests.yml:45-46`, `opencode-plugin-tests.yml:53-54`, `skill-advisor-stress.yml:42-43`, `sk-doc-rename-harness.yml:30-31`), so the phase copies that position. The switch is inserted above `runs-on:` instead, which is where a job condition conventionally sits, so the two passes never contend for the same line.
- **The six remaining timeout values are re-sized, not trusted.** `004` deletes `hooks-node-tests.yml`, which removes the seventh line, and raises `opencode-plugin-tests.yml` to 40. The six that survive are `opencode-dual-version.yml:74,172`, `deep-loop-runtime.yml:36`, `opencode-plugin-tests.yml:54`, `skill-advisor-stress.yml:43` and `sk-doc-rename-harness.yml:31`. Each is replaced by its table's final value whether or not it differs, so the tree and the table cannot disagree; the table records the old and the new value so a reader can see the comparison happened.
- **The permissions pass is two shapes, not one.** Eleven files gain a workflow-level block above `jobs:`; `dependabot-auto-merge.yml` gains one and simultaneously loses the writes it carried, so its block is `contents: read` and the writes reappear on the merge job. `trigger-index-rebuild.yml` keeps `permissions: {}` at `:12`, because an empty block is an explicit declaration and the review rejected counting it as absent (`final-review.md:136`).
- **The Dependabot split keeps the check name.** `Auto-merge Dependabot security patch updates` stays on the job that merges, and the new metadata job takes a name of its own. Only `message-contract.yml`'s context is required by the active ruleset, so a new name changes no merge condition. The write job runs `gh pr merge` and no repository code, which is the same split `trigger-index-rebuild.yml` already uses.
- **Timeouts are sized on job time, not run wall time.** A run's wall clock includes the wait for a runner and the gaps between jobs; `timeout-minutes` counts job execution only (`final-review.md:28-33`). The sample is therefore `gh run view <id> --json jobs`, and the p50 and p100 are computed over each job's own `startedAt` to `completedAt`.
- **Thin samples are marked, not guessed.** `opencode-dual-version` had 7 runs, `routing-registry-drift` 6, `deep-loop-runtime` 5, `sk-doc-rename-harness` 2 and `sk-code-script-tests` 2 in the 001 window (`001-research/scratch/ci-run-data/summary.md`). A job with fewer than 5 successful samples is sized from what it has and marked `thin`; a job with none takes the floor and is marked `no-sample`. A value copied from a sibling job is the one outcome the review's acceptance cannot detect and this plan forbids.
- **The existing timeout lines are re-sized, not trusted.** Six of the seven survive `004` (`opencode-dual-version.yml:74,172`, `deep-loop-runtime.yml:36`, `opencode-plugin-tests.yml:54` raised to 40 by `004`, `skill-advisor-stress.yml:43`, `sk-doc-rename-harness.yml:31`). Each is replaced by its row's final value; the table records the old and the new number so a reader can see the comparison happened.
- **The message-contract switch exists and must not be used.** R26's change line puts the switch on every job except Dependabot's two, and `research.md:189` says never disable message-contract while its ruleset context is required. Both are satisfied by adding the `SKILLED_CI_MESSAGES` line and documenting the prohibition in the README section, which is where a clone reads it. The alternative, no switch on that job, is rejected because it makes the group list inconsistent and leaves a fork with no way to see the variable exists.
- **No ephemeral ids in code.** No R-id, D-id or phase number goes into a workflow comment, a step name, a job name, a README sentence or a commit message. The ids live in these spec documents; a code comment carries the durable reason, such as why the merge job holds the write scope.
- **The numbers, and where they come from.** 33 files and 44 jobs today, parsed from the tree. 27 workflows without a timeout and 7 lines in 6 files, matching `final-review.md:33`. 21 files with a `permissions:` block and 12 without, matching `research.md:134`. After the default path through `003`, `004` and `005` (D5 approved, D4 drop-only) the tree is 32 files and 43 jobs before the Dependabot split; the split adds the metadata job, so the phase ends at 44 jobs, 38 gain a timeout, 6 existing values are compared, 42 jobs gain a switch, 2 do not, and 3 of the 42 are ANDed. The group counts are FRESHNESS 9 files and 13 jobs, TESTS 16 and 22, REVIEW 3 and 3, REPORTS 2 and 3, MESSAGES 1 and 1.
- **A stale line is not a stale change.** `003` adds a `concurrency:` block above `jobs:` in about 30 files, `004` rewrites provisioning steps and `005` may add one. Every task names the job by its `name:` and the file, and re-reads before editing. Locate the quoted text; never delete a range you have not read.
- **`hooks-node-tests.yml` is the one file whose existence is not fixed.** `004`'s D5 default approves the hook-and-plugin merge, which deletes the file and renames `opencode-plugin-tests.yml`'s job to `plugin-and-hook-tests` with `timeout-minutes: 40`. T003 records which world the phase is in, T042 sizes the merged job by position rather than by name, and T059 has one exact outcome for each world. A rejected D5 adds one file and one job to every count in this plan.
- **The rule packet keeps its parameter.** `006`'s `job-shape-rules.md` states the formula as `max(<floor>, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes))` and names 10 minutes as the default. This phase records the operator's floor in `scratch/decisions.md` and never edits the packet: the packet is the standard, and a standard that hard-codes one repository's answer cannot describe the next one. ADR-009 records the choice.
- **The 40-run read is about 1,280 `gh run view` calls.** It is the largest cost in the phase and the reason the sampling task batches per workflow and keeps the JSON: a second sizing pass must not re-spend it.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The job inventory: every `(file, job)` pair, its timeout, its `if:` and its group | `python3 -c "import glob, yaml; print([(f, j, v.get('timeout-minutes'), v.get('if')) for f in glob.glob('.github/workflows/*.yml') for j, v in yaml.safe_load(open(f))['jobs'].items()])"` |
| Unit | The sizing arithmetic: `max(floor, ceil(3 x p50), ceil(2 x p100))` and the 50% rule, recomputed from the sample JSON | `node scratch/r24/size-timeouts.mjs` and a re-read of `scratch/r24/timeouts.md` |
| Integration | `check-gate-inputs.sh` after each of the three passes | `bash .github/scripts/check-gate-inputs.sh` |
| Integration | YAML validity of every workflow after every pass | `python3 -c "import yaml, glob; [yaml.safe_load(open(f)) for f in glob.glob('.github/workflows/*.yml')]"` |
| Negative | The AND rule: remove one parenthesis or replace the trailer test, and the parse must fail | A temporary copy of `trigger-index-rebuild.yml` under `scratch/`, asserted against the guard text |
| Manual | The fork probe: `SKILLED_CI_REPORTS=off`, dispatch, read the skipped job, delete the variable, dispatch again | `gh variable set/delete`, `gh workflow run`, `gh run view --json jobs` |
| Manual | The next Dependabot pull request still auto-merges | `gh pr list --author 'app/dependabot'`, `gh run list --workflow dependabot-auto-merge.yml` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-trigger-and-job-hygiene` | Internal | Pending | The job inventory and every line anchor in this plan are provisional; the tasks re-derive both |
| `004-setup-caching-provisioning` | Internal | Pending | The workflow count (32 or 33) and one job's timeout depend on D5; the durations depend on R14 |
| `005-slow-and-failing-tests` | Internal | Pending | `deep-loop-runtime` and `spec-kit-check` durations are unsettled; sampling before it lands sizes the old shape |
| `006-sk-code-ci-surface` | Internal | Pending | The rule text this phase applies does not exist; the formula and shape are still fixed by the review |
| `002-rebuild-fanout-removal` baseline | Internal | Yellow until 002 lands | The saving arithmetic is unanchored; the phase's own criteria do not depend on it |
| Operator decision D6 | Internal | Yellow until answered | No timeout may be written; the 10-minute floor is planned |
| `gh` with `repo` and `actions` scopes | External | Green | No sample and no probe; the phase cannot close |
| A fork or throwaway test repository | External | Yellow | R26's behavioural proof cannot run; AC-008 stays `Unmet` |
| `009-doctor-ci-review-wiring` | Internal | Blocked on this phase | It reads the six variable names; a rename here breaks its report |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A job is killed by its timeout, the gate-input check fails on a shape it cannot read, the fork probe shows a job that does not run with every variable unset, or the Dependabot workflow stops merging.
- **Procedure**: Revert the commit for the concern that failed. The phase is committed per concern (permissions, the split, each workflow's timeouts, the switch pass, the README section), so a revert names one commit and leaves the other passes in place. Deleting a repository variable on the fork is the probe's own cleanup.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (inventory, D6, groups, fork) ──► R25 permissions + split ──► R24 sample + size ──► R26 switch + README ──► Verify (gate, parse, fork probe)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | `003`, `004`, `005`, D6 | R25, R24, R26 |
| R25 permissions and split | Setup | R24, because the split creates a job R24 must size |
| R24 timeouts | R25, the post-`005` sample | R26, because a switch line above `runs-on:` moves the line the timeout sits on |
| R26 switches and README | R24, `006`'s rule text | Verify, `008-consolidation-decision`, `009-doctor-ci-review-wiring` |
| Verify | All three passes, a fork | `008`, `009` |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | ~1 hour: the inventory, D6, the group assignment and the constraint record |
| R25 permissions and split | Med | ~1.5 hours: 12 headers, one job graph, the gate, and the next Dependabot pull request |
| R24 timeouts | Med | ~3 hours: 1,280 run reads, the sizing script, 38 values and the comparison of 6 existing ones |
| R26 switches and README | Med | ~2 hours: 42 lines, 3 ANDed conditions, one README section, the gate |
| Verify | Low | ~1 hour: the parse, the negative AND test, the fork probe and the phase record |
| **Total** | | **~8-9 hours, plus the wait for a Dependabot pull request** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes) - not applicable, no data changes; the sample JSON under `scratch/` is the record
- [ ] Feature flag configured - the switch is the flag, and unset is the shipped state
- [ ] Monitoring alerts set - a job that exceeds its timeout appears as `cancelled` with `exceeded the maximum execution time`; the phase reads the next 24 h of runs for it

### Rollback Procedure
1. Revert the commit for the failing concern, not the whole phase.
2. Confirm the gate prints `RESULT: PASSED` and every workflow parses after the revert.
3. Re-run one dispatch of the affected workflow and confirm the job reaches its previous conclusion.
4. No stakeholder notice is needed; nothing user-facing changed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. The sample JSON and the sizing table stay as the record of what was measured; a revert is visible as a divergence from them.
<!-- /ANCHOR:enhanced-rollback -->

---


<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                    D6 (operator)          a fork
                          │                  │
                          ▼                  │
┌─────────────┐     ┌─────────────┐     ┌────┴────────┐     ┌─────────────┐
│   Setup     │────►│     R25     │────►│     R24     │────►│     R26     │
│ T001-T006   │     │ T007-T023   │     │ T024-T061   │     │ T062-T098   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                   │
                                                            ┌──────▼──────┐
                                                            │   Verify    │
                                                            │ T099-T102   │
                                                            └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup records | `003`, `004`, `005`, `006` landed; D6 | `scratch/decisions.md`, `inventory.md`, `switch-groups.md`, `constraints.md`, `phase-baseline.md` | Every edit task |
| Permissions pass | Setup | `permissions:` on 12 files; the `metadata` / `auto-merge` split | R24, because the split creates a job that must be sized |
| Dependabot proof | Permissions pass; a live Dependabot pull request | `scratch/r25-dependabot.md` | AC-002 |
| Sample, script and table | Setup; `gh` with `repo` and `actions` | `scratch/r24/runs/`, `jobs/`, `size-timeouts.mjs`, `timeouts.md` | Every timeout edit |
| Timeout pass | Permissions pass, table | `timeout-minutes` on 44 jobs | R26's proof, Verify |
| Switch pass | Timeout pass, Setup's group assignment | 42 switch lines, 3 ANDed conditions, the README section | Verify, `008`, `009` |
| Verify | Every pass; a fork | `scratch/r26-probe.md`, `scratch/phase-result.md` | Closure, `008-consolidation-decision`, `009-doctor-ci-review-wiring` |
<!-- /ANCHOR:dependency-graph -->

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T003 - confirm the dependency phases and record the final inventory** - 1 hour - CRITICAL, because every file count and job count below it is provisional until `hooks-node-tests.yml` is gone and the merged job is named.
2. **T024 to T026 - the 40-run sample and the sizing table** - 3 hours - CRITICAL, because no timeout value exists until the table does, and the 1,280 `gh run view` calls are the phase's longest single step.
3. **T027 to T061 - the timeout pass** - 2 hours - CRITICAL, because R26 inserts a line above `runs-on:` in the same blocks and the order keeps both quoted anchors valid.
4. **T062 to T098 - the switch pass, the three ANDed conditions and the README** - 2 hours - CRITICAL, because the fork probe and the closure both read them.
5. **T099 to T102 - the fork probe, the 24 h kill read, the gates and the closure commit** - 1 hour, plus the wait for a Dependabot pull request - CRITICAL, because a green gate is the only closure evidence.

**Total Critical Path**: 9 hours, plus operator latency on D6 and the wait for a Dependabot pull request.

**Parallel Opportunities**:
- T004 (the group assignment) and T005 (the constraints record) can run beside T002 once T003 has read the tree.
- T022 (the Dependabot proof) can run at any point after T019, in parallel with the whole R24 sample.
- T095 (the README section) can be drafted from T004's table before the last switch lands, because it reads the assignment rather than the tree.
- T099 (the fork probe) can run as soon as T062 to T094 are on a branch; it needs no timeout value.
<!-- /ANCHOR:critical-path -->

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup recorded | T001 to T006 done; `scratch/decisions.md` carries one `D6=` line and one `PROBE_FORK=` line, `inventory.md` names every `(file, job)` pair, `switch-groups.md` names five groups with counts, `constraints.md` quotes the four job conditions, and `phase-baseline.md` holds the pre-phase tree counts | Phase 1 exit |
| M2 | Permissions green | T007 to T023 done; `grep -L 'permissions:' .github/workflows/*.yml` prints nothing, `dependabot-auto-merge.yml` parses as two jobs with one `contents: write` line, `check-gate-inputs.sh` prints `RESULT: PASSED`, and the Dependabot proof is recorded or marked pending | Phase 2 exit |
| M3 | Timeouts green | T024 to T061 done; every job parses with a `timeout-minutes`, `size-timeouts.mjs --assert` prints `values match formula: ok` and `50% rule: ok`, and every thin or absent sample is marked | Phase 3 exit |
| M4 | Switches green | T062 to T098 done; 42 jobs carry the switch, the two Dependabot jobs do not, the three original conditions survive as conjuncts, the README section exists, and the mutant copy is rejected | Phase 4 exit |
| M5 | Closed | T099 to T102 done; the fork probe records `off: skipped` and `unset: ran`, the 24 h read records `timeout kills: 0`, `check-gate-inputs.sh` and `validate.sh --strict` both print `RESULT: PASSED`, `scratch/phase-result.md` carries every output, and T102 commits the closure records | Phase 5 exit |
<!-- /ANCHOR:milestones -->

## L3: ARCHITECTURE DECISION SUMMARY

The formal records, with context, constraints, alternatives, five checks and the tasks each choice gates, are `decision-record.md` ADR-001 to ADR-010. This table is the one-screen index.

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | The timeout floor is D6's answer, 10 minutes by default | A floor is a policy, not a measurement; the operator owns it and the phase applies it uniformly |
| ADR-002 | Build order is R25, then R24, then R26 | The split creates a job, sizing must see it, and the switch must not sit above a line the timeout pass rewrites |
| ADR-003 | Timeouts are sized on job execution time, never run wall time | `timeout-minutes` counts execution; run wall time includes queueing and would overstate every value |
| ADR-004 | The formula is `max(floor, ceil(3 x p50), ceil(2 x p100))`, with `thin` and `no-sample` markers | A single percentile is fooled by one slow run; the markers keep a two-run sample from reading as a measurement |
| ADR-005 | The Dependabot split keeps the existing check name on the merge job | Only `message-contract.yml`'s context is required, and a renamed check would break a bookmark for no gain |
| ADR-006 | The switch is ANDed onto an existing condition, both sides parenthesised | A replacement would silently delete the rebuild loop guard |
| ADR-007 | `SKILLED_CI_MESSAGES` exists and is documented as never-off | The group list stays complete, and a fork with no ruleset can still see the variable exists |
| ADR-008 | The group taxonomy is the README push-versus-pull-request table | One taxonomy, already maintained, rather than a second list that drifts |
| ADR-009 | `006`'s rule data keeps `max(<floor>, ...)`; this phase records the value | A standard that hard-codes one repository's floor cannot describe the next repository |
| ADR-010 | The phase commits per concern, not as one commit | A killed timeout must be revertible without reverting the permissions and the switch |

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read `tasks.md` and confirm the task id, its file, its quoted anchor and its line number.
- [ ] Re-read the file the task edits; confirm the quoted anchor is still on the named line and belongs to the job the task names.
- [ ] Confirm the task is not `[B]`; if it is, record the blocker and stop before editing.
- [ ] Confirm the value comes from `scratch/r24/timeouts.md`, never from a sibling job and never from this plan.

### Execution Rules
| Rule | Description |
|------|-------------|
| TASK-SEQ | Run T001 to T102 in order. The only `[B]` task is T003, and its blocker is another phase. |
| TASK-SCOPE | Write only `.github/workflows/*.yml`, `.github/workflows/README.md` and this phase's `scratch/`. Every other path is read-only. |
| TASK-PROOF | Run the task's check and read both its output and its exit status before marking the task `[x]`. |
| TASK-ANCHOR | Locate the quoted text. A moved line is not a changed edit; an absent anchor is a stop, not a nearby edit. |
| TASK-COMMENT | No workflow comment, step name, job name or README sentence added by this phase carries an R-id, a D-id or a phase number. |

### Status Reporting Format
After each task: `Task T### complete. Files: <paths>. Proof: <command> -> <observed output/exit>.` At a phase boundary, report the task range, the files changed and the gate that passed.

### Blocked Task Protocol
If a task cannot run, stop and record the blocker in `scratch/phase-result.md` with the task id, the command that failed and its output. Do not substitute a different file, a different value or a different command. A `[B]` task stays blocked until its dependency's proof exists; a failed gate is repaired, not waived.

