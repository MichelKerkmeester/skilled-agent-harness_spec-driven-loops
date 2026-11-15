---
title: "Feature Specification: Cross-runtime session handover parity for Pi, OpenCode and Codex"
description: "A scripted live hop shows Claude Code and Codex hand over cleanly while Pi and OpenCode do not hop at all. OpenCode 2.3 mistakes its own tool shell for a nested run, and Pi delivers its nudge only after a whole run and drops the claim instructions when other extensions extend the seed. This phase measures all four runtimes the same way, fixes what blocks the hop and measures again."
trigger_phrases:
  - "cross runtime handover parity"
  - "session handover pi opencode codex"
  - "live hop harness"
  - "opencode nested run misread"
  - "pi nudge steer turn end"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Cross-runtime session handover parity for Pi, OpenCode and Codex

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
| **Branch** | `worktrees/392-cross-runtime-handover-parity` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator reports that in-session handover works on Claude Code and asks how well it works on Pi, OpenCode and Codex. A live hop with the same task on all four, scored by one harness, shows Claude Code and Codex complete the hop while Pi and OpenCode do not hop at all. OpenCode 2.3 runs every tool shell under its own pty daemon and serve process, so `prepare` counts those two processes as a nested run and strips the loop variables. Pi holds its nudge until the whole run ends, so a long run never sees it, and its receiver loses the claim instructions when the advisor, goal or spec-gate extensions append a block to the seed prompt. A repeat on the fixed code then showed the Codex receiver claim its note and answer without closing it in two runs of two, because Codex shows the claim instructions once, with the seed.

### Purpose
Pi and OpenCode complete the same scripted hop as Claude Code with no operator input, and one harness measures all four runtimes before and after the fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash scratch/harness/live-hop.sh <runtime> base1 && node scratch/harness/score.cjs scratch/runs/base1-<runtime>
claude   5/5 prepare 24.4 s, signal 5.8 s later, relaunch 1 s later, note closed at 48.8 s
codex    5/5 prepare 23.9 s, signal 6.4 s later, relaunch 0 s later, note closed at 51.0 s
pi       2/5 the model wrote its own note under session id "pi-context-handoff" at 94.7 s, finished the task in the first session, no signal, no relaunch
opencode 1/5 prepare printed the claim command and exited 3; relaunch.log: loop-nested-run loopId=46664 hostPid=55923
$ bash scratch/harness/live-hop.sh codex final1 (and final2)
codex    4/5 and 3/5, the receiver claimed and answered, the note stayed status: claimed
$ ps -o pid=,ppid=,args= -p 46914,47161,55923
46914 46664 opencode --standalone --auto --prompt ...
47161 46914 .../opencode.exe serve --stdio --port 0
55923 47161 .../opencode-pty daemon --runtime-dir ...
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build one live-hop harness and scorer that run the same task on Claude Code, Pi, OpenCode and Codex under `skilled-loop` and score five hop steps, timings and launch-flag carry
- Make the host-runtime walk treat OpenCode's own serve and pty processes as part of the runtime, so an OpenCode 2 tool shell is not read as a nested run
- Steer Pi's held nudge into a running loop at `turn_end` when its tool calls ran, and keep `agent_end` for a turn that ends the loop
- Read Pi's claim seed from the first block of the prompt, so text other input extensions append after a blank line does not hide it
- Make `claim` print the `complete` command after the note body, so a receiver that saw the claim instructions only once still meets the closing step
- Measure all four runtimes again on the fixed code and record the results

### Out of Scope
- Parity gaps a code read found but no live run showed blocking a hop: OpenCode model carry, Codex compaction pointer, Codex goal carry, withdraw notices on Pi and OpenCode, a question guard outside Claude Code - recorded as follow-ups with their evidence
- Turning handover on by default for Pi, OpenCode or Codex - the operator's default stays as phase 040 set it
- The shared seed parser - Claude Code, Codex and OpenCode read an unmodified seed, and its test pins the single-line form

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `hostRuntimePid` skips an OpenCode process whose parent is an OpenCode process |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | OpenCode 2 host walk, loop kept and nested OpenCode still dropped |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | `turn_end` steer delivery and first-block seed read |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | Steer, follow-up fallback and appended-block seed cases |
| `.skilled/hooks/session-relaunch/README.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md` | Modify | Pi delivery wording |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `claim` prints the `complete` command after the note body |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | The claim output names the complete command |
| `.skilled/hooks/session-relaunch/pi/README.md`, `.skilled/hooks/injection-contract.md`, `.skilled/commands/speckit/handoff.md`, `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` | Modify | Pi delivery and claim output wording |
| `scratch/harness/live-hop.sh`, `scratch/harness/score.cjs` | Create | The live-hop harness and its scorer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On OpenCode 2, a `prepare` run from the loop's own session keeps `SKILLED_LOOP_ID`, and a live OpenCode hop scores 5/5. |
| REQ-002 | An OpenCode run started inside another OpenCode session under the loop is still read as nested and drops the loop variables. |
| REQ-003 | On Pi, a held nudge reaches a run that is still calling tools before its next model call, and a live Pi hop scores 5/5 with no operator input. |
| REQ-004 | The Pi receiver gets the claim instructions, including a carried Gate 3 answer, when other extensions appended a block to the seed prompt. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | One harness and scorer run the same task on all four runtimes, and a final round on the fixed code is recorded beside the baseline. |
| REQ-006 | Docs that describe Pi holding its nudge until the run ends describe the new delivery. |
| REQ-007 | `claim` prints the `complete` command for the claimed note after its body, and the `Goal packet:` line stays last. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In the final rounds Claude Code, Codex, Pi and OpenCode each hop and close their note with no operator input.
- **SC-002**: The relaunch and plugin suites and the Pi suite pass with no test lost against the baseline of 1,556 and 62.
- **SC-004**: A Codex receiver closes its note in the final rounds.
- **SC-003**: The new OpenCode and Pi tests fail on the old code and pass on the new code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live runs need Codex quota, which stood at 18% weekly | A Codex run can stop mid-round | Codex runs on Luna at low effort; on exhaustion the run stops and the operator is asked |
| Risk | Treating OpenCode processes as transparent could hide a real nested OpenCode run | High | Only a process whose parent is also an OpenCode process is skipped, and a test proves a nested OpenCode run still drops the loop |
| Risk | A steer sent at `turn_end` reaches the model mid-run where it used to wait | Med | It goes only when tool calls ran, after `handoffPending` and the hop cap are checked again, so a run that already prepared gets nothing |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: A process table that cannot be read still leaves the loop variables in place, as before.
- **NFR-R02**: A Pi seed prompt with nothing appended parses exactly as before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a Pi `turn_end` with no tool results sends nothing and leaves the nudge for `agent_end`.
- Maximum input: OpenCode started inside OpenCode inside the loop walks four processes to the loop and is read as nested.
- Failure path: a seed whose first block is not a seed returns no instructions, as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Two code files, two test files, two docs, a scratch harness |
| Risk | 12/25 | Changes when Pi's nudge arrives and how every adapter reads its host process |
| Research | 14/20 | Four live runtimes, process trees and the Pi extension API |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Is Codex weaker than Claude Code in the live hop? Decision: no, it scored 5/5 in 51 s against 49 s; its gaps are in carry and compaction, which no live run here exercised.
<!-- /ANCHOR:questions -->

---
