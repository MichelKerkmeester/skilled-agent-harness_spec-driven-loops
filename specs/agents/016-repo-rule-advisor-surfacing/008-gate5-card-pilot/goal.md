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
# Goal: Gate 5 card pilot

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce pre-registered data that decides whether Gate 5 should load rule cards with the full text on demand, and whether the five reply-rule cards should sit resident in AGENTS.md §8.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Rule text does not change in this phase. |
| D2 | Every card carries its self-check. No plain card is piloted. |
| D3 | Arm A loads full files, arm B has the router load cards with a full-file fallback and arm C adds the five reply-rule cards resident in AGENTS.md §8 to arm B. |
| D4 | No hook injects cards. |
| D5 | The first block starts only after phase 007 closes. |
| D6 | Arm C is measured on Claude Code and Codex only, and the result says so. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] pytest shows the card generator is deterministic, and a drift fixture with a rule edited without regenerating its card makes check 11 fail naming the card
- [ ] git log shows preregistration.md committed before the first block starts
- [ ] results/ shows each arm's long-reply count meeting the pre-registered size
- [ ] results/ and implementation-summary.md record the decision-rule outcome with the five prohibition checks, the fallback rate, delivered rule bytes per window and the Gate 5 and §8 miss rates per arm, each with denominator and interval
- [ ] The T002 measurement shows arm C ran only with the post-003 AGENTS.md plus 7,453 bytes at or under 32,768 bytes, or records why arm C was dropped
- [ ] git status and a file listing show no artifact of a rejected arm, and no generator, cards or check 11 when both card arms are rejected
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
| Phase work | Pending | spec.md metadata Status Draft. Criteria trace to acceptance-criteria.md AC-001 to AC-006 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
