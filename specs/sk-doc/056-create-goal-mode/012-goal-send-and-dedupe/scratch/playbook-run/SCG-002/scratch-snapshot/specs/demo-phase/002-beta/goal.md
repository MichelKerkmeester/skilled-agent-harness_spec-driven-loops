---
title: "Goal: Beta Phase"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
  - "beta phase goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "demo-phase/002-beta"
    last_updated_at: "2026-09-26T20:20:43Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-demo-phase"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Beta Phase

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove that an interleaved run appends after the earlier run line: two interleaved runs keep both lines, the later run line follows the earlier run line, and the goal check for `002-beta` exits with RESULT: PASSED.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase proves the interleaved-run append order only; the single-run append property belongs to `001-alpha`. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] two interleaved runs keep both lines
- [ ] the later run line follows the earlier run line
- [ ] the goal check for `002-beta` exits with RESULT: PASSED
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
| Child goal authored | Done | goal.md filled from goal-phase-child-template.md |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
