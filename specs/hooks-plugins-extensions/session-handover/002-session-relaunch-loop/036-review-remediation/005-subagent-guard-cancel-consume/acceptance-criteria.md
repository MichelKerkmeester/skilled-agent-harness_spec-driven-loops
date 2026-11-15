---
title: "Acceptance Criteria: Phase 5: subagent-guard-cancel-consume"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "subagent guard cancel consume acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-subagent-guard-cancel-consume"
    last_updated_at: "2026-11-12T08:28:57Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-subagent-guard-cancel-consume"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: subagent-guard-cancel-consume

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 005-subagent-guard-cancel-consume
**Level:** 2
**Status:** Complete
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude sub-agent that carries an `agent_id`, When it runs `session-relaunch.cjs cancel`, Then the guard emits a `PreToolUse` deny envelope and the denial names the parent hand-off | `node --test --test-name-pattern 'denies cancel' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 Observed 2026-11-12: `subagent-guard denies cancel from a sub-agent` passes in `scratch/green.txt` and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:156` and `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18`. | Met | - |
| AC-002 | REQ-002 | Given a Claude sub-agent that carries an `agent_id`, When it runs `session-relaunch.cjs consume`, Then the guard emits a `PreToolUse` deny envelope and the denial names the parent hand-off | `node --test --test-name-pattern 'denies consume' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 Observed 2026-11-12: `subagent-guard denies consume from a sub-agent` passes in `scratch/green.txt` and failed before the fix in `scratch/red.txt`. Source: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:164` and `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18`. | Met | - |
| AC-003 | REQ-003 | Given the guard suite, When `node --test` runs the file, Then all cases exit 0, including the four existing denied commands and the two new ones | `node --test .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 Observed 2026-11-12: the file ran 14 tests with 14 pass and 0 fail, exit 0, in `scratch/green.txt`. Source: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:156` and `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:57`. | Met | - |
| AC-004 | REQ-004 | Given a sub-agent running `history`, an unrelated command or a non-Bash tool, and a main-session call with no `agent_id`, When the guard runs, Then it stays silent and exits 0 | `node --test --test-name-pattern 'stays silent' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 Observed 2026-11-12: the pattern ran 7 cases with 7 pass and 0 fail, exit 0. Source: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:180` and `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:57`. | Met | - |
| AC-005 | REQ-005 | Given a Claude sub-agent that carries an `agent_id`, When it runs `session-relaunch.cjs hand-over`, Then the guard emits a `PreToolUse` deny envelope | `node --test --test-name-pattern 'denies hand-over' .skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs` exits 0 Observed 2026-11-12: `subagent-guard denies hand-over from a sub-agent` passes in `scratch/green.txt` and failed before the fix in `scratch/red-2.txt`. Source: `.skilled/hooks/session-relaunch/tests/subagent-guard.test.cjs:172` and `.skilled/hooks/session-relaunch/claude/subagent-guard.mjs:18`. | Met | - |

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

All five criteria are Met with observed evidence from `scratch/green.txt` and `scratch/green-full.txt`. The evidence is pinned to the diff range `5dafa313e8..working tree`, because nothing is committed without the operator.
<!-- /ANCHOR:closure -->
