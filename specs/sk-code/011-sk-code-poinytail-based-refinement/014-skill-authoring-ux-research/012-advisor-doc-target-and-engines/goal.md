---
title: "Goal: Phase 12: advisor-doc-target-and-engines"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/012-advisor-doc-target-and-engines"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-012-advisor-doc-target-and-engines"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 12: advisor-doc-target-and-engines

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the explicit lane count only file forms of changelog as a doc target, proven by a vitest case on the review prompt, and set engines.node to ^20.19.0 || >=22.12.0.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Match only the file forms changelog.md and changelog/, as the review proposed. |
| D2 | Copy the toolchain range exactly. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/name-mention-scoring.vitest.ts`, run from the repository root, reports 0 failed.
- [ ] `node -p "[require('./.skilled/skills/system-skill-advisor/runtime/package.json').engines.node, require('./.skilled/skills/system-skill-advisor/runtime/package-lock.json').packages[''].engines.node].join(' / ')"`, run from the repository root, prints ^20.19.0 || >=22.12.0 / ^20.19.0 || >=22.12.0.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run`, run from the repository root, reports 0 failed.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/012-advisor-doc-target-and-engines --strict`, run from the repository root, prints RESULT: PASSED.
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
| Regex and cases | Done | t3-p012a, bound fixed by the orchestrator |
| Engines | Done | orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| Engines criterion changed to read the root entries | Eighteen dependency entries in the lockfile already carry the same range, so a grep count was the wrong check |
<!-- /ANCHOR:log -->
