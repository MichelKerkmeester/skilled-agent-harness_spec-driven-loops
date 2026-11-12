---
title: "Feature Specification: Phase 18: cli-vitest-shards"
description: "The cli-vitest job in spec-kit-check.yml is the slowest check after a spec-kit push: 627 s on run 43232523671, while the next slowest job took 197 s. One vitest process runs all 209 CLI test files. This phase splits that job into a three-entry matrix so three runners run one third of the files each, and no test file is removed."
trigger_phrases:
  - "cli vitest shards"
  - "phase 18 cli vitest shards"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 18: cli-vitest-shards

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 18 of 18 |
| **Predecessor** | 017-specs-artifact-tracking-decision |
| **Successor** | None |
| **Handoff Criteria** | A push shows three `CLI vitest project` jobs, all `success`, their collected `Test Files` counts sum to the 209 the unsharded list prints, and `actionlint` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 18** of the Test Cycle Speed specification.

**Scope Boundary**: The `cli-vitest` job in `.github/workflows/spec-kit-check.yml` gains a three-entry shard matrix and the matching `--shard` flag, and the two sk-code-ci reference files that count matrix workflows and cite job timeout lines are refreshed. No test, vitest config, other job, trigger, permission, concurrency block or timeout changes.

**Dependencies**:
- Phase 007's research ranked the serial CLI vitest, legacy-lane and runtime vitest work as its rank 1 cut and recorded the CLI vitest step as the longest of the three; the earlier phases of this parent split those three into separate jobs.
- The installed vitest is 4.1.12 and accepts `--shard` together with `--project`; three local shard runs below prove the combination.
- `actionlint` 1.7.12 and an authenticated `gh` are present in this checkout for the two verification commands.

**Deliverables**:
- A `cli-vitest` job that runs as three matrix entries, each running one third of the 209 CLI test files.
- The two sk-code-ci reference files, and their `.opencode` twins, still true about how many matrix workflows exist and which line each job timeout sits on.
- A pushed run that reports three `CLI vitest project` jobs.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `cli-vitest` job in `.github/workflows/spec-kit-check.yml` is the slowest check a spec-kit push waits on. In run 43232523671 its single `CLI vitest project` step ran 479 s of a 627 s job, and the next slowest job in that run, `Runtime vitest project`, took 197 s. The step runs all 209 CLI test files in one vitest process on one runner, so the job's wall clock is the whole project's run time rather than one third of it.

### Purpose
Run the same 209 test files as three matrix entries, each running one shard, so the job's wall clock is set by the slowest shard while every test still runs.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Local runs on `worktrees/350-test-ci-wait-cuts`, 2026-11-12, and CI reads from run 43232523671 on pull request 97:

```text
$ cd .skilled/skills/system-spec-kit/runtime/cli
$ npx vitest --version
vitest/4.1.12 darwin-arm64 node-v26.13.0
$ npx vitest list --config ../../vitest.config.ts --project cli --filesOnly | wc -l
209
$ npx vitest run --config ../../vitest.config.ts --project cli --shard=1/3 --reporter=dot
 Test Files  69 passed | 1 skipped (70)
      Tests  796 passed | 7 skipped (803)
  Duration  68.96s (transform 7.14s, setup 1.35s, import 11.30s, tests 293.33s, environment 5ms)
$ npx vitest run --config ../../vitest.config.ts --project cli --shard=2/3 --reporter=dot
 Test Files  69 passed | 1 skipped (70)
      Tests  1078 passed | 8 skipped (1086)
  Duration  195.52s (transform 8.76s, setup 1.11s, import 11.18s, tests 733.90s, environment 4ms)
$ npx vitest run --config ../../vitest.config.ts --project cli --shard=3/3 --reporter=dot
 Test Files  68 passed | 1 skipped (69)
      Tests  646 passed | 5 skipped (651)
  Duration  223.05s (transform 6.19s, setup 900ms, import 10.22s, tests 556.47s, environment 5ms)
$ cd "$(git rev-parse --show-toplevel)"
$ diff -q .opencode/skills/system-spec-kit/vitest.config.ts .skilled/skills/system-spec-kit/vitest.config.ts && find .opencode/skills/system-spec-kit/runtime/cli/tests -name '*.vitest.ts' | wc -l
209
$ for id in 43241006220 43232523671 43230480504 43227703634; do gh api repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/actions/runs/$id/jobs --jq '.jobs[] | select(.name=="CLI vitest project") | "\((.completed_at|fromdate)-(.started_at|fromdate))"'; done
465
627
499
384
$ gh api repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/actions/runs/43232523671/jobs --jq '.jobs[] | "\(.name) \((.completed_at|fromdate)-(.started_at|fromdate))s"'
Runtime vitest project 197s
Legacy module lanes and the bash validation suites 191s
Typecheck, import policy and test suites for the spec-kit packages 121s
CLI vitest project 627s
Doctor script test suites 162s
Runtime mirrors agree with their sources 78s
$ gh api repos/MichelKerkmeester/skilled-agent-harness_spec-driven-loops/actions/runs/43232523671/jobs --jq '.jobs[] | select(.name=="CLI vitest project") | .steps[] | "\(.name) \((.completed_at|fromdate)-(.started_at|fromdate))s"'
Set up job 1s
Run actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 63s
Setup Node 1s
Install and build the spec-kit packages 71s
Install ripgrep 7s
CLI vitest project 479s
Post Setup Node 0s
Post Run actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 0s
Complete job 0s
```

