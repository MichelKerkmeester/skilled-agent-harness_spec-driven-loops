---
title: "Acceptance Criteria: Phase 1: workflow-reentry-seed"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "workflow reentry seed acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-workflow-reentry-seed"
    last_updated_at: "2026-11-12T22:42:01Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-workflow-reentry-seed"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 1: workflow-reentry-seed

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 001-workflow-reentry-seed
**Level:** 2
**Status:** Draft
**Date:** 2026-11-12
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `handoffText` for any runtime, When it builds the sender text, Then it asks for an `Active command:` line under `## In-flight state` and says to write `none` when no command runs. | `node --test --test-name-pattern 'active command line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its case asserts both the named and the `none` form. | Unmet | - |
| AC-002 | REQ-002 | Given a session inside the loop that holds a deep-loop lock, When `handoffText` builds the sender text, Then it carries a step before prepare that runs `loop-lock.cjs release --lock-path <path> --owner-pid <pid> --nonce <nonce>` with the captured values. | `node --test --test-name-pattern 'deep-loop lock before prepare' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its case asserts the release command and its three values. | Unmet | - |
| AC-003 | REQ-003 | Given a note with an `Active command:` line, When `seedText` builds the receiver text, Then it has a step to run that command again with the same mode and arguments and says the command's own state detection picks the step. | `node --test --test-name-pattern 'runs the active command again' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its case asserts the re-run wording and the state-detection sentence. | Unmet | - |
| AC-004 | REQ-004 | Given a bound spec folder that holds a `goal.md`, When `seedText` builds the receiver text, Then it has a step that reads that `goal.md` before the Remaining work step. | `node --test --test-name-pattern 'reads the spec folder goal' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its case asserts the goal step sits before the continue step. | Unmet | - |
| AC-005 | REQ-005 | Given `runtime === 'codex'`, When `handoffText` builds the sender text, Then it asks for an `Active goal:` line, and `seedText` has a step that brings the goal back with `create_goal`. | `node --test --test-name-pattern 'active goal line' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and its case asserts both the sender line and the receiver `create_goal` step. | Unmet | - |
| AC-006 | REQ-006 | Given the manual command path, When a reader opens `.skilled/commands/speckit/handoff.md`, Then the note shape and the receiver steps name the active command, the lock release, the `goal.md` read and the Codex `Active goal:` line. | `rg -n -e 'Active command' -e 'Active goal' -e 'goal\.md' -e 'release --owner-pid' .skilled/commands/speckit/handoff.md` prints at least one line for each term and the file names no different step order. | Unmet | - |
| AC-007 | REQ-007 | Given the change is in place, When the note shape case and the claim case run, Then the four sections and the prepare command still build and `claim` still prints the note body. | `node --test --test-name-pattern 'all four sections and prepare command' .skilled/hooks/session-relaunch/tests/nudge.test.cjs` exits 0 and `node --test --test-name-pattern 'claim exits zero and prints the claimed note body' .skilled/hooks/session-relaunch/tests/session-relaunch-cli.test.cjs` exits 0. | Unmet | - |

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

**Closeable:** No

Every criterion is unmet because this is a planning-only packet.
<!-- /ANCHOR:closure -->
