---
title: "Feature Specification: Phase 4: setup-caching-provisioning"
description: "Three workflows install every dependency tree from scratch on every run because nothing is cached, and eleven more repeat the same npm installs inside their jobs. This phase teaches the gate-input check to scan composite actions, sizes the cache against the 10 GB repository limit, builds one cached setup action with a weekly cold-path run, merges hooks-node-tests into opencode-plugin-tests, and routes the repeated npm and pip installs through the cache."
trigger_phrases:
  - "setup caching provisioning"
  - "phase 4 setup caching provisioning"
  - "composite setup action cache"
  - "provision worktree cache"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: setup-caching-provisioning

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Nothing in this repository's CI is cached. Zero of the 33 workflows use `actions/cache` or a `setup-node` cache key, so five provisioning jobs install a 2.22 GB tree set from scratch on every run and ten more workflows repeat the same npm installs inside their jobs. This phase measures the cache against the 10 GB budget, builds one composite setup action that restores, provisions and saves, adopts it at the five provisioning sites and in the multi-install workflows, merges the two hook and plugin test workflows into one job, and adds the pip cache and a checkout trial that follow from a working action.

**Key Decisions**: D5 approves the hook-and-plugin merge and renames one check. The cache is an accelerator and the repository's own provisioning walk stays the authority. The gate learns to read composite actions before the first one exists.

**Critical Dependencies**: the 002 24 h baseline, D5=approve (2026-10-23), and phase 003's R8 for the checkout trial.

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
| **Phase** | 4 of 9 |
| **Predecessor** | 002-rebuild-fanout-removal |
| **Successor** | 005-slow-and-failing-tests |
| **Handoff Criteria** | `check-gate-inputs.sh` scans `.github/actions/**` and prints `RESULT: PASSED`, its fixture suite is green with the new cases, a dispatchable cold-path run passes, a warm run shows the five provisioning jobs down about 40 s, and `scratch/phase-result.md` records every warm-run job second against the 002 baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the CI efficiency implementation phases specification. It carries R12, R13, R14, R15, R16, R17 and R18 of `001-research/research/synthesis-reviews/final-review.md` (`:326-399`), in the internal order that review's phase plan fixes: R12, R13, R14, then R15 and R16, then R17 and R18 (`:562-569`).

**Scope Boundary**: One gate script and its fixture test, one composite action, the three provisioning workflows plus the ten multi-install workflows this phase edits, four `setup-python` steps, one checkout trial, and two README rows. No trigger event, path filter, permission or timeout changes except `.github/actions/**` added to the adopting workflows' filters and the merged job's timeout. No job consolidation decision, no `fileParallelism` change, no on/off switch.

**Dependencies**:
- `002-rebuild-fanout-removal`: its 24 h snapshot is the baseline every saving in this phase is measured against, and its rebuild-skip change sets the volume the "after R1" figures assume.
- `003-trigger-and-job-hygiene`: not a predecessor. That phase's R8 has landed — `rule-canary-sync.yml` carries no `fetch-depth` — so R18's T067 check reads `0` and the trial is unblocked. Its R6 also landed, leaving `dispatch-enforcement-guard.yml` with one install, so T003's inventory counts ten multi-install files.
- Operator decision D5 (`final-review.md:618`), which approves the check rename the R15 merge causes.
- `gh` authenticated with `repo` and `actions`, for cache sizes, job step timings and dispatch runs.
- A checkout with `.skilled/skills/system-spec-kit` dependencies installed for the spec-kit gates; the worktree that authored this plan has no build.

