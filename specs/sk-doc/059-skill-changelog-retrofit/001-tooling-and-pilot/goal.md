---
title: "Goal: Phase 1: build the rewrite tooling and settle the style"
description: "The durable directive this phase executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/059-skill-changelog-retrofit/001-tooling-and-pilot"
    last_updated_at: "2026-09-24T18:20:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fb879d4c-5543-4760-8339-b0f3499f278d"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: build the rewrite tooling and settle the style

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The checker, the briefs and the driver keep a rewrite only when its facts and format both hold, and the operator has approved the style on ten pilot files.

### Decisions

Frozen. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The parent's decisions D1 to D7 bind this phase unchanged. |
| D2 | The pilot covers every legacy style and runs through the same gates as the waves. |
| D3 | The tooling is frozen once the operator approves the style. A later change to it is an amendment. |

### Operator copy

A change here that alters a parent decision or criterion is applied to the parent first, and the parent's chat slice is resent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] The checker passes the exemplar and all 25 compliant changelogs
- [ ] Every pilot file either passes all three gates or equals its original with its draft kept
- [ ] Pilot dispatches used the GPT plan, with the gateway only after a usage-limit reply
- [ ] The operator approves the pilot style
- [ ] `validate.sh --strict` on this phase reports `RESULT: PASSED`
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
| Tooling | Done | `../scratch/` holds the checker, both briefs and the driver |
| Pilot run 2 | Done | 6 kept, 4 restored, per `../scratch/pilot-state.jsonl` |
| Style approval | Pending | Operator review |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | None |
<!-- /ANCHOR:log -->
