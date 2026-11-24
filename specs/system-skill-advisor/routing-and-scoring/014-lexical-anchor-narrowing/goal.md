---
title: "Goal: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "lexical anchor narrowing goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/014-lexical-anchor-narrowing"
    last_updated_at: "2026-11-24T09:04:12Z"
    last_updated_by: "scaffold"
    recent_action: "Landed candidate E as advisor 2.0.4.0"
    next_safe_action: "Find a stricter rule for the three remaining lifts that moves no pin"
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
# Goal: Narrow the advisor's shared lexical anchor so two generic words no longer lift a skill to the task-intent floor

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A skill reaches the advisor's 0.82 floor only when the prompt names something that skill owns.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No rule lands while it moves a pinned slice row without operator approval |
| D2 | Ranking stays as it is; only when a skill counts as named changes |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] None of the five probe prompts lifts a skill it does not name to 0.8 or above
- [x] `npx vitest run` in the advisor runtime fails only the known `system-skilled-bots` test
- [x] The mcp-browser-use replay fails only MBU-PB-04
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG
<!-- FILL: Record each step with its command output. Keep this table current. GOOD: T001 Done. `ls logs/archive | wc -l` printed 3. WEAK: Progress is good. -->

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Attribution and three candidates | Done | `implementation-summary.md` |
| Candidates A to C | Dropped | Each moved pinned rows; Q012 record and stop |
| Candidate E | Landed, advisor 2.0.4.0 | 2 of 5 lifts gone; suite only the known failure; replay unchanged (Q013) |

### Deviations and findings

| Item | Note |
|------|------|
| The spec said every probe lift came from the lexical clause | The trace showed the direct-score lift and the id-noun clause too |
<!-- /ANCHOR:log -->
