---
title: "Feature Specification: Phase 3: trigger-and-job-hygiene"
description: "Thirty PR-triggered workflows start a fresh run for every push and never cancel the superseded one; command-tree-parity and agent-mirror-sync re-run on every commit although a path filter could name their inputs; dispatch-enforcement-guard runs dispatch-audit.test.mjs twice per run; two report-only workflows suppress their own failures twice; three workflows pay for full git history they never read; and nothing records which CI jobs duplicate a pre-commit hook. This phase fixes all of it with concurrency groups, path filters, one deleted duplicate step, a removed suppression layer and shallower checkouts."
trigger_phrases:
  - "trigger and job hygiene"
  - "phase 3 trigger and job hygiene"
  - "workflow concurrency groups cancel in progress"
  - "command tree parity path filter"
  - "ci path filters and shallow checkout"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: trigger-and-job-hygiene

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Thirty of the repository's 33 workflows answer a pull request, and 32 of the 33 declare no `concurrency:` group, so two pushes to one pull request leave two full runs racing and the older verdict is paid for and then discarded. Two workflows re-check the whole tree on every commit although a path filter could name their inputs, one workflow runs its dispatch audit twice per run, two report-only workflows suppress their own failures twice, and three check out full history no checker reads. This phase adds the concurrency block to the 30 PR-triggered workflows other than the Dependabot one, filters `command-tree-parity` and `agent-mirror-sync` to the files their checkers read, deletes the duplicate dispatch-audit step, removes one suppression layer from each report-only workflow, checks out at the depth each job uses, and records which CI jobs repeat a pre-commit gate.

**Key Decisions**: D2 keeps `cancel-in-progress` to pull requests; D3 approves the `command-tree-parity` filter; D4 keeps the guard's two jobs and deletes only the duplicate step; D7 sets `deep-loop-runtime` to `fetch-depth: 2`; D10 skips the `changed-packet-validation` filter; every `.skilled/` filter entry carries its `.opencode/` twin.

**Critical Dependencies**: the `002-rebuild-fanout-removal` 24 h baseline, five operator answers, and a `gh` client with `repo` and `actions` scopes for the trigger probes and the phase delta.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-10-23 |
| **Branch** | `main (work in any checkout level with origin/main; push with git push origin HEAD:main)` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 9 |
| **Predecessor** | 002-rebuild-fanout-removal |
| **Successor** | 004-setup-caching-provisioning |
| **Handoff Criteria** | All seventeen acceptance criteria `Met`; `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`; all 33 workflows parse as YAML; every newly filtered workflow has one recorded positive and one negative trigger probe; the seven hooks vitest suites appear in a run log; and `scratch/phase-result.md` records the phase delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the CI efficiency implementation phases specification. It carries R3, R4, R5, R6, R7, R8, R9, R10 and R11 of `001-research/research/synthesis-reviews/final-review.md` (`:223-325`) and the phase-003 gate in that review's phase plan (`:552-560`).

**Scope Boundary**: Workflow trigger and job shape only. Thirty workflows gain a concurrency block, two gain a path filter and one gains filter entries, one loses a duplicate step, two lose a suppression layer, three change their checkout depth, and one README table plus one inventory document record the result. No check changes what it verifies, no new composite action, no cache, no timeout, no permission block, no on/off switch.

