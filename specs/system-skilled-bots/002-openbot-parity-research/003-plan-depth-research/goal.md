---
title: "Goal: Planning-depth review of the 003 build plan"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "plan depth research goal"
  - "planning depth review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/002-openbot-parity-research/003-plan-depth-research"
    last_updated_at: "2026-11-25T23:50:00Z"
    last_updated_by: "record-run"
    recent_action: "Recorded the finished depth run and its fifteen work orders"
    next_safe_action: "Expand the 003 build plan from WO-01, then WO-02 to WO-14, then WO-15"
    blockers: []
    key_files:
      - "specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-003-plan-depth-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Planning-depth review of the 003 build plan

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide, phase by phase, whether each of the thirteen 003 build phases can be built in one shot without a design decision, and write the work order that closes every gap.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One `/deep:research` fan-out in expansive depth mode: one Vibe `deepseek-flash` lineage and one opencode lineage at 10 iterations each, then a Codex top-up of two `gpt-6-luna` lineages at 5 iterations each, with the stop policy set to max iterations |
| D2 | `003-terminal-screen` is the depth benchmark and is not a subject. Its six children are not reviewed |
| D3 | Every finding names the phase, the gap, the evidence, a severity and the closing artifact or child phase |
| D4 | The expansion is ranked into fifteen work orders, and no two orders edit the same file |
| D5 | Every finding is re-checked against its cited line and regraded before it enters the synthesis |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] 20 iteration records under `research/lineages/`, vibe 10, codex-1 5, codex-2 5 and opencode 0
- [x] `research/research.md` holds a verdict for each of the thirteen phases and fifteen work orders, and `research/findings-registry.json` records 102 findings
- [x] `research/research.md` section 8 marks all 102 findings confirmed, weak, wrong or not verified, and section 7 gives the reason for every regrade
- [x] `validate.sh --strict` on this packet prints `RESULT: PASSED`
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
| T001 phase packets read | Done | `ls -d specs/system-skilled-bots/003-openbot-parity-build/0{01,02,03,04,05,06,07,08,09,10,11,12,13,14}-* \| wc -l` printed 14 |
| T002 depth benchmark read | Done | `003-terminal-screen/002-architecture-and-contracts/design/contracts.md` read as the bar |
| T004 fan-out run | Done | 4 lineages configured, 20 iterations, `research/orchestration-summary.json` records 2 lineages in the first config |
| T005 quota stop and top-up | Done | `research/steering-log.md` records `failure_class: quota` for opencode, and the Codex top-up added 10 iterations |
| T006 synthesis | Done | `research/research.md`, 13 verdicts, 11 cross-cutting gaps and 15 work orders |
| T007 regrades | Done | 76 confirmed, 19 weak, 6 wrong and 1 not verified |

### Deviations and findings

| Item | Note |
|------|------|
| Level 1, not Level 2 | The packet is a research record with no `acceptance-criteria.md`, and the parent's phase map treats each child as Level 1 |
| opencode contributed nothing | Its monthly quota ran out before its first iteration, so the Codex top-up replaced it rather than the run restarting |
| codex-1 marked failed | The runner marks it failed for a missing terminal row in its state log. Its five iteration files are complete and the synthesis judged them on content |
| Nine operator decisions left open | D1 to D9 in `WO-01` each carry a recommended default, and none of them is the run's to take |
<!-- /ANCHOR:log -->
