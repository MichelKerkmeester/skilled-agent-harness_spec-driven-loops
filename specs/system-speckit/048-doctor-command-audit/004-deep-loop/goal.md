---
title: "Goal: Phase 4: deep-loop"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/004-deep-loop"
    last_updated_at: "2026-10-02T16:10:16Z"
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
# Goal: Phase 4: deep-loop

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit deep-loop` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-deep-loop.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit deep-loop` on this checkout
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
| Audit inventory | Done | `scratch/reality-check.md` marks every named path, script, command, flag, database and variable present, moved or missing |
| Safe run receipts | Done | `scratch/doctor-run.log`: invalid-loop-type probes exit 3, council replay `--dry-run` exits 1, three `NOT RUN` entries |
| Verdict | Done | `scratch/proposal.md`: `Verdict: fix` |
| Fix applied | Done | Workflow, route entry and presentation corrected in the worktree diff |
| Post-change gates | Done | `route-validate.sh` exit 0 (9 routes, 2 warnings); `YAML_OK`; catalog mirror `STATUS=OK`; guard `GUARD PASS`; route contract test passes |
| Docs closed | Done | `acceptance-criteria.md` 4 of 4 Met; `spec.md` status Complete |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation: proposal edit 1, a `--read-only` flag on `status.cjs`, `query.cjs`, `convergence.cjs` and the database adapters, was not applied | The orchestrator overrode it because it changes the inspected subsystem; it is a recorded finding |
| Deviation: proposal edit 3 was reworded during application | The workflow now states it writes only its packet-local state log and that the called status and convergence scripts may create a missing coverage database and append observability events |
| Finding: the runtime's database access is not read-only | Coverage `getDb()` can create storage, apply schema and migrate the schema version; the council getter initializes its database and schema; status and convergence append observability events |
| Finding: no read-only or dry-run flag on the three graph scripts | The `rg` search returned no matches, so a doctor run cannot promise it leaves no runtime state behind |
| Finding: the coverage database is absent and the council database contents are unknown | `deep-loop-graph.sqlite` is not in this checkout; `sqlite3 -readonly` failed to open `council-graph.sqlite` with `unable to open database file (14)` |
| Finding: the valid read-only runtime path is unverified | The CLI probes stopped at `INPUT_VALIDATION` before opening a database; the normal status/query/convergence calls were not run |
| Note: the route validator warnings are informational | `--scope` collides with skill-advisor and `--dir` with fable-mode; both are allowed |
| Note: three `parent-skill-check-*.test.cjs` files fail as the pre-batch baseline | Their fixtures cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js` in this worktree; not a regression |
<!-- /ANCHOR:log -->