**Dependencies**:
- `002-rebuild-fanout-removal` for the baseline. This phase measures every saving against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md`, and R3's main-branch number collapses from 817 to about 89 reclaimable wall-minutes per window once R1 lands (`final-review.md:76-79`).
- Operator decisions D2, D3, D4, D7 and D10 (`final-review.md:615-623`), each planned as its own pre-build task.
- `gh` authenticated with `repo` and `actions` scopes, for the trigger probes, the job-timing samples and the phase delta.
- A checkout whose workflows can be pushed to a test branch, because four of the criteria are CI probes rather than local commands.
- `007-workflow-hygiene-on-off-control` depends on this phase, because its switch `if:` and its per-job timeouts need this phase's final job shapes, and `008-consolidation-decision` follows through it. `004-setup-caching-provisioning` and `005-slow-and-failing-tests` depend only on `002-rebuild-fanout-removal` and can run alongside this phase.

**Deliverables**:
- A `concurrency:` block on the 30 PR-triggered workflows other than `dependabot-auto-merge.yml`.
- A `paths:` filter on `command-tree-parity.yml` and on `agent-mirror-sync.yml`, plus guard and workflow entries on both `skill-doc-frontmatter.yml` filter lists.
- One deleted duplicate step in `dispatch-enforcement-guard.yml`; the whole-tree vitest run and the fail-closed rule-suite guard stay.
- One suppression layer removed from `advisory-checks.yml` and from `strict-pass-freshness-report.yml`.
- Default-depth checkout on `rule-canary-sync.yml` and `repo-rules-corpus.yml`, depth 2 on `deep-loop-runtime.yml`.
- `.github/workflows/README.md`'s push/PR table matching the YAML, and `scratch/pre-commit-inventory.md` naming every pre-commit checker and whether CI duplicates it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Thirty-one workflows answer a pull request, and 32 of the repository's 33 workflows have no `concurrency:` group (`research.md:101`), so two pushes to one PR leave two full runs racing and the older verdict is thrown away only after it has been paid for. `command-tree-parity.yml:47-50` says in so many words that it is unfiltered on purpose, and `agent-mirror-sync.yml` has no filter at all, so both re-check the whole tree on a documentation-only change. `dispatch-enforcement-guard.yml` runs `dispatch-audit.test.mjs` twice per run, once explicitly at `:50` and again through the whole-tree vitest run at `:67`, and both jobs pay their own checkout and `npm --prefix .skilled ci` (`:44`, `:61`). `advisory-checks.yml` pairs `continue-on-error: true` with a second `|| true` or `|| echo` on the same command (`:38`, `:52`, `:68`), and `strict-pass-freshness-report.yml` does the same at `:165` and `:172`, so a failing step reports success twice over. Three workflows check out full history they do not need (`rule-canary-sync.yml:15`, `repo-rules-corpus.yml:33`, `deep-loop-runtime.yml` at `:42` before the concurrency block, `:46` after it), and no document records which CI jobs merely repeat a pre-commit hook.

### Purpose
Make every workflow run only when its inputs change, cancel the run it supersedes, pay for one copy of the work it does, and report a failure as a failure, for about 160-240 runner-minutes a day after R1 plus an unmeasured PR-side wall-clock gain.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R3: a `concurrency:` block on the 30 PR-triggered workflows other than `dependabot-auto-merge.yml`, with `cancel-in-progress` on pull requests and D2=pr-only (2026-10-23) leaving main's runs alone.
- R4: a `paths:` filter on both events of `command-tree-parity.yml`, naming every input its four checkers read, and a rewrite of the comment at `:98-102` (planned `:47-50`, moved by the filters).
- R5: D10=skip (2026-10-23) leaves `changed-packet-validation.yml` unfiltered, with the skip recorded rather than filtered.
- R6: removing the duplicate `dispatch-audit.test.mjs` step from `dispatch-enforcement-guard.yml` while keeping the whole-tree vitest run and the fail-closed rule-suite guard.
- R7: dropping the inner suppression in `advisory-checks.yml:38,52,68` and `strict-pass-freshness-report.yml:172`, keeping `continue-on-error` in both.
- R8: default-depth checkout on `rule-canary-sync.yml` and `repo-rules-corpus.yml`, and `fetch-depth: 2` on `deep-loop-runtime.yml` under D7=depth-2 (2026-10-23).
- R9: a `paths:` filter on `agent-mirror-sync.yml` for the four agent roots its checker reads, the checker and its verifier at both roots, and the spec-kit package it builds, with `comment-hygiene.yml` left unfiltered.
- R10: `check-skill-doc-frontmatter.sh` at both roots and `.github/workflows/skill-doc-frontmatter.yml` added to both filter lists in `skill-doc-frontmatter.yml`.
- R11: `scratch/pre-commit-inventory.md`, one row per pre-commit gate key, naming the workflow that duplicates it and whether to keep or drop it.
- The README push/PR table and the before/after numbers in `scratch/`.

### Out of Scope
- Any change to what a check verifies, its assertions, its fixtures or its exit codes beyond the suppression removed here.
- Caching, the composite setup action, npm dedupe and the hooks-node-tests merge: `004-setup-caching-provisioning` owns R12 to R18.
- `fileParallelism`, sharding and the real-failure root causes: `005-slow-and-failing-tests` owns R19 to R21.
- Timeouts, least-privilege permissions, the on/off switch and the dependabot job split: `007-workflow-hygiene-on-off-control` owns R24 to R26.
- `trigger-index-rebuild.yml`: it is not PR-triggered and keeps its own group at `:21-23`.
- `strict-pass-freshness-report.yml` concurrency: it runs on a schedule and by hand, never on a pull request.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/advisory-checks.yml` and 29 other PR-triggered workflows | Modify | Add the `concurrency:` block above `jobs:` |
| `.github/workflows/command-tree-parity.yml` | Modify | Add `paths:` to both events after `:5-8`; rewrite the comment at `:98-102` |
| `.github/workflows/changed-packet-validation.yml` | Unchanged under D10=skip (2026-10-23) | Add `paths:` to both events after `:4-7` only if a later phase flips the choice |
| `.github/workflows/dispatch-enforcement-guard.yml` | Modify | Delete the `Run the dispatch audit core suite` step at `:41-50`; keep `:22-40` and `:52-67` |
| `.github/workflows/advisory-checks.yml` | Modify | Replace `\|\| true` at `:38` and `\|\| echo` at `:52,68` with an explicit failing branch |
| `.github/workflows/strict-pass-freshness-report.yml` | Modify | Capture the status at `:172` and exit with it after printing the report; keep `continue-on-error` at `:165` |
| `.github/workflows/rule-canary-sync.yml` | Modify | Delete the `with: fetch-depth: 0` block at `:14-15` |
| `.github/workflows/repo-rules-corpus.yml` | Modify | Delete the `with: fetch-depth: 0` block at `:32-33` |
| `.github/workflows/deep-loop-runtime.yml` | Modify | `fetch-depth: 0` at `:42` before the concurrency block becomes `fetch-depth: 2` at `:46` after it |
| `.github/workflows/agent-mirror-sync.yml` | Modify | Add `paths:` under `pull_request:` at `:3-4` |
| `.github/workflows/skill-doc-frontmatter.yml` | Modify | Add the guard at both roots and the workflow file to the lists at `:5-14` and `:17-23` |
| `.github/workflows/README.md` | Modify | Move `command-tree-parity.yml` from the `:66` row to the `:69` row; amend the `:71` row for `agent-mirror-sync.yml` |
| `scratch/pre-commit-inventory.md` | Create | R11's list: 12 pre-commit gate keys against every workflow step |
| `scratch/phase-baseline.md`, `scratch/phase-result.md` | Create | The 002 baseline rows this phase touches, and the measured after numbers |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R3.** All 30 PR-triggered workflows except `dependabot-auto-merge.yml` carry `concurrency: group: ${{ github.workflow }}-${{ github.event.pull_request.number \|\| github.ref }}` and `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` above `jobs:`; `trigger-index-rebuild.yml` keeps its own group at `:21-23`, and D2=pr-only (2026-10-23) leaves `cancel-in-progress` off main |
| REQ-002 | **R4.** `command-tree-parity.yml` carries a `paths:` list on both `pull_request:` and `push:`, naming every input `validate-command-tree-parity.sh`, `sync-runtime-mirrors.cjs`, `sync-skills-hermes.cjs` and `sync-prompts-hermes.cjs` read, with an `.opencode/` twin for every `.skilled/` entry, and the comment at `:98-102` describes the filter instead of claiming there is none |
| REQ-003 | **R5.** D10=skip (2026-10-23) is recorded in `plan.md` with its ~10 runner-min/day figure, so no filter is added; the alternative adds `paths:` (`specs/**`, `.skilled/skills/system-spec-kit/**`, `.opencode/skills/system-spec-kit/**`, the workflow file) to both events |
| REQ-004 | **R6.** `dispatch-enforcement-guard.yml` runs `dispatch-audit.test.mjs` once per run, not twice: either the two jobs merge or the explicit step at `:41-50` is deleted. The whole-tree vitest run at `:67` keeps no project or path filter, and the fail-closed guard at `:31-35` stays byte-identical |
| REQ-005 | **R7.** `advisory-checks.yml:38,52,68` and `strict-pass-freshness-report.yml:172` no longer suppress a failing command, while `continue-on-error: true` stays on the same steps (`advisory-checks.yml:27,41,55`, `strict-pass-freshness-report.yml:165`), so the step prints an error line and a failure annotation while the job reports `success` (the REST API reports a `continue-on-error` step as `success`, per the 2026-10-24 operator ruling in `decision-record.md`) |
| REQ-006 | **R8.** `rule-canary-sync.yml` and `repo-rules-corpus.yml` check out at the default depth, and `deep-loop-runtime.yml` reads `fetch-depth: 2` at `:46` after the concurrency block (the original position was `:42` before it) under D7=depth-2 (2026-10-23); the seven workflows that do read history keep `fetch-depth: 0` |
| REQ-007 | **R9.** `agent-mirror-sync.yml` carries a `paths:` list under `pull_request:` naming `.opencode/agents/**`, `.skilled/agents/**`, `.claude/agents/**`, `.codex/agents/**`, `check-agent-mirror-sync.cjs` at both roots and the workflow file; `comment-hygiene.yml` stays unfiltered |
| REQ-008 | **R10.** Both filter lists in `skill-doc-frontmatter.yml` name `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh`, its `.opencode/` twin, and `.github/workflows/skill-doc-frontmatter.yml` |
| REQ-009 | **R11.** `scratch/pre-commit-inventory.md` lists every gate key in `.skilled/scripts/git-hooks/pre-commit` against every workflow step, names the workflow that duplicates each one, and says `keep` or `drop` with a reason |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` with `failures=0` and `twin_pairs` no lower than the observed 311, and all 33 workflow files parse as YAML |
| REQ-011 | `.github/workflows/README.md`'s push/PR table matches the YAML: `command-tree-parity.yml` appears in the path-filtered row, `agent-mirror-sync.yml`'s row states its filter, and no row claims a filter the YAML lacks |
| REQ-012 | `scratch/phase-result.md` records the measured delta against `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` for every workflow this phase touches, including the R6 re-measurement |
| REQ-013 | No R-id, D-id or phase number appears in any workflow comment, step name, filter entry, README row or inventory row: `git diff HEAD~6...HEAD \| grep -nE '\bR[0-9]+\b\|\bD[0-9]+\b\|[Pp]hase 0[0-9]'` prints nothing |

R3's saving is unmeasured on pull requests, because the measured window held no PR runs; on main it is 817 reclaimable wall-minutes per window standalone and about 89 after R1, and D2=pr-only (2026-10-23) leaves those main-branch runs uncancelled (`final-review.md:231-234`). R4 is ~265 runner-min/day standalone and ~123 after R1, because 30 of 38 human pushes skip it. R5 is ~10 after R1 and skipped under D10=skip. R6's merged shape is inferred at ~75-150 standalone and 39-78 after R1; the D4=drop-step shape is smaller and is re-measured rather than asserted. R8 is ~39 after R1 plus about 20 s of wall per job. R7, R10 and R11 save 0 minutes: they restore a signal and record a fact.

### Per-R-id detail

Each recommendation gets four facts: what must be true when it lands, the cases that would make it wrong, the risk that survives those cases with its mitigation, and how to undo it.

#### R3 — Concurrency groups with cancel-in-progress on pull requests (REQ-001)

- **Functional requirement**: the 30 PR-triggered workflows other than `dependabot-auto-merge.yml` carry `concurrency:` with `group: ${{ github.workflow }}-${{ github.event.pull_request.number || github.ref }}` and `cancel-in-progress: ${{ github.event_name == 'pull_request' }}` above `jobs:`. `trigger-index-rebuild.yml` keeps its own group at `:21-23`, and D2's alternative replaces the expression with `true`.
- **Edge cases**: a third push while one run is in progress and another is pending cancels the pending run, so the middle SHA gets no verdict and the newest head still reports. `workflow_dispatch` is grouped by `github.ref`, so two hand-runs on one branch serialize and neither is cancelled. Two workflows never share a slot, because `github.workflow` is part of the key.
- **Risk and mitigation**: a cancelled PR run could leave a required context unset. Only PR runs cancel, every new head starts its own run, and `message-contract` is the only required context, so a cancelled run belongs to an older SHA. The R3 probe records the observed state instead of assuming it.
- **Rollback**: delete the three `concurrency:` lines from the affected workflow. No state is created, and the next push behaves as it did before the edit.

#### R4 — A real path filter on command-tree-parity (REQ-002)

- **Functional requirement**: `command-tree-parity.yml` carries 23 `paths:` entries on both `pull_request:` and `push:`, the comment at `:98-102` describes the filter, and `check-gate-inputs.sh` prints `RESULT: PASSED`. The entries name the command trees, the agent trees, `SKILL.md`, `.hermes/**`, the spec-kit package, the four hook configs and their four hook mirrors, and the workflow file.
- **Edge cases**: a `specs/**`-only change starts no run; a nested `SKILL.md` change starts both jobs; a change to `.hermes/**` starts a run even though that tree is generated, because a hand edit there would otherwise go uncompared. A `.skilled/` entry with no `.opencode/` twin fails the gate before merge rather than at run time.
- **Risk and mitigation**: a filter that misses an input lets a stale Hermes copy or a broken mirror land green. The list is derived from a full read of `validate-command-tree-parity.sh`, `sync-runtime-mirrors.cjs`, `sync-skills-hermes.cjs` and `sync-prompts-hermes.cjs`, and both trigger probes are recorded.
- **Rollback**: delete both `paths:` blocks and restore the four comment lines at `:98-102`. The workflow returns to running on every push and pull request.

#### R5 — An optional path filter on changed-packet-validation (REQ-003)

- **Functional requirement**: under the default, no YAML edit and a recorded skip with its ~10 runner-min/day figure. Under the alternative, four `paths:` entries on both events (`specs/**`, `.skilled/skills/system-spec-kit/**`, `.opencode/skills/system-spec-kit/**`, `.github/workflows/changed-packet-validation.yml`) and a passing gate.
- **Edge cases**: under the default, a push that touches only `.github/` still runs the workflow and finds no changed packet, which is the pre-phase behaviour. Under the filter, a change to a spec-kit validator rule still runs it through the package entry.
- **Risk and mitigation**: the saving is about 10 runner-min/day because 33 of 38 human pushes touch `specs/**`, so the filter is not worth its risk; the recorded decision keeps the default explicit rather than accidental.
- **Rollback**: delete the two `paths:` blocks. Nothing else changes.

#### R6 — dispatch-enforcement-guard keeps the whole-tree vitest run and drops duplicate work (REQ-004)

- **Functional requirement**: `dispatch-audit.test.mjs` runs once per run, not twice. Under the default, the two jobs stay and the explicit step at `:41-50` is deleted; the whole-tree vitest run at `:67` keeps no project or path filter, and the fail-closed guard at `:31-35` stays byte-identical.
- **Edge cases**: the whole-tree run collects `dispatch-audit.test.mjs` through `.skilled/hooks/vitest.config.ts:38`, so deleting the explicit step keeps exactly one execution. `dispatch-rule-checks.test.mjs` is a `node --test` file the vitest config excludes, so it keeps its own step. A merge answer changes both check names and is not the default.
- **Risk and mitigation**: this is a protected guard (`research.md:187`). The default changes no check name, keeps the fail-closed guard, and a branch that deletes the rule suite proves the job still fails.
- **Rollback**: restore the deleted step from git. The two jobs and their installs return.

#### R7 — Remove the double suppression in the report-only workflows (REQ-005)

- **Functional requirement**: `advisory-checks.yml:38,52,68` and `strict-pass-freshness-report.yml:172` no longer suppress a failing command, and `continue-on-error: true` stays on the same steps (`advisory-checks.yml:27,41,55`, `strict-pass-freshness-report.yml:165`), so the step prints an error line and a failure annotation while the job reports `success` (the REST API reports a `continue-on-error` step as `success`, per the 2026-10-24 operator ruling in `decision-record.md`).
- **Edge cases**: the repair report must print before the step exits, so the status is captured and the exit follows `cat` and `rm`. The fix hints that lived in the `|| echo` branches move into the `::error::` line, so a reader still gets the repair instruction. A step that fails for a missing script keeps its existing fail-closed branch.
- **Risk and mitigation**: a red step under a green job alarms a reader who only looks at the run status. That is the point: the run page now shows which report failed, and the job stays green by design.
- **Rollback**: restore the suppressed command lines. The step returns to reporting success on a failure.

#### R8 — Shallow checkout where history is unread (REQ-006)

- **Functional requirement**: `rule-canary-sync.yml:14-15` and `repo-rules-corpus.yml:32-33` lose their `with: fetch-depth: 0` block, `deep-loop-runtime.yml` reads `fetch-depth: 2` at `:46` after the concurrency block (the original position was `:42` before it) under D7, and the seven workflows that do read history keep depth 0.
- **Edge cases**: a default-depth checkout still contains the full working tree, so a checker that only reads files is unaffected. `deep-loop-runtime` keeps depth 2 rather than 1 because its mode-event suites bind a run to a commit and its parent (`:38-39`). `comment-hygiene` and `agent-mirror-sync` diff against the PR base and keep depth 0.
- **Risk and mitigation**: a checker could shell out to git without saying so. Both checkers were read and match no `git`, `child_process`, `execFile` or `spawn`, and the probe compares each checkout step against its 002 baseline sample.
- **Rollback**: restore the `with:` block or the `fetch-depth: 0` value. The next run checks out full history again.

#### R9 — Path filters on the PR-only review-time checks (REQ-007)

- **Functional requirement**: `agent-mirror-sync.yml` carries 11 `paths:` entries under `pull_request:`: the four agent roots, the checker and its verifier at both roots, the spec-kit package at both roots, and the workflow file. `comment-hygiene.yml` stays unfiltered.
- **Edge cases**: a lib-only pull request runs, because the verifier is named at both roots; a specs-only pull request skips; `.cursor/agents` and `.devin/agents` are deliberately absent because this checker reads neither. `comment-hygiene` scans changed code files of any type, so no filter can name its inputs.
- **Risk and mitigation**: a missed input lets a mirror drift land green. The verifier and the built frontmatter parser are named, because a change to either breaks the check that exists to catch drift.
- **Rollback**: delete the `paths:` block. The workflow returns to running on every pull request.

#### R10 — skill-doc-frontmatter filters name their own guard and workflow (REQ-008)

- **Functional requirement**: both filter lists in `skill-doc-frontmatter.yml` name `.skilled/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh`, its `.opencode/` twin, and `.github/workflows/skill-doc-frontmatter.yml`.
- **Edge cases**: the guard path also appears once at `:34` as the `GUARD=` assignment, so the count check matches only list entries at six-space indent. The `*.md` entries stay in the PR list and out of the push list, because the push job is coverage mode and reads reference and asset docs only (`:41-45`).
- **Risk and mitigation**: before this change, a pull request that changed only the guard ran no job that used it. The new entries close that gap, and the guard-only probe proves it.
- **Rollback**: delete the six added entries, three per list. The previous filter returns.

#### R11 — Inventory CI jobs that duplicate pre-commit hooks (REQ-009)

- **Functional requirement**: `scratch/pre-commit-inventory.md` gives each of the 13 gate keys in `.skilled/scripts/git-hooks/pre-commit` one row with the checker path, the installed-hook line, the CI counterpart, a verdict of `keep CI`, `drop CI` or `local only`, and the reason for the verdict (the thirteenth key, `private-skill`, came with `7648ae8b56`; the 2026-10-24 amendment corrects the planned 12 keys and five columns).
- **Edge cases**: a gate with no CI counterpart is `local only`, never `drop CI`; `hook-flags` and `hook-trust` have none by design, because they configure and guard the hook itself. The 115-line compatibility helper at `.skilled/hooks/git/pre-commit` is not the installed hook and is not the source of the key list.
- **Risk and mitigation**: the inventory could be read as an action list. The document states that nothing in this phase acts on it, and each verdict carries its reason.
- **Rollback**: delete the file. It is a record, not state.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Two quick pushes to one test pull request leave the older run `cancelled` and the newer one reporting, and the required `message-contract` context still reports on the newest head.
- **SC-002**: `command-tree-parity.yml` runs both jobs on a pull request that changes one nested `SKILL.md`, runs neither on a `specs/**`-only pull request, and keeps `check-gate-inputs.sh` at `RESULT: PASSED` — worth ~265 runner-min/day standalone and ~123 after R1.
- **SC-003**: `dispatch-enforcement-guard.yml` runs each of the seven hooks vitest suites once, still fails when `dispatch-rule-checks.test.mjs` is deleted, and no longer pays two checkouts and two installs for one dispatch-audit run.
- **SC-004**: A deliberately broken input makes the affected step report `failure` in `advisory-checks.yml` and `strict-pass-freshness-report.yml` while each job still concludes `success`.
- **SC-005**: `rule-canary-sync.yml` and `repo-rules-corpus.yml` check out without `fetch-depth: 0`, `deep-loop-runtime.yml` checks out at depth 2, and `rule-canary-sync`'s job drops under 60 s so it bills one minute instead of two (inferred, ~39 runner-min/day after R1).
- **SC-006**: `agent-mirror-sync.yml` runs on an agent-file pull request and skips a `specs/**`-only one; `skill-doc-frontmatter.yml` runs on a pull request that touches only its own guard.
- **SC-007**: All 33 workflows parse, `check-gate-inputs.sh` prints `RESULT: PASSED`, and the README push/PR table matches the YAML row for row.
- **SC-008**: `scratch/pre-commit-inventory.md` names all 12 pre-commit gate keys and says keep or drop for each, so the next phase can act on it without re-deriving the list.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-rebuild-fanout-removal` and its `scratch/baseline-24h/summary.md` | Every "after R1" number is unanchored, and R3's main-branch figure stays at the standalone 817 wall-min | The phase does not start until the baseline exists; `scratch/phase-baseline.md` copies the rows this phase touches |
| Dependency | Operator decisions D2, D3, D4, D7, D10 | None; recorded 2026-10-23 (D2=pr-only, D3=approve, D4=drop-step, D7=depth-2, D10=skip) and T001 to T005 only verify `scratch/decisions.md` | The answers are fixed, so no file edit waits on the operator; each decision's alternative stays in `decision-record.md` for a later reopen |
| Dependency | `gh` with `repo` and `actions` scopes | No trigger probes, no job timings, no phase delta | Every probe records its command and output under `scratch/`; a missing scope is a blocker, not a workaround |
| Risk | R4's filter misses an input the parity checkers read, so a stale Hermes copy or a broken mirror lands green | Medium | The filter is derived from a full read of all four checkers, not from the review's summary, and both trigger probes are recorded |
| Risk | R3's group key also groups `push` runs on the same ref, and GitHub keeps one running plus one pending run per group, so a third push replaces the pending one | Medium | `cancel-in-progress` stays false on push under D2=pr-only (2026-10-23), so no running push is cancelled; the replacement behaviour is recorded in the edge cases and checked by the push half of the R3 probe. An operator who wants pushes left completely ungrouped can substitute `github.run_id` for `github.ref` in the fallback, which is a one-line change on the same 30 files |
| Risk | R6 touches a protected guard (`research.md:187`: its failure invalidates other workflows' inputs) | Medium | The default shape drops only the duplicate step, so no check name changes; the fail-closed guard stays, and a deleted-suite branch proves it still fails |
| Risk | R8 removes history a checker quietly needs | Low | Both checkers were read and shell out to no git command; `deep-loop-runtime` keeps depth 2 rather than 1 because its suites read the parent commit |
| Risk | The README table drifts from the YAML once two rows move | Low | The table is edited in the same commit, and the row-membership grep is an acceptance check |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The phase removes about 162 runner-min/day after R1 from R4 and R8 alone, plus R6's re-measured 0-78, against the 002 baseline.
- **NFR-P02**: A superseded pull-request run stops consuming a runner instead of finishing into a discarded verdict; the wall-clock gain is unmeasured because the 23.5 h window held no PR runs.
- **NFR-P03**: Three checkouts drop by about 20 s each, and `rule-canary-sync`'s 78 s median job is inferred to drop under 60 s, which would bill one minute instead of two.

### Security
- **NFR-S01**: No workflow gains a permission, a secret or a write scope. `permissions:` blocks are untouched; this phase adds no `permissions:` key and removes none.
- **NFR-S02**: Every new filter entry is a repository-relative path literal. No branch name, run id or event payload is interpolated into a `paths:` entry.
- **NFR-S03**: The concurrency group interpolates only `github.workflow`, `github.event.pull_request.number` and `github.ref`, all of which GitHub supplies; no secret reaches a group name.

### Reliability
- **NFR-R01**: No gate stops running on the change that breaks it: every workflow whose checker or workflow file it reads names that file in its own filter, and R10 closes the one existing gap in `skill-doc-frontmatter.yml`.
- **NFR-R02**: A cancelled PR run never leaves a required context unset, because the newest head always gets a run and `cancel-in-progress` is false on push.
- **NFR-R03**: The suppression removal changes reporting only: the same commands run, with the same arguments, and the job's `continue-on-error` keeps the advisory jobs green by design.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty change: a pull request that touches none of a filtered workflow's inputs starts no run, and GitHub reports the check as absent rather than failed. Every filtered workflow here is non-required except `message-contract`, which stays unfiltered.
- A filter that names one root only: `check-gate-inputs.sh:110-122` raises `filter-twins` and the gate fails, so a missing `.opencode/` twin cannot land.
- A workflow with no `permissions:` block: the concurrency block goes directly above `jobs:`, which is valid in all 30 files and avoids depending on a key that 12 of them lack.

### Error Scenarios
- A third push while one run is in progress and another is pending: GitHub cancels the pending run and keeps the newest, so the newest head still reports; the middle SHA gets no verdict. Recorded, not prevented.
- A cancelled PR run for `message-contract`: the required context is evaluated on the newest head, which always has a run; a cancelled run belongs to an older SHA and cannot block the merge.
- `workflow_dispatch`: a hand-run is grouped by `github.ref`, so two manual runs on one branch serialize; no dispatch is cancelled because `cancel-in-progress` is false outside `pull_request`.
- A failing report step: the step exits non-zero, `continue-on-error` keeps the job green, and the run page shows the red step. The run status alone no longer hides it.
- A checker that needs more history than the new depth: `deep-loop-runtime` keeps depth 2 for the parent commit, and the seven history readers keep depth 0.

### State Transitions
- Partial completion: the concurrency block, the filters, the deleted step and the suppression removal land in one commit per concern, so no commit leaves a workflow half-filtered or a job without its guard.
- Rollback: reverting one workflow file restores its previous trigger or job shape with no state to clean up; the inventory document and the README row are reverted with it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 10 workflow files carry a non-concurrency edit, 30 receive the same block, 1 README table, 3 scratch documents |
| Risk | 12/25 | One protected guard, one filter whose missed input is silent, and 30 trigger changes that a reviewer cannot eyeball |
| Research | 6/20 | The review measured the savings; this phase re-reads four checkers, the hooks config and the installed pre-commit hook |
| Multi-Agent | 2/15 | One executor and one workstream; no second agent owns a file, and the five decision gates are operator input rather than delegation |
| Coordination | 4/15 | Five operator answers, one upstream baseline, and CI probes that wait on real runs; no cross-team handoff |
| **Total** | **39/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The `command-tree-parity` filter misses an input its four checkers read, so a stale Hermes copy or a broken mirror lands green | H | M | The list is derived from a full read of all four checkers, not from the review's summary; both trigger probes are recorded in `scratch/phase-result.md` |
| R-002 | A cancelled PR run leaves the required `message-contract` context unset on the newest head | H | L | `cancel-in-progress` is true only for `pull_request`, every new head starts its own run, and the probe reads `gh pr checks` on the newest SHA |
| R-003 | Deleting the duplicate dispatch step also removes the only path that fails on a broken dispatch audit | H | L | The whole-tree vitest run at `:67` collects `dispatch-audit.test.mjs` through the hooks config, and T030's deleted-suite branch proves the job still fails |
| R-004 | A report step that now exits non-zero breaks a consumer that reads the run status | M | L | `continue-on-error: true` stays, so the job concludes `success`; only the step's own conclusion changes, and the probe records both |
| R-005 | A checker quietly needs history that the new checkout depth no longer fetches | M | L | Both shallow checkouts belong to checkers that shell out to no git command, and the probe compares each job against its 002 baseline |
| R-006 | The 002 baseline does not exist, so no after number has a before number | M | H | The phase waits: T006 stops when `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` is absent, and no research figure is substituted |
| R-007 | A later reader treats a recorded operator answer as still open | L | Each answer is recorded in `scratch/decisions.md` and repeated in `plan.md`, and T001 to T005 verify it |
| R-008 | A `.skilled/` filter entry lands without its `.opencode/` twin | M | L | `check-gate-inputs.sh` raises `filter-twins` and the gate fails before merge; T025 runs it over the real tree |
| R-009 | The README push/PR table drifts from the YAML once two rows move | L | M | The table is edited in the same commit as the filters, and the row-membership grep is an acceptance check |
| R-010 | The concurrency block lands below `jobs:` or inside another mapping, so the workflow parses but the group never applies | M | L | The anchor is the `jobs:` line at column 0, and T024 checks `grep -c '^concurrency:'` per file plus the YAML parse |
| R-011 | The pre-commit inventory is read as an action list and a gate is dropped without a decision | L | L | The document states that nothing in this phase acts on it, and every verdict carries a reason |
| R-012 | The PR-side cancellation is recorded as a saving although the window held no PR runs | M | M | `scratch/phase-result.md` records it as unmeasured, and only the main-branch figure is reported as a number |

## 11. USER STORIES

### US-001: Stop paying for a run that a newer push has already replaced (Priority: P0)

**As a** maintainer who pays for the repository's CI minutes, **I want** a second push to a pull request to cancel the run it superseded, and a documentation-only change to start only the workflows whose inputs it touched, **so that** the runner minutes go to the change under review instead of to a verdict nobody reads.

**Acceptance criteria:** AC-001, AC-002, AC-003, AC-010.

---

### US-002: Keep every gate running once and make its failure visible (Priority: P0)

**As a** reviewer of a protected guard, **I want** the dispatch audit to run once per run, all seven hooks vitest suites to keep running, and a failing report step to show as failed, **so that** removing duplicate work cannot quietly remove the check that catches a broken dispatch rule or a drifted document.

**Acceptance criteria:** AC-005, AC-006, AC-007.

---

### US-003: Give the later phases a measured delta and a recorded overlap (Priority: P1)

**As the** author of phases 004 to 009, **I want** this phase's before and after numbers recorded against the 002 baseline, and the pre-commit duplication inventory written down, **so that** the next phase measures against what is deployed rather than against an estimate, and nobody re-derives which gates the hook already runs.

**Acceptance criteria:** AC-008, AC-009, AC-012, AC-016, AC-017.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Does `cancel-in-progress` on pull requests leave the required `message-contract` context satisfied on the newest head? GitHub evaluates the context per SHA and the newest SHA always gets a run, so the expectation is yes; the R3 probe records the observed state rather than assuming it.
- Do `deep-loop-runtime`'s mode-event suites need anything older than the parent commit? D7=depth-2 (2026-10-23) answers it, because the suites bind a run to a commit and its parent (`deep-loop-runtime.yml:38-39`).
- Which pre-commit gates have no CI counterpart, and should they? R11's inventory answers it with a keep-or-drop line per gate; nothing in this phase acts on the answer.
- Does R6's drop-only shape recover as many minutes as the merge? The review infers 1-2 billed minutes per run for the merged shape and asks for a re-measurement; `scratch/phase-result.md` records whichever shape was built.
<!-- /ANCHOR:questions -->

---

