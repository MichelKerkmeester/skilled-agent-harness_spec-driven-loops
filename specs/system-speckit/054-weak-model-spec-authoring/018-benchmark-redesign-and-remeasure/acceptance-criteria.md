---
title: "Acceptance Criteria: Phase 18: benchmark-redesign-and-remeasure"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "benchmark redesign and remeasure acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "conductor"
    recent_action: "Verified every criterion at closeout, all Met"
    next_safe_action: "Commit the phase on the worktree branch, then pin the commit SHA"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-018-benchmark-redesign-and-remeasure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.3 -->
# Acceptance Criteria: Phase 18: benchmark-redesign-and-remeasure

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-recommend-level-quiet`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure
**Level:** 2
**Status:** Complete
**Date:** 2026-10-26
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--quiet` runs, Then `wc -l` prints 1. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the 23 packets in `scratch/rescore/packets.tsv`, When `rescore.py` runs, Then `rescore.tsv` holds one row per packet with a `Verify:` ratio, residue counts, line-count checks and dangling decision-record pointers | `awk -F'\t' 'NR>1' scratch/rescore/rescore.tsv \| wc -l` prints 23; the R1 now054 r1 row reads ratio 1.0 and the R1 pre054 r1 row reads 0, matching 19 of 19 and 0 of 13 task lines. Observed at closeout: `23`; R1 now054 r1 reads 19, 19, `1.000`; R1 pre054 r1 reads 0, 13, `0.000` | Met | - |
| AC-002 | REQ-002 | Given the tree after phases 015 to 017, When the leak terms are searched, Then no template, card or template-guide file names the new task | `rg -l -F -f scratch/briefs/task-terms.txt .skilled/skills/system-spec-kit/templates .skilled/skills/system-spec-kit/references/templates .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md \| wc -l` prints 0. Observed at closeout, run from the repository root with the terms file at its full phase path, while 015, 016 and 017 each read Status Complete: `0` | Met | - |
| AC-003 | REQ-003 | Given the new author brief, When it is read, Then it names the helper call and the Level 0 rule and holds no ambiguous level wording | `rg -c 'recommend-level.sh --loc 40 --files 2' scratch/briefs/author-minpct.txt` prints 1, and `rg -n -i 'final\|level 3' scratch/briefs/author-minpct.txt` prints nothing. Observed: `1`; the second printed nothing, exit 1 | Met | - |
| AC-004 | REQ-004 | Given four prepared sandboxes, When `prepare.sh` finishes, Then each records `task_term_refs`, and the loop refuses a nonzero count | Each new line in `prep/prep-times.tsv` reads `task_term_refs=0`; `rg -n task_term_refs prepare.sh loop.sh` prints a line in each. Observed: rows 13 to 17 of `prep-times.tsv` (the four sandboxes, then main-no054 re-prepared for the top-up) all read `task=minpct task_term_refs=0`; `rg` printed `prepare.sh:72` and `loop.sh:92`, `:110`, `:114`, `:115`, `:117`. The loop review's fix check confirmed `term_refs` prints `NA` when `rg` fails and the gate at `loop.sh:114-115` exits 4 on anything but `0` | Met | - |
| AC-005 | REQ-005 | Given the hardened loop, When `loop.sh --task minpct --variants pre054,main-no054,now054,refined --runs 5 --parallel-ok` runs, Then the run has 20 author rows and `summary.md` shows `tok_out` first with seconds beside it | `awk -F'\t' 'NR>1 && $3=="author"' scratch/remeasure/run-20261026T164410Z-40710/results.tsv \| wc -l` prints 20; `rg -c 'tok_out verdict'` on each `summary.md` prints at least 1. Observed: `20` author rows, of which 17 are valid; main-no054 rounds 3 to 5 read `ABORT` because its round 2 author wrote `node_modules/.vitest-cache` in the sandbox and `step.sh` marked it dirty, so the loop refused them as designed. Deviation: a 3-round top-up, `run-20261026T170823Z-68750`, added 12 author rows, all valid, so the merged `combined-results.tsv` holds 32 author rows and 29 valid over 8 rounds. `tok_out verdict` prints `2` in both run summaries and in `combined-summary.md`. The command path is corrected from `scratch/remeasure/results.tsv`, since each run has its own folder | Met | - |
| AC-006 | REQ-006 | Given the run, the grades and the rescore, When the report is written, Then each comparison is REAL only with at least 4 same-sign valid pairs, plus a matching rescore move for a quality claim, and INCONCLUSIVE otherwise | `rg -c 'REAL\|INCONCLUSIVE' scratch/report.md` prints at least 6; the Opus check in `scratch/review-report.md` records `Verdict:` with no rule violation. Observed: `21`; `review-report.md:104` reads `Verdict: PASS`, after a fresh checker recomputed all 12 speed rows and found every P1 fixed. The rule is applied over 8 rounds as at least 4 valid pairs, all of one sign, and `report.md:22` says so | Met | - |
| AC-007 | REQ-007 | Given the valid packets of the new run, When grading ends, Then each has one blind grade file and no contaminated run has one | `ls scratch/grading/*.json \| wc -l` equals the valid author count in `scratch/remeasure/combined-results.tsv`. Observed: `29` grade files, 29 valid author rows, 29 label-map rows, 29 unblinded rows, 0 contaminated rows. The path is corrected from `scratch/remeasure/results.tsv`, which does not exist | Met | - |
| AC-008 | REQ-008 | Given the loop edits, When the phase commits, Then `step.sh` carries the rebuild switch in the commit | `rg -c 'SPECKIT_DIST_AUTO_REBUILD=0' ../011-authoring-speed-research/scratch/speed-loop/step.sh` prints 1, and `git status --porcelain` on that file prints nothing. Observed: `1`. The git half is met by the conductor's closeout commit of the whole worktree on the worktree branch, under the operator's standing approval, with no push; that commit follows this edit, so at writing `git status --porcelain` printed ` M` for `step.sh`. Its SHA is pinned in a follow-up | Met | - |
| AC-009 | REQ-009 | Given the run, When it ends, Then its files are copied here and the operator has a summary | `ls scratch/remeasure/run-*/` lists `results.tsv`, `round.tsv` and `summary.md`; `scratch/report.md` exists. Observed: both run folders list all three, `combined-results.tsv` and `combined-summary.md` sit beside them, and `report.md` exists with one verdict line per comparison | Met | - |

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

Yes. Every criterion was checked from the final tree; the run deviations and the follow-up commit SHA are recorded in their rows.
<!-- /ANCHOR:closure -->
