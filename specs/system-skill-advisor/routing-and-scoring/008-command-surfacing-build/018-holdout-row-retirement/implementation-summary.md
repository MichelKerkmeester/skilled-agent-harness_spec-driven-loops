---
title: "Implementation Summary: Phase 18: holdout-row-retirement"
description: "Built and verified in the working tree on base commit 11f3a30814. The sealed holdout row suppressed-codex-abstain is deleted, the scorer eval baseline is recaptured with the scoring date unchanged, the holdout reads 50 of 65 and every other metric, floor and gate holds."
trigger_phrases:
  - "holdout row retirement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement"
    last_updated_at: "2026-11-13T20:21:47Z"
    last_updated_by: "generate-context"
    recent_action: "Ran the alignment battery and lanes on the rebased branch"
    next_safe_action: "Rerun alignment lanes A, C and D, then the critic and the report"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/018-holdout-row-retirement/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:386cebebf64962cec5026ce16aaeef7d19c6dbae8cd9d0af66ac5292ca99517b"
      session_id: "scaffold-018-holdout-row-retirement"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-13T20:21:47Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary: Phase 18: holdout-row-retirement

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-holdout-row-retirement |
| **Completed** | 2026-11-13 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The sealed holdout no longer holds the row `suppressed-codex-abstain`, whose prompt the cli-codex mode lists as an alias, so the holdout metric now counts 65 rows the scorer was not given instead of 66. The recaptured baseline reads 50 of 65 on holdout and holds every other metric, the scoring date and the four command floors at their before values.

### Retire one sealed holdout row and recapture its baseline

The row's one line is gone and every other line is unchanged. The scorer eval baseline was recaptured with `SPECKIT_EVAL_BASELINE_SCORING_DATE` unset, so its `capturedAt` stays `2026-10-11` and only the holdout counts, `holdoutSha256` and `capturedAtSha` moved. The row was a miss before the change (`scratch/before.txt:28`), so the correct count stays 50 and the accuracy moves from 0.7576 to 0.7692. The count-only leak check ran before and after the change: before, `suppressed-codex-abstain` was the one sealed row that hit a scorer data file at three words or more, and after, that line is empty. The routing-accuracy README row for the sealed file now says the file has been edited by hand since it was sealed and how a sealed row is retired.

