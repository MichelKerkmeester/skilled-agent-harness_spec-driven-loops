---
title: "Goal: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "hy4 flash free opencode roster goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/model-rosters/007-hy4-flash-free-opencode-roster"
    last_updated_at: "2026-11-17T07:59:52Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hy4-roster-2026-11-17"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Add Hy4 Flash Free to the cli-opencode roster through the opencode-go provider at both thinking levels

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** Let an operator dispatch `opencode-go/hy4-flash-free` through cli-opencode at either thinking level.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | cli-opencode only. The cli-pi roster is unchanged. |
| D2 | Only the `none` and `high` levels, the two the catalog offers. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [x] `rg -n 'hy4-flash-free'` on the cli-opencode roster prints the row naming `none` and `high`
- [x] A live one-turn dispatch at each level prints `OK` and exits 0
- [x] `validate.sh` on this packet with `--strict` prints `RESULT: PASSED`
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
| Roster row | Done | `providers-and-models.md` opencode-go table |
| Live dispatch | Done | `none` and `high` each printed `OK`, exit 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Asked for "Hy4 Flash" on cli-pi too | No plain Hy4 Flash id exists, and Pi lacks the flash-free id. The operator chose flash-free on cli-opencode only |
<!-- /ANCHOR:log -->
