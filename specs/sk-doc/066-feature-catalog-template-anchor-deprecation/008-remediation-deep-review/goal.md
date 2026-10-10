---
title: "Goal: Phase 8: remediation-deep-review"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "remediation deep review goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/066-feature-catalog-template-anchor-deprecation/008-remediation-deep-review"
    last_updated_at: "2026-10-10T22:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "r4-t4-review"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 8: remediation-deep-review

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give the eight phase commits an independent deep-review verdict that lists only confirmed findings.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Review only; no product file changes. |
| D2 | Run `/deep:review:auto` for five iterations on cli-pi with DeepSeek V4.1 Flash. |
| D3 | Keep a finding only after its proof is rerun. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] Five iteration files exist and each passed `verify-iteration.cjs`
- [x] `review/review-report.md` states a verdict and each kept finding with file:line, evidence and a fix
- [x] `git status` shows no product file changed
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
| Iterations 1 to 5 | Done | Each verify OK on the first dispatch |
| Synthesis | Done | PASS, five P2, one dropped |

### Deviations and findings

| Item | Note |
|------|------|
| Bookkeeping | The graph-convergence ledger event and the continuity save were skipped; convergence was logged instead. |
<!-- /ANCHOR:log -->
