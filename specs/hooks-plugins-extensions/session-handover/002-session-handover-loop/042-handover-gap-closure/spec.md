---
title: "Feature Specification: Handover gap closure on Pi, OpenCode and Codex"
description: "Five handover gaps a code read found after phase 041 were measured live. Pi and OpenCode park behind a question dialog asked after prepare, and both leave the model believing a withdrawn hand-over is still about to run. Codex has no compaction pointer. OpenCode 2 has no way to start on a carried model, and a Codex goal hop needs its own check. This phase measures each, fixes what shows and measures again."
trigger_phrases:
  - "handover gap closure"
  - "question guard pi opencode"
  - "withdrawn notice pi opencode"
  - "codex compaction pointer"
  - "opencode model carry"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Handover gap closure on Pi, OpenCode and Codex

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/392-cross-runtime-handover-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 041 brought all four runtimes to a completed hop and left five gaps that no live run had exercised. Measured live, two of them strand a Pi or OpenCode session: a question dialog asked after `prepare` holds the turn open, so the record is never armed, and a hand-over withdrawn by a new prompt leaves the model saying it should stop and wait for a relaunch that will not come. Codex compacts with no pointer back to its open note and never resets its nudge level. OpenCode 2 has no launch route for a model, so a model the operator picked mid-session is lost on the hop. The fifth gap, Codex goal carry, held in a live hop.

### Purpose
Pi and OpenCode refuse a question dialog while a hand-over is pending and tell the model when one is withdrawn, Codex points a compacted session at its note, and every gap that cannot be fixed is recorded with the run that shows it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ HOP_PROMPT='... right after the prepare command succeeds ask me one short multiple-choice question ...' scratch/harness/probe.sh <runtime> qguard - 300
claude    the guard refused the dialog, the question went into the note, killer-signal 5 s after prepare, receiver asked it
codex     request_user_input_async {"accepted":true}, the turn ended, killer-signal 7 s after prepare
pi        prepare 05:22:12, "called Question", "Waiting for your answer… 4m 54s", no signal
opencode  prepare 05:22:32, the Questions dialog open at the end of the run, no signal
$ scratch/harness/probe.sh <runtime> withdraw... (new prompt typed after the arm: "what is the state of your hand-over?")
claude    "The hand-over I prepared was withdrawn when your new prompt arrived ... I'll keep working here"
pi        arm-cancelled reason=user-message, then "The handoff is prepared and open ... I should stop now so the loop can relaunch"
opencode  arm-cancelled reason=user-message, then "the record is armed and this session should go idle"
$ env OPENCODE_CONFIG_CONTENT='{"model":"llmgateway/claude-haiku-5-5"}' opencode --standalone   (also the v2 model object, and OPENCODE_CONFIG=<file>)
Build · DeepSeek V4.1 Flash 1017 DevPass (LLM Gateway) · max          (the project opencode.json model, all three)
$ node -e '...hook-registry.json bindings.codex'
UserPromptSubmit prompt-seed.mjs, PostToolUse context-nudge.mjs, Stop stop-arm.mjs   (no SessionStart binding)
$ scratch/harness/probe.sh codex goal2 (sender sets /goal, hops)
note: Active goal: Report the line count of ... and repeat `ORCHID-GOAL2` across a handover.
thread_goals: 01a1ddc1... complete (sender), 01a1ddc2... complete (receiver, created from the note)
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Refuse Pi's `question` and `ask_user_question` tools and OpenCode's `question` tool while the session's record can still be armed, with the reason Claude Code already gives
- Tell a Pi or OpenCode model that a new prompt withdrew its hand-over, with the notice Claude Code and Codex already send
- Point a compacted Codex session at its open note and reset its nudge level from `SessionStart` with `source: compact`
- Measure each gap live before and after, and record the gaps that have no route
- Extend the phase 041 probe into `scratch/harness/probe.sh`, which types scripted steps into a live session

### Out of Scope
- Carrying a mid-session model change on OpenCode 2 - no launch route exists: the root command has no model flag, and neither `OPENCODE_CONFIG_CONTENT` nor `OPENCODE_CONFIG` changes the model the TUI starts on
- A Codex question guard - Codex asks through `request_user_input_async`, which does not hold the turn, so the hop runs
- A Codex goal reader - a live hop carried the goal through the note's `Active goal:` line, and the receiver created it again
- Changing when the killer fires or how long it waits - the withdraw window is the killer's existing idle wait

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | `questionHoldReason`, the shared refusal check and text |
| `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs` | Modify | Uses the shared check, same text as before |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | `tool_call` question refusal, withdrawn notice steered from `agent_start` |
| `.opencode/plugins/session-relaunch.js` | Modify | `tool.execute.before` question refusal, withdrawn notice in the system prompt |
| `.skilled/hooks/session-relaunch/codex/compact-pointer.mjs` | Create | The Codex compaction pointer |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json`, `.codex/hooks.json` | Modify | The Codex `SessionStart` binding and its rendered row |
| `pi/session-relaunch.test.ts`, `.opencode/plugins/tests/session-relaunch.test.cjs`, `tests/codex-adapters.test.cjs` | Modify | The new cases, and two existing cases that counted messages |
| `session-relaunch/README.md`, `codex/README.md`, `pi/README.md`, `opencode/README.md`, the relaunch feature catalog entry | Modify | The guard, the notice and the Codex pointer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On Pi and OpenCode, a question tool call while the session's record can still be armed is refused with a reason that names the note and the `cancel` command, and a live run no longer parks behind an open dialog with a prepared record. |
| REQ-002 | On Pi and OpenCode, a model whose armed hand-over a new prompt withdrew is told so before it answers, and a live run answers that it keeps working. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | A Codex `SessionStart` with `source: compact` resets the session's nudge level and points it at its open note, and the binding is rendered from the hook registry. |
| REQ-004 | Each of the five gaps has a live measurement before the fix, and the gaps with no fix name the run that shows why. |
| REQ-005 | Claude Code's question guard keeps its behavior and its text after it moves to the shared check. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Live, Pi and OpenCode no longer sit behind an open question dialog with a prepared record.
- **SC-002**: Live, a Pi and an OpenCode model answer that a withdrawn hand-over is withdrawn.
- **SC-003**: The relaunch, plugin, Pi, goal and flag suites pass with no test lost against 1,560, 65, 200 and 29, and each new test fails on the old code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Codex weekly quota at 17% | A Codex run can stop | Codex runs stay few and on Luna at low effort; on exhaustion the run stops and the operator is asked |
| Risk | A refused question leaves the model unsure how to ask | Med | The reason offers both ways out, ending the turn with the question in the note or `cancel` first, as Claude's does |
| Risk | The OpenCode notice stays in the system prompt too long | Low | It ends at the next operator prompt or a compaction, and a test pins both ends |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: Every new handler fails open: an error reading the record allows the question and sends no notice.
- **NFR-R02**: A session outside the loop, or with no record of its own, is never refused a question.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a question with no loop id or no record is allowed on every runtime.
- Maximum input: an armed record whose killer is live allows the dialog, because the killer ends the idle session itself.
- Failure path: a record that cannot be read allows the question and logs nothing new.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | Five code files, one new adapter, three test files, five docs |
| Risk | 10/25 | New refusals on two runtimes and one new Codex hook |
| Research | 15/20 | Live probes on four runtimes, OpenCode 2 config precedence, Codex hook trust and events |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should Codex get a question guard? Decision: no, its default-mode question tool does not hold the turn, and the live hop ran.
<!-- /ANCHOR:questions -->

---