**Deliverables**:
- `.github/scripts/check-gate-inputs.sh`: a composite-action scan loop and a `description:` label branch.
- `.github/scripts/tests/check-gate-inputs.test.sh`: four fixture cases for the action scan.
- `.github/actions/setup/action.yml`: restore → bun setup → `provision_worktree` → save, keyed on every lockfile and the Node major, with no `restore-keys`.
- `.github/workflows/opencode-plugin-tests.yml`: the merged hook-and-plugin job, the union trigger, and the weekly cold-path schedule.
- Install-block substitutions in the ten multi-install workflows this phase edits, and `cache: pip` in the four pip workflows.
- `scratch/`: the baseline rows, the cache probe, the npm-dedupe record and the phase result.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nothing in this repository is cached. Zero of the 33 workflows use `actions/cache` or a `setup-node` cache key, so every job installs its dependency trees from scratch (`research.md:36`). The three provisioning workflows pay for it five times per commit: `hooks-node-tests.yml:57-64`, `opencode-plugin-tests.yml:66-73` and both `opencode-dual-version.yml` jobs (`:98-105`, `:181-188`) each run their own checkout and their own `provision_worktree`, at 56-67 s per job (`research.md:64`) over a 2.22 GB tree set (`iteration-012.md:79-98`). The same installs repeat inside the jobs themselves: `spec-kit-check.yml` runs nine npm install commands across its three jobs (`:83,86,89,100,166,209,210,212,213`), and `routing-registry-drift.yml` runs four across its two jobs (`:138,142,251,253`). A composite action would share one cache across all of them, but the gate that guards this repository's CI inputs reads only `.github/workflows/*.yml` (`check-gate-inputs.sh:481-484`), so an action under `.github/actions/` would be the one CI surface no gate reads.

### Purpose
One cached setup action pays the install once and restores it everywhere, a weekly cold run keeps the install path honest, and the gate that reads CI inputs learns to read the action that now holds them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R12: `.github/actions/**/action.yml|action.yaml` joins the gate-input scan (`check-gate-inputs.sh:481-485`), using the workflow parser, with fixture cases in `check-gate-inputs.test.sh`.
- R13: a throwaway-branch probe that measures the compressed cache size, the restore seconds and the cold versus warm job times, and returns a go/no-go against the 10 GB repository cache limit.
- R14: `.github/actions/setup/action.yml`, adopted by `hooks-node-tests.yml`, `opencode-plugin-tests.yml` and all three `opencode-dual-version.yml` jobs, with a SHA-pinned bun setup replacing five `npm install ... bun@1.3.9` sites and a dispatchable cold-path run.
- R15: `hooks-node-tests.yml` merges into `opencode-plugin-tests.yml` as one workflow, one job and one provision, with the union trigger and the README rows updated.
- R16: the repeated `npm ci` blocks in the multi-install workflows route through the action, starting with `routing-registry-drift.yml` and `spec-kit-check.yml`; `dispatch-enforcement-guard.yml` needs no task here because phase 003's R6 already removes its duplicate install.
- R17: `cache: pip` on the pinned `setup-python` step in the four pip workflows, and only because R14 lands.
- R18: a partial or sparse checkout trial on `rule-canary-sync.yml`, the one light workflow whose checker reads a bounded set of files.

