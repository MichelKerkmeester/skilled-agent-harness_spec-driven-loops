---
title: "Implementation Summary"
description: "The 23 old packets are rescored, the speed loop runs a second task that no template names behind a leak gate and a token verdict, and 8 rounds on four variants with 29 blind grades give one REAL or INCONCLUSIVE verdict per comparison: now054 beats pre054 on quality in all 8 rounds, and the rest is mostly INCONCLUSIVE."
trigger_phrases:
  - "benchmark redesign and remeasure implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/018-benchmark-redesign-and-remeasure"
    last_updated_at: "2026-10-26T18:30:00Z"
    last_updated_by: "conductor"
    recent_action: "Closed out: every acceptance criterion Met"
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
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-recommend-level-quiet`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-benchmark-redesign-and-remeasure |
| **Completed** | 2026-10-26 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--quiet` prints one line. The default report is unchanged. WEAK: Implemented the feature. -->

The operator now has one REAL or INCONCLUSIVE verdict per variant comparison in `scratch/report.md`, from 8 rounds on a task no template names and 29 blind grades. Packets from the tree with packet 054 beat the tree before it on the blind total in all 8 rounds; every other quality comparison, and every speed comparison but one, is INCONCLUSIVE.

### Phase 18: benchmark-redesign-and-remeasure

`scratch/rescore/rescore.py` rescored the 23 uncontaminated packets from the two earlier runs on four deterministic checks. The speed loop gained a `--task quiet|minpct` switch, a leak scan that writes `task_term_refs` per sandbox and refuses to dispatch on anything but `0`, and a paired `tok_out` verdict beside the seconds verdict. The new task, "Add a `--min-percent <N>` option to `calculate-completeness.sh`", ran at the helper's level (Level 1) on pre054, main-no054, now054 and refined. One fresh Opus medium grader scored each valid packet blind against a rubric, and the rescore ran again on the new packets.

Headline from `report.md`:

- Quality: now054 vs pre054 is REAL better, +1.9 over 8 of 8 positive pairs, with the `Verify:` ratio (1.00 vs 0.00) and residue (5.75 vs 6.50) moving the same way. refined has the highest blind mean, 25.5 of 30, but is INCONCLUSIVE against pre054 (7 of 8 positive) and against now054.
- Speed: the only REAL verdict is upkeep `tok_out`, refined vs main-no054, fewer in 5 of 5 pairs. Every seconds verdict is INCONCLUSIVE.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scratch/rescore/rescore.py`, `packets.tsv`, `residue-strings.txt`, `rescore.tsv`, `rescore.md`, `claims.tsv`, `unparsed.log` | Created | Rescore of the 23 old packets |
| `scratch/rescore/packets-minpct.tsv`, `rescore-minpct.tsv`, `rescore-minpct.md`, `residue-strings-minpct.txt`, `claims-minpct.tsv`, `unparsed-minpct.log` | Created | Rescore of the 29 new packets |
| `scratch/briefs/author-minpct.txt`, `upkeep-minpct.txt`, `task-terms.txt`, `preamble.txt`, `brief-T010.txt` | Created | The new task's frozen briefs, its leak terms and one lane brief |
| `../011-authoring-speed-research/scratch/speed-loop/lib.sh`, `loop.sh`, `step.sh`, `prepare.sh`, `summarize.py`, `README.md` | Modified | Task switch, leak scan and gate, `tok_out` verdict, docs; `step.sh` keeps `SPECKIT_DIST_AUTO_REBUILD=0` |
| `scratch/remeasure/run-20261026T164410Z-40710/`, `run-20261026T170823Z-68750/`, `combined-results.tsv`, `combined-summary.md` | Created | Copied results of both runs and their merge |
| `scratch/grading/rubric.md`, 29 `<label>.json`, `label-map.tsv`, `unblind.py`, `unblinded.tsv`, `verdicts.md` | Created | Blind grades and the quality verdicts |
| `scratch/report.md`, `scratch/review-loop.md`, `scratch/review-report.md` | Created | Operator summary and the two Opus reviews |
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `goal.md` | Modified | Closeout evidence and status |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--quiet` and the default form, then the suite. All three passed. WEAK: Tested and shipped. -->

The rescore ran first, with no new dispatch. The loop edits came next, checked with `bash -n`, dry runs of both tasks and a fresh Opus medium review in `scratch/review-loop.md`; its F1 (`term_refs` printed 0 when `rg` failed) was fixed so the scan prints `NA` and the gate refuses it, and a fix check ended `Verdict: PASS`. Once phases 015 and 016 were Complete and 017 was closing on its suite result, the operator authorized `--parallel-ok` and the 5-round run started. The loop refused main-no054 rounds 3 to 5 after its round 2 author dirtied the sandbox, so a 3-round top-up reused the refined snapshot. Grading, unblinding, the second rescore and the report followed, and a fresh Opus medium check of the report ended `Verdict: PASS` after a fix check that recomputed all 12 speed rows.

