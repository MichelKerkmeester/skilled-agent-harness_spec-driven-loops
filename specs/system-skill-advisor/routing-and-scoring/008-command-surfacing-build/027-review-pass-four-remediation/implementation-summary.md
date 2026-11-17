---
title: "Implementation Summary: Phase 27: review-pass-four-remediation"
description: "A refusal over an or-list now refuses every command in it, and a question that puts the before a command reads as a question. Both run-log writers keep where an offered command sat in the head, and a shell read of a command document counts as a start, so every stored arm was rescored and each moved start figure restated."
trigger_phrases:
  - "review pass four remediation implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/027-review-pass-four-remediation"
    last_updated_at: "2026-11-14T20:00:00Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase and wrote the pass-four synthesis"
    next_safe_action: "Coordinator commits the phase close-out and the moved pass-three report, then starts phase 026"
    blockers: []
    key_files:
      - "scratch/after-3.txt"
      - "scratch/repro-after-3.txt"
      - "scratch/rescore-delta.txt"
      - "scratch/review-rounds.txt"
      - "../review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "close-027-review-pass-four-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Phase 025 T003, T012 and CHK-040 quote the 17 cases line and the advisor README companion line that T015 and T016 changed. Phase 025 must reread both before it runs"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 027-review-pass-four-remediation |
| **Completed** | 2026-11-14 |
| **Level** | 2 |
| **BASE** | `11af224a34`, the start of every lane (T001) |
| **FIX** | `48f03b5013`, tasks T001 to T023 |
| **Second fix** | `868b185e76`, tasks T028 to T030, after review round 4b |
| **Third fix** | `db14c22bb0`, tasks T031 and T033, after review round 4c |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A person who writes `do not run /create:agent or /create:readme` no longer gets `/create:readme (start)` on the top row, and `Is the /doctor:update command safe?` no longer gets a command at all. The behaviour measure now counts a shell `cat` of a command's document as a start, so stored start figures that rested on that gap, Codex at 0 of 12 among them, were rescored and restated before phase 026 freezes its numbers.

### Phase 27: review-pass-four-remediation

This phase fixes the three P1 findings of review pass four and the P2 findings the coordinator scoped in (decision P044), then the P1 and P2 findings its own two closing review rounds reproduced. The mention reader carries a refusal or a question over an or-list to every command the list joins, including a command written as `the /x command` or with a doctor subcommand word, and reads `is the` before a command as a question. Both run-log writers keep `offeredAs`, so a command on the partner side is no longer counted as an offer. The scorer counts a shell read of a command document as a start and as a loop the run took, and drops a heredoc body whose end word holds a hyphen or a dot. The Codex reader opens the path containment resolved, and the holdout guard reads the live capture as well as the committed baseline. Five documents now say what the code does.

### Files Changed

The sixteen `FILES` of `tasks.md` and one regenerated map, from `scratch/boundaries.txt:13-30` and confirmed against `db14c22bb0`.

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Modified | `COMMAND_OR_LIST` and its use in `commandOnlyMentioned`, `the` after a bare ask word, the article and subcommand word inside a list, and questions over a list (T004, T005, T028, T029, T031) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Modified | A failing row first for every refusal, question and request shape (133, then 142, then 146 tests) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | Modified | `backfillRunLog` keeps `offeredAs` (T006) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | Modified | The partner and no-offer case for the backfill (T006) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | Modified | New exported `offerLineFields` and its one call in `runTurn` (T007) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | Modified | Two cases for `offerLineFields` (T007) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Modified | `HEREDOC_BODY` end word and the shell branch of `readDocument` (T008, T009) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Modified | Heredoc rows, four shell-step start rows and the loop case (T008, T009) |
| `.skilled/hooks/shared/session-readers/codex.mjs` | Modified | Reads `storePath`, the path containment resolved (T010) |
| `.skilled/hooks/shared/session-readers/codex.d.mts.map` | Modified | Regenerated declaration map of the reader, named by the T010 verify line |
| `.skilled/hooks/shared/tests/session-readers/codex.test.mjs` | Modified | A link inside the store read at its resolved path (T010) |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | Modified | `publishedHoldoutIds` over the baseline and the live capture (T011) |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | `offeredAs` in every field list, the shell-read start rule, the heredoc end word, the head-moved line and `--brief-only` (T012, T013, T030, T033) |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modified | The head keeps its command (T014) |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | Modified | 28 cases, not 17 (T015) |
| `.skilled/skills/system-skill-advisor/README.md` | Modified | The companion line names `parent-named only` (T016) |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Modified | The by-hand fix for a malformed router row (T017) |

