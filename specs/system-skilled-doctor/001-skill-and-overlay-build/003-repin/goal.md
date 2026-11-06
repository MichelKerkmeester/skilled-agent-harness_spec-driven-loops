---
title: "Goal: Phase 3: repin"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "repin goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/003-repin"
    last_updated_at: "2026-11-06T07:23:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 3: repin

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a project move its vendored Skilled copy to a newer upstream commit in one guarded `/doctor:overlay repin` run that it can roll back byte for byte.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The backup list and the copy list come from one computed set |
| D2 | A staged run on a copy is the plan the operator approves |
| D3 | Barter's tree is only read. The stage run uses a scratch copy |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs` prints `fail 0`
- [x] `node --test .skilled/commands/doctor/scripts/tests/*.test.cjs` prints `fail 0`
- [x] A stage run on a copy of Barter's tree leaves that copy's digest unchanged
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
| Repin tests | Done | 13 of 13 failed on phase 002's engine, then passed |
| Command route | Done | `route-validate.sh` 31 routes, phrase reach `STATUS=OK` |
| Barter stage | Done | Refused before any write, 19 unowned paths, copy unchanged |
| Phase 003 docs and save | Done | tasks, criteria and summary written; suite 1067 of 1067 |

### Deviations and findings

| Item | Note |
|------|------|
| Classifier | A destination holding its pinned bytes read `upstream-moved` after a moved pin, which blocked every re-pin (ADR-001) |
| Backup groups | The backup also holds the manifest and the state, or a rollback would keep the new pin (ADR-002) |
| Barter's manifest | It needs `repin.exclude` for `.opencode/scripts` and regenerate outputs for its Hermes copies and trigger index before a live re-pin passes |
<!-- /ANCHOR:log -->
