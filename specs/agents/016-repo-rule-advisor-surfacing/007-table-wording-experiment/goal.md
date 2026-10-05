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
    last_updated_at: "2026-10-04T16:40:25Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
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
| D1 | Only the table block in communication.md changes, swapped at block boundaries in ABAB order: current, short, current, short. |
| D2 | Variants alternate by block. Sessions are not randomized and no hook serves variants. |
| D3 | The semicolon rate is tracked only as a drift control. |
| D4 | Block 1 starts only after phase 006 has shipped. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] git log shows preregistration.md, with its metric, sample size, block schedule and decision rule, committed before block 1 starts
- [ ] git log shows no change to communication.md beyond the table-block swaps, and none to AGENTS.md or REPO RULES.md, inside any block
- [ ] Each arm reaches the pre-registered sample size
- [ ] results/ reports each block's table rate with its denominator and Wilson interval, excluding requested tables
- [ ] The decision follows the pre-registered rule, a null result included, and the chosen wording is committed with a ledger entry
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
| Phase work | Pending | tasks.md T001 to T010 open |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-004, SC-001 and SC-002 and tasks.md T008 to T010 |
<!-- /ANCHOR:log -->
