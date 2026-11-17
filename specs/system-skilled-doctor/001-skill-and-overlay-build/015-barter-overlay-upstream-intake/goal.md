---
title: "Goal: Phase 15: barter-overlay-upstream-intake"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "barter overlay upstream intake goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/001-skill-and-overlay-build/015-barter-overlay-upstream-intake"
    last_updated_at: "2026-11-17T09:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed the fixes that held and recorded five operator questions"
    next_safe_action: "Operator answers the open questions in spec.md section 7"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "barter-overlay-upstream-intake"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: barter-overlay-upstream-intake

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Check each claim in the vendoring project's overlay message, fix the ones that hold in Skilled, and hand the rest to the operator as decisions with evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No write lands in the vendoring project's tree |
| D2 | Items 1, 3 bullet 4, 4 and 6, and the plain-status note, are proposals only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `compiled-route-admission.cjs --hub mcp-tooling` prints 16 pass and 0 drift
- [x] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0`
- [x] `spec.md` section 7 holds one question per proposal-only item
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
| Item 3 bullets 1, 2, 3 and 5 | Done | `c01cd42523a` |
| Item 5 | Done | `4f52cd121fd`, admission 16 pass, 0 drift |
| Item 2 | Answered | Cause traced to the project's vendoring commit `37ad8100c` |

### Deviations and findings

| Item | Note |
|------|------|
| Item 5 kept the bare `aside` keyword | Its removal made three explicit Aside requests defer |
| Item 2 got no failing test in the suite | The suggested fixture passes when run in `scratch/repin-check.sh`. The real case reproduces there but matches documented behavior, so a test asserting otherwise waits on the operator's item 2 answer |
<!-- /ANCHOR:log -->
