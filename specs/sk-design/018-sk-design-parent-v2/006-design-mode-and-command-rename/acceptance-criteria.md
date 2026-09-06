---
title: "Acceptance Criteria: Phase 1: design-mode-and-command-rename"
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
    packet_pointer: "scaffold/006-design-mode-and-command-rename"
    last_updated_at: "2026-09-06T16:22:20Z"
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
# Acceptance Criteria: Phase 1: design-mode-and-command-rename

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `sk-design/018-sk-design-parent-v2/006-design-mode-and-command-rename`
**Level:** 3
**Status:** Complete
**Date:** 2026-09-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given two mode trees carrying the wrong hub's prefix, When they are renamed, Then git records renames rather than delete-plus-add | `git diff --cached --name-status -M`: 249 mode files, 8 command files and 2 docs all `R` | Met | - |
| AC-002 | REQ-002 | Given the old command paths, When the move lands, Then `/design:chart` and `/design:diagram` resolve and `/create:chart` and `/create:diagram` do not exist | Both new files present under `.opencode/commands/design/`; both old paths absent; `command-metadata.json` binds each to its mode | Met | - |
| AC-003 | REQ-003 | Given the markdown agent advertising every `/create:*` command, When the rebind lands, Then the design agent claims both and the markdown agent claims neither | Both agents rewritten across five runtime forms each; `check-agent-mirror-sync` reports all mirrors in sync | Met | - |
| AC-004 | REQ-004 | Given a guard that refuses a hub whose inputs do not compile, When it runs, Then every hub reports fresh | `compiled-route-guard`: all hubs fresh, serving matches inputs and the runtime matches its source | Met | - |
| AC-005 | REQ-005 | Given the pre-rename replay, When the sixteen phrases are replayed after the rename, Then no phrase is below its baseline | Replay at generation 650 byte-identical to `scratch/baseline-before-rename.txt`; `sk-design-chart` and `sk-design-diagram` themselves route at 0.9139, above the 0.82 the old names scored | Met | - |
| AC-006 | REQ-006 | Given 165 live references and 527 historical ones, When the sweep runs, Then no live file resolves to an old name and no historical record is rewritten | Live sweep clean outside generated retrieval fixtures; 527 `specs/` files and 8 benchmark reports left as written, after a mid-phase over-sweep of the reports was caught and reverted | Met | - |

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

AC-005 carried this phase: a rename is only safe if nothing stops arriving, and the replay came back
byte-identical. AC-006 is the one that nearly failed — a mid-phase sweep rewrote eight benchmark
reports into describing a run that never happened, and was caught and reverted. Consciously left out:
the four documents inside the chart mode still claiming twenty-one forms, recorded in
`scratch/deferred-form-count.md` for the mode's owner, and the retrieval fixtures belonging to another
packet's test corpus.
<!-- /ANCHOR:closure -->
