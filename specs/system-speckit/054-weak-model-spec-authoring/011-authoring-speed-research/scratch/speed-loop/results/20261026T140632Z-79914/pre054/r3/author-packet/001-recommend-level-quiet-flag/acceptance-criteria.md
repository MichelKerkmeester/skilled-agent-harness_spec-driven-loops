---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "recommend-level.sh quiet closure gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "zz-bench-authoring/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T14:45:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "zz-bench-authoring-001-recommend-level-quiet-flag"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Quiet governs text output only, so --json keeps its full document"
      - "The quiet line reuses the existing output_text level line"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Add a quiet flag to recommend-level.sh

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

Every row is `Unmet` today. This packet plans the change and no line of `recommend-level.sh` is edited yet. Each Verification cell names the command or artifact that will settle the row.

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

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the script accepts options in any order, When `--quiet` is passed first, last and twice, Then every run exits 0 and prints the same single line | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet`, then the same with the flag last and repeated | Unmet | - |
| AC-002 | REQ-002 | Given a valid input set, When `--quiet` is passed without `--json`, Then stdout is one line reading `Recommended Level: <N> (<Name>)` and the line count is 1 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --quiet \| wc -l` prints 1, and the line matches the captured baseline level line | Unmet | - |
| AC-003 | REQ-003 | Given the fixture set from `tasks.md` T001 and T002, When the default text output and the JSON output are compared to the baseline, Then both diffs are empty | `diff scratch/baseline-text.txt scratch/after-text.txt` and `diff scratch/baseline-json.txt scratch/after-json.txt`, both exit 0 | Unmet | - |
| AC-004 | REQ-004 | Given the same inputs, When the run uses `--quiet`, Then the level, level name and confidence match the values in the default run | Compare the quiet line to line 2 of `scratch/baseline-text.txt` for every fixture | Unmet | - |
| AC-005 | REQ-005 | Given `--json` and `--quiet` together, When the script runs, Then the full JSON document is printed and no level line is added | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --loc 200 --files 5 --api --json --quiet \| wc -l` prints 36, and the new case in `test-phase-system.js` asserts the `recommended_level` field | Unmet | - |
| AC-006 | REQ-006 | Given an invalid invocation, When `--quiet` is passed, Then the stderr text and exit code 1 are unchanged | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet` prints the `At least --loc or --files must be provided` error on stderr and exits 1 | Unmet | - |
| AC-007 | REQ-007 | Given an operator reads the help, When `--help` runs, Then the OPTIONS list names `--quiet` with the same wording as the file-header block, and `--quiet --help` exits 0 | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh --quiet --help` prints the OPTIONS list and exits 0, and the two OPTIONS blocks are compared with `diff` | Unmet | - |
| AC-008 | REQ-008 | Given both suites pass at 27 and 51 today, When the change lands with its new case, Then the counts read 28 and 51 with 0 failures | `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.js` and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-validation.js`, both exit 0 | Unmet | - |
| AC-009 | REQ-009 | Given the final diff, When it is inspected, Then it touches only the script and the one test file and adds no dependency | `git diff --stat` on the two paths lists nothing else, and the script gains no new command invocation | Unmet | - |

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

This packet keeps its decisions in `plan.md` under ADR-001 and ADR-002 and has no
`decision-record.md`, so no row may be waived here. Meet the row or supersede the
criterion with a decision recorded in `plan.md` first.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** No

Nine criteria are open. The packet is a plan for a change that has not been made, and every row needs a command run against the edited script before it can be marked `Met`. Closure depends on AC-003 in particular, because an empty default-output diff is the only proof that existing callers see no change.
<!-- /ANCHOR:closure -->
