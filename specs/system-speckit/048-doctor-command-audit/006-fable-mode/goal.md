---
title: "Goal: Phase 6: fable-mode"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/006-fable-mode"
    last_updated_at: "2026-10-02T16:10:18Z"
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
# Goal: Phase 6: fable-mode

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit fable-mode` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The verdict rests on what this checkout does, shown by command output or file:line, never on what a doc says. |
| D2 | A defect found in the subsystem the doctor inspects is recorded as a finding, not fixed in this phase. |
| D3 | Retiring a target removes its route and its workflow asset and changes nothing else. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-fable-mode.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit fable-mode` on this checkout
- [ ] `implementation-summary.md` states one verdict, keep, fix or retire, and the evidence behind it
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 after the verdict is applied
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
| Phase opened | Done | Scaffolded on 2026-10-02 |
| Audit inventory | Done | `scratch/reality-check.md` marks every path, script, command, flag and variable named by the route and workflow present, moved or missing |
| Read-only run | Done | `scratch/doctor-run.log`: exit 2, `target not found` for the script's missing default target |
| Verdict | Done | `scratch/proposal.md`: "Verdict: fix." |
| Fix applied | Done | Script, route entry, workflow asset and presentation updated in the worktree diff; the default target is gone, the baseline override is forwarded, and the directory prompt is added |
| Post-fix verification | Done | No-argument run exits 2 with `pass --dir <path>`; `node --check` NODE_CHECK_OK; YAML_OK; `route-validate.sh` exit 0, 9 routes validated, 2 warnings; catalog mirror STATUS=OK; mutation-class GUARD PASS |
| Docs closed | Done | `acceptance-criteria.md` 4 of 4 Met; `spec.md` status Complete |

### Deviations and findings

| Item | Note |
|------|------|
| No deviations | Every proposed edit was applied as written; the orchestrator reran the gates after the batch |
| Finding: the baseline snapshot's source corpus path is missing | `fable-baseline.json:2` records an absolute path that no longer exists; `ls -ld` exits 1 and a directory-name search finds no match. The aggregate metrics at `fable-baseline.json:90-98` remain readable, but the raw corpus cannot reproduce them here |
| Note: the fix shipped in a batch with the other `/doctor:speckit` targets | The batch shares `_routes.yaml`, `speckit.md` and the presentation file; its results are reported per target |
| Note: three parent-skill-check tests fail at baseline | Their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree; not a regression |
<!-- /ANCHOR:log -->
