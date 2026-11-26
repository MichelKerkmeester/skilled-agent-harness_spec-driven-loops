---
title: "Goal: Phase 16: fix-second-follow-up-findings"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "fix second follow up findings goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/016-fix-second-follow-up-findings"
    last_updated_at: "2026-11-24T09:36:46Z"
    last_updated_by: "scaffold"
    recent_action: "Built and verified every phase 016 fix"
    next_safe_action: "Decide the fleet-wide front-door callout change"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "f7099de4-e8ec-43e6-a849-849dabb1c94c"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 16: fix-second-follow-up-findings

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix every generation-4 review finding that held against source, at its source, in the browser hub.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | All five confirmed P1 findings are fixed in this phase (operator answer "Phase 016: fix all 5") |
| D2 | The fleet-wide front-door callout stays out of scope |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Mixed id-and-alias prompts route `orderedBundle` with both modes, and the canary harness exits 0
- [x] No Aside surface pipes the installer into a shell, and "open it in aside" routes to Aside
- [x] The replay fails only MBU-PB-04, and `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED
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
| Router contained-match rule | Done | Both mixed prompts route bundles; harness fails with the HEAD router |
| Aside vocabulary and install docs | Done | `in aside` routes; pipe grep clean |
| Stdin, Node, release and replay | Done | Injection check clean; Node 20; replay 55 of 56 |

### Deviations and findings

| Item | Note |
|------|------|
| First sync run overwrote the edits | Reverted with `--revert`; edits copied to the authored paths |
| README release finding refuted | 1.1.4.0 was the README's own doc version |
<!-- /ANCHOR:log -->
