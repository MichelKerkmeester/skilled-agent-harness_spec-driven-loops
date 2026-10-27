---
title: "Feature Specification: Phase 13: killer-test-spawn-race"
description: "One killer test failed once in 40 CI runs because the test waited for the target process to spawn, not for its SIGTERM handler to be installed. This phase makes the signal-handling targets report readiness and the tests wait for it."
trigger_phrases:
  - "killer test spawn race"
  - "phase 13 killer test spawn race"
  - "session relaunch killer flake"
  - "target-signal ENOENT"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: killer-test-spawn-race

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/235-review-mode-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 011-ci-health-followups |
| **Successor** | None |
| **Handoff Criteria** | The killer suite passes 10 runs in a row, and the same suite passes under a forced 600 ms handler delay that fails the old waits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the CI workflow efficiency packet. It fixes one flaky test found in the CI run history after phase 011 closed.

**Scope Boundary**: `.skilled/hooks/session-relaunch/tests/killer.test.cjs` only. The killer itself (`lib/killer.cjs`) does not change.

**Dependencies**: None beyond the node test runner.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`killer keeps the record armed when the target exits during its grace period` failed once in 40 CI runs (run 40571619125, Ubuntu) with `ENOENT: no such file or directory, open '/tmp/session-relaunch-killer-*/target-signal'`. The test waits on `target.once('spawn')`, which fires when the OS starts the process, before the `-e` script has run `process.on('SIGTERM', ...)`. On a slow runner the killer signals the target first, the target dies by the default action, and no signal file is written.

### Purpose
Make the tests wait for the target's SIGTERM handler, so the order of events no longer depends on runner speed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
With a 600 ms busy wait placed ahead of the handler in the target script (a scratch copy outside the repo), the test file before the fix:

```text
$ node --test --test-name-pattern='target exits during its grace period|killer signals an idle target and releases' killer.before.cjs
✖ killer signals an idle target and releases its lock (388.662959ms)
✖ killer keeps the record armed when the target exits during its grace period (487.386375ms)
  Error: ENOENT: no such file or directory, open '.../session-relaunch-killer-eLDpeb/target-signal'
ℹ tests 2  ℹ pass 0  ℹ fail 2
```

The unforced file passes 64 of 64 in 38.2 s on the default node.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `startTarget` and `startCountingTarget` write a ready line to stdout after `process.on('SIGTERM')` is registered.
- Add `waitForTargetReady` with a clear timeout and exit error, and use it in place of `once('spawn')` for those two helpers' targets.

### Out of Scope
- `startPersistentProcess` targets and `sleep` children - they install no handler, so the default action is the outcome the tests expect and no race exists.
- Any change to `lib/killer.cjs` - the killer behaves correctly; only the test ordering was unsound.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/tests/killer.test.cjs` | Modify | Ready line in two target scripts, one shared wait helper, 40 `once('spawn')` waits replaced |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A signal-handling target reports readiness only after its SIGTERM handler is installed, and tests wait for that report | Under a 600 ms handler delay the fixed file passes the two probe tests that the old file fails with ENOENT |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A target that never becomes ready fails the test with a message naming the pid and the timeout | `waitForTargetReady` rejects on exit, error and timeout, each with a distinct message |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/killer.test.cjs` passes 10 runs in a row on the default node.
- **SC-002**: The forced-delay copy of the old file fails and the forced-delay copy of the new file passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node stdout pipe to the target | Low: a pipe nobody reads can fill | The target writes one short line, and the helper stops listening after it |
| Risk | A new wait that never resolves hangs a test | Med | A 15 s timeout rejects with the pid and the limit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---
