---
title: "Feature Specification: Phase 7: workflow-hygiene-on-off-control"
description: "Twenty-seven of the 33 workflows declare no timeout, so a hung job can hold a runner for GitHub's 360-minute default; 12 declare no permissions block, and dependabot-auto-merge gives its write scopes to the same job that runs the metadata action; and every job runs unconditionally, so a clone cannot switch a group of checks off without editing YAML. This phase sizes a timeout for every job from 40 runs of job-level samples, declares least-privilege permissions on the 12 files and splits the Dependabot workflow, and puts a vars.* switch on every job except Dependabot's two."
trigger_phrases:
  - "workflow hygiene on off control"
  - "phase 7 workflow hygiene on off control"
  - "per job timeout minutes"
  - "least privilege workflow permissions"
  - "ci on off switch variables"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: workflow-hygiene-on-off-control

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Three hygiene passes close the gaps that let a hung job hold a runner for six hours, let a third-party action run beside a write token, and let no clone turn a group of checks off without editing YAML. The phase declares least-privilege permissions on the 12 workflows that declare none and splits the Dependabot auto-merge workflow into a read-only metadata job and a write-scoped merge job, then sizes a timeout for every job from its own job-level samples, then puts a repository-variable switch on every job except Dependabot's two and documents the six variable names in the workflows README. Every pass is proved by a parse of all 32 workflow files, by `check-gate-inputs.sh`, and the switch additionally by a fork probe.

**Key Decisions**: D6's timeout floor, 10 minutes by default (ADR-001); the build order R25, then R24, then R26, so the job graph stops moving before anything is sized or gated (ADR-002); timeouts sized on job execution time, never run wall time (ADR-003); the switch ANDed onto an existing condition rather than replacing it (ADR-006).

