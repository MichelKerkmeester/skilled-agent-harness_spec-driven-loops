---
title: "Decision Record: risk-first repair of inaccurate playbook scenarios"
description: "Two proposed decisions carrying evidence: execution rather than review as the acceptance criterion for a repaired scenario, and escalation rather than in-place patching of the Gate-3 safety-gate defect."
trigger_phrases:
  - "scenario repair acceptance criterion decision"
  - "gate-3 escalation decision"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/024-playbook-scenario-coverage/002-scenario-accuracy-repair-risk-first"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Promoted the two inline plan.md ADRs into the decision record"
    next_safe_action: "Operator accepts or rejects ADR-001 and ADR-002"
    blockers: []
    key_files:
      - "decision-record.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Risk-First Repair of Inaccurate Playbook Scenarios

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

Both decisions below are **Proposed**. Neither may be marked Accepted by the executing agent — that is the operator's signature.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Execution is the acceptance criterion, not review

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Every defect this phase repairs shipped past review. The documents read correctly; the commands failed. A review-based acceptance criterion would reproduce the exact failure mode being repaired.

### Constraints

- The execution must be real: a disposable clone and a disposable remote where the scenario needs one, not a dry run.
- Some scenarios will legitimately end in `SKIP` with a named blocker; that outcome must be recorded honestly, not forced to a false `PASS`.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a repaired scenario is not repaired until it has been executed once, for real, with the run artifact filed in the dated-run report tree.

**How it works**: each of the 19 shipped scenarios gets one real execution pass after its command sequence is corrected; the artifact from that run — not a re-read of the document — is the evidence cited in `checklist.md`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Execute once, file the artifact (chosen)** | Reproduces the same control that would have caught the original defect | Slower; needs disposable clone/remote infrastructure | 8/10 |
| Peer review of the repaired documents | Fast, no infrastructure needed | It is precisely the control that already failed on the original 19 | 2/10 |

**Why this one**: only real execution closes the gap that let 19 scenarios ship with commands that would fail today.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Repaired scenarios carry execution evidence instead of a second read of the same prose.
- `SKIP` outcomes with a named blocker become visible and honest rather than hidden behind a stale `PASS`.

**What it costs**:
- The phase is slower and needs a disposable clone and a disposable remote. Mitigation: risk-tiered ordering runs the highest-hazard scenarios first so the safety-relevant evidence lands earliest.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Execution against a live remote by accident | H | Disposable clone/remote required for any scenario naming a remote push |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | 19 shipped scenarios recorded `PASS` while their exact command sequence would fail today |
| 2 | **Beyond Local Maxima?** | PASS | Peer review was considered and rejected as the same control that already failed |
| 3 | **Sufficient?** | PASS | One real execution per scenario, no broader re-architecture of the playbook format |
| 4 | **Fits Goal?** | PASS | Directly the phase's stated repair methodology, on the critical path to Milestone M4 |
| 5 | **Open Horizons?** | PASS | The dated-run report tree pattern is reusable by later phases without rework |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Each of the 19 scenarios gets a corrected command sequence plus one real execution run.
- Run artifacts land under `<skill>/benchmark/reports/<dated-run>/`, cited by `checklist.md`.

**How to roll back**: revert the scenario file to its pre-repair text; the execution artifacts are additive and can be deleted independently without affecting the scenario document.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The safety-gate defect is escalated, not patched here

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-07-30 |
| **Deciders** | Operator |

### Context

The Gate-3 hook displays one meaning for an option letter and parses another — two authorities inside one file disagree. A documentation packet has neither the mandate nor the blast-radius ownership to rule on the runtime fix.

### Decision

**We chose**: reproduce the defect, escalate it as an amendment decision under the runtime's own packet (`system-spec-kit`), and rewrite the affected scenario only after adjudication, so it certifies ruled behavior instead of re-certifying the contradiction.

### Alternatives Considered

- Rewriting the scenario to match the parser's actual behavior: rejected — it would bless the contradiction and hide a live operator hazard rather than surface it.

### Consequences

- One repair is blocked on a person, with unbounded wall-clock, so it is filed first in the risk-first ordering for that reason.
- This packet ships no parser change, by design; the fix belongs to `system-spec-kit`.
<!-- /ANCHOR:adr-002 -->
