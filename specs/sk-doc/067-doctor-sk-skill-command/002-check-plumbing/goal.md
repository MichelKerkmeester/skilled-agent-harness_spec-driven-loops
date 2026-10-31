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

- [x] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the `/doctor:sk-skill` `check` route
- [x] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` reports all PASS, including `doctor-sk-skill-contract.test.cjs`
- [x] `validate-command-tree-parity.sh`, `codex/sync-prompts.cjs --check`, `pi/sync-prompts-pi.cjs --check` and `command-catalog-mirror-check.cjs` all exit 0
- [x] `command-contract.json` validates against `command-contract.schema.json` with the `/doctor:sk-skill` entry in `families.doctor`
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
| Phase planned | Complete | spec.md, plan.md, tasks.md authored |
| Owning workflow read | Complete | sk-create-command `SKILL.md`, `ROUTER.md`, `references/router-presentation-split.md`, then the three templates |
| Surfaces authored | Complete | `DOC/sk-skill.md`, `DOC/assets/doctor-sk-skill-presentation.txt`, `DOC/assets/doctor-sk-skill-check.yaml` |
| Route, contract, setup row | Complete | `_routes.yaml` 19 routes, `families.doctor` validates with 0 errors, one setup row |
| Mirrors generated | Complete | Four sync scripts, five mirror files, four checks exit 0 |
| Gates green | Complete | `route-validate.sh` 0, `run-all.sh` 0 with 600 tests, contract test 14 of 14, `validate_document.py` 0 issues |

### Deviations and findings

| Item | Note |
|------|------|
| Owning workflow | The operator required sk-create-command authoring; the design named the surfaces but not the mode |
| Command index row added | `.skilled/commands/README.txt` gained the doctor row and the group count, because the required catalog gate reads that index. The rest of the docs stay with phase 007 |
| Bridge deriver vs. `default_target` | `derive-command-bridges.cjs` refuses `default_target` on a single-target command, and `/doctor:setup` shows the precedent: one target, no flag, and the bare command reaches it. Amended 2026-10-30: the `check` route ships without the flag, and phase 006 adds `default_target: true` to `check` when `convert` makes the command multi-target |
| One unreproduced suite failure | A single `run-all.sh` run counted 599 node tests and failed; six later runs counted 600 and passed. The failing log was not kept, so the cause is unknown and recorded, not dismissed |
<!-- /ANCHOR:log -->
