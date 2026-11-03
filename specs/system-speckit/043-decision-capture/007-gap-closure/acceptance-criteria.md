---
title: "Acceptance Criteria: Phase 7: gap-closure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gap closure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/043-decision-capture/007-gap-closure"
    last_updated_at: "2026-11-02T17:46:39Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2cdc1c20-d541-4a71-ba53-999a34105259"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: gap-closure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-gap-closure`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-02
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a named transcript that does not exist, When `sweep-codex.mjs --transcript missing.jsonl` runs, Then it prints JSON with an `error` field and exits 1 | `node sweep-codex.mjs --transcript missing.jsonl` printed `{"error":"ENOENT: no such file or directory, open 'missing.jsonl'"}`, exit 1 | Met | - |
| AC-002 | REQ-001 | Given the same missing transcript, When `sweep-pi.mjs --transcript missing.jsonl` runs, Then it prints `error` and exits 1, and `--transcript /dev/null` prints nothing and exits 0 | `sweep-pi.mjs --transcript missing.jsonl` printed the same `error`, exit 1; `--transcript /dev/null` printed nothing, exit 0 | Met | - |
| AC-003 | REQ-002 | Given `save.md`, When `rg -n 'scan-orphans' .skilled/commands/speckit/save.md` runs, Then it prints the step that lists other sessions' pending answers | `rg -n scan-orphans .skilled/commands/speckit/save.md` printed line 70; the command printed five `<count> <session-id>` lines on this repository | Met | - |
| AC-004 | REQ-003 | Given the changed code, When the hooks `node --test` suites, the Pi vitest, the OpenCode plugin test and the runtime CLI suites run, Then each reports no failure | hooks 101 of 101, Pi vitest 9 of 9, plugin 6 of 6, CLI suites 72 of 72 | Met | - |
| AC-005 | REQ-004 | Given two queued answers in a Pi session, When `turn_end` fires twice, Then `ctx.ui.notify` is called once with the count, and not at all with the kill switch set | Pi vitest "notifies once for a newly captured answer at turn end" and the kill-switch test pass, 9 of 9 | Met | - |
| AC-006 | REQ-005 | Given the plugin, When `bun -e "import('./.opencode/plugins/decision-capture.js')"` runs, Then it loads, and `rg -c answerMap .opencode/plugins/decision-capture.js` prints nothing | Bun printed `loaded`; `rg -c answerMap` printed nothing, exit 1 | Met | - |
| AC-007 | REQ-006 | Given the matcher CLI, When `rg -c 'CONSUMED_FILENAME\|readConsumedLines'` runs on it, Then it prints nothing, and the matcher and writer suites pass | `rg -c` printed nothing, exit 1; matcher and writer suites in the 72 of 72 | Met | - |
| AC-008 | REQ-007 | Given the docs, When `rg -n 'decision-capture' .skilled/hooks/coverage-rationale.md` runs, Then it prints the section, and `save.md` no longer lists the process-question topics | `rg -n decision-capture .skilled/hooks/coverage-rationale.md` prints the section heading; save.md line 74 names no process topic | Met | - |
| AC-009 | REQ-003 | Given the series, When `validate.sh specs/system-speckit/043-decision-capture --strict --recursive` runs, Then every folder prints RESULT: PASSED | `validate.sh specs/system-speckit/043-decision-capture --strict --recursive` printed RESULT: PASSED for all 8 folders, exit 0 | Met | - |
| AC-010 | REQ-008 | Given a Pi session file where the operator answered pi-plan-build's `question` tool, When `sweep-pi.mjs --transcript <file>` runs, Then the answer is queued once with its label, and the live extension queues the same answer under the same key | The second live pass's failing session file, swept into a throwaway project, recovered 1 record, `answer: Amber`, key `pi:8f98dcc1-…:call_00_XeytYZEYs90CmU9XuJA00555:0`; sweep test "an answer through the pi-plan-build question tool queues its label" fails with `question` removed from the tool set and passes with it; Pi vitest 10 of 10 including the extension's same-key case | Met | - |

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

**Closeable:** Yes

Every criterion is Met with the evidence in its row.
<!-- /ANCHOR:closure -->