**Critical Dependencies**: `004-setup-caching-provisioning` fixes the workflow count and the merged job's shape; `005-slow-and-failing-tests` fixes two job durations; `006-sk-code-ci-surface` records the rules this phase applies; a fork or throwaway test repository is required for the only behavioural proof.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-10-23 |
| **Branch** | `worktrees/214-ci-efficiency-phase-plans` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 006-sk-code-ci-surface |
| **Successor** | 008-consolidation-decision |
| **Handoff Criteria** | `grep -L 'permissions:' .github/workflows/*.yml` returns nothing and `python3` over all workflow files reports every job with `timeout-minutes`; `grep -c "vars.SKILLED_CI"` counts one switch line on every job except the two in `dependabot-auto-merge.yml`; the fork probe in `scratch/r26-probe.md` records one skipped run with `SKILLED_CI_REPORTS=off` and one run after it is deleted; `bash .github/scripts/check-gate-inputs.sh` and `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control --strict` both print `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the CI efficiency implementation phases specification. It carries R24, R25 and R26 of `001-research/research/synthesis-reviews/final-review.md` (`:458-493`) and the phase-007 gate in that review's phase plan (`:585-592`). Its internal order is R25, then R24, then R26, because R25's Dependabot split creates a job that R24 must size and R26 must leave alone; the review's own order is the id order, not the build order.

**Scope Boundary**: The job blocks of every workflow file, one workflow's job graph, one section of `.github/workflows/README.md`, and this phase's `scratch/` records. No trigger, path filter, concurrency group, cache key, provisioning step, test, check name or job count changes, with one exception the review names: the Dependabot workflow becomes two jobs. No workflow gains a permission it did not already exercise.

**Dependencies**:
- `003-trigger-and-job-hygiene`: it adds a `concurrency:` block above `jobs:` in about 30 workflows and deletes one duplicate step, so every line number this phase cites below that block moves. The phase re-derives its job inventory at build time rather than trusting this plan's numbers.
- `004-setup-caching-provisioning`: R15 deletes `.github/workflows/hooks-node-tests.yml` and renames `opencode-plugin-tests.yml`'s job to `plugin-and-hook-tests` with `timeout-minutes: 40` (`004-setup-caching-provisioning/tasks.md`, T033 and T034); R14 replaces the provisioning steps, which changes the duration every timeout is sized from. Its D5 answer decides whether the workflow count ends at 32 or 33.
- `005-slow-and-failing-tests`: R20 may add a step to `deep-loop-runtime.yml` and R19 may change how `spec-kit-check.yml:124-128` runs, which changes the job durations this phase samples.
- `006-sk-code-ci-surface`: its rule data records the timeout formula, the least-privilege rule and the switch shape (`006-sk-code-ci-surface/tasks.md`, T012). This phase applies them; it does not redefine them. A disagreement is repaired in that packet's data, not by changing the shape here.
- `002-rebuild-fanout-removal`: its 24 h baseline is the before figure for the review's saving arithmetic. R24, R25 and R26 save 0 runner-minutes in normal operation, so the baseline is context rather than a measurement this phase must beat.
- `gh` authenticated with `repo` and `actions` scopes: 40 runs per workflow, and the fork probe's `gh variable set` and `gh workflow run`.
- A fork or a throwaway test repository for the R26 probe. The probe writes a repository variable there, never in this repository.

**Deliverables**:
- `timeout-minutes` on every job of every workflow, sized from job-level samples, with the observed p100 beside each value in `scratch/r24/timeouts.md`.
- `permissions: contents: read` on the 11 workflow files that declare none, and on `skill-doc-frontmatter.yml` alongside its existing job condition.
- `.github/workflows/dependabot-auto-merge.yml` split into a read-only `metadata` job and a write-scoped `auto-merge` job.
- The `vars.SKILLED_CI` switch on every job except Dependabot's two, ANDed onto the three existing job conditions.
- `.github/workflows/README.md`: a new `### On/off switches` section after the push-versus-pull-request table at `:75`.
- `scratch/`: the pre-phase inventory, the switch group assignment, the R24 samples and table, the R26 probe record and the phase result.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A GitHub Actions job with no `timeout-minutes` inherits the 360-minute default, so a hung install or a stuck test holds a runner for six hours. Twenty-seven of the 33 workflow files declare no timeout, and the seven lines that exist carry no stated sample behind them (`opencode-dual-version.yml:74,172`, `deep-loop-runtime.yml:36`, `hooks-node-tests.yml:46`, `opencode-plugin-tests.yml:54`, `skill-advisor-stress.yml:43`, `sk-doc-rename-harness.yml:31`). Twelve files declare no `permissions:` block at all, so every one of them runs with the repository default token scope, and `dependabot-auto-merge.yml` hands `contents: write` and `pull-requests: write` to the job that also runs a third-party metadata action (`:10-12`, `:22`). Nothing lets a clone turn a group of checks off: the only way is to edit YAML, which forks the tree from upstream.

### Purpose
Every job carries a timeout sized from its own execution samples, every workflow declares least-privilege permissions, and every job except Dependabot's two answers a repository variable that a clone can set to `off`, with everything on when the variable is unset.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- R25: `permissions: contents: read` on the 11 workflow files that declare no block (`advisory-checks.yml`, `agent-mirror-sync.yml`, `chart-corpus.yml`, `comment-hygiene.yml`, `diagram-corpus.yml`, `markdown-link-integrity.yml`, `playbook-operator-contract.yml`, `prompt-card-sync.yml`, `repo-rules-corpus.yml`, `rule-canary-sync.yml`, `runtime-no-spec-import.yml`) and on `skill-doc-frontmatter.yml`, which declares none either and is counted with them in the review's 12 (`final-review.md:474-476`).
- R25: the `dependabot-auto-merge.yml` split into a read-only `metadata` job that runs `dependabot/fetch-metadata` at `:22` and a write-scoped `auto-merge` job that runs only `gh pr merge --auto --merge` at `:40`.
- R24: `timeout-minutes` on every job, sized `max(10, ceil(3 x job p50 minutes), ceil(2 x job p100 minutes))` from at least 40 runs per workflow of job-level timings, with the observed p100 recorded beside each value (`final-review.md:458-468`).
- R26: `if: vars.SKILLED_CI != 'off' && vars.SKILLED_CI_<GROUP> != 'off'` on every job except Dependabot's two, ANDed onto an existing condition where one exists, with both sides parenthesised (`trigger-index-rebuild.yml:33`, `skill-doc-frontmatter.yml:52`, `trigger-index-rebuild.yml:186`).
- R26: the `### On/off switches` section in `.github/workflows/README.md` that names the six variables, their group membership, `off` as the only disable token, and the message-contract prohibition.
- The phase's `scratch/` records: the pre-phase inventory, the switch group assignment, the R24 sample set and sizing table, the R26 probe record and the phase result.

