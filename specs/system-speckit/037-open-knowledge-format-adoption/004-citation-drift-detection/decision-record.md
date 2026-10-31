---
title: "Decision Record: phase 006 removed, threshold proposal retired"
description: "The operator removed the anchor citation phase, so the threshold proposal this phase owed it has no consumer and the requirement is superseded."
trigger_phrases:
  - "decision record"
  - "threshold proposal retired"
  - "anchor phase removed"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection"
    last_updated_at: "2026-10-04T14:00:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Recorded the removal of phase 006 and the retired proposal"
    next_safe_action: "Operator reviews the diff and decides the commit"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e4486fa5-248b-49a4-8970-229354aab7a1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: phase 006 removed, threshold proposal retired

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Retire the phase 006 threshold proposal

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-10-04 |
| **Deciders** | Operator, 2026-10-04: "lets delete all code andn things related to . The anchor citation form: not built". Drafted by claude-opus-5-5 |

---

<!-- ANCHOR:adr-001-context -->
### Context

REQ-006 asked this phase to write a threshold proposal for phase 006, the anchor citation form, before reading the final census. The proposal was written three minutes after the census totals were seen, so AC-006 stayed unmet. Phase 006 then closed as not built, and the operator removed it from the packet along with everything that existed only for it.

### Constraints

- A row may only leave `Unmet` by being met, waived or superseded, and the last two need a decision record.
- The census itself is unaffected: it never depended on the proposal.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: retire the proposal and supersede REQ-006 and AC-006, because the phase they served no longer exists.

**How it works**: `threshold-proposal.md` is deleted, with a copy kept outside the repository in the session backup. AC-006 is marked `Superseded` and points here. The phase 002 decision that fixed the threshold stays in its own record as history, marked superseded.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Supersede the row** | Truthful: the requirement lost its consumer | The ordering slip stays visible only in this record | 9/10 |
| Waive the row | Also closes it | A waiver says the work was skipped, but the work became moot | 5/10 |
| Leave it unmet | No new record | The phase can never close, since the order cannot be redone | 2/10 |

**Why this one**: superseding names the actual cause, which is that phase 006 is gone.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Phase 004 can close on its other six criteria.

**What it costs**:
- The record of the late proposal now lives only here. Mitigation: this record keeps the times, 09:52Z for the census totals and 09:55Z for the proposal.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Someone revives the anchor form later | L | Restore phase 006 from the session backup, or plan it anew with a threshold fixed before data |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The row cannot close any other way |
| 2 | **Beyond Local Maxima?** | PASS | Waiver and leaving it open were weighed |
| 3 | **Sufficient?** | PASS | One status change and one deleted file |
| 4 | **Fits Goal?** | PASS | The operator removed phase 006 |
| 5 | **Open Horizons?** | PASS | The backup keeps the way back open |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `threshold-proposal.md` deleted, AC-006 and REQ-006 superseded, T009 closed as superseded.

**How to roll back**: extract `004-citation-drift-detection/threshold-proposal.md` from the session backup `phase006-backup.tgz` and set AC-006 back to `Unmet`.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---
