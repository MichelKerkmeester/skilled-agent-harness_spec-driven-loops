---
title: "Goal: Plan Text and Goal Closeout"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "plan text and goal closeout goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/012-plan-text-and-goal-closeout"
    last_updated_at: "2026-11-18T17:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 013 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Plan Text and Goal Closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every doc in the pi-context-decisions packet states what is true, every goal criterion carries evidence from a run and the packet closes Complete with the operator answers in a decision record.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The conductor edits every doc directly. No Luna leaf runs, because every edit is to a spec doc |
| D2 | Every `[x]` mark and every Evidence line in 002, 003 and 004 stays byte-identical. Only description text changes |
| D3 | Every tick quotes a command the conductor ran in this phase, never a number copied from a summary |
| D4 | The operator answers go through `/speckit:save` `--full-auto` with `scope` `local`, into this folder's `decision-record.md`. The phase parent gets no decision record |
| D5 | The parent goal is ticked only after the D6 finish sequence, because its criteria read `main` and `origin/main` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'run build' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/002-*/tasks.md` prints the T009 line
- [ ] `rg -n 'reporter=verbose' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/003-*/goal.md` prints at least one line
- [ ] `rg -n 'git diff --stat. lists' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/004-*` prints nothing
- [ ] `grep -c '^- \[ \]' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/00[234]-*/goal.md` prints 0 for all three files
- [ ] `grep -c '^| Q[0-9]' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/012-*/decision-record.md` prints the number of `answered_questions` lines in the parent `spec.md`, 9 at planning
- [ ] `grep -c '^- \[ \]' specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-*/goal.md` prints 0
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/host-integrations/003-pi-*/016-pi-* --recursive --strict --quiet` prints `RESULT: PASSED` for all fourteen folders
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
| Phase planned | Done | `spec.md`, `plan.md` and `tasks.md` written 2026-11-18. The bare bench command printed 0 `advisor-` lines and the verbose one printed 3 |

### Deviations and findings

| Item | Note |
|------|------|
| Lines beyond the brief | The rebuild order also sits in `../delegation-strategy.md:107`, and the three-file claim also sits in `../004-crash-path-fallback/plan.md:45` and `:73` and `../delegation-strategy.md:116`. All are in Files to Change |
| 003 spec scope | `../003-follow-up-routing-benchmark/spec.md:139` and `:156` say "the same run" and "one bench run" without the command, so they stay as they are |
<!-- /ANCHOR:log -->
