---
title: "Decision Record: Criteria file-line enforcement"
description: "The two decisions the coverage gate needed before it could enforce: the cutoff date it shares with the closure gate, and porting the Manual-infeasible exemption so both counting paths agree."
trigger_phrases:
  - "coverage cutoff decision"
  - "manual infeasible exemption"
  - "acceptance coverage enforcement"
  - "decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/015-criteria-file-line-enforcement"
    last_updated_at: "2026-09-07T22:40:00Z"
    last_updated_by: "implementation-session"
    recent_action: "Recorded the cutoff and exemption decisions"
    next_safe_action: "None; the gate enforces on new packets"
    blockers: []
    key_files:
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "implementation-015"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Criteria file-line enforcement

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Share the closure cutoff and port the Manual-infeasible exemption

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-07 |
| **Deciders** | implementation session, under the program's autonomous directive; the two open questions the plan reserved for an operator were decided here and are reversible by one variable and one awk line |

---

<!-- ANCHOR:adr-001-context -->
### Context

The coverage gate could count evidence but never fail a packet: its enforce switch had no rollout boundary, so turning it on would have failed every old packet at once, and its lifecycle check required a Status row in the implementation summary that none of the simplification program's sixteen children carry. Two questions were left open by the plan. Which date should bound enforcement, and should the canonical criteria table accept the Manual-infeasible exemption the traceability path already grants, or require a real citation on every Met row.

### Constraints

- The closure gate already draws its boundary at 2026-08-30 and operators already know that variable's shape.
- The two counting paths measure the same idea; a row that counts under one and not the other is a silent inconsistency the finding named.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: `SPECKIT_AC_COVERAGE_CUTOFF` defaults to 2026-08-30, the closure gate's boundary, and `_ac_analyze_canonical()` accepts a Verification cell that opens with `Manual-infeasible` and carries a rationale of more than twenty characters, exactly as the traceability path does.

**How it works**: Under enforcement, a packet created after the cutoff fails when covered rows fall under the floor; a packet created on or before it, or with no readable date, stays advisory and says so in a detail line. A row is covered by a `file:line` citation, a Waived or Superseded status, or a rationale-bearing Manual-infeasible opener. The retrofit of the sixteen packets used citations only; the exemption was not needed to clear the floor.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Share the closure cutoff; port the exemption** | One boundary for both gates; both counting paths agree | A bare `Manual-infeasible` label could be abused, so the rationale length is required | 8/10 |
| A later cutoff for coverage | Fewer packets fail on the first enforced run | Two dates to explain, and enforcement stays off by default anyway | 5/10 |
| Require a citation on every canonical Met row | Simplest rule | Leaves the traceability path more lenient than the canonical one, the inconsistency the finding recorded | 3/10 |

**Why this one**: Enforcement is opt-in, so the shared date costs nothing today, and the exemption closes the asymmetry rather than documenting it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A packet created after 2026-08-30 can be held to the floor with one environment variable.
- The gate activates on packets that record completion only in their criteria document, which is every packet this program scaffolded.

**What it costs**:
- The exemption is one more way to count a row covered. Mitigation: it needs a rationale and is visible in the cell.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An operator expected the coverage cutoff to differ from the closure one | L | One variable moves it; the reference documents both |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without a boundary the switch could never be turned on |
| 2 | **Beyond Local Maxima?** | PASS | A later date and a stricter rule were both weighed |
| 3 | **Sufficient?** | PASS | One default and one awk clause |
| 4 | **Fits Goal?** | PASS | The finding asked for enforcement and for the two paths to agree |
| 5 | **Open Horizons?** | PASS | Both are overridable without a code change |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `runtime/cli/rules/check-ac-coverage.sh` gains the cutoff pair, the criteria-status fallback and the exemption clause.
- `runtime/ENV-REFERENCE.md` documents `SPECKIT_AC_COVERAGE_CUTOFF`.

**How to roll back**: Set `SPECKIT_AC_COVERAGE_CUTOFF` to a later date to grandfather packets, or delete the exemption clause in `_ac_analyze_canonical()` and the three test cases that pin it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
