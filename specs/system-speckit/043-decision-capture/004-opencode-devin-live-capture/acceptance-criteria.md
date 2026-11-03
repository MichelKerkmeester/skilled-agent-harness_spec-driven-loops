---
title: "Acceptance Criteria: Phase 4: opencode-devin-live-capture"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "opencode devin live capture acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/004-opencode-devin-live-capture"
    last_updated_at: "2026-11-01T20:53:18Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-004-opencode-devin-live-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: opencode-devin-live-capture

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `004-opencode-devin-live-capture`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-01
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the operator's recorded consent, When a scratch-project OpenCode session asks one harmless question with throwaway loggers on `tool.execute.after`, `question.replied` and `session.idle`, Then `probe/opencode.json` names where the answer sat, `input.callID` and `input.sessionID`, or keeps UNKNOWN with the reason | `node -e` parse of `.skilled/skills/.state/decision-capture/probe/opencode.json` and its `hook_payload` value (T003). Observed 2026-11-02: `probe/opencode.json` names `input.callID`, `input.sessionID` and `output.metadata.answers`. | Met | - |
| AC-002 | REQ-002 | Given the operator's recorded consent, When a scratch-project Devin session asks one harmless question with loggers on `PostToolUse` and `Stop`, Then `probe/devin.json` names the payload keys, whether `tool_response` holds the answer and whether Stop context was shown, or keeps UNKNOWN with the reason | `node -e` parse of `.skilled/skills/.state/decision-capture/probe/devin.json` and its `hook_payload` value (T004). Observed: `probe/devin.json` names the payload keys, the answer in `tool_response.output` and that Stop context was not shown. | Met | - |
| AC-003 | REQ-003 | Given a redacted real `session_message` row in `bin/fixtures/opencode-session-message.json`, copied from the session that REQ-001's own live probe created (or, when that probe yields no row, the probe file's status `UNKNOWN` with its reason and this row Waived by an ADR), When its test runs, Then it was seen to fail first and `node --test .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs` prints `fail 0` against the final reader | The failing and passing outputs pasted in `implementation-summary.md` (T005, T006, T007). Observed: the real-row case fails with the `session_message` branch disabled (output in the summary) and passes against the unchanged reader, 7 pass. | Met | - |
| AC-004 | REQ-004 | Given an adapter for a proven surface, When the adapter and the reader both see one answered call in either order, Then the session's queue holds one line per answered question with the same `toolSourceKey` | `node --test .skilled/hooks/decision-capture/lib/capture-core.test.mjs` prints `fail 0` with the same-key cases (T016). Observed: 20 pass, 0 fail, with both producer orders for each runtime. | Met | - |
| AC-005 | REQ-005 | Given a runtime whose probe proved neither a hook payload nor a near-live store, When the packet closes, Then no adapter file exists for it and its probe file and `implementation-summary.md` say why | `ls .opencode/plugins/decision-capture.js .skilled/hooks/decision-capture/devin/` and the Key Decisions row in `implementation-summary.md`. Observed: both probes proved a hook payload, so both adapters exist; no runtime lacked a surface. | Met | - |
| AC-006 | REQ-006 | Given two pending answers in an OpenCode or Devin session, When the next turn or the Stop hook runs, Then one pending-answer line reaches that session and none on the turn after, or `implementation-summary.md` names the missing surface | The plugin test and the Devin Stop vitest case (T009, T015). Observed: the OpenCode nudge case passes; the summary names Devin's missing surface, Stop context not displayed. | Met | - |
| AC-007 | REQ-007 | Given `SYSTEM_DECISION_CAPTURE_DISABLED=1` or a malformed payload, When an adapter runs, Then it writes no queue line and no output, and any Devin binding passes the registry check | Adapter fail-open test cases and `sync-hook-registrations.cjs --check` printing PASS (T012). Observed: the plugin and Devin adapter cases for the kill switch and malformed input pass, and `--check` prints PASS. | Met | - |
| AC-008 | REQ-008 | Given the live-conversation harness in `../006-live-conversation-test/`, When an orchestrator drives a real multi-turn OpenCode and Devin test-subject session in a scratch project and answers the subject's questions as the human, Then the 006 results matrix shows each answer queued live or near-live during the conversation, once, with the save-time reader adding no duplicate | The 006 results matrix rows for OpenCode and Devin (T019). Observed 2026-11-02: the OpenCode and Devin main scenarios each passed 14/14; the stage checks read 6 queue lines per runtime as the answers came in, 0 duplicate keys, and the save-time sweep added none (7 record rows each) | Met | - |

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
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes. Every criterion is Met, Superseded or Waived.
<!-- /ANCHOR:closure -->