The closeout reran each acceptance check from the final tree, then ran `repair-derived.cjs --apply` and `validate.sh --strict` on this folder.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Flag over env var: callers already pass flags. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| The level the helper picks, not Level 3 | The operator chose it on 2026-10-26, and the card says not to raise the level |
| A 3-round top-up instead of a rerun | The loop refused main-no054 rounds 3 to 5 by design; a top-up of all four variants kept every round paired and reused the same refined snapshot |
| Apply REQ-006 over 8 rounds as at least 4 valid pairs, all of one sign | The rule was written for 5 rounds; requiring every pair to share a sign is stricter as pairs grow, and `report.md:22` says so |

### Deviations

- **Top-up run.** REQ-005 asks for one 5-round run with 20 author rows. The main run has 20 author rows but 17 valid; the top-up `20261026T170823Z-68750` added 12, all valid, for 29 over 8 rounds. main-no054 has 5 valid rounds, so every comparison against it rests on 5 pairs.
- **Rubric written this round.** Earlier blind rounds kept no rubric, so their totals (17.3 to 25.0) are not comparable with these.
- **Refined snapshot predates closeout example edits.** Snapshot `553ab62` was taken before the Level 2 to 3+ example edge cases and one research add-on example were edited at closeout. The core templates the author step reads did not change; the examples could matter.
- **Loop edits came from an Opus lane**, not DeepSeek V4.1 Flash max through cli-pi as `goal.md` D4 names (recorded under T008).
- **Command paths corrected.** Several verify commands named `scratch/remeasure/results.tsv`; with two runs the files live in `run-*/` and the merge in `combined-results.tsv`. `tasks.md` and `acceptance-criteria.md` record the corrected commands.
- **Commit after closeout.** T021 and the git half of AC-008 are met by the conductor's closeout commit on the worktree branch, with no push; its SHA is pinned in a follow-up, and CHK-FIX-007 stays open until then.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `--quiet` line count: 1. Default line count: 17. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `rescore.tsv` data rows; R1 now054 r1 and pre054 r1 ratios | `23`; `1.000` and `0.000` |
| Leak terms in templates, `references/templates/` and the card, final tree | `0` |
| `prep-times.tsv` rows for the new run | 5 rows, all `task=minpct task_term_refs=0` |
| Author rows, main run and top-up | 20 (17 valid) and 12 (12 valid); merged 29 valid |
| Grade files, label-map rows, unblinded rows, `rescore-minpct.tsv` rows | 29, 29, 29, 29; 1 UNPARSED claim |
| `rg -c 'REAL\|INCONCLUSIVE' scratch/report.md` | `21` |
| `^Verdict:` in `review-loop.md` and `review-report.md` | One line each, `Verdict: PASS` |
| `bash -n` on `lib.sh`, `loop.sh`, `step.sh`, `prepare.sh`; `py_compile` on `summarize.py`, `rescore.py` | rc=0 for all six |
| `summarize.py` on the earlier run 2 results, `rg -c 'tok_out verdict'` | `2` |
| Credential scan of `scratch/briefs` and `scratch/grading` | No output, exit 1 |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--quiet` does not hide stderr warnings. Redirect stderr when silence is required. WEAK: No limitations. -->

1. **The rescore is not independent of the blind score on `Verify:` clauses.** Both reward them, only the 054 templates prompt for them, and they can tell a grader which generation wrote a packet. Read the quality REAL verdict with that in mind.
2. **The REAL quality verdict includes main's own drift.** now054 vs main-no054, which isolates 054's work, is INCONCLUSIVE over 5 pairs.
3. **main-no054 has 5 valid rounds, not 8.**
4. **Level 1 packets carry fewer sample sections.** Residue counts from the new run compare within that run only, not with the old Level 3 packets.
5. **Machine load and worktree edits during the run.** The two full test suites ran during the top-up rounds, which all four variants shared. The conductor and closeout agents edited this worktree while the loop ran, so the worktree guard recorded new status lines (`tasks.md` CHK-031 and CHK-051 stay open on that); no sandbox run was contaminated.
6. **Optional review notes left open.** From the loop review: F4 (no MATCH or UNPARSED figure in `report.md`), F5 (no residue figure that excludes rows kept by instruction) and F7 (`scan_ok` does not check `task=`).
<!-- /ANCHOR:limitations -->

---
