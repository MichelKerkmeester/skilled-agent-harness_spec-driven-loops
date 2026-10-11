---
title: "Goal: Phase 13: python-advisor-native-and-parity"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/013-python-advisor-native-and-parity"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-013-python-advisor-native-and-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 13: python-advisor-native-and-parity

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Accept a fresh index as native-eligible in the Python bridge, port the plain-mention and own-doc-target rules to the Python scorer, and make both battery scripts fail on any row whose source is not native.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Use the content-hash index staleness the status handler already computes as the evidence, rather than changing what shutdown publishes. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py "Refactor skill_advisor.py to surface raw ambiguity counts" --force-native`, run from the repository root, prints recommendations, not "Native advisor unavailable".
- [ ] `python3 -m pytest -q .skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py`, run from the repository root, reports 0 failed.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/parity`, run from the repository root, reports 0 failed.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/013-python-advisor-native-and-parity --strict`, run from the repository root, prints RESULT: PASSED.
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
| Phase planned | Done | spec.md, plan.md, tasks.md and this goal written by the orchestrator |
| Cause traced | Done | orchestrator |
| Bridge fix | Done | t3-p013a |
| Batteries | Done | t3-p013c |
| Python port | Done | t3-p013b |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
