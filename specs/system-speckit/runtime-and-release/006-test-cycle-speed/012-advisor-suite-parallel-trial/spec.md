---
title: "Feature Specification: Phase 12: advisor-suite-parallel-trial"
description: "The advisor default suite runs all 161 test files one at a time because its vitest config sets fileParallelism to false, and the suite step took 309 s in CI run 43168892360. This phase trials a parallel project beside a serial project that keeps the 12 files touching the daemon, socket, lease or skill-graph database one at a time, and keeps the change only when three runs in a row pass and the suite is at least 10 percent faster."
trigger_phrases:
  - "advisor suite parallel trial"
  - "phase 12 advisor suite parallel trial"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: advisor-suite-parallel-trial

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
| **Phase** | 12 of 17 |
| **Predecessor** | 011-sparse-checkout-rollout |
| **Successor** | 013-advisory-checks-blocking-gates |
| **Handoff Criteria** | `scratch/trial-results.md` names the baseline, the three trial times, each run's pass or fail, the saved percentage and the decision, and `vitest.config.ts` matches that decision. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: The advisor runtime's vitest config and the trial evidence in this folder. No test, workflow, hook or other source file changes.

**Dependencies**:
- The built advisor runtime and the skill-graph database the default suite reads, both built by the steps `skill-advisor-stress.yml` runs.
- CI run 43168892360, the latest successful run of that workflow at planning time, as the published 309 s reference.

**Deliverables**:
- `vitest.config.ts` with a `parallel` project and a `serial` project, kept only when the gate passes.
- `scratch/trial-results.md`, holding the baseline, the three trial runs and the decision.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
All 161 advisor test files run one at a time, because `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts:40` sets `fileParallelism: false`. The default-suite step took 309 s on the latest successful CI run, and it is the longest step in the advisor job. Every file waits for the file before it even though only a small group holds a shared daemon, socket, lease or skill-graph database.

### Purpose
Run the independent files side by side while the 12 files that touch one of those shared surfaces stay serial, and keep the change only when three consecutive runs pass and the median is at least 10 percent faster than the baseline.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12. Run 43168892360 is the latest successful run of `skill-advisor-stress.yml` at that time.

```text
$ rg -n 'fileParallelism' .skilled/skills/system-skill-advisor/runtime/vitest.config.ts
40:    fileParallelism: false,

$ gh run view 43168892360 --json jobs --jq '.jobs[].steps[] | select(.name == "Run the default suite") | "Run the default suite: \(((.completedAt|fromdateiso8601) - (.startedAt|fromdateiso8601))) s, \(.conclusion)"'
Run the default suite: 309 s, success

$ gh run view --job 131017154296 --log | perl -pe 's/\^\[\[[0-9;]*m//g' | rg 'Test Files|Tests  |Duration' | sed -E 's/^.*Z //' | tail -3
 Test Files  161 passed (161)
      Tests  1387 passed | 8 skipped (1395)
   Duration  308.84s (transform 2.14s, setup 1.14s, import 11.14s, tests 281.26s, environment 11ms)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `parallel` project and a `serial` project to `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts`, using the `sequence.groupOrder` pattern in `.skilled/skills/system-deep-loop/runtime/vitest.config.ts`.
- Keep the 12 files that bind the daemon socket, spawn the launcher, take the lease or open the skill-graph database in the serial project.
- Record a baseline, three trial runs, the median, the saving and the decision in `scratch/trial-results.md`.
- Keep the split only when all three runs pass and the median is at least 10 percent below the baseline; otherwise restore the single serial setting and record the numbers.

### Out of Scope
- Any test file or assertion - the trial runs all 161 files unchanged.
- The stress suite config - it replaces the default set, and its serial setting is not part of this trial.
- CI workflow files - `skill-advisor-stress.yml` already runs `npm test` against this config, so a kept change reaches CI without editing it.
- A worker cap - phase 5 found none needed, and this trial measures the default.

**Regression exposure**: none. Every one of the 161 test files still runs with its assertions unchanged, and the 12 files that hold a shared surface keep the serial order they have today. A file that leaks shared state fails a trial rather than passing it, so the change stops catching none; the three-run gate is the backstop for the classification.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/vitest.config.ts` | Modify | Replace the single serial config with a `parallel` project and a `serial` project |
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` | Create | Baseline, three trial runs with pass or fail, median, saving and decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The advisor suite runs as two vitest projects: 149 files in `parallel`, 12 shared-state files in `serial`, and the serial project runs after the parallel one. | `vitest list --project parallel --filesOnly` counts 149 files, `--project serial` counts 12, and both projects declare a `sequence.groupOrder` with serial higher. |
| REQ-002 | Every test file and test still runs. | `vitest list --filesOnly` prints 161 before and after the change, and each trial's summary reports the baseline's `Test Files` total with no failures. |
| REQ-003 | Three consecutive trial runs pass. | The `Trial 1`, `Trial 2` and `Trial 3` rows in `scratch/trial-results.md` each say `pass`, and no run's summary holds a failure. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The change is kept only when the median of the three runs is at least 10 percent below the baseline; otherwise the config returns to `fileParallelism: false`. | The `Saved:` percentage and `Decision:` row agree with the config's `fileParallelism` lines, and the gate check prints `GATE CONSISTENT`. |
| REQ-005 | The evidence file records the baseline, the three times, each run's pass or fail, the median and the decision. | `rg -c '^(Baseline|Median|Saved|Decision):' specs/system-speckit/runtime-and-release/006-test-cycle-speed/012-advisor-suite-parallel-trial/scratch/trial-results.md` prints 4. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The unmodified suite passes once before the edit, and the three trial runs pass after it with the same `Test Files` total as the baseline.
- **SC-002**: `Saved:` is at least `10.0 %` with three passing runs and the decision is Keep, or the gate failed and the decision is Revert with the config back to the single serial setting.
- **SC-003**: `vitest list --filesOnly` prints 161 before and after the change.
- **SC-004**: No file under `.skilled/skills/system-skill-advisor/runtime/tests` changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Built advisor runtime and the skill-graph database | The suite fails at import or reads an empty graph | Run `npm run build` and the trusted `skill_graph_scan` before the baseline |
| Dependency | Node and the runtime's installed dev dependencies | `npm test` cannot start | The suite runs locally today; `vitest --version` prints `vitest/4.1.12` |
| Risk | A shared-state file is classified parallel by mistake | High: intermittent failures that look like a bad trial | The 12-file serial list, three consecutive passes, and a revert on any failure |
| Risk | Timing noise from another build or a loaded machine | Medium: the 10 percent gate reads the wrong number | Baseline and trials back to back on one machine; record vitest's own `Duration` beside `real` |
| Risk | A CI runner with fewer cores gains less than the laptop | Medium: the kept change saves less in CI than here | The local gate decides; the first CI run after the push records the step time, and a figure below 10 percent reopens the decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Local or CI for the three runs? Decision: local. `npm test` is the command CI runs, and three repeats beside one baseline are reproducible on one machine; each CI repeat would cost a push.
- Explicit paths or globs for the serial list? Decision: explicit paths. The `launcher-*` and `handlers/skill-graph-*` globs also match pure unit tests such as `launcher-idle-timeout` and `handlers/skill-graph-listing`, which need no serial order.
- What happens when the saving lands within two points of 10 percent? Decision: the rule stands. Below `10.0` percent is a revert, and the number is recorded rather than explained away.
<!-- /ANCHOR:questions -->

---
