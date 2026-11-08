---
title: "Goal: Phase 8: review-3-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review 3 remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/008-review-3-remediation"
    last_updated_at: "2026-10-19T16:43:15Z"
    last_updated_by: "orchestrator"
    recent_action: "Checked all four completion criteria"
    next_safe_action: "Operator decides on merging worktree 148 to main"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: review-3-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every finding of the third session relaunch review is fixed, each code fix is proven by a test that fails without it, and every packet record matches the evidence it cites.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | All fifteen findings are in scope, as the operator chose on 2026-10-19 ("Fix all as phase 008"). |
| D2 | A record that claims more than its evidence is fixed by restoring or rerunning the evidence where that is possible, and by rewording only where it is not. |
| D3 | Work stays in `worktrees/148-session-relaunch-deep-review`. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The six new behavior tests fail against the pre-fix library files, and every session-relaunch suite ends with `fail 0` (AC-003, AC-004)
- [x] Phase 007 cites a committed `relaunch-run10.txt` whose lines match the cited numbers, and phase 002 AC-003 cites a passing literal smoke (AC-001, AC-002)
- [x] The handoff command, the environment reference and the parent and phase 006 records carry no finding the review named (AC-005, AC-006)
- [x] The full gate exits 0 and `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED` (AC-007)
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
| Review verified | Done | All fifteen findings confirmed against the files (`../review/review-report.md`, Verification) |
| Code fixes and tests | Done | Red run 6 of 163 failing on the pre-fix files; green 211 of 211 |
| Phase closed | Done | AC 7/7 Met; full gate rc 0; recursive strict nine PASSED |

### Deviations and findings

| Item | Note |
|------|------|
| Existing supersede test changed | The untouched-notes test held an open note of this session, which the fix now completes by design. That row now belongs to another session, and a new test covers this session's open note |
<!-- /ANCHOR:log -->
