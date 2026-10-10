---
title: "Goal: Phase 7: advisor-name-mention-scoring"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-007-advisor-name-mention-scoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: advisor-name-mention-scoring

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the sk-code advisor battery pass its rule of at least 14 of 17 positives and 0 of 5 negatives by fixing three scoring mistakes in place, with no new failure in the advisor test suite.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Fix each mistake in place; no new lane or abstraction. |
| D2 | Rebuild dist and restart the daemon before the battery replay, because the CLI serves the built runtime. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `python3 specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring/scratch/advisor-battery.py | tail -1`, run from the repository root, prints positives of 14/17 or more and negatives-false-positive 0/5.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/name-mention-scoring.vitest.ts`, run from the repository root, reports 0 failed.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npm run typecheck`, run from the repository root, exits 0.
- [ ] `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run`, run from the repository root, reports no more failed tests than the baseline recorded in this goal log.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/007-advisor-name-mention-scoring --strict`, run from the repository root, prints RESULT: PASSED.
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
| Guard | Done | p007a |
| Explicit lane passes | Done | p007b, p007c, p007d |
| Test | Done | t3-p007e |
| Parity, metadata, ledger | Done | orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| Two scorer rules beyond the plan | The live evidence showed author phrases (spec-kit, two-axis) carried the same false lift after the name point was removed |
| Edited sk-code graph-metadata.json and the Python scorer | The findings intent signal and the Python boost kept the false lift and the parity ratchet out of step |
<!-- /ANCHOR:log -->