Outside the code, this phase rewrote `../review/review-report.md` as the pass-four synthesis, moved the pass-three report to `../review/review-report-pass-3.md` and rebuilt the merged registry and `../review/fanout-attribution.md` with the fan-out merge.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Seven worker lanes ran test first, one task per DeepSeek v4.1 flash max session on OpenCode Go, and an Opus verifier checked each task before the next one in its lane. Each of T004 to T011 recorded a first run that failed for the reason its task line names (`tasks.md`, the evidence of each task). The coordinator then ran every suite (T018), the floors (T019), the probes (T020), the rescore of every stored arm (T021) and the boundary checks (T022), committed `48f03b5013` (T023) and ran the two closing review rounds (T024, T025). Each closing round that reproduced a finding produced a new fix commit, a fresh suite run and a fresh probe run: `after-2` and `repro-after-2` for `868b185e76`, `after-3` and `repro-after-3` for `db14c22bb0`.

### The probe lines before and after

Before is `scratch/repro-before.txt`, after is `scratch/repro-after-3.txt`. Each row shows the top three rows as skill, command and policy, with `-` where no command is attached.

| Prompt | Before | After |
|--------|--------|-------|
| `do not run /create:agent or /create:readme` | `sk-doc /create:readme start` on row 0 | no command on any row |
| `never use /create:readme or /create:feature-catalog` | `sk-doc /create:feature-catalog start` on row 0 | no command on any row |
| `do not run /deep:review, or /deep:research` | `system-deep-loop /deep:research ask` on row 0 | row 0 carries no command, row 2 keeps `/doctor:deep-loop run` |
| `use /create:agent or /create:readme` | both commands, `start` | unchanged, both commands |
| `use /speckit:plan, not /speckit:complete` | `/speckit:plan start` | unchanged |
| `Is the /doctor:update command safe?` | `/doctor:update ask` on rows 0 and 2 | no command on any row |
| `The /doctor:update command is documented in the README` | `sk-doc /create:readme start` on row 0 | unchanged, the route vocabulary gap of P047 |
| Heredoc end words `'END-SCRIPT'`, `"END-SCRIPT"`, `END-SCRIPT` | `workflowPath = skill` | `workflowPath = improvised` |
| `shellRead startState` | `{"started":false,"unsafe":false,"selfAuto":false}` | `{"started":true,"unsafe":false,"selfAuto":false}` |
| `BACKFILL` | `NO offeredAs` | `HAS offeredAs` |
| `RACE` | `recordsText [ 'OUTSIDE-STORE-FILE' ]` | `recordsText [ 'APPROVED-FILE' ]` |
| `OFFERS` count | 9 | 9 |
| `MENTION` | `SHIPPED: 46 of 46 agree` | `SHIPPED: 46 of 46 agree` |

The closing rounds added prompts. Each refusal and question below prints no command after its fix, and each request keeps its commands (`scratch/repro-after-3.txt:9-18`): `do not run /create:agent or the /create:readme command`, `do not run /create:agent, or the /create:readme command`, `skip /create:agent or the /create:readme command`, `should I run /create:agent or /create:readme?`, `is /create:agent or /create:readme better?`, `do not run /doctor:ci report or /create:readme`, `do not run /doctor:ci report or /doctor:ci scaffold` and `never use /doctor:git hooks or /doctor:skill-advisor tune`. The requests `use /create:agent or the /create:readme command` and `use /doctor:ci report or /create:readme` keep both commands.

### Every moved start line of the rescore

From `scratch/rescore-delta.txt:1-23` and the moved runs at lines 81-93, 122-128 and 147-150. The start set is `runs-pre.jsonl` with `runs-post.jsonl`, the pre set is `runs-pre.jsonl` with `runs-pre-dsh-rerun.jsonl` and the final set is `runs-final.jsonl`, all under `../007-per-runtime-behaviour-proof/scratch/`. Every moved run is a plain tune row with no decline kind, and every one moved by the shell-read start rule (T009): its line in the scorer copy with that rule undone equals its before line.

