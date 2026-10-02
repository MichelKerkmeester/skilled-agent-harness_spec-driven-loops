---
title: "Goal: Phase 9: runtime-mirrors"
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
    packet_pointer: "system-speckit/048-doctor-command-audit/009-runtime-mirrors"
    last_updated_at: "2026-10-02T16:10:22Z"
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
# Goal: Phase 9: runtime-mirrors

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Leave `/doctor:speckit runtime-mirrors` in a state that matches the current system: kept, fixed or retired on evidence from this checkout.

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

- [ ] `scratch/reality-check.md` marks every path, script, command, flag and environment variable named by `doctor-runtime-mirrors.yaml` as present, moved or missing
- [ ] `scratch/doctor-run.log` holds the output of one read-only or dry-run run of `/doctor:speckit runtime-mirrors` on this checkout
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
| Phase opened | Done | Route, workflow, presentation contract and checker inventory read on this checkout; `scratch/reality-check.md` |
| Read-only run | Done | The full checker set and all 64 adapter path tests ran read-only; results in `scratch/doctor-run.log` |
| Verdict | Done | `fix` — route and workflow disagreed on the checker set, and the result contract had no error state; `scratch/proposal.md:3-7` |
| Fix applied | Done | Route lists both Pi checks and `--allow-worktree`; workflow runs the command-catalog checker and defines `STATUS=ERROR`; startup menu shows 12 |
| Verified | Done | `route-validate.sh` exit 0 — 9 routes validated, 2 warnings; `command-catalog-mirror-check.cjs` `STATUS=OK`; `check-mcp-mutation-class.sh` `GUARD PASS` |
| Documentation closed | Done | `spec.md` Complete; every acceptance row Met; `validate.sh --strict` rerun |

### Deviations and findings

| Item | Note |
|------|------|
| Deviation: shared batch | The verdict was applied in one batch with the other `/doctor:speckit` targets because they share the route manifest, the router text and the presentation contract; the orchestrator reviewed the diff and reran the gates. Delivery is a working-tree change, not a commit |
| Deviation: repairs skipped | The audit is read-only, so the write-producing repair commands and the package build were listed and skipped (`scratch/doctor-run.log:457-487`) |
| Finding: user-global Codex hook parity unverified | The check refused at the linked-worktree guard before comparing `~/.codex/hooks.json`, which exists; the route now passes `--allow-worktree` so a rooted run can compare it |
| Finding: no mirror or catalog defect confirmed | Every completed check reported in sync: 172 mirrors across 8 trees, roster 12/12 on five surfaces, all 64 adapter paths present (`scratch/doctor-run.log`) |
| Finding: route and workflow divergence | The route omitted both Pi checks and the workflow omitted the command-catalog checker; fixed by aligning both sides to the declared inventory |
| Finding: presentation menu gap | The accepted-answer table mapped 12 and 13 while the visible menu ended at 11. The batch fixed it by showing both in the menu and updating the help prompt |
| Finding: test fixtures | Three `parent-skill-check-*.test.cjs` files fail in this worktree exactly as the pre-batch baseline; not a regression |
<!-- /ANCHOR:log -->
