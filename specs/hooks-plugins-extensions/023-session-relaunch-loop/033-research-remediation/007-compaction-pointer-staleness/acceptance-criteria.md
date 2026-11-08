---
title: "Acceptance Criteria: Phase 7: compaction-pointer-staleness"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "compaction pointer staleness acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/007-compaction-pointer-staleness"
    last_updated_at: "2026-10-25T13:42:34Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 7: compaction-pointer-staleness

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/007-compaction-pointer-staleness
**Level:** 2
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given a note with `created_at: 2026-10-25T10:00:00Z`, When `seedText` runs with `afterCompaction: true`, Then the text holds that timestamp, `git log --since=2026-10-25T10:00:00Z` and `git status` | `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:383` "after-compaction pointer names the note created_at and the git checks": red before (AssertionError), green after; node suite exit 0. The date is shell-quoted, so the text reads `git log --since='2026-10-25T10:00:00Z'` | Met | - |
| AC-002 | REQ-003 | Given each runtime's compaction path with that note, When it sends the pointer, Then the sent text holds the timestamp | "compaction pointer carries the note date" at `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:1267`, `.opencode/plugins/tests/session-relaunch.test.cjs:1473` and `.skilled/hooks/session-relaunch/pi/session-relaunch.test.ts:1127`: each red before, green after; node exit 0, vitest exit 0 | Met | - |
| AC-003 | REQ-004 | Given `afterCompaction` false, When `seedText` runs, Then existing seed tests pass unedited | Only the after-compaction branch at `.skilled/hooks/session-relaunch/lib/nudge.cjs:243` changed and no existing seed test was edited; node 896/896 pass, vitest 59/59 pass; relaunch text compared with HEAD `nudge.cjs` over 24 rows, 0 byte differences | Met | - |
| AC-004 | REQ-005 | Given a note with no `created_at`, When the pointer builds, Then it holds the git step and no `undefined` | `.skilled/hooks/session-relaunch/tests/nudge.test.cjs:410` "after-compaction pointer without a note date keeps the undated git step" covers missing, empty and null: holds `git log` and `git status`, no `undefined` or `null`; node exit 0 | Met | - |

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

All four criteria are Met with observed test evidence.
<!-- /ANCHOR:closure -->
