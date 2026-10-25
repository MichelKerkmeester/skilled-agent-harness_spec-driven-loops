---
title: "Acceptance Criteria: Phase 4: manual-claim-goal-binding"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "manual claim goal binding acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-manual-claim-goal-binding"
    last_updated_at: "2026-10-25T13:42:30Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 4: manual-claim-goal-binding

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/004-manual-claim-goal-binding
**Level:** 2
**Status:** Draft
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | **Given** a seed built by the core for a note path and spec folder, **When** the parser reads it, **Then** it returns the same path and folder, including the `none` Skip form | `relaunch-core.test.cjs` round-trip test, red before. Evidence: | Unmet | - |
| AC-002 | REQ-003 | **Given** a manual Pi, OpenCode, Codex, Devin or Cursor first launch with a seed for an open note holding a packet, **When** the runtime starts, **Then** its environment holds `SESSION_RELAUNCH_GOAL_PACKET=<packet>` | Table test with a stub runtime. Evidence: | Unmet | - |
| AC-003 | REQ-003 | **Given** the same on Hermes and Claude, **When** they start, **Then** Hermes has `HERMES_SPEC_FOLDER=<packet>`, and on Claude with a renderable slice the seed element is replaced by `/goal <slice>`, `SKILLED_LOOP_CLAIM_SEED` holds the seed and every other operator argument is kept in place | One `skilled-loop.test.cjs` test per seed position (at least Claude positional and one flag form: OpenCode `--prompt`, Hermes `-q` or Devin `--`) plus one with `--standalone` prepended. Evidence: | Unmet | - |
| AC-004 | REQ-004 | **Given** a seed for a claimed note or a note outside the repo, **When** the launch starts, **Then** no packet is exported | Test. Evidence: | Unmet | - |
| AC-005 | REQ-005 | **Given** an outer `SESSION_RELAUNCH_GOAL_PACKET` and no seed, **When** the wrapper launches, **Then** the inherited test passes unchanged | Test run. Evidence: | Unmet | - |
| AC-006 | REQ-002 | **Given** the change is built, **When** the CLI is searched, **Then** `usableGoalPacket` is exported from `relaunch-core.cjs` and `session-relaunch.cjs` defines no copy | `rg -n "function usableGoalPacket" .skilled/hooks/session-relaunch`. Evidence: | Unmet | - |

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

Written when the packet closes.
<!-- /ANCHOR:closure -->
