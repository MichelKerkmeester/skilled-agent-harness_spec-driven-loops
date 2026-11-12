---
title: "Feature Specification: Phase 20: test-speed-followups"
description: "Three loose ends from the test speed work: one dropped registry connection failed a whole CI run, two tests race a fixed deadline against process start, and five test files leave their temp folders behind on every run."
trigger_phrases:
  - "test speed followups"
  - "phase 20 test speed followups"
  - "npm ci retry wrapper"
  - "test temp folder leak"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 20: test-speed-followups

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/357-test-speed-followups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 20 of 20 |
| **Predecessor** | 019-local-test-speedups |
| **Successor** | None |
| **Handoff Criteria** | Every check on the pull request passes, with the hook deadline suite back in the blocking job |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 20** of the Test Cycle Speed specification.

**Scope Boundary**: Three reliability fixes the earlier phases found and left open. No test is removed and no assertion is loosened.

**Dependencies**:
- Phase 13, which took `hook-stdin-deadline.test.mjs` out of the blocking job after it lost a timing race.
- Phase 19, whose fsync skip made a deep-loop checkpoint test fail once in five runs.

**Deliverables**:
- An install retry for every `npm ci` in `spec-kit-check.yml`.
- Two tests whose deadline no longer depends on how fast a child process starts.
- Five test files that remove the temp folders they create.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A red check that a rerun turns green costs the operator a second wait of several minutes. One `main` run failed because `npm ci` lost a registry connection in one of three shards. Two tests compare a fixed deadline with the time a child process takes to start, so a busy host fails them. Five test files also create temp folders and never remove them, and the OS temp folder now holds 41,171 entries.

### Purpose
A lost download, a slow process start and an old temp folder no longer turn a check red or slow a run.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ gh run view 43275933572 --log-failed   (Spec-Kit Check on main, commit 4842e192cd)
CLI vitest project (2)  Install and build the spec-kit packages  npm error code ECONNRESET
CLI vitest project (2)  Install and build the spec-kit packages  npm error syscall read
CLI vitest project (2)  Install and build the spec-kit packages  npm error network read ECONNRESET

$ npx vitest run --project serial   (deep-loop runtime, with the fsync skip, one failure in five runs)
 FAIL  |serial| tests/unit/fanout-run.vitest.ts > fanout-run.cjs — persisted wait checkpoint > resumes a future checkpoint before dispatching lineages
AssertionError: expected -1 to be greater than or equal to 0
 > tests/unit/fanout-run.vitest.ts:4838:25

$ T=$(node -p 'require("os").tmpdir()'); for p in message-contract hf-local-readiness inline-gate-renderer dist-freshness speckit-test-db; do echo "$p $(ls "$T" | grep -c "^$p-")"; done; ls "$T" | wc -l
message-contract 3145
hf-local-readiness 1284
inline-gate-renderer 404
dist-freshness 230
speckit-test-db 3346
   41171
```
The runner reads a wait checkpoint whose deadline has passed as expired and logs no `resume_waiting` event (`fanout-run.cjs`, `normalizeWaitCheckpoint`). The test set that deadline 800 ms ahead, so a child that took longer to start found it expired. The hook test wrote its late payload 800 ms after the spawn, while the hook's 500 ms deadline runs from the moment it starts reading. A hook that needed more than 300 ms to start received the payload in time.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a wrapper that repeats a failed `npm ci` up to three times, and call it from all 17 install lines in `spec-kit-check.yml`. Without it one dropped connection fails the job.
- Set the checkpoint deadline in the fan-out resume test 5,000 ms ahead.
- Write the late payload in the hook deadline test only once the latest allowed exit has passed, and cancel the write when the hook has already exited.
- Put `hook-stdin-deadline.test.mjs` back into the blocking `gate-critical` job.
- Remove the temp folders that five test files create.

### Out of Scope
- A retry in the other workflows - only `spec-kit-check.yml` has failed this way, and its three shards make a lost download three times as likely.
- The three `speckit-test-db` folders each lane still leaves - the setup file already removes its folder, so the leak is in a path this phase did not trace.
- The `session-relaunch-wrapper` folders - another session is working on those tests.
- Deleting the 41,171 existing entries - that is the operator's machine state.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/scripts/npm-ci-retry.sh` | Create | Repeats a failed `npm ci` up to three times |
| `.github/scripts/tests/npm-ci-retry.test.sh` | Create | Four cases against a stand-in npm |
| `.github/workflows/spec-kit-check.yml` | Modify | 17 install lines call the wrapper, one step runs its test, two path filters name both files |
| `.github/workflows/advisory-checks.yml` | Modify | The hook deadline suite returns to the blocking job |
| `.github/workflows/README.md` | Modify | The suite count and the retry |
| `.skilled/skills/sk-code/sk-code-ci/references/job-shape-rules.md` | Modify | Four cited line numbers |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | The checkpoint deadline |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | Modify | The late write |
| `.skilled/skills/sk-git/scripts/lib/message-contract.test.mjs` | Modify | Removes its temp repositories |
| `.skilled/skills/system-spec-kit/runtime/tests/embedders/hf-local-client.vitest.ts` | Modify | Removes its temp folders |
| `.skilled/skills/system-spec-kit/runtime/tests/dist-freshness.vitest.ts` | Modify | Removes its temp folders |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/inline-gate-renderer.vitest.ts` | Modify | Removes its temp folders |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-authority-composition.vitest.ts` | Modify | Removes its temp folders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A failed `npm ci` is repeated, and three failures still fail the step | `bash .github/scripts/tests/npm-ci-retry.test.sh` prints `passed: 4, failed: 0` |
| REQ-002 | The hook deadline suite passes on a loaded host | Six copies started together, twice, give 12 exit codes of 0 |
| REQ-003 | The fan-out resume test passes | `npx vitest run tests/unit/fanout-run.vitest.ts -t "persisted wait checkpoint"` prints `3 passed` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The five patched test files leave no temp folder | The count of their prefixes in the OS temp folder is the same before and after a run |
| REQ-005 | The hook deadline suite blocks again | `grep -c 'hook-stdin-deadline.test.mjs' .github/workflows/advisory-checks.yml` prints 1, inside the `gate-critical` step |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every check on the pull request passes, including `gate-critical` with 13 suites.
- **SC-002**: `actionlint` exits 0 on both edited workflows and `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The npm registry | Three failed attempts still fail the job | The wrapper exits with the last status, so a real outage stays visible |
| Risk | A retry hides an install that fails for a real reason | Low: a broken lockfile fails three times and costs about 20 s more | The wrapper prints each failed attempt with its status |
| Risk | The late write in the hook test now rarely reaches a live hook | Low: the hook has exited by then | The exit bound of 2,500 ms still fails a hook that keeps reading, and the first test in the file proves the deadline itself |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which path leaves three `speckit-test-db` folders per lane although the setup file removes its folder? Not traced in this phase.
<!-- /ANCHOR:questions -->

---