### Out of Scope
- R27's job consolidation and its re-measurement: `008-consolidation-decision` owns it, and it reads this phase's switch groups as its input.
- `/doctor:ci` and its `report`, `scaffold` and toggle routes: `009-doctor-ci-review-wiring` owns them. This phase supplies the variable names and the switch shape they read.
- R28's variable-write probe: `009-doctor-ci-review-wiring` owns it. This phase's probe runs on a fork, so it needs no answer from that probe.
- The rules themselves (the timeout formula, the least-privilege rule, the switch shape, the protected set): `006-sk-code-ci-surface` records them. This phase applies them and reports any disagreement rather than editing the packet.
- Any change to a trigger, a path filter, a concurrency group, a cache key, a provisioning step or a test. R3, R4, R12 to R21 own those.
- Any change to a check name. The Dependabot split keeps the existing `Auto-merge Dependabot security patch updates` name on the merge job and adds one name for the metadata job.
- The parent `spec.md`, `description.json` and `graph-metadata.json`: the orchestrator owns them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/advisory-checks.yml`, `agent-mirror-sync.yml`, `chart-corpus.yml`, `comment-hygiene.yml`, `diagram-corpus.yml`, `markdown-link-integrity.yml`, `playbook-operator-contract.yml`, `prompt-card-sync.yml`, `repo-rules-corpus.yml`, `rule-canary-sync.yml`, `runtime-no-spec-import.yml` | Modify | `permissions: contents: read` inserted immediately above `jobs:`; the job also gains its timeout and its switch |
| `.github/workflows/skill-doc-frontmatter.yml` | Modify | The same workflow-level `permissions:` block; a timeout on both jobs; the switch ANDed onto the `if:` at `:52` |
| `.github/workflows/dependabot-auto-merge.yml` | Modify | Workflow-level `permissions: contents: read`; the single job becomes a read-only `metadata` job and a write-scoped `auto-merge` job; a timeout on both; no switch on either |
| `.github/workflows/trigger-index-rebuild.yml` | Modify | A timeout on `rebuild` and `push`; the switch ANDed onto the `if:` at `:33` and `:186`; `permissions: {}` at `:12` and both job blocks unchanged |
| `.github/workflows/message-contract.yml` | Modify | A timeout and the `SKILLED_CI_MESSAGES` switch on its one job; the two step conditions at `:45` and `:67` unchanged |
| The remaining 17 workflow files | Modify | A timeout on every job and a switch on every job; no other line changes |
| `.github/workflows/README.md` | Modify | A new `### On/off switches` section after the push-versus-pull-request table at `:75`, before `## 3. GUARD ENTRYPOINTS` at `:79` |
| `specs/system-speckit/053-ci-workflow-efficiency/007-workflow-hygiene-on-off-control/scratch/` | Create | `phase-baseline.md`, `inventory.md`, `switch-groups.md`, `r24/`, `r26-probe.md`, `phase-result.md` |

The 17 files that receive only a timeout and a switch are `changed-packet-validation.yml`, `command-tree-parity.yml`, `deep-loop-runtime.yml`, `dispatch-enforcement-guard.yml`, `gate-inputs.yml`, `naming-standard-guard.yml`, `opencode-dual-version.yml`, `opencode-plugin-tests.yml`, `pi-extension-tests.yml`, `routing-registry-drift.yml`, `sk-code-script-tests.yml`, `sk-doc-rename-harness.yml`, `sk-doc-script-tests.yml`, `sk-git-script-tests.yml`, `skill-advisor-stress.yml`, `spec-kit-check.yml` and `strict-pass-freshness-report.yml`. `.github/workflows/hooks-node-tests.yml` is absent by the time this phase starts, because `004-setup-caching-provisioning` deletes it.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional requirements by R-id

