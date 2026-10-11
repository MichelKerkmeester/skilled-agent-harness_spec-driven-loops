---
title: "Goal: Phase 4: leftover-template-comments"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "leftover template comments goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/004-leftover-template-comments"
    last_updated_at: "2026-10-10T22:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "t4-feature-catalog-anchor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 4: leftover-template-comments

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove every leftover sk-doc-template comment from the skill documents, since no template emits them and nothing reads them.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One script in `scratch/` removes the comments and runs once. |
| D2 | Changelog prose that names the comment stays as history. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `git grep -E '^\s*<!-- *sk-doc-template:[^>]*-->\s*$' -- . ':!specs/**'` prints no match
- [x] `validate_document.py` passes every document this phase changed
- [x] Each of the five non-hub units changed here has a new changelog entry one patch above its previous latest
- [x] `validate.sh --strict` on this phase prints RESULT: PASSED
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
| Builder run | Done | files_changed=97 lines_removed=97 |
| Verification | Done | standalone grep empty, 0 document failures |

### Deviations and findings

| Item | Note |
|------|------|
| bench-runner.md | Failed `validate_document.py` before this phase on two lower-case H2 headings; fixed here. |
<!-- /ANCHOR:log -->
