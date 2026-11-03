---
title: "Acceptance Criteria: Phase 2: table-row-matching"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "table row matching acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/002-table-row-matching"
    last_updated_at: "2026-11-01T20:53:16Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 2: table-row-matching

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `002-table-row-matching`
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
| AC-001 | REQ-001 | Given the redacted fixture, When the matcher runs dry and then with `--apply`, Then the fixture's sha256 is the same before and after both runs | `npx vitest run cli/tests/decision-table-matcher.vitest.ts`, read-only case (implementation-summary.md:95) | Met | - |
| AC-002 | REQ-002 | Given fixture records whose answers equal one row each, When the matcher scores them, Then each maps to its own row, including the line-break answer and the two shortened-option rows | Same test file, mapping cases (implementation-summary.md:95) | Met | - |
| AC-003 | REQ-002 | Given two fixture rows with the same answer and equal scores, When the matcher scores a record against them, Then it refuses with a tie reason and the record stays pending | Same test file, tie case (implementation-summary.md:95) | Met | - |
| AC-004 | REQ-006 | Given session `fe0c9990-06d3-454e-a8e7-7c7bc649bc49`, When the CLI runs with `--apply` against the Barter record, Then records 1 to 11 and 13 to 28 are consumed as Q67 to Q93 in order, and no row is added to the Barter record | T011 and T012 output, `rg -c '^\| Q[0-9]+ \|'` on the Barter record prints the same count immediately before and after the run, and its sha256 is unchanged by the run (implementation-summary.md:99) | Met | - |
| AC-005 | REQ-006 | Given record 12 has no row in either record, When a full-auto save targets `001-decision-capture-build`, Then that record gains exactly one new row and one appendix item for it | T013: `rg -c '^\| Q008 \|'` and `rg -c '^### Q008$'` on 001's `decision-record.md` each print 1 (implementation-summary.md:102) | Met | - |
| AC-006 | REQ-006 | Given AC-004 and AC-005 are Met and records 29 and 30 are consumed, When `pendingRecords` runs for the session and a Claude session ends, Then none of records 1 to 30 is pending, and with no later record pending the Stop hook prints no decision-capture line | T014: the Measured Behavior command shows records 1 to 30 as `consumed`, and the Stop output holds no `operator answer(s) captured this session` line (implementation-summary.md:103) | Met | - |
| AC-007 | REQ-004 | Given AC-004 and AC-005 are Met, When the `--apply` run and the record 12 save run a second time, Then no consumed row is added and neither record changes by a byte | T015: `wc -l` of `consumed.jsonl` unchanged and both sha256 values unchanged (implementation-summary.md:100) | Met | - |
| AC-008 | REQ-005 | Given a record whose answer matches no row, When the matcher runs with `--apply`, Then the record gets no consumed row and still counts as pending | Vitest no-row case, and record 12 printing `pending` in the T011 dry run (implementation-summary.md:56) | Met | - |
| AC-009 | REQ-003 | Given an accepted match, When `--apply` writes it, Then the consumed row carries the queue key, the hand-written record's folder relative to the project root as `packet`, the row's Q id as `id` and a timestamp | T012: each new line in `consumed.jsonl` parses to `{key, packet, id, at}` with `packet` naming the Barter folder (implementation-summary.md:99) | Met | - |
| AC-010 | REQ-007 | Given the test suite, When it runs, Then every case reads the redacted fixture and none opens the live Barter file | `rg -n 'barter/ai-speckit' cli/tests/decision-table-matcher.vitest.ts` prints nothing, and `rg -n '/Users/'` on the fixture prints nothing (implementation-summary.md:95) | Met | - |
| AC-011 | REQ-008 | Given no `--apply` flag, When the CLI runs, Then it writes nothing and prints one line per record with its Q id or `pending` and the score or refusal reason | T006 and T011 output, and `consumed.jsonl` line count unchanged by the dry run (implementation-summary.md:56) | Met | - |
| AC-012 | REQ-009 | Given the save docs, When you look for the matcher step, Then both name `match-decision-table` and say when to run it instead of a save | T009: `rg -l 'match-decision-table'` prints both doc paths (implementation-summary.md:102) | Met | - |
| AC-013 | REQ-010 | Given the series harness in `../006-live-conversation-test/`, When an orchestrator drives a real multi-turn test-subject session in a scratch project and answers its questions as the human, Then the 006 results matrix records that an answer matching a hand-written table row is consumed under that row's Q id, no duplicate row is written and the Stop-hook nudge reads 0 | T016: the 002 row in the 006 results matrix. Observed 2026-11-02: the Claude sibling run in 006 consumed the hand-written Amber answer under Q050 (`n=Q050 amber_rows=1`), wrote no second Amber row, and S14 read the nudge file as `n=0` | Met | - |
| AC-014 | REQ-011 | Given a fixture row already consumed by answer A, When a record with a different answer B scores against it, Then the matcher refuses with `row already consumed by a different answer` and writes no consumed row | Vitest one-row-one-answer case (implementation-summary.md:95) | Met | - |
| AC-015 | REQ-012 | Given any run, When it ends, Then it prints `consumed N, refused M, pending K`, and for the real session the refused records are each named with a reason in `goal.md` | T011 and T012 output (implementation-summary.md:100) | Met | - |
| AC-016 | REQ-013 | Given a temp copy of the state folder with `consumed.jsonl` deleted, When `--apply` reruns, Then the rebuilt rows equal the original rows less their `at` field | Vitest rebuild case (implementation-summary.md:95) | Met | - |
| AC-017 | REQ-014 | Given a state folder with two session queues, one fully consumed, When `--scan-orphans` runs, Then it lists only the other with its pending count; and When `--release <key>` runs, Then that key's rows leave `consumed.jsonl` and are printed; and the Stop-hook nudge text contains `match-decision-table` | Vitest scan and release cases, `rg -n 'match-decision-table' $RT/hooks/claude/session-stop.ts` (implementation-summary.md:56) | Met | - |
| AC-018 | REQ-015 | Given a hand-written appendix item with `**Question:**`, When the writer reuses ids, Then it matches that item instead of adding a new one | Writer vitest case (implementation-summary.md:95) | Met | - |
| AC-019 | REQ-016 | Given the save-writer scenario, When `recordConsumedKeys` is stubbed to write nothing, Then the scenario's check fails; and with it intact the check passes | `validate-playbook-package.cjs --package system-spec-kit` exit 0 plus the two runs in `scratch/`. Observed 2026-11-02: the scenario run as written passed every step (`scratch/save-writer-intact.txt`); with `recordConsumedKeys` turned into a no-op by a Node load hook, steps 3, 4 and 5 failed on the missing consumed log (`scratch/save-writer-stubbed.txt`) | Met | - |
| AC-020 | REQ-017 | Given a record whose Q id was written with answer A, When a full-auto save carries the same source key with answer B, Then the row and the `### Q` appendix item both hold B, no second item is added, and a repeat save with B changes no byte | Writer vitest case (implementation-summary.md:96) | Met | - |

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

**Closeable:** Yes. Every criterion is Met, Superseded or Waived; the 006 re-proof and the stubbed-writer run both landed.
<!-- /ANCHOR:closure -->
