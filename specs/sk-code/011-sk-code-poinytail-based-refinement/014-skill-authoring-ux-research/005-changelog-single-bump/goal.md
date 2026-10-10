---
title: "Goal: Phase 5: changelog-single-bump"
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
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/005-changelog-single-bump"
    last_updated_at: "2026-10-10T20:10:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-014-005-changelog-single-bump"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: changelog-single-bump

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the changelog workflow and its skill choose a version above both the local and the upstream changelog entries and write that version into every carrier of the component it bumps.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Upstream is the branch upstream, falling back to origin/main; an unreachable ref keeps today's local-only behavior. |
| D2 | No new script: the workflow already resolves the component and writes the versioned file. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c 'git ls-tree' .skilled/commands/create/assets/create-changelog-auto.yaml .skilled/commands/create/assets/create-changelog-confirm.yaml`, run from the repository root, prints 1 or more for each file.
- [ ] `grep -c 'parent-skill-check' .skilled/commands/create/assets/create-changelog-auto.yaml .skilled/commands/create/assets/create-changelog-confirm.yaml`, run from the repository root, prints 1 or more for each file.
- [ ] `grep -c 'origin/main' .skilled/skills/sk-doc/sk-create-changelog/SKILL.md`, run from the repository root, prints 1 or more.
- [ ] `python3 -c "import yaml; [yaml.safe_load(open(f)) for f in ['.skilled/commands/create/assets/create-changelog-auto.yaml', '.skilled/commands/create/assets/create-changelog-confirm.yaml']]"`, run from the repository root, exits 0.
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc`, run from the repository root, exits 0.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/005-changelog-single-bump --strict`, run from the repository root, prints RESULT: PASSED.
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
| Auto workflow | Done | p005a |
| Confirm workflow | Done | p005b |
| SKILL.md steps | Done | p005c |
| Version bump, changelog, Hermes copy | Done | orchestrator |

### Deviations and findings

| Item | Note |
|------|------|
| README.md left out of the version copies | The plan listed it; a read of four skills showed its version is the document's own |
<!-- /ANCHOR:log -->
