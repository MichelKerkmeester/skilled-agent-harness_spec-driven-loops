---
title: "Goal: Goals and running workflows survive a session hop on every runtime"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume"
    last_updated_at: "2026-11-13T09:07:30Z"
    last_updated_by: "orchestrator"
    recent_action: "Planned children 009 to 017 from the hand-over gap research and bound them here"
    next_safe_action: "Await the operator's greenlight, then build child 009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-038-goal-and-workflow-resume"
      parent_session_id: null
    completion_pct: 47
    open_questions: []
    answered_questions: []
---
# Goal: Goals and running workflows survive a session hop on every runtime

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** After a session hop the receiver runs the command the sender was running, reads its phase goal and claims its note, every runtime carries the session goal or says in one line why not, and the hand-over names or carries what the sender leaves: running workers, schedules, added directories, the session name and the permission or Pi mode.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child per work package. Each code change lands with a test that failed first |
| D2 | Children sharing a file run in number order, the rest in parallel. `spec.md` lists those files |
| D3 | No child adds a module. Only 011, 012 and 015 touch the relaunch record, with optional keys |
| D4 | The 2026-11-12 review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder are not applied |
| D5 | Nothing is merged or pushed without the operator |
| D6 | Children 009 to 017 wait for the operator's greenlight. A child whose opening check refutes its claim changes no code and records the decline |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-workflow-reentry-seed | `001-workflow-reentry-seed/goal.md` |
| 002-pi-bind-once | `002-pi-bind-once/goal.md` |
| 003-goal-resolver-prepare | `003-goal-resolver-prepare/goal.md` |
| 004-claude-start-claim | `004-claude-start-claim/goal.md` |
| 005-opencode-continuation-hop | `005-opencode-continuation-hop/goal.md` |
| 006-skilled-loop-command | `006-skilled-loop-command/goal.md` |
| 007-goal-handover-docs | `007-goal-handover-docs/goal.md` |
| 008-review-advisories | `008-review-advisories/goal.md` |
| 009-nudge-note-lines | `009-nudge-note-lines/goal.md` |
| 010-fanout-orphan-liveness | `010-fanout-orphan-liveness/goal.md` |
| 011-permission-mode-carry | `011-permission-mode-carry/goal.md` |
| 012-session-name-carry | `012-session-name-carry/goal.md` |
| 013-opencode-child-and-title | `013-opencode-child-and-title/goal.md` |
| 014-claude-stop-notice-and-crons | `014-claude-stop-notice-and-crons/goal.md` |
| 015-pi-mode-and-descendant-walk | `015-pi-mode-and-descendant-walk/goal.md` |
| 016-receiver-claim-under-goal | `016-receiver-claim-under-goal/goal.md` |
| 017-handover-docs-and-harness | `017-handover-docs-and-harness/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume --recursive --strict` prints `RESULT: PASSED` for the parent and all seventeen children
- [ ] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/*/acceptance-criteria.md` prints no line
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0
- [ ] `node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0
- [ ] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0
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
| Review | Done | 2026-11-12: a fresh Fable 5.2 at high effort, run read-only through the Claude Code CLI, reported 14 findings in `scratch/review-1.md` |
| Verification | Done | 2026-11-12: a separate Opus 5.5 checked every finding against the code in `scratch/verify-1.md`: 2 refuted, 12 kept with corrected severities, 7 new findings, 7 work packages with no shared file |
| Phase parent and seven children scaffolded | Done | `create.sh --phase --path ... --phase-names ... --with-goal --level 2` exit 0 on 2026-11-12 |
| Baseline before the phases | Done | 2026-11-12, the verifier's run on main `165e274413`: relaunch and OpenCode plugin suites 944 of 944, goal hook suites 199 of 199 |
| Planning of all seven phases | Done | 2026-11-13: DeepSeek V4.1 Flash max wrote spec, plan, tasks, criteria and goal of each child from its verified findings, one dispatch per phase. Each child printed RESULT: PASSED under strict validation with every criterion Unmet. Recursive strict validation of the session-relaunch parent: 39 PASSED, 0 FAILED. Committed as 8b4e1d88bc |
| Builds of phases 001 to 006 | Done | 2026-11-13, one dispatch at a time, test first: Luna xhigh fast through codex exec built 001 and 005 and wrote the failing tests of 003. DeepSeek V4.1 Flash max through OpenCode built 002, 004, 006 and the source of 003. Each phase holds its failing run in scratch/red.txt and its passing run in scratch/green.txt |
| Phase 007 documents | Done | 2026-11-13: DeepSeek V4.1 Flash max updated the session-relaunch README and the flags example from scratch/build.diff |
| Review of the diff | Done | 2026-11-13: an Opus 5.5 review stalled after an hour and was stopped. The orchestrator finished it from the experiments left in the scratchpad and by reading each change. Three fixes followed in one DeepSeek pass: one goal search per prepare, a message and exit 127 when the shim does not know its checkout, a guard test under the master switch. The orchestrator also made the goal bring-back step... |
| Goal gate | Done | 2026-11-13, from the final working tree, run by the orchestrator: validate.sh --recursive --strict printed RESULT: PASSED eight times and RESULT: FAILED never, the Unmet search printed no line, the relaunch and OpenCode plugin suites ran 1471 of 1471, the goal hook suites 200 of 200 and the Pi suite 59 of 59, each exit 0 |
| Deep review | Done | 2026-11-13: three iterations by DeepSeek V4.1 Flash max through the deep review workflow, all four dimensions, stop reason maxIterationsReached. Verdict PASS with nine P2 advisories. One reviewer P1 on the Claude start claim event name was downgraded by the orchestrator, because Claude hook payloads name their event. Report in review/review-report.md, commit a3293de363 |
| Child 008 review advisories | Done | 2026-11-13: the operator answered Sure to a follow-up phase. One child with four work packages, built by DeepSeek V4.1 Flash max, test first. Relaunch and OpenCode plugin suites 1480 of 1480, goal hook suites 200 of 200, Pi suite 59 of 59, each exit 0, run by the orchestrator from the final tree |
| Live hop on Claude Code | Started | 2026-11-13: the sending session, loop id 50984 with 0 hops, wrote a handoff note and ran prepare after the packet was merged and pushed as 35c3188681. The receiver records whether the claim arrived and whether this goal was bound again without a human |
| Live hop on Claude Code | Done | 2026-11-13: receiver 74f9de05 in loop 50984, SKILLED_LOOP_HOPS=1. The claim seed, the claim instructions and the spec folder arrived without a human, and claim exited 0. The goal was not carried: no goal_packet field in the note, no Goal packet line, SESSION_RELAUNCH_GOAL_PACKET unset, goal.cjs show goal_present=false. The receiver read goal.md from the packet path. Suspected cause: the sender had no goal prepare could prove |
| Live goal hops on Claude Code 2.1.323 | Done | 2026-11-13, playbook GR-1 to GR-3 in a throwaway checkout: goal hop passed (receiver goal_status 3990 chars, goal-start-claim, note done), both controls left the receiver with no goal, suites 573 of 573. The harness ping withdraws an armed hand-over, so it was dropped. Evidence in scratch/live-hops-claude-2026-11-13 |
| Receiver claim under a carried goal | Open | 2026-11-13: five goal hops with the fixed harness all relaunched and all started the receiver on the goal, but the receiver claimed the note in only two (runs 2 and 9) and replied PONG until the goal paused in three (6, 7, 8). The demo goal forbids other work, so a real goal is untested |
| Deep research on hand-over gaps | Done | 2026-11-13: three iterations on the native deep-research agent with Opus at medium, after two guards refused Fable 5.2. Every gap in the report is confirmed in code and fourteen changes are ranked in research/research.md section 9. Nothing was run live |
| Background worker across a hop (2026-11-13 live proof) | Done | 2026-11-13, live: a Claude sender started a node worker with an ampersand and ran prepare itself. Prepare exited 0 with the worker alive, the killer ended the sender 9 s later, and the worker ran on with parent pid 1 for 37 s more until the harness killed it. Evidence in scratch/live-hops-claude-2026-11-13/10-background-worker-orphaned |
| Children 009 to 017 planned | Done | 2026-11-13: the operator asked for phases covering every recommendation, chose this packet as their home and said "Dont implement untill i give greenlight". `create.sh --phase --parent ... --with-goal --level 2` scaffolded nine children, and nine Opus sub-agents wrote spec, plan, tasks, criteria and goal, one child each. The orchestrator read every spec and task list, moved the harness note line into 009, gave research open question 2 to 014 and wrote the build order into `spec.md`. No code, hook, harness or playbook changed |
| Operator answers for children 010, 011 and 015 | Done | 2026-11-13: "Refusal only" for a reused pid (010), "B: keep launch mode" for a live plan mode (011), "Accept the decline" for the descendant walk (015). Each child records its own answer |
| Greenlight | Done | 2026-11-13, the operator's words: "Implement using deepseek v4.1 flash max cli opencode with opencode go provider, max parallel". The operator then chose "A) Create a git worktree" and "Parallel where no file is shared". Worktree `worktrees/363-hop-state-carry` from main `57411c2d6e`. Builders run on OpenCode 1.19.4 with `opencode-go/deepseek-v4.1-flash` at variant max, because OpenCode 2.2.7 lists no opencode-go provider |
| Build of children 009 to 017 | Started | Three lanes: 009, 011, 012, 015, 016 in that order with 014 beside 012. 010 alone. 013 alone. 017 last |
| Child 009 nudge and note lines | Done | 2026-11-13: built by DeepSeek V4.1 Flash max in two runs, the first cut off by a restart of the orchestrating session. Run by the orchestrator from the final tree: relaunch and OpenCode plugin suites 1489 of 1489, exit 0, 12 criteria Met, strict validation RESULT: PASSED. Commit 55e45b3cb2 |
| Child 010 fan-out orphan liveness | Done | 2026-11-13: built by DeepSeek V4.1 Flash max in two runs, the first cut off by a restart of the orchestrating session. Run by the orchestrator from the final tree: the four named deep-loop suites 248 passed and 1 skipped, exit 0, the reproduction shows one live shim and the second runner at exit 3 with no `orphan_requeued` row, strict validation RESULT: PASSED. Commit 76f8260245 |
| Child 013 live checks | Done | 2026-11-13, live on OpenCode 2.2.7 by an Opus sub-agent, every cited trace line opened by the orchestrator: a parent's `session.idle` arrives while its backgrounded sub-agent is busy, the child carries its parent id at the top level of the event, and a title can be set while the bridged client has no `update`. The operator answered "Amend scope (Recommended)": one `session.update` method on the bridge's client |
| Child 011 permission mode carry | Done | 2026-11-13: built by DeepSeek V4.1 Flash max. The orchestrator ran the four live `claude -p` checks on Claude Code 2.1.323 and added the `default` spelling test first. The bypass rule stays the stricter one, because this machine's settings default to bypass. Commit 0e516a4ab6 |
| Child 013 child gate and title | Done | 2026-11-13: built by DeepSeek V4.1 Flash max with the approved bridge method. A live claim seed on OpenCode 2.2.7 renamed a session through the bridged call. Commits 195f1d764c and fd8a5c38e0 |
| Child 012 session name carry | Done | 2026-11-13: built by DeepSeek V4.1 Flash max in 75 minutes. A print-mode probe showed a launch name writes a custom title entry. Commit 76f1ebe1b6 |
| Child 014 Stop notice and crons | Done | 2026-11-13: built by DeepSeek V4.1 Flash max. A live hop in a throwaway checkout confirmed that a scheduled task and the todo list end with the session. Commit 2b38c908a4 |
| Suites after children 009 to 014 | Done | 2026-11-13, run by the orchestrator from the tree at 2b38c908a4: relaunch and OpenCode plugin suites 1521 of 1521, exit 0, twice in a row |
| Builder route changed | Done | 2026-11-13: the operator said "Try llmgateway dsh" and "For deepseek flash". A trial brief for phase 016's harness copy ran through `dsh` on the LLM Gateway route in four minutes, exit 0 with a `completed` final event. Children 015 to 017 are built through dsh with one small change per brief |

### Deviations and findings

| Item | Note |
|------|------|
| Reviewer route | The operator asked for a fresh Fable 5.2 at high effort. A repository hook refuses a Fable subagent while Fable drives the main loop, so the review ran through `claude -p --model claude-fable-5-2 --effort high`, on the operator's word that the self-invocation guard may be overridden |
| Decisions taken without the operator | The operator was asleep and asked for autonomous work. The spec folder (a related child of the session-relaunch parent) and the workspace (a new sk-git worktree, 358) follow the operator's answers of the same day for packets 036 and 037 |
| Goal not set by the operator | The operator cannot run `/goal` while asleep. This session reads this file before each phase, and a session cron re-reads it every 30 minutes and continues the next unfinished phase |
| Phase 003 builder | Luna stopped after the failing tests because its sandbox blocks `ps`, which fails three older tests there. DeepSeek implemented against those tests |
| Scope added by the review | Phase 003 gained one search per `prepare`, phase 006 the missing-checkout message and phase 004 a master switch guard test. Phase 005 gained the playbook suite count. None has a new requirement id. Each is recorded in its child's implementation summary |
| Not run live | No hop was run on any runtime before 2026-11-13. The live rows above replace this for Claude Code |
| Goal amended for children 009 to 017 | 2026-11-13: the objective gained the state a hop drops. D1 lost "no file is changed by two phases", because four sources are each changed by up to four children. D2 now orders all children by number. D3 allows three optional record keys. D5 no longer names worktree 358, which is removed. D6 is new. The five criteria are open again, and the first counts seventeen children |
| D2 amended at the greenlight | 2026-11-13: the operator asked for max parallel and chose parallel lanes where no file is shared, so D2 no longer says one at a time |
| Killer test failed once in a full run | 2026-11-13: `killer keeps the record armed when the target exits during its grace period` (`.skilled/hooks/session-relaunch/tests/killer.test.cjs:775`) failed once in one full run with a missing `target-signal` file, then passed five times alone and in two more full runs. Neither the test nor `lib/killer.cjs` is changed by any child. Suspected cause, not confirmed: its 450 ms timeout races the target under load. Out of scope here, left unchanged |
<!-- /ANCHOR:log -->
