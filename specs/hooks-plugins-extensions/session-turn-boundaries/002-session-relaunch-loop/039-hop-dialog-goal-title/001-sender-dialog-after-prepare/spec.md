---
title: "Feature Specification: Phase 1: sender-dialog-after-prepare"
description: "On Claude Code only the Stop hook arms a prepared hand-over. A question dialog opened after prepare keeps the turn open, so Stop never fires, the record stays pending and no hop follows. Four of fourteen live attempts in child 016 of packet 038 ended this way."
trigger_phrases:
  - "sender dialog after prepare"
  - "phase 1 sender dialog after prepare"
  - "question dialog blocks hop"
  - "askuserquestion pending hand-over"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: sender-dialog-after-prepare

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/366-hop-after-question-dialog` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-packet-goal-fallback |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met and `validate.sh 001-sender-dialog-after-prepare --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the A Claude Code hop refuses a question dialog after prepare, starts the receiver on the packet goal and keeps the generated session title specification.

**Scope Boundary**: The Claude PreToolUse adapter `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs`, its test file, one new binding in the hook registry with the generated `.claude/settings.json`, and three README lines that name the new matcher. Claude Code only.

**Dependencies**:
- Child 016 of packet 038, `../../038-goal-and-workflow-resume/016-receiver-claim-under-goal/`, saved the four failed attempts this phase reads. They live in `scratch/failed-runs/`.
- `readRelaunchFile` and `armableRecord` in `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` already exist and are reused unchanged.
- `sync-hook-registrations.cjs` renders the registry into `.claude/settings.json`.

**Deliverables**:
- An opening check, from saved evidence, that a question dialog followed `prepare` in all four failed runs.
- A PreToolUse denial of `AskUserQuestion` while this session's record is pending.
- Six tests, one of them failing before the source edit.
- A second PreToolUse binding with matcher `AskUserQuestion`, rendered into `.claude/settings.json`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
On Claude Code, `prepare` leaves the relaunch record `pending` and only the Stop hook `stop-arm.mjs` arms it. A question dialog from the `AskUserQuestion` tool keeps the turn open, so Stop never fires, the record stays pending and no hop follows. Child 016 of packet 038 recorded this as a suspected cause in four of fourteen live attempts.

In those four runs the test harness ran `prepare`, not the sender. The sender never saw prepare's "stop now and end this turn" line. A sender that runs `prepare` itself and then opens a dialog has not been observed live. No new live run was made for this child.

### Purpose
A Claude sender whose hand-over is pending cannot open a question dialog, so its turn can end and Stop can arm the hop.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

Run from this phase folder.

```text
$ rg --sort path -o '^\S+ prepare exit=0' scratch/failed-runs/*/summary.txt
scratch/failed-runs/failed-10-a1/summary.txt:2026-11-13T12:44:05Z prepare exit=0
scratch/failed-runs/failed-10-a2/summary.txt:2026-11-13T12:52:18Z prepare exit=0
scratch/failed-runs/failed-8-a1/summary.txt:2026-11-13T12:25:05Z prepare exit=0
scratch/failed-runs/failed-9-a1/summary.txt:2026-11-13T12:34:38Z prepare exit=0

$ rg --sort path -o '\S+ prepare loopId=\d+ status=pending' scratch/failed-runs/*/relaunch-log.txt
scratch/failed-runs/failed-10-a1/relaunch-log.txt:2026-11-13T12:44:05.317Z prepare loopId=80203 status=pending
scratch/failed-runs/failed-10-a2/relaunch-log.txt:2026-11-13T12:52:18.981Z prepare loopId=22510 status=pending
scratch/failed-runs/failed-8-a1/relaunch-log.txt:2026-11-13T12:25:05.691Z prepare loopId=55026 status=pending
scratch/failed-runs/failed-9-a1/relaunch-log.txt:2026-11-13T12:34:38.150Z prepare loopId=57401 status=pending

$ rg --sort path -o 'ts=\S+ tool_use AskUserQuestion' scratch/failed-runs/*/extract-*.txt
scratch/failed-runs/failed-10-a1/extract-2ae52094-4b7d-44db-831d-b172cf525305.txt:ts=2026-11-13T12:44:11.554Z tool_use AskUserQuestion
scratch/failed-runs/failed-10-a2/extract-22eb8d38-e86e-4589-adce-aaf16038e211.txt:ts=2026-11-13T12:53:01.628Z tool_use AskUserQuestion
scratch/failed-runs/failed-8-a1/extract-907c30e8-616b-431d-a6e3-670145b8bbdd.txt:ts=2026-11-13T12:25:11.635Z tool_use AskUserQuestion
scratch/failed-runs/failed-9-a1/extract-f037f762-9161-42bb-af42-ddc537f9e2ab.txt:ts=2026-11-13T12:34:43.295Z tool_use AskUserQuestion

$ rg -c 'killer-signal| relaunch ' scratch/failed-runs/*/relaunch-log.txt
(no output, exit 1)
```

Each run logs `prepare ... status=pending` and then a question dialog. The gap runs from 5.1 s in `failed-9-a1` to 42.6 s in `failed-10-a2`. Each `relaunch-log.txt` holds two lines, and none holds a `killer-signal` or a `relaunch` line. No `goal_status` line follows the dialog in any extract, so no Stop is recorded after it.

