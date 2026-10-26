---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed: the flag parses anywhere, quiet output is exactly one line, every non-quiet invocation stays byte-identical, and the JSON, help and error paths keep their contracts."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
  - "quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T15:20:00Z"
    last_updated_by: "markdown-planner"
    recent_action: "Authored the criteria and their verification commands for the quiet flag"
    next_safe_action: "Run T002's baseline capture, then implement T003 to T008"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-26-zz-bench-001-recommend-level-quiet-flag"
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
| AC-001 | REQ-001 | Given the script, When it is invoked with `--quiet` first, last or twice, Then the flag parses and no `Unknown option` reaches stderr | `bash recommend-level.sh --quiet --loc 200 --files 5 --api` and the two orderings in tasks T011; all exit `0` | Unmet | - |
| AC-002 | REQ-002 | Given a text-mode invocation, When `--quiet` is passed, Then stdout holds exactly one line, `Recommended Level: <N> (<Name>)`, with no leading blank line | `... --quiet \| wc -l` returns `1` and `head -c 1` returns `R`; tasks T010 rows Q01 to Q03 and Q05 | Unmet | - |
| AC-003 | REQ-003 | Given the twelve-row matrix captured before the change, When every non-quiet row is rerun after it, Then stdout, stderr and the exit code are byte-identical | `diff -r scratch/golden scratch/verify` exits `0` and prints `GOLDEN_IDENTICAL`; tasks T009 | Unmet | - |
| AC-004 | REQ-004 | Given a malformed invocation, When `--quiet` is also passed, Then the existing error text reaches stderr and the exit code is `1` | tasks T010 rows Q07 and Q08; tasks T011 value-rejection check | Unmet | - |
| AC-005 | REQ-005 | Given `--json` and `--quiet` together, When the script runs, Then the JSON document is identical to the same invocation without `--quiet` | `bash recommend-level.sh --json --quiet --loc 100 --files 3 \| diff - scratch/golden/M06.out`; tasks T010 | Unmet | - |
| AC-006 | REQ-006 | Given `--help`, When it is read, Then it lists `--quiet` and the header comment block lists it too | `bash recommend-level.sh --help \| grep -c -- '--quiet'` returns `2`; `grep -c '^#   --quiet '` returns `1`; tasks T006 and T007 | Unmet | - |
| AC-007 | REQ-007 | Given `--quiet` combined with `--no-recommend-phases`, `--phase-threshold`, `--auth`, `--api`, `--db` or `--architectural`, When the script runs, Then the level matches the same invocation without `--quiet` | tasks T010 rows Q02 and Q05 compared against matrix rows M03 and M05 | Unmet | - |
| AC-008 | REQ-008 | Given the system Bash 3.2 on macOS, When the changed script runs, Then it parses and executes without a version-dependent construct | `bash -n recommend-level.sh` prints `SYNTAX_OK` and the full matrix runs under `/bin/bash`; tasks T008 and T009 | Unmet | - |
| AC-009 | REQ-009 | Given an invocation that writes a warning to stderr, When `--quiet` is also passed, Then the warning still reaches stderr unchanged while stdout holds only the level line | `bash recommend-level.sh --quiet --bogus` writes the `Unknown option: --bogus` text to stderr with `0` stdout bytes and exit `1`; tasks T013 | Unmet | - |

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

No criterion is met yet: the packet is planned and the script is unchanged. The rows that will carry closure are AC-002 and AC-003, because together they are the whole contract - one line when asked, the same bytes when not. AC-005 carries the one judgement call in the feature, that JSON outranks quiet, and it is the row to reopen if a consumer ever asks for a quiet JSON variant. Nothing is waived; the `--json` interaction and the absence of a `-q` alias are decisions recorded in `plan.md` ADR-001 rather than criteria this packet declines to meet.
<!-- /ANCHOR:closure -->

---

