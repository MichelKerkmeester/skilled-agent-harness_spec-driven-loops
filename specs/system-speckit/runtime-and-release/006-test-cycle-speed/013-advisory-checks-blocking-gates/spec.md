---
title: "Feature Specification: Phase 13: advisory-checks-blocking-gates"
description: "The Advisory Checks workflow runs its four steps with continue-on-error: true, so the job is always green. It is the only caller of .skilled/scripts/run-node-tests.mjs, and 13 gate-critical system-spec-kit suites run only there. This phase adds a blocking job for the 11 suites that pass locally and keeps the 2 that fail locally report-only by name."
trigger_phrases:
  - "advisory checks blocking gates"
  - "phase 13 advisory checks blocking gates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: advisory-checks-blocking-gates

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 17 |
| **Predecessor** | 012-advisor-suite-parallel-trial |
| **Successor** | 014-dead-runner-and-step-cleanup |
| **Handoff Criteria** | The `gate-critical` job runs the 11 suites that pass today with no `continue-on-error`, the 2 that fail today are named in `scratch/gate-critical-run.md` and stay report-only, and the workflow still has exactly four `continue-on-error: true` lines. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: `.github/workflows/advisory-checks.yml`, its row in `.github/workflows/README.md`, and the run record in this folder. No test, hook, runner or source file changes.

**Dependencies**:
- The 13 gate-critical `.test.mjs` suites under `.skilled/skills/system-spec-kit/runtime` and the dependencies they import.
- `npm --prefix .skilled/skills/system-spec-kit ci` and `npm --prefix .skilled/skills/system-spec-kit run build`, because the suites import the built `shared/dist/gate-3-classifier.js` and `js-yaml` from the spec-kit workspace.
- The pinned `actions/checkout` and `actions/setup-node` revisions already in the workflow.

**Deliverables**:
- A `gate-critical` job in `.github/workflows/advisory-checks.yml` with no `continue-on-error`.
- `scratch/gate-critical-run.md`, the 13-suite pass and fail record and the 11/2 split.
- An updated `advisory-checks.yml` row in `.github/workflows/README.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`.github/workflows/advisory-checks.yml` runs its four steps with `continue-on-error: true`, so the job is green even when a step fails. It is the only caller of `.skilled/scripts/run-node-tests.mjs`, and that runner discovers 13 gate-critical `.test.mjs` suites under system-spec-kit: the seven hook suites, four DSH mirror generators, the recorded-failure audit, and the stdin deadline suite. None of them can turn a check red. The largest, `spec-gate-core.test.mjs`, fails 50 tests on this machine today and the workflow still reports success.

### Purpose
Add a blocking job that runs the 11 gate-critical suites that pass locally, so a regression in them turns the check red; keep the 2 that fail locally in the report-only step and name them in the run record.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12 with Node v26.13.0.

```text
$ rg -c 'continue-on-error: true' .github/workflows/advisory-checks.yml
4

$ rg -n 'run-node-tests\.mjs' .github/workflows/
.github/workflows/advisory-checks.yml:40:          RUNNER=".skilled/scripts/run-node-tests.mjs"

$ for f in $(rg --files .skilled/skills/system-spec-kit/runtime -g '*.test.mjs' | sort); do out=$(node --test --test-reporter=tap "$PWD/$f" 2>&1); p=$(printf '%s\n' "$out" | sed -nE 's/^# pass ([0-9]+)$/\1/p' | tail -1); fl=$(printf '%s\n' "$out" | sed -nE 's/^# fail ([0-9]+)$/\1/p' | tail -1); printf '%s pass=%s fail=%s\n' "$f" "${p:-?}" "${fl:-?}"; done
.skilled/skills/system-spec-kit/runtime/cli/tests/sync-agents-dsh.test.mjs pass=3 fail=0
.skilled/skills/system-spec-kit/runtime/cli/tests/sync-prompts-dsh.test.mjs pass=3 fail=0
.skilled/skills/system-spec-kit/runtime/cli/tests/sync-runtime-mirrors.test.mjs pass=6 fail=0
.skilled/skills/system-spec-kit/runtime/cli/tests/sync-skills-dsh.test.mjs pass=5 fail=0
.skilled/skills/system-spec-kit/runtime/cli/tests/unactioned-recorded-failure-audit.test.mjs pass=1 fail=0
.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs pass=53 fail=3
.skilled/skills/system-spec-kit/runtime/tests/hooks/gate-3-menu-parity.test.mjs pass=17 fail=0
.skilled/skills/system-spec-kit/runtime/tests/hooks/permission-request-policy.test.mjs pass=2 fail=0
.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-claude.test.mjs pass=13 fail=0
.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-codex.test.mjs pass=15 fail=0
.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs pass=57 fail=50
.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-devin.test.mjs pass=17 fail=0
.skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-prebind.test.mjs pass=17 fail=0
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run the 13 gate-critical `.test.mjs` suites locally and record pass and fail per suite in `scratch/gate-critical-run.md`.
- Add a blocking `gate-critical` job to `.github/workflows/advisory-checks.yml` that runs the 11 suites that pass, with `npm ci` and a build first, and no `continue-on-error`.
- Keep the four report-only steps and their `continue-on-error: true` lines unchanged.
- Name the two suites that fail locally and keep them out of the blocking job.
- Update the workflow header comment and its row in `.github/workflows/README.md` so neither claims every check is report-only.

