---
title: "Acceptance Criteria: Phase 31: alignment-findings-remediation"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "alignment findings remediation acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/031-alignment-findings-remediation"
    last_updated_at: "2026-11-15T14:27:31Z"
    last_updated_by: "claude"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-031-alignment-findings-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 31: alignment-findings-remediation

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 031-alignment-findings-remediation
**Level:** 2
**Status:** Draft
**Date:** 2026-11-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the validator with `.vibe` appended, When `--self-test` and a plain run execute, Then the self-test prints three `PASS` lines and the plain run exits 0, and the allowlist line equals RUN's literal fix text | The self-test failed on the real tree before T003 and passes after it, and `rg -c -F "'.dsh', '.vibe']);"` prints 1 (T003, T017) Observed: self-test three PASS, validator OK across 85 files, allowlist byte-equal to the run fix (review Q1). | Met | - |
| AC-002 | REQ-002 | Given the two workflows, When they are counted, linted and run by hand, Then each runs the three Vibe checks, `command-tree-parity.yml` filters on `.vibe/**` twice, `actionlint` and the YAML parse exit 0 and the six lines exit 0 | The `rg -c` counts printed nothing before T004 and 3, 3 and 2 after it, and the two X01 lines of `scratch/matrix-after.txt` (T004, T019) Observed: vibe checks 3 and 3, `.vibe/**` 2, actionlint 0, YAML 0, six lines PASS, plus the shared build line a clean runner needs (T004). | Met | - |
| AC-003 | REQ-003 | Given the release note and the catalog page, When they are searched, Then neither says a mentioned command is not offered, both say an unled naming is offered, and no file under `$ADV/lib` changed | `rg -c 'only mentions'` printed 2 and 1 before T005 and nothing after it, and `G diff --quiet BASE -- $ADV/lib` exits 0 (T005, T020) Observed: `only mentions` 0 in both, the unled-naming sentence in both, `$ADV/lib` unchanged (T005, T027, T028). | Met | - |
| AC-004 | REQ-004 | Given the playbook with NC-012, CL-009 and CL-010, When the census test and the package validator run, Then the test passes at 53 and the validator prints `PASS package=system-skill-advisor` with `scenarios=53` and `violations=0` | The census test failed on each count before T006 to T008 and passes after each, and `PBV` in `scratch/after.txt` (T017) Observed: census test 2/2 at 53, PBV `scenarios=53 violations=0` (T008, T017). | Met | - |
| AC-005 | REQ-005 | Given the fixed tree, When the floors, the eval and every gate run, Then each floor and eval line equals its before line and every gate passes | `cmp` in T010, T012, T014, T016 and T018, and `scratch/after.txt` (T017) Observed: cmp equal at T010, T012, T014, T016 and T018, every gate in after.txt exit 0, VALL 2157 passed 0 failed. | Met | - |
| AC-006 | REQ-006 | Given the merge base, `origin/main` and HEAD, When the three extracts and the rebuilt dist are checked, Then BAT-01 exits 0 after the rebuild and BAT-02, BAT-06 and BAT-07 are each recorded as pre-existing with both extracts, or fixed by a new task | `scratch/battery-origin.txt` (T002) Observed: BAT-01 fresh after the rebuild, BAT-02, BAT-06 and BAT-07 fail on MB and pass on origin/main with files byte-equal to MB (T002). | Met | - |
| AC-007 | REQ-007 | Given each upheld probe, When its task and gate run, Then P02, P04 and P11 put the advisor first and P07 the doctor skill first with byte-equal floors, or the probe is declined with the moved numbers, and P01 is declined with its reason | `scratch/probe-decisions.txt` holds five lines (T010 to T016) Observed: P02, P04 and P11 kept with byte-equal floors. P07 declined with its reason (scorer floor, no number moved) and P01 declined with its reason. | Met | - |
| AC-008 | REQ-008 | Given each kept metadata change, When `META` runs, Then all six checks exit 0 and no `derived` block changed | The verify lines of T009 to T015, and `META` in `scratch/after.txt` (T017) Observed: META six exit 0 after T025, no `derived` block changed (T009 to T013 verify lines, after.txt). | Met | - |
| AC-009 | REQ-009 | Given the three scenarios, When their commands run after lane R, Then each pinned line shows, and CL-009 names its companion case or the five prompts tried | T006 to T008 and the scenario rerun in T017 Observed: every pinned line shows in the rerun after lane R, and CL-009 adds the `/doctor:speckit` companion case (after.txt). | Met | - |
| AC-010 | REQ-010 | Given the phase diff, When added comment and doc lines are searched and the guarded paths are diffed, Then nothing is found and nothing outside `FILES` and this folder changed | `scratch/boundaries.txt` (T020) and the commit listing (T021) Observed: boundaries.txt all exit 0 and empty, the fix commit lists only FILES, the two generated leaf files and this folder. | Met | - |
| AC-011 | REQ-011 | Given the fix commit, When one Opus reviewer reads its diff, Then no P0 or P1 stays open | `scratch/review/report.txt` and the record on T022 Observed: verdict SHIP and follow-up verdict SHIP, 0 P0 and 0 P1 (report.txt, T022). | Met | - |
| AC-012 | REQ-012 | Given the recheck of RUN, When it runs report-only, Then it prints `new=0`, resolves BAT-01, BAT-05 and D-01, every other in-scope P0 and P1 id has its pre-existing record or its task evidence, every remaining `still_open` id is handed back and RUN still exists | `scratch/recheck.txt` (T023) Observed: `new=0`, BAT-01, BAT-05 and D-01 resolved, RUN exists before and after, every other open id pre-existing or in handback.md (recheck.txt). | Met | - |
| AC-013 | REQ-013 | Given the close-out, When `scratch/handback.md` is read, Then it lists every P2 this phase does not build and the `.vibe/SYNC.md:115` line, each with its id, file and owner, and its citations still hold | The `rg -n` recheck of T024 Observed: every handback citation rechecked with sed at the close-out, the X-05 citation widened to `:42` and `:58`, the SYNC.md line marked as caused by this phase. | Met | - |

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
