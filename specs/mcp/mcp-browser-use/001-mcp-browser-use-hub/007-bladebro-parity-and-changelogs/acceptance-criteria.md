---
title: "Acceptance Criteria: Phase 7: bladebro-parity-and-changelogs"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "bladebro parity and changelogs acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp/mcp-browser-use/001-mcp-browser-use-hub/007-bladebro-parity-and-changelogs"
    last_updated_at: "2026-11-22T07:02:51Z"
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion with its evidence"
    next_safe_action: "Operator review, then commit on instruction"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-bladebro-parity-and-changelogs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: bladebro-parity-and-changelogs

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-bladebro-parity-and-changelogs`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-22
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the manifest row, When the mutation guard runs, Then both Bladebro scripts pass and the doctor calls no registry | `check-mcp-mutation-class.sh` printed `GUARD PASS` with 23 scripts. Its tests printed `51 passed, 0 failed`. Every `bladebro` call runs with `BLADE_NO_UPDATE_CHECK=1` | Met | - |
| AC-002 | REQ-001 | Given Bladebro installed, When `scripts/doctor.sh` runs, Then it exits 0, lists five tools and leaves no process | exit 0, `tools/list: act, see, state, run, vision`, `pgrep -fl bladebro` exit 1 | Met | - |
| AC-003 | REQ-002 | Given the changelog tree, When the coverage check walks it, Then every skill changelog resolves and none dangles | `58 changelog dirs, 58 covered, 0 uncovered`. The dangling-link `find` printed nothing | Met | - |
| AC-004 | REQ-003 | Given the hub edits, When the per-hub gates run, Then both pass | `parent-skill-check.cjs .skilled/skills/mcp-browser-use` exit 0 `OK`; `compiled-route-guard.cjs` exit 0, `mcp-browser-use fresh` after one re-mint | Met | - |
| AC-005 | REQ-004 | Given four new entries and the extended advisor v2.0.0.0 entry, When the shape check runs, Then each passes and each `SKILL.md` version matches | `check_changelog_shape.py` exit 0 on all five files. Parent-skill check `13b-version` and `13d-packet-version` PASS | Met | - |
| AC-006 | REQ-005 | Given the two mode playbooks, When the reports are mapped to scenario ids, Then each scenario has a verdict or is named as needing a yes | Chrome DevTools 30 of 30 recorded. Aside 16 of 29 recorded, with ASD-004, 005, 007, 010, 012, 013 and 015 to 021 named in the close-out as needing a yes | Met | - |
| AC-007 | REQ-006 | Given the new docs, When `validate_document.py` runs, Then each reports 0 issues | 0 issues on `INSTALL-GUIDE.md`, `scripts/README.md` and `assets/utcp-bladebro-manual.md` | Met | - |

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

Every criterion is met, and the operator decides whether the 13 Aside scenarios that need a yes run in a later packet.
<!-- /ANCHOR:closure -->
