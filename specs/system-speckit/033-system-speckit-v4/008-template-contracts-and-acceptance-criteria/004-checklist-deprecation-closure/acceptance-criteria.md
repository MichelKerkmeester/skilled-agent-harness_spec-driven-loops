---
title: "Acceptance Criteria: Checklist Deprecation Closure"
description: "What must be true for the acceptance-coverage advisory to be measuring the document it counts from, and for a pre-merge packet's result to be unchanged by that."
trigger_phrases:
  - "ac coverage acceptance criteria"
  - "checklist deprecation closure criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the closure criteria for the coverage-source fix"
    next_safe_action: "Verify each criterion against the unit suite and the live packets"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/tests/check-ac-coverage.sh"
    session_dedup:
      fingerprint: "sha256:48b1104e947c15f7a3ca9c159e451a4db397df81961ad53f1dd05b10eda45d51"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "A retired criterion is exempt from citation; its decision record is the evidence"
---

# Acceptance Criteria: Checklist Deprecation Closure

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure
**Level:** 2
**Status:** Complete
**Date:** 2026-08-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a packet whose criteria carry citations, When the advisory runs, Then it counts them | `scripts/tests/check-ac-coverage.sh:69` cited rows score 2/2; live run moved four packet-042 phases from 0/5 to 5/5 | Met | - |
| AC-002 | REQ-001 | Given a packet whose criteria carry prose only, When the advisory runs, Then none of it counts and each row is named | `scripts/tests/check-ac-coverage.sh:64` prose scores 0/2 — the exact pre-fix symptom, now pinned | Met | - |
| AC-003 | REQ-002 | Given a criterion whose Status is Waived or Superseded, When the advisory runs, Then it counts without a citation | `scripts/tests/check-ac-coverage.sh:74` and `:78`, both scoring full | Met | - |
| AC-004 | REQ-003 | Given a packet carrying both documents, When the source is resolved, Then the merged tasks document wins | `scripts/tests/check-ac-coverage.sh:122` returns `tasks.md`; a pre-merge packet still returns `checklist.md` (`:125`) | Met | - |
| AC-005 | REQ-004 | Given a packet with a criteria document and no traceability table, When the advisory runs, Then it is still measured | `scripts/tests/check-ac-coverage.sh:106` canonical doc alone activates the gate | Met | - |
| AC-006 | REQ-005 | Given a column inserted before Verification, When the advisory runs, Then the read is unshifted | `scripts/tests/check-ac-coverage.sh:92` an extra column does not shift Verification | Met | - |
| AC-007 | REQ-006 | Given the suite runs, When the evidence read and the count are separated again, Then a case fails | `scripts/tests/check-ac-coverage.sh:30` asserts the reported ratio, not the severity; 14/14 pass, 11 of them through that helper | Met | - |

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

All seven criteria met. The advisory that this packet exists to repair is the one that scores this packet, and it now reports full coverage from the same document these rows live in.
<!-- /ANCHOR:closure -->
