---
title: "Feature Specification: Phase 15: pi-mode-and-descendant-walk"
description: "A Pi session that switched to Plan or Build mode restarts in the launch mode after a hop, because the arm settings carry only model, provider and effort. The proposed walk over all descendants of the runtime in prepare would miss the backgrounded worker it targets, because a live run showed that worker re-parented to pid 1."
trigger_phrases:
  - "pi mode and descendant walk"
  - "phase 15 pi mode and descendant walk"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: pi-mode-and-descendant-walk

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 17 |
| **Predecessor** | 014-claude-stop-notice-and-crons |
| **Successor** | 016-receiver-claim-under-goal |
| **Handoff Criteria** | Every acceptance row is Met, rank 13 is built or declined with ADR-001, rank 14 is declined with ADR-002 or built on the operator's word, and `validate.sh 015-pi-mode-and-descendant-walk --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Ranks 13 and 14 of `research/research.md` section 9. Rank 13 carries the Pi Plan or Build mode across a hop. Rank 14 decides whether `prepare` walks all descendants of the runtime. Nothing is built before the operator gives the greenlight.

**Dependencies**:
- The operator greenlight. The standing constraint reads "Dont implement untill i give greenlight".
- The plan-build extension at `.pi/git/github.com/janvitos/pi-plan-build`, commit `51a97327ed4749c48150241ae5b29eb7b3354ffe`, version 0.1.120.
- The live run in `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`.

