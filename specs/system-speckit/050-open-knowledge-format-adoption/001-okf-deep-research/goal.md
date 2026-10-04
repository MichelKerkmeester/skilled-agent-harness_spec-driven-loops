---
title: "Goal: Phase 1: okf-deep-research"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/001-okf-deep-research"
    last_updated_at: "2026-10-04T08:13:09Z"
    last_updated_by: "claude-sonnet-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-04-speckit-050"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: okf-deep-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Produce ten iterations of evidence-cited research that compare Google's Open Knowledge Format with how system-spec-kit works today and rank what to adopt, adapt or reject. Done when: research/lineages/deepseek-flash-max/iterations/ holds iteration-001.md through iteration-010.md; research/research.md ranks recommendations R1 to R8 with an adopt, adapt or reject verdict each; research/research.md Appendix A records the review corrections to the lineage verdicts; acceptance-criteria.md marks AC-001 to AC-006 Met with file:line evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executor is cli-pi with opencode-go/deepseek-v4.1-flash at max thinking, 10 iterations, stop policy max-iterations. |
| D2 | This phase changes no product file. Output stays under research/ and scratch/. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] research/lineages/deepseek-flash-max/iterations/ holds iteration-001.md through iteration-010.md
- [x] research/research.md ranks recommendations R1 to R8 with an adopt, adapt or reject verdict each
- [x] research/research.md Appendix A records the review corrections to the lineage verdicts
- [x] acceptance-criteria.md marks AC-001 to AC-006 Met with file:line evidence
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
| Research run, review and closure | Done | research/research.md; AC-001 to AC-006 Met |

### Deviations and findings

| Item | Note |
|------|------|
| Lineage state log has invented timestamps and an unusable registry | Recorded in research.md Appendix A, not regenerated |
<!-- /ANCHOR:log -->
