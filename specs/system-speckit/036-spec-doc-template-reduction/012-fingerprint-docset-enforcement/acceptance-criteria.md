---
title: "Acceptance Criteria: Fingerprint Docset Enforcement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "fingerprint docset criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-spec-doc-template-reduction/012-fingerprint-docset-enforcement"
    last_updated_at: "2026-08-30T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-fingerprint-docset-enforcement"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Fingerprint Docset Enforcement

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/036-spec-doc-template-reduction/012-fingerprint-docset-enforcement
**Level:** 2
**Status:** Draft
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet with a `source_fingerprint` and no `source_fingerprint_docset`, When it is validated, Then it reports an error rather than skipping the comparison | [command and output that shows the error] | Unmet | - |
| AC-002 | REQ-001 | Given that same packet, When the marker key is deleted to suppress the check, Then deletion is a validation failure rather than silence | [negative control: the pre-change behaviour reports nothing] | Unmet | - |
| AC-003 | REQ-002 | Given a packet whose documents drifted since its digest was derived, When the migration stamps it, Then the stored digest is byte-identical to before and the drift is subsequently reported | [diff of the file across the migration, plus the validation finding] | Unmet | - |
| AC-004 | REQ-002 | Given the whole tree, When the migration has run, Then the count of packets carrying a fingerprint without a marker is 0 | [the same count command that reports 3,489 today] | Unmet | - |
| AC-005 | REQ-003 | Given a packet whose marker is older than the current generation, When it is validated, Then it still skips | `scripts/tests/fingerprint-docset-generation.sh` | Unmet | - |
| AC-006 | REQ-004 | Given the test suite, When it runs against the pre-change code, Then the cases pinning the new contract fail | [negative control output] | Unmet | - |
| AC-007 | REQ-002 | Given the migration run twice, When the second run completes, Then no file changed | [git status after the second run] | Unmet | - |

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

**Closeable:** No

[Write this when the packet is closed, not before. AC-003 is the row that matters most:
it is the difference between exposing the drift and absorbing it, and absorbing it would
reproduce the defect this packet exists to fix.]
<!-- /ANCHOR:closure -->
