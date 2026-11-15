---
title: "Acceptance Criteria: Phase 32: review-pass-five-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "review pass five remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/032-review-pass-five-remediation"
    last_updated_at: "2026-11-15T17:40:45Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-032-review-pass-five-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 32: review-pass-five-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 032-review-pass-five-remediation
**Level:** 2
**Status:** Complete
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the scorer with the write reader, When the verifier's shell probe and the `CTS` cases run, Then every in-place spelling but the Python one reads `kinds=write unsafe=true loopInit=false` and both decline lines read `startedCommand=/deep:review` | The `CTS` case failed on kind `shell` before T003 and passes after it, and the first lines of `scratch/probes-after.txt` (T003, T036). Observed: `scratch/probes-after.txt` prints `kinds=write unsafe=true loopInit=false` for the redirect, `sed -i`, `perl -pi`, `tee` and `cp` lines and `kinds=shell` for `python write`, and `CTS` reads 330 passed | Met | - |
| AC-002 | REQ-002 | Given the builder with the source and build checks, When `arena-cases.sh` and the verifier's arena probe run, Then a dirty source and a stale build exit 2 with `source_dirty` and `stale_build`, and a clean fresh source writes a three-line marker | The `CBG` cases failed with exit 0 before T007 and pass after it, and the arena lines of `scratch/probes-after.txt` (T007, T036). Observed: `arena-cases.sh` prints `A exit=2` `source_dirty`, `B exit=2` `stale_build` and `D exit=0` `marker-lines=3 marker-second-line=source_clean`, `arena-provenance.sh` prints `builder exit=2` for A and B, and the T044 tsconfig-include case passes in `CBG` (51 passed) | Met | - |
| AC-003 | REQ-003 | Given the fixed tree, When every gate and the floors run, Then every gate passes and each floor and eval line equals its before line | `scratch/after.txt`, and `cmp` of `floor-after.txt` and `eval-after.txt` with their before files (T035). Observed: `scratch/after.txt` at `d21dbc1cafe`: every gate exit 0, `VALL` 2312 passed 0 failed, `DT` 1237 fail 0, `VT` 84 fail 0, and both `cmp` runs exit 0 | Met | - |
| AC-004 | REQ-004 | Given the phase diff, When added comment and doc lines are searched and the guarded paths are diffed, Then nothing is found and nothing outside the Files to Change table, this folder and `../review/` changed | `scratch/boundaries.txt` (T037) and the commit listing (T038). Observed: `scratch/boundaries.txt` and `boundaries-round1.txt`: guarded paths diff exit 0, the three row files hash equal, no package change, 0 id comments, 0 em dashes, 0 bare semicolons, every status path in Files to Change | Met | - |
| AC-005 | REQ-005 | Given lane A's other fixes, When their cases and probes run, Then the quoted marker gives no line, the suffix pair counts 2, an escaping link exits 2, a tracked dotenv file is named, `copyArgs` returns `-c` on darwin only, the marker literal exists once, the copy-path case passes and `turnRefusal` refuses a remote before a later turn | The failing first runs of T004 to T012, the mutated run of T011 and `scratch/probes-after.txt` (T036). Observed: `scratch/probes-after.txt` prints `quoted marker commandLines []`, the suffix pair at count 2, `C exit=2 symlink_escape`, `E` with `trackedDotenv` and the `remote-guard.mjs` lines equal to before, and T005 to T014 passed the Opus verifier | Met | - |
| AC-006 | REQ-006 | Given lane K's fixes, When the counts and tests run, Then both reference rows name all ten names, the CP-003 call unsets ten, the launcher fixture sets ten, the CLI cases count 10 and the lib tree check prints nothing | The before and after counts on T015 to T019. Observed: T015 to T019 passed the Opus verifier, and `LBT` 21, `CSD` 20 and `advisor-disabled` 16 pass in `scratch/after.txt` | Met | - |
| AC-007 | REQ-007 | Given lane V's fixes, When their cases and probes run, Then a directive-only context is unchanged, a receipt follows the injected `env`, the Claude hook from source honors the canonical switch, an `agents_spawn` block reads `hook-missing vibe`, the contract test carries its new name and the hook contract names Vibe in three places | The failing first runs of T020 to T023, the verify lines of T024 and T025, and `R1-P2-002` in `plan.md` D13. Observed: `vibe-part.mjs` prints `directive-only changed: false`, `wiring-match.sh` prints `match=agents_spawn hook-missing vibe .vibe/hooks.toml exit=1` and `match=main ok vibe exit=0`, and T020 to T025 with T023a passed the Opus verifier | Met | - |
| AC-008 | REQ-008 | Given lane D's fixes, When the docs are counted and validated, Then each count reads as its task states, `PBV` and `SHAPE` pass, `DOCV` exits 0 on each doc and `META` exits 0 after the leaf files are regenerated | The before and after counts on T026 to T033. Observed: `PBV` prints `scenarios=53 violations=0`, `SHAPE` prints `pass=1`, the six `META` checks exit 0, and T026 to T033 passed the Opus verifier | Met | - |
| AC-009 | REQ-009 | Given the stored sets of phase 007, When they are rescored after lane A, Then every moved run names its rule and each quoted moved figure is restated | `scratch/rescore-delta.txt` and the `PLOG` rows or follow-up tasks of T034. Observed: `scratch/rescore-delta.txt` names the two moved before-arm runs with the write reader rule and the `unsafeNoChangedPath` move, no packet doc quotes a moved figure, and three `PLOG` rows record it | Met | - |
| AC-010 | REQ-010 | Given the fix commit, When one Opus reviewer reads its diff, Then no P0 or P1 stays open | `scratch/review/report.txt` and the record on T039. Observed: `scratch/review/report.txt` verdict FIX with one P1, reproduced and fixed in T044, then `report-2.txt` and `report-3.txt` verdict SHIP with 0 P0 and 0 P1, recorded on T039 | Met | - |
| AC-011 | REQ-011 | Given the fix diff, When round `5b` and at most round `5c` run, Then every reported P0 and P1 has a reproduction line, no round past `5c` runs and the pass-five synthesis is written | `scratch/review-rounds.txt`, the goal log row of T041 and `../review/review-report.md` (T040 to T042). Observed: `scratch/review-rounds.txt` holds one ratio line per 5b lineage with 0 P0 and 0 P1 reported, no round 5c ran, and `../review/review-report.md` holds the pass-five synthesis | Met | - |
| AC-012 | REQ-012 | Given the close-out, When each file and line `plan.md` D13 cites is searched, Then each still holds or is corrected | The `rg -n` recheck of T043. Observed: `rg -n` at close: `guards-and-hooks.md:184` and `:195` hold, `readDocument` moved to `:1379-1393` and plan D13 is corrected, `directive-lifecycle-boundary.ts:18` holds, and `git ls-files -s` finds 4 tracked links under `specs/**/scratch` | Met | - |

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

**Closeable:** No

The phase is planned and not built, so every criterion is still unmet.
<!-- /ANCHOR:closure -->