| Set | Line | Rows that moved |
|-----|------|-----------------|
| start | `claude pre start 3 of 12 -> 4 of 12, startedOfOffered 0 -> 0` | cmd-create-benchmark-plain-tune-01 |
| start | `codex post start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0` | cmd-doctor-agents-md-plain-tune-01 |
| start | `codex pre start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0` | cmd-doctor-agents-md-plain-tune-01 |
| start | `dsh post start 6 of 12 -> 9 of 12, startedOfOffered 2 -> 3` | cmd-create-command-plain-tune-01, cmd-create-diff-plain-tune-01 and cmd-doctor-ci-plain-tune-01 for the start, cmd-create-changelog-plain-tune-01 for startedOfOffered |
| start | `dsh pre start 4 of 12 -> 6 of 12, startedOfOffered 0 -> 0` | cmd-doctor-agents-md-plain-tune-01, cmd-doctor-ci-plain-tune-01 |
| start | `opencode post start 1 of 5 -> 2 of 5, startedOfOffered 0 -> 0` | cmd-doctor-ci-plain-tune-01 |
| start | `pi pre start 0 of 11 -> 3 of 11, startedOfOffered 0 -> 0` | cmd-create-benchmark-plain-tune-01, cmd-doctor-agents-md-plain-tune-01, cmd-doctor-helper-plain-tune-01 |
| pre | `claude pre start 3 of 12 -> 4 of 12, startedOfOffered 0 -> 0` | cmd-create-benchmark-plain-tune-01 |
| pre | `codex pre start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0` | cmd-doctor-agents-md-plain-tune-01 |
| pre | `dsh pre start 6 of 12 -> 8 of 12, startedOfOffered 0 -> 0` | cmd-create-agent-plain-tune-01, cmd-doctor-ci-plain-tune-01 |
| pre | `pi pre start 0 of 11 -> 3 of 11, startedOfOffered 0 -> 0` | cmd-create-benchmark-plain-tune-01, cmd-doctor-agents-md-plain-tune-01, cmd-doctor-helper-plain-tune-01 |
| final | `dsh post start 9 of 12 -> 9 of 12, startedOfOffered 11 -> 12` | cmd-deep-ai-council-plain-tune-01 |
| final | `opencode post start 2 of 5 -> 2 of 5, startedOfOffered 3 -> 4` | cmd-deep-research-plain-tune-01 |
| final | `pi post start 6 of 12 -> 6 of 12, startedOfOffered 7 -> 9` | cmd-create-changelog-plain-tune-01, cmd-deep-research-plain-tune-01 |

24 runs moved: 13 in the start set, 7 in the pre set and 4 in the final set. dsh pre reads 4 to 6 in the start set and 6 to 8 in the pre set because the pre set reads the dsh rerun log second. The other nine start lines did not move. No workflow count moved in the pre or final set (`scratch/rescore-delta.txt:24-34`), and with the start fields set aside each `arms-before` file equals its `arms-after` file, so no `unsafe`, loop, load or followed count moved in any set (T021 evidence at `tasks.md:128`, compared again at close-out). These are counts and the rule that moved them, not a gain or a loss. The parent goal log restates them in four rows (`../goal.md:285-288`) with the same lines, and the fourth row lists every quoted place they supersede. No closed phase was edited.

### The floors

`scratch/floor-before.txt` and each of `floor-after.txt`, `floor-after-2.txt` and `floor-after-3.txt` read the same five lines: typed recall 24 of 44, false offers 0 of 35, typed delivery 44 of 44, plain tune 28 of 45 and plain holdout 1 of 44. The fit counts read 8 and 0 and the scorer eval reads `[160,51,21,5]` in all four runs. `cmp` of each after file with its before file exits 0 for all three gate runs.

### The review rounds and the synthesis

