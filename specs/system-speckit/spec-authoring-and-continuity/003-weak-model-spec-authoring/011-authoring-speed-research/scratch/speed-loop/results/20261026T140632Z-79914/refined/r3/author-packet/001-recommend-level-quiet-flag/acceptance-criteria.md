---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed: the quiet line, the unchanged default report and JSON payload, the flag conflict, and the documented flag."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:35:00Z"
    last_updated_by: "devin-cli"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-recommend-level-quiet-flag-plan"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Add a quiet flag to recommend-level.sh

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** zz-bench-authoring/001-recommend-level-quiet-flag
**Level:** 3
**Status:** Draft
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`S` is `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`, and every command runs from the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 500 --files 15`, When the script runs with `--quiet`, Then stdout is one line that reads `Recommended Level: 2 (Verification)` and the exit code is 0 | `bash "$S" --loc 500 --files 15 --quiet` prints one line, and `wc -l` on that output prints 1 | Unmet | - |
| AC-002 | REQ-002 | Given `--loc 500 --files 15`, When the script runs without `--quiet`, Then stdout is the 16-line report and diffs clean against the capture taken before the change | `bash "$S" --loc 500 --files 15` piped to `diff - scratch/baseline-default.txt` prints nothing | Unmet | - |
| AC-003 | REQ-002 | Given `--loc 500 --files 15`, When the script runs with `--json`, Then the payload diffs clean against the capture taken before the change | `bash "$S" --loc 500 --files 15 --json` piped to `diff - scratch/baseline-json.txt` prints nothing | Unmet | - |
| AC-004 | REQ-003 | Given both flags, When the script runs with `--quiet` and `--json`, Then it exits 1, writes `ERROR: --quiet cannot be combined with --json` to stderr, and writes nothing to stdout | `bash "$S" --loc 500 --files 15 --quiet --json` exits 1 with that stderr line | Unmet | - |
| AC-005 | REQ-004 | Given a caller reading the help, When `--help` runs, Then the OPTIONS block lists `--quiet` with a one-line description that matches the header comment | `bash "$S" --help` lists `--quiet` once, and the header comment names the same flag | Unmet | - |
| AC-006 | REQ-005 | Given `--quiet` with neither `--loc` nor `--files`, When the script runs, Then it exits 1 with the existing missing-input error and prints nothing to stdout | `bash "$S" --quiet` exits 1 with `At least --loc or --files must be provided` on stderr | Unmet | - |

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

AC-001 is unmet: the flag does not exist yet, so no criterion can be verified until the tasks in `tasks.md` run and their commands are observed.
<!-- /ANCHOR:closure -->