The three shard runs collected 70, 70 and 69 test files. Their sum is 209, the count the unsharded list prints, so the split covers every file once and no run reports a failure. The local commands use the `.skilled` twin; the `.opencode` config the CI job reads is byte-identical to it and its `runtime/cli/tests` tree holds the same 209 `*.vitest.ts` files. The shard durations are not even: 68.96 s, 195.52 s and 223.05 s on what is practically an even file count, so the split balances files and not time, and the slowest shard sets the time of a sharded job. These are local darwin arm64 runs on node v26.13.0; the CI runner is ubuntu-latest on node 22, so the seconds are not CI seconds.

The CI step durations explain where the 627 s goes: 63 s checkout, 71 s install and build, 7 s ripgrep, 479 s vitest, and the rest in setup and teardown. The four most recent runs that carried the job took 384 s, 465 s, 499 s and 627 s.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `strategy: fail-fast: false` and `matrix: shard: [1, 2, 3]` to the `cli-vitest` job in `.github/workflows/spec-kit-check.yml`.
- Append `--shard=${{ matrix.shard }}/3` to that job's existing `npx vitest run --config ../../vitest.config.ts --project cli` command, and rewrite the two-line comment above the step that says the project runs as one process.
- Keep `timeout-minutes: 51` and every other step, input and job in the workflow unchanged.
- Refresh `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` and `job-shape-rules.md`, plus their `.opencode` twins, so the matrix-workflow count and the moved timeout-line citations stay true.

### Out of Scope
- Rebalancing the shards by measured duration — the observed split balances file counts (70, 70 and 69) while the times were 68.96 s, 195.52 s and 223.05 s, so a time-balanced split needs per-file timings and a different mechanism.
- Raising the shard count above three, or changing the `cli` project's include list or parallelism — the three-shard split is the measured change, and a config change alters every local run.
- Changing any other job, step, timeout, trigger, permission or concurrency block — the other five jobs in this run finished in 197 s or less.
- Removing, skipping or rewriting any test — all 209 files still run.
- Caching, sparse checkout or trigger narrowing — other phases of this parent own those.

