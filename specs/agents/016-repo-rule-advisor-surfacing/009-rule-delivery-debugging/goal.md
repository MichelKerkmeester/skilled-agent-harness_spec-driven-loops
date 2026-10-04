---
title: "Goal: Rule delivery debugging"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/009-rule-delivery-debugging"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Rule delivery debugging

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find why each executor skips a mandated rule load and fix it through the delivery surface, never through text added to user prompts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No candidate or adopted fix adds rule-reading instructions to a user prompt. |
| D2 | Arms run in isolated environments built by rule-experiment.py. The live AGENTS.md and REPO RULES.md change only when a winner is adopted. |
| D3 | A hook arm runs only when the measured miss rate passes a threshold stated in the pre-registration, as parent D3 requires. |
| D4 | A winner goes live only after the 006 and 007 windows are measured. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] results/ reports the natural Gate 5 and reply-rule miss rates for DeepSeek and Luna, each with its denominator and Wilson 95% interval
- [ ] results/ classes every missed run as not delivered, truncated, outranked or seen and skipped, and the class counts sum to the miss count
- [ ] git log shows preregistration.md, with arms, metric, sample size and decision rule, committed before the first scored arm run
- [ ] A search of the prompt sets and the adoption diff finds no instruction to read a rule
- [ ] results/ records the decision made by the pre-registered rule, a null result included, and any adoption commit is later than the 006 and 007 window results
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
| Phase work | Pending | tasks.md T001 to T011 open. Criteria trace to acceptance-criteria.md AC-001 to AC-008 |

### Deviations and findings

| Item | Note |
|------|------|
| Codex global is a separate file | ~/.codex/AGENTS.md resolves to .codex/AGENTS.md (10,361 B), which names neither REPO RULES.md nor communication.md. T003 traces how Luna receives the mandates |
<!-- /ANCHOR:log -->
