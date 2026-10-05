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
    last_updated_at: "2026-10-05T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked criteria 1 to 4 met from the decision in 6ffe5e5514"
    next_safe_action: "Commit the short wording after the 006 window, then tick criterion 5"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 90
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

- [x] git log shows preregistration.md, with its metric, sample size, run schedule and decision rule, committed before the first scored run
- [x] git log shows no change to the live communication.md, AGENTS.md or REPO RULES.md between the first scored run and the decision
- [x] Each arm reaches the pre-registered sample size, or decision-record.md ADR-001 waives it
- [x] results/ reports each arm's table rate with its denominator and Wilson interval, excluding requested tables
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
| Phase work | Decided, adoption pending | T001 to T009 done. T010, the live wording commit, waits on the 006 post-change window |
| Criterion 1 | Met | preregistration.md committed in edba53daeb at 2026-10-04 23:39:41. The earliest scored transcript started at 23:39:55 |
| Criterion 2 | Met | git log edba53daeb..6ffe5e5514 on communication.md, AGENTS.md, REPO RULES.md and .skilled/repo-rules/ lists no commit |
| Criterion 3 | Met | results/final-scores.txt: 309 current and 316 short runs against 300 per arm. Delivered long replies were 108 per arm, below the roughly 190 the pilot projected |
| Criterion 4 | Met | results/final-scores.txt reports table (unasked) per arm and stratum with denominator and Wilson interval |
| Criterion 5 | Open | The decision half is met: results/decision.md applies rule 2, d = +0.0 points (-3.4 to +3.4), adopt the short wording. The wording commit and its ledger entry wait on the 006 window |
| Isolated-environment amendment | Done | Live ABAB blocks replaced at the operator's request to run now. D1, D2, D4, REQ-002 and the criteria amended to match preregistration.md |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-004, SC-001 and SC-002 and tasks.md T008 to T010 |
| Deviations 1 to 4 | results/deviations.md records four executor and schedule changes, each before the data it affects: SWE-2 Max, DeepSeek through OpenCode Go, the 60-run top-up and the Cline stratum |
<!-- /ANCHOR:log -->
