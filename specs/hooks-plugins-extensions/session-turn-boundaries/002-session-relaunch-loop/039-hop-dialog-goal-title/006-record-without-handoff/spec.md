---
title: "Feature Specification: Phase 6: record-without-handoff"
description: "A relaunch record that parsed but held no handoff field was read as a real pending record, so the question guard named undefined as the note path and Stop armed a hop with no note to claim. The read now treats such a record as absent."
trigger_phrases:
  - "record without handoff"
  - "phase 6 record without handoff"
  - "relaunch record no handoff field"
  - "readRelaunchFile corrupt relaunch file"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: record-without-handoff

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/373-relaunch-gap-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 11 |
| **Predecessor** | 005-parked-record-escape |
| **Successor** | 007-killer-test-margin |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 006-record-without-handoff --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the specification that closes the research gaps of the relaunch hop dialog, goal and title fixes.

**Scope Boundary**: `readRelaunchFile` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, four new tests, the hand-written test fixtures that left `handoff` out and one README paragraph. The shared relaunch core is in scope under parent decision D2. No adapter file changes, but every runtime's reader goes through `readRelaunchFile`, so the rule reaches all of them.

**Dependencies**:
- The research of 2026-11-13 named this gap and ranked it fifth: `research/research.md` section 4 under "001, the question dialog after `prepare`", third bullet, and section 9 rank 5.
- `shouldRelaunch` already declines a record with an empty `handoff` as `incomplete-record` (`relaunch-core.cjs:1334` in the fix commit). The change leaves that decline alone.
- The guard `claude/subagent-guard.mjs` and `claude/stop-arm.mjs` read records through `readRelaunchFile` and are not edited.

**Deliverables**:
- `readRelaunchFile` returns null and logs `corrupt-relaunch-file` for a parsed record whose `handoff` is not a string.
- Four new tests, three of them failing before the source edit.
- Every fixture that hand-wrote a record now gives it a `handoff`.
- One README paragraph that states both the missing-field case and the empty-string case.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A relaunch record that parsed as JSON but held no `handoff` field was read as a real pending record. The question guard then refused a dialog for a hand-over that named no note, and its message printed `undefined` where the note path belongs. Stop could also arm a hop for that record, with no note for the receiver to claim.

The research of 2026-11-13 confirmed the gap and found it worse than the packet had recorded: invalid JSON was already logged and read as no record, but the missing-field case was read as pending, and no test covered either case at the guard or at Stop (`research/research.md`, section 4, 001, third bullet).

### Purpose
A parsed record with no `handoff` string is read as absent, so the guard lets the dialog through and Stop arms nothing.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the worktree root before the source edit. The test lines and counts are verbatim from `scratch/red.txt`. The lines after the counts are excerpts of its three failure messages.

```text
$ env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='no handoff|names no note|handoff is an empty string' .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs
✖ stop-arm arms nothing for a pending record that names no note (80.89625ms)
✖ readRelaunchFile treats a record with no handoff as absent and logs the loop id (5.27375ms)
✔ readRelaunchFile keeps a record whose handoff is an empty string (1.297792ms)
✔ shouldRelaunch declines a fresh armed record that names no handoff or no cwd (0.814875ms)
✖ subagent-guard lets a question dialog through over a pending record that names no note (36.103125ms)
ℹ tests 5
ℹ pass 2
ℹ fail 3

  actual: { version: 1, status: 'pending', loopId: 'loop-test-00000001' },
  expected: null,
  +   status: 'armed',
  -   status: 'pending',
  ... put the question in the handoff note at undefined for the next session ...
```

Before the fix `readRelaunchFile` returned the parsed record for any JSON object. Stop moved a pending record with no note to `armed`, and the guard denied the dialog naming `undefined` as the note. The two tests that passed guard what stays true: an empty-string `handoff` is still read, and `shouldRelaunch` still declines a record with no handoff or no cwd.

After the fix the same command prints `ℹ tests 5`, `ℹ pass 5` and `ℹ fail 0` (`scratch/green.txt:7`, `scratch/green.txt:9` and `scratch/green.txt:10`). This author reran it at the current tree on 2026-11-14 with the same counts.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Return null from `readRelaunchFile` and log `corrupt-relaunch-file` for a parsed record whose `handoff` is not a string.
- Keep reading a record whose `handoff` is an empty string.
- Add two tests to `relaunch-core.test.cjs`, one to `subagent-guard.test.cjs` and one to `claude-adapters.test.cjs`.
- Give every hand-written fixture record a `handoff`, so no existing test depends on the old read.
- State both cases in the session-relaunch README beside the corrupt-file rule.