Round 4b read `11af224a34..48f03b5013` and round 4c read `48f03b5013..868b185e76`, two lineages each on DeepSeek v4.1 flash max, 11 iterations in all. Round 4b's last ratios were 0 and 1, round 4c's 0 and 0.6667 (`scratch/review-rounds.txt:2-3,10-11`). Both P1 reproduced and are fixed (T028 in `868b185e76`, T031 in `db14c22bb0`). Of seven P2, five are fixed, one was fixed in the spec text and one, ARC4C-P2-001, was rejected as unreachable. The synthesis in `../review/review-report.md` counts 0 P0, 5 P1 and 25 P2 open rows from the eight pass-four lineages, by the merged registry and by each lineage's own registry alike, and closes the pass at 0 open P0 and 0 open P1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The or-list carry joins `or` and `, or` only, and a second use verb opens its own clause (P049) | `do not run /speckit:complete or run /speckit:plan` must keep `/speckit:plan`. A carry across a use verb would refuse the command the person then asks for |
| A question over an or-list is carried too (T029), past what P049 first said | Round 4b reproduced it: `should I run /create:agent or /create:readme?` printed `/create:readme` with `start` |
| A listed command may carry `the`, `command` and one plain word after it (T028, T031) | Rounds 4b and 4c reproduced a refused command kept behind each shape. A doctor command is named with its subcommand word |
| T032 was declined and reverted | Its two new rows passed before the change, because `normalize` already turns a redirect to a real file into a write. The change only moved reads after a discarded redirect from `skill` to `none` |
| Stored lines get no backfill of `offeredAs` | A replay today prints today's head, not the one the stored run saw |
| Every moved start figure is restated in new goal log rows, and no closed phase is edited (P051) | Closed phases are a record. The superseding rows name each quoted place |
| The synthesis counts the pass-four lineages only (P050) | The merged registry still lists 7 P1 rows of passes one to three that their own reports adjudicated to 0 open P1 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `VALL` advisor suite | 2027 passed at BASE (`scratch/before.txt:17`), 2052 after FIX, 2061 after the second fix and 2065 passed with 0 failed after the third (`scratch/after-3.txt:46`) |
| `VX tests/command-attach-guards.vitest.ts` | 133, then 142, then 146 passed (`scratch/after-3.txt:5`) |
| `VX` offer, behaviour, transcript and slice files | 30, 15, 172 and 10 passed (`scratch/after-3.txt:9,13,17,21`) |
| `RT`, `HT`, `DT`, `VP` | `RT` pass 96 fail 0, up from 95. `HT` 30 passed. `DT` pass 1221 fail 0. `VP` pass 45 fail 0 (`scratch/after-3.txt:24-40`) |
| `BUILD` and `TC` | exit 0 (`scratch/after-3.txt:2,43`) |
| `node --check` on the offer, runner, scorer and Codex reader | exit 0 four times, rerun at close-out |
| Floors, fit and eval | `cmp` exits 0 for each of the three gate runs (`scratch/floor-after-3.txt:1-5`) |
| Probes | As the table above, from `scratch/repro-after-3.txt:1-50` |
| Rescore | 23 start lines and 11 workflow lines, 24 moved runs all by the shell-read rule (`scratch/rescore-delta.txt:1-34`) |
| Boundaries | `AGENTS.md`, both row files and the routing baseline unchanged against BASE, no package file changed and no id in an added comment (`scratch/boundaries.txt:1-12`). Rerun at close-out against `db14c22bb0` with the same results, and the diff names the 16 `FILES` and `codex.d.mts.map` |
| Review | 0 open P0 and 0 open P1 after rounds 4b and 4c (`scratch/review-rounds.txt:1-17`, `../review/review-report.md`) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The moved start figures are thin.** They come from tuned rows, one run each, and no brief reached Codex in either arm. A rate over 5 to 12 runs moves a lot on one run, so read the restated lines as counts with their rule and not as an outcome.
2. **One blocked task, declined.** T032 is `[B→declined]`: the Opus verifier rejected its build and both files were restored to HEAD. ARC4C-P2-001 is recorded as not reachable.
3. **No lineage read the third fix.** `db14c22bb0` was checked by its own tests and the third gate run (`scratch/after-3.txt`, `scratch/repro-after-3.txt`), not by a review round, because the plan runs no round past 4c.
4. **The README statement still heads `/create:readme (start)`.** `The /doctor:update command is documented in the README` is a route vocabulary gap in `sk-doc`, recorded at P2 and not fixed (P047).
5. **Open for phase 025.** Phase 025 tasks T003 and T012 and its CHK-040 quote the `17 cases` line of `command-meaning-matching.md` and the companion line of the advisor README. This phase changed both (T015 to `28 cases`, T016 to name `parent-named only`), so phase 025 must reread them before it runs. Phase 025 was not edited.
6. **Two parent records lag this phase.** Decision P049 still says a question over an or-list is left as it is, which T029 changed. The parent goal log row `Review pass four, confirming round` says 10 iterations for rounds 4b and 4c, and the iteration records count 11. Neither was edited here.
<!-- /ANCHOR:limitations -->

---
