---
title: "Goal: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "parent skill check target root goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-doctor/006-parent-skill-check-target-root"
    last_updated_at: "2026-11-19T10:30:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Met every completion criterion"
    next_safe_action: "Commit the worktree branch and merge it to main"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "c8b0f066-689e-476f-9b5c-582b761be607"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: parent-skill-check reads a hub's canary fixture, commands and guards from the hub's own repository

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The parent hub check audits a hub against the data of the repository that holds it, so its verdict does not depend on which checkout runs it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The checker's own code comes from its own checkout. A hub's canary fixture, bound commands, drift guard and advisor come from the hub's repository |
| D2 | A hub in no repository uses the checker's checkout. A hub repository without a fixture reports the leg as not applicable and never borrows the checker's fixture |
| D3 | No project's modes go into Skilled's fixture, and the vendored project stays read-only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The Barter `sk-code` reproduction exits 0 with `PASS: 5k-canary`, and this work wrote nothing in the project: 4b never ran the project's advisor and a `find -newer` scan found no new file
- [x] Every Skilled hub prints the same verdict lines before and after
- [x] The doctor test suite passes, and the new tests fail on the unfixed checker
- [x] The doctor changelog and the doctor scripts README describe the two roots
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
| Root split | Done | Reproduction exit 0, `PASS: 5k-canary` |
| Skilled hubs | Done | 7 of 7 identical verdict lines |
| Tests | Done | 1336 pass, 0 fail |

### Deviations and findings

| Item | Note |
|------|------|
| Changelog component | Written to `system-skilled-doctor` as the request named, although `system-skill-advisor` owns the `/doctor:skill-advisor` route |
| Workflow path | Spec docs written by the spec authoring card instead of the `/speckit:complete` YAML workflow |
| Barter git status | A concurrent session committed to Barter during the run, so comparing git status before and after proves nothing. Evidence that this work wrote nothing there is in the implementation summary |
<!-- /ANCHOR:log -->
