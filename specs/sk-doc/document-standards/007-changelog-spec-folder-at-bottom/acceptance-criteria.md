---
title: "Acceptance Criteria: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "changelog spec folder at bottom acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/document-standards/007-changelog-spec-folder-at-bottom"
    last_updated_at: "2026-11-17T08:22:21Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "None, packet complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-changelog-spec-folder-at-bottom"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Move the changelog spec-folder blockquote from under the summary to the end of the entry in the template and in every existing changelog

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-changelog-spec-folder-at-bottom`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-17
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 2,815 listed changelogs, When the migration dry run runs, Then it reports every single-block file as already last | `move_spec_block.py changelog-files.txt` printed `{'already last': 2796, 'spec lines': 19}` | Met | - |
| AC-002 | REQ-002 | Given a migrated changelog, When its lines are compared with the original, Then only the blockquote and its spacing moved | Line-multiset check on all 19 Hy4 outputs passed, and the script edits only the block and one blank line | Met | - |
| AC-003 | REQ-003 | Given the template, When a writer copies either shape, Then the spec-folder line comes last | `changelog-template.md` puts the line after `## Upgrade` and after `## Upgrade Notes`, and `validate_document.py` reports 0 issues | Met | - |
| AC-004 | REQ-004 | Given a multi-block file, When Hy4 has moved its blocks, Then each block ends its own dated section or the file | The placement check passed 18 of 19, and file 11 was corrected by hand to end the file | Met | - |
| AC-005 | REQ-005 | Given the 1,181 `.skilled` changelogs, When both gates rerun, Then each file gets its baseline result | `diff before.txt after.txt` printed nothing: 264 pass both, 917 fail only the shape gate, before and after | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Every criterion is met with observed evidence, so nothing blocks closure.
<!-- /ANCHOR:closure -->