The passing run `../../038-goal-and-workflow-resume/016-receiver-claim-under-goal/scratch/live-open/9/` is the contrast. Its sender ran `prepare` at `2026-11-13T12:42:53Z` (`summary.txt`), its extract holds a `goal_status` line at `2026-11-13T12:42:59.451Z`, which is a Stop, and `history.txt` records `handed-over` at `2026-11-13T12:43:03.935Z`. That folder keeps no `relaunch.log`, so its `killer-signal` line cannot be quoted from saved evidence.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm from the saved evidence that a question dialog followed `prepare` in all four failed runs and that no Stop or hop came after it.
- Deny `AskUserQuestion` at PreToolUse when `SKILLED_LOOP_ID` is set and the loop's record is pending for this session id and the `claude` runtime.
- Name the handoff note path and the `cancel --loop-id` command in the denial.
- Register a second PreToolUse binding for `subagent-guard.mjs` with matcher `AskUserQuestion` and render it into `.claude/settings.json`.
- Name the new matcher in the three READMEs that list the guard's bindings.

### Out of Scope
- Pi, OpenCode and Codex - they arm on other events and were not examined.
- A new live run - the operator chose the fix once the saved evidence answered the opening check.
- Stronger wording in `prepare` - its output already says "stop now and end this turn".
- Withdrawing the hand-over when a dialog opens - that loses the hop at the context limit.
- A new module - parent decision D3 forbids it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | Deny a question dialog over a pending hand-over of this session |
| `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` | Modify | Add one denial test and five pass-through tests |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Add the `AskUserQuestion` PreToolUse binding, group 7, slot 0 |
| `.claude/settings.json` | Modify | Generated by `sync-hook-registrations.cjs` from the registry |
| `.skilled/hooks/session-relaunch/claude/README.md` | Modify | Name the new matcher and the denial |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Name the new matcher in the file tree |
| `.skilled/hooks/README.md` | Modify | Name the new matcher in the concern table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The opening check holds before any source edit. In each of the four runs under `scratch/failed-runs/`, `summary.txt` shows `prepare exit=0`, the extract shows `tool_use AskUserQuestion` after prepare and `relaunch-log.txt` ends at `prepare ... status=pending` with no `killer-signal` and no `relaunch` line. |
| REQ-002 | `subagent-guard.mjs` prints one PreToolUse envelope with `permissionDecision: "deny"` for an `AskUserQuestion` call when `SKILLED_LOOP_ID` is set and `armableRecord` returns reason `pending` for this session id and runtime `claude`. The reason names the handoff note path and `session-relaunch.cjs cancel --loop-id <id>`. The test `subagent-guard denies a question dialog while the session hand-over is pending` fails before the edit. |
| REQ-003 | The guard stays silent for a question dialog with no record, with another session's record, with an armed record, with no `SKILLED_LOOP_ID` and with the relaunch concern disabled. One test covers each case. |
| REQ-004 | No new module is added. The guard reuses `readRelaunchFile` and `armableRecord` from `lib/relaunch-core.cjs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | A failed record read lets the dialog through. The read sits in a `try` whose `catch` returns null. |
| REQ-006 | `hook-registry.json` holds a PreToolUse binding with matcher `AskUserQuestion` for `subagent-guard.mjs`, and `.claude/settings.json` matches the registry. |
| REQ-007 | The relaunch and OpenCode plugin suites pass with six more tests than the baseline. |
| REQ-008 | The three READMEs that list the guard's bindings name the `AskUserQuestion` matcher. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 with 20 of 20 passing, and `scratch/red.txt` shows 19 pass and 1 fail before the edit.
- **SC-002**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with 1530 of 1530.
- **SC-003**: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs --check` prints `PASS`.
- **SC-004**: `validate.sh 001-sender-dialog-after-prepare --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `armableRecord` verdicts in `lib/relaunch-core.cjs` | A changed reason name would silence the guard | The denial test fails if the `pending` verdict stops matching |
| Risk | The cause is inferred from four runs where the harness, not the sender, ran `prepare` | Med | The denial only fires while a record is pending, so a wrong cause costs one refused dialog. A live run of a sender that runs `prepare` itself would confirm it |
| Risk | A sender still needs an answer from the operator before it can end | Low | The denial tells it to put the question in the handoff note or to cancel the hand-over first |
| Risk | Another runtime has the same gap | Med | Recorded as out of scope. Pi, OpenCode and Codex were not examined |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: the guard reads one small JSON record only for an `AskUserQuestion` call inside a relaunch loop.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The denial carries the note path and the loop id from the record, never text from the tool input.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A record that cannot be read lets the dialog through, so a broken state directory never blocks the operator.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: no `SKILLED_LOOP_ID` or no record lets the dialog through.
- Maximum input: an armed record lets the dialog through, because the killer ends the idle session once Stop has armed it.
- Failure path: a read that throws or a corrupt record is treated as no record, and the hook exits 0 with no output.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | One adapter, one test file, one registry binding and three README lines |
| Risk | 6/25 | A PreToolUse denial can block the operator's dialog if it fires on the wrong record |
| Research | 5/20 | Saved evidence from four runs, no new live run |
| **Total** | **16/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a sender that runs `prepare` itself and reads "stop now and end this turn" still open a dialog? Not observed. Decision: the operator chose the fix without a live reproduction, and the gap is a Known Limitation.
- Do Pi, OpenCode or Codex hold a pending record open the same way? Not examined in this phase.
<!-- /ANCHOR:questions -->

---
