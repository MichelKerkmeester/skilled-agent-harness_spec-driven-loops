---
title: "Goal: Phase 12: skill-graph-freshness"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/012-skill-graph-freshness"
    last_updated_at: "2026-10-02T16:10:27Z"
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
# Goal: Phase 12: skill-graph-freshness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit skill-graph-freshness` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-skill-graph-freshness.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit skill-graph-freshness` on this checkout
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
| Phase opened | Done | Route, workflow, router, presentation and script read line by line on this checkout; `scratch/reality-check.md` |
| Read-only run | Done | The exact route command twice, exit 0, all five sets `none`; foreign-database and absent-database probes; independent recomputation; `scratch/doctor-run.log` |
| Verdict | Done | `keep`, with the evidence table and the four findings; `scratch/proposal.md:9` |
| Verdict applied | Done | No production file changed — the route entry, the workflow asset, the script and the presentation row stay as they are |
| Batch gates | Done | `route-validate.sh` exit 0 with 9 routes and 2 warnings after the batch; YAML parse, catalog mirror check, MCP guard and doctor script tests at baseline |
| Documentation closed | Done | `spec.md` Complete; every acceptance row Met; packet validated with `validate.sh --strict` |
### Deviations and findings

| Item | Note |
|------|------|
| Shared batch | The verdict was applied with the other `/doctor:speckit` targets by GPT-6 Luna (cli-codex, max, fast); this target needed no edit, and the batch's startup menu rows 12 and 13 and route count do not touch its row |
| Finding: stale compiled JSON | The compiled `skill-graph.json` predates one of its sources and neither the panel nor the subsystem's freshness model reports it; recorded, not fixed |
| Finding: untracked SQLite artifact | A fresh checkout silently degrades the three-way diff to a two-way diff with no degraded marker; recorded, not fixed |
| Finding: inert exclusion | No `z_archive` tier exists under the skills tree, so the disk scan's exclusion does nothing; recorded, not fixed |
| Finding: namespace collision | `sk-code` is both a family name and its sole skill id; recorded, not fixed |
| Finding: baseline tests | Three `parent-skill-check-*.test.cjs` files fail in this worktree exactly as the pre-batch baseline; not a regression |
| Not exercised | The family-mismatch and null-stamp sets and the corrupt-database catch were read, not run |
| Derived metadata refresh | Closing the documents staled the generated `source_fingerprint`; the validator's own remediation, `repair-derived.cjs --apply`, re-derived it in this folder |
<!-- /ANCHOR:log -->
