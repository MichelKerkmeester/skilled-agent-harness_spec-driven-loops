---
title: "Acceptance Criteria: Add a quiet flag to recommend-level.sh"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "recommend level quiet flag acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/001-recommend-level-quiet-flag"
    last_updated_at: "2026-10-26T05:14:28Z"
    last_updated_by: "scaffold"
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
**Status:** Planned
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

Vitest commands run from `.skilled/skills/system-spec-kit/runtime/cli`. Direct probes run from the repository root, with `SCRIPT` standing for `.skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh`. Each case must be seen failing against the pre-change script before it counts.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given `--loc 500 --files 15 --auth --api --db --architectural`, When it runs with `--quiet`, Then stdout is exactly one line, `Recommended Level: 3 (Full)`, and the exit code is 0 | `bash $SCRIPT --loc 500 --files 15 --auth --api --db --architectural --quiet` piped through `wc -l` prints 1, and the line is compared to the `:510` format. Case `prints one line for a level 3 task` in `tests/recommend-level-quiet.vitest.ts`. Fails today because `--quiet` is an unknown option and the script exits 1 at `:713-717` | Unmet | - |
| AC-002 | REQ-001 | Given one input in each of the other three level bands, When each runs with `--quiet`, Then each prints one line naming its own level and nothing else | The table-driven case `prints one line in every level band` in the same file, with inputs for levels 0, 1 and 2. Fails today for the same reason as AC-001 | Unmet | - |
| AC-003 | REQ-002 | Given the default-mode matrix captured before the change, When the same invocations run after it without `--quiet`, Then stdout, stderr and the exit code are byte-identical | `diff -r scratch/baseline scratch/after` over the captured files prints nothing, and every exit code matches. Fails today only because no baseline exists yet, which T001 fixes before the edit | Unmet | - |
| AC-004 | REQ-002 | Given the argument shape both YAML callers use, When it runs with `--json`, Then the document is byte-identical to the pre-change one | The `--json --recommend-phases --phase-threshold 25 --loc 200 --files 5 --api` invocation compared against its baseline file. `speckit-plan.yaml:86` and `speckit-complete.yaml:147` pass this shape | Unmet | - |
| AC-005 | REQ-003 | Given `--quiet` and `--json` in either order, When it runs, Then it exits 1, writes an error to stderr and leaves stdout empty | Cases `refuses quiet with json` and `refuses json with quiet` in the same file, asserting empty stdout and exit 1. Fails today because `--quiet` is rejected as unknown before the pair can be judged | Unmet | - |
| AC-006 | REQ-004 | Given `--quiet` with no `--loc` or `--files`, or with a non-numeric `--loc`, When it runs, Then it exits 1 with the existing error on stderr and nothing on stdout | Cases `keeps the missing-input error under quiet` and `keeps the numeric error under quiet`, each asserting empty stdout. Fails today because the unknown option masks the intended error | Unmet | - |
| AC-007 | REQ-004 | Given one input, When it runs with and without `--quiet`, Then both name the same level and the same exit code | For each row of the band table, the quiet line is compared to the `Recommended Level:` line of the default run. Case `does not change the level` in the same file | Unmet | - |
| AC-008 | REQ-005 | Given `--help`, When it runs with or without `--quiet`, Then the output names `--quiet` and its effect | Case `documents the flag in help` greps the help output for `--quiet`. Fails today because neither the help text nor the header comment mentions it | Unmet | - |
| AC-009 | REQ-001 | Given the `runtime/cli` suite, When it runs from the final state, Then it passes and the test count differs from the T004 baseline only by the added cases | `npx vitest run tests/recommend-level-quiet.vitest.ts --config ../vitest.config.ts --root .` passes, and `npm test` in `.skilled/skills/system-spec-kit/runtime/cli` matches the T004 baseline plus the new file | Unmet | - |
| AC-010 | REQ-006 | Given a run that writes a warning to stderr, When it runs with `--quiet`, Then the warning is still written to stderr and stdout still carries only the `Recommended Level:` line | `bash $SCRIPT --loc 200 --files 5 --quiet 2>scratch/quiet.err >scratch/quiet.out` leaves stderr its own stream rather than merging it into stdout, and the `output_quiet` body plus the dispatch branch at `:770-774` are grepped for `>&2` and `2>` to show neither redirects stderr. Case `keeps stderr separate under quiet` in `tests/recommend-level-quiet.vitest.ts`. Fails today because `--quiet` is an unknown option and the script exits 1 at `:713-717` | Unmet | - |

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

Planned. No criterion has been worked yet. AC-001 through AC-008 decide the packet: the flag prints one line, the default path does not move, and the two-mode conflict is refused. AC-009 keeps the suite honest.
<!-- /ANCHOR:closure -->
