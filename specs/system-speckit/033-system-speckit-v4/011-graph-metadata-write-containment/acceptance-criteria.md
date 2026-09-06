---
title: "Acceptance Criteria: Prove workspace membership in the graph-metadata write guard instead of pattern-matching a specs segment"
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
    packet_pointer: "scaffold/043-workspace-path-containment"
    last_updated_at: "2026-08-30T08:04:08Z"
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
# Acceptance Criteria: Prove workspace membership in the graph-metadata write guard instead of pattern-matching a specs segment

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/011-graph-metadata-write-containment
**Level:** 2
**Status:** Complete
**Date:** 2026-08-30
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a destination that merely looks spec-shaped, When a caller passes it to the write, Then the write is refused and no file is created | `scripts/tests/graph-metadata-write-containment.sh:56` | Superseded | ADR-001 |
| AC-008 | REQ-001 | Given a destination outside every workspace and no `.opencode` directory among its ancestors, When a caller passes it to the write, Then the write is refused and no file is created | `scripts/tests/graph-metadata-write-containment.sh:56` | Met | - |
| AC-002 | REQ-001 | Given a track that is a symlink into a sibling repository, When metadata is written into it, Then the write succeeds | `scripts/tests/graph-metadata-write-containment.sh:77` | Met | - |
| AC-003 | REQ-001 | Given a destination in a workspace that is not the caller's, When that workspace is anchored on a real `.opencode` directory, Then the write succeeds | `scripts/tests/graph-metadata-write-containment.sh:89` | Met | - |
| AC-004 | REQ-001 | Given the same shape with the `.opencode` anchor removed, When the write is attempted, Then it is refused, so a destination cannot authorize itself | `scripts/tests/graph-metadata-write-containment.sh:97` | Met | - |
| AC-005 | REQ-001 | Given a caller whose working directory is outside the repository, When it writes into the repository's own specs root, Then the write succeeds | `scripts/tests/graph-metadata-write-containment.sh:102` | Met | - |

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

AC-008 and AC-002 are the two directions the boundary has to hold at once, and they
are what the packet was opened for. AC-003 through AC-005 were added after the first
version shipped: it measured roots from the calling process rather than from the
destination, which refused every write from a workspace that was not the caller's.

AC-001 was superseded rather than met. As written it claimed any spec-shaped destination
is refused; a later review reproduced the condition that defeats it — one directory named
`.opencode` beside the destination — so AC-008 restates the property the code actually has.
The reasoning is in ADR-001, and the follow-up packet pins the limit with a test.

Left out deliberately: a symlink planted inside an authorized root is still trusted,
recorded under Known Limitations rather than closed here.
<!-- /ANCHOR:closure -->
