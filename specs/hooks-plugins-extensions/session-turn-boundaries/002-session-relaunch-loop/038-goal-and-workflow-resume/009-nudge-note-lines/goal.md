---
title: "Goal: Phase 9: nudge-note-lines"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "nudge note lines goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines"
    last_updated_at: "2026-11-13T11:05:00Z"
    last_updated_by: "implementer"
    recent_action: "Built and verified the phase; every task, checklist row and acceptance row is green"
    next_safe_action: "None; the orchestrator commits the phase"
    blockers: []
    key_files:
      - ".skilled/hooks/session-relaunch/lib/nudge.cjs"
      - ".skilled/hooks/session-relaunch/bin/session-relaunch.cjs"
      - ".skilled/hooks/session-relaunch/tests/nudge.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs"
      - ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs"
      - ".skilled/commands/speckit/handoff.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
    session_id: "scaffold-009-nudge-note-lines"
    parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should phase 017 own the /speckit:handoff template? Answer: no; the command text ships in the same change as the check it must satisfy."
      - "Can a Claude Code session add a directory itself? Answer: UNCONFIRMED; the seed asks the operator to run /add-dir, which holds either way."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: nudge-note-lines

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every hand-over name the workers, scheduled tasks and added directories the sending session leaves behind, and stop a fan-out runner before its lock is released, so the receiver checks before it starts the same work again.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `prepare` requires only the `Running workers:` line. `Scheduled:` and `Added directories:` are asked for and read, never required. |
| D2 | The check lives in `validatedNote` in `bin/session-relaunch.cjs`, behind an option only `prepare` sets, and runs before the goal packet write. `keep`, `core.validateHandoff` and `HANDOFF_SECTIONS` stay unchanged. |
| D3 | A usable `Running workers:` value is `none`, in any case, or a value that holds at least one `pid <digits>`. A leading `- ` is allowed. Workers on one line are separated by ` \| `. |
| D4 | The worker check seed step appears on every seed. The scheduled and directory steps appear only on a hop seed, never after a compaction, because a compacted session kept both. |
| D5 | The runner stop is part of the one deep-loop step right before `prepare`: `kill -TERM`, wait until `kill -0` fails, then the existing release form. |
| D6 | The `/speckit:handoff` template and the live hop harness note change in this phase, so their notes still pass `prepare`. The README and the playbook wait for phase 017. |
| D7 | Test first. Each must-fail test holds a recorded failing run before its source edit. |
| D8 | Nothing is built before the operator's greenlight, and nothing is pushed or merged without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0`. Open in this harness: the inherited `OPENCODE_DB` breaks one unmodified plugin test; with it unset the suite runs 1489 of 1489, see the Log.
- [x] `rg -c '\| Met \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/acceptance-criteria.md` prints 12.
- [x] `rg -c '^not ok' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines/scratch/red.txt` prints 7.
- [ ] `git diff --name-only -- .skilled .opencode` lists only the six files named in `spec.md`. Open until the parallel phase-010 lane commits; the command prints its four uncommitted deep-loop paths too, see the Log.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/009-nudge-note-lines --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents | Done | Five documents written on 2026-11-13 from `../research/research.md` section 9 and the live run in `../scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned/`. Baseline of the three test files: 280 of 280 pass |
| T001 runner stop | Done | `npx vitest run tests/unit/fanout-run.vitest.ts -t 'writes a stopped partial orchestration summary when SIGTERM interrupts an in-flight run'` exits 0, 1 passed, 182 skipped. The lineage group kill is read at `fanout-run.cjs:3532` (`stopActiveLineageProcesses`), `:591` (`process.kill(-child.pid, signal)`) and `:719` (`writeStoppedSummary` calls `stopActiveLineageProcesses`) |
| T002 scheduler and add-dir | Done | Creation: the vendor page says "`CronCreate` \| Schedule a new task. Accepts a 5-field cron expression, the prompt to run, and whether it recurs or fires once.", so a session creates one itself. Directory: `claude --help` line 10 says "`--add-dir <directories...>  Additional directories to allow tool access to`", a launch option only, and no page line shows a session adding one itself: session-adds-it-itself is UNCONFIRMED, so the operator wording of the seed text stands |
| T003 baseline | Done | `env -u AI_SESSION_CHILD node --test nudge.test.cjs session-relaunch-cli.test.cjs skilled-loop-wrapper-claim-goal.test.cjs` exits 0 with `pass 280` and `fail 0` |
| T004 source anchors | Done | `rg -n -F` printed `nudge.cjs:183`, `nudge.cjs:199`, `session-relaunch.cjs:419`, `session-relaunch.cjs:456` and `handoff.md:133` before the edits; no drift. The lines moved after T011-T019, see the deviation row |
| T005-T019 build | Done | Seven must-fail runs are in `scratch/red.txt`; the nudge suite runs 89 of 89, the CLI suite 162 of 162 and the wrapper claim suite 38 of 38, all `fail 0` |
| T020-T025 verification | Done | The full relaunch and plugin suites run 1489 of 1489 with `fail 0`; the six named guards pass; `scratch/red.txt` holds 7 `not ok`; strict validation prints `RESULT: PASSED` |
| T026 harness note | Done | `run-hop.sh` gains `Running workers: none` under In-flight state; `git diff --numstat` prints `1 0` |
| Evidence commit | Done | `git rev-parse HEAD` prints `59c7aede7d5cac15a998d53a9d1c45bb7dde5ee4`; the phase edits are uncommitted and the orchestrator commits them |

