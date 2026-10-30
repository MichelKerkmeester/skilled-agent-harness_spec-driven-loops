---
title: "Goal: Phase 2: check-plumbing"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "check plumbing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/075-doctor-sk-skill-command/002-check-plumbing"
    last_updated_at: "2026-10-30T07:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-281-doctor-skill-command"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 2: check-plumbing

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the read-only `/doctor:sk-skill check` reachable on every runtime, with a command surface the doctor validators prove complete.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | sk-doc's sk-create-command mode, entered through `/create:command`, owns the authoring; router, presentation and YAML come from its templates, never hand-rolled. |
| D2 | `check` is the default target and `mutating: read-only`. |
| D3 | Mirrors come from the sync scripts only. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the `/doctor:sk-skill` `check` route
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` reports all PASS, including `doctor-sk-skill-contract.test.cjs`
- [ ] `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` and `command-catalog-mirror-check.cjs` all exit 0
- [ ] `command-contract.json` validates against `command-contract.schema.json` with the `/doctor:sk-skill` entry in `families.doctor`
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
| Phase planned | Pending | spec.md, plan.md, tasks.md authored |

### Deviations and findings

| Item | Note |
|------|------|
| Owning workflow | The operator required sk-create-command authoring; the design named the surfaces but not the mode |
<!-- /ANCHOR:log -->
