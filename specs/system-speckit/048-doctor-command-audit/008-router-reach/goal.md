---
title: "Goal: Phase 8: router-reach"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/008-router-reach"
    last_updated_at: "2026-10-02T16:10:21Z"
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
# Goal: Phase 8: router-reach

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit router-reach` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-router-reach.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit router-reach` on this checkout
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
| Phase opened | Done | Route, workflow and script inventoried on this checkout; `scratch/reality-check.md` |
| Read-only run | Done | Full-fleet probe `RESULT: FAILED` from a degraded advisor response (14 wrong-hub, 18 outranked, 221 no-reach, 0 probe-error); `route-validate.sh` exit 0; `scratch/doctor-run.log` |
| Verdict | Done | `fix`, with the three gaps and their evidence; `scratch/proposal.md` |
| Fix applied | Done | Probe fails closed; `--concurrency` wired through the route and workflow; startup menu shows 12 and 13; validator reads the visible menu |
| Verified | Done | Live probe `--hub sk-doc --limit 5` → `RESULT: PASSED`, advisor generation 3; `route-validate.sh` exit 0 with 9 routes validated |
| Documentation closed | Done | `spec.md` Complete; every acceptance row Met; `validate.sh --strict` rerun |

### Deviations and findings

| Item | Note |
|------|------|
| Degraded fleet run | The audit's full-fleet run used a degraded local-scorer response inside a sandbox, so its 14 wrong-hub and 18 outranked counts are recorded as unverified against a live advisor |
| Finding: false no-reach | The pre-fix probe accepted a degraded envelope and reported 221 no-reach rows; fixed by failing closed on a degraded, not-live or generation-less response |
| Finding: invisible answer | The accepted-answer table assigned 13 to router-reach while the startup menu ended at 11; fixed by showing 12 and 13 in the menu and help block |
| Finding: validator blind spot | The route validator built its menu set from accepted-answer rows rather than the visible startup menu; fixed to read the displayed numbers |
| Finding: subsystem routing | Wrong-hub and outranked phrases (for example `jev mcp server` to `mcp-code-mode`, `notion mcp` above `mcp-tooling`) are recorded for the subsystem owner, not fixed here |
| Finding: test fixtures | Three `parent-skill-check-*.test.cjs` files fail in this worktree exactly as the pre-batch baseline; not a regression |
<!-- /ANCHOR:log -->
