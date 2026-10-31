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
| Phase opened | Done | Packet scaffolded on 2026-10-02 with the goal, spec and criteria authored |
| Command assets built | Done | `.skilled/commands/doctor/env.md`, `assets/doctor-env.yaml` and `assets/doctor-env-presentation.txt` exist and document validation returned VALID with 0 issues |
| Family wiring done | Done | `.claude` symlink points at the router; README doctor count 3 to 4; family contract entry added; Codex, Pi, Hermes and Cursor mirrors in sync |
| Review fixes applied | Done | Source git-hook marker examples use `=1`; next-step text names concrete commands; token-count thresholds classify as preferences; skill_agent comment under the frontmatter; README pipes escaped |
| Verification run | Done | Catalog mirror check STATUS=OK with 35 of 35 commands, route validation exit 0, mirror checks in sync, and one run recorded in `scratch/doctor-env-run.md` |
| Acceptance criteria | Done | Every row Met with the observed evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation | Codex mirror generation hit EPERM in the builder's sandbox, so the orchestrator ran `node .skilled/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs`, which wrote 1 of 33 prompts and left `--check` reporting 33 in sync |
| Deviation | The recorded run used orchestrator Bash and Node probes rather than a live slash-command session, so the interactive menu was not exercised end to end |
| Deviation | The first secret-classification draft hid four token-count thresholds; the review refined the rule so `TOKEN` followed by a threshold, floor, budget, limit, count, chars or visible word is a count |
| Finding (recorded, not fixed) | ENV-REFERENCE.md states 144 unique variables while its tables hold 158, because the 14 git-hook marker rows added to section 5 did not update the stated count. Recorded in `scratch/doctor-env-run.md` and left unfixed as out of scope |
<!-- /ANCHOR:log -->