All measurements below were taken on base commit `11f3a30814` with the three changed files uncommitted in the working tree.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` | Modified | One line deleted, none added: the row `suppressed-codex-abstain` |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | Modified, generated | Recaptured with `--write`: four lines changed, `capturedAtSha`, `holdoutSha256`, the holdout total and the holdout accuracy |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | The `holdout-prompts.jsonl` row says the file is edited by hand and that a sealed row is retired by deleting its line and recapturing the baseline |
| `../spec.md` | Modified | Phase map row 18 reads Complete |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The coordinator ran T001 to T008 in order on base commit `11f3a30814` and wrote the readings to `scratch/before.txt`, `scratch/after.txt`, `scratch/leak-before.txt` and `scratch/leak-after.txt`. T001 confirmed phase 016 (`ec1869dae8`) and phase 017 were committed, the three target files were clean, the build exited 0 and the live metrics equalled the committed baseline. T002 ran the leak check before any edit and its stop rule did not fire. T003 deleted the row, T004 recaptured the baseline, T005 extended the README row, T006 reran the gates, T007 reran the leak check and T008 checked the boundaries. At close-out the count-only checks, the README `rg` checks and every T008 check were rerun read-only on the working tree, and each printed what its task names. Nothing is committed.

### Deviations from the plan

| Planned | Actual | Reason |
|---------|--------|--------|
| T003 and T005 run by two DeepSeek workers | The coordinator ran both itself: T003 as the two shell commands its task line gives and T005 as the literal replacement | So that no model session handled the sealed file |
| Metadata repair only at T009 | The coordinator ran `repair-derived.cjs --apply` on this folder before T001 | An earlier spec edit had left the generated metadata stale |
| T003 sees the ratchet fail on the holdout hash and its first `grep -c` print 1 | Neither output is written to any scratch record | The task line names no record for them. The ratchet passing after T004 is recorded (`scratch/after.txt:13-15`), the failure in between is not |
| T008's checks are its evidence | Their outputs are not written to a scratch record | The task names no record. Each T008 check was rerun at close-out and printed what the task names |
| T002 and T007 verify that the leak check exits 0 | The leak records hold the probe's output but not its exit status | The command redirected only standard output to the record |
| `scratch/after.txt` names `BASE` (CHK-FIX-004) | Only `scratch/before.txt:8` names it | `after.txt` records no commit line. The recaptured baseline's `capturedAtSha` reads `11f3a30814` |
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Retire `suppressed-codex-abstain` in this packet | The operator chose it on 2026-11-13 (`../goal.md` line 176) |
| Leave the graph and the skill metadata alone | The text is the cli-codex alias both scorers route by, and the decision retires the row, not the alias |
| Delete the line rather than mark it or move it | The file was trimmed this way before, no reader needs a change and the builder already omits the id |
| Keep the scoring date in the recapture | Six other readers replay it, and a new date would move the command floors. The four floor lines held |
| Add no test | The ratchet's hash check fails after the deletion and passes after the recapture |
| Classify the finding as instance-only | The leak check over every sealed row and every command holdout row found no other row hitting a data file at three words or more, before or after |
| Apply the operator's Q6 answer as the stop rule | Only a new row at three words or more in data, or a summary line naming a row its planning reading did not, stops the phase. Neither happened (`scratch/leak-before.txt:5-7` against `spec.md` section 2) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sealed row count (`HCOUNT`) | 66 before (`scratch/before.txt:12`), 65 after (rerun at close-out, also `scratch/leak-after.txt:1`) |
| The retired row (`HROW`) | One line before (`scratch/before.txt:14`), nothing after (rerun at close-out) |
| Sealed file diff against `11f3a30814` | 1 line deleted, 0 added (`git diff --stat 11f3a30814 -- .skilled` at close-out) |
| Holdout metric (`HOLDM`) | `{"correct":50,"total":66,"accuracy":0.7576}` before (`scratch/before.txt:22`), `{"correct":50,"total":65,"accuracy":0.7692}` after (`scratch/after.txt:8`). The row was a miss, so correct stays 50 |
| Row verdict (`VERDICT`) | Before: total 66, correct 50, the row a miss with gold `none` (`scratch/before.txt:27-28`). After: total 65, correct 50, `"present":false` (`scratch/after.txt:36-37`) |
| Hashes (`HASHES`) | `capturedAt` `2026-10-11`, `corpusSha256` and `ambiguitySha256` equal before and after. `holdoutSha256` changed from `e8c637d3f59f...` to `51cb48eb8b10...`, equal to `FILEHASH` (`scratch/before.txt:16`, `scratch/after.txt:4`, `scratch/after.txt:10`) |
| Baseline lines changed | 4 added and 4 deleted (`scratch/after.txt:12`): `capturedAtSha` from `731967bc25` to `11f3a30814`, `holdoutSha256`, the holdout total and the holdout accuracy (diff of the baseline at close-out) |
| Other metrics (`OTHERM`) | Equal character for character (`scratch/before.txt:20`, `scratch/after.txt:6`) |
| Live metrics against the baseline | `EVALM` equals `BASEM` before (`scratch/before.txt:18`, `:24`) and after (`scratch/after.txt:26`, `:28`) |
| Command floors (`FLOOR`) | All four lines equal: typed `{"correct":24,"total":44}`, false offer `{"count":0,"total":35}`, attached typed combined 44 of 44, plain tune combined 28 of 45 (`scratch/before.txt:38-41`, `scratch/after.txt:30-33`) |
| Ratchet | 7 of 7 passed before (`scratch/before.txt:42-44`) and after (`scratch/after.txt:13-15`) |
| Independence gate | 6 of 6 passed before (`scratch/before.txt:45-47`) and after (`scratch/after.txt:16-18`) |
| Capture-date test | 2 of 2 passed after (`scratch/after.txt:19-21`) |
| Full advisor suite (`VALL`) | 184 of 184 files passed, 1796 tests passed and 6 skipped of 1802 (`scratch/after.txt:22-24`). T001 took no full-suite before reading |
| Overlap counts (`OVERLAP`) | The `holdout-delegation` and `delegation` pair counts all 6 before and all 5 after. The other five lines are unchanged and every `all` count is above 0 (`scratch/after.txt:38-45`) |
| Leak check before | Positive control 66 of 66 sealed and 44 of 44 command holdout. Rows with a hit 9. Data at three words or more: `suppressed-codex-abstain` (`scratch/leak-before.txt:2-5`) |
| Leak check after | Positive control 65 of 65 and 44 of 44. Rows with a hit 8. Data at three words or more: `[]`. The under-three-words and code-only lines equal the before lines (`scratch/leak-after.txt:2-7`) |
| Leak check `--paths` over this folder, the README and the baseline | `files scanned: 20, rows with a hit: 0 []` (`scratch/after.txt:47`) |
| README row | `rg` finds `Frozen holdout written by` 0 times, `A sealed row is retired by deleting its line` once, the row once and no em dash or semicolon in the row (rerun at close-out) |
| Boundaries against `11f3a30814` | Only the three target files differ under `.skilled`, `.opencode` and `AGENTS.md`. No untracked file there. The builder, `skill-graph.json`, the `cli-external-orchestration` files, `lib` and `tests` are unchanged. No source file and no `package.json` changed (T008 checks rerun at close-out) |
| Parent map row 18 | `rg -c` on `../spec.md` prints 1 |
| Strict validation of this folder | `RESULT: PASSED` at close-out |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Eight sealed rows stay as an advisory for a separate operator decision.** Two short rows, `P1-ABSTAIN-001` and `P1-PHRASE-001`, hit scorer data files under three words. Six rows hit hand-written scorer rules only: `negative-guard-following-opencode-standards`, `P0-UNC-001`, `P1-FULLSTACK-001`, `P1-PHRASE-008`, `P1-REVIEW-005` and `P1-REVIEW-006` (`scratch/leak-after.txt:6-7`). This phase retires none of them, per the operator's Q6 answer.
2. **Four P0 checklist items rest on the coordinator's own record.** The ratchet's failure between T003 and T004, the commands as run and the absence of a model session were not captured by a script when they ran. The coordinator wrote them down afterwards in `scratch/coordinator-record.txt`, with the T008 checks rerun at that time, so those lines are a first-hand account and not machine output.
3. **The `--paths` check ran before the close-out edits.** It covered this folder as it stood at T007. The close-out edits add ids, paths, hashes and counts only. Rerun `probe-leak-scan.mjs --paths` over this folder before the commit to confirm it.
4. **A reseal would bring the text back.** `build-holdout.mjs --write` would write 81 rows at planning, one of them the same prompt under `direct-alias-cli-codex`. The README row now says the file is edited by hand, and the reseal is out of scope.
5. **The classifier census pin stays stale.** `cli-classifier/benchmark/pi-transport/replay-helpers.mjs` expects 70 holdout rows, read from its code and not run. The count is now 65, and the pin is left to its owner.
6. **The alias text stays in the skill metadata and the compiled graph.** The decision retires the row, not the alias, so the graph files are unchanged.
<!-- /ANCHOR:limitations -->

---
