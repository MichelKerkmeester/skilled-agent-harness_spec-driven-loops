---
title: "Goal: External-user compatibility path for /doctor:update"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/009-doctor-update-compatibility"
    last_updated_at: "2026-10-09T09:17:51Z"
    last_updated_by: "orchestrator"
    recent_action: "Closeout 3: rows and criteria reconciled; AC-007 re-cited to tree5"
    next_safe_action: "Ship in the combined upgrade-legacy commit, then the operator manual run for CHK-021"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Goal: External-user compatibility path for /doctor:update

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Wire a read-only compatibility check in /doctor:update and a separate gated action for layout move and upgrade-legacy apply, with mandatory preview and collision detection, enabling external users to detect pre-v4 state and run upgrade safely outside the release transaction.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Compatibility check is read-only and calls Phase 8 era report to show layout and signal counts as part of /doctor:update check, not as part of release apply |
| D2 | Separate action outside release transaction so layout move and upgrade-legacy apply can have independent approval, logging, baseline, and rollback separate from .skilled/ unit reversals |
| D3 | Mandatory preview step showing path map with collision detection before any move happens; no writes until explicit user approval |
| D4 | Path map and move steps are logged for recovery; if move is interrupted, the action can resume or be re-run from where it stopped |
| D5 | Upgrade-legacy applies with baseline recording scoped to upgrade units only; release apply's own rollback covers only .skilled/ units |
| D6 | Built in wave 6 by GPT-6 Luna max on the fast tier through cli-codex: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 codex -a never exec --model gpt-6-luna -c model_reasoning_effort="max" -c service_tier="fast" --sandbox workspace-write "<brief>" </dev/null`. One brief per task group in tasks.md, each naming its files and the check that proves it. Closeout 3 (2026-10-09) note: the wave 6 label predates the lane plan in parent D2. The build ran in lanes instead, with 009's `planLayoutMove` in lane A alongside upgrade-legacy and its doctor files in lanes C to E. Builders and reviewers ran on the routes that parent D1 names, which changed during the build |
| D7 | Reviewed read-only by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route with `--tools read,grep,find,ls`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D8 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] /doctor:update check shows layout (v3 vs v4) and era signal counts in compatibility section (exit 0 from check on fixture v3 repo). AC-001: both check commands exit 0 on a v3 fixture, and the unit suite passes 21 of 21. The rendered Layout line is a presentation template and was not run live
- [x] Compatibility action runs layout move and upgrade-legacy apply without modifying .skilled/ units (exit 0 from integration test on fixture). AC-002: the integration case passes with rc 0. The approval prompts are not exercised by any test
- [x] Path map collision detection lists every collision before move executes (preview output shows before/after paths). AC-003: the collision case lists both paths and the reason for each
- [x] On dirty tree, action writes before-image manifest (Phase 10 design) or refuses before first write (test with dirty fixture). The action refuses: the cases 'a dirty spec root blocks the move before any step runs' and 'a tree dirtied after the move approval is refused before the move runs' pass in the closeout 2 unit run. This action writes no before-image manifest itself
- [x] Action logs every move step for interrupted recovery (log file shows progress). AC-005: the log fields and events are pinned by test. No live log file was read, so the parenthetical is not observed on a live run
- [x] Latest doctor and spec-kit test suites pass with no new failures (exit 0 from bash .skilled/commands/doctor/scripts/tests/run-all.sh and npm --prefix .skilled/skills/system-spec-kit test). AC-007: run-all.sh exits 0 with 7 suites passed (tree5 doctor.log). The root command exits 0 on the clean closeout 2 run with the raised runner bound, and on tree5, which straddles commit c2a0a667e9
- [x] Partial v3 move in progress is detected and handled correctly (action output names what is already moved). AC-006: a partial fixture returns state partial with the moved track named, and the steps finish the move. No live interrupted run was observed

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
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md |
| Validation status | Done | `validate.sh --strict` prints `RESULT: PASSED` with 0 errors and `check-goal.cjs` exits 0 at closeout 3 (2026-10-09). Logs in `gates/closeout3-009/` |
| Goal binding in parent | Done | Parent goal.md section 2 binds SH-08 to this goal (`009-doctor-update-compatibility/goal.md`) |
| Dependency on Phase 8 | Done | 008 shipped to main in wave 1 (parent goal.md log) |
| Dependency on Phase 5 and 6 | Done | 005 shipped to main in wave 1 and 006 in wave 2 (parent goal.md log) |
| Dependency on Phase 10 | Done | 010 shipped to main in wave 2 (parent goal.md log), so the before-image manifest that the parent D2 amendment of 2026-10-08 required is in place |
| Closeout 3 (2026-10-09) | Done | Citations re-checked after the Opus alignment fixes. AC-007 re-cited to `gates/tree5/root-test.log` with the commit caveat. Validation and check-goal results are in the Validation status row |

### Deviations and findings

| Item | Note |
|------|------|
| Dependency on 010 decided | 2026-10-08, the operator amended the parent D2 so 010 lands before 009, because this phase's action runs `upgrade-legacy --apply` and needs 010's undo record |
<!-- /ANCHOR:log -->
