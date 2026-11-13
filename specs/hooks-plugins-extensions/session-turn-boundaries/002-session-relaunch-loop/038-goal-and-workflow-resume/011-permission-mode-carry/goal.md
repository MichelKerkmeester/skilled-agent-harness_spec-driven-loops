---
title: "Goal: Phase 11: permission-mode-carry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "permission mode carry goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/011-permission-mode-carry"
    last_updated_at: "2026-11-13T08:49:33Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: permission-mode-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude receiver starts in the permission mode its sender held at Stop, unless that mode cannot be replayed safely, in which case it starts in the launch mode and says why.

### Decisions

Frozen choices. Changing one is an amendment. The parent's decisions bind here, and the child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Nothing is built until the operator gives the greenlight. The operator's words: "Dont implement untill i give greenlight". |
| D2 | Claude only. Codex, Cursor, Devin, OpenCode and Pi keep today's behaviour, and `codex/stop-arm.mjs` is not edited. |
| D3 | The two live checks, the default-mode spelling and the bypass rule, run against Claude itself before any source edit. A rule that rests on them is written from what Claude printed, never from the help text alone. |
| D4 | The wrapper replays only a mode in the accepted set and never adds `--dangerously-skip-permissions` or `--allow-dangerously-skip-permissions` of its own. |
| D5 | Test first. Each new test holds a recorded failing run before its source edit. |
| D6 | This phase lands before phases 012 and 014, which edit `.skilled/bin/skilled-loop` and `claude/stop-arm.mjs`. |
| D7 | A live `plan` mode is not carried. The receiver starts in the launch mode and the wrapper prints one note, option B of `spec.md` section 10, chosen by the operator on 2026-11-13. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -c -e '^default-mode payload: ' -e '^default flag exit: ' -e '^bypass alone: ' -e '^dangerously plus acceptEdits: ' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/scratch/live-checks.md` prints 4.
- [ ] `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs .skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-model-effort.test.cjs .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `fail 0`.
- [ ] `rg -n "permissionMode" .skilled/hooks/session-relaunch/codex` prints nothing.
- [ ] `rg -c '\| Unmet \|' specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry/acceptance-criteria.md` prints 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/011-permission-mode-carry --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

Open question: when the sender's live mode is `plan`, which of options A to D in `spec.md` section 10 applies? The recommendation is B, keep the launch mode and print one note line, because a receiver in plan mode is expected to be blocked from writing the claim (inferred, not tested). REQ-007, T003, T012 and T014 wait on this answer.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning | Done | 2026-11-13: spec, plan, tasks, acceptance criteria and goal written from research.md section 5 and section 9 rank 5, every cited line reopened. Baseline at e1886c57c8: relaunch-core 155, session-relaunch-cli 158, claude-adapters 67, model-effort 54, launch-arguments 45, each `fail 0` |
| Plan-mode answer | Done | Answered by the operator on 2026-11-13: "B: keep launch mode". A live `plan` is not carried, the receiver starts in the launch mode and the wrapper prints one note |
| T001 and T002 live checks | Done | 2026-11-13, run by the orchestrator after the build on Claude Code 2.1.323: `--permission-mode default` is accepted and reported as `default`, `bypassPermissions` alone exits 0 on a machine whose settings default to bypass, and `--dangerously-skip-permissions` wins over `acceptEdits`. Four lines in `scratch/live-checks.md` |
| Default spelling | Done | 2026-11-13: the builder's fallback rejected `default`. The orchestrator added the test `a live default permission mode replaces the launch mode`, saw it fail on the warning line, and added `default` to the wrapper's accepted modes. Red and green runs are appended to `scratch/red.txt` and `scratch/green.txt` |
| Live checks T001 and T002 | Blocked | 2026-11-13: both need a live Claude session, which this dispatched worker may not start. Marked `[B]`, and the conservative unrecorded-fact fallback is built: the accepted set is the six help choices only, and a live bypass needs the launch unlocking flag |
| Build T005 to T018 | Done | 2026-11-13: red runs in `scratch/red.txt` and green runs in `scratch/green.txt`. Five files 493 tests, `fail 0`, exit 0; whole session-relaunch suite 913 tests, `fail 0`; `bash -n` and `node --check` exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Default mode spelling | `claude --help` on 2.1.323 lists `acceptEdits`, `auto`, `bypassPermissions`, `manual`, `dontAsk` and `plan`, with no `default`. Codex fixtures carry `"permission_mode": "default"` (`.skilled/hooks/session-relaunch/tests/fixtures/codex-stop.json:8`). Whether Claude's payload says `default` for its manual mode is inferred, so T001 checks it |
| Launch replay order | A launch `--permission-mode` is replayed today as an extra argument after the seed (`.skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs:53-57`). Making it record-backed moves it ahead of the seed, so that test's expected order changes in T013. The deny-list case at `:95-96` and the separator case at `:122-123` carry the same flag and also had to change |
| T006 verify depends on T008 | The Stop-arm edit alone cannot pass its stated verify: the core drops an unknown `settings` key until the T008 edit, so the T005 command printed `fail 0` only after T008. T006 was rechecked then |
| Baseline drift | The plan baseline of 158 `session-relaunch-cli` tests was 162 at build time because work landed on this tree after planning. The five-file total is 493, not 479 plus 10 |
| Unrecorded live facts | No `scratch/live-checks.md` exists. AC-001 stays Unmet and the packet stays Draft. The fallback: the accepted set is the six help choices, a live `default` keeps the launch mode, and a live `bypassPermissions` needs an unlocking flag on the launch line |
<!-- /ANCHOR:log -->