**Deliverables**:
- A confirmed answer to research open question 3, with the evidence in `scratch/`.
- Rank 13 built test first, or declined with ADR-001 in `decision-record.md`.
- Rank 14 declined with ADR-002 in `decision-record.md`, unless the operator asks for the walk.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A Pi session that switched to Plan or Build mode restarts in the mode its first launch named, because `liveSettings` returns only model, provider and effort (`.skilled/hooks/session-relaunch/pi/session-relaunch.ts:419`) and the arm keeps only those three keys (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011`). Separately, `prepare` refuses a hop only for a live shell that is a direct child of the runtime (`.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:278`), and the research proposed a walk over all descendants to catch backgrounded workers.

### Purpose
The receiver starts in the sender's live Plan or Build mode, and the descendant walk is either declined with its evidence on record or built on the operator's word.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n -F -e 'function liveSettings' -e "for (const key of ['model', 'provider', 'effort'])" -e 'processInfo.ppid === runtimePid' -e 'pi:--build|pi:--plan' .skilled/hooks/session-relaunch/pi/session-relaunch.ts .skilled/hooks/session-relaunch/lib/relaunch-core.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/bin/skilled-loop
.skilled/bin/skilled-loop:546:      pi:--build|pi:--plan|pi:--fast|pi:--no-context-files|pi:-nc|\
.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:1011:  for (const key of ['model', 'provider', 'effort']) {
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:278:    processInfo.ppid === runtimePid
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:793:  for (const key of ['model', 'provider', 'effort']) {
.skilled/hooks/session-relaunch/pi/session-relaunch.ts:419:function liveSettings(

$ rg -n -F -e 'selectedMode = decoded?.selectedMode ?? flagMode' -e 'pi.appendEntry(STATE_TYPE' -e 'export const STATE_TYPE' .pi/git/github.com/janvitos/pi-plan-build/index.ts .pi/git/github.com/janvitos/pi-plan-build/plan-state.ts
.pi/git/github.com/janvitos/pi-plan-build/plan-state.ts:6:export const STATE_TYPE = "pi-plan-build-state";
.pi/git/github.com/janvitos/pi-plan-build/index.ts:228:		pi.appendEntry(STATE_TYPE, JSON.parse(snapshot));
.pi/git/github.com/janvitos/pi-plan-build/index.ts:1379:		selectedMode = decoded?.selectedMode ?? flagMode ?? defaultMode ?? "build";

$ cd ~/.pi/agent/sessions && rg -o --no-filename '"customType":"pi-plan-build-state","data":\{"version":[0-9]+,"selectedMode":"[a-z]+"' . | sed 's/.*"version":\([0-9]*\),"selectedMode":"\([a-z]*\)"/v\1 \2/' | sort | uniq -c
1660 v1 build
  51 v1 plan
  14 v2 build
  10 v2 plan
  22 v3 build
  10 v3 plan
 162 v4 build
 114 v4 plan

$ ps -o pid=,ppid=,command= -p 42168,42644,54313   (direct and second-level children of a live Claude runtime, pid 42068)
42168 42068 node .skilled/bin/mcp-code-mode-launcher.cjs
42644 42168 /Users/michelkerkmeester/.nvm/versions/node/v24.22.2/bin/node /Users/michelkerkmeester/MEGA/Development/Skilled/.skilled/skills/mcp-code-mode/mcp-se
54313 42068 caffeinate -i -t 300

$ rg -n 'worker now' ../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt
12:2026-11-13T08:35:33Z worker now: 25973     1 node -e const fs=require('fs');setInterval(()=>fs.appendFileSync('wo
$ rg -n -o 'PREPARE.exit: 0' ../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt
10:PREPARE.exit: 0
```

The plan-build extension writes its selected mode into a custom session entry each time its state changes (`index.ts:228`, and `selectMode` calls `persist` at `index.ts:466`), and a fresh session takes the mode from that entry first, then from `--plan` or `--build` (`index.ts:1378-1379`). The session store holds 185 entries with `selectedMode` `plan` and 1858 with `build`, so the live mode is readable from the session branch. The worker started with `nohup ... &` had parent pid 1 when `prepare` exited 0, so it was no longer a descendant of the runtime. A live Claude runtime has long-lived non-shell children, an MCP launcher and `caffeinate`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm that a Pi session branch holds the plan-build state entry and that a Pi launch with the extension loaded accepts `--plan` and `--build`.
- Read the latest `pi-plan-build-state` entry from `ctx.sessionManager.getBranch()` in `liveSettings` and add `mode` when it is `plan` or `build`.
- Keep a `mode` of `plan` or `build` in `armLocked` and print it from `consume`.
- Replace any launch `--plan` or `--build` with the consumed mode on a Pi hop in `skilled-loop`.
- Record the rank 14 decline as ADR-002 in `decision-record.md`, with the live evidence and the cases a walk would still catch.

### Out of Scope
- The `Running workers:` note line - phase 009 owns it, and it is the cover for the worker a walk misses.
- Any change to `shellChildOfRuntime` or `refuseForShellChild` in `bin/session-relaunch.cjs` - the recommended outcome for rank 14 is a decline.
- `--approve` - it is a trust flag, not a mode (research section 5).
- Permission mode on Claude - rank 5 belongs to phase 011.
- The plan-build extension itself - it is third-party code pinned by commit.
- A type change in `.pi/types/pi-coding-agent.d.ts` - the adapter reads `getBranch` through a local cast, as it already does for `getThinkingLevel`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/pi/session-relaunch.ts` | Modify | `liveSettings` adds `mode` from the latest plan-build state entry. |
| `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` | Modify | Add the mode tests. |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` | Modify | `armLocked` keeps a `mode` of `plan` or `build`. |
| `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs` | Modify | Add the arm mode test. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `consume` prints `mode` beside model, provider and effort. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Add the consume mode test. |
| `.skilled/bin/skilled-loop` | Modify | A Pi hop replays the consumed mode in place of the launch mode flag. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` | Modify | Add the Pi mode replay test. |
| `.skilled/hooks/session-relaunch/README.md` | Modify | One sentence in "Model And Effort Across A Hop" names the Pi mode. |
| `015-pi-mode-and-descendant-walk/decision-record.md` | Create | ADR-002 for rank 14, and ADR-001 if rank 13 is declined. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Before any code edit, the build of rank 13 is confirmed or declined. The check reads `latestPlanState` and `persist` at the pinned commit, counts `selectedMode":"plan"` entries in the Pi session store and launches Pi once with `--plan` through `skilled-loop` to see the extension accept the flag. The result goes to `scratch/confirm-pi-mode.txt`. When any of the three fails, rank 13 is declined as ADR-001 and REQ-002 to REQ-006 are Waived. |
| REQ-002 | `pi/session-relaunch.ts` `liveSettings` returns `mode: 'plan'` or `mode: 'build'` from the last branch entry of type `custom` with `customType` `pi-plan-build-state`, and no `mode` when there is no such entry, the value is anything else, or `getBranch` throws or is missing. Test `agent_settled arms with the plan-build mode from the session branch` in `pi/session-relaunch.test.ts` asserts `mode: 'plan'` on the armed record. Today the record has no `mode`. |
| REQ-003 | `lib/relaunch-core.cjs` `armLocked` copies `settings.mode` onto the armed record only when it is `plan` or `build`. Test `arm keeps a plan or build mode and drops any other value` in `tests/relaunch-core.test.cjs` asserts `mode: 'plan'` is kept and `mode: 'auto'` is dropped. Today both are dropped. |
| REQ-004 | `bin/session-relaunch.cjs` `consume` prints `mode` when the record holds a non-empty string. Test `consume prints the recorded Pi mode` in `tests/session-relaunch-cli.test.cjs` asserts `"mode":"plan"` in the output. Today the key is absent. |
| REQ-005 | `skilled-loop` on a Pi hop with a consumed `mode` of `plan` or `build` drops every launch `--plan` and `--build` from the replayed options and adds `--<mode>` once. Any other runtime and any other value leaves the arguments unchanged. Test `pi relaunch replaces the launch mode flag with the consumed mode` in `tests/skilled-loop-wrapper-launch-arguments.test.cjs` launches with `--build`, consumes `mode: plan`, and asserts one `--plan` and no `--build`. Today `--build` is replayed. |
| REQ-006 | Rank 14 is declined as ADR-002 in `decision-record.md`. The ADR quotes the parent pid 1 line from `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt`, names the cases a walk would still catch, names the false refusals a walk over every program would cause, and points at phase 009 as the cover. `bin/session-relaunch.cjs` lines 270-312 are unchanged. The operator can overrule this before the build, and then the walk becomes its own phase. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | `.skilled/hooks/session-relaunch/README.md` names the Pi mode in one added sentence under "Model And Effort Across A Hop". `rg -n 'Plan or Build mode' .skilled/hooks/session-relaunch/README.md` prints one line. |
| REQ-008 | The existing guard tests keep their assertions and pass: `agent_settled hands the session model, provider and thinking level to the armed record` and `agent_settled arms without live values when the host exposes none` in `pi/session-relaunch.test.ts`, every `consume` test in `tests/session-relaunch-cli.test.cjs`, `Pi first launch arguments are replayed` and `pi relaunch carries provider and model before name and seed` in `tests/skilled-loop-wrapper-launch-arguments.test.cjs`, and every test in `tests/skilled-loop-wrapper-model-effort.test.cjs`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/confirm-pi-mode.txt` records a verdict line that reads `rank 13: build` or `rank 13: decline`, with the three checks of REQ-001 beside it.
- **SC-002**: With rank 13 built, `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` and `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs` each exit 0 with no failure.
- **SC-003**: `rg -n '^### ADR-002' decision-record.md` prints one line, and `git diff --stat -- .skilled/hooks/session-relaunch/bin/session-relaunch.cjs` shows only the `consume` change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The plan-build extension's entry name and shape | A renamed `pi-plan-build-state` or a moved `selectedMode` field silently stops the carry | The adapter reads the field only when it is `plan` or `build` and leaves the launch flags in charge otherwise, and the test fixture pins the shape at commit `51a97327` |
| Risk | A receiver without the extension gets an unknown `--plan` | Medium | The sender records a mode only when its branch holds the entry, the wrapper replays the sender's `-e` and `-ne` options to the receiver, and REQ-001 launches Pi with `--plan` once |
| Risk | A receiver in Plan mode cannot do the work the note asks | Low | Plan mode blocks only the file tools `edit`, `write`, `replace`, `insert` and `undo_last_change` (`index.ts:85`, `index.ts:1215`), so `bash` still runs the claim, and the sender chose Plan mode itself |
| Risk | The rank 14 decline leaves a shell under a non-shell child unseen | Low | ADR-002 names the case, and phase 009's `Running workers:` line covers the worker the session knows it started |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The branch read in `liveSettings` scans the in-memory branch once per arm, with no file read of its own.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: Only the two literal values `plan` and `build` reach the record and the launch line, so no session text becomes a launch argument.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A throwing or missing `getBranch` arms the record without `mode`, as a host without `getThinkingLevel` arms without `effort` today.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a branch with no plan-build entry arms with no `mode`, and the wrapper replays the launch flags as today.
- Maximum input: a branch with many state entries uses the last one, the same lookup `latestPlanState` uses (`plan-state.ts:34-36`).
- Failure path: a `mode` value other than `plan` or `build` is dropped at the arm and ignored by the wrapper, and the hop goes ahead on the launch flags.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Five source and doc files and four test files for rank 13, one new decision record |
| Risk | 6/25 | The launch line of a Pi hop changes, and the carry reads a third-party entry |
| Research | 6/20 | One live Pi launch confirms the flag, and the rank 14 evidence already exists |
| **Total** | **21/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a Pi launch through `skilled-loop` with the extension loaded accept `--plan` and start in Plan mode? REQ-001 settles it with one launch, and a failure declines rank 13.
- Does the operator accept the rank 14 decline? Answered by the operator on 2026-11-13: yes. The phase records ADR-002 and builds no walk.
<!-- /ANCHOR:questions -->

---
