---
title: "Goal: Phase 11: post-fix-remediation"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "post fix remediation goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "specs/hooks/023-session-relaunch-loop/011-post-fix-remediation"
    last_updated_at: "2026-10-19T21:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Checked all four completion criteria"
    next_safe_action: "Merge worktree 156 to main"
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
# Goal: Phase 11: post-fix-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Every finding of the research after phase 009, its two frontier items and the follow-ups the fixes surface are fixed with a test that fails without the change, and the arm decision joins the conformance table.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Scope is all twenty findings, "Plus bug" and "all open items", as the operator asked on 2026-10-19. The deep-loop open items live in `system-deep-loop/038-review-and-cli-lineage`. |
| D2 | Work stays in `worktrees/156-session-relaunch-post-fix-remediation`, merged to main without a push, then removed. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] A re-arm after a killer death relaunches, and the killer never signals for a record the wrapper would refuse (AC-001, AC-002)
- [x] Every arm path uses one guard and the conformance table covers it (AC-003)
- [x] Every other finding and frontier item has a passing test, and the pre-phase sources fail them (AC-004, AC-005)
- [x] The docs match the code and `validate.sh specs/hooks/023-session-relaunch-loop --recursive --strict` prints `RESULT: PASSED` (AC-006)
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
| Core and adapter lane | Done | 14 findings and the killer frontier item |
| Wrapper lane | Done | P2-6 and the Cursor and Devin tests, 109/109 |
| Follow-ups and docs | Done | `Date` clock, logged template fallback, four docs |
| Gate and red swap | Done | node 566/566, Pi 39/39; red 82 and 2 |

### Deviations and findings

| Item | Note |
|------|------|
| Not-a-defect findings fixed too | P2-13, P2-18 and P3-4 were judged not defects; the operator asked for all, so each got the smallest change: a `RUNTIMES` constant, a wrapper-variable table and a Pi load check |
<!-- /ANCHOR:log -->
