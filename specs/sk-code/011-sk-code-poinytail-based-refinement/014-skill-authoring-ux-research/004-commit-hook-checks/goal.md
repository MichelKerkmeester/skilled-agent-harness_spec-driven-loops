---
title: "Goal: Phase 4: commit-hook-checks"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/004-commit-hook-checks"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-004-commit-hook-checks"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: commit-hook-checks

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the pre-commit hook block a commit that stages a skill whose leaf manifest, doctor checks or intent-signal carry are stale, naming the fix command, and print a hint when an untrusted clone skips every gate.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Block and name the command; do not auto-stage the leaf manifest. |
| D2 | Scope every check to the skill roots the commit stages, never the whole fleet. |
| D3 | Bypass with SPECKIT_SKIP_SKILL_AUTHORING=1, like the other gates. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh`, run from the repository root, ends with a summary line reporting 0 failed and at least 76 passed.
- [ ] `grep -c 'gate:skill-authoring' .skilled/scripts/git-hooks/pre-commit`, run from the repository root, prints 1 or more.
- [ ] `grep -c 'skilled.trustRepoHooks true' .skilled/scripts/git-hooks/pre-commit`, run from the repository root, prints 1 or more.
- [ ] `bash -n .skilled/scripts/git-hooks/pre-commit`, run from the repository root, exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/004-commit-hook-checks --strict`, run from the repository root, prints RESULT: PASSED.
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
