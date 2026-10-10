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
    completion_pct: 0
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

**Objective:** Remove the version field from every hub-router.json and mode-registry.json and from the scaffolds that create them, with every hub still passing the doctor and every compiled route still fresh.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Keep the version in description.json, because parent-skill-check rule 8 requires the key there. |
| D2 | Let the commit hook re-mint each compiled manifest whose routing input changed, rather than minting by hand. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -l '"version"' .skilled/skills/*/hub-router.json .skilled/skills/*/mode-registry.json`, run from the repository root, prints nothing.
- [ ] `for r in .skilled/skills/*/mode-registry.json; do node .skilled/commands/doctor/scripts/parent-skill-check.cjs "$(dirname "$r")" >/dev/null 2>&1 || echo FAIL "$r"; done`, run from the repository root, prints no FAIL line.
- [ ] `node .skilled/bin/compiled-route-guard.cjs`, run from the repository root, exits 0.
- [ ] `grep -c '"version"' .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-router-template.json .skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-registry-template.json`, run from the repository root, prints 0 for both files.
- [ ] `python3 -m pytest -q .skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py`, run from the repository root, reports 0 failed.
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

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Recorded here as the phase runs |
<!-- /ANCHOR:log -->