| R-id | What the phase must make true | Requirements | Tasks |
|------|-------------------------------|--------------|-------|
| R25 | Every workflow declares a token scope, the 12 files that declared none carry `permissions: contents: read`, and `dependabot-auto-merge.yml` is a read-only `metadata` job plus a write-scoped `auto-merge` job that runs no repository code | REQ-001, REQ-002 | T007 to T023 |
| R24 | Every job declares `timeout-minutes` equal to `max(F, ceil(3 x p50), ceil(2 x p100))` over at least 40 runs of job-level samples, with the p100 recorded beside the value and thin or absent samples marked | REQ-003, REQ-004 | T024 to T061 |
| R26 | Every job except Dependabot's two answers `vars.SKILLED_CI` and one group variable, the three existing job conditions keep their expression as a conjunct, and the README names the six variables and the one disable token | REQ-005 to REQ-008 | T006, T062 to T098, T099 |
| Cross-cutting | D6's answer is recorded before the first timeout, no code comment carries an ephemeral id, the change is behaviour-neutral, and the six names are written once | REQ-009 to REQ-013 | T001 to T005, T099 to T102 |

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | **R25.** Every workflow file declares a workflow-level `permissions:` block: the 11 files that declare none gain `permissions: contents: read` immediately above `jobs:`, and `skill-doc-frontmatter.yml` gains the same block. `trigger-index-rebuild.yml` keeps `permissions: {}` at `:12` with its two job blocks, because an empty block is an explicit declaration. No workflow gains a scope it did not already exercise |
| REQ-002 | **R25.** `dependabot-auto-merge.yml` is two jobs. `metadata` is read-only (`contents: read`, `pull-requests: read`), runs `dependabot/fetch-metadata` at `:22`, and exposes `package-ecosystem`, `dependency-group` and `update-type` as job outputs. `auto-merge` needs it, holds `contents: write` and `pull-requests: write`, runs only `gh pr merge --auto --merge` at `:40`, and runs no repository code. The workflow-level block becomes `contents: read` and the existing check name stays on the merge job |
| REQ-003 | **R24.** Every job in every workflow declares `timeout-minutes` equal to `max(F, ceil(3 x p50), ceil(2 x p100))`, where `F` is D6's floor in minutes and the percentiles come from job-level timings over at least 40 runs per workflow, taken after `003`, `004` and `005` have landed. The observed p100 sits beside each value in `scratch/r24/timeouts.md` |
| REQ-004 | **R24.** A job with fewer than 5 successful samples is sized from the samples it has and marked `thin`; a job with none takes the floor and is marked `no-sample`. No job is left without a timeout, and no job's value is copied from a sibling job |
| REQ-005 | **R26.** Every job except the two in `dependabot-auto-merge.yml` carries `vars.SKILLED_CI != 'off' && vars.SKILLED_CI_<GROUP> != 'off'`. Where a job already has a condition, the switch is ANDed onto it with both sides parenthesised, never replacing it. The three such jobs today are `trigger-index-rebuild.yml:33`, `trigger-index-rebuild.yml:186` and `skill-doc-frontmatter.yml:52` |
| REQ-006 | **R26.** The group assignment follows the tiers of the push-versus-pull-request table at `.github/workflows/README.md:60-75`: FRESHNESS for the guards row at `:66`, `naming-standard-guard.yml` at `:67`, `gate-inputs.yml` at `:68` and `changed-packet-validation.yml` at `:70`; TESTS for the path-filtered row at `:69`; REVIEW for the review-time row at `:71`; REPORTS for `strict-pass-freshness-report.yml` and `trigger-index-rebuild.yml`; MESSAGES for `message-contract.yml`. The assignment is recorded in `scratch/switch-groups.md` with a workflow count and a job count per group |
| REQ-007 | **R26.** `.github/workflows/README.md` gains an `### On/off switches` section that names `SKILLED_CI`, `SKILLED_CI_TESTS`, `SKILLED_CI_REPORTS`, `SKILLED_CI_REVIEW`, `SKILLED_CI_FRESHNESS` and `SKILLED_CI_MESSAGES`, states that `off` is the only disable token, that an unset variable runs the job, that `dependabot-auto-merge.yml` has no switch, and that `SKILLED_CI_MESSAGES` must stay unset while the ruleset requires that context |
| REQ-008 | **R26.** The switch is proved on a fork or a throwaway test repository: with `SKILLED_CI_REPORTS=off`, a dispatched `strict-pass-freshness-report.yml` reports its job `skipped` and the run `success`; after the variable is deleted, the same dispatch runs the job. Both runs are recorded in `scratch/r26-probe.md` |
| REQ-009 | The gates pass: `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`, every workflow parses as YAML, and `validate.sh --strict` on this folder prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | **D6.** The operator's floor answer is recorded in `scratch/decisions.md` as one `D6=<n>` line before the first timeout is written, and every value uses that floor. The default is 10 minutes; a different floor is applied uniformly, never per job. The rule text stays parameterised: `006-sk-code-ci-surface`'s `job-shape-rules.md` carries `max(<floor>, ...)` and is not edited by this phase (ADR-009) |
| REQ-011 | No ephemeral artifact id appears in a code comment: no R-id, D-id or phase number is added to a workflow comment, a step name or a README sentence. Spec documents may cite them |
| REQ-012 | The change is behaviour-neutral apart from the two intended effects. No trigger, path filter, concurrency group, cache key, provisioning step or test changes; no existing check name changes; the only new job is Dependabot's `metadata` job; and with every variable unset, every job runs exactly as it does today |
| REQ-013 | The six names are written once. Every workflow uses the group names the README section lists, `scratch/switch-groups.md` carries the same six, and `006-sk-code-ci-surface`'s rule data records the same `off` token. `009-doctor-ci-review-wiring` reads the README section rather than keeping a second list, so a seventh name cannot appear without the section changing first |

