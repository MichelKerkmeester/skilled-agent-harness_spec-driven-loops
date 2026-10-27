---
title: "Goal: Phase 24: typed-command-ambiguity"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "typed command ambiguity goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/024-typed-command-ambiguity"
    last_updated_at: "2026-10-27T08:30:49Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
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
# Goal: Phase 24: typed-command-ambiguity

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
<!-- FILL: Write one sentence: what the packet is for, not how. GOOD: Keep only the newest n archives on request. WEAK: Improve the script. -->

**Objective:** A typed command's owner is reported without an ambiguity flag when the only close skill is one the seed bound held below it.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scores, weights and the 0.05 margins do not change; only the held pair leaves the cluster. |
| D2 | Each code change lands with a test that fails without it. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
<!-- FILL: Write one command-checkable criterion per line. GOOD: `--keep 3` leaves 3 archives in `logs/archive` and exits 0. WEAK: The work is done. -->

- [ ] The live typed `/deep:research :auto` probe prints system-deep-loop first with `ambiguous: false`
- [ ] The advisor suite and the Python twin show no new failure, and the five phase 22 probes keep their top skill
- [ ] Every row of this phase's `acceptance-criteria.md` reads Met
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
| Flag reproduced | Done | live probe: `ambiguous: true`, 0.564694 vs 0.564693 |

### Deviations and findings

| Item | Note |
|------|------|
| Recommended fix changed | The earlier advice was a heavier explicit-lane weight; the confidence tie (0.8235 both) would keep the flag, so the held pair is skipped instead |
<!-- /ANCHOR:log -->
