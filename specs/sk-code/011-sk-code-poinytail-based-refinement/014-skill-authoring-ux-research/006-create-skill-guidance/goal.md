---
title: "Goal: Phase 6: create-skill-guidance"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/006-create-skill-guidance"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-006-create-skill-guidance"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 6: create-skill-guidance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sk-create-skill name the fields the advisor actually reads and every version carrier, and make its leaf generator name the changed leaves and the full write command.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Correct the instruction instead of changing the advisor. |
| D2 | One sk-create-skill version bump in this phase covers its edits. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'description.json. keywords' .skilled/skills/sk-doc/sk-create-skill/SKILL.md`, run from the repository root, prints 0.
- [ ] `node --test .skilled/skills/sk-doc/sk-create-skill/scripts/tests/generate-leaf-manifest-stale-message.test.cjs`, run from the repository root, reports fail 0.
- [ ] `grep -c 'skills-dir' .skilled/skills/sk-doc/sk-create-skill/scripts/regenerate-skill-derived.cjs`, run from the repository root, prints 0.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`, run from the repository root, exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/006-create-skill-guidance --strict`, run from the repository root, prints RESULT: PASSED.
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

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Recorded here as the phase runs |
<!-- /ANCHOR:log -->