R24, R25 and R26 each save 0 runner-minutes in normal operation: a timeout caps a hang at minutes instead of 360, least privilege changes no duration, and a skipped job still creates a run row. Their value is that a hang costs minutes, a compromised dependency action cannot write, and a clone can turn a group off without editing YAML.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `grep -L 'permissions:' .github/workflows/*.yml` returns nothing, and the tree's write-scoped jobs are the two that run no repository code: `dependabot-auto-merge.yml`'s `auto-merge` and `trigger-index-rebuild.yml`'s `push`.
- **SC-002**: Every job declares a `timeout-minutes`, and no successful job in the sample exceeds 50% of its value.
- **SC-003**: Every job except Dependabot's two carries the switch, the three existing job conditions still govern their jobs, and the fork probe shows one skipped run with `SKILLED_CI_REPORTS=off` and one run after it is deleted.
- **SC-004**: The README section names all six variables, `off` as the only token, and the message-contract prohibition; a reader can answer "how do I turn the weekly report off" from that section alone.
- **SC-005**: `check-gate-inputs.sh` prints `RESULT: PASSED`, every workflow parses, and `validate.sh --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | R-id | Item | Impact | Mitigation |
|------|------|------|--------|------------|
| Dependency | All | `003-trigger-and-job-hygiene` | Its `concurrency:` block above `jobs:` moves every line this plan cites | Every task anchors on quoted text and names the job id; the inventory is re-derived at build time, so a stale line is not a stale change |
| Dependency | R24 | `004-setup-caching-provisioning` | R15 changes the workflow count and one job's timeout; R14 changes the durations every value is sized from | Sample only after it lands, and re-derive the 32-file, 44-job target rather than trusting this plan's count |
| Dependency | R24 | `005-slow-and-failing-tests` | Its added steps change `deep-loop-runtime` and `spec-kit-check` durations | Sample after it lands; the formula absorbs a step change, a copied value would not |
| Dependency | All | `006-sk-code-ci-surface` | The rule text this phase applies does not exist yet | The formula and the switch shape are fixed by `final-review.md:458-493`; the packet carries the parameterised form, and this phase records the value rather than editing the packet (ADR-009) |
| Dependency | R24, R26 | `gh` with `repo` and `actions` scopes | No 40-run sample, no fork probe | The sample commands and their output are recorded in `scratch/r24/`; a missing scope is a blocker, not a workaround |
| Dependency | R26 | A fork or throwaway test repository | R26's behavioural proof cannot run | The probe writes a variable only there; without one, AC-008 stays `Unmet` rather than being waived |
| Risk | R24 | A timeout sized too tight kills a legitimately slow run | A green job becomes a cancelled job | The formula carries a 3x p50 and a 2x p100 term; the acceptance requires no successful sample above 50% of the value; a kill is visible as `exceeded the maximum execution time` and the value is raised |
| Risk | R26 | A skipped job reports Success, so a switched-off required check stops blocking | A PR merges without the message check | `SKILLED_CI_MESSAGES` is documented as prohibited while the context is required, and `009-doctor-ci-review-wiring`'s report warns; the switch stays for consistency with the other groups |
| Risk | R24 | 40 runs do not exist for a rarely-run workflow | A p100 from two runs is noise | The `thin` and `no-sample` markers record the count, and the floor covers the gap |
| Risk | R25 | The Dependabot split adds a check name | A reviewer sees a new check in the PR list | Only `message-contract.yml`'s context is required, so no ruleset changes; the existing name stays on the merge job |
| Risk | R26 | A switch line on a job whose `if:` is a loop guard | The guard is silently replaced and the rebuild loops | The AND rule with both sides parenthesised is a task of its own, and T096's mutant copy asserts the guard text survives |

### Rollback by R-id

- **R25 rollback**: delete the inserted `permissions:` and `contents: read` lines from the 12 files, then restore `dependabot-auto-merge.yml` to the quoted single-job shape T019 replaced. The rollback is one `git revert` of the permissions commit plus one of the split commit, because the phase commits each concern separately (ADR-010). Re-run `grep -L 'permissions:' .github/workflows/*.yml` and expect the original 12 files.
- **R24 rollback**: delete every added `timeout-minutes:` line and restore the six existing values that T033, T041, T042, T051 and T054 replaced, each with the anchor it quotes. `scratch/r24/timeouts.md` stays as the record of what was measured, so a revert is visible as a divergence from it.
- **R26 rollback**: delete the switch lines (`42` on the default path, `43` when `hooks-node-tests.yml` is present) and restore the three `if:` expressions T092, T093 and T094 replaced. Removing the README section is the fourth edit. No repository variable exists in this repository, so no setting has to be undone; the fork probe deletes its own variable as its last step.
- **Partial rollback**: a single workflow's timeout or switch is reverted by deleting that one line. Nothing else reads it, so the other 31 files stay consistent.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01** (R24): A hung job is capped at its own `timeout-minutes`, a value in minutes derived from its own samples, instead of GitHub's 360-minute default.
- **NFR-P02** (R24, R25, R26): The phase saves 0 runner-minutes in normal operation. R24 caps a tail, R25 changes no duration, and R26 saves nothing in this repository because every variable is unset; a skipped job still creates a run row.

### Security
- **NFR-S01** (R25): Every workflow declares a token scope, and the only write scopes in the tree belong to a job that runs no repository code: `auto-merge` runs `gh pr merge` and nothing else, and `trigger-index-rebuild`'s `push` job keeps its existing split.
- **NFR-S02** (R26): No new secret, token or environment value. The switch reads repository variables, which contain no secret and are evaluated before a runner is allocated.

### Reliability
- **NFR-R01** (R26): The default is on. An unset variable, an empty value, `0`, `false`, `no` and a typo all run the job, because `off` is the only token that disables one.
- **NFR-R02** (R24, R26): No trigger changes, so no required context can be left Pending by this phase; a skipped job reports Success, which is the documented GitHub behaviour the switch relies on.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### R25 - permissions and the split

- Empty block is a declaration: `trigger-index-rebuild.yml:12` carries `permissions: {}` and is not counted among the 12 files. Rewriting it to `contents: read` would widen the run-level scope the file deliberately leaves empty.
- A job that needs more than the workflow default: job-level `permissions:` overrides the workflow block, which is how `auto-merge` keeps its two write scopes under a read-only workflow header. No other job gains a scope.
- A Dependabot pull request that is not an npm patch: `metadata` runs and reports its outputs, `auto-merge`'s `if:` is false, and the job is skipped. The pull request waits for a person, which is the pre-split behaviour.
- A Dependabot pull request whose author is not the bot: `metadata`'s `if:` is false, so both jobs skip and no token is used.
- A non-Dependabot pull request: both jobs skip. The workflow still creates a run row, as it does today.

### R24 - timeout sizing

- Sample count: a job with 5 or more successful runs is sized by the formula; 1 to 4 is `thin`; 0 is `no-sample` at the floor.
- Failed-only job: a job with no successful run but at least one failed run is sized from the failed runs and marked `failed-only`, because a failing job's duration is still the duration a timeout must cover.
- Matrix job: one `timeout-minutes` applies to each leg, so a matrix of two families has two capped legs rather than one shared budget.
- A job that already carries a value: the value is replaced by the table's final value whether or not it differs, so the tree and the table cannot disagree. `opencode-plugin-tests.yml` carries 40 after the hook merge and is sized like any other job.
- A workflow with fewer than 40 runs available: the sample is every run the API returns, and the count is recorded. The floor covers the gap.

### R26 - the switch

- Empty variable: unset reads as empty, the comparison is true, and the job runs. That is the clone and fork default.
- Wrong token: `0`, `false`, `no`, `disabled` and a typo all make the `!= 'off'` comparison true, so the job runs. Fail-safe is deliberate and documented.
- A job whose `if:` is a loop guard: `trigger-index-rebuild.yml:33` keeps its `endsWith` term as the third conjunct. A replacement would make the rebuild run on its own commit.
- A job whose `if:` is a `needs` gate: `trigger-index-rebuild.yml:186` keeps `needs.rebuild.outputs.committed == 'true'` as its third conjunct, so the switch cannot start a push job the rebuild did not authorise.
- A fork with no variable: everything runs, which is the intended default and the second half of the probe.

### Error Scenarios

- A job killed by its timeout: the run shows `cancelled` and the log carries `exceeded the maximum execution time`. The value is raised from a fresh sample; the 50% criterion is not relaxed.
- A missing permission scope: a job that fails with a 403 names the scope it needed; the scope is added to that job only, with a comment stating why.
- A switch line that replaces an existing condition: the loop guard on `trigger-index-rebuild.yml:33` would stop matching and the rebuild would run on its own commit. The AND rule and T096's mutant copy exist for this case.
- A gate-input failure after a permissions edit: the gate parses every workflow as text and fails closed on a shape it cannot read. The edit is reverted, never the gate.

### State Transitions

- Before the split: `dependabot-auto-merge.yml` has one job with two write scopes. After it: two jobs, one read-only and one write-scoped, with the same check name on the merge.
- Partial completion: R25 can land before R24 and R26, and each is revertible on its own. The phase stays open until every job has a timeout and a switch.
- Rollback: revert the commit per concern; a deleted variable on the fork is the probe's own cleanup.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | 32 workflow files and 44 job blocks, one workflow's job graph, one README section, ten scratch records, about 90 edited lines |
| Risk | 8/25 | A tight timeout kills a green run, and a skipped required check reports Success; both are named, measured and reversible per commit |
| Research | 5/20 | The formula, the groups and the switch shape are already decided in `final-review.md`; the work is 1,280 run reads and arithmetic |
| Multi-Agent | 2/15 | Workstreams: 1. The three passes are one ordered chain over the same 32 files, and a second writer would collide on every job block |
| Coordination | 12/15 | Dependencies: 4 phases, 1 operator decision, 1 external repository and 1 fork. `003` moves every line, `004` fixes the file count and one job's shape, `005` fixes two durations, `006` fixes the rule text |
| **Total** | **42/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | R-id | Description | Impact | Likelihood | Mitigation |
|---------|------|-------------|--------|------------|------------|
| R-001 | R24 | A timeout sized from too few or too quiet samples kills a legitimately slow run | H | M | The formula carries 3x p50 and 2x p100; AC-003 requires no successful sample above 50% of the value; a kill is read from the log by T100 and the value is raised from a fresh sample |
| R-002 | R26 | A switch line replaces a job condition and the rebuild loop guard stops matching | H | L | The AND rule keeps the original expression as the third conjunct, both sides are parenthesised, and T096's mutant copy must fail the assertion |
| R-003 | R26 | A switched-off `message-contract` job reports Success, so a PR merges without the check | H | L | The README states the prohibition, `006`'s protected set names the context, and `009`'s report warns; no variable is set in this repository |
| R-004 | R25 | The Dependabot split breaks auto-merge for the update class it exists to serve | M | L | `metadata` keeps the original job condition and outputs, `auto-merge` keeps the three-term `if:` against those outputs, and T022 proves it on a live pull request |
| R-005 | R25 | A permissions block removes a scope a job actually used | M | L | The 12 files already run with the repository default; `contents: read` is a subset of it, and the two jobs that need write keep it at job level |
| R-006 | R24 | The sample is taken before `004` or `005` lands, so every value describes a job shape that no longer exists | M | M | T003 blocks the phase until `hooks-node-tests.yml` is gone and the merged job is named; T024 samples after that check |
| R-007 | R24, R26 | A stale line number sends the executor to the wrong job in a 300-line workflow | L | H | Every task quotes the job id, the `name:` line and the `runs-on:` line; the quoted text decides, never the number |
| R-008 | R26 | The five group names drift between the workflows, the README and `scratch/switch-groups.md` | M | L | T004 writes the assignment once, T095 writes the README from it, and AC-013 compares all three plus `006`'s rule data |

## 11. USER STORIES

### US-001: A hung job costs minutes, not six hours (Priority: P0)

**As a** maintainer reading a red run at 02:00, **I want** every job to carry a timeout sized from its own execution samples, **so that** a stuck install or a deadlocked test is killed in minutes and the runner is freed for the next run.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-003, AC-004, AC-010).

---

### US-002: A compromised action cannot write (Priority: P0)

**As a** security reviewer, **I want** every workflow to declare a token scope and the only write scopes to sit on a job that runs no repository code, **so that** a hijacked third-party action has nothing to push with.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-001, AC-002).

---

### US-003: A clone can turn a group of checks off (Priority: P0)

**As a** maintainer of a fork or a downstream copy, **I want** one repository variable per check group that I can set to `off`, **so that** I can quiet a group I do not need without forking the YAML and losing every future upstream change.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-005, AC-006, AC-008).

---

### US-004: One place that lists the switches (Priority: P1)

**As an** operator, **I want** one README section that names every variable, the single disable token and the one job that must never be switched off, **so that** I can answer "how do I turn the weekly report off" without reading 32 files.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-007, AC-013).

---

### US-005: A revert that names one concern (Priority: P1)

**As an** operator whose timeout killed a green run, **I want** the phase committed per concern, **so that** I can revert the timeout pass without also reverting the permissions and the switch.

**Acceptance criteria:** see `acceptance-criteria.md` (AC-009, AC-011, AC-012).

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md` (ADR-001 to ADR-010)
- **Goal**: See `goal.md`
- **Recommendations**: See `../001-research/research/synthesis-reviews/final-review.md` (`:458-493` for R24 to R26, `:585-592` for the phase plan, `:619` for D6)

---

## 12. OPEN QUESTIONS

- Are 40 runs available for every workflow? The 001 window shows `opencode-dual-version` 7, `routing-registry-drift` 6, `deep-loop-runtime` 5, `sk-doc-rename-harness` 2 and `sk-code-script-tests` 2 (`001-research/scratch/ci-run-data/summary.md`). Those rows are `thin`, and the floor covers them.
- Does a skipped job satisfy a required check? GitHub's documentation says it reports Success, and this phase does not exercise that on a required context; only `message-contract.yml` is required, and it is documented as never switched off.
- Will a Dependabot pull request arrive inside the phase window? The split's behavioural half needs one. If none arrives, AC-002 stays `Unmet` rather than being waived, and the next one closes it.
- Does `SKILLED_CI_MESSAGES` need to exist at all if it must never be `off`? It exists for symmetry with the other groups and for a fork that has no ruleset. The alternative, no switch on that job, is named in `plan.md` and rejected in ADR-007.
<!-- /ANCHOR:questions -->

---

