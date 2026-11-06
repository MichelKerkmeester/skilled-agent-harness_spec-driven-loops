---
title: "Goal: Phase 1: skill-and-tag-move"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "skill and tag move goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/001-skill-and-tag-move"
    last_updated_at: "2026-11-06T07:23:08Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-skill-and-tag-move"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: skill-and-tag-move

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the ten Skilled integration doctor commands one owner, `system-skilled-doctor`, without changing what any command does.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The skill is standalone, not a parent hub |
| D2 | No command file moves; only each command's `skill_agent` tag changes |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0` at the baseline count of 1005
- [x] All ten moved bridges name `system-skilled-doctor`
- [x] `validate_skill_package.py .skilled/skills/system-skilled-doctor --strict` prints `PASS`
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
| Skill, tags and bridges | Done | 1005 of 1005 doctor tests, drift guard 5 of 5 |

### Deviations and findings

| Item | Note |
|------|------|
| Graph edges | `siblings` failed the symmetry check, so the skill uses `enhances` edges (ADR-001) |
<!-- /ANCHOR:log -->
