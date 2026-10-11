---
title: "Goal: Phase 3: unread-version-fields"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/003-unread-version-fields"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-003-unread-version-fields"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: unread-version-fields

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Record the full reader search for the hub JSON version copies and the prevent-overengineering decision on removing them, with every hub still passing the doctor.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Drop the removal: phase 005 makes the changelog workflow write every copy and phase 004 blocks a partial bump at commit, so the copies can no longer drift, while removal would touch about thirty files across seven hubs, re-mint every compiled manifest and rewrite five release-authority paragraphs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'Dropped under prevent-overengineering' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/003-unread-version-fields/implementation-summary.md`, run from the repository root, prints 1 or more.
- [ ] `grep -c 'parent-skill-check.cjs:1450' specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/003-unread-version-fields/implementation-summary.md`, run from the repository root, prints 1 or more.
- [ ] `for r in .skilled/skills/*/mode-registry.json; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs "$(dirname "$r")" >/dev/null 2>&1 || echo FAIL "$r"; done`, run from the repository root, prints no FAIL line.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/003-unread-version-fields --strict`, run from the repository root, prints RESULT: PASSED.
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
| Reader search | Done | Only the doctor reads the copies |
| Drop decision recorded | Done | Dropped under prevent-overengineering |

### Deviations and findings

| Item | Note |
|------|------|
| Planned removal became a recorded drop | The full reader search showed phases 004 and 005 stop the drift at a fraction of the cost; no builder was dispatched because no product file changes |
<!-- /ANCHOR:log -->
