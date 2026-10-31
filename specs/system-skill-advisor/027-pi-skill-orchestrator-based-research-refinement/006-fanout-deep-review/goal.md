---
title: "Goal: Review Phase: Two-Model Deep Review of the Advisor Refinements"
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
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review"
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
# Goal: Review Phase: Two-Model Deep Review of the Advisor Refinements

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Have two independent model families review the phase 2 to 5 changes for correctness, security, traceability and maintainability, so the operator can choose which findings to fix from the report and its verification notes alone.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | MiMo v2.6 Pro at high effort and DeepSeek V4.1 Flash at max effort each run three iterations through cli-pi on LLM Gateway, with the stop policy set to max iterations. |
| D2 | The review scope is the path list in `goal-file-manifest.txt`, across all four dimensions. |
| D3 | This phase fixes no finding. Fixes go to a later phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `review/lineages/mimo/deep-review-state.jsonl` and `review/lineages/deepseek/deep-review-state.jsonl` each hold three iteration records, and neither lineage stopped on convergence
- [ ] `review/review-report.md` carries a verdict and lists every finding with its severity, file and line
- [ ] The fan-out summary reports no containment violation from the run
- [ ] Every P0 and P1 finding is marked confirmed, refuted or unverified with its evidence before any fix is planned
- [ ] The convergence step records `synthesis_complete` without a root dashboard
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
