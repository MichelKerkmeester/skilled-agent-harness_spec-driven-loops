---
title: "Decision Record: One Validation Verdict, Honestly Earned"
description: "The decisions that changed what this packet delivered, each with the evidence that forced it."
trigger_phrases:
  - "validation gate decision record"
  - "anchors template headers merge"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/040-validation-gate-coherence"
    last_updated_at: "2026-08-29T16:50:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Recorded the decision that superseded the rule merge"
    next_safe_action: "Packet complete; no further action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp-server/lib/validation/orchestrator.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-speckit-040"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: One Validation Verdict, Honestly Earned

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The two template-shape rules are not merged

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-08-29 |
| **Deciders** | Packet author |

---

<!-- ANCHOR:adr-001-context -->
### Context

The specification required a document that does not follow its template to
produce one finding rather than two. The stated premise was that two rules
"failed on exactly the same fifteen folders out of one hundred and thirty-seven,
with no exceptions" and were therefore two branches of a single fault.

### Constraints

The packet's own governing rule is that a drop in the failure count must trace
to a duplicate, an unsatisfiable condition, or a corrected verdict, never to a
lowered bar. A merge justified by a false premise would be a lowered bar wearing
the costume of a deduplication.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

The merge is not performed. The requirement it came from is recorded as
superseded rather than dropped, and the acceptance criterion that tracked it
names this record.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

**Merge anyway and keep both detail lists.** Rejected. Keeping both lists
preserves the information but still reports one finding where two faults exist,
so a packet that breaks only its anchors and a packet that breaks both become
indistinguishable at the summary level.

**Merge only where the two actually co-occur.** Rejected as unimplementable
without inspecting both results first, which is the same work as reporting them
separately, for a cosmetic gain.

**Fix the legibility problem instead.** Adopted alongside this decision. The
complaint underneath the merge was that a finding did not say what it found.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

The gate continues to report two findings for a document that breaks both its
anchors and its headings, which is the correct count.

Detail lines now print whenever a rule produces any, rather than only under a
verbosity flag. That addresses the readability problem the merge was reaching
for without collapsing two distinct checks.

A future reader who revisits the merge idea will find the measurement here
rather than repeating it.
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The requirement was in scope and would otherwise have been silently skipped |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives weighed; the legibility fix was adopted from one of them |
| 3 | **Sufficient?** | PASS | Not merging requires no code; the accompanying detail-line change is four lines |
| 4 | **Fits Goal?** | PASS | The packet exists to make the gate trustworthy, and hiding a fault would work against that |
| 5 | **Open Horizons?** | PASS | The rules stay separable, so a future merge remains possible if evidence ever supports it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

Measured across 220 packets: the anchor rule fails alone on 4 of them, while the
header rule never fails alone. The premise of perfect co-occurrence held only in
the smaller 137-packet sample it was drawn from.

No merge code was written. The detail-line change lives in the orchestrator's
report printer, which now emits a rule's details whenever it produced any.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
