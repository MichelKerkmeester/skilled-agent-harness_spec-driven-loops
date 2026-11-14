---
title: "Goal: Phase 1: parent-purpose-scaffold"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/001-parent-purpose-scaffold"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: parent-purpose-scaffold

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every new phase parent reach its author with Problem Statement and Purpose as value tokens, so `validate.sh --strict` warns while the parent is a Draft and fails it at any other status.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: A new phase parent carries value tokens under Problem Statement and Purpose. In a sandbox, after `create.sh --phase --phases 2 --phase-names first,second "purpose probe"`, a count of the lines in `specs/001-purpose-probe/spec.md` that open with the value-token prefix prints 2
- [x] REQ-002: An untouched new parent still passes its own gate, with the purpose flagged. `validate.sh specs/001-purpose-probe --strict --no-recursive` prints `! PLACEHOLDER_FILLED: 2 unfilled value token(s) in a Draft packet` and `Errors: 0`
- [x] REQ-003: A new parent with an unfilled purpose fails once its status leaves Draft. With Status set to `In Progress`, the same command prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2
- [x] REQ-006: A new parent with a real purpose passes strict validation at `In Progress` and at `Complete`. After the purpose is filled, Status is set and `repair-derived.cjs --folder specs/001-purpose-probe --apply` runs, the REQ-002 command prints `Summary: Errors: 0` and `RESULT: PASSED` and exits 0 for both statuses
- [x] REQ-007: An untouched new parent marked Complete still fails. With only Status set to `Complete`, the REQ-002 command prints `x SCAFFOLD_NEVER_TOUCHED` naming `packet_pointer starts with "scaffold/"`, prints `x PLACEHOLDER_FILLED: 2 placeholder(s) found` and exits 2
- [x] REQ-004: `create.sh` holds no generic parent purpose text. `rg -c 'Keep parent documentation lean|_phase_parent_purpose|_phase_parent_problem' create.sh` prints nothing and exits 1, and `bash -n create.sh` exits 0
- [x] REQ-005: The four affected test files pass. The vitest command in `plan.md` section 5 prints `Test Files  4 passed (4)` and `Tests  99 passed (99)`
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
| Phase built | Done | Status Complete in `spec.md`. Criteria marked from that status and `implementation-summary.md`, not rerun on 2026-11-14 |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
