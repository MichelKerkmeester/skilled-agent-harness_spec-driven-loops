---
title: "Acceptance Criteria: metadata-regeneration-and-parser-edges"
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
    packet_pointer: "scaffold/001-index-root-and-docs"
    last_updated_at: "2026-09-05T21:16:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-06-057-metadata-regeneration-and-parser-edges"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: metadata-regeneration-and-parser-edges

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/024-metadata-regeneration-and-shared-parser
**Level:** 2
**Status:** Complete
**Date:** 2026-09-05
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the drift census, When the regeneration runs, Then every clean drifted packet is refreshed and the dirty one is named | 113 regenerated, `specs/sk-doc/051-sk-create-chart` skipped; commit `f704455e2b` | Met | - |
| AC-002 | REQ-002 | Given six sampled regenerated packets, When validated strict, Then every failure predates the pass | four PASSED; two failures reproduce at HEAD (missing referenced file; `parent_id` already `"null"`) | Met | - |
| AC-003 | REQ-003 | Given each adopting package root, When the shared parser is imported from there, Then it resolves | ESM and CommonJS probes from the deep-loop runtime; ESM probe from sk-doc's scripts | Met | - |
| AC-004 | REQ-004 | Given the two skills, When their JavaScript parsers are inventoried after adoption, Then each remaining one has a reason | 7 adopted; 38 sites in 26 files remain: 16 in deep-loop directories without a dependency edge, 16 spec-kit internals owned by the parser's own skill, 1 advisor checker, spec-kit test helpers; Python parsers listed | Met | - |

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

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
