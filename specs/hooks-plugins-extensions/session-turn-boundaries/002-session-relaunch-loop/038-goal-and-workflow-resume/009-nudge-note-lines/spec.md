---
title: "Feature Specification: Phase 9: nudge-note-lines"
description: "The handoff nudge tells a session to release its deep-loop lock but never to stop a fan-out runner, and the note has no line for a running worker, a scheduled task or an added directory. A live hop on 2026-11-13 showed a worker started with an ampersand survive prepare and the killer while the note said nothing was running."
trigger_phrases:
  - "nudge note lines"
  - "phase 9 nudge note lines"
  - "running workers line"
  - "scheduled line handoff note"
  - "added directories line"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: nudge-note-lines

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
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 17 |
| **Predecessor** | 008-review-advisories |
| **Successor** | 010-fanout-orphan-liveness |
| **Handoff Criteria** | Every acceptance row is Met, and `validate.sh 009-nudge-note-lines --strict` prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the State a session hop drops: running workers, session names, permission mode and schedules specification.

**Scope Boundary**: Ranks 1, 3, the note half of 4, and 12 of `research/research.md` section 9. That is the handoff nudge and the seed text in `.skilled/hooks/session-relaunch/lib/nudge.cjs`, the `Running workers:` check in `prepare` in `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs`, the note template in `.skilled/commands/speckit/handoff.md` that must match it, and the tests for each. The seven paths in the Files to Change table are the whole change.

**Dependencies**:
- Phase 008 is Complete, so the nudge text is the one its tests pin.
- The three test files named in `REQ-009` pass before the first edit. Measured on 2026-11-13: 280 of 280.
- `node:test`, `vitest` under `.skilled/skills/system-deep-loop/runtime` and `rg` are available.
- The operator gives the greenlight. Nothing is built before it.

**Deliverables**:
- A deep-loop step that stops a live fan-out runner, waits for it to exit, then releases the lock.
- A required `Running workers:` line under In-flight state, asked for by the nudge and checked by `prepare`.
- A `Scheduled:` line and an `Added directories:` line, asked for by the nudge.
- Seed text that checks each worker pid before the active command runs again, and that recreates scheduled tasks and re-adds directories after a hop.
- A `/speckit:handoff` template that asks for the same lines, so its notes still pass `prepare`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The nudge tells a session to release a held deep-loop lock before `prepare` and says nothing about the fan-out runner (`.skilled/hooks/session-relaunch/lib/nudge.cjs:199-203`), so a re-run after the hop can requeue lineages that are still alive. The note asks only for an `Active command:` line under In-flight state (`nudge.cjs:183-185`), and `prepare` checks only that the four sections are non-empty (`.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:385-392`), so a worker started with `&`, a cron or wakeup, and a directory added after launch all vanish from the hand-over without a word.

### Purpose
After this phase a sender stops its runner before it gives up the lock, and every note `prepare` accepts names its running workers or says `none`, so the receiver checks those pids before it starts the same work again.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior

```text
$ rg -n -F -e 'release it before prepare' -e 'include an `Active command:` line' -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'core.validateHandoff(handoffPath' .skilled/hooks/session-relaunch/lib/nudge.cjs .skilled/hooks/session-relaunch/bin/session-relaunch.cjs .skilled/commands/speckit/handoff.md
.skilled/commands/speckit/handoff.md:133:Under In-flight state, include an `Active command:` line with the command, mode and arguments; use `Active command: none` when no command runs. For Codex, also include an `Active goal:` line with the goal or packet path, or `Active goal: none` when no goal is active.
.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:419:  const validation = core.validateHandoff(handoffPath, { sessionId });
.skilled/hooks/session-relaunch/lib/nudge.cjs:183:    '   Under ## In-flight state include an `Active command:` line with the command, mode and '
.skilled/hooks/session-relaunch/lib/nudge.cjs:199:    `${step}. If this command holds a deep-loop lock, release it before prepare with `

$ rg -n "PREPARE.exit|WORKER.pid|worker now" scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/summary.txt | cut -c1-140
10:2026-11-13T08:35:33Z PREPARE.exit: 0 ; [session-relaunch] handoff prepared; stop now and end this turn. The loop ends this session when i
11:2026-11-13T08:35:33Z WORKER.pid: 25973
12:2026-11-13T08:35:33Z worker now: 25973     1 node -e const fs=require('fs');setInterval(()=>fs.appendFileSync('wo

$ rg -n "^## In-flight state" -A1 scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/note-final.md
19:## In-flight state
20-Nothing is running.

$ env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs
ℹ tests 280
ℹ pass 280
ℹ fail 0
```

