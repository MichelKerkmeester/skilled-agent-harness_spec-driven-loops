---
title: "Goal: Claim errors per note state"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "claim error per state goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state"
    last_updated_at: "2026-10-25T13:42:35Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-claim-error-per-state"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Claim errors per note state

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A refused claim says what the note's state means, so a session never continues finished work or another session's claim.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every message keeps the prefix `cannot claim handoff with status X` |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/008-claim-error-per-state --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A core test claiming a done note gets an error that says the work is finished and must not be continued, and fails on the code before the change
- [ ] A core test claiming a claimed note gets an error naming its `claimed_by` and `claimed_at`
- [ ] A core test claiming a note with no status gets an error saying it is not a handoff note
- [ ] The existing claim tests in `relaunch-core.test.cjs` pass unchanged
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/008-claim-error-per-state.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
