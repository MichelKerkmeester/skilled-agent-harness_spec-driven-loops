---
title: "Goal: Phase 4: hub-router-merge"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/004-hub-router-merge"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 4: hub-router-merge

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fold the routing prose of each of the seven parent hubs into its existing root `ROUTER.md`, leaving one pointer line in SKILL.md and every hub route unchanged.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only prose moves. Every `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` declaration stays as it is, so the machine section stays the only replay source. |
| D2 | No route changes. A shifted replay line or route fails the phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each hub `SKILL.md` has no `MACHINE ROUTER` text, and SMART ROUTING ends with one pointer line.
- [ ] Replay output from `leaf-route-replay.cjs` matches `scratch/replay-before.txt`, line for line.
- [ ] Each hub `ROUTER.md` keeps a machine-section hash that matches `scratch/machine-sections-before.txt`.
- [ ] `compiled-route-guard.cjs` prints seven `fresh` lines and exits 0.
- [ ] `parent-skill-check.cjs` prints `OK` for seven hubs, with checks 13a and 13b passing.
- [ ] Test suites for routing-shape, root-router and replay report no failing test.
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
| Hub router merge across seven hubs | Committed, landing | Operator status: committed and landing now. Child acceptance criteria AC-001 to AC-008 still read Unmet. |

### Deviations and findings

| Item | Note |
|------|------|
| Child status | The child spec reads Draft and its criteria read Unmet. The operator reports the phase committed, so the spec and criteria need closing. This goal does not mark them Met. |
<!-- /ANCHOR:log -->
