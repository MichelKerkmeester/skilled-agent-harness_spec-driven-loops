---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "recommend-level.sh quiet acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-23T00:00:00Z"
    last_updated_by: "deepseek-v4.1-flash-1017"
    recent_action: "Authored the criteria for the quiet flag"
    next_safe_action: "Run the tasks in tasks.md, then mark each criterion Met with observed evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deepseek-v4.1-flash-1017-001-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Add a quiet flag to recommend-level.sh

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** zz-bench-authoring/001-recommend-level-quiet-flag
**Level:** 2
**Status:** In Progress
**Date:** 2026-10-23
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001, REQ-002 | Given `--loc 50 --files 2`, When the script runs with `--quiet`, Then stdout is exactly one line matching `^Recommended Level: [0-3] \([A-Za-z]+\)$` with no blank line or breakdown | `tasks.md` T013, T014; capture in `scratch/quiet-low.txt` | Unmet | - |
| AC-002 | REQ-003 | Given a pre-change baseline for the low, medium and high input sets, When the script runs without `--quiet`, Then the text output diffs empty and the JSON output diffs empty | `tasks.md` T015, T016; `scratch/baseline-text-*.txt`, `scratch/baseline-json-*.json` | Unmet | - |
| AC-003 | REQ-004 | Given `--quiet` with no input, a bad `--loc`, a bad `--phase-threshold` or an unknown option, When the script runs, Then it exits 1, writes the message to stderr and leaves stdout empty | `tasks.md` T018; `scratch/err-*.txt` | Unmet | - |
| AC-004 | REQ-005 | Given the modified script, When it runs with `--help`, Then the output lists `--quiet`, and the file header `OPTIONS:` block lists the same flag | `tasks.md` T009, T010, T019; `scratch/help-quiet.txt` | Unmet | - |
| AC-005 | REQ-006 | Given the same inputs, When the script runs with `--quiet --json` and with `--json`, Then the two outputs are byte-identical and the document parses as JSON | `tasks.md` T017; `scratch/json-quiet-*.json` | Unmet | - |
| AC-006 | REQ-007 | Given `--quiet --help`, When the script runs, Then it prints the full help text and exits 0 | `tasks.md` T019; `scratch/help-quiet.txt` | Unmet | - |

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

Six criteria; the single-line quiet path, the unchanged default and JSON paths, the documented
flag and the stderr error path carry the packet. Nothing was waived, deferred or superseded, and
the JSON contract stays with `output_json()` untouched.
<!-- /ANCHOR:closure -->
