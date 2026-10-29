---
title: "Goal: Phase 7: ai-systems-research"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/007-ai-systems-research"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0271-ai-systems-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 7: ai-systems-research

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Find what each of the 16 AI Systems skill routers holds, what loads it, which checks read it and how a Claude Project receives it, so phase 008 can plan the move without guessing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Research only. Nothing in the AI Systems repository changes in this phase. |
| D2 | Three DeepSeek V4.1 Flash iterations run through cli-pi. Every claim cites a file and line or is marked unconfirmed. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `research/lineages/deepseek/iterations/` holds `iteration-001.md` to `iteration-003.md`, and the run ends `completed`.
- [ ] `research/research.md` answers RQ-1 to RQ-5 for all 16 skills, with cited lines or unconfirmed marks.
- [ ] `research/research.md` holds an RQ-1 table with 16 rows, one per skill.
- [ ] `research/research.md` gives each of the 16 skills a target shape.
- [ ] `research/research.md` names one way a Claude Project receives a router, and says why alternatives lose.
- [ ] Cited lines for load-bearing claims match `Barter-BV/marketing-ai-systems`.
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
| DeepSeek lineage, research synthesis, verification by the conductor | Complete | Operator status, on main. Child acceptance criteria AC-001 to AC-005 read Met. |

### Deviations and findings

| Item | Note |
|------|------|
| Parent phase map | The parent phase map reads 007 In Progress. The child spec and the operator report Complete. The parent was not edited. |
<!-- /ANCHOR:log -->
