---
title: "Goal: Phase 9: ai-systems-verification"
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
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/014-skill-router-files/009-ai-systems-verification"
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
# Goal: Phase 9: ai-systems-verification

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove that the AI Systems checks pass on the moved routers, that every router resolves, and that each Claude Project mirror matches its skill.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Verification reads the AI Systems repository and changes none of its files. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] All checks in `Barter-BV/marketing-ai-systems` exit 0.
- [ ] Each of the 16 AI Systems skills resolves to `router-md` through `router-file-resolver.cjs`.
- [ ] Each skill's `SKILL.md` link to its `ROUTER.md` resolves on disk.
- [ ] Claude Project mirrors match their `ROUTER.md`.
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
| AI Systems verification | Not started | Operator status. |

### Deviations and findings

| Item | Note |
|------|------|
| Unfilled child sources | The child spec.md and acceptance-criteria.md are unfilled scaffolds with placeholder tokens. These criteria come from the parent phase map row and the parent Phase Handoff Criteria row. Re-derive them from this phase's own documents once they are authored. The no-write decision is also derived from the phase row, not from a filled child spec. |
<!-- /ANCHOR:log -->
