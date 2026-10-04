---
title: "Goal: Trigger coverage check"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/005-trigger-coverage-check"
    last_updated_at: "2026-10-04T16:40:25Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "create-goal-retrofit-2026-10-04"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Trigger coverage check

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** CI fails when a repo rule's Fires-when bullet has no counterpart in its REPO RULES.md router row.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Check 10 matches lexically against the router row's items, with its threshold set from the overlap measured across all 13 rules. No model does the matching. |
| D2 | Router edits only add missing routes. |
| D3 | Barter's copy of the checker and the rule bodies stay untouched. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] node check-repo-rules.cjs on the corpus prints RESULT: PASSED (10/10 checks)
- [ ] Check 10 reports each uncovered bullet with its rule, the bullet text and the router line number
- [ ] pytest through --root covers one covered and one uncovered bullet, and removing a router item in a fixture makes check 10 fail
- [ ] implementation-summary.md lists every REPO RULES.md router edit
- [ ] sk-create-repo-rule/SKILL.md and references/rule-anatomy.md each list ten checks
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
| Phase work | Pending | tasks.md T001 to T008 open |

### Deviations and findings

| Item | Note |
|------|------|
| No acceptance-criteria.md | Level 1 phase. Criteria come from spec.md REQ-001 to REQ-004, SC-001 and SC-002 and tasks.md T007 and T008 |
<!-- /ANCHOR:log -->
