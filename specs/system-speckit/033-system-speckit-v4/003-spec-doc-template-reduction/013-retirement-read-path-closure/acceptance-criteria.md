---
title: "Acceptance Criteria: Retirement Read-Path Closure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "read path closure criteria"
  - "phase child scaffolded level two"
  - "upgrade matches native scaffold"
  - "inferLevel returns two"
  - "misspelled enforcement value"
  - "checklist reference sweep"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/013-retirement-read-path-closure"
    last_updated_at: "2026-08-30T14:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-retirement-read-path-closure"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Retirement Read-Path Closure

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/003-spec-doc-template-reduction/013-retirement-read-path-closure
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
| AC-001 | REQ-001 | Given that the evidence rule was deleted as advisory, When this packet closes, Then it records whether a blocking successor is wanted and why | ADR-001: the closure gate already blocks on the same property; the deleted rule never did | Met | - |
| AC-002 | REQ-001 | Given a successor is wanted, When its id matching is specified, Then it covers the family, colon and four-digit shapes the deleted rule missed | Superseded — no successor is being built, so its id matching is moot | Superseded | ADR-001 |
| AC-003 | REQ-002 | Given a level-2 packet, When level is inferred, Then both modules return 2 | `scripts/lib/completion-state.cjs` inferLevel; an L2 fixture returned 1 before the fix and 2 after | Met | - |
| AC-004 | REQ-002 | Given the module the retirement never touched, When it infers level, Then it uses the replacement document rather than the deleted one | `shared/parsing/spec-doc-health.ts:85` now reads acceptance-criteria.md; the retirement never touched this file | Met | - |
| AC-005 | REQ-003 | Given a misspelled value in either enforcement variable, When the rule runs, Then it reports the unrecognized value instead of disabling itself | `scripts/lib/parse-bool-flag.sh`; the value `ture` disabled a blocking rule before, keeps it enabled and names itself after | Met | - |
| AC-006 | REQ-004 | Given the reference tree, When it is searched for instructions to create the retired document, Then none remain and no link points at the deleted template | `rg checklist.md references/` — only the line that says PRESERVE for historical docs remains | Met | - |
| AC-007 | REQ-005 | Given a phase child scaffolded at level 2, When it is created, Then it has the merged verification region | A phase child scaffolded with --level 2 now has protocol anchor and 26 verification items; it had 0 before | Met | - |
| AC-008 | REQ-005 | Given a packet scaffolded at level 1 and then upgraded, When the upgrade completes, Then it has the same verification region as one scaffolded at level 2 | L1 scaffold then upgrade --to 2: 0 items before, 26 after, and a second run stays at 26 | Met | - |

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

AC-007 and AC-008 carried the packet, and they were right to. Every other fix reads a document
the scaffold was not producing: a phase child was created at Level 1 regardless of the level
asked for, and the upgrade path added documents without re-assembling the one that carries the
verification region. Both are closed, and both were measured before and after.

AC-002 is superseded. It specified the id shapes a successor to the deleted evidence rule would
need to match, and the decision was to build no successor.
<!-- /ANCHOR:closure -->
