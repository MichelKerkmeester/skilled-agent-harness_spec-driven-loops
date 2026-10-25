---
title: "Acceptance Criteria: Phase 31: relaunch-model-and-effort"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "relaunch model and effort acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/031-relaunch-model-and-effort"
    last_updated_at: "2026-10-25T07:25:53Z"
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
# Acceptance Criteria: Phase 31: relaunch-model-and-effort

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/031-relaunch-model-and-effort
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a first launch with an effort flag, When the wrapper relaunches, Then the flag is replayed in that runtime's syntax on Claude, Codex, Pi and Hermes | Six `relaunch replays the launch effort` cases in `skilled-loop.test.cjs`, red before the change | Met | - |
| AC-002 | REQ-001 | Given a level outside the runtime's list, When the wrapper relaunches, Then the flag is left out with a warning and the relaunch goes ahead | `relaunch drops a launch effort its runtime would reject` | Met | - |
| AC-003 | REQ-002 | Given a launch model on any runtime with a model flag, When the wrapper relaunches, Then the model is kept as before, Cursor's brackets included | The existing per-runtime model cases stay green in the 861-test gate | Met | - |
| AC-004 | REQ-003 | Given a Claude or Codex sender, When it prepares, Then the record holds the latest main-chain model and effort and `consume` reports them | Four CLI cases plus the consume case | Met | - |
| AC-005 | REQ-003 | Given live values on the record, When the wrapper relaunches, Then they beat the launch values, a rejected value falls back, and the used value carries to a later hop | Four wrapper cases, Pi provider case included | Met | - |
| AC-006 | REQ-003 | Given a Pi sender, When its extension arms, Then the record holds the session model, provider and thinking level | Two Pi vitest cases; Pi typecheck exit 0 | Met | - |
| AC-007 | REQ-004 | Given the README, When read, Then each runtime says what a receiver starts on and where the carry stops | README section Model And Effort Across A Hop | Met | - |
| AC-008 | REQ-005 | Given a live Claude hop launched with `--model claude-sonnet-5-5 --effort low`, When it hops, Then the receiver runs on that model and effort | `scratch/claude-effort-live/summary.txt` and `transcript-settings.txt` | Met | - |
| AC-009 | REQ-005 | Given a live Codex hop launched with `-c model_reasoning_effort="low"`, When it hops, Then the receiver runs on `gpt-6-luna` at `low` | `scratch/codex-effort-live/summary.txt` | Met | - |
| AC-010 | REQ-005 | Given a live Pi hop launched with `--thinking low`, When it hops, Then the receiver starts from the record's live provider, model and level | `scratch/pi-effort-live/summary.txt` and `transcript-settings.txt`: the armed record held `openai`, `gpt-6-luna` and `low`, and the receiver ran on them, where Pi's defaults are `llmgateway`, `deepseek-v4.1-flash-1017` and `max` | Met | - |
| AC-011 | REQ-005 | Given Hermes and Cursor, When a live hop is attempted, Then it runs or is recorded as a skip with its reason | Not run: Hermes returned HTTP 402 and Cursor was not logged in during the earlier phases, and neither was retried | Unmet | - |

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

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
