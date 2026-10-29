---
title: "Goal: Phase 1: deep-research"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/001-deep-research"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-router-files-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 1: deep-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Answer the six skill-router research questions with cited evidence, so phases 002 to 006 can be scoped without guessing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research only. No skill, script or test changes. |
| D2 | The Luna lineage runs gpt-6-luna through cli-codex. A spent Luna quota stops the loop and is never rerouted to another model. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `research/lineages/luna/iterations/` holds `iteration-001.md` to `iteration-003.md`.
- [ ] `research/lineages/deepseek/iterations/` holds `iteration-001.md`, and `fanout-merge.cjs` prints `merged_lineages: 2`.
- [ ] `research/research.md` answers RQ-1 to RQ-6 with cited file and line references or unconfirmed marks.
- [ ] `research/research.md` recommends one design and names what would change that recommendation.
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
| Three Luna iterations, one DeepSeek iteration, research synthesis | Complete | Operator status. Child acceptance criteria AC-001 to AC-005 read Met. |

### Deviations and findings

| Item | Note |
|------|------|
| None | Nothing diverged from the directive. |
<!-- /ANCHOR:log -->
