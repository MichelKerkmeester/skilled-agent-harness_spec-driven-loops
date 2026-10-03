---
title: "Goal: research the sk-design-diagram upgrade"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "diagram upgrade research goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/001-upgrade-research"
    last_updated_at: "2026-09-10T21:26:29+02:00"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Retrofitted the phase goal from its spec and criteria"
    next_safe_action: "None; phase 2 starts from the synthesis"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019-001-upgrade-research-goal"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: research the sk-design-diagram upgrade

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Decide by cited evidence what of the chart standard transfers to sk-design-diagram, what the diagram context changes, and the phases that follow, each with a gate.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| R1 | This phase reports and changes nothing in the diagram skill; the phases after it implement |
| R2 | Five iterations run, one angle each, with no early convergence stop |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `research/lineages/glm/iterations/iteration-001.md` through `iteration-005.md` exist, each citing file:line
- [x] `research/research.md` sorts every finding into enforceable, judged or governance and names the following phases with a gate each
- [x] `research/lineages/sonnet/research.md` gives every first-lineage finding a CONFIRMED, CORRECTED or UNVERIFIABLE verdict with evidence
- [x] The missing iteration-5 state record and synthesis event are recorded in `research/orchestration-summary.json` and `research/research.md`, not hidden
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
| Phase criteria | Done | `acceptance-criteria.md`: AC-001 to AC-004 all Met |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written after the phase closed | The parent's binding row named this file before it existed; it was retrofitted from `spec.md` and `acceptance-criteria.md` with no new work claimed |
<!-- /ANCHOR:log -->
