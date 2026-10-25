---
title: "Acceptance Criteria: Phase 1: model-effort-atomic-replay"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "model effort atomic replay acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-model-effort-atomic-replay"
    last_updated_at: "2026-10-25T13:42:26Z"
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
# Acceptance Criteria: Phase 1: model-effort-atomic-replay

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/023-session-relaunch-loop/033-research-remediation/001-model-effort-atomic-replay
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
| AC-001 | REQ-001, REQ-004 | **Given** a launch with a non-empty model and effort `low` and a consumed record with a different model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the new model and no effort flag, in one table row per runtime: Claude (`claude-sonnet-5-5` to `claude-opus-5-5`, no `--effort`), Codex (no `-c model_reasoning_effort`) and Pi (no `--thinking`) | New table test in `skilled-loop.test.cjs`, red before the change, green after | Unmet | - |
| AC-002 | REQ-004 | **Given** the same launch and a record with the new model and effort `medium`, **When** it relaunches, **Then** Claude gets `--effort medium`, Codex `-c model_reasoning_effort="medium"` and Pi `--thinking medium` | Regression guard table across the three runtimes, green before and after the change | Unmet | - |
| AC-003 | REQ-002 | **Given** a record with live model equal to the launch model and no live effort, **When** it relaunches, **Then** the launch effort stands | Regression guard in `skilled-loop.test.cjs`, green before and after the change | Unmet | - |
| AC-004 | REQ-003 | **Given** an armed record with model A and effort high, **When** `armLocked` runs with settings `{ model: B }`, **Then** the written record has model B and no effort | `relaunch-core.test.cjs` test, red before the change, green after | Unmet | - |
| AC-005 | REQ-001, REQ-004, REQ-005 | **Given** a live Claude session launched through the wrapper as Sonnet low and switched to Opus medium, **When** it hops, **Then** the receiver process arguments show the Opus model and `--effort medium`, and a control hop whose record had its `effort` field removed relaunches on Opus with no `--effort`; Codex (`gpt-6-luna`) and Pi (`openai/gpt-6-luna`) hops recorded the same way | Harness run, receiver args and `relaunch.log` hop lines for the hop and the control saved under `scratch/` | Unmet | - |
| AC-006 | REQ-006 | **Given** a `/model` or `/effort` switch with no later assistant turn, **When** the transcript tail is read, **Then** the finding (entry and reader change, or documented limit) is in the implementation summary | Quoted transcript lines | Unmet | - |
| AC-007 | REQ-007 | **Given** a launch with no `--model` flag and `--effort low`, and a consumed record with a live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and the launch effort `low` | Regression guard in `skilled-loop.test.cjs`, green before and after the change | Unmet | - |
| AC-008 | REQ-008 | **Given** a Hermes launch with a model and `--reasoning high`, and a consumed record with a different live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and `--reasoning high` | Regression guard in `skilled-loop.test.cjs`, green before and after the change | Unmet | - |

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

Not yet closed. All eight criteria are Unmet until the builder records evidence.
<!-- /ANCHOR:closure -->
