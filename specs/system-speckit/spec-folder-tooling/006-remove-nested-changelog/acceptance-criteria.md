---
title: "Acceptance Criteria: Remove the unused nested spec changelog generator, templates and docs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "remove nested changelog acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-folder-tooling/006-remove-nested-changelog"
    last_updated_at: "2026-11-15T10:20:00Z"
    last_updated_by: "claude"
    recent_action: "Marked every criterion Met with cited evidence"
    next_safe_action: "Commit the removal"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-remove-nested-changelog"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Remove the unused nested spec changelog generator, templates and docs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `006-remove-nested-changelog`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the removal, When the REQ-001 search runs over `.skilled`, Then it lists only the sk-create-changelog refusal text | `scratch/after.txt:32` and `scratch/after.txt:33` list two history files only: the released note `v3+/v3.2.1.0.md`, which the `**/changelog/v*` glob misses, and one old line in a recorded measurement log. No live doc or code names the generator. The refusal text says "nested changelog", which this search does not match. | Met | - |
| AC-002 | REQ-002 | Given the rebuilt CLI, When the vitest `cli` project runs, Then it passes with the baseline count minus the 13 deleted tests | `scratch/after.txt:29` shows 2598 passed of 2620. `scratch/baseline.txt:8` shows 2611 of 2633. The same two failures are at `scratch/after.txt:26` and `scratch/after.txt:27`. | Met | - |
| AC-003 | REQ-003 | Given the kept packet changelogs, When the REQ-003 `find` runs, Then it prints 1410 | `scratch/after.txt:23` prints 1410, as in `scratch/baseline.txt:24`. | Met | - |
| AC-004 | REQ-004 | Given the removed leaf, When `check-card-sync.sh` and `tests/card-sync.vitest.ts` run, Then they pass | `scratch/after.txt:35` prints CARD SYNC OK. `card-sync.vitest.ts` passes in the full run at `scratch/after.txt:29`. | Met | - |
| AC-005 | REQ-005 | Given a nested changelog request, When sk-create-changelog routes it, Then the `packet_local` route still refuses it and offers a global entry | `.skilled/skills/sk-doc/sk-create-changelog/ROUTER.md:34` and `.skilled/skills/sk-doc/sk-create-changelog/ROUTER.md:73` carry `packet_local`. The compiled route sends a nested changelog prompt to sk-create-changelog. | Met | - |
| AC-006 | REQ-006 | Given the release entries, When they are checked, Then `check_changelog_shape.py` passes and `hvr_scan.py` finds 0 hard blockers | `scratch/after.txt:37`, `scratch/after.txt:38` and `scratch/after.txt:39` show shape exit 0 and 0 hard blockers for each entry. | Met | - |

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

Yes. Every criterion is met with observed evidence.
<!-- /ANCHOR:closure -->
