---
title: "Feature Specification: Phase 17: missing-transcript-notice"
description: "A Claude Stop whose payload has no transcript path stamps the pending record, and the operator's next prompt withdraws the hop. Nothing tells the operator, so a hop that never happens looks like a hop that is still coming."
trigger_phrases:
  - "missing transcript notice"
  - "phase 17 missing transcript notice"
  - "stop without transcript path prints a notice"
  - "hop withdrawn because the transcript was missing"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 17: missing-transcript-notice

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Not chosen yet. The operator picks a worktree or the current branch before the build |
| **Parent Spec** | ../spec.md |
| **Phase** | 17 of 19 |
| **Predecessor** | 016-ended-goal-mark-match |
| **Successor** | 018-sk-git-rebase-sentence |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 017-missing-transcript-notice --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 17** of the hop dialog, goal and title specification, in the third review round of 2026-11-14.

**Scope Boundary**: The missing-transcript branch of `claude/stop-arm.mjs` and the comment above it, one existing test in `tests/claude-adapters.test.cjs`, one sentence in the session-relaunch README and the `stop-arm.mjs` row of the Claude adapter README. The Claude adapter only. No other runtime, no relaunch record key and no new log event.

**Dependencies**:
- Phase 5 made this branch stamp `deferredAt`, so the next operator prompt withdraws the record. The stamp and the withdrawal stay as they are.
- The background-task branch of the same Stop already prints one JSON line whose `systemMessage` Claude shows to the operator (`claude/stop-arm.mjs:155` to `:168`). The new notice uses the same write path.
- Operator decision of 2026-11-14 on whether the silent withdrawal is intended, word for word: "Keep, add a notice (Recommended)".

**Deliverables**:
- One printed line on the missing-transcript Stop that says the next prompt withdraws the hop because the Stop had no transcript path.
- The existing `missing-transcript-path` log line, still written exactly once.
- One test change that failed before the source edit.
- Two README lines that state the notice.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
When a Claude Stop payload carries no `transcript_path`, `stop-arm.mjs` logs `missing-transcript-path` (`claude/stop-arm.mjs:137`), stamps `deferredAt` on the pending record (`:138`) and returns. It prints nothing, and its test asserts an empty stdout (`tests/claude-adapters.test.cjs:958`). The withdraw helper accepts a stamped pending record by default (`lib/withdraw.cjs:27` and `:59`), so the operator's next prompt withdraws the hop. The prompt hook logs `withdrawn` (`claude/context-nudge.mjs:77`) and tells the model through `additionalContext` (`:117`), which the operator does not see. The operator learns neither that the hop could not arm nor why it never came. Both independent reviews of 2026-11-14 asked whether this is intended.

### Purpose
A Stop that cannot arm because its payload has no transcript path prints one line that tells the operator the next prompt withdraws the hop because the transcript was missing, while the withdrawal itself stays as it is.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from the repository root on 2026-11-14 at commit `99d197475d`. The first command shows the branch logs and stamps and that only the background-task branch prints a `systemMessage`. The second shows the withdraw default. The third shows what the prompt hook does on a withdrawal. The fourth is the assertion that the branch prints nothing.

```text
$ rg -n -o "logEvent\('missing-transcript-path'|markParked\(loopId, env\)|systemMessage: " .skilled/hooks/session-relaunch/claude/stop-arm.mjs
53:markParked(loopId, env)
137:logEvent('missing-transcript-path'
138:markParked(loopId, env)
154:markParked(loopId, env)
162:systemMessage: 
184:markParked(loopId, env)
203:markParked(loopId, env)
exit=0

$ rg -n -o "pending = 'deferred'|typeof record.deferredAt === 'string'" .skilled/hooks/session-relaunch/lib/withdraw.cjs
27:typeof record.deferredAt === 'string'
59:pending = 'deferred'
exit=0

$ rg -n -o "logEvent\('withdrawn'|emit\(eventName, nudge.WITHDRAWN_NOTICE\)" .skilled/hooks/session-relaunch/claude/context-nudge.mjs
77:logEvent('withdrawn'
117:emit(eventName, nudge.WITHDRAWN_NOTICE)
exit=0

$ rg -n -o "assert.equal\(result.stdout, ''\)" .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs | rg '^958:'
958:assert.equal(result.stdout, '')
exit=0
```

