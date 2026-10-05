---
title: "Goal: Gate 5 card pilot"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/008-gate5-card-pilot"
    last_updated_at: "2026-10-05T09:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Marked criteria 1, 2, 5 and 6 met from the decision in 6ffe5e5514"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Gate 5 card pilot

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce pre-registered data that decides whether Gate 5 should load rule cards with the full text on demand.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rule text does not change in this phase. |
| D2 | Every card carries its self-check. No plain card is piloted. |
| D3 | Arm full loads full files. Arm cards points the 13 trigger-table links at cards/ and tells the model to open the full file when the card does not settle it. Arm C, resident reply-rule cards, is dropped under REQ-005. |
| D4 | No hook injects cards. |
| D5 | Arms run in isolated test environments built by rule-experiment.py. The live rule files do not change, and a winning arm goes live only after the 006 window is measured and 007 has decided. |
| D6 | If arm cards is adopted, checks 2 and 10 accept card links before the router change lands. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] pytest shows the card generator is deterministic, and a drift fixture with a rule edited without regenerating its card makes check 11 fail naming the card
- [x] git log shows preregistration.md committed before the first scored run
- [x] results/ shows each arm's long-reply count meeting the pre-registered size, or decision-record.md ADR-002 waives it
- [x] results/ and implementation-summary.md record the decision-rule outcome with the five prohibition checks, the fallback rate, delivered rule bytes per window and the Gate 5 and §8 miss rates per arm, each with denominator and interval
- [x] experiment/arms.json records arm C dropped because the post-003 AGENTS.md plus the five reply-rule cards exceeds 32,768 bytes
- [x] git status and a file listing show no generator, cards or check 11 if arm cards is rejected
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
| Phase work | Decided, adoption pending | T001 to T009 done. results/decision.md applies rule 1, adopt cards, committed in 6ffe5e5514. T010 and T011, checks 2 and 10 plus the router change, wait on the 006 post-change window. Criteria trace to acceptance-criteria.md AC-001 to AC-006 |
| Criterion 1 | Met | AC-001: test_build_rule_cards.py 4 passed, the drift test asserts cards/alpha.md: drifted from its rule |
| Criterion 2 | Met | preregistration.md committed in 3990bc9fa5 at 2026-10-04 23:58:14. The earliest scored transcript started at 23:58:29 |
| Criterion 3 | Open | results/final-scores.txt: 162 cards and 156 full runs, 132 and 138 long replies, against 180 runs per arm per executor. Deviation 3 cut the schedule. AC-003 Unmet |
| Criterion 4 | Open, partial | final-scores.txt gives the five prohibition checks, fallback, Gate 5 miss and reply-rule (section 8) miss per arm with denominator and Wilson interval. Rule bytes are a mean per run with no denominator or interval, so this stays open until the operator accepts that form or a byte interval is added. Outcome rule 1 in decision.md and implementation-summary.md |
| Criterion 5 | Met | AC-005: 26,778 B plus 7,677 B is 34,455 B, arm C drop recorded in experiment/arms.json |
| Criterion 6 | Met | Cards were not rejected, so nothing is removed. The full arm is the current repository. No live cards/ directory and git status clean on 2026-10-05 |
| Arm C dropped | Done | AGENTS.md 26,778 B plus five reply-rule cards 7,677 B is 34,455 B, above 32,768 B. The spec estimated 7,453 B |

### Deviations and findings

| Item | Note |
|------|------|
| Isolated environments replace blocks | Same change as 007, at the operator's request. D3, D5 and D6 amended, and the old D6 (arm C on Claude Code and Codex only) lapsed with arm C |
| Checks 2 and 10 on the card router | On the arm cards router check 2 fails by design and check 10 reports bullets=0, against 61 live. Both need card-link support before adoption |
| Deviations 1 to 4 | results/deviations.md records four executor and schedule changes, each before the data it affects: SWE-2 Max with the Luna stop at 235 runs, DeepSeek through OpenCode Go, the 30-run top-up and the Cline stratum |
| Risks after adoption | Reply-rule miss +6.5 points under cards (-4.3 to +17.2), and full-file fallback after a card in 55.9% of runs |
<!-- /ANCHOR:log -->
