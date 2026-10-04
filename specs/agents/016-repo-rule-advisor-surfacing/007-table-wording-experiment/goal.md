---
title: "Goal: Table wording experiment"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/007-table-wording-experiment"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Amended D1, D2, D4 and the criteria for isolated test environments"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Table wording experiment

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give a pre-registered answer to whether the shorter imperative no-table wording lowers the table rate in long replies when nothing else changes.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the table block in communication.md differs between the two arms, current and short. |
| D2 | Arms are isolated test environments built from commit edba53daeb, with runs interleaved in one order shuffled with seed 16. No hook serves variants, and the live rule files do not change during the run. |
| D3 | The semicolon rate is tracked only as a drift control. |
| D4 | The chosen wording goes live only after the 006 post-change window is measured. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] git log shows preregistration.md, with its metric, sample size, run schedule and decision rule, committed before the first scored run
- [ ] git log shows no change to the live communication.md, AGENTS.md or REPO RULES.md between the first scored run and the decision
- [ ] Each arm reaches the pre-registered sample size
- [ ] results/ reports each arm's table rate with its denominator and Wilson interval, excluding requested tables
- [ ] The decision follows the pre-registered rule, a null result included, and the chosen wording is committed with a ledger entry after the 006 window is measured
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
| Phase work | In Progress | T001 to T003 done, preregistration.md committed in edba53daeb. The 600-run experiment is running |
| Isolated-environment amendment | Done | Live ABAB blocks replaced at the operator's request to run now. D1, D2, D4, REQ-002 and the criteria amended to match preregistration.md |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-004, SC-001 and SC-002 and tasks.md T008 to T010 |
<!-- /ANCHOR:log -->
