---
title: "Acceptance Criteria: Phase 9: chat-answer-evidence"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "chat answer evidence acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/009-chat-answer-evidence"
    last_updated_at: "2026-11-03T11:40:00Z"
    last_updated_by: "orchestrator-closeout"
    recent_action: "Marked every criterion Met with observed evidence"
    next_safe_action: "None for this packet; 010 may start"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 9: chat-answer-evidence

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** `009-chat-answer-evidence`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-03
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 7-pair fixture, When the detector runs on it, Then each of the four candidates carries `evidence` with exactly the five keys and allowed values, and a candidate with a null answer carries `evidence: null` | Rerun 2026-11-03: the Measured Behavior detector printed `true` four times, each object with the five keys; `an unanswered question carries no evidence` passes, and a `chatCandidatesFromTurns` probe with no reply printed `{"answer":null,"evidence":null}` | Met | - |
| AC-002 | REQ-002 | Given the 7-pair fixture, When `sweep-transcript.test.mjs` runs, Then pairs 1, 3 and 7 show `imperativeOpening: true`, `contentOverlap: 0` and `optionMatch` not `true`, and pair 6 shows `numbered_list`, `not_applicable`, `3`, `false`, `false` | The file passes inside 119 of 119; the detector printed exactly these values. In a scratch copy with pair 6's expected overlap set to 0, the file printed pass 25, fail 1 | Met | - |
| AC-003 | REQ-003 | Given `save.md`, When `rg -n 'clearly replies'` and a per-term `rg -c` for the five field names and `Evidence:` run on it, Then the old sentence is gone and every term is present, with the rule that the evidence never replaces judgment | `rg -n 'clearly replies'` printed nothing, exit 1. Counts: questionType 2, optionMatch 3, contentOverlap 2, imperativeOpening 2, topicShift 2, `Evidence:` 2. Line 75: the evidence informs the judgment and never replaces it; line 76 sets the `Evidence:` sentence | Met | - |
| AC-004 | REQ-004 | Given the changed code, When the hooks `node --test` suites, the Pi vitest and the OpenCode plugin test run, Then each reports no failure and the hooks count exceeds the baseline 107 | Hooks `tests 119, pass 119, fail 0`, exit 0; Pi vitest `Tests 10 passed (10)`, exit 0; OpenCode plugin `tests 6, pass 6, fail 0`, exit 0 | Met | - |
| AC-005 | REQ-005 | Given a scratch project outside this repository and three baseline saves recorded, When three scripted full-auto saves of the fixture run on the changed code, Then each prints `chat_rows=1 pair6=1` and the row's Why ends in `Evidence: numbered_list, option not_applicable, overlap 3, imperative false, shift false.` | Baseline, pre-change: three runs printed `chat_rows=1 pair6=1`, a fourth chose pair 6 but its writer failed in `withWorkflowRunLock`. After: three runs each printed `save_exit=0` and `chat_rows=1 pair6=1 entries=1`, each model why ending in the sentence. A fourth after-run grepped the written record: row Q009, line 259, why cell `Not stated. Evidence: numbered_list, option not_applicable, overlap 3, imperative false, shift false.` | Met | - |
| AC-006 | REQ-006 | Given the extended fixture, When `jq` counts its labels, Then it holds at least 12 product pairs and at least 5 positives covering all four question types, and its test prints each pair's evidence | `jq 'length'` printed 14; the count of labels with `answers` true printed 9. The positives span `yes_no`, `alternative`, `open_value` and `numbered_list`; the shape test passes | Met | - |
| AC-007 | REQ-007 | Given the unit cases, When `chat-questions.test.mjs` runs, Then `Analyxe`, `First, make it blue`, `Push it`, `make it blue` and ADR-002's `actually first fix the login bug` each carry the evidence in the plan table, and removing the `analy*` stem fails the `Analyxe` case | The four named replies have committed cases in `chat-questions.test.mjs`, all passing. `Analyxe` is fixture pair 1, asserted in `sweep-transcript.test.mjs` rather than in this file; with the stem removed in a scratch copy that test failed, pass 35, fail 1 | Met | - |
| AC-008 | REQ-008 | Given the feature catalog page, When `rg -n 'evidence'` runs on it, Then it names the evidence object, the `why` sentence, and that no code accepts or rejects a candidate | `rg -n 'evidence'` prints lines 19, 41 and 63; line 41 names the `evidence` object and its five signals, says no candidate is accepted or rejected by code, and names the `Evidence:` sentence at the end of each chat entry's `why` | Met | - |

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

Every row is Met. The outcome change itself is unproven, because the baseline saves already chose pair 6; that is a recorded limitation, not an acceptance row.
<!-- /ANCHOR:closure -->
