---
title: "Goal: Phase 8: ai-systems-migration"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/008-ai-systems-migration"
    last_updated_at: "2026-10-29T13:20:00Z"
    last_updated_by: "claude-haiku-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "0269-skill-router-files"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Phase 8: ai-systems-migration

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give each of the 16 AI Systems skills its own sibling `ROUTER.md`, linked from its SKILL.md, and bring its Claude Project knowledge files into line with that router.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The changed files are each skill's `SKILL.md`, its `ROUTER.md` and its Claude Project knowledge files, all in the AI Systems repository. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] Each of the 16 AI Systems skill folders holds a `ROUTER.md`, and its `SKILL.md` links to that file with a relative link that resolves on disk.
- [ ] Text from each `ROUTER.md` appears in that skill's Claude Project knowledge files.
- [ ] No commit reaches `Barter-BV/marketing-ai-systems` before the operator approves a push.
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
| AI Systems router migration | Not started | Operator status. Writes to a separate repository whose remote push needs operator approval. |

### Deviations and findings

| Item | Note |
|------|------|
| Unfilled child sources | The child spec.md and acceptance-criteria.md are unfilled scaffolds with placeholder tokens. These criteria come from the parent phase map row and the parent Phase Handoff Criteria row, the only filled sources. Re-derive them from this phase's own documents once they are authored. |
<!-- /ANCHOR:log -->
