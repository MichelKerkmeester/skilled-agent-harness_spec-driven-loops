---
title: "Goal: Demo packet specification"
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
    packet_pointer: "demo-packet"
    last_updated_at: "2026-09-26T19:58:05Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "specs/demo-packet/spec.md"
      - "specs/demo-packet/acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pi-demo-packet"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Demo packet specification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Define one counter update for counter.txt that fixes the duplicated and lost lines of concurrent runs, so counter.txt grows by exactly one line per run, an interleaved run appends after the earlier run line, and no existing line is rewritten or removed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | [A frozen choice from spec.md or decision-record.md, stated so a reader can tell whether work honors it] |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] counter.txt grows by exactly one line per run
- [ ] an interleaved run appends after the earlier run line
- [ ] no existing line is rewritten or removed
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
| Goal authored | Done | goal.md created from goal-top-level-template.md |

### Deviations and findings

| Item | Note |
|------|------|
| Counter update rule decision left as template placeholder | Operator brief: the counter update rule is not decided yet, so its decision row keeps the template placeholder text |
<!-- /ANCHOR:log -->
