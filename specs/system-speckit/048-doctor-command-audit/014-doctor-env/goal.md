---
title: "Goal: Phase 14: doctor-env"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/014-doctor-env"
    last_updated_at: "2026-10-02T16:10:29Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fd6197bf-4447-484a-82b8-d9015d93169d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 14: doctor-env

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give operators a `/doctor:env` command that guides them through setting the repository's environment switches to their own preference.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The command is built through sk-create-command, as a thin router plus workflow and presentation assets. |
| D2 | ENV-REFERENCE.md is the only source of the switch list. The command holds no copy of it. |
| D3 | Nothing is written without showing the exact lines first and getting a yes. |
| D4 | Secret values are never asked for or written. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/commands/doctor/env.md` and `.skilled/commands/doctor/assets/doctor-env.yaml` exist
- [ ] `.claude/commands/doctor/env.md` is a symlink to `../../../.skilled/commands/doctor/env.md`
- [ ] `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` exits 0
- [ ] `scratch/doctor-env-run.md` records one run that lists switches read from ENV-REFERENCE.md, asks before every write and writes no secret value
- [ ] `acceptance-criteria.md` shows every row as Met, Waived or Superseded
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
| Phase opened | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
