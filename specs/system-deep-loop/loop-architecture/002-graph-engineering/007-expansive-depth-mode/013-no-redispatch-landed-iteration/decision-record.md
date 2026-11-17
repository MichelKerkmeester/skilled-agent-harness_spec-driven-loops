---
title: "Decision Record: Stop redispatch_once from re-running an iteration that already landed"
description: "The operator-accepted planning call: executor_missing, findings_not_enumerated and ledger_backing_missing skip the redispatch, which also closes the X-5 coupling with phase 006."
trigger_phrases:
  - "013-no-redispatch-landed-iteration operator decisions"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/013-no-redispatch-landed-iteration"
    last_updated_at: "2026-11-17T20:00:00Z"
    last_updated_by: "operator-decision"
    recent_action: "Recorded the operator's acceptance of the fix-agent planning call"
    next_safe_action: "Build the phase against the accepted decision"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "operator-decision-013-no-redispatch-landed-iteration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Stop redispatch_once from re-running an iteration that already landed

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Skip redispatch for the three post-delta reasons

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted. Operator accepted the fix-agent planning call on 2026-11-17. |
| **Date** | 2026-11-17 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

`verify-iteration.cjs` returns `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing` only after the narrative, state record and delta checks pass, so each means the iteration landed. `redispatch_once` re-dispatches on any first failure, and both leaf definitions refuse to overwrite a landed iteration, so the second dispatch is wasted. Phase 006 makes the research `findings_not_enumerated` gate live, which is the X-5 coupling between the two phases.

### Constraints

- Route-proof reasons keep their redispatch; the existing append-only verify case depends on it (REQ-005).
- `gateway_bypass_detected` is declared but has no return site.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Skip the redispatch for `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing`, and send those failures to the existing still-fails path.

**How it works**: Both `redispatch_once` rules carry the shared literal `Skip this redispatch when the failure reason is executor_missing, findings_not_enumerated or ledger_backing_missing.` Any other reason, route-proof included, re-dispatches once as today.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three post-delta reasons** | Covers every reason returned after the delta check; stays correct once 006 lands | Wider than the observed `executor_missing` case | 8/10 |
| `executor_missing` only | Smallest change | The wasted dispatch returns for `findings_not_enumerated` once 006 lands | 4/10 |

**Why this one**: The operator accepted the planning call. It closes the X-5 coupling: 006 can make the findings gate live without bringing the wasted dispatch back.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A landed iteration that fails with one of the three reasons spends no second dispatch.
- Phases 006 and 013 can build in either order.

**What it costs**:
- The still-fails path still writes `status: error` for the landed iteration, as today (REQ-006).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An appended corrected record could have cleared `findings_not_enumerated` | L | Both leaf definitions refuse to overwrite a landed iteration, so the redispatch did not produce one in practice |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Wasted dispatch observed live |
| 2 | **Beyond Local Maxima?** | PASS | `executor_missing`-only weighed |
| 3 | **Sufficient?** | PASS | REQ-001 to REQ-004 cases |
| 4 | **Fits Goal?** | PASS | Goal decision D2 |
| 5 | **Open Horizons?** | PASS | Route-proof and still-fails questions stay open in `spec.md` §7 |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `redispatch_once` and the verify `command_note` in `.skilled/commands/deep/assets/deep-research.yaml` and `deep-review.yaml` (T004, T009), plus both compiled contracts.

**How to roll back**: Remove the shared clause from both rules and regenerate the contracts.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| OD-001 | 2026-11-17: skip redispatch for `executor_missing`, `findings_not_enumerated` and `ledger_backing_missing` | Operator accepted the fix-agent planning call; closes the X-5 coupling with phase 006 | `spec.md` §7 "pending operator confirmation" | ADR-001, goal D2, REQ-001, `../006-state-log-leaf-fields/` T003 |
| OD-002 | 2026-11-17: the two remaining `spec.md` §7 questions take their recommended defaults. The still-fails path keeps today's end state (the `status: error` row supersedes the landed record), pinned by fixtures. The route-proof redispatch stays unchanged | Operator handover for the build accepted the recommended defaults for 013's two open questions | `spec.md` §7 open questions 1 and 2 | REQ-005, REQ-006, T008 |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision.

**OD-001** (2026-11-17, decider operator)

- Asked: whether to accept the fix-agent planning call in this phase's spec as an Accepted decision.
- Operator answer, as relayed in the 2026-11-17 decision brief: "013 skip redispatch for executor_missing, findings_not_enumerated, ledger_backing_missing (close 013's open question on this and X-5 coupling with 006)"
- Recorded as: ADR-001, Accepted.

**OD-002** (2026-11-17, decider operator)

- Asked: how to resolve 013's two open questions, the route-proof redispatch and the still-fails end state that `deriveLoopCounters` counts.
- Operator answer, as relayed in the 2026-11-17 build handover: "013 spec §7 still has two open questions (the route-proof redispatch, and the deriveLoopCounters default); each has a recommended default." The session orchestrator then recorded: "013's two open questions take their recommended defaults."
- Recorded as: OD-002; no ADR, because both defaults keep today's behavior.

<!-- /ANCHOR:operator-answers-verbatim -->
