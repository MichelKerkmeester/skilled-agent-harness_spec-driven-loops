---
title: "Goal: Phase 7: gap-closure"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "gap closure goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/007-gap-closure"
    last_updated_at: "2026-11-02T17:46:39Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: gap-closure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE
**Objective:** Every answer the decision queue holds is either offered at the next save or reported missing, closed through the smallest change each gap allows.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The ranked gaps come from `../research/research.md`; a gap left open is recorded in `decision-record.md` with its reason. |
| D2 | No new adapter, file kind or runtime: each fix lands in the module that already owns the behavior. |
| D3 | The parent's second live pass on all five runtimes runs on this phase's code. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA
- [x] `node .skilled/hooks/decision-capture/bin/sweep-codex.mjs --transcript missing.jsonl` and the same for `sweep-pi.mjs` each print JSON with an `error` field and exit 1.
- [x] `rg -n 'scan-orphans' .skilled/commands/speckit/save.md` prints the step that lists other sessions' pending answers.
- [x] Every row of `acceptance-criteria.md` reads Met.
- [x] `validate.sh specs/system-speckit/spec-authoring-and-continuity/004-decision-capture --strict --recursive` prints RESULT: PASSED for this folder.
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
| Six gap fixes | Done | `implementation-summary.md` Verification |
| Pi `question` tool | Done | Added after the second live pass; AC-010 |
| Second live pass | Done | `../006-live-conversation-test/implementation-summary.md` Second Live Pass |

### Deviations and findings

| Item | Note |
|------|------|
| Goal written after the work | The scaffold was left unfilled until the deep review flagged it; the criteria above restate what `acceptance-criteria.md` already closed. |
<!-- /ANCHOR:log -->