### Out of Scope
- Fixing `hook-stdin-deadline.test.mjs` or `spec-gate-core.test.mjs` - they fail today, so the phase leaves them report-only and names them.
- Deleting or narrowing the report-only node test step or `.skilled/scripts/run-node-tests.mjs` - that is the successor phase's cleanup, and this phase changes no runner.
- Adding branch protection or a required-check ruleset - the job turns red; whether the repository requires it is a settings change outside the tree.
- Caching or sparse checkout for the new job - the phase restores enforcement and accepts the added wait.

**Regression exposure**: none. The change removes no check and changes no test. It adds a blocking job for the 11 suites that pass today; the 2 that fail today stay report-only and are named. The new job's explicit 11-path list is the one new maintenance risk: a later gate-critical suite will run report-only until it is added to the list.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/workflows/advisory-checks.yml` | Modify | Add the blocking `gate-critical` job and revise the header comment |
| `.github/workflows/README.md` | Modify | Replace "Reports without gating" with the blocking job description |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/013-advisory-checks-blocking-gates/scratch/gate-critical-run.md` | Create | Per-suite pass and fail record for the 13 gate-critical suites |
> Correction after the build: `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs` failed only because the build ran with `AI_SESSION_CHILD=1` and `SYSTEM_SPEC_GATE_ENFORCE=0` set. With both unset they pass, 56 of 56 and 107 of 107 with 3 skipped. The blocking job therefore runs all 13 suites: 265 tests, 262 pass, 0 fail.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run all 13 gate-critical suites locally and record pass and fail per suite. | `scratch/gate-critical-run.md` has 13 suite rows, 11 `pass` and 2 `fail`, and the two failing files are `hook-stdin-deadline.test.mjs` and `spec-gate-core.test.mjs`. |
| REQ-002 | Add a `gate-critical` job to `.github/workflows/advisory-checks.yml` that runs only the 11 suites that pass and carries no `continue-on-error` at job or step level. | The job block prints 0 for `continue-on-error`, 11 `.test.mjs` paths, and no `hook-stdin-deadline` or `spec-gate-core`. |
| REQ-003 | Install the spec-kit workspace dependencies and build the shared package before the job runs the suites, so a fresh runner executes them instead of skipping. | The job block holds `npm --prefix .skilled/skills/system-spec-kit ci` and `npm --prefix .skilled/skills/system-spec-kit run build`; the local 11-path run prints `# fail 0`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Keep the four report-only steps and their `continue-on-error: true` lines unchanged. | `rg -c 'continue-on-error: true' .github/workflows/advisory-checks.yml` prints 4. |
| REQ-005 | Update the workflow header comment and the `.github/workflows/README.md` row so neither says every check is report-only. | `rg -n 'Reports without gating' .github/workflows/README.md` prints nothing, and the workflow header names `gate-critical`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/gate-critical-run.md` records 13 suites: 11 pass and 2 fail, with both failing names present.
- **SC-002**: The `gate-critical` job block has 11 `.test.mjs` paths and 0 `continue-on-error`.
- **SC-003**: The workflow still has exactly four `continue-on-error: true` lines, all on the report-only steps.
- **SC-004**: The local run of the 11 paths prints `# fail 0`.
- **SC-005**: No test, hook, runner or source file changes; the diff is the workflow, its README row and the scratch record.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The spec-kit workspace's `npm ci` and `tsc --build` on the runner | The job fails before the suites start | The job runs both steps and fails loudly; the local dry run uses the same two commands |
| Dependency | Node 22 in CI; Node 26.13.0 locally | A suite that passes locally may fail on CI | The job uses the workflow's existing `node-version: '22'`; the first CI run confirms, and a suite that fails only on 22 moves to the report-only list by name |
| Risk | The explicit 11-path list goes stale when a new gate-critical suite appears | Medium: the new suite runs report-only and cannot block | The scratch record keeps the 13-file census and the two exclusions; adding a suite means updating both the record and the job |
| Risk | The new job duplicates the 11 suites already run by the report-only step and pays a second checkout and install | Low: added wait, no time saved | Accepted; the phase's purpose is enforcement, and removing the report-only step is the successor phase's scope |
| Risk | The advisory job has no install step, so `run-node-tests.mjs` skips the node suites when `.skilled/node_modules` or `.opencode/node_modules` is absent | Medium: the two failing suites may not be observed on a fresh runner | Named as a known limitation; the new job installs its own dependencies, and the report-only step's repair is out of scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the 11-suite list pass on the CI Node 22 as it does on local Node 26.13.0? Decision: unknown until the first CI run; a failure moves that suite to the report-only list by name.
- Why does `spec-gate-core.test.mjs` fail 50 tests locally? Decision: UNKNOWN; the phase does not investigate or fix it, because it stays report-only.
- Should the report-only step get an install so it stops skipping on a fresh runner? Decision: no; the phase adds the blocking job, and the report-only step's cleanup belongs to the successor phase.
- Should the repository require the new job as a status check? Decision: no; branch protection is a settings change outside the tree, and the job turns red without it.
<!-- /ANCHOR:questions -->

---
