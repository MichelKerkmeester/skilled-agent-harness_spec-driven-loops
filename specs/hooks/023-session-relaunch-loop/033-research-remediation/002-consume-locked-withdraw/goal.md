---
title: "Goal: Consume under one lock with a withdrawn decline"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "consume locked withdraw goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw"
    last_updated_at: "2026-10-25T13:42:27Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-consume-locked-withdraw"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Consume under one lock with a withdrawn decline

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A hand-over withdrawn after the wrapper's approval can no longer relaunch, because consume reads, checks and removes the record in one locked step.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `withdrawn: true` appears in consume output only for a withdrawn record, so the exact-shape tests stay unchanged |
| D2 | The wrapper treats `withdrawn: true` as a decline: it prints the withdrawn warning and exits with the runtime's own code |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/002-consume-locked-withdraw --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A consume test with a record withdrawn before consume prints `withdrawn: true` and fails on the code before the change
- [ ] A wrapper test that withdraws between should-relaunch approval and consume prints the withdrawn warning, starts no second runtime and exits with the runtime's code
- [ ] The exact-shape consume tests in `session-relaunch-cli.test.cjs` pass with no edit to their expected objects
- [ ] A wrapper test with a withdrawn record on the Ctrl-C path prints no claim command
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/002-consume-locked-withdraw.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
