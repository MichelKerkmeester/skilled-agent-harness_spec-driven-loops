---
title: "Goal: Phase 30: epic-deep-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "epic deep review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/030-epic-deep-review"
    last_updated_at: "2026-10-14T16:46:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-030-epic-deep-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 30: epic-deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the shipped work of the sk-code Ponytail refinement epic a five-iteration cli-codex deep review with re-verified findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Executor is cli-codex gpt-6-luna at max effort and fast tier, and the run is review-only |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `verify-iteration.cjs` passes for iterations 1 to 5
- [x] `review/review-report.md` names a verdict and adjudicates every P0 and P1
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
| Five iterations and synthesis | Done | review/review-report.md, verdict CONDITIONAL |

### Deviations and findings

| Item | Note |
|------|------|
| Scope left out the Commit-Id helper and Pi Fast Mode | Recorded as blocked search debt and a follow-up review |
<!-- /ANCHOR:log -->
