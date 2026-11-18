---
title: "Goal: Phase 8: readme-html-conventions"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "readme html conventions goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/006-readme-template-conformance/008-readme-html-conventions"
    last_updated_at: "2026-11-18T07:14:13Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the rule, the fold check and the pilot"
    next_safe_action: "None: the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-readme-html-conventions"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: readme-html-conventions

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A README author knows when to use a GitHub alert or a folded table, and the validator refuses a fold GitHub would render wrong.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the four pilot files change among READMEs. A wider rollout is a later decision |
| D2 | The fold check may block only once a scan shows no current document breaks it |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `validate_document.py` prints `INVALID` with `fold_unclosed` for the unclosed probe
- [x] `validate_folds` reports 0 issues across every tracked `.md` file
- [x] The four pilot files print `VALID` and `gh api markdown` shows the alert and the folded table
- [x] `validate.sh --strict` on this phase prints `RESULT: PASSED` and the phase commit is on origin/main
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
| Rule and checklist line | Done | `writing-patterns.md` §3, `quality-and-checklist.md` Style |
| Fold check and tests | Done | `12 passed`, 0 issues over 64,445 files |
| Pilot and render | Done | 4 `VALID`, alert and fold in the GitHub render |

### Deviations and findings

| Item | Note |
|------|------|
| The fold rule's wording | The first draft barred folding a section's main table, which would rule out nearly every long table. It now separates lookup tables from read-through ones |
<!-- /ANCHOR:log -->
