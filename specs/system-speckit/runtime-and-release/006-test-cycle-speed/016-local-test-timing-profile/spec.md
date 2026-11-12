---
title: "Feature Specification: Phase 16: local-test-timing-profile"
description: "No one has timed the three local test commands since the latest changes, so the only figures are stale: research section 10 records the deep-loop suite near 505 seconds and the spec-kit cli lane near 200. This phase runs each runtime's `npm test` once and records wall seconds and exit status in `scratch/local-test-timings.md`, changing no code."
trigger_phrases:
  - "local test timing profile"
  - "phase 16 local test timing profile"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: local-test-timing-profile

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/350-test-ci-wait-cuts` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 17 |
| **Predecessor** | 015-hook-suite-job-split |
| **Successor** | 017-specs-artifact-tracking-decision |
| **Handoff Criteria** | `scratch/local-test-timings.md` holds one row per runtime with its command, wall seconds and exit status, and the packet validator prints `RESULT: PASSED`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the Shorten the wait after a push by rearranging CI checks and removing dead test infrastructure specification.

**Scope Boundary**: the three `npm test` invocations and one evidence file. No build, and no change to any test, assertion, config, workflow, hook, `package.json` or source file.

**Dependencies**:
- The `node_modules` already installed in each of the three runtimes. A missing install stops the command before any test runs, and the phase records that status instead of installing.
- Node 26.13.0, `npm` and `/usr/bin/time -p`, all present on the measuring machine at planning time (Measured Behavior).

**Deliverables**:
- One timed run of each runtime's declared `npm test`, with the exit status each returned.
- `scratch/local-test-timings.md`, holding one row per runtime: command, wall seconds, exit status.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The three local `npm test` commands are what an operator waits on before a push, and no one has timed them since the latest changes. Research section 10 question 4 records the gap and carries only older figures, the deep-loop suite near 505 seconds and the spec-kit cli lane near 200, taken before the latest changes. A later decision about local test speed therefore rests on numbers that may no longer describe the suites.

### Purpose
Record one current wall-clock measurement and exit status per runtime, so the next local test cut is aimed at a measured cost rather than a stale estimate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-12.

```text
$ for p in .skilled/skills/system-spec-kit/runtime .skilled/skills/system-skill-advisor/runtime .skilled/skills/system-deep-loop/runtime; do printf '%s\t' "$p"; node -p "require('./$p/package.json').scripts.test"; done
.skilled/skills/system-spec-kit/runtime	node scripts/run-tests.mjs
.skilled/skills/system-skill-advisor/runtime	vitest run
.skilled/skills/system-deep-loop/runtime	vitest run --no-coverage

$ ls -A specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile/scratch
.gitkeep

$ node --version
v26.13.0

$ /usr/bin/time -p true 2>&1
real 0.00
user 0.00
sys 0.00

$ rg -n 'deep-loop suite near 505 seconds|cli lane near 200' specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/research/research.md
160:4. How long do the local `npm test` runs take now, and how often does the operator wait on them? Neither lineage measured this. The earlier phases put the deep-loop suite near 505 seconds and the cli lane near 200.

$ rg -n 'deep-loop npm test' specs/system-speckit/runtime-and-release/006-test-cycle-speed/002-fresh-timing-profile/spec.md
67:deep-loop npm test        504-511 s   173 files, 2873 tests
```

The three scripts in this block are the commands the plan and tasks name. Section 2 quotes the 505 and 200 figures from it, and the 504-511 s line is the earlier phase's record, older than the latest changes. The Node and timer lines are the interpreter and the wall-clock source the plan uses.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Time `npm test` once in `.skilled/skills/system-spec-kit/runtime`, the command its `package.json` declares, and record `real` seconds and the exit status.
- Time `npm test` once in `.skilled/skills/system-skill-advisor/runtime` and in `.skilled/skills/system-deep-loop/runtime`, with the same record for each.
- Create `scratch/local-test-timings.md` with one row per runtime: command, wall seconds, exit status.
- Record the run conditions in that file: the date, the Node version, one run per suite and an otherwise idle machine, so a later reader can tell what the seconds describe.

### Out of Scope
- Any code, test, assertion, config, workflow, hook or `package.json` change - the phase measures what exists today.
- A build before timing - a build is a different command and would change what the number describes.
- Repeats, a median or per-file attribution - one run per suite is the ask, and variance belongs to a later trial with its own gate.
- Deciding a cut from the numbers - this phase records, and a cut needs its own phase and its own evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile/scratch/local-test-timings.md` | Create | One row per runtime: command, wall seconds, exit status |

**Regression the change stops catching**: none. The phase changes no test, assertion, config or workflow; it runs each command as declared and writes one record. A suite that fails during the measurement is recorded as a failure, so a red suite is surfaced rather than masked.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each runtime's declared `npm test` runs once under a wall-clock timer | `scratch/local-test-timings.md` holds one row for each of the three runtime paths, and every row's command cell reads `npm test` |
| REQ-002 | Every row records the wall seconds and the exit status the run returned | All three data rows carry a runtime path, the command `npm test`, a wall figure in seconds and an integer exit status, where 0 is pass and any other value is fail |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The phase changes no tracked file under `.skilled/skills` | `git status --porcelain --untracked-files=no -- .skilled/skills` prints the same six pre-existing modifications as the setup baseline and gains no path |
| REQ-004 | A later reader can tell what the seconds describe | The file's header names the date, the Node version, one run per suite and the idle-machine condition, and `rg -c 'one run per suite' scratch/local-test-timings.md` prints `1` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/local-test-timings.md` holds exactly three data rows, one per runtime: `rg -c '^\| \.skilled/skills/(system-spec-kit|system-skill-advisor|system-deep-loop)/runtime \| npm test \| [0-9]+(\.[0-9]+)? \| [0-9]+ \|$' scratch/local-test-timings.md` prints `3`.
- **SC-002**: No tracked file under `.skilled/skills` changes: `git status --porcelain --untracked-files=no -- .skilled/skills | wc -l` prints `6`, the same count and the same paths as at setup.
- **SC-003**: The packet validates: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/runtime-and-release/006-test-cycle-speed/016-local-test-timing-profile --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Installed `node_modules` in the three runtimes, Node 26.13.0 and `/usr/bin/time -p` | A missing install or timer stops the run before any test starts | Record the failure and its exit status; installing or substituting a timer is a separate action, outside this phase |
| Risk | The spec-kit wrapper bounds each lane at 600 s (`DEFAULT_TEST_RUN_TIMEOUT_MS` in `scripts/run-tests.mjs`), so a lane over the bound exits 124 | Medium: the number then measures the bound, not the suite | Record exit 124 as a failure, name the lane from the `[test-bound]` line, and do not raise the bound in this phase |
| Risk | Another build or vitest process skews a single run | Medium: a wall figure that does not describe a quiet machine | Confirm `pgrep -fl vitest` prints nothing before each run, record the idle-machine condition, and label the number as one run rather than a median |
| Risk | A suite fails on stale dist or fixtures and its failure time is read as a suite time | Medium: a misleading baseline for a later phase | Record the exit status; a nonzero row is marked fail and is not used as a baseline |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- One run per suite or three? Decision: one. The ask is a current number, and repeats are a trial with its own gate.
- Time `npm test` or the inner command? Decision: `npm test`. It is what the operator types and what each `package.json` declares.
- Build before timing? Decision: no. A build changes what is measured and is out of scope.
<!-- /ANCHOR:questions -->

---
