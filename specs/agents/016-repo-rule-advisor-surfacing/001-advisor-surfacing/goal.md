---
title: "Goal: Repo rule surfacing through the advisor"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing"
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
# Goal: Repo rule surfacing through the advisor

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce a research verdict, grounded in this repository, on which surface if any should surface repo rules, what it would emit, when it stays silent and what it costs in context per turn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase decides only. It implements no surface and changes no rule content or REPO RULES.md trigger row. |
| D2 | Two cli-devin lineages, swe-2-max and deepseek-v4-1-flash-max, run four iterations each and write only under research/. |
| D3 | The evaluation covers at least an advisor brief pointer, adding .skilled/repo-rules to the trigger-index corpus and an action-keyed PreToolUse advisory. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] research/lineages/swe-2-max/ and research/lineages/deepseek-v4-1-flash-max/ each hold four iteration files
- [ ] Every load-bearing claim in research/research.md cites a file:line that resolves in the working tree
- [ ] research/research.md names a silence condition and a per-turn context cost for every surface it admits
- [ ] research/research.md names each disagreement between the two lineages with the evidence each side used
- [ ] research/research.md gives one recommended path, or a refusal with the test that decided it, and records each ruled-out direction with its deciding evidence
- [ ] validate.sh --strict on this phase prints RESULT: PASSED
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
| Phase work | Complete per spec.md | spec.md metadata Status Complete and tasks.md T001 to T010 ticked. Criteria left unticked until an evaluator confirms them |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-004, SC-001 and SC-002 and tasks.md T010 |
<!-- /ANCHOR:log -->
