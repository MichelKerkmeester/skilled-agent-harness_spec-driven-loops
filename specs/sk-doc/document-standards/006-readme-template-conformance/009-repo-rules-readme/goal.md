---
title: "Goal: Phase 9: repo-rules-readme"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "repo rules readme goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/009-repo-rules-readme"
    last_updated_at: "2026-11-18T08:48:50Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the README and the checker skip"
    next_safe_action: "Push the measurer fix and tick T013"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-009-repo-rules-readme"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 9: repo-rules-readme

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The repo-rules folder has a README written under the alert and fold rule, and every tool that reads the folder agrees it is not a rule.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The README is skipped where the checker and the card builder list rules, matched the way the document validator already matches it |
| D2 | The alert and fold rule is applied as written: an alert only for a step that breaks something, and no fold under 15 rows |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `check-repo-rules.cjs` prints `files=10` and `RESULT: PASSED (11/11 checks)` with the README in place
- [x] `validate_document.py` prints `VALID` for the README, and `gh api markdown` shows one alert and no fold
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED` and the phase commit is on origin/main
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
| Checker and builder skip | Done | `2 failed` before, `36 passed` after |
| Measurer skip | Done | `1 failed` before, `37 passed` after, found after the first push |
| README and gates | Done | `VALID`, ceiling 100/100, 11/11 checks, 1 alert and 0 folds rendered |

### Deviations and findings

| Item | Note |
|------|------|
| The program goal kept README work off the validator and its scripts | Recorded as a second amendment in the parent goal and as Q011 in the parent decision record |
<!-- /ANCHOR:log -->
