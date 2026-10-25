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
    last_updated_by: "claude-opus"
    recent_action: "Marked every criterion Met with evidence"
    next_safe_action: "Commit the phase with its tests"
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
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | **Given** a seed built by the core for a note path and spec folder, **When** the parser reads it, **Then** it returns the same path and folder, including the `none` Skip form | `relaunch-core.test.cjs` round-trip test, red before. Evidence: `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:2357`. `relaunch-core.test.cjs` "claim seed parser inverts the seed suffix": three paths (one holding the marker text) by valid folder, `none` and empty all round-trip; red before with `TypeError: parseClaimSeed is not a function` (`scratch/evidence/red-core.txt`), green after (`final-node.txt`) | Met | - |
| AC-002 | REQ-003 | **Given** a manual Pi, OpenCode, Codex, Devin or Cursor first launch with a seed for an open note holding a packet, **When** the runtime starts, **Then** its environment holds `SESSION_RELAUNCH_GOAL_PACKET=<packet>` | Table test with a stub runtime. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:3110`. `skilled-loop.test.cjs` "manual first launch with a claim seed exports the note goal packet": Pi, OpenCode `--prompt`, Codex, Devin `--` and Cursor each record `SESSION_RELAUNCH_GOAL_PACKET=specs/hooks/023-session-relaunch-loop` with their other arguments unchanged; red before on the empty packet (`red-wrapper.txt`), green after | Met | - |
| AC-003 | REQ-003 | **Given** the same on Hermes and Claude, **When** they start, **Then** Hermes has `HERMES_SPEC_FOLDER=<packet>`, and on Claude with a renderable slice the seed element is replaced by `/goal <slice>`, `SKILLED_LOOP_CLAIM_SEED` holds the seed and every other operator argument is kept in place | One `skilled-loop.test.cjs` test per seed position (at least Claude positional and one flag form: OpenCode `--prompt`, Hermes `-q` or Devin `--`) plus one with `--standalone` prepended. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:3129`, `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:3140`, `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:3152`. "a seeded Claude first launch starts on the goal command with the seed in place" (positional between `--model opus` and `--name Work`), "a seeded Hermes first launch after -q binds the packet as its spec folder" (flag form, operator `HERMES_SPEC_FOLDER` replaced), "a seeded OpenCode 2 first launch finds the seed after the prepended --standalone"; each red before (`red-wrapper.txt`) and green after. A Claude launch with no sendable slice keeps the seed and exports the packet | Met | - |
| AC-004 | REQ-004 | **Given** a seed for a claimed note or a note outside the repo, **When** the launch starts, **Then** no packet is exported | Test. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:3174`. "manual first launch ignores a seed for a claimed or outside note": claimed, missing, symlinked-outside and lost-goal.md notes on Claude and Hermes, plus the switch off and a note outside the handoffs directory, export nothing and keep the seed. It fails when the open-state or containment guard is removed (`scratch/evidence/negative-control-open-state.txt`, `negative-control-containment.txt`) | Met | - |
| AC-005 | REQ-005 | **Given** an outer `SESSION_RELAUNCH_GOAL_PACKET` and no seed, **When** the wrapper launches, **Then** the inherited test passes unchanged | Test run. Evidence: `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:2883`. "wrapper drops a goal packet inherited from an outer session on every launch" passes in `final-node.txt`; its body is not in this change's diff | Met | - |
| AC-006 | REQ-002 | **Given** the change is built, **When** the CLI is searched, **Then** `usableGoalPacket` is exported from `relaunch-core.cjs` and `session-relaunch.cjs` defines no copy | `rg -n "function usableGoalPacket" .skilled/hooks/session-relaunch`. Evidence: `rg -n "function usableGoalPacket" .skilled/hooks/session-relaunch` returns only `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs:472`; the core exports it and the CLI calls `core.usableGoalPacket` (`scratch/evidence/inventories.txt`) | Met | - |

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

Every criterion is Met with observed evidence: the full node suite passes 915 of 915 and the Pi vitest suite 59 of 59, and each new test was seen to fail before the change or under a removed guard.
<!-- /ANCHOR:closure -->
