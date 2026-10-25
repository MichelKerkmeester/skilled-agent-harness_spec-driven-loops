---
title: "Goal: Pi arms on agent_settled"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pi arm on agent settled goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled"
    last_updated_at: "2026-10-25T13:42:37Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-pi-arm-on-agent-settled"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Pi arms on agent_settled

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The Pi extension arms a prepared hand-over only once Pi has settled, so a continuation's fresh `agent_start` cannot withdraw a record armed a moment before.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The arm moves from `agent_end` to `agent_settled`, the event Pi 1.4.0 emits once no retry, compaction or queued continuation will run |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/009-pi-arm-on-agent-settled --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A Pi test arms the record on `agent_settled` and not on `agent_end` alone, and fails on the code before the change
- [ ] A Pi test of `agent_end`, a continuation `agent_start`, `agent_end` and `agent_settled` ends with the record armed, not disarmed
- [ ] `npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/session-relaunch/pi/session-relaunch.test.ts` exits 0
- [ ] The session-relaunch README names `agent_settled` as Pi's arm event and no line still names `agent_end` for it
- [ ] A Pi test of `agent_settled` with `aborted: true` leaves the record pending
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/009-pi-arm-on-agent-settled.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
