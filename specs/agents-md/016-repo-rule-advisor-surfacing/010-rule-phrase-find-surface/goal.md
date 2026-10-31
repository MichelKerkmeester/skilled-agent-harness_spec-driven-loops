---
title: "Goal: Rule phrase find surface"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/010-rule-phrase-find-surface"
    last_updated_at: "2026-10-04T22:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "repo-rule-advisor-2026-10-04"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Rule phrase find surface

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make repo-rule trigger phrases work as the ripgrep find surface they are, with docs that say so, one phrase guidance and plain-noun phrases where natural queries miss.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | .skilled/repo-rules is not added to the trigger index. |
| D2 | Phrases stay in rule frontmatter, as parent D4 requires. |
| D3 | No rule file changes before the 006 post-change window is measured. Doc and checker edits may go first. |
| D4 | No new error check, and no count check until the phrase guidance is settled. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The .skilled/repo-rules row in retrieval-conventions.md names phrases as the ripgrep find surface as well as the collision check
- [x] repo-rule-template.md and rule-anatomy.md state the same phrase guidance, with no conflicting count target
- [x] rg -i 'flaky test' .skilled/repo-rules finds root-cause-and-debugging.md
- [x] check-repo-rules.cjs prints RESULT: PASSED and retrieval-coverage-parity.vitest.ts passes
- [x] git log shows the first rule-file commit of this phase after the 006 window result, or implementation-summary.md records why it landed before
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
| Phase work | Pending | tasks.md T001 to T009 open. Criteria trace to spec.md REQ-001 to REQ-005 |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md requirements and tasks.md T007 to T009 |
| Counts differ from the brief | The brief said 163 absent phrases and four rules over 20. Measured: 150 to 166 by matching method, and three rules over 20 |
<!-- /ANCHOR:log -->
