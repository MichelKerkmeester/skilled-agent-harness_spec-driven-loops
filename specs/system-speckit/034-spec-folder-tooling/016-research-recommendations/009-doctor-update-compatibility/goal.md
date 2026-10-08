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
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
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

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] /doctor:update check shows layout (v3 vs v4) and era signal counts in compatibility section (exit 0 from check on fixture v3 repo)
- [ ] Compatibility action runs layout move and upgrade-legacy apply without modifying .skilled/ units (exit 0 from integration test on fixture)
- [ ] Path map collision detection lists every collision before move executes (preview output shows before/after paths)
- [ ] On dirty tree, action writes before-image manifest (Phase 10 design) or refuses before first write (test with dirty fixture)
- [ ] Action logs every move step for interrupted recovery (log file shows progress)
- [ ] Latest doctor and spec-kit test suites pass with no new failures (exit 0 from bash .skilled/commands/doctor/scripts/tests/run-all.sh and npm --prefix .skilled/skills/system-spec-kit test)
- [ ] Partial v3 move in progress is detected and handled correctly (action output names what is already moved)

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
| Validation status | Pending | repair-derived and validate.sh to run; some schema validation warnings expected (nested anchors from template) |
| Goal binding in parent | Pending | Parent goal.md to be updated with binding row |
| Dependency on Phase 8 | Pending | Phase 8 (era report) must complete first |
| Dependency on Phase 5 and 6 | Pending | Phase 5 (healer fixes) and Phase 6 (provenance fixes) must complete before Phase 9 ships |
| Dependency on Phase 10 | Pending | Phase 10 (before-image manifest) must complete before Phase 9 ships, per the parent D2 amended 2026-10-08 |

### Deviations and findings

| Item | Note |
|------|------|
| Dependency on 010 decided | 2026-10-08, the operator amended the parent D2 so 010 lands before 009, because this phase's action runs `upgrade-legacy --apply` and needs 010's undo record |
<!-- /ANCHOR:log -->
