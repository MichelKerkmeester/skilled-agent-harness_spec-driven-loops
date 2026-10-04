---
title: "Goal: Rule concision rewrites"
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
    packet_pointer: "agents/016-repo-rule-advisor-surfacing/006-rule-concision-rewrites"
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
# Goal: Rule concision rewrites

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The 13-rule corpus shrinks by 20% to 28% while every norm, test, exception, Fires-when bullet and self-check item survives, and each cut is listed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Cuts remove apparatus only. No norm changes except one operator-added communication.md clause: explain complex topics in simple terms from the first explanation, never only after the reader asks. No section is renumbered and no loading changes. |
| D2 | Every rule is rewritten through sk-doc's sk-create-repo-rule mode, and evidence-and-proof.md and communication.md start from the two swe-2-max drafts. |
| D3 | Every failure-naming sentence and the three communication.md edge clauses stay. |
| D4 | Each rule ships in its own commit with a ledger that files every dropped sentence as boilerplate, restatement, rationale or provenance. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] implementation-summary.md carries a second reviewer's sign-off that comparing each ledger with its diff finds no imperative, test, exception, Fires-when bullet or self-check item missing
- [ ] node check-repo-rules.cjs on the rewritten corpus reports 10/10
- [ ] rg output shows every section reference from the T003 inventory still resolving to a section with the same number
- [ ] wc -c puts the 13 rule files at or below 91,028 bytes
- [ ] git diff filtered to added lines in .skilled/repo-rules/ shows no em dash or semicolon
- [ ] A phase 004 analyzer report measures a post-change window against the baseline
- [ ] communication.md carries the simple-terms clause, and the diff shows it keeps every caveat and number rule intact
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
| Phase work | Pending | spec.md metadata Status Draft. Criteria trace to acceptance-criteria.md AC-001 to AC-005 and spec.md REQ-006 |
| Simple-terms clause | Pending | operator request 2026-10-04; REQ-007, T005, AC-006 |

### Deviations and findings

| Item | Note |
|------|------|
| Sixth criterion has no AC row | REQ-006 and tasks.md T009 require the post-change window, so the goal carries it alongside AC-001 to AC-005 |
<!-- /ANCHOR:log -->
