---
title: "Acceptance Criteria: Phase 34: scorer-heredoc-redirect-fix"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "scorer heredoc redirect fix acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/034-scorer-heredoc-redirect-fix"
    last_updated_at: "2026-11-16T05:23:44Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-034-scorer-heredoc-redirect-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 34: scorer-heredoc-redirect-fix

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `034-scorer-heredoc-redirect-fix`
**Level:** 2
**Status:** Complete
**Date:** 2026-11-16
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a document read then a heredoc whose body holds `len(x)>0`, When the fixed scorer normalizes it, Then no write is named and `startedCommand` returns null, while `cat <<'EOF' > notes.txt` still names `notes.txt` | `scratch/after.txt` PROBE: `body [] started null`, `opening ["notes.txt"] started /create:sk-skill`. Vitest cases at `command-transcript-score.vitest.ts` pass, the first three fail at `3d794f1df74` | Met | - |
| AC-002 | REQ-002 | Given the fix, When `SUITE`, `FLOOR` and `EVAL` run, Then the suite reads 0 failed and `FLOOR` and `EVAL` print the lines in `scratch/before.txt` | `scratch/after.txt`: 2319 passed, 0 failed, exit 0. FLOOR `24/44`, `0/35`, `2/44` and EVAL `[160,49,21,5]` equal `scratch/before.txt` | Met | - |
| AC-003 | REQ-003 | Given the rescore, When its files are written, Then none holds prompt or session text and each number comes from the scorer or a 026 filter | `scratch/rescore-evidence.txt` holds scorer and filter lines only. `rescore.py` reads the filters from `026-untuned-behaviour-arm/tasks.md`. The probes print counts, row ids and target names | Met | - |
| AC-004 | REQ-004 | Given the unfixed scorer reproduces 033 byte for byte, When the fixed scorer rescores the same lines, Then `rescore-evidence.txt` holds 033's line kinds and `rescore-diff.txt` lists every changed line | T002 `cmp` exit 0. `rescore-evidence.txt` 10 followed, 5 paired, 1 pooled, 10 starts, 10 delivery, 1 mismatch, 2 floor, 6 limit. `scratch/rescore-diff.txt` lists the 2 changed lines | Met | - |
| AC-005 | REQ-005 | Given `rescore-evidence.txt`, When the arm target and the B-5 rule are applied, Then the goal log holds one `Arm verdict, rescored` row and one `B-5 trigger, rescored` row with the printed numbers | `rg -c` on `../goal.md` prints 2: `Arm verdict, rescored` Not shown and `B-5 trigger, rescored` Not fired | Met | - |

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

Every row is Met with the evidence it names.
<!-- /ANCHOR:closure -->
