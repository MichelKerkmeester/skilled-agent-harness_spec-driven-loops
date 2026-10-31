---
title: "Acceptance Criteria: Phase 1: diagram-references"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "diagram references acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/074-reference-template-debt/001-diagram-references"
    last_updated_at: "2026-10-29T23:30:00Z"
    last_updated_by: "claude-sonnet-worker"
    recent_action: "Recorded evidence for every criterion"
    next_safe_action: "None, the criteria are met"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-277-reference-template-debt"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: diagram-references

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** sk-doc/074-reference-template-debt/001-diagram-references
**Level:** 2
**Status:** Complete
**Date:** 2026-10-29
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 34 diagram references, When `validate_document.py` runs on each, Then every one prints `Total issues: 0` | `validate-all.py` over the 34 files prints `failing=0`, down from 190 issues in 34 files | Met | - |
| AC-002 | REQ-002 | Given every rewritten `§N`, When the old target heading is compared with the new one read from the new text, Then the two have the same words | proof table `rewrite-table.tsv`: `rows=125 mismatches=0` | Met | - |
| AC-003 | REQ-002 | Given the converted files, When every `§N` is rescanned, Then none points at a missing section | `verify` prints `checked=146 dangling=0`, and the same scan on the HEAD files prints the same counts | Met | - |
| AC-004 | REQ-003 | Given the hub set, When the leaf replay runs before and after, Then the totals line and the report are unchanged | `gold=64 scored=56 tied=3 mean_f1=0.9161 exact=49` both times and `cmp` prints nothing | Met | - |
| AC-005 | REQ-004 | Given each file and its HEAD version, When the allowed edits are removed from both, Then no line differs | `preserved` prints `files=34 differing=0` | Met | - |
| AC-006 | REQ-002 | Given the repo, When searched for anchor links into the 34 files, Then none breaks | `rg` for `type-*.md#`, `output-spec.md#` and the other names finds 0 hits, and the same search finds the known `ROUTER.md#3-machine-router` links | Met | - |

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

Every criterion is met. The two older citations that name no section matching their sentence are listed in the implementation summary and left as written.
<!-- /ANCHOR:closure -->
