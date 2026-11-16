---
title: "Acceptance Criteria: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "handover doc alignment 2 acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/050-handover-doc-alignment-2"
    last_updated_at: "2026-11-16T11:35:33Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-050-handover-doc-alignment-2"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Hand-over doc alignment, second pass: fix the 50 findings of the full 86-doc check

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 050-handover-doc-alignment-2
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 50 findings, When the fix briefs ran, Then each is fixed or shown gone by the code | G1 to G5 lanes `ok`, 24 docs changed; L6-1 to L6-5 already gone after main's README rewrite (`grep` prints 0 matches), confirmed by the Opus review, which found all 50 addressed | Met | - |
| AC-002 | REQ-002 | Given the four P0 commands, When a reader runs them as written, Then they match the code | The reviewer ran the CL-6 and CX-4 probes in a sandbox, eleven `PASS:` lines each and no `FAIL:`; `opencode --help` 2.3.0 lists no `-m` and the quick start no longer passes one; the README build step is gone with its section | Met | - |
| AC-003 | REQ-003 | Given the full change, When a fresh Opus medium agent reviewed it against the code, Then no P0 or P1 remains | Review found no P0 or P1 and 7 P2, all applied in `10ec30a0f97` with the text the review quoted | Met | - |
| AC-004 | REQ-004 | Given the worktree diff against main, When it is listed, Then only scoped files change | `git diff --stat origin/main...HEAD` lists the hand-over docs and this packet, no code | Met | - |

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

Every criterion is Met with observed evidence.
<!-- /ANCHOR:closure -->
