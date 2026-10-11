---
title: "Goal: Phase 8: advisor-residuals-and-surface-hint"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/015-closeout/008-advisor-residuals-and-surface-hint"
    last_updated_at: "2026-10-11T12:00:00Z"
    last_updated_by: "closeout-orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-015-008-advisor-residuals-and-surface-hint"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: advisor-residuals-and-surface-hint

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The three residual battery misses are closed with the rule that owns each, and the OpenCode advisor plugin sends the workspace's sk-code surface as the surface hint.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Close the misses rather than overfit: each loses to a rule that other probe sets depend on |
| D2 | Wire the hint only where a caller both knows the workspace and renders compiled targets |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `npx --prefix .skilled/skills/system-skill-advisor/runtime vitest run --root .skilled/skills/system-skill-advisor/runtime tests/system-skill-advisor-plugin.vitest.ts`, run from the repository root, exits 0 with every test passed.
- [ ] `node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/advisor-battery.cjs`, run from the repository root, prints `positives 15/17 negatives-false-positive 0/5` or better.
- [ ] `grep -c 'detectWorkspaceSurface' .opencode/plugins/system-skill-advisor.js`, run from the repository root, prints 2 or more.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/015-closeout/008-advisor-residuals-and-surface-hint --strict`, run from the repository root, prints RESULT: PASSED.
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
| Misses closed, hint wired | Done | surface tests failed 3 of 4 before the change; advisor suite 1035 passed |

### Deviations and findings

| Item | Note |
|------|------|
| None | The build matched the plan |
<!-- /ANCHOR:log -->
