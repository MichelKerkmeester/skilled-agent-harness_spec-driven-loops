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
    last_updated_at: "2026-11-13T10:00:00Z"
    last_updated_by: "planner"
    recent_action: "Planned the live claim-rate runs and the gated claim-line change"
    next_safe_action: "Wait for the operator's greenlight, then run T001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-receiver-claim-under-goal"
      parent_session_id: null
    completion_pct: 0
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

- [ ] `rg -l goal-start-claim scratch/live-open/*/relaunch.log` lists 10 files, and section 4 holds a Decision gate row whose count matches the files `rg -l 'Z  claimed ' scratch/live-open/*/history.txt` lists.
- [ ] On the close branch, `rg -c 'ADR-001' acceptance-criteria.md` prints 7 and `git diff --name-only -- .skilled` prints nothing.
- [ ] On the build branch, `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`, and `rg -l '^status: done' scratch/live-after/*/*/note-final.md` lists 20 files.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/016-receiver-claim-under-goal --strict` prints `RESULT: PASSED`.
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
| Operator greenlight | Pending | The standing instruction is "Dont implement untill i give greenlight" |
| Harness copy and `open` goal | Pending | T001 to T003 |
| Ten live runs under the `open` goal | Pending | T006 and T007 |
| Decision gate | Pending | T008 writes the count out of ten and the branch here |
| Change A | Pending | Built only on the build branch |

### Deviations and findings

| Item | Note |
|------|------|
| Start context drift line | Every receiver extract from 2026-11-13 opens its `SessionStart` content with `mk claude hook could not resolve; rebuild the spec-kit runtime or restore the missing adapter`, in passing and failing runs alike. T005 names the adapter that drifts in the sandbox. It is recorded, not fixed here |
| Measured rate so far | Two claims in five goal runs under the `pong` goal (runs 2 and 9 claimed, runs 6, 7 and 8 did not), with `goal-start-claim` logged in all five |
| Playbook follow-up | When change A is built, phase 017 updates GR-1 in the Claude playbook. This phase does not edit it |
<!-- /ANCHOR:log -->
