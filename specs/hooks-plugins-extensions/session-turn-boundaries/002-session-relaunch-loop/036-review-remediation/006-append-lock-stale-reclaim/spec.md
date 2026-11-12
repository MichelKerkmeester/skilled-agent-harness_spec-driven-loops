---
title: "Feature Specification: Phase 6: append-lock-stale-reclaim"
description: "Phase 6 replaces the check-then-act stale append-lock reclaim in relaunch-core.cjs with a reclaim that one waiter at a time runs under a reclaim directory, reading the lock's age again before removal, so waiters cannot both acquire one lock, and adds the two-waiter and eight-waiter regression cases."
trigger_phrases:
  - "append lock stale reclaim"
  - "phase 6 append lock stale reclaim"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: append-lock-stale-reclaim

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-subagent-guard-cancel-consume |
| **Successor** | 007-loop-start-record-cleanup |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with cases where two waiters and eight waiters never hold the lock together. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: The stale-lock reclaim inside `withAppendLock`. The wait bound, the callers and the record format are not changed.

**Dependencies**:
- Phase 002 edits the same file and lands first.

**Deliverables**:
- A reclaim that runs under a reclaim directory and reads the lock's age again, with tests for two and for eight waiters on one stale lock.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`withAppendLock` at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1397` reclaims a stale append lock by reading its age and then calling `fs.rmdirSync(lockPath)` at line 1413. That is check-then-act. Two waiters can both read one lock as stale, the first removes it and takes the lock, and the second removes that fresh lock and takes it too, so two writers change one record.

### Purpose
Let one waiter at a time judge and remove a stale lock directory, so waiters can never hold the same append lock at once.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'APPEND_LOCK_STALE_MS|rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs
27:const APPEND_LOCK_STALE_MS = 10000;
1411:        if (ageMs > APPEND_LOCK_STALE_MS) {
1413:            fs.rmdirSync(lockPath);
1431:        fs.rmdirSync(lockPath);
```

Line 27 sets the stale age to 10000 ms. The stale check at line 1411 guards the reclaim removal at line 1413, which removes the live lock path after another waiter may already have created a fresh directory there. The removal at line 1431 is the release path and runs only when this waiter holds the lock.
<!-- /ANCHOR:measured-behavior -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the reclaim removal at `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1413` with a reclaim under `<lockPath>.reclaim` that reads the lock's age again and removes the lock only when it is still stale.
- Add a regression case with two waiters on one stale lock to `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs`.
- Keep the `APPEND_LOCK_WAIT_MS` bound and the run-without-lock fallback unchanged.

### Out of Scope
- The wait bound and the run-without-lock fallback, because finding 6 changes only the reclaim step.
- The callers of `withAppendLock`, because the signature and the return value stay the same.
- The lock file format and the record format, because the lock stays an empty directory beside the log.
- A new module, because one more exclusive directory inside `withAppendLock` is enough.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/hooks/session-relaunch/lib/relaunch-core.cjs | Modify | Reclaim the stale append lock by renaming it to a private path, checking identity and removing that path |
| .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs | Modify | Add a case where two waiters on one stale lock never hold the lock together |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A waiter that finds a stale `<logPath>.lock` takes `<logPath>.lock.reclaim`, reads the lock's age again while holding it and removes the lock only when it is still stale. Verify: `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1. |
| REQ-002 | Two waiters, and eight waiters, that meet one stale append lock never hold the lock together. Verify: `node --test --test-name-pattern 'waiters never hold the append lock together' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with two passing cases. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The wait bound stays at 2000 ms. Verify: `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line. |
| REQ-004 | The lock path is removed in two places only: the reclaim, while the reclaim directory is held and the age was read again, and the release, when this waiter holds the lock. Verify: `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2. |
| REQ-005 | A lock for a relaunch record creates no lock directory inside a state directory that is a symlink or is owned by another account. `withStateLock` runs the callback without a lock, and the callback's own directory check then refuses. `withAppendLock` keeps taking its lock for a handoff note in a linked directory. Verify: `node --test --test-name-pattern 'unsafe state directory gets no lock directory' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -c 'const reclaimPath' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 1.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with cases where two waiters and eight waiters never hold the lock together.
- **SC-003**: `rg -c 'rmdirSync\(lockPath\)' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints 2, the reclaim and the release.
- **SC-004**: `rg -n 'APPEND_LOCK_WAIT_MS = 2000' .skilled/hooks/session-relaunch/lib/relaunch-core.cjs` prints one line.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `fs.mkdirSync` as an exclusive create, already used for the lock itself | No way to make the reclaim exclusive | Use the same call for the reclaim directory and add no package |
| Risk | A waiter removes a fresh lock that another waiter created after the stale check | Med | Read the lock's age again while holding the reclaim directory, so only one waiter at a time judges and removes |
| Risk | A reclaim directory left by a killed waiter blocks later reclaims | Low | A waiter removes a reclaim directory older than `APPEND_LOCK_STALE_MS` before it retries |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: The change adds one directory create, one stat and two removals per stale lock, and the wait bound `APPEND_LOCK_WAIT_MS` is unchanged.
- **NFR-P02**: N/A: No throughput target applies to a local hook helper.

### Security
- **NFR-S01**: N/A: The reclaim reads no credential and adds no authentication path.
- **NFR-S02**: N/A: No data store or transport changes.

### Reliability
- **NFR-R01**: N/A: No uptime target applies to a local lock helper.
- **NFR-R02**: N/A: The run-without-lock fallback keeps its current behavior, so a lock failure still cannot fail a hook.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: No stale lock exists, so `fs.mkdirSync` succeeds on the first attempt and no reclaim runs.
- Maximum input: Eight waiters read the same stale lock as stale, one at a time holds the reclaim directory, the first removes the lock, and every later one reads a fresh or missing lock and removes nothing.
- Failure path: `APPEND_LOCK_WAIT_MS` passes without the lock, and `fn` runs without it as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One helper in `relaunch-core.cjs`, one test file and one reclaim branch |
| Risk | 5/25 | One concurrency primitive, no schema, API or record-format change |
| Research | 3/20 | The reclaim and the takeover-mutex pattern in `killer.cjs` are read in full |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None
<!-- /ANCHOR:questions -->

---
