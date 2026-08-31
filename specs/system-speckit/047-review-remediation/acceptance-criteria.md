---
title: "Acceptance Criteria: Review Remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/047-review-remediation"
    last_updated_at: "2026-08-31T04:50:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Close the three P1 findings that survived four deep-review iterations: a fail-open kill switch, a plan-time parent gate that skips newly orphaned daemons, and a contradictory permission-mode precondition

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/047-review-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-08-31
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an apply call with no enable decision, When it runs, Then nothing is signalled and the reason distinguishes omission from disable | Control failed pre-fix by signalling; passes post-fix | Met | - |
| AC-002 | REQ-002 | Given a daemon whose parent dies after the snapshot, When the sweep applies, Then it is collected on that pass | Control failed pre-fix with an empty appliedPids; passes post-fix | Met | - |
| AC-003 | REQ-003 | Given a daemon with a live parent, When the sweep applies, Then it is never signalled and the refusal is recorded | No signal, process alive, reason `classification-not-reapable` | Met | - |
| AC-004 | REQ-004 | Given the playbook precondition, When it is read beside its audit banner, Then the two agree and name their version | Precondition version-scoped; contract validator PASS, violations 0 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

AC-003 carried this packet. The two fixes widen what the sweep will consider, so the property that
matters is that the live-parent refusal still holds — and it does, now with a recorded reason
instead of a silent filter. AC-001 and AC-002 each rest on a control that was observed failing
before the fix; the review found these precisely because the original tests never did that.
<!-- /ANCHOR:closure -->