No line in the three files names `Running workers:`, `Scheduled:` or `Added directories:`. The live hop (paths relative to the parent packet) shows `prepare` exiting 0 while pid 25973 ran, and the same pid running on with parent pid 1 after the killer, under a note whose In-flight state said `Nothing is running.`
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite the deep-loop step in `handoffText` so it stops a live `fanout-run.cjs` runner with `kill -TERM`, waits until `kill -0` fails, then releases the lock, all in the one step before `prepare`.
- Ask for a `Running workers:` line under In-flight state, each worker as `pid <pid> log <path> collect <step>`, workers separated by ` | `, or `Running workers: none`.
- Refuse in `prepare` a note whose In-flight state has no `Running workers:` line, or whose value is neither `none` nor holds a `pid <digits>` entry.
- Ask for a `Scheduled:` line and an `Added directories:` line, each with `none` as the empty value.
- Add seed steps: check each listed pid before the active command runs again, and after a hop recreate each scheduled task and re-add each directory.
- Mirror the new lines and the new deep-loop step in the `/speckit:handoff` note template.
- Add `Running workers: none` to the note the live hop harness writes, so the Claude playbook's goal hop checks and phase 016's live runs still pass `prepare`.

### Out of Scope
- The Claude Stop adapter and logging `session_crons` - phase 014 owns it.
- A liveness check in `markOrphanedLineages` - phase 010 owns it.
- The session-relaunch README and the manual testing playbook - phase 017 owns them.
- A check in `prepare` that each listed pid is alive, or a scan for workers the note does not name - rank 14 and phase 015 own the descendant walk.
- Requiring `Scheduled:` or `Added directories:` in `prepare` - decision D1 keeps the refusal surface to the one line rank 3 names.
- Requiring `Running workers:` in `keep` - decision D2, because a kept session keeps its own workers.
- `core.validateHandoff` and `HANDOFF_SECTIONS` in `lib/relaunch-core.cjs` - decision D2 keeps the check in the CLI, so `claim` and other readers of old notes are not affected.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/session-relaunch/lib/nudge.cjs` | Modify | New deep-loop step, three new In-flight lines in `handoffText`, three new seed steps in `seedText`. |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | `validatedNote` takes a `requireRunningWorkers` option that `prepare` sets, checked before the goal packet write. |
| `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` | Modify | Five new tests for the step, the lines and the seed steps. |
| `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` | Modify | Four new prepare and keep tests, and the shared fixture note gains `Running workers: none`. |
| `.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` | Modify | The fixture note it passes to `prepare` gains `Running workers: none`. |
| `.skilled/commands/speckit/handoff.md` | Modify | The note template and Step 4 ask for the same lines and the same deep-loop step. |
| `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` | Modify | The harness note gains `Running workers: none` under In-flight state. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The deep-loop step in `handoffText` names the runner stop before the lock release. The step line holds `fanout-run.cjs`, `kill -TERM <runner-pid>`, `kill -0 <runner-pid>` and the existing `loop-lock.cjs release --lock-path <path> --owner-pid <pid> --nonce <nonce>` form, in that order, and stays the step right before `prepare`. Test `handoff text stops a running fan-out runner and waits for it before releasing the lock` in `.skilled/hooks/session-relaunch/tests/nudge.test.cjs` asserts the four parts and their order. Today the line holds only the release form. |
| REQ-002 | `handoffText` asks for a `Running workers:` line under In-flight state with the entry shape `pid <pid> log <path> collect <step>` and the empty value `Running workers: none`, and says `prepare` refuses a note without it. Test `handoff text asks for a Running workers line with none as the empty value` asserts the three strings. Today none is there. |
| REQ-003 | `prepare` exits 2 for a note whose In-flight state has no `Running workers:` line, prints a reason that names `Running workers:`, and arms no relaunch record. Test `prepare exits two for a note with no Running workers line` in `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` asserts the exit, the reason and the missing record. Today `prepare` accepts the note. |
| REQ-004 | `prepare` accepts `Running workers: none` and a value that holds `pid <digits>`, with or without a leading `- `, and refuses any other value with exit 2. Tests `prepare accepts Running workers none and a line that names a pid` and `prepare refuses a Running workers line with neither none nor a pid` assert both sides. |
| REQ-005 | `seedText` checks workers before the active command. When the note's `Running workers:` line names workers, a step tells the receiver to run `kill -0 <pid>` on each, to collect a live worker with its collect step instead of starting the work again, and not to re-run the active command while a listed worker runs. Test `seed text checks running workers before running the active command again` asserts the step exists, holds `kill -0`, and comes before the `run it again` step, with and without `afterCompaction`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `handoffText` asks for a `Scheduled:` line (each cron or wakeup with its schedule and prompt) and an `Added directories:` line (each directory added after launch), each with `none` as the empty value. Test `handoff text asks for Scheduled and Added directories lines` asserts both lines and both `none` forms. |
| REQ-007 | `seedText` with `afterCompaction` false adds a step that recreates each `Scheduled:` entry, or tells the operator which to recreate when the runtime has no scheduler, and a step that re-adds each `Added directories:` entry, or asks the operator to (Claude Code: `/add-dir <path>`). With `afterCompaction` true neither step appears, because a compacted session kept both. Test `seed text after a hop recreates scheduled tasks and re-adds directories, and a compaction pointer does not` asserts both cases. |
| REQ-008 | `.skilled/commands/speckit/handoff.md` asks for the same three lines under In-flight state and states the same runner stop in Step 4, so a note written from it passes `prepare`. `rg -o -e 'Running workers:' -e 'Scheduled:' -e 'Added directories:' -e 'kill -TERM' .skilled/commands/speckit/handoff.md` prints each of the four strings at least once. |
| REQ-009 | The named guard tests keep their assertions and pass. In `nudge.test.cjs`: `handoff text asks for an active command line`, `handoff text releases a deep-loop lock before prepare`, `seed text runs the active command again`, `handoff text asks for exactly the sections the core validates` and every other existing test. In `session-relaunch-cli.test.cjs`: `prepare exits two for an invalid handoff note`, a new `keep accepts a note with no Running workers line`, and every existing prepare and keep test once the fixture carries `Running workers: none`. In `skilled-loop-wrapper-claim-goal.test.cjs`: every existing test. |
| REQ-010 | The note the live hop harness writes carries `Running workers: none` under In-flight state, because the Claude playbook's goal hop checks and phase 016 run `prepare` on that note and `REQ-003` would refuse it. `rg -c 'Running workers: none' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/028-goal-rebind-live-proof-and-docs/scratch/harness/run-hop.sh` prints 1, and no other line of the script changes. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test --test-name-pattern 'stops a running fan-out runner|Running workers line with none|Scheduled and Added directories|checks running workers before|recreates scheduled tasks' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 with `fail 0`.
- **SC-002**: `env -u AI_SESSION_CHILD node --test --test-name-pattern 'Running workers' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 with `fail 0`.
- **SC-003**: `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`.
- **SC-004**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runner exits on SIGTERM and takes its lineage groups with it | The new step would leave lineages running | T001 runs the existing vitest case that sends SIGTERM to a live runner, and the code path is `fanout-run.cjs:3529-3532` to `:591` to `:719` |
| Dependency | Claude Code lets a session recreate a scheduled task | The `Scheduled:` seed step would ask for what the model cannot do | T002 reads the vendor page, and the step already falls back to telling the operator |
| Risk | A note written by `/speckit:handoff` or by hand lacks the new line, so `prepare` refuses a hop that worked before | High | The template change in `REQ-008`, and the refusal reason names the exact line to add |
| Risk | A model writes `Running workers: none` while a worker runs | Medium | The line still forces the question. Liveness scanning is rank 14, out of scope |
| Risk | A pid in the note was reused by another process before the receiver checks it | Low | The seed step names the log path too, so the receiver can tell its worker from a stranger |
| Risk | A test passes for the wrong reason | High | Each must-fail test has its failing run in `scratch/red.txt` before the source edit |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The `prepare` check reads the note it already parsed once more, with one regular expression per line of In-flight state. No new process or file read beyond that.
- **NFR-P02**: N/A: no throughput path changes.

