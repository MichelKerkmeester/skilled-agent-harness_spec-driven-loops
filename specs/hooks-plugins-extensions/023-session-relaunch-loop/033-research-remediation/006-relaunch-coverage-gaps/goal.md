---
title: "Goal: Tests for four uncovered relaunch paths and the reused-note fix"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "relaunch coverage gaps goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps"
    last_updated_at: "2026-10-25T13:42:32Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-relaunch-coverage-gaps"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Tests for four uncovered relaunch paths and the reused-note fix

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Four relaunch paths that have no test get one, and a note prepared with the goal switch off no longer hands on its old goal packet at consume.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The phase adds tests, plus one fix for the reused-note defect, which is confirmed on current code |
| D2 | The fix is record-based: prepare records the goal-switch state on the relaunch record and consume hands on the packet only when that state was on; a manual `claim` has no record and keeps reading the switch at claim time |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/006-relaunch-coverage-gaps --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A wrapper test passes `--server=http://localhost:4096` to OpenCode 2 and asserts the shared-server warning and launch arguments equal to `['--server=http://localhost:4096']` with no `--standalone`
- [ ] A wrapper test with a PATH it builds, holding no runtime binary, asserts exit status 127
- [ ] A core test releases two child processes from one start barrier to claim one open note and gets exactly one winner, the other refused as claimed and `claimed_by` naming the winner
- [ ] A CLI test reuses a note holding a goal packet, runs prepare with SESSION_RELAUNCH_GOAL=0, then consume with the switch off and again with it on, and neither reports goal_packet; the existing consume test that reports a note's packet still passes.
- [ ] Prepare records the goal-switch state on the relaunch record, consume hands on `goal_packet` only when that recorded state was on, and the implementation summary records the reused-note test failing first
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/006-relaunch-coverage-gaps.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | Reconciled with spec.md and acceptance-criteria.md after review |
| Reused-note defect confirmed by review | With the switch off, prepare keeps the old `goal_packet` and consume rereads the switch, so the switch on at consume hands the packet on; a consume-only fix cannot work, so the fix is record-based |
<!-- /ANCHOR:log -->
