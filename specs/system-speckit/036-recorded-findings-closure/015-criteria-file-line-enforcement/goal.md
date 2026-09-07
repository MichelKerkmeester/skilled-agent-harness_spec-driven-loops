---
title: "Goal: Criteria file line enforcement"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "acceptance criteria file line enforcement"
  - "coverage floor cutoff rollout"
  - "lifecycle activation gap"
  - "citation retrofit coverage floor"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/015-criteria-file-line-enforcement"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-criteria-file-line-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Criteria file line enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Turn on cutoff-gated file:line enforcement for acceptance criteria the way the closure rule is already gated, close the activation gap that currently makes the gate a no-op for the program it should prove and retrofit that program's own children to the floor.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The cutoff mirrors `check-ac-closure.sh`'s existing pattern in structure, not just in name |
| D2 | The lifecycle-activation gap is closed before the retrofit is claimed meaningful, since flipping the switch alone changes nothing for this program today |
| D3 | The Manual-infeasible asymmetry between the canonical and legacy coverage-counting paths is resolved by an explicit, recorded decision, not a silent workaround |
| D4 | The retrofit is scoped to children 006 through 022 of the simplification-research program, not a repository-wide sweep |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` exist with no bracketed placeholder remaining
- [ ] `check-ac-coverage.sh` carries both the cutoff pair and the lifecycle-activation fallback
- [ ] `runtime/ENV-REFERENCE.md` documents `SPECKIT_AC_COVERAGE_CUTOFF`
- [ ] Children 006-022's measured coverage reaches at least 70 of 77 rows
- [ ] `validate.sh --strict` with the enforce switch on passes for each of children 006-022 with the gate observed active
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
| Packet opened | Done | this file |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
