---
title: "Decision Record: Routing Regression Diagnosis and Disposition"
description: "Architecture decisions governing how the reproduced routing regression is measured, attributed and dispositioned."
trigger_phrases:
  - "013-routing-regression-diagnosis decision record"
importance_tier: "normal"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/033-json-optimization-implementation/013-routing-regression-diagnosis"
    last_updated_at: "2026-07-30T10:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored Level 3 phase spec"
    next_safe_action: "Begin execution per plan.md once upstream dependencies clear"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "033-json-optimization-implementation/013-routing-regression-diagnosis"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: Routing Regression Diagnosis and Disposition

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Diagnose before re-pinning, always

<!-- ANCHOR:adr-001-context -->
### Context

The scorer-eval baseline can be regenerated with a single flag. Doing so makes every failing check pass immediately, because it redefines the current state as the expected state. Two of the audit's own remediation proposals reach for exactly that — one suggests amending the pinned capture to record the drifted figure and retracting the original as a capture-time error.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

No baseline artifact is re-pinned until the regression is attributed and dispositioned. The capture script is run without its write flag for the entire phase.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

Re-pinning first and diagnosing afterwards was rejected: once the pin moves, the evidence that anything changed is gone, and the diagnosis loses its reference point. Re-pinning with the old values preserved in a comment was rejected as too weak — a comment is not a measurement, and the next tool to run the capture would overwrite it.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The ratchet stays red until this phase closes, which is uncomfortable but honest. Downstream phases inherit a hard ordering constraint. In exchange, the delta stays provable by anyone who re-runs the measurement, indefinitely.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes

The prohibition is repeated in spec requirements, the plan's rollback section, the task list and this phase's continuity block, so it survives a context loss mid-execution.
<!-- /ANCHOR:adr-001-impl -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks

Simplicity: one negative rule, no machinery. Systems: the pin is read by the ratchet, the capture tooling and every future comparison. Bias: the temptation is to make the red test green, which is the wrong problem. Sustainability: a preserved pin keeps the delta auditable long after this session. Value: it is the difference between fixing a regression and hiding one.
<!-- /ANCHOR:adr-001-five-checks -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Status reconciliation follows measurement

<!-- ANCHOR:adr-002-context -->
### Context

Three audit lineages independently found the parent's phase map stale and continuity blocks reading zero completion against a Complete status. Both proposed remediations flip those to Complete. Executed before this phase resolves, that would leave the packet looking finished over an open regression.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

The metadata regeneration phase is sequenced strictly after this phase and after the completion-honesty phase, and names both as blockers in its own continuity.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

Running metadata regeneration first was rejected despite being the cheapest fix: it upgrades a visible inconsistency into an invisible one. Running it in parallel was rejected because the generator would propagate whichever status it found at the moment it ran, which is a race.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

The packet displays an obviously-unfinished state for longer. That visibility is the point — an accurate conditional beats an inaccurate complete.
<!-- /ANCHOR:adr-002-consequences -->

<!-- ANCHOR:adr-002-impl -->
### Implementation Notes

The dependency is expressed in the dependent phase's own blockers rather than only in this record, so a reader who opens that phase directly still sees it.
<!-- /ANCHOR:adr-002-impl -->

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks

Simplicity: an ordering constraint, not a mechanism. Systems: touches the parent map, ten child continuity blocks and the derived status. Bias: cheapest-first ordering optimises for looking done. Sustainability: the ordering rule generalises to any remediation program. Value: prevents the remediation from concealing the defect it was opened for.
<!-- /ANCHOR:adr-002-five-checks -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Accept is a decision, never a default

<!-- ANCHOR:adr-003-context -->
### Context

Restoring the lost delegation accuracy may prove harder than accepting it, particularly if the drop turns out to be a deliberate trade-off inside the delegation scorer. The failure mode is that accept becomes the outcome by attrition rather than by judgement.
<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
### Decision

Accept requires a written rationale stating why the lost accuracy is tolerable, plus operator sign-off. The checklist carries it as a blocking item.
<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

Requiring a fix unconditionally was rejected: if the bisect shows the drop is the cost of a deliberate improvement elsewhere, forcing a revert would be worse. Allowing a silent accept was rejected outright — that is indistinguishable from the failure being remediated.
<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-consequences -->
### Consequences

The phase can close with metrics below the pin, but only visibly and deliberately, with the shortfall stated numerically.
<!-- /ANCHOR:adr-003-consequences -->

<!-- ANCHOR:adr-003-impl -->
### Implementation Notes

The downstream gate phase reads this disposition to set its expected values, so an accepted figure propagates into CI as an explicit decision rather than an accident.
<!-- /ANCHOR:adr-003-impl -->

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks

Simplicity: one gate on one decision. Systems: the disposition propagates into the ratchet baseline and CI. Bias: effort-driven defaults masquerade as engineering judgement. Sustainability: written rationale survives the people who wrote it. Value: makes the difference between an accepted regression and an unnoticed one.
<!-- /ANCHOR:adr-003-five-checks -->
<!-- /ANCHOR:adr-003 -->
