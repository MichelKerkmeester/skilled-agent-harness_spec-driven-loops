---
title: "Goal: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "pivot hygiene goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene"
    last_updated_at: "2026-11-17T14:35:15Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-012-pivot-hygiene"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Divergent pivot hygiene: seat cap scope, dead minRemainingIterations guard, one council retry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the divergent pivot's limits mean what they say: a seat cap with a stated scope, no guard that can never fire, and one retry for a transient council failure.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The seat-cap and retry tasks wait for `decision-record.md` ADR-001 to be Accepted. |
| D2 | `minRemainingIterations` stays readable in configs and persisted limits; only its unreachable check goes. |
| D3 | `council_agreement_failed` is never retried unless the operator widens it in ADR-001. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [ ] `npm test -- tests/integration/divergent-pivot.vitest.ts tests/council/multi-seat-dispatch.vitest.ts tests/unit/divergent-pivot-cli.vitest.ts` exits 0 with the new cases.
- [ ] `npm run typecheck` in `.skilled/skills/system-deep-loop/runtime` exits 0.
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
| ADR-001 operator decision | Done | 2026-11-17: 3 seat outputs per council attempt, at most one retry, so at most 6 per pivot (`decision-record.md` OD-001, OD-002) |

### Deviations and findings

| Item | Note |
|------|------|
| Retry scope | Parent section 20 Slice L says one retry for `council_*` refusals. This phase retries only the three quorum failures (`failureReasonForQuorum`, `divergent-pivot.ts:719-728`), because agreement failure is a verdict, not a transient error. |
<!-- /ANCHOR:log -->
