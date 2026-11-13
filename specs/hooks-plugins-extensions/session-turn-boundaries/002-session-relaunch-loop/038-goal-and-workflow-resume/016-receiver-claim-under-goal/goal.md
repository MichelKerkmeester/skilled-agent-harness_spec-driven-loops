---
title: "Goal: Phase 16: receiver-claim-under-goal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "receiver claim under goal goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal"
    last_updated_at: "2026-11-13T13:20:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Measured ten live hops under the open goal and closed the phase with no code change"
    next_safe_action: "None, the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-receiver-claim-under-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: receiver-claim-under-goal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make a Claude receiver that starts on a carried goal claim its handoff note in every live run, measured first under a goal that allows other work, and change code only when that measure still shows a skipped claim.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D5 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | Measure before any change. Ten live goal hops under the `open` goal run first, from a copy of the 028 harness in this phase's `scratch/harness/`. The 028 harness is not edited. |
| D2 | The gate: ten claims of ten closes the phase with no code change, and AC-004 to AC-010 are waived by ADR-001. Any skipped claim builds change A. |
| D3 | Change A appends one claim line after the goal slice in the Claude start prompt, never before it, so the goal headline stays the first line. When the two pass 4,000 characters, the line is dropped and the goal is kept. |
| D4 | No relaunch record change and no new module, per parent decision D3. The start context claim stays as it is. |
| D5 | Candidates B to E in `spec.md` section 3 are not built in this phase. |
| D6 | Nothing runs before the operator's greenlight. Local commits only, nothing pushed or merged without the operator. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -l goal-start-claim scratch/live-open/*/relaunch.log` lists 10 files, and section 4 holds a Decision gate row whose count matches the files `rg -l 'Z  claimed ' scratch/live-open/*/history.txt` lists.
- [x] On the close branch, `rg -c 'ADR-001' acceptance-criteria.md` prints 7 and `git diff --name-only -- .skilled` prints nothing.
- [x] On the build branch, `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`, and `rg -l '^status: done' scratch/live-after/*/*/note-final.md` lists 20 files.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal --strict` prints `RESULT: PASSED`.
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
| Planning documents | Done | Spec, plan, tasks, criteria and goal written 2026-11-13 from the five goal runs in `../scratch/live-hops-claude-2026-11-13/` and the playbook results of the same day |
| Operator greenlight | Done | 2026-11-13, verbatim: "Implement using deepseek v4.1 flash max cli opencode with opencode go provider, max parallel". Later the same day the operator moved the builds to `dsh` on the LLM Gateway route |
| Harness copy and `open` goal | Done | T001 to T003: a `dsh` trial brief added the `open` mode to the copy. The `open` goal holds no `PONG` and no `do nothing else`, and the default goal matches the 028 copy byte for byte |
| Run set | Done | Claude Code 2.1.323 with `claude-sonnet-5-5`, 3,990-character slice, the harness timing unchanged, wrapper and hooks copied from the tree at commit `06f67b755c` |
| Ten live runs under the `open` goal | Done | 2026-11-13, run one after another by an Opus sub-agent, counts rechecked by the orchestrator: ten folders under `scratch/live-open/`, `goal-start-claim` in ten of ten `relaunch.log` files, `status: done` in ten of ten `note-final.md` files |
| Decision gate | Done | Ten of ten counted runs hold a `claimed` line in `history.txt`. Branch taken: close with no code change. AC-004 to AC-010 are waived by ADR-001 |
| Change A | Not built | The gate closed the phase. `git diff --name-only -- .skilled` prints nothing |
| Third criterion | Not applicable | It binds the build branch only. It is ticked because the close branch was taken |

### Deviations and findings

| Item | Note |
|------|------|
| Start context drift line | Every receiver extract from 2026-11-13 opens its `SessionStart` content with `mk claude hook could not resolve; rebuild the spec-kit runtime or restore the missing adapter`, in passing and failing runs alike. T005 names the adapter that drifts in the sandbox. It is recorded, not fixed here |
| Measured rate so far | Two claims in five goal runs under the `pong` goal (runs 2 and 9 claimed, runs 6, 7 and 8 did not), with `goal-start-claim` logged in all five |
| Playbook follow-up | When change A is built, phase 017 updates GR-1 in the Claude playbook. This phase does not edit it |
| Attempts that never hopped | Four of fourteen attempts were not counted and were rerun under their number (8, 9, 10 and 10 again). In each the sender ran `prepare` and then opened a question dialog about creating `never-created-completion.flag`, the file the `open` goal names as its met condition. `relaunch.log` stops at `prepare ... status=pending` with no `killer-signal` and no `relaunch` line. Suspected cause, not confirmed: an open question dialog leaves the turn unfinished, so the Stop hook never arms the record. This is a sender that does not hand over, not a receiver that skips its claim, so it is outside this phase's measure |
| Run 1 sender met the goal | The sender in run 1 ran `touch never-created-completion.flag`, and its log shows `met=true` before the hop. Its receiver still got the goal as its start prompt and claimed. Runs 2 to 10 left the flag uncreated. Nine runs are clean on this point and one is not |
| What the count shows | Under a goal that allows other work the receiver claimed in every counted run. Under the `pong` goal, whose text says to do nothing else, it claimed in two of five. The count supports the reading that the earlier skipped claims came from that goal's wording. Ten runs do not prove a rate of 100 percent |
| Drift line source | The sandbox settings name one `SessionStart` adapter and it exists there, yet every receiver's start context opens with the drift line. It comes from a hook outside the sandbox settings. Not traced |
| Late write after finish-run | The Claude project folders of runs 3, 5 and 6 reappeared after `finish-run.sh` deleted them, each with one receiver transcript written in the same second. The sub-agent ran `finish-run.sh` again and none is left. Phase 017 fixes this in the 028 harness |
| Playbook follow-up | No claim line was built, so GR-1 in the Claude playbook needs no change for it. Phase 017 documents the receiver claim as measured here |
| Run byproducts | The harness also writes pane captures, the launch script and process lists into each run folder. They were moved out of the worktree, and each run folder keeps the five kinds of file the requirement names |
<!-- /ANCHOR:log -->
