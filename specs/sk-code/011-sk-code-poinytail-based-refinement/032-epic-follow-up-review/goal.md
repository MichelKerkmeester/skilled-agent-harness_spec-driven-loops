---
title: "Goal: Phase 32: epic-follow-up-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "epic follow up review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/032-epic-follow-up-review"
    last_updated_at: "2026-10-14T18:34:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-032-epic-follow-up-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 32: epic-follow-up-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Review what the epic deep review left unread, with re-verified findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Same executor as 030: cli-codex gpt-6-luna at max effort and fast tier, review-only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Iterations 2 to 5 pass `verify-iteration.cjs` and iteration 1 is recorded as an error
- [x] `review/review-report.md` adjudicates every P0 and P1
- [x] `validate.sh --strict` on this folder prints RESULT: PASSED
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
| Five iterations and synthesis | Done | review/review-report.md, verdict FAIL on one P0 |

### Deviations and findings

| Item | Note |
|------|------|
| Iteration 1 produced no file | Recorded as an error, and iterations 2 and 3 covered its Commit-Id ground |
<!-- /ANCHOR:log -->
