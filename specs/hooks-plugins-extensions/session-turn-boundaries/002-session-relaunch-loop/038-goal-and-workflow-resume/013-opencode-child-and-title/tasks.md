---
title: "Tasks: Phase 13: opencode-child-and-title"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "opencode child and title tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: opencode-child-and-title

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Task variables**: `PHASE` is `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/013-opencode-child-and-title`. `PLUGIN` is `.opencode/plugins/session-relaunch.js`. `TESTS` is `.opencode/plugins/tests/session-relaunch.test.cjs`. `COPY` is a throwaway clone under the session scratchpad, never the working checkout.

**Live run rule**: every non-interactive `opencode run` passes `-m <provider/model>`, because a repository hook blocks it otherwise. No live step starts a session-relaunch `prepare`, `claim`, `keep`, `cancel` or `complete`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Trace the plugin events of a parent whose task sub-agent is moved to the background on OpenCode 2.2.7 (`PHASE/scratch/trace-child-idle.jsonl`). In `COPY`, made with `git clone --shared`, add a trace plugin that appends each event's type, session id, `info.parentID` and status type as one JSON line. Start `opencode serve`, prompt a parent to run a task sub-agent that runs `sleep 90`, call `POST /experimental/session/{sessionID}/background` while it blocks, and record for 120 s. Verify: `rg -n '^Verdict: (yes|no)' PHASE/scratch/trace-child-idle.md` prints 1 line that answers whether the parent's `session.idle` arrived while the child was busy, and `rg -n '^Child parentID: (yes|no)' PHASE/scratch/trace-child-idle.md` prints 1 line.
- [ ] T002 Make one live title call on OpenCode 2.2.7 against the server from T001 (`PHASE/scratch/live-title.md`). Send `curl -sS -X PATCH http://127.0.0.1:<port>/session/<id> -H 'content-type: application/json' -d '{"title":"hop-title-check"}'`, read the session back with `curl -sS http://127.0.0.1:<port>/session/<id>`, and copy the trace plugin's logged `typeof ctx.client?.session?.update`. Verify: `rg -n '^Title verdict: (yes|no)' PHASE/scratch/live-title.md` prints 1 line and `rg -n '^Client update: (function|undefined)' PHASE/scratch/live-title.md` prints 1 line.
- [ ] T003 Record a Build or Drop decision for each change with its evidence (`PHASE/goal.md`). Build the child gate only on a T001 verdict of yes with a child `parentID` of yes. Build the title only on a title verdict of yes and a client update of `function`. A title verdict of yes with a client update of `undefined` stops the phase and asks for a scope amendment to `.opencode/plugins/lib/v2-bridge.js`. Verify: `rg -n '^\| (Child gate|Title) decision \| (Build|Drop|Ask) \|' PHASE/goal.md` prints 2 lines.
- [ ] T004 Delete the throwaway copy and stop its server (`COPY`). Verify: `ls <COPY path>` exits 1 and `pgrep -f "opencode serve"` prints no pid started by T001.
- [ ] T005 Record the plugin suite baseline before any test edit (`TESTS`). Verify: `node --test .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with `pass 65` and `fail 0`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Add the failing test `a parent session.idle does not arm while its sub-agent is busy`, using the child status event the T001 trace names (`TESTS`). Skip on a Drop decision. Verify: `node --test --test-name-pattern 'does not arm while its sub-agent is busy' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 with the record reading `armed`, saved to `PHASE/scratch/red.txt`.
- [ ] T007 Add the failing tests `a deferred parent arm runs when its last busy sub-agent goes idle` and `a parent with two sub-agents stays unarmed until both are idle` (`TESTS`). Skip on a Drop decision. Verify: `node --test --test-name-pattern 'deferred parent arm runs|two sub-agents stays unarmed' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1, appended to `PHASE/scratch/red.txt`.
- [ ] T008 Keep each child's parent id and busy state from its status events before the skip at line 341, return early at the idle arm while a child is busy, and run the deferred arm at the last child idle (`PLUGIN`). Verify: `node --test --test-name-pattern 'does not arm while its sub-agent is busy|deferred parent arm runs|two sub-agents stays unarmed|sub-agent session.idle never arms' .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with `fail 0`, saved to `PHASE/scratch/green.txt`.
- [ ] T009 Add the failing test `the claim seed sets the session title to SKILLED_LOOP_NAME` with a stubbed `ctx.client.session.update` (`TESTS`). Skip on a Drop decision. Verify: `node --test --test-name-pattern 'sets the session title' .opencode/plugins/tests/session-relaunch.test.cjs` exits 1 with zero calls recorded, appended to `PHASE/scratch/red.txt`.
- [ ] T010 Add the guard tests `no title call without SKILLED_LOOP_NAME or a client update method` and `a rejected title call leaves the seed in place` (`TESTS`). Verify: `node --test --test-name-pattern 'no title call without|rejected title call' .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with `fail 0`.
- [ ] T011 Call `ctx.client.session.update` once with the launch name when a new seed is detected, without awaiting it in the event path and catching every error (`PLUGIN`). Verify: `node --test --test-name-pattern 'sets the session title|no title call without|rejected title call' .opencode/plugins/tests/session-relaunch.test.cjs` exits 0 with `fail 0`, appended to `PHASE/scratch/green.txt`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 Run every plugin suite (`.opencode/plugins/tests/`). Verify: `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] T013 Check the plugin parses and the diff holds only the two named files (`PLUGIN`). Verify: `node --check .opencode/plugins/session-relaunch.js` exits 0 and `git diff --name-only -- .opencode .skilled` lists only `PLUGIN` and `TESTS`.
- [ ] T014 Validate the phase (`PHASE`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh PHASE --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, or skipped under a recorded Drop decision
- [ ] No `[B]` blocked tasks remaining
- [ ] Both live verdicts are in `scratch/` and both decisions are in `goal.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../research/research.md` section 9, ranks 7 and 10, and section 12, items 1 and 5
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A change dropped under a recorded live verdict counts as complete for its rows, and its acceptance row is Superseded by a decision record.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Verify: `rg -c '^\| REQ-' spec.md` prints 7.
- [ ] CHK-002 [P0] Both live verdicts recorded before any source edit. Verify: `rg -n '^Verdict: |^Title verdict: ' scratch/trace-child-idle.md scratch/live-title.md` prints 2 lines.
- [ ] CHK-003 [P1] The operator gave the green light. Verify: `rg -n 'green light' goal.md` prints the dated log row.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The plugin parses. Verify: `node --check .opencode/plugins/session-relaunch.js` exits 0.
- [ ] CHK-011 [P0] No console output is added. Verify: `git diff -U0 -- .opencode/plugins/session-relaunch.js` prints no added `console.` line.
- [ ] CHK-012 [P1] No spec path, phase number or task id lands in a code comment. Verify: `git diff -U0 -- .opencode/plugins/session-relaunch.js` prints no added comment matching `specs/|phase|T0[0-9]|REQ-`.
- [ ] CHK-013 [P1] The title call is not awaited in the event path and catches its error. Verify: `rg -n 'session.update' .opencode/plugins/session-relaunch.js` prints one call followed by a `.catch(`.
- [ ] CHK-014 [P1] Tasks match the P1 count above. Verify: `rg -c '^- \[[ xB]\] CHK-.*\[P1\]' tasks.md` prints 14.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] Every acceptance row is Met or Superseded. Verify: `rg -c '\| Unmet \|' acceptance-criteria.md` prints 0.
- [ ] CHK-021 [P0] The plugin suites exit 0. Verify: `node --test .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- [ ] CHK-022 [P1] Each built must-fail test holds a red run. Verify: `rg -c '^not ok' scratch/red.txt` prints the number of must-fail tests built.
- [ ] CHK-023 [P1] Each built change holds a green run. Verify: `rg -c '^# fail 0' scratch/green.txt` prints the number of changes built.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [ ] CHK-FIX-001 [P0] Each finding carries one class in `plan.md`. Verify: `rg -n 'instance-only|cross-consumer' plan.md` prints the class line.
- [ ] CHK-FIX-002 [P0] The same-class producer inventory ran. Verify: `rg -n "session.idle|childSessions" .opencode/plugins/session-relaunch.js` lists every child skip and the one idle arm.
- [ ] CHK-FIX-003 [P0] The consumer inventory ran. Verify: `rg -n 'trackChildSession|childSessions|SKILLED_LOOP_NAME' .opencode/plugins .skilled/hooks/session-relaunch` lists the plugin, the CLI and no new consumer.
- [ ] CHK-FIX-004 [P0] The adversarial cases exist for two children with one busy, an unset name and a rejected call. Verify: `rg -n 'two sub-agents|SKILLED_LOOP_NAME|rejected title call' .opencode/plugins/tests/session-relaunch.test.cjs` prints at least 3 lines.
- [ ] CHK-FIX-005 [P1] The matrix axes are listed. Verify: `rg -n 'Matrix axes' plan.md` prints 1 line.
- [ ] CHK-FIX-006 [P1] The hostile env variant ran with `SKILLED_LOOP_NAME` empty. Verify: `node --test --test-name-pattern 'no title call without' .opencode/plugins/tests/session-relaunch.test.cjs` exits 0.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a commit. Verify: `git rev-parse HEAD` prints the change commit at close.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secret is added. Verify: `git diff -U0` prints no added line matching `api_key`, `password` or `secret`.
- [ ] CHK-031 [P0] The title carries only the operator's launch name. Verify: `rg -n 'SKILLED_LOOP_NAME' .opencode/plugins/session-relaunch.js` prints the one read.
- [ ] CHK-032 [P1] The throwaway copy and its server are gone. Verify: T004's verify prints what it says.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, criteria and goal name the same two files. Verify: `rg -l 'session-relaunch.test.cjs' spec.md plan.md tasks.md acceptance-criteria.md goal.md` lists 5 files.
- [ ] CHK-041 [P1] Each new code comment states the durable why. Verify: the diff of `.opencode/plugins/session-relaunch.js` shows a comment on the child gate and on the title call.
- [ ] CHK-042 [P2] The plugin README is unchanged unless the operator widens scope. Verify: `git diff --name-only -- .opencode/plugins/README.md` prints nothing.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Live evidence lives in `scratch/`. Verify: `ls scratch` lists `trace-child-idle.jsonl`, `trace-child-idle.md` and `live-title.md`.
- [ ] CHK-051 [P1] No file lands outside the phase and the two named files. Verify: `git status --short --untracked-files=all` lists no other path from this phase.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 14 | 0/14 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-13
<!-- /ANCHOR:summary -->

---
