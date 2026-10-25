---
title: "Goal: Manual first launch binds the note's goal"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "manual claim goal binding goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding"
    last_updated_at: "2026-10-25T13:42:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-manual-claim-goal-binding"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Manual first launch binds the note's goal

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A manual first launch that carries a claim seed binds the goal packet of the note it names on every runtime that takes one.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only an open note inside the repository, named by the seed, supplies a packet; any other seed exports nothing |
| D2 | The seed is parsed by a core inverse of the seed suffix, and `usableGoalPacket` lives in the core |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `validate.sh specs/hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding --strict` prints `RESULT: PASSED`, with every row in its `acceptance-criteria.md` Met
- [ ] A wrapper test of a manual first launch with a seed for an open in-repo note holding a goal packet exports `SESSION_RELAUNCH_GOAL_PACKET`, sets `HERMES_SPEC_FOLDER` for Hermes and replaces Claude's seed argument with the `/goal` slice while keeping the operator's other arguments, and fails on the code before the change
- [ ] A seed naming a claimed note or a note outside the repository exports no packet
- [ ] The test "wrapper drops a goal packet inherited from an outer session on every launch" passes unchanged
- [ ] `usableGoalPacket` is exported from `relaunch-core.cjs` and `session-relaunch.cjs` defines no copy of it
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
| Phase scaffolded with its brief | Done | `../scratch/briefs/004-manual-claim-goal-binding.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written before the spec docs | The writer fills spec.md and acceptance-criteria.md from the same brief; reconcile this goal with them once filled |
<!-- /ANCHOR:log -->
