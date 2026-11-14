---
title: "Goal: Phase 1: finding-verification"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "finding verification goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification"
    last_updated_at: "2026-11-14T12:01:49Z"
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
# Goal: Phase 1: finding-verification

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every audit finding a verdict backed by a command before any fix starts.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|---|---|
| D1 | The ledger is a closed list. A new observation goes in the log, never in a new row. |
| D2 | A claim no command can decide is marked `Judgment`, never `Confirmed`. |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `grep -c '| Unverified |' findings-ledger.md` prints 0.
- [ ] `grep -c '| TBD |' findings-ledger.md` prints 0, so every verdict names its command or its file and line.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/hub-architecture/006-sk-code-audit-remediation/001-finding-verification --strict --quiet` prints `RESULT: PASSED`.
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