**Regression impact**: no test file and no assertion is removed, so the change removes no coverage. The one regression it can stop catching is cross-file interference between two suites that share a port, temp path or checked-in fixture: a pair that lands in different shards can stop racing. The current command already runs files in parallel (`fileParallelism: true`), so such a pair is already non-deterministic; the split narrows where the race can be observed. The three local shard runs passed with 0 failed, which is one sample.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/spec-kit-check.yml` | Modify | Add the three-entry shard matrix to `cli-vitest`, append the `--shard` flag, rewrite the comment that claims one process |
| `.skilled/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Modify | Change "Both matrix workflows" to three and move the `set -uo pipefail` citation from `:177` to `:181` |
| `.opencode/skills/sk-code/sk-code-ci/references/ci-workflow-standards.md` | Modify | The byte-identical twin of the row above |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Move the `legacy-lanes` timeout citation from `:185` to `:189` and `runtime-vitest` from `:223` to `:227` |
| `.opencode/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | The byte-identical twin of the row above |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `cli-vitest` job carries `strategy.fail-fast: false` and `matrix.shard: [1, 2, 3]` | `rg -c -F 'strategy:' .github/workflows/spec-kit-check.yml` prints 1, `rg -c -F 'shard: [1, 2, 3]' .github/workflows/spec-kit-check.yml` prints 1 and `actionlint .github/workflows/spec-kit-check.yml` exits 0 |
| REQ-002 | That job's vitest command appends `--shard=${{ matrix.shard }}/3`, and its `timeout-minutes: 51` is unchanged | `rg -c -F -- '--shard=${{ matrix.shard }}/3' .github/workflows/spec-kit-check.yml` prints 1 and `rg -c 'timeout-minutes: 51' .github/workflows/spec-kit-check.yml` prints 4 |
| REQ-003 | The three shard entries together run the same 209 files as the unsharded command, with no test removed | the three runs print `Test Files ... (70)`, `(70)` and `(69)`, the sum is the 209 `npx vitest list ... --filesOnly \| wc -l` prints, and no run reports a failure |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Both sk-code-ci references and their `.opencode` twins stay true: the matrix-workflow count names three, and the timeout citations point at the moved lines | `rg -n 'All three matrix workflows set it'` prints one line in each `ci-workflow-standards.md`; `rg -n 'spec-kit-check.yml:143'` and `rg -n 'spec-kit-check.yml:181'` print one line each; `sed -n '56,59p'` on each `job-shape-rules.md` prints `:98`, `:142`, `:189` and `:227` |
| REQ-005 | A pushed commit reports three `CLI vitest project` jobs, all successful, each inside the 51-minute timeout | `gh run view <run-id> --json jobs --jq '[.jobs[] \| select(.name \| startswith("CLI vitest project"))] \| length'` prints 3 and the same selection's conclusions print `["success"]` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `actionlint .github/workflows/spec-kit-check.yml` exits 0 after the edit.
- **SC-002**: The three shard runs collect 70, 70 and 69 files, summing to the 209 the unsharded list prints, with 0 failed tests.
- **SC-003**: A push reports three `CLI vitest project` jobs and every one concludes `success`.
- **SC-004**: `git diff -- .github/workflows/spec-kit-check.yml` shows changes only inside the `cli-vitest` job, and `rg -c -F 'strategy:'` on the file prints 1.
- **SC-005**: Both reference pairs are byte-identical after the edit (`diff -q` prints nothing), the matrix-workflow count names three, and the job and timeout counts still read as before.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | vitest 4.1.12 from the workspace lockfile accepts `--shard` with `--project` | A version bump that drops the flag fails the job at argument parsing | Three local shard runs proved the combination; the version is declared in `.skilled/skills/system-spec-kit/runtime/cli/package.json` |
| Risk | Shard durations are uneven: 68.96 s, 195.52 s and 223.05 s locally | The slowest shard, not one third, sets the new job time, so the wait saved can fall short of two thirds | Measure the three job durations on the pushed run; if one shard still dominates, re-plan a time-balanced split in its own packet |
| Risk | Three matrix entries repeat 141 s of fixed setup each (63 s checkout, 71 s install, 7 s ripgrep) | Runner minutes rise by at least the repeated 282 s of setup while wall clock falls | Costed and accepted: the operator-facing number is the wait, not the summed runner seconds |
| Risk | A test that relies on sharing one process with another file fails, or stops racing, under a shard | A red shard on the first push, or a cross-file race no longer observed | The three local runs passed with 0 failed; if CI differs, fix that test's isolation rather than revert the split |
| Risk | The strategy block moves the timeout lines cited in the two references | The reference index points at the wrong line | Move both citations and both twins in the same change, verified by `sed -n '56,59p'` and the `:181` grep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What are the three shard job durations on the CI runner? Decision: UNKNOWN until the orchestrator's push; the plan measures them before proposing any further change.
- Should the shard count or the split change if one shard dominates? Decision: deferred; the observed split balances file counts, not time, so that is a different mechanism and its own packet.
- Did any test fail only under a shard? Decision: no; all three local shard runs reported 0 failed, and the residual risk is the CI environment differing from this darwin arm64 machine.
<!-- /ANCHOR:questions -->

---
