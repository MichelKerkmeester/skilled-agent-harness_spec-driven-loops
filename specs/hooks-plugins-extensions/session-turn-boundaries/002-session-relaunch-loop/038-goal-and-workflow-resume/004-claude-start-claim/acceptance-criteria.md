---
title: "Acceptance Criteria: Phase 4: claude-start-claim"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claude start claim acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-claude-start-claim"
    last_updated_at: "2026-11-12T22:42:04Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-claude-start-claim"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: claude-start-claim

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 004-claude-start-claim
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
| AC-001 | REQ-001 | Given `SYSTEM_SESSION_RELAUNCH_ENABLED=1`, `SYSTEM_SESSION_RELAUNCH_CLAUDE_ENABLED=0`, a valid `SKILLED_LOOP_CLAIM_SEED` and a `startup` payload, When `compact-pointer.mjs` runs, Then it exits 0 and the SessionStart `additionalContext` holds the seed, the claim command for the note and the `/speckit:resume` line, and the log holds `goal-start-claim` | `node --test --test-name-pattern 'Claude enable switch off' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Unmet | - |
| AC-002 | REQ-002 | Given the existing claim scenarios (no seed, a source other than `startup`, a bad seed, `AI_SESSION_CHILD=1`, `SESSION_RELAUNCH_GOAL=0`, `SYSTEM_SESSION_RELAUNCH_DISABLED=1` and a loop shell), When the `compact-pointer` tests run, Then the hostile cases exit 0 with empty stdout and the existing start-claim case still delivers its claim | `node --test --test-name-pattern 'compact-pointer' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` | Unmet | - |

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

AC-001 and AC-002 are unmet. AC-001 carries the concern-off claim and AC-002 carries the guards.
<!-- /ANCHOR:closure -->