### Out of Scope
- Rejecting an empty-string `handoff` at the read - it would change the wrapper's `incomplete-record` decline, which a wrapper test depends on. See the judgment in `implementation-summary.md`.
- Checking that the `handoff` path exists or is a readable note - the read only checks the field's type, and note validation stays with the claim step.
- Invalid JSON - it was already logged and read as no record.
- A new relaunch record key or module - parent decision D3.
- Any adapter edit for Pi, OpenCode, Codex, Cursor or Devin - parent decision D2.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `readRelaunchFile` returns null and logs for a parsed record whose `handoff` is not a string |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Two new tests and four fixtures given a `handoff` |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modify | One new test |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | One new test and a default `handoff` path in `createPendingRecord` |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | One fixture given a `handoff` |
| `.opencode/plugins/tests/opencode-goal-lifecycle.test.cjs` | Modify | One fixture given a `handoff` |
| `.skilled/hooks/session-relaunch/README.md` | Modify | One paragraph states both cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `readRelaunchFile` returns null and appends `corrupt-relaunch-file loop=<id>` to the log for a parsed record whose `handoff` is not a string. The test `readRelaunchFile treats a record with no handoff as absent and logs the loop id` fails before the edit. |
| REQ-002 | A pending record with no `handoff` no longer denies a question dialog and no longer lets Stop arm. The tests `subagent-guard lets a question dialog through over a pending record that names no note` and `stop-arm arms nothing for a pending record that names no note` fail before the edit. |
| REQ-003 | A record whose `handoff` is an empty string is still read, and `shouldRelaunch` still declines it as `incomplete-record`. The tests `readRelaunchFile keeps a record whose handoff is an empty string` and `shouldRelaunch declines a fresh armed record that names no handoff or no cwd` pass before and after the edit. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The fix adds no module and no relaunch record key. `git show f4cf59b93f` lists seven modified files and `git show f4cf59b93f \| grep -c '^new file'` prints 0. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state. |
| REQ-006 | The session-relaunch README states the missing-field case and the empty-string case beside the corrupt-file rule. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows 5 tests with 2 pass and 3 fail before the edit, and `scratch/green.txt` shows 5 of 5 after it.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with no failing test. The fix commit message records 1543 of 1543, from 1539 before.
- **SC-003**: `git show --stat f4cf59b93f` lists seven files and no new file.
- **SC-004**: `validate.sh 006-record-without-handoff --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Every writer stamps a `handoff` on the record it creates | A writer that left the field out would have its record read as absent and its hand-over would never run | The commit message states no writer produces a record without one, and the whole relaunch and plugin suites pass. This author did not audit each writer one by one |
| Risk | A hand-written fixture that omits `handoff` now reads as absent | Low | The fixtures that did so were given a `handoff` in the same commit, and the suites pass |
| Risk | An empty-string `handoff` still reads as a record | Low | `shouldRelaunch` declines it as `incomplete-record` and a test pins both. Recorded as a judgment in `implementation-summary.md` |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the read gains one type check on a record it already parsed.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: N/A: the read still opens the same file in the same checked state directory and adds no path from the record.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A log write that fails while the read reports a corrupt record still returns null. The existing test `readRelaunchFile still returns null when the corruption log write fails` covers the throw, and the new code reuses its `try` and `catch`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a record whose `handoff` is an empty string is returned as before, and `shouldRelaunch` declines it as `incomplete-record`.
- Maximum input: N/A: the check reads one field and does not scale with input.
- Failure path: a record that parses to null, a number or a string, or an object with a non-string `handoff`, returns null and logs `corrupt-relaunch-file`. Invalid JSON takes the same path as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One function edit, four new tests, seven touched fixtures and one README paragraph |
| Risk | 5/25 | Every caller of `readRelaunchFile` sees null for a record it used to read, so a missed fixture or writer would fail loudly |
| Research | 3/20 | The research already named the gap and its file and lines |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a live hop still run when a real record is written by `prepare`? Not run. Decision: the whole relaunch and plugin suites pass and no live hop was run for this phase.
<!-- /ANCHOR:questions -->

---