### Security
- **NFR-S01**: N/A: no credential path changes.
- **NFR-S02**: The new nudge and seed lines print only fixed text and the placeholders `<pid>`, `<path>` and `<step>`. No note value is printed into them.

### Reliability
- **NFR-R01**: N/A: no service and no uptime target.
- **NFR-R02**: A refused `prepare` writes no relaunch record and leaves the note unchanged, because the check runs before the goal packet write at `bin/session-relaunch.cjs:456`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: `Running workers:` with nothing after the colon is refused, the same as a missing line.
- Maximum input: a line naming many workers is accepted when at least one entry holds `pid <digits>`. The receiver checks every pid it lists.
- Failure path: a missing or malformed line makes `prepare` exit 2 with a reason that names `Running workers:`, and the session fixes the note and runs `prepare` again.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 7/25 | Seven files, two source functions and one CLI option, no new module |
| Risk | 8/25 | A new refusal in `prepare` that every note writer must meet |
| Research | 3/20 | Ranks 1, 3, 4 and 12 are confirmed in code and rank 3 live |
| **Total** | **18/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should phase 017 own the `/speckit:handoff` template instead? Decided on 2026-11-13: it stays here, because the command text must ship in the same change as the check it has to satisfy. The harness note follows the same rule (`REQ-010`).
- Can a Claude Code session re-add a directory itself, or only the operator through `/add-dir`? T002 checks. The planned seed text asks the operator, which works either way.
<!-- /ANCHOR:questions -->

---
