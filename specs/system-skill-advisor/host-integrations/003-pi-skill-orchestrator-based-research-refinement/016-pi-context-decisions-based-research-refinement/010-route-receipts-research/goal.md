---
title: "Goal: Route Receipts Research"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "route receipts research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/010-route-receipts-research"
    last_updated_at: "2026-11-18T16:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Start task T001 once phase 009 is complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Route Receipts Research

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find out whether weak follow-ups still need session state on the final strip rule, and if they do, fix one stored route receipt design that phase 011 can build and be judged against.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Q0 runs first and is a conductor task. It reruns the 003 follow-up bench with `--reporter=verbose` after phase 009 closes and applies 003's rule unchanged |
| D2 | The Q0 branch is decided on `H` with the policy reason read from stripped text. `H` on raw text is recorded beside it, never used to decide. This is the planner's default, not an operator decision, and the operator may amend it before Q0 runs |
| D3 | If Q0 takes the no-guard branch, the research stops and the conductor tells the operator before any build |
| D4 | One lineage of 3 iterations on `claude-opus-5-5` at high effort through cli-claude-code on the second Claude account, mirroring phase 005. The operator did not set this executor |
| D5 | The research is read-only. It writes only inside `research/` and changes no advisor code, test, fixture or phase 011 doc |
| D6 | Q5 freezes phase 011's harness, success threshold and false-carry case before phase 011 starts |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `rg -n 'Q0 branch' implementation-summary.md` prints one line naming over-suppresses or no guard
- [x] On the over-suppresses branch, `rg -c '"type":"iteration"' research/deep-research-state.jsonl` prints 3
- [x] On the over-suppresses branch, `rg -n '^#+ .*Q[1-5]' research/research.md` prints a heading for each of Q1 to Q5
- [x] Not applicable, Q0 took the over-suppresses branch. On the no-guard branch, `research/deep-research-state.jsonl` does not exist and `rg -n 'Operator decision' implementation-summary.md` prints one line
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and this goal written 2026-11-18 |
| Q0 rerun | Done | `N=9`, stripped `H=5`, raw `H=4`, `Hsame=2`, `C=19` at `18ce562e8b3`: over-suppresses |
| Research run | Done | 3 iterations on `claude-opus-5-5` high, account 2, launched with phase 005's override on the operator's approval. Q1 to Q5 answered in `research/research.md` |
| Pre-006 baseline | Done | The bench at `84a2d1eb697` printed `N=9 H=5 Hsame=2 C=19`. This is not the Q0 result |

### Deviations and findings

| Item | Note |
|------|------|
| Pi sends no session id | `hooks/pi/prompt-advisor.ts:289-294` calls the shared handler with only `prompt`, `cwd` and `hook_event_name`, so a receipt keyed on `session_id` would do nothing on Pi without an adapter change. Q4 owns it |
| Floored set is no topic test | A complete refactor task is floored on work intent and its floored passing set holds `sk-doc`, like "fix that too". Q1 owns the test that separates them |
<!-- /ANCHOR:log -->
