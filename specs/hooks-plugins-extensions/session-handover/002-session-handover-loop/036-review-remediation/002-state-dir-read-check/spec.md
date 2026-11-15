---
title: "Feature Specification: Phase 2: state-dir-read-check"
description: "The relaunch state directory is checked when a write opens it and trusted when a read opens it. `readRelaunchFile` returns a record planted behind a symlinked or foreign-owned directory, and `consume` reads the `handoff` path from that record without containment. Any local account that creates the state directory first can steer where the next session starts and which note it continues."
trigger_phrases:
  - "state dir read check"
  - "phase 2 state dir read check"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: state-dir-read-check

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/351-session-relaunch-review-remediation` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 7 |
| **Predecessor** | 001-shim-wrapper-trust |
| **Successor** | 003-launch-flag-replay |
| **Handoff Criteria** | `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with a symlinked-directory case and an outside-handoff case. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Remediate the eight findings of the in-session handover review of the session relaunch loop specification.

**Scope Boundary**: The read-side directory check in `relaunch-core.cjs` and the `handoff` containment in `consume`. The write paths and the lock are not changed.

**Dependencies**:
- None. Phase 006 edits the same file later, so this phase lands first.

**Deliverables**:
- The read check, the `consume` containment and tests that fail before them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`ensureStateDir` rejects a state directory that is a symlink or is owned by another account, and only write paths call it. `readRelaunchFile` reads the same directory with no check, so a record planted behind it is returned as a real record, `shouldRelaunch` and `consume` rely on that read, and `consume` then reads `record.handoff` with no containment while `claim`, `complete` and `prepare` pass their path through `handoffPathWithinRepo`. The review classes this finding `cross-consumer` because 20 call sites in 8 production files share the unchecked read.

### Purpose
Make every relaunch read pass the same real-directory and owner check as a write, and refuse a `handoff` path that `handoffPathWithinRepo` rejects.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n 'ensureStateDir\(' .skilled/hooks/session-relaunch --glob '!tests/**'
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:137:function ensureStateDir(env) {
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:833:  ensureStateDir(env);
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1458:  const directory = ensureStateDir(env);
.skilled/hooks/session-relaunch/tests/withdraw.test.cjs:47:  core.ensureStateDir(sandbox.env);
.skilled/hooks/session-relaunch/lib/nudge.cjs:652:  core.ensureStateDir(env);
.skilled/hooks/session-relaunch/lib/killer.cjs:827:  const stateDirectory = core.ensureStateDir(environment);
.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:186:    () => ensureStateDir(sandbox.env),
.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:198:    () => ensureStateDir(sandbox.env),
.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:217:    () => ensureStateDir(sandbox.env),
.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:1765:  ensureStateDir(sandbox.env);
```

The production lines are the definition at line 137 and the write-path callers in `relaunch-core.cjs`, `nudge.cjs` and `killer.cjs`. None of the 20 `readRelaunchFile` call sites in 8 production files adds the check, and that read starts at line 1059.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the `ensureStateDir` real-directory and owner check inside `readRelaunchFile` before its read, without creating the directory.
- Return null and log when the state directory fails the check.
- Pass `consume`'s `record.handoff` through `handoffPathWithinRepo` before reading the note.
- Add tests for a symlinked state directory, a foreign-owned state directory and an outside handoff that fail before the fix.
- Keep every existing `readRelaunchFile` call site and signature unchanged.

### Out of Scope
- `ensureStateDir` itself - the check already runs on every write path and the finding asks for parity on reads.
- The append lock in `withAppendLock` - phase 006 owns the stale-lock reclaim and this phase lands first.
- Runtime adapters and wrappers - the fix direction changes no caller signature.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | Apply the real-directory and owner check inside `readRelaunchFile` and return null plus a log entry when it fails. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Pass `record.handoff` through `handoffPathWithinRepo` in `consume` and refuse a rejected path. |
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | `readStateFile` applies the state-directory check before it reads the nudge state. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the symlinked-directory and foreign-owner cases that fail before the read check. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Add the outside-handoff case that fails before the `consume` containment. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `readRelaunchFile` returns null for a record behind a state directory that is a symlink or is owned by another account, and logs the refusal. `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with both cases passing. |
| REQ-002 | `consume` refuses a `handoff` value that `handoffPathWithinRepo` rejects, so no note outside the handoffs directory is read. `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case passing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The nudge state file is read under the same check: `readStateFile` in `.skilled/hooks/session-relaunch/lib/nudge.cjs` returns its empty state for a state directory that is a symlink or is owned by another account. `node --test --test-name-pattern 'nudge state file behind a symlinked state directory' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0. |
| REQ-003 | Every existing `readRelaunchFile` caller keeps its signature and its record shape for a real directory owned by the current account. `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` exits 0 with the symlinked-directory and foreign-owner cases passing.
- **SC-002**: `node --test .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with the outside-handoff case passing.
- **SC-003**: `node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Node.js built-in `fs` and the `node --test` runner | The two suites cannot run | Keep the change to built-ins and use the runner the hook already uses. |
| Risk | A legitimate real state directory owned by the current user reads as no record because the owner comparison is too strict | High | Copy the `process.getuid` guard from `ensureStateDir` and keep a real-directory case in the read suite. |
| Risk | `handoffPathWithinRepo` throws when the handoffs directory is missing, so `consume` exits non-zero where it used to read the note | Med | Treat a rejected `handoff` as no handoff, keep the record removal and log the refusal. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A: the change adds one directory inspection to each read and sets no response-time target.
- **NFR-P02**: N/A: the hook runs per session turn and sets no throughput target.

### Security
- **NFR-S01**: A state directory that is a symlink or is owned by another account yields no record.
- **NFR-S02**: A `handoff` value that `handoffPathWithinRepo` rejects is never read.

### Reliability
- **NFR-R01**: A failed read-side directory check returns null and logs, so a caller sees no record rather than an exception.
- **NFR-R02**: Every existing `readRelaunchFile` call site keeps its current signature and return shape.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no record file below a real directory owned by the current user reads as null, as it does today.
- Maximum input: all 20 `readRelaunchFile` call sites in 8 production files keep their current signature and return shape.
- Failure path: a symlinked or foreign-owned directory reads as no record and logs, and an outside `handoff` is refused before the note is read.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Two source files and two test files |
| Risk | 10/25 | Security boundary in a state directory shared with other local accounts |
| Research | 5/20 | Reuse the existing `ensureStateDir` check, no new pattern |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
