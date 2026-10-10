---
title: "Goal: Phase 8: advisor-surface-hint"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/008-advisor-surface-hint"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-008-advisor-surface-hint"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: advisor-surface-hint

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Add an optional surfaceHint to advisor_recommend that reaches the compiled-route front door as --surface-hint, proved by a test that failed before the change.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Accept any short string and let the front door validate it, as it already ignores unknown hints. |
| D2 | One advisor version bump here covers phases 007 and 008. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/advisor-surface-hint.vitest.ts`, run from the repository root, reports 0 failed.
- [ ] `grep -c 'surface-hint' .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts`, run from the repository root, prints 1 or more.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck`, run from the repository root, exits 0.
- [ ] `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Add a Lenis smooth-scroll initializer","options":{"surfaceHint":"WEBFLOW"}}' --format json`, run from the repository root, prints "status": "ok".
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/008-advisor-surface-hint --strict`, run from the repository root, prints RESULT: PASSED.
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
