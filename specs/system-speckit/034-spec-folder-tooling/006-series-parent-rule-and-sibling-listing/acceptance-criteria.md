---
title: "Acceptance Criteria: Series parent rule, sibling listing and trigger phrases for new packets"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing"
    last_updated_at: "2026-10-06T20:29:11Z"
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
# Acceptance Criteria: Series parent rule, sibling listing and trigger phrases for new packets

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/034-spec-folder-tooling/006-series-parent-rule-and-sibling-listing
**Level:** 2
**Status:** Complete
**Date:** 2026-10-06
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `phase-definitions.md` §2, When a reader looks for where a second small change to the same file goes, Then it defines a series parent by same artifact, same track and a different change, and sends a correction back to the existing packet | `phase-definitions.md` §2 "Series Parent: The Second Qualification Path" (commit 6a21c6b5311) | Met | - |
| AC-002 | REQ-002 | Given the rule docs and command notes, When searched for the old labels, Then no line says Option D adds a phase or Option E skips, and §4 lets a standard packet become a series parent's first child | A search over the edited docs for "Option E", "Prefer Option D" and "When Option D" returns 0 lines; §4 last paragraph names the exception | Met | - |
| AC-003 | REQ-003 | Given every doc that restates the phase thresholds, When read, Then each names the series parent exception | All seven docs that state the thresholds name the series parent, including the checklist the review missed | Met | - |
| AC-004 | REQ-004 | Given a track with packets created in the last 14 days, When `create.sh` makes a top-level packet there, Then stderr lists them, and a phase child or sub-folder run lists nothing | `create-track-refresh.vitest.ts` 3 new tests pass; worktree run listed nine `system-speckit` packets | Met | - |
| AC-005 | REQ-005 | Given `create.sh` copies a `spec.md`, When the file is read, Then its trigger phrases come from the slug and description, not the four template defaults | `create-root-numbering.vitest.ts` 2 new tests pass; scratch spec carried "scratch check sibling listing" | Met | - |
| AC-006 | REQ-006 | Given a spec with the four template phrases, When `GREP_CONVENTION` judges it, Then it warns with the generic-trigger class | `trigger-index.vitest.ts` judge test passes with `template-default` | Met | - |
| AC-007 | REQ-007 | Given the change, When the six baseline test files and new tests run, Then all pass and the golden snapshot diff touches only trigger phrase lines | 6 test files, 96 tests pass; golden snapshot unchanged because it does not capture trigger phrases | Met | - |

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

The rule change carried this phase, with the listing and seeded phrases making it easy to follow. The Gate 3 hook, a regroup command and a backfill of old specs were left out on purpose.
<!-- /ANCHOR:closure -->
