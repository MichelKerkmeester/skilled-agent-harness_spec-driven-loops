---
title: "Acceptance Criteria: Phase 4: claude-window-unknown"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claude window unknown acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-claude-window-unknown"
    last_updated_at: "2026-11-12T08:28:56Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-claude-window-unknown"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: claude-window-unknown

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-claude-window-unknown
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude checkout with no `SESSION_RELAUNCH_WINDOW_TOKENS`, no `autoCompactWindow` and a model id without `[1m]`, When `resolveWindow` runs, Then it returns `null` | `node --test --test-name-pattern 'no setting and no model marker' .skilled/hooks/session-relaunch/tests/context-usage.test.cjs` exits 0 Observed 2026-11-12: `resolveWindow returns null when no setting and no model marker supplies a window` passes in `scratch/green.txt` and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:178` and `.skilled/hooks/session-relaunch/lib/context-usage.cjs:358`. | Met | - |
| AC-002 | REQ-002 | Given an unknown window and a transcript at 464,850 tokens, When the Claude `PostToolUse` nudge runs, Then it emits nothing and logs `context-nudge-skipped` with `reason=window-unknown` | `node --test --test-name-pattern 'window is unknown' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 Observed 2026-11-12: `context-nudge skips and logs when the window is unknown` passes in `scratch/green.txt` and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:94` and `.skilled/hooks/session-relaunch/claude/context-nudge.mjs:132`. | Met | - |
| AC-003 | REQ-003 | Given the two named test files, When `node --test` runs them together, Then both exit 0 with the unknown-window and skipped-nudge cases present | `node --test .skilled/hooks/session-relaunch/tests/context-usage.test.cjs .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 Observed 2026-11-12: both files exit 0 inside the 318-test run in `scratch/green.txt`, with both cases present. Source: `.skilled/hooks/session-relaunch/tests/context-usage.test.cjs:178` and `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:94`. | Met | - |
| AC-004 | REQ-004 | Given an unknown Claude window, When `/doctor:setup` runs, Then it prints a line naming `SESSION_RELAUNCH_WINDOW_TOKENS` or `autoCompactWindow` | With no window configured, `node .skilled/hooks/session-relaunch/bin/session-relaunch.cjs window` prints one line naming both settings, and `rg -c 'session-relaunch.cjs window' .skilled/commands/doctor/assets/doctor-setup.yaml` prints 1 Observed 2026-11-12: in an empty directory with an empty home the command printed one line naming `autoCompactWindow` and `SESSION_RELAUNCH_WINDOW_TOKENS` and exited 0, and the count command printed 1. Source: `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:870` and `.skilled/commands/doctor/assets/doctor-setup.yaml:59`. | Met | - |
| AC-005 | REQ-005 | Given the README switch table, When the `SESSION_RELAUNCH_WINDOW_TOKENS` row is read, Then it states that the value comes from the environment only | `rg -n 'SESSION_RELAUNCH_WINDOW_TOKENS' .skilled/hooks/session-relaunch/README.md` prints one row containing `environment only` Observed 2026-11-12: the command printed one row and it contains `environment only`. Source: `.skilled/hooks/session-relaunch/README.md:269`. | Met | - |
| AC-006 | REQ-006 | Given a session with no known window, When the Claude nudge runs twice for it and once for a second session, Then `relaunch.log` holds one `context-nudge-skipped` line per session | `node --test --test-name-pattern 'once per session' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 Observed 2026-11-12: `context-nudge logs the unknown window once per session` passes in `scratch/green.txt` and failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs:112` and `.skilled/hooks/session-relaunch/lib/nudge.cjs:684`. | Met | - |
| AC-007 | REQ-007 | Given the `window` command, When it is run with an argument, Then it exits 2 with usage and prints nothing on stdout, and without a configured window its line reads `none configured` | `node --test --test-name-pattern 'window rejects an argument' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0 Observed 2026-11-12: `window rejects an argument` passes in `scratch/green.txt` and failed before the fix in `scratch/red-2.txt`, and the command printed the `none configured` line. Source: `.skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs:216` and `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs:871`. | Met | - |

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

All seven criteria are Met with observed evidence from `scratch/green.txt`, `scratch/green-full.txt` and `scratch/green-opencode.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
