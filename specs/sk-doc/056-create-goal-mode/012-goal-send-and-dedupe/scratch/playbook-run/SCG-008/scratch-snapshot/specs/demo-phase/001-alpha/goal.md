---
title: "Goal: Alpha phase"
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
    packet_pointer: "specs/demo-phase/001-alpha"
    last_updated_at: "2026-09-26T20:17:19Z"
    last_updated_by: "mimo-v2.6-pro"
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
# Goal: Alpha phase

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove the counter.txt append behavior in this phase: one run appends exactly one counter line, the appended line records the run identifier and a checksum, and the goal check passes for the alpha goal.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase proves the counter.txt behavior only; no file outside counter.txt changes. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] one run appends exactly one counter line
- [ ] the appended line records the run identifier and a checksum
- [ ] the goal check passes for the alpha goal
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
| Goal authored from the phase-child template | Done | `/create:goal` run; `check-goal.cjs` clean |
| Criteria updated to match the amended parent decision | Done | `/create:goal amend` run; `check-goal.cjs` clean |

### Deviations and findings

| Item | Note |
|------|-------|
| None | Nothing diverged from the packet sources while authoring this goal |
<!-- /ANCHOR:log -->
