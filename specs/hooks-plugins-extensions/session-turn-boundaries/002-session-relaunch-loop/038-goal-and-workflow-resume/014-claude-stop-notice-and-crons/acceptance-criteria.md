---
title: "Acceptance Criteria: Phase 14: claude-stop-notice-and-crons"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "claude stop notice and crons acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/014-claude-stop-notice-and-crons"
    last_updated_at: "2026-11-13T12:00:00Z"
    last_updated_by: "planner"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Run T001, the live cron check, once the operator gives the go-ahead"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-claude-stop-notice-and-crons"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 14: claude-stop-notice-and-crons

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 014-claude-stop-notice-and-crons
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a Claude sender under `skilled-loop` in a throwaway checkout that made one task with `/loop 10m echo ping`, When it hops, Then the receiver lists no scheduled task and the saved Stop payload shows the `session_crons` entry, and the file records whether the sender's todo list reached the receiver | `rg -n 'session_crons\|sender tasks\|receiver tasks' scratch/live-crons.txt` prints the entry, a sender list with one task and a receiver list with none, and `rg -c 'todo list' scratch/live-crons.txt` prints at least 1. Blocked: the live hop was not run by this build and `scratch/live-crons.txt` marks it pending for the orchestrator Observed live on 2026-11-13 on Claude Code 2.1.323 by an Opus sub-agent for the orchestrator: the sender listed one cron, its Stop payload carried it in `session_crons`, and the receiver listed none and no todo list (`scratch/live-crons.txt`). | Met | - |
| AC-002 | REQ-002 | Given a Claude Stop hook that prints `{"systemMessage": "..."}` and exits 0, When the turn ends, Then the operator sees the text and the turn does not continue | `rg -n 'systemMessage' scratch/live-crons.txt` prints the quoted hook documentation line or the recorded screen text. Met 2026-11-13 from https://code.claude.com/docs/en/hooks: `systemMessage` is a universal field shown to the user, and a Stop continues only when it returns `decision: "block"` | Met | - |
| AC-003 | REQ-003 | Given a pending record and a Stop payload with one background task, When `stop-arm.mjs` runs, Then stdout is one JSON line whose `systemMessage` names `1 background task` and `session-relaunch.cjs cancel`, with no `decision` key, and the record gains only `deferredAt` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm defers pending state' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` holds its earlier exit 1. Observed: pass 1, fail 0, exit 0; the red entry failed on the empty stdout with exit 1 | Met | - |
| AC-004 | REQ-004 | Given an armable record and a Stop payload with two `session_crons` entries, When `stop-arm.mjs` runs, Then `relaunch.log` holds one `session-crons` line with `crons=2` | `env -u AI_SESSION_CHILD node --test --test-name-pattern 'stop-arm logs the cron count' .skilled/hooks/session-relaunch/tests/claude-adapters.test.cjs` exits 0 with `fail 0`, and `scratch/red.txt` holds its earlier exit 1. Observed: pass 1, fail 0, exit 0; the red entry failed because no `relaunch.log` existed, exit 1 | Met | - |
| AC-005 | REQ-005 | Given the edited adapter, When the whole relaunch suite runs, Then the arm, disabled, armed-deferral and conformance tests keep their assertions and pass | `env -u AI_SESSION_CHILD node --test .skilled/hooks/session-relaunch/tests/*.test.cjs` exits 0 with `fail 0`. Observed: tests 915, pass 915, fail 0 against the 914-test baseline at T010; final-state rerun 921 pass, fail 0 after a concurrent builder added six tests | Met | - |

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

Every row is Met. The live Claude hop that held AC-001 open ran after the build and is recorded in `scratch/live-crons.txt`.
<!-- /ANCHOR:closure -->
