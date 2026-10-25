---
title: "Goal: Persisted hop count validation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "persisted hops validation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation"
    last_updated_at: "2026-10-25T13:42:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-persisted-hops-validation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Persisted hop count validation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A relaunch record whose hop count is not a non-negative integer never relaunches.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Hops must be a number type, an integer and zero or more; anything else declines with reason `hop-cap` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/005-persisted-hops-validation --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A relaunch-core test feeds hops of -1, 1.5, null, "3", NaN and Infinity and gets `relaunch: false` for each, and fails on the code before the change
- [ ] Hops of 0 and 9 under a limit of 10 still relaunch, and 10 still declines
- [ ] `node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/005-persisted-hops-validation.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
