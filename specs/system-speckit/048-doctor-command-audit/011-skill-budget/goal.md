---
title: "Goal: Phase 11: skill-budget"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/011-skill-budget"
    last_updated_at: "2026-10-02T16:10:25Z"
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
# Goal: Phase 11: skill-budget

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit skill-budget` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-skill-budget.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit skill-budget` on this checkout
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
| Phase opened | Done | Packet scaffolded on 2026-10-02 with the goal, spec and criteria authored |
| Surface inventory | Done | `scratch/reality-check.md` covers the route entry, workflow, router, presentation and environment variables, checked at HEAD `83616db9ba` |
| Doctor run | Done | `scratch/doctor-run.log` records the read-only run: CLI health exit 0; the audit exits 0 for the default, `--json`, `--top-n=5` and `--project-ceiling` forms; `--fail-over=5600` exits 1 with the documented FAIL; direct execution exits 126 |
| Verdict recorded | Done | `scratch/proposal.md` records `fix` with two mismatches and the evidence behind them |
| Fixes applied | Done | The route entry records `python3 .skilled/commands/doctor/scripts/audit_descriptions.py --repo-root "$PWD"`; the workflow names `python3` in its audit activity (`.skilled/commands/doctor/_routes.yaml`, `.skilled/commands/doctor/assets/doctor-skill-budget.yaml`) |
| Verification re-run | Done | `route-validate.sh` exit 0 with `OK: route-validate — 9 routes validated, 2 warnings`; YAML parse `YAML_OK`; catalog mirror `STATUS=OK`; MCP mutation guard `GUARD PASS` |
| Acceptance criteria | Done | Every row Met with the observed evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation | The two fixes were applied in the shared `/doctor:speckit` batch with the other targets by GPT-6 Luna (cli-codex), because they share `_routes.yaml`, `speckit.md` and the presentation asset; the orchestrator reviewed the diff and reran the gates |
| Deviation | The recorded run used orchestrator Bash and Python probes rather than a live interactive slash-command session, so the menu rendering was not exercised end to end |
| Finding (recorded, not fixed) | The project description budget is over its soft ceiling: 6,774 chars against 5,600, headroom −1,174, seven items OVER-SOFT, none over the 1,536 hard cap |
| Finding (recorded, not fixed) | `.skilled/commands/goal-opencode.md` and `.skilled/commands/vision.md` have no `.claude/commands` counterpart, so 135 of the 6,774 chars are authored-surface, not Claude-visible |
| Finding (recorded, not fixed) | `frontmatter-templates.md` and `common-pitfalls.md` recommend `/doctor skill-budget :auto`, which the doctor rejects |
| Note | The three `parent-skill-check-*.test.cjs` fixtures fail in this worktree exactly as at baseline because they cannot load `@spec-kit/shared/frontmatter/parse-frontmatter.js`; not a regression |
<!-- /ANCHOR:log -->
