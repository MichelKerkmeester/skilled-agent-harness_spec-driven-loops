---
title: "Acceptance Criteria: Phase 5: chat-question-detection"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "chat question detection acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/005-chat-question-detection"
    last_updated_at: "2026-11-01T20:53:19Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-chat-question-detection"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 5: chat-question-detection

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `005-chat-question-detection`
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
| AC-001 | REQ-001 | Given a message whose earlier paragraph asks "Which store owns the queue?" and whose closing paragraph is a status line, When the reply is typed and the sweep runs, Then one candidate holds that paragraph. A `?` only inside code, quotes, a table row or a heading gives none. | New cases in `sweep-transcript.test.mjs`, and `node --test` prints `ℹ fail 0`. Observed: the earlier-question, code, quote, table-row and heading cases pass; `ℹ fail 0`. | Met | - |
| AC-002 | REQ-001 | Given an asking paragraph followed by a paragraph of `A)` to `D)` lines, When the sweep runs, Then one candidate holds both paragraphs and the process filter sees the labels. | New case in `sweep-transcript.test.mjs`. Observed: the lettered-options case passes, and the scope case with `A)` to `D)` labels is filtered. | Met | - |
| AC-003 | REQ-002 | Given the ten existing sweep cases, When the change lands, Then all ten pass with their bodies unedited and the closing-paragraph key, text and object shape match today's. | `git diff --numstat` shows 0 deleted lines in `sweep-transcript.test.mjs`, and T018 shows identical closing keys. Observed: numstat `282	0`; on frozen copies the 20 closing keys equal the HEAD sweep's. | Met | - |
| AC-004 | REQ-003 | Given one transcript, When it is swept twice, Then both runs print identical `chat_candidates`, each earlier key ends in `:p` plus 12 hex digits, every key matches `^[A-Za-z0-9:._-]+$` and a consumed earlier key is not offered again. | New cases in `sweep-transcript.test.mjs` and `capture-core.test.mjs`. Observed: the two-sweep, pattern, consumed-key and five-argument key cases pass. | Met | - |
| AC-005 | REQ-004 | Given an earlier paragraph that asks to commit and push, or that asks for a spec folder, When the sweep runs, Then it yields no candidate. | New case, plus the 3 pairs labelled `process` in the fixture yield none (T017). Observed: the commit-and-push and scope cases yield none, and the fixture's 3 `process` pairs yield none. | Met | - |
| AC-006 | REQ-005 | Given a message with five asking paragraphs, When the sweep runs, Then it prints 3 candidates in message order, including the closing paragraph. | New case in `sweep-transcript.test.mjs`. Observed: the five-paragraph case prints 3 in message order with the closing one. | Met | - |
| AC-007 | REQ-006 | Given 25 answered chat questions in one transcript, When the sweep runs, Then it prints the newest 20 and `chat_candidates_dropped: 5`. | New case in `sweep-transcript.test.mjs`. Observed: 20 candidates and `chat_candidates_dropped: 5`. | Met | - |
| AC-008 | REQ-007 | Given the redacted fixture of the 7 baseline `earlier` pairs and the ten baseline transcripts, When each is swept by the CLI in a temporary project, Then the fixture prints 4 candidates, including the 1 of 1 pair labelled `answers_earlier`. The ten transcripts' total equals the scratch script's `units` total from the same run (24 on 2026-11-01), no message exceeds 3 and no session exceeds 20. | T017 and T018 output. Observed 2026-11-02: the fixture prints 4 including pair 6; on frozen copies of the ten ids the total is 25 and the same-run `units` total is 25 (24 before `fe0c9990` grew), at most 1 per message and 7 per session. | Met | - |
| AC-009 | REQ-008 | Given both copies of `save.md`, When a reader opens the operator-decisions step, Then it says several candidates can share one reply and an entry is written only for a question the reply answers. | `rg -c 'share one reply'` prints 1 for `.skilled/commands/speckit/save.md` and for `.opencode/commands/speckit/save.md`. Observed: `rg -c` prints 1 for each path; the `.opencode` folder links to `.skilled/commands/speckit`. | Met | - |
| AC-010 | REQ-009 | Given the series harness in `../006-live-conversation-test/`, When an orchestrator drives a real multi-turn test-subject session in a scratch project, the subject asks a plain chat question in the middle of a message and the orchestrator answers it as the human, Then the 006 results matrix shows that question offered as one chat candidate within the per-message cap of 3, and a following reply that moves on without answering adds no decision row after the save. | The 006 results matrix row for this child (T020). Observed 2026-11-02: the 006 sibling re-proof S5b offered the mid-message question as one candidate within the cap of 3, and S6 wrote one chat row for it | Met | - |
| AC-011 | REQ-010 | Given the OpenCode, Devin, Codex and Pi sweeps, When each runs on its redacted fixture from a real scratch session, Then a plain chat question answered by the next typed prompt prints one chat candidate keyed with that runtime's name, a tool call between them prints none, and the 006 main scenario on Pi, OpenCode and Devin records the S5 chat answer as a decision row | `node --test .skilled/hooks/decision-capture/lib/*.test.mjs .skilled/hooks/decision-capture/bin/*.test.mjs` prints `fail 0`, and the S11 rows of the 006 Pi, OpenCode and Devin runs read `record_rows=7`. Observed 2026-11-02: suite 93 pass, 0 fail, with one fixture test per reader; S11 `record_rows=7` on Pi, OpenCode and Devin | Met | - |

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

**Closeable:** Yes. Every criterion is Met, Superseded or Waived, and the 006 harness ran AC-010.
<!-- /ANCHOR:closure -->
