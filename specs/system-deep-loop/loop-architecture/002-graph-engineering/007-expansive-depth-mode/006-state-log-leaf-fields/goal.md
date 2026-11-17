---
title: "Goal: Restore the research leaf fields the state-log projection drops (D7, D9)"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "state log leaf fields goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/006-state-log-leaf-fields"
    last_updated_at: "2026-11-17T14:35:01Z"
    last_updated_by: "scaffold"
    recent_action: "Operator decided ADR-001: option 1, widen the upcast"
    next_safe_action: "Capture the REQ-007 baseline (T002)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-state-log-leaf-fields"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Restore the research leaf fields the state-log projection drops (D7, D9)

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the research `findings_not_enumerated` gate and the `focusAlignment` guard run on real leaf data, from the source the operator chooses.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | No implementation task starts until `decision-record.md` ADR-001 is Accepted. |
| D2 | Frontier fields stay off state-log rows whichever option is chosen. |
| D3 | The parent packet's own files are not edited from this phase; needed parent wording is recorded in ADR-001. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `rg -n 'Accepted' decision-record.md` prints the ADR-001 status line.
- [ ] The findings-gate-runs case in `verify-iteration.vitest.ts` passes with reason `findings_not_enumerated`.
- [ ] The convergence case reports `focusAlignment` `failed` and passes.
- [ ] The REQ-007 suites from `spec.md` pass against the T002 baseline.
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
| ADR-001 operator decision | Done | 2026-11-17: option 1, widen the upcast (`decision-record.md` OD-001) |
| Session save | Done | operator decisions written to decision-record.md |

### Deviations and findings

| Item | Note |
|------|------|
| Option 2 consequence | Parent section 12 item 6 ties the default-run change to option 1 only, but section 20 Slice F and the code agree that option 2 also switches both checks on for every research run. This phase states it for both. |
<!-- /ANCHOR:log -->
