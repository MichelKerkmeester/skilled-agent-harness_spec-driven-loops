---
title: "Goal: Research Phase: Pi Skill Orchestrator Mechanisms Against System Skill Advisor"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/001-deep-research"
    last_updated_at: "2026-09-26T20:04:10Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "None. The phase is complete, so rerun the criteria only if it reopens"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-goal-authoring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Research Phase: Pi Skill Orchestrator Mechanisms Against System Skill Advisor

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer research questions RQ1 to RQ7 with evidence from both the pi-skill-orchestrator extension and system-skill-advisor, so the operator can choose refinement phases from a ranked list without rereading either codebase.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | MiMo v2.6 Pro at high effort runs 10 iterations through cli-pi on LLM Gateway, and SWE-2 MAX runs 5 through cli-devin. |
| D2 | No lineage edits the orchestrator source or the advisor, and none runs the advisor tests, `validate.sh`, `generate-context.js` or a git write. |
| D3 | Token Saver counts only where it bears on advisor output size, brief format or lazy discovery. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `research/lineages/mimo/deep-research-state.jsonl` holds 10 iteration records and `research/lineages/swe2max/deep-research-state.jsonl` holds 5, and each terminal record carries `stopReason` `maxIterationsReached`
- [ ] `research/research.md` answers RQ1 to RQ7, and every ranked recommendation in it cites both codebases at `file:line` or states that the advisor side is absent
- [ ] The fan-out summary reports no containment violation, and `git status` shows no change from the run outside `001-deep-research/research/`
- [ ] A verification note records every citation in the ranked list as resolved or failed, and `research/research.md` marks each failed one
- [ ] `research/research.md` marks each recommendation as found by both lineages, by one lineage or disputed
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
| Phase status | Done | `spec.md` metadata reads Complete, and `implementation-summary.md` holds the evidence |

### Deviations and findings

| Item | Note |
|------|------|
| Source of criteria | The phase is Level 1 and has no `acceptance-criteria.md`, so the criteria come from the Acceptance Criteria column of its `spec.md` requirements table, as the operator approved |
| Criteria left unticked | This goal was authored after the phase closed. The authoring pass did not rerun the checks, so it ticks none |
<!-- /ANCHOR:log -->
