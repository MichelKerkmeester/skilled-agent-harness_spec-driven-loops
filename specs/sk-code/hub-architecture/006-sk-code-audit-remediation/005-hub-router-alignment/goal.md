---
title: "Goal: Phase 5: hub-router-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hub router alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment"
    last_updated_at: "2026-11-14T12:01:54Z"
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
# Goal: Phase 5: hub-router-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the hub router's prose match its map for all three surfaces and turn the setup battery green.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | Section 8 is the authority. Prose that disagrees with it changes. |
| D2 | The 23 outside files are touched only after the operator answers the first open question. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The path check in `plan.md` section 5 prints `missing 0` for every backtick path in `ROUTER.md` sections 1 to 7, brace forms expanded.
- [ ] `rg -c 'workflow-implement.md' .skilled/skills/sk-code/ROUTER.md` prints 2 or more, and `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0.
- [ ] `node .skilled/commands/doctor/scripts/sk-code-setup-check.cjs` ends with `STATUS=PASS failed=0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/005-hub-router-alignment --strict --quiet` prints `RESULT: PASSED`.
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
| Spec, plan, tasks and acceptance criteria authored | Done | Written on 2026-11-14 from the audit evidence in `../001-finding-verification/` |
| Implementation | Pending | Not started |

### Deviations and findings

| Item | Note |
|------|------|
| None so far | Nothing has diverged from the directive |
<!-- /ANCHOR:log -->