### Out of Scope
- R19 and R20 (spec-kit CLI parallelism or sharding): `005-slow-and-failing-tests` owns `.skilled/skills/system-spec-kit/vitest.config.ts`.
- R22 and R23 (the sk-code-ci standards surface): `006-sk-code-ci-surface` records the composite-action rule after this phase lands.
- R24, R25 and R26 (timeouts, permissions, switches): `007-workflow-hygiene-on-off-control` re-sizes the merged job's timeout and adds the `permissions:` blocks this phase leaves alone.
- R27 (job consolidation): `008-consolidation-decision` re-measures after this phase.
- Any trigger, filter or job-shape change not named above; any edit to `trigger-index-rebuild.yml`, `message-contract.yml`, `dependabot-auto-merge.yml` or the required-check ruleset.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/scripts/check-gate-inputs.sh` | Modify | Scan every `.github/actions/**/action.yml` or `action.yaml` with the workflow parser after `:485`; treat `description:` as a label at `:384`; name actions in the rule comment at `:18-25` |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Modify | Four cases after `:487`: a clean action passes, a missing run path fails, an unreadable root shape fails, a `description:` path is a label |
| `.github/actions/setup/action.yml` | Create | Composite action: cache restore, pinned bun setup, `provision_worktree`, cache save |
| `.github/workflows/hooks-node-tests.yml` | Delete | Its steps and rationale move into `opencode-plugin-tests.yml` at R15 |
| `.github/workflows/opencode-plugin-tests.yml` | Modify | Adopt the action, union the trigger with `.hermes/**`, take the hook suites and installer test, add the cold input and weekly schedule |
| `.github/workflows/opencode-dual-version.yml` | Modify | Adopt the action in both matrix legs and the `both` job; delete both bun bootstraps |
| `.github/workflows/routing-registry-drift.yml` | Modify | Replace the install blocks in both jobs (`:132-142`, `:246-253`) with the action |
| `.github/workflows/spec-kit-check.yml` | Modify | Replace nine install commands and the sk-vision build step with the action in all three jobs; `cache: pip` at `:194-196` |
| `.github/workflows/skill-advisor-stress.yml` | Modify | Replace the install block at `:58-62` with the action |
| `.github/workflows/sk-doc-script-tests.yml` | Modify | Replace the install block at `:45-48` with the action; `cache: pip` at `:25-27` |
| `.github/workflows/sk-doc-rename-harness.yml` | Modify | Replace the install block at `:51-54` with the action; `cache: pip` at `:36-38` |
| `.github/workflows/deep-loop-runtime.yml` | Modify | Replace the install block at `:54-57` with the action |
| `.github/workflows/skill-doc-frontmatter.yml` | Modify | Replace the install block at `:69-71` with the action |
| `.github/workflows/playbook-operator-contract.yml` | Modify | Replace the install block at `:28-32` with the action |
| `.github/workflows/gate-inputs.yml` | Modify | Replace the install block at `:32-34` with the action |
| `.github/workflows/command-tree-parity.yml` | Modify | Replace both install blocks (`:29`, `:61`) with the action |
| `.github/workflows/naming-standard-guard.yml` | Modify | `cache: pip` at `:23-25` |
| `.github/workflows/rule-canary-sync.yml` | Modify | Trial `filter: blob:none`, then a sparse checkout, on the step at `:13-15` |
| `.github/workflows/README.md` | Modify | Merge the `hooks-node-tests.yml` row (`:37`) and the `opencode-plugin-tests.yml` row (`:42`); drop the deleted file from `:69` |
| `scratch/` | Create | `phase-baseline.md`, `cache-probe/`, `npm-dedupe.md`, `phase-result.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R12.** `check-gate-inputs.sh` scans every `.github/actions/**/action.yml` and `action.yaml` with the workflow parser, and treats a `description:` line as a label rather than an input, so an action's prose cannot fail the gate while its `run:` paths are still resolved |
| REQ-002 | **R13.** A throwaway-branch probe records the compressed cache size, the restore seconds and the cold versus warm job times for the provisioned tree set, and returns a written go/no-go against the 10 GB repository cache limit before the action is built |
| REQ-003 | **R14.** `.github/actions/setup/action.yml` restores the cache, sets up bun from a SHA-pinned action, runs `provision_worktree` on every path including a cache hit, then saves; its key hashes every `package-lock.json`, `bun.lock` and `bun.lockb` plus the Node major, and carries no `restore-keys` |
| REQ-004 | **R14.** The action is adopted at all five provisioning sites, every `npm install --no-save ... bun@1.3.9` line is gone from the three workflows, and a dispatchable run with the cache bypassed passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | **R15.** `hooks-node-tests.yml` is deleted and its suites, installer test, git identity and rationale live in `opencode-plugin-tests.yml` as one job with one provision, the union of both path sets, and the renamed check recorded by D5 |
| REQ-006 | **R16.** The repeated `npm ci` blocks in the multi-install workflows are replaced by the action, starting with `routing-registry-drift.yml` and `spec-kit-check.yml`, and each replaced block is kept only if the warm run's install step is shorter than its 002 baseline |
| REQ-007 | **R17.** The four pip workflows carry `cache: pip` with a `cache-dependency-path` that names the file holding their pins, and only because REQ-003 landed |
| REQ-008 | **R18.** `rule-canary-sync.yml` trials `filter: blob:none` and then a sparse checkout, records the checkout seconds for each variant, and keeps the fastest one only if its suite passes |
| REQ-009 | The whole-tree gates pass: `check-gate-inputs.sh` prints `RESULT: PASSED` over the real tree with the action in it, `check-gate-inputs.test.sh` passes every case, and every workflow file parses as YAML |
| REQ-010 | The phase's measured result is recorded in `scratch/phase-result.md` against the 002 baseline: warm-run job seconds for every workflow this phase touched, the cache size, and the delta |
| REQ-011 | **D5.** The operator's answer is recorded in `scratch/decisions.md` before any R15 task runs, and names the merged check's new title |
| REQ-012 | The README lists one row for the merged workflow, naming the hook suites, the installer test and the weekly cold run, and no longer lists `hooks-node-tests.yml` anywhere |
| REQ-013 | No R-id, D-id or phase number appears in a workflow comment, a step name, an action input, a cache key or a README row |

R12's saving is 0: it closes the gap that would otherwise let the action hold CI inputs no gate reads. R13's saving is 0: it sizes R14. R14 is ~145 runner-min/day standalone and ~74 after R1, unverified until R13. R15 is 124 standalone, ~53 after R1 and ~27 after R1 and R14. R16 is 20-40 standalone, smaller after R1. R17 is negligible. R18 is unknown.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A cache hit turns a 56-67 s provision step into a restore plus the verification walk, and the five provisioning jobs across the three workflows drop by about 40 s each, measured on a warm run against the 002 baseline.
- **SC-002**: The cache cannot hide a broken cold install: a dispatchable run with the cache bypassed provisions from scratch and passes, and a weekly schedule keeps that path exercised.
- **SC-003**: One workflow and one job run both the hook `node:test` suites and the OpenCode plugin suites, with every suite and the installer test present in the run log.
- **SC-004**: The gate reads the action: `check-gate-inputs.sh` reports one more file once the action exists, and a fixture action with an unresolved or unreadable path fails the gate.
- **SC-005**: The cache budget is a measured number, not an assumption: `scratch/cache-probe/` states the compressed size and the go/no-go against 10 GB before the action is adopted.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `002-rebuild-fanout-removal` baseline | Every "after R1" number is unanchored | The provisional baseline is `001-research/scratch/ci-run-data/summary.md`; T002 waits for the 002 snapshot and records which source it used |
| Dependency | `003-trigger-and-job-hygiene` R8 | Landed 2026-10-23 — `rule-canary-sync.yml` carries no `fetch-depth`, so R18's shallow checkout exists | R18's first task still checks `grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml`; a return of `1` would mark R18 blocked and the phase closes without it |
| Dependency | Operator decision D5 | None; D5=approve (2026-10-23) recorded and T001 only verifies `scratch/decisions.md` | The merge is approved and planned end to end with the renamed check named; the alternative is to keep both workflows and forgo ~53 runner-min/day after R1 |
| Risk | A stale cache is accepted silently: `_wn_deps_satisfied` compares a name, not a version (`worktree-naming.sh:486-506`), so a key that omits a lockfile yields a green run with wrong versions | The gate proves less than it claims, with no red build | The key globs every lockfile rather than enumerating today's 13, and carries no `restore-keys`; R13's probe measures the entry before adoption |
| Risk | A warm cache stops exercising the install path | A broken cold install merges green | `provision_worktree` still runs on a hit as the verification walk, and a weekly scheduled cold run plus a dispatchable `cold` input keep the miss path alive |
| Risk | The 2.22 GB tree set compresses to roughly 0.7-1 GB per entry against a 10 GB budget (`iteration-012.md:287-295`), so dependabot churn can evict | Frequent cold runs, slower than today | R13 measures the entry and returns a go/no-go; if it exceeds budget, the `~/.npm` component is dropped first because it only helps cold runs |
| Risk | `routing-registry-drift.yml`'s lean job deliberately avoids the advisor runtime's native and ML dependencies (`:148-153`); the action provisions the whole list | A cold run in that job installs more than it needs | The cache key is shared across workflows, so a hit is the common case; the cold-run cost is recorded in `scratch/npm-dedupe.md` and the block is reverted if its warm step does not drop |
| Risk | `check-gate-inputs.sh` is a protected workflow by function (`research.md:187`): it is the sole enforcer of an invariant with no local gate | A parsing mistake hides a real input | R12 lands first, with its own fixture cases, before the action exists; the fixture suite is the proof |
| Risk | `.github/actions/**` is neither source root, so the twin rule neither applies nor is broken | A filter that names the action is not paired | Stated in the plan: the action is a `.github/` path, which self-twins |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A warm provision is at least 40 s shorter than the 56-67 s cold provision on each of the five sites, measured by job step timings rather than asserted.
- **NFR-P02**: The action adds no step to a job that does not already install: every adoption replaces an existing install block rather than preceding it.

### Security
- **NFR-S01**: Every `uses:` added by this phase is pinned to a full commit SHA in the same `@<sha> # vX.Y.Z` form the tree already uses; no tag, branch or floating version.
- **NFR-S02**: No secret, token, permission or scope is added. The action runs `contents: read` work only, and the cache carries dependency trees and build output, never a credential or a `.env` file.

### Reliability
- **NFR-R01**: A cache miss produces exactly today's behaviour: the same `provision_worktree` call, the same install and build commands, the same failure reporting.
- **NFR-R02**: The action fails the job when provisioning fails, and never saves a half-provisioned tree: the save step runs only after a successful provision and only on a miss.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Empty action tree: `.github/actions/` does not exist today, so the scan loop is guarded by a directory test and the file count stays 45 until the action lands, then becomes 46.
- Lockfile churn: any change to a `package-lock.json`, `bun.lock` or `bun.lockb` changes the key, so the next run on that branch is cold by design; the key includes the provision path list and `worktree-naming.sh` so a change in what is provisioned also invalidates.
- Cache over budget: the `~/.npm` component is dropped first, then the build outputs, because both only shorten a cold run.

### Error Scenarios
- Restore fails or the cache is evicted: the step reports no hit, bun is set up, and `provision_worktree` installs from scratch exactly as today.
- Provision fails on a hit: the job fails and the save step does not run, so a broken tree cannot be written back.
- A lockfile and its manifest disagree: `provision_worktree` reports the drift and fails (`worktree-naming.sh:677-681`), and the job fails rather than saving.
- The action itself is broken: all five sites fail together, loudly, which is the same blast radius the workflows already share through `worktree-naming.sh`.

### State Transitions
- Partial completion: R12 lands before the action exists, so the gate is already reading the directory when the first action file appears; R14 lands before R15 and R16, so the merge and the install substitutions consume a working action.
- Rollback: deleting `.github/actions/setup/` and reverting the five adoption commits restores today's inline provision blocks; the cache entries expire unused and need no cleanup.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 20 files: one gate script, one fixture test, one new action, 16 workflows, one README |
| Risk | 14/25 | A silent-staleness failure mode, a protected gate, a check rename, and a cold-path regression that only a schedule catches |
| Research | 8/20 | The cache shape and the 2.22 GB measurement come from iteration 012; this phase re-reads the gate, the parser, the provision script and 16 workflows |
| Multi-Agent | 3/15 | One executor and one workstream. No second agent owns a file, and D5 is operator input rather than delegation |
| Coordination | 5/15 | One operator answer, one upstream baseline, one upstream phase for R18, and CI probes that wait on real runs and a 24 h delta |
| **Total** | **42/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A stale cache is accepted silently, because `_wn_deps_satisfied` compares a dependency name rather than a version, so a key that omits one lockfile yields a green run with wrong versions | H | L | The key globs every `package-lock.json`, `bun.lock` and `bun.lockb` rather than enumerating today's 13, and carries no `restore-keys`; T012 and T013 measure the entry before adoption |
| R-002 | A warm cache stops exercising the install path, so a broken cold install merges green | H | M | `provision_worktree` still runs on a hit as the verification walk, and a weekly scheduled run plus a dispatchable `cold` input keep the miss path alive (T019, T037, T028) |
| R-003 | The 2.22 GB tree set compresses to roughly 0.7-1 GB per entry against a 10 GB budget, so dependabot churn evicts entries and turns warm runs cold | M | M | T013 returns a go/no-go before the action is built, and `~/.npm` is the first path dropped if the entry exceeds budget |
| R-004 | R16 makes a lean job install the whole provision list on a cold run, which costs more than the warm saving | M | M | The cache key is shared across workflows, so a hit is the common case; each substituted block is reverted when its warm install step is not at least 10 s shorter than its baseline (T062) |
| R-005 | The gate script is a protected gate by function: it is the sole enforcer of the twin and input invariants and has no local equivalent | H | L | The scan lands first with four fixture cases before any real action exists, and every fixture fails without its branch (T006 to T009) |
| R-006 | A `description:` line that names a path is read as an input and fails the gate on prose | M | M | T005 extends the existing `name:` label branch to `(name|description):`, and T009's fixture proves the difference |
| R-007 | The merged job loses a suite or the installer test during the move | H | L | T035 copies the three hook steps verbatim, and T041 reads the run log for every suite and the installer test line |
| R-008 | The merge renames a check a consumer depends on | M | L | `research.md:94` shows the only active ruleset requires `message-contract.yml`'s context; D5 records the rename, and the README rows move with it |
| R-009 | The 002 baseline does not exist, so no after number has a before number | M | H | T002 stops when `../002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` is absent and records the 001 dataset as provisional instead |
| R-010 | Phase 003's R8 landed 2026-10-23, so R18's shallow checkout exists; the residual risk is a later reversion | L | M | T067 checks `grep -c 'fetch-depth' .github/workflows/rule-canary-sync.yml`; a count of 1 marks R18 blocked and the phase closes without it |
| R-011 | A `setup-python` cache key has no dependency file to hash, because the repository holds no requirements file | M | M | `cache-dependency-path` names the workflow file itself, whose pins are what change (T051 to T054) |
| R-012 | The sparse checkout cone names `.opencode` paths that are symlinks, so the checkout omits the real files | M | L | The cone names the `.skilled` targets, and the canary job proves it by logging `All rule invariants present` (T057) |

## 11. USER STORIES

### US-001: Stop installing the same trees five times per commit (Priority: P0)

**As a** maintainer who pays for the repository's CI minutes, **I want** the five provisioning jobs and the ten multi-install workflows to restore a measured cache instead of installing a 2.22 GB tree set from scratch, **so that** each of those jobs finishes about 40 s sooner and the phase recovers about 145 runner-min/day before the rebuild fan-out is removed and about 74 after it.

**Acceptance criteria:** AC-003, AC-004, AC-005, AC-006, AC-009, AC-010.

---

### US-002: Keep the gate reading every CI input surface (Priority: P0)

**As a** reviewer of the gate-input check, **I want** the check to read `.github/actions/**` with the same parser it uses for workflows, and to treat an action's `description:` as prose, **so that** the one CI surface no gate reads today cannot hold an unresolved path or a one-root filter after this phase moves five install blocks into it.

**Acceptance criteria:** AC-001, AC-002, AC-013, AC-017.

---

### US-003: Make the cache a measured accelerator, not an article of faith (Priority: P1)

**As the** author of phases 005 to 009, **I want** the cache entry measured before it is built, the cold path exercised on a schedule, and every saving recorded against the 002 baseline, **so that** a later phase measures against what is deployed and a stale or broken cache cannot pass for a working install.

**Acceptance criteria:** AC-003, AC-006, AC-007, AC-008, AC-011, AC-012, AC-014, AC-015, AC-016.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- Does a 2.22 GB tree set compress under the 10 GB budget with room for dependabot churn? Documented GitHub behaviour suggests 0.7-1 GB per entry and roughly ten entries, but that was not verified here (`iteration-012.md:287-295`). R13 answers it with a measured entry, and the go/no-go is the gate on R14.
- Does `filter: blob:none` save anything on a single-commit checkout, where every blob in the tree is still needed? R18 measures it and falls through to a sparse checkout; if neither saves, the trial is reverted and recorded as such.
- Does routing the lean jobs through the action cost more on a cold run than it saves on a warm one? The cache key is shared across workflows, so the first workflow to run after a lockfile change pays the cold cost for everyone. `scratch/npm-dedupe.md` records the warm step per file and reverts a block that does not drop.
- Is the merged check's new title referenced anywhere outside the README? `research.md:94` confirms the only active ruleset requires `message-contract.yml`'s context, so the rename is safe for the ruleset; the README and any personal bookmarks are the remaining consumers.
<!-- /ANCHOR:questions -->

---

