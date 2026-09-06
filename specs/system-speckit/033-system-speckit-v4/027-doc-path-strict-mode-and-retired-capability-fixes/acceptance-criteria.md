---
title: "Acceptance Criteria: Doc path, strict-mode and retired-capability fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "strict mode warning semantics doc fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/027-doc-path-strict-mode-and-retired-capability-fixes"
    last_updated_at: "2026-09-06T10:25:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Verified every criterion from the final state"
    next_safe_action: "Meet the open criteria as the fixes land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-v4-reality-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Doc path, strict-mode and retired-capability fixes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 027-doc-path-strict-mode-and-retired-capability-fixes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the nine P1 rows, When each cited line is opened, Then the corrected text is present | `git diff` of the ten files | Met | - |
| AC-002 | REQ-002 | Given the corrected passages, When each named path or rule is checked on disk, Then it exists | `ls` of every named path | Met | - |
| AC-003 | REQ-003 | Given the five P2 rows, When each cited line is opened, Then the corrected text is present | `git diff` | Met | - |
| AC-004 | REQ-004 | Given the edited docs, When the index is regenerated, Then malformedDocuments is 0 | `generate-trigger-index.mjs --json` | Met | - |

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

Every criterion was verified from the final state on 2026-09-06; the evidence is named in implementation-summary.md. Nothing was waived.
<!-- /ANCHOR:closure -->
