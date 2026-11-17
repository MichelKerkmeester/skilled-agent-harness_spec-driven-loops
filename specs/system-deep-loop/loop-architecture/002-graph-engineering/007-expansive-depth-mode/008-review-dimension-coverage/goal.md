---
title: "Goal: Close the out-of-contract review dimension gap (D10)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "review dimension coverage goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/008-review-dimension-coverage"
    last_updated_at: "2026-11-17T14:35:11Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive; awaiting the operator decision"
    next_safe_action: "Capture the REQ-004 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-review-dimension-coverage"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Close the out-of-contract review dimension gap (D10)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make sure no review run can silently lose its clean stop and its pivot to a dimension name the reducer does not know.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No implementation task starts until `decision-record.md` ADR-001 is Accepted. |
| D2 | Runs that use only the four canonical dimensions keep identical registries and verdicts. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [ ] The out-of-contract dimension case in `review-depth-convergence.vitest.ts` passes on the chosen branch.
- [ ] The REQ-004 suites from `spec.md` pass against the T002 baseline.
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
| Phase docs authored | Done | `spec.md`, `plan.md`, `tasks.md`, `decision-record.md` |
| ADR-001 operator decision | Done | 2026-11-17: support custom dimensions (`decision-record.md` OD-001) |
| Session save | Done | operator decisions written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Review pivot test home | No review-pivot vitest suite exists today; the support branch adds its case to `divergent-pivot.vitest.ts`. |
<!-- /ANCHOR:log -->
