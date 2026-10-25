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
    last_updated_by: "builder-001"
    recent_action: "Recorded the live Opus medium hop; all eight criteria Met"
    next_safe_action: "None; phase closed"
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
**Status:** Complete
**Date:** 2026-10-25
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-004 | **Given** a launch with a non-empty model and effort `low` and a consumed record with a different model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the new model and no effort flag, in one table row per runtime: Claude (`claude-sonnet-5-5` to `claude-opus-5-5`, no `--effort`), Codex (no `-c model_reasoning_effort`) and Pi (no `--thinking`) | `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1382`. `a live model with no live effort drops the launch effort`, one test each for claude, codex and pi. Red before: 3 fail with the launch `low` still in the arguments (`scratch/test/red-before.txt`). Green after (`scratch/test/green-after.txt`) | Met | - |
| AC-002 | REQ-004 | **Given** the same launch and a record with the new model and effort `medium`, **When** it relaunches, **Then** Claude gets `--effort medium`, Codex `-c model_reasoning_effort="medium"` and Pi `--thinking medium` | `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1396`. `a live model with its live effort renders that effort`, one test each for claude, codex and pi, pass before and after (`scratch/test/red-before.txt`, `scratch/test/green-after.txt`) | Met | - |
| AC-003 | REQ-002 | **Given** a record with live model equal to the launch model and no live effort, **When** it relaunches, **Then** the launch effort stands | `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1413`. `a live model equal to the launch model keeps the launch effort`, pass before and after | Met | - |
| AC-004 | REQ-003 | **Given** an armed record with model A and effort high, **When** `armLocked` runs with settings `{ model: B }`, **Then** the written record has model B and no effort | `.skilled/hooks/session-relaunch/tests/relaunch-core.test.cjs:671`. `arm with a new model and no effort clears the recorded effort`. Red before: `true !== false` on the `effort` field. Green after | Met | - |
| AC-005 | REQ-001, REQ-004, REQ-005 | **Given** a live Claude session launched through the wrapper as Sonnet low and switched to Opus medium, **When** it hops, **Then** the receiver process arguments show the Opus model and `--effort medium`, and a control hop whose record had its `effort` field removed relaunches on Opus with no `--effort`; Codex (`gpt-6-luna`) and Pi (`openai/gpt-6-luna`) hops recorded the same way | `scratch/claude-hop-medium/processes-receiver.txt:1`: the receiver, a child of wrapper pid 58459, runs `claude --model claude-opus-5-5 --effort medium`. The sender launched `--model claude-sonnet-5-5 --effort low`, then `/model claude-opus-5-5` (confirm dialog answered) and `/effort medium`; the record at relaunch held model `claude-opus-5-5`, effort `medium` (`scratch/claude-hop-medium/summary.txt`). Hop line `relaunch loopId=58459 reason=ready` (`scratch/claude-hop-medium/relaunch.log:4`), note `status: done`. Run under the operator's real config with `~/.claude/settings.json` restored afterwards to shasum `9ffe4047f7516b5691164fd39a54e8e1688b129a`, identical to the pre-run backup. Control: `claude --model claude-opus-5-5` with no `--effort` (`scratch/claude-control/processes-receiver.txt:1`). Codex hop `-m gpt-6-luna -c model_reasoning_effort="medium"`, control `-m gpt-6-luna` (record-edited switch, `scratch/codex-*`). Pi hop `gpt-6-luna` thinking `off`, control thinking `max` default (`scratch/pi-*/transcript-settings.txt`). Earlier attempts kept for the record: `scratch/claude-hop/` (no `/effort`), `scratch/claude-hop-medium-attempt1-*/` (the model dialog swallowed `/effort`, and the sandbox goal kept the turn from going idle) | Met | - |
| AC-006 | REQ-006 | **Given** a `/model` or `/effort` switch with no later assistant turn, **When** the transcript tail is read, **Then** the finding (entry and reader change, or documented limit) is in the implementation summary | `scratch/claude-hop/switch-entries.txt:3` and `scratch/claude-hop/effort-entries.txt:2-5`. `/model` and `/effort` each write a local command entry and its stdout before the next turn. Reader change: `readClaudeSettings` (`.skilled/hooks/session-relaunch/lib/context-usage.cjs:231`) applies a switch confirmed after the last assistant entry, tests `context-usage.test.cjs:420-480`, 3 red before (`scratch/test/reader-red-before.txt`), green after (`scratch/test/reader-green-after.txt`). On the real transcript cut at the `/model` confirmation the reader now returns `claude-opus-5-5` with no effort, where the old one returned `claude-sonnet-5-5` and `low` (`scratch/test/reader-real-transcript.txt`) | Met | - |
| AC-007 | REQ-007 | **Given** a launch with no `--model` flag and `--effort low`, and a consumed record with a live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and the launch effort `low` | `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1427`. `a launch with no model keeps its launch effort beside a live model`, pass before and after | Met | - |
| AC-008 | REQ-008 | **Given** a Hermes launch with a model and `--reasoning high`, and a consumed record with a different live model and no effort, **When** the wrapper relaunches, **Then** the arguments carry the live model and `--reasoning high` | `.skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1441`. `a Hermes live model with no live effort keeps the launch reasoning`, pass before and after | Met | - |

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

All eight criteria are Met. The live Claude hop from Sonnet low to Opus medium relaunched as `claude --model claude-opus-5-5 --effort medium`.
<!-- /ANCHOR:closure -->
