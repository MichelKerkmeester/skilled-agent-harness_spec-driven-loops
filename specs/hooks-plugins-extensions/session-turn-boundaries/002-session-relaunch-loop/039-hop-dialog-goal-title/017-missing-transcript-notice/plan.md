---
title: "Implementation Plan: Phase 17: missing-transcript-notice"
description: "Print one systemMessage line on a Claude Stop that cannot arm for want of a transcript path, test first, and keep the stamp, the log line and the withdrawal."
trigger_phrases:
  - "missing transcript notice plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: missing-transcript-notice

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ES modules) in the Stop adapter, CommonJS in the test |
| **Framework** | None, Node built-in modules |
| **Storage** | The relaunch record and `relaunch.log` in the relaunch state directory |
| **Testing** | `node:test` through `runAdapter` in `tests/claude-adapters.test.cjs` |

### Overview
The missing-transcript branch of `claude/stop-arm.mjs` keeps its log line and its stamp, then writes one JSON line with a fixed `systemMessage` through the same `dependencies.write` path the background-task branch uses. The existing test for this branch changes its empty-stdout assertion to expect that line, so it fails before the source edit. The proof is that test, the Claude adapter suite and the whole relaunch and OpenCode plugin run.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] The operator's answer "Keep, add a notice (Recommended)" is recorded in `spec.md` and the parent goal log

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `scratch/green.txt` shows the missing-transcript test passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Notice on a parked Stop, matching the background-task branch.

### Key Components
- **The missing-transcript branch of `claude/stop-arm.mjs` (lines 132 to 140)**: logs `missing-transcript-path`, calls `markParked` and returns. After the change it also writes the notice.
- **The background-task branch (lines 145 to 171)**: the model for the write, its `try` and its `stop-arm-error stage=notice` log. Unchanged.
- **`withdrawHandOver` in `lib/withdraw.cjs` and the prompt hook in `claude/context-nudge.mjs`**: withdraw the stamped record on the next typed prompt. Unchanged.

### Data Flow
A Stop for this session's pending record arrives without `transcript_path`. The hook logs `missing-transcript-path`, stamps `deferredAt`, writes `{"systemMessage":"Session relaunch could not arm the hop ..."}` to stdout and returns. Claude shows the message and ends the turn. The operator's next prompt withdraws the record as it does today, and a later Stop that carries the path arms it if no prompt came first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The review report's Planning Packet holds no finding for this phase. The finding comes from the two independent reviews, which named it a judgment call, and the operator settled it on 2026-11-14.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The missing-transcript branch of `stop-arm.mjs` | Logs, stamps and returns silently | update | The changed test turns from red to green |
| The background-task branch of `stop-arm.mjs` | Prints its own notice | unchanged | Its test `stop-arm defers pending state when background tasks exist and logs the reason` still passes |
| The target-pid and arm-error branches of `stop-arm.mjs` | Stamp and log without a notice | unchanged | Their tests still pass, and neither finding asked for a notice there |
| `withdraw.cjs` and `context-nudge.mjs` | Withdraw on the next typed prompt | unchanged | `git show --stat` of the fix commit lists neither |
| The session-relaunch README and the Claude adapter README | Describe the Stop | update | `rg -c 'no transcript path' .skilled/hooks/session-relaunch/README.md .skilled/hooks/session-relaunch/claude/README.md` prints a count for each |
| The feature catalog and the playbook | Describe the Stop | phase 19 | Phase 19 tasks |

Required inventories:
- Same-class producers: `rg -n 'markParked\(loopId, env\)' .skilled/hooks/session-relaunch/claude/stop-arm.mjs` lists the four stamp calls. The background-task one already has a notice, this phase adds one to the missing-transcript one, and the target-pid and arm-error ones keep their log lines only.
- Consumers of changed symbols: no symbol changes. The stdout of the Stop hook is read by Claude only.
- Matrix axes: the Stop path (missing transcript, background tasks, no target pid, arm error, armed) crossed with stdout (a notice or empty). The changed test covers the first row, and the existing tests cover the rest.
- Algorithm invariant: a Stop prints at most one line, and only on a path that leaves the record pending for a cause the operator can see.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup takes the suite baseline and confirms the branch and its empty-stdout test. Implementation changes the test, saves the red run, then adds the write and its comment until it passes, then corrects the two README lines. Verification runs the Claude adapter suite, the whole relaunch and OpenCode plugin run, `node --check` and strict validation.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | None. The branch is reached through the hook process | Not applicable |
| Integration | The Stop hook run by `runAdapter` with a pending record and a payload without `transcript_path`, read for stdout, the record and `relaunch.log` | `node:test` in `tests/claude-adapters.test.cjs` |
| Manual | None. No live Stop is run in this phase | Not run |

The changed test runs first with `--test-name-pattern='missing-transcript-path and marks'` and must fail, saved to `scratch/red.txt`. After the edit the same command must pass, saved to `scratch/green.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `createPendingRecord`, `runAdapter` and `STOP_PAYLOAD` in `tests/claude-adapters.test.cjs` | Internal | Green | The test would need its own harness |
| Claude's handling of a Stop `systemMessage` | External | Green, by the background-task notice | The line would not reach the operator |
| Node.js test runner and `rg` | Internal | Green | No test or search can run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a Stop without a transcript path fails, continues the turn, or any relaunch test fails after the edit.
- **Procedure**: revert the fix commit. No record format and no log format changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The stamp built in phase 5 and the comment corrected in phase 14 | Implementation |
| Implementation | The baseline count and the red test | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---