### Deviations and findings

| Item | Note |
|------|------|
| `/speckit:handoff` template in scope | The brief names only `nudge.cjs` and `prepare`. A `prepare` that requires `Running workers:` would refuse notes from `.skilled/commands/speckit/handoff.md:116-133`, which mirrors the nudge, so the plan adds that file. Open question: keep it here or move it to phase 017? |
| `prepare` never checked the `Active command:` line | `validateHandoff` at `lib/relaunch-core.cjs:364-394` checks status, session and the four sections only. The new line is the first line-level check, so it lives in the CLI and leaves `claim` and other readers alone |
| The runner is foreground by design | `deep-research-confirm.yaml:248` runs `fanout-run.cjs` with `wait_for_completion: true`. A runner is alive at `prepare` only after a backgrounded or timed-out tool call, so the step is worded for that case |
| Open question: added directories | Whether a Claude Code session can add a directory itself is UNCONFIRMED. T002 checks. The planned seed text asks the operator to run `/add-dir`, which holds either way |
| T010 red count after T014 | `T010` saved the five must-fail nudge runs when `scratch/red.txt` held 5 `not ok` lines. `T014` then appended its two prepare refusals, so the file now holds 7, which is the count the completion criteria and `CHK-022` expect |
| T003 baseline is historical | The 280-test baseline was measured before the first edit. The same three files now hold 289 tests: 89 in `nudge.test.cjs`, 162 in `session-relaunch-cli.test.cjs` and 38 in `skilled-loop-wrapper-claim-goal.test.cjs` |
| T004 anchors after the edit | `T004` recorded the pre-edit lines. `T011` rewrote the deep-loop step, so `release it before prepare` no longer exists; after the edit `handoff.md:137`, `session-relaunch.cjs:437`, `session-relaunch.cjs:482` and `nudge.cjs:195` hold the other anchors |
| T024 worktree assumption | `tasks.md` T024 says "Verify: `git diff --name-only -- .skilled .opencode` prints only the six files in `spec.md`". The shared worktree also carries the parallel phase-010 lane's four uncommitted paths under `.skilled/skills/system-deep-loop/runtime/`, so the command prints ten. The six session-relaunch and commands paths are the only ones this phase touched; the four others are not reverted here because another lane owns them |
| Full suite and `OPENCODE_DB` | The harness exports `OPENCODE_DB=opencode-v1.db`. The history lookup plugin test passes that value to its fixture reader, which joins it under the fixture `XDG_DATA_HOME` and returns `store_unreadable`; the test file and the reader are unmodified by this phase. With `env -u AI_SESSION_CHILD -u OPENCODE_DB` the full suite runs 1489 of 1489 with `fail 0` |
| `CHK-001` planned count | `CHK-001` expects `rg -c '^\| REQ-' spec.md` to print 9. `spec.md` holds 10 REQ rows because `REQ-010` was added after the check was written; the command prints 10 |
| Two goal boxes stay open | Completion criteria 1 and 4 are the exact full-suite command and the exact `.skilled`/`.opencode` diff. The first fails only on the inherited `OPENCODE_DB` row above, the second only on the parallel lane above. Both pass as soon as the harness variable is unset and the other lane commits; they are left unticked rather than claimed falsely |
| Seed steps keep seven numbers | `plan.md` and `tasks.md` T013 describe three new numbered seed steps, but the existing guard test `seed text claims the note, resumes only a bound spec folder, and completes the handoff` pins the numbered steps to `[1..7]`. The worker check is appended to step 2 and the hop-only restore text to the final step, so the count stays seven and the guard keeps its assertion |
<!-- /ANCHOR:log -->