The missing-transcript branch logs at line 137 and stamps at line 138, and the only `systemMessage` is the background-task one at line 162. A stamped pending record is withdrawn by default. The prompt hook logs `withdrawn` and emits its notice as model context. The test at line 958 pins the silence this phase ends.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- After the stamp in the missing-transcript branch, write one JSON line with a `systemMessage` and no `decision` key, through `dependencies.write` as the background-task branch does. The text is: `Session relaunch could not arm the hop because this Stop carried no transcript path. Your next prompt withdraws the hand-over, and a later Stop that carries the path arms it instead.`
- Log a write failure as `stop-arm-error` with `stage: 'notice'`, as the background-task branch does.
- Change the test `stop-arm logs missing-transcript-path and marks the pending record deferred` so it expects that one line and exactly one `missing-transcript-path` log line. The changed assertion fails before the source edit.
- State the notice in the session-relaunch README sentence on the missing transcript path and in the `stop-arm.mjs` row of the Claude adapter README.

### Out of Scope
- Printing the line at the prompt that withdraws the hop: the prompt hook does not know why the record was stamped, because the background-task branch and two others stamp it too, and carrying the cause on the record needs a relaunch record key, which parent decision D3 forbids. The Stop is the one place that knows the cause, so the line prints there and says what the next prompt does.
- A new log event: the `missing-transcript-path` line already records the cause, and the prompt hook already logs `withdrawn`.
- Arming without a transcript path, or keeping the record from being withdrawn: the operator chose to keep the withdrawal.
- Codex and the other runtimes: Codex Stop does not stamp, and parent decision D2 keeps every other adapter unchanged.
- The feature catalog and the playbook: phase 19 documents this behavior.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/stop-arm.mjs` | Modify | The missing-transcript branch writes one `systemMessage` line after the stamp, and its comment says so |
| `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Modify | The missing-transcript test expects the line and one log line in place of an empty stdout |
| `.skilled/hooks/session-relaunch/README.md` | Modify | The sentence on a missing `transcript_path` names the printed line |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | The "What it does" cell of the `stop-arm.mjs` row names the notice for a payload with no transcript path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A Stop for this session's pending record whose payload has no `transcript_path` prints exactly one stdout line. It parses as JSON, has a `systemMessage` that matches `no transcript path` and `next prompt withdraws`, and has no `decision` key. The changed test fails before the edit and passes after. |
| REQ-002 | The same Stop still stamps `deferredAt`, leaves every other record field as it was and writes exactly one `missing-transcript-path` line to `relaunch.log`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A failed write of the line is logged as `stop-arm-error` with `stage=notice`, and the hook still exits 0 with the record stamped. |
| REQ-004 | The background-task notice and every other Stop path print what they print today. The Claude adapter suite passes with the baseline count. |
| REQ-005 | The relaunch and OpenCode plugin suites pass at the final state with the baseline count, because a changed test adds none. |
| REQ-006 | Both READMEs name the line. The fix commit adds no file, no record key and no log event, and the changed comment names no packet, phase, task or finding number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/red.txt` shows the missing-transcript test failing on the empty stdout before the edit, and `scratch/green.txt` shows it passing after.
- **SC-002**: `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with the baseline count.
- **SC-003**: `node --check .skilled/hooks/session-relaunch/claude/stop-arm.mjs` exits 0 and `git show --stat` of the fix commit lists four files and no new file.
- **SC-004**: `validate.sh 017-missing-transcript-notice --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Claude shows a Stop hook's `systemMessage` to the operator and still ends the turn when no `decision` key is set | The line would not reach the operator | The background-task notice relies on the same contract, and the README records it. A live Stop without a transcript path would confirm it, and none is run here |
| Risk | A runtime that never sends `transcript_path` prints the line on every Stop | Low | The record is stamped on each such Stop, and the line names the cause the operator would need to fix |
| Risk | The write throws and the hook fails | Low | The write sits in a `try` that logs `stop-arm-error stage=notice`, as in the background-task branch |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: one stdout write on a branch that already returns early.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The line holds fixed text only. No payload field reaches it.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A failed write leaves the stamp, the log line and the exit status as they are today.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a payload whose `transcript_path` is an empty string takes the same branch and prints the same line.
- Maximum input: repeated Stops without a transcript path each print the line once and each stamp the record.
- Failure path: a write that throws logs `stop-arm-error stage=notice`, and the hook exits 0 with the record stamped.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 4/25 | One branch, one test change and two README lines |
| Risk | 3/25 | The branch already returns without arming, and the write is guarded |
| Research | 3/20 | One judgment finding, settled by the operator, and the stamp sources read |
| **Total** | **10/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does Claude show a Stop `systemMessage` when the turn ends without a transcript path? Not run live. Decision: the background-task notice relies on the same contract, and one Stop with the path removed would confirm it.
- Does the line need the cancel command, as the background-task notice has? Decision: no, because the next prompt withdraws the hop on its own.
<!-- /ANCHOR:questions -->

---
