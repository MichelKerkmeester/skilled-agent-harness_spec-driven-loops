---
title: "Acceptance Criteria: Header tags, hook catch and script test fixes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "shell header tag normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/028-header-tags-hook-catch-and-script-test-fixes"
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
# Acceptance Criteria: Header tags, hook catch and script test fixes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 028-header-tags-hook-catch-and-script-test-fixes
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
| AC-001 | REQ-001 | Given the runtime tree, When the retired tags are grepped, Then no file matches | `grep -rl` over runtime/cli | Met | - |
| AC-002 | REQ-002 | Given the two tests, When vitest runs them, Then both pass and `tsc` exits 0 | vitest and typecheck output | Met | - |
| AC-003 | REQ-003 | Given a thrown error in main, When the hook runs, Then stderr has one line and the exit code is 0 | Manual run with a forced throw | Met | - |
| AC-004 | REQ-004 | Given the judgment rows, When the implementation summary is read, Then each has a decision | implementation-summary.md | Met | - |

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
