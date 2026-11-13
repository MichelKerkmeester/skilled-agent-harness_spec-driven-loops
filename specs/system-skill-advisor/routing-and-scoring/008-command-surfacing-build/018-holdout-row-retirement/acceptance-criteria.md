---
title: "Acceptance Criteria: Phase 18: holdout-row-retirement"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record or superseded by one."
trigger_phrases:
  - "holdout row retirement acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/018-holdout-row-retirement"
    last_updated_at: "2026-11-13T18:05:01Z"
    last_updated_by: "closeout-worker"
    recent_action: "Marked all nine criteria Met with the observed evidence"
    next_safe_action: "Commit the phase, then run review pass three"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-018-holdout-row-retirement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 18: holdout-row-retirement

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 018-holdout-row-retirement
**Level:** 2
**Status:** Complete
**Date:** 2026-11-13
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one. The short names are the ones `tasks.md` defines in its Task Notation.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the sealed file with the row `suppressed-codex-abstain`, When T003 runs its `grep -v`, Then that one line is gone and no other byte changed | `G diff --numstat BASE -- $HP` reads `0` added and `1` deleted, `HCOUNT` is one below `before.txt` and `HROW` prints nothing (T003, T008). Observed at close-out: `git diff --stat 11f3a30814 -- .skilled` shows the sealed file with 1 deletion and no insertion, `HCOUNT` prints 65 against 66 at `scratch/before.txt:12`, `HROW` prints nothing against one line at `scratch/before.txt:14`. `scratch/leak-after.txt:1` reads sealed 65 | Met | - |
| AC-002 | REQ-002 | Given the trimmed file, When T004 recaptures the baseline with no scoring date variable, Then only the holdout values, `holdoutSha256` and `capturedAtSha` move and each moves by the rule in REQ-002 | T004's verify: `HASHES` keeps three values and matches `FILEHASH`, `OTHERM` equals its before line and `HOLDM` follows the total, correct and accuracy rules. Observed: `capturedAt`, `corpusSha256` and `ambiguitySha256` equal at `scratch/before.txt:16` and `scratch/after.txt:4`, `holdoutSha256` equals `FILEHASH` at `scratch/after.txt:10`, `OTHERM` equal at `scratch/before.txt:20` and `scratch/after.txt:6`, `HOLDM` reads 50 of 65 at 0.7692 at `scratch/after.txt:8` with the row a miss at `scratch/before.txt:28`. The baseline diff at close-out changes 4 lines (`scratch/after.txt:12`): `capturedAtSha`, `holdoutSha256`, the holdout total and the holdout accuracy | Met | - |
| AC-003 | REQ-003 | Given the recaptured baseline, When the gates rerun, Then the ratchet, the independence gate, the capture-date test and the full suite pass and the command floors hold | T006's verify: three `VX` runs and `VALL` report 0 failed and the four `FLOOR` lines equal `before.txt`. Observed: ratchet 7 passed at `scratch/after.txt:15`, independence gate 6 passed at `scratch/after.txt:18`, capture-date 2 passed at `scratch/after.txt:21`, full suite 184 files passed with 1796 tests passed and 6 skipped at `scratch/after.txt:24`. The four `FLOOR` lines from `scratch/after.txt:30` to line 33 equal those from `scratch/before.txt:38` to line 41 | Met | - |
| AC-004 | REQ-004 | Given the operator's answer to Q6, When T002 runs the leak check before any edit, Then its positive control finds every row and the chosen stop rule decides whether the phase goes on | `scratch/leak-before.txt` exists, its `positive control:` line prints `N of N` for both sets and T002 is `[x]`, or `[B]` with the line that fired the rule. Observed: `scratch/leak-before.txt:2` prints 66 of 66 and 44 of 44, 66 equal to `HCOUNT` at `scratch/before.txt:12`. Lines 5 to 7 name the rows `spec.md` section 2 names at planning, so the Q6 rule did not fire, and T002 is `[x]` | Met | - |
| AC-005 | REQ-005 | Given the finished phase, When T008 scans the diff against `BASE`, Then only `HP`, `SEB` and `RAR` changed under `.skilled`, no source file changed and the builder, the graph, the `cli-external-orchestration` files and every `package.json` are unchanged | Every T008 check prints what it names. Observed at close-out against `11f3a30814`: `--name-only` lists the three target paths only, the porcelain status lists no untracked file, `diff --quiet` over the builder, `skill-graph.json`, `cli-external-orchestration`, `lib` and `tests` exits 0, the source-file `--name-only` and the `package.json` `--stat` print nothing. The coordinator's rerun is `scratch/coordinator-record.txt:20-28` | Met | - |
| AC-006 | REQ-006 | Given the routing-accuracy README, When the `holdout-prompts.jsonl` row is read, Then it says the file is edited by hand and how a sealed row is retired | T005's `rg` checks print what they name. The row is `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:128`. Observed at close-out: `Frozen holdout written by` prints nothing, `A sealed row is retired by deleting its line` prints 1, the row prints 1 and the em dash and semicolon count on the row prints nothing | Met | - |
| AC-007 | REQ-007 | Given the trimmed file, When T007 reruns the leak check, Then the data line at three words or more is empty and the other two summary lines equal T002's | `scratch/leak-after.txt` holds `rows with a hit in data, three words or more: []` and the two other lines equal `scratch/leak-before.txt`. Observed: `scratch/leak-after.txt:5` is the empty line, and `scratch/leak-after.txt:6-7` equal `scratch/leak-before.txt:6-7` character for character | Met | - |
| AC-008 | REQ-008 | Given every file in this folder, the README and the baseline, When the leak check's `--paths` mode reads them, Then no holdout row hits | The T007 `--paths` run prints `rows with a hit: 0 []`. Observed: `scratch/after.txt:47` reads `files scanned: 20, rows with a hit: 0 []`. It ran before the close-out edits to this folder | Met | - |
| AC-009 | REQ-009 | Given the parent phase map, When row 18 is read at close-out, Then its status is Complete | T009's `rg` check on `PS` prints 1. Observed at close-out: it prints 1, and the row is `../spec.md:133` | Met | - |

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

All nine criteria are Met on base commit `11f3a30814` with the three changed files in the working tree, from the scratch records and the read-only checks rerun at close-out.
<!-- /ANCHOR:closure -->
