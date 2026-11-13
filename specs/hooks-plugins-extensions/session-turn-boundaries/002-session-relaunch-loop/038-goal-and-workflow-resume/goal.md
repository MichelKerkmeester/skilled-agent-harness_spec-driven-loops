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
    last_updated_at: "2026-11-12T22:43:16Z"
    last_updated_by: "orchestrator"
    recent_action: "Ran the deep review and closed child 008, which fixes its nine advisories"
    next_safe_action: "Await the operator's decision on merge and push of worktree 358"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-038-goal-and-workflow-resume"
      parent_session_id: null
    completion_pct: 100
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

**Objective:** After a session hop the receiver runs the command the sender was running, reads the goal of the phase it works, and every runtime either carries the session goal or says in one line why it did not: Cursor and Devin keep a handed-over goal at their next handoff, Pi binds a hop's goal once per process, a Claude claim is delivered with the relaunch switch off, the OpenCode goal continuation leaves a prepared hop alone, `skilled-loop` runs as typed, and the documents match what shipped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One child phase per work package of the verified review of 2026-11-12, in the order of the phase map. No file is changed by two phases. Each code change lands with a test that failed before it |
| D2 | Phases run one at a time, 001 to 006. Phase 007 documents what 003 and 004 shipped and runs last |
| D3 | No phase changes the relaunch record format or adds a module. The active command travels as a line in the handoff note |
| D4 | The review's fixes for a cleared Claude goal, the shared goal off switch and the resend reminder are not applied: the verification refuted the first two and the third would switch off a resend the operator needs |
| D5 | Local commits on the worktree branch only. Nothing is merged into main or pushed without the operator |

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

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume --recursive --strict` prints `RESULT: PASSED` for the parent and each of the eight children
- [x] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/*/acceptance-criteria.md` prints no line
- [x] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0
- [x] `node --test .skilled/hooks/goal/**/*.test.cjs .skilled/hooks/goal/**/*.test.mjs` exits 0
- [x] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0
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

### Deviations and findings

| Item | Note |
|------|------|
| Reviewer route | The operator asked for a fresh Fable 5.2 at high effort. A repository hook refuses a Fable subagent while Fable drives the main loop, so the review ran through `claude -p --model claude-fable-5-2 --effort high`, on the operator's word that the self-invocation guard may be overridden |
| Decisions taken without the operator | The operator was asleep and asked for autonomous work. The spec folder (a related child of the session-relaunch parent) and the workspace (a new sk-git worktree, 358) follow the operator's answers of the same day for packets 036 and 037 |
| Goal not set by the operator | The operator cannot run `/goal` while asleep. This session reads this file before each phase, and a session cron re-reads it every 30 minutes and continues the next unfinished phase |
| Phase 003 builder | Luna stopped after the failing tests because its sandbox blocks `ps`, which fails three older tests there. DeepSeek implemented against those tests |
| Scope added by the review | Phase 003 gained one search per `prepare`, phase 006 the missing-checkout message and phase 004 a master switch guard test. Phase 005 gained the playbook suite count. None has a new requirement id. Each is recorded in its child's implementation summary |
| Not run live | No hop was run on any runtime. Every claim rests on the suites and on reading the code |
<!-- /ANCHOR:log -->
