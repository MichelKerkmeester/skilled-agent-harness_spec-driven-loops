---
title: "Acceptance Criteria: Claude Code session handover on by default and v4.0.2.1 release notes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claude default on release notes acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-relaunch-loop/040-claude-default-on-release-notes"
    last_updated_at: "2026-11-14T19:45:31Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-claude-default-on-release-notes"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Claude Code session handover on by default and v4.0.2.1 release notes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 040-claude-default-on-release-notes
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given no relaunch switch, When `hookFlagDecision` runs for each runtime, Then Claude is enabled with reason `default` and the other five are disabled | The Measured Behavior command printed `claude {"enabled":true,"key":null,"reason":"default"}` and `"enabled":false` for codex, pi, opencode, cursor and devin | Met | - |
| AC-002 | REQ-002 | Given a set switch, When it is `0` globally or for Claude, or a kill or master switch is set, Then Claude is off | `hook-flags.test.cjs` test "Claude Code is the one runtime where session-relaunch is on with no switch set" passes, 29 of 29, and failed before the resolver change (2 of 29 failed) | Met | - |
| AC-003 | REQ-003 | Given the parity table, When `hook_enabled` and the `.cjs`, `.mjs` and `.ts` readers answer each row, Then all agree | Parity test "a per-runtime enable flag answers before the global one in every reader" passes with the four new rows | Met | - |
| AC-004 | REQ-001 | Given no switch, When a Claude session crosses the threshold or prepares under the loop, Then it nudges and arms | The two new adapter and CLI tests pass on the new resolver and both failed on the old one | Met | - |
| AC-005 | REQ-004 | Given the v4.0.2.1 entry, When its Session Handover section is read, Then it covers the Claude default and the packet 036 to 039 changes in the existing style | `check_changelog_shape.py` PASS at 280 lines and 30 H4 items, `hvr_scan.py` 0 hard blockers, `validate_document.py` VALID | Met | - |
| AC-006 | REQ-005 | Given the doc surfaces in scope, When grepped for `ships off` with relaunch, Then no line says Claude Code ships off | The rescan lists only the dotenv template, out of scope, and the two OpenCode docs, which describe OpenCode | Met | - |
| AC-007 | REQ-001 | Given the final tree, When the relaunch, plugin, resolver, goal and Pi suites run, Then none fails | 1,556, 29, 200 and 62 passed with 0 failed, and both runtime mirror sync checks print PASS | Met | - |

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

Every criterion is met by a command run on the final tree.
<!-- /ANCHOR:closure -->
