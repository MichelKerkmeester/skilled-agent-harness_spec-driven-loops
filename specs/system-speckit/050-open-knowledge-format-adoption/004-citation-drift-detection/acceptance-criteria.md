---
title: "Acceptance Criteria: Phase 4: citation-drift-detection"
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
    packet_pointer: "system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection"
    last_updated_at: "2026-10-04T08:04:52Z"
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
# Acceptance Criteria: Phase 4: citation-drift-detection

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/050-open-knowledge-format-adoption/004-citation-drift-detection
**Level:** 2
**Status:** Complete
**Date:** 2026-10-04
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the default invocation, When it runs, Then it makes no model call, reads no credential and writes no file | No file written (implementation-summary.md:118); only git is spawned outside `--jev` and `.env` is refused (implementation-summary.md:119) | Met | - |
| AC-002 | REQ-002 | Given a citation to a renamed file and one to a deleted file, When the scanner resolves them, Then it reports moved and gone respectively | Moved and gone are separate classes (implementation-summary.md:61) with fixtures for each (implementation-summary.md:115); four census runs agree (implementation-summary.md:116) | Met | - |
| AC-003 | REQ-003 | Given a census run, When its output is read, Then it names the commit | The total line ends `commit=5285608745fe` (census.txt:34) | Met | - |
| AC-004 | REQ-004 | Given `--corpus specs` or `all`, When it runs, Then spec packets and research artifacts are read | `--corpus specs` and `all` read spec packets, research iterations included, archives left out (implementation-summary.md:57); the specs family holds 139,931 citations (census.txt:33) | Met | - |
| AC-005 | REQ-005 | Given the census, When it is published, Then each number is split by doc family | A `family` line per doc family carries every class (census.txt:33) | Met | - |
| AC-006 | REQ-006 | Given phase 006 needs a threshold proposal, When the final census is read, Then the proposal was committed to this folder first | The operator removed phase 006, so the proposal has no consumer; the file is retired (decision-record.md) | Superseded | ADR-001 |
| AC-007 | REQ-007 | Given `/doctor:speckit`, When it runs, Then it shows the drift summary per family, makes no model call and writes only its own report | Per-family summary built by the step's own command and grouping (implementation-summary.md:122); no model call (implementation-summary.md:119); writes only its report, state log and listing under packet scratch | Met | - |

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

Six of seven rows are met and AC-006 is superseded by ADR-001, because the operator removed phase 006, the only consumer of the threshold proposal.
<!-- /ANCHOR:closure -->
