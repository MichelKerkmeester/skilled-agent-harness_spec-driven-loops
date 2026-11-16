---
title: "Command surfacing research, segment five: merged ranking and proposed dispositions"
description: "Draft merged synthesis of the ux-5, performance-5 and cross-cli-5 lineages, run against the built phases 016 to 033 and the untuned arm, for the coordinator to review and decide."
trigger_phrases:
  - "command surfacing research segment five"
  - "untuned arm turn cap delivery and decline path research"
---
# Command Surfacing Research, Segment Five

Draft by Opus 5.5, reviewed by the coordinator on 2026-11-16 (question 9 answered, the scorer fault added)

Merged synthesis of three lineages run on 2026-11-16 against the built state at `84de3d600fa`, after phases 016 to 033: `lineages/ux-5/research.md`, `lineages/performance-5/research.md` and `lineages/cross-cli-5/research.md`. All three read phase 033's untuned arm, whose arenas were built at `b765c7a14c5`. Executor: `opencode-go/deepseek-v4.1-flash` at max effort through `cli-opencode`, eight iterations per lineage at most, convergence threshold 0.05 (`deep-research-config-segment-5.json` and each lineage's own config). ux-5 stopped as converged after 7 iterations. performance-5 and cross-cli-5 stopped at the cap of 8. The merge outputs are already in place, and this draft did not rerun the merge. `findings-registry.json` and `deep-research-findings-registry.json` are identical and hold 480 key findings against 331 at `HEAD`. The 149 new ones come from ux-5 (53), performance-5 (51) and cross-cli-5 (45). The worktree now sits at `8bc85acbf12`, a documents-only commit that closes phase 033 and keeps the step reader's session exports out of git (`033-untuned-arm-arena-run/scratch/step-reader/pick-note.txt`). Runtime paths below are relative to `.skilled/skills/system-skill-advisor/runtime/` and phase paths to the packet folder, unless written in full. Every disposition in this file is proposed and not final. Segments one to four stay in `research.md` and `research-segment-2.md` to `research-segment-4.md`.

## 1. What the build showed

Phase 033 scored the untuned arm on five runtimes and returned not shown. Pooled over 140 paired rows, the brief-on arm gained 25 and lost 15, an exact one-sided sign test of p 0.0769 (rerun). DSH started one command on a decline row, 1 of 80 on-arm decline runs, which fails the arm target and fires the B-5 trigger (`goal.md:333` and `:335`). The sealed floors held at 2 of 44 fixture and 5 of 44 real. Codex was not measured (Q075). A step reader judged the named output present on 4 of 20 followed sessions (rerun from its verdict lines).

Three findings carry the segment:

1. **Sixty of the arm's 400 turns ran to the 300 s cap, and the `capped` field shows 47.** No g2 row ran, so every turn had the 300 s chat cap. OpenCode's 26 exited 143. Devin's 19 null exits are not missing codes: every one of those sessions ran 298 to 299 s in Devin's own store, the length of a cap kill. DSH reads 0 capped, yet 13 of its 80 turns ran 297 to 298 s and exited 0. The B-5 trigger turn is one of them, at 297.8 s.
2. **The scorer's one decline start is a scorer false positive. No fresh-row fix may touch the decline offers.** The DSH session reported the offered `/deep:review` as declined 12 times, then read the document of `/create:sk-skill`. The scorer counted that read as a start because it found writes in the checkout. The coordinator's check found that each of them is a Python comparison inside a heredoc body that `redirectTargets` reads as a redirect (section 7, question 9). Under the fixed rule, the session made a lookup. Five of eight decline rows carry an offer on every runtime, through three different attach paths. ux-5's depth-phrase fix reaches 1 of those 5, not 4. Both of its guard fixes are fitted to rows of the untuned arm's fresh set, R1 to two and R2 to one.
3. **The instruments, not the brief, limit what the arm can say per runtime.** OpenCode's 80 delivery answers are unknown by construction, and its off arm is credited with 5 of 5 offers reached. The printed start rate counts a bare document read, which the goal's fixed start rule calls a lookup. 15,400 of the health folder's 17,775 duration rows come from one unit test. Hook latency and brief bytes sit inside budget on every runtime: live p95 311 ms, worst live row 1,538 ms against a 2,500 ms budget, brief median 262 bytes (all rerun).

## 2. Checks made on the lineage claims

Each number a ranked item rests on was rerun or re-read by this draft. Reruns were read-only. They covered the run lines, `summary-arm.json`, the step reader's verdict words, the OS temp metrics folder and the Claude, Devin, Pi and DSH session stores. The stores and the lineages' export copies were read for times, counts and tool names only. In the one DSH decline session this draft also scanned the bash calls after the document read for write verbs, through a scratch file it then deleted. Corpus rows were read with `jq 'del(.prompt)'` alone. No prompt field was printed, and the only session text printed was the first word of each bash line in that scan. No holdout file was opened and no model session, daemon, hook or build was started. Each result opens with one label: Reproduced, Corrected with the right value or Not checked with the reason.

| Claim | Check | Result |
|---|---|---|
| Pooled gained 25 and lost 15, p 0.0769 (phase 033, all three lineages) | `arm-evidence.txt`, the `pooled` block of `summary-arm.json` and the exact one-sided sign test recomputed | Reproduced. The chance of 25 or more of 40 is 0.0769 |
| Step reader: setup 15, folder 12 and output 4 of 20. Per runtime Claude 3, 3, 2, OpenCode 3, 2, 1, Pi 4, 3, 0, Devin 2, 2, 1 and DSH 3, 2, 0 (cross-cli-5) | Verdict words of the 20 blocks in `step-reader/report.txt`, quotes not printed | Reproduced. Output reads unclear on 11 and no on 5 |
| 48 raw cap exits on `fresh-*` rows alone, with 0 of six g2 rows cut (performance-5 rank 1) | Row ids and exits of all 401 run lines | Corrected. The 48 reproduce: OpenCode 26 at exit 143, Devin 20 null and Pi 2 at exit 143. But no g2 row ran in the arm. All 401 lines are fresh rows, so every turn had the 300 s chat cap and the g2 comparison is empty |
| Devin's 19 capped lines are a missing exit code, not slow turns (cross-cli-5 rank 3) | Creation and last-activity times of all 81 Devin sessions in Devin's `sessions.db`, read with no text column | Corrected. All 20 raw null-exit sessions ran 298 to 299 s against the 300 s cap. A child that dies on the cap's signal reports a null code on `close` (`scripts/routing-accuracy/run-command-behaviour.mjs:1075` and `:1094`), and the scorer's own comment reads a null exit as a kill (`score-command-transcripts.mjs:2035`). They are cap kills |
| 17 of Devin's 19 carry `restored: true` with no changed paths (cross-cli-5) | The same run lines | Corrected. 17 carry `restored: true` and 14 of those have no changed path. Three changed 1, 7 and 500 paths. The other 2 are `fresh-skill-04` head-move lines |
| Claude and DSH capped 0 of 80 (performance-5, cross-cli-5) | Session length of every turn from each runtime's store, times only | Corrected for DSH: 13 of 80 sessions ran 297 to 298 s and exited 0, the length of Devin's cap kills, so they were cut (inferred). Whether the runner's signal or a DSH limit ended them is not shown. Reproduced for Claude: 80 sessions ran 5 to 79 s, median 20 s |
| 45 of 47 capped turns have no recoverable duration (performance-5 rank 2) | The Devin, Pi and OpenCode stores | Corrected: 24 of 47. Devin's 19 and Pi's 2 (300 s each) sit in their stores. The OpenCode store holds none of the arm's 80 sessions and none from any arena folder, and 2 of its 26 capped turns survive as export copies |
| A capped OpenCode session ran 293 s, and an uncapped sibling ran 291 s and exited 0 (performance-5) | Timestamps only of the export copies in the lineages' git-ignored containment baselines, joined to the on-arm run lines | Corrected. `fresh-fit-02` ran 293.5 s and exited 143. The sibling `fresh-fit-03` ran 290.6 s and also exited 143 |
| Four of 20 sampled successes finish within 10 s of the cap (performance-5) | The same 20 exports and their run-line exits | Corrected: one, Devin's `fresh-fit-03` at 293 s. Five sampled sessions ran 291 to 298 s. Three were capped by exit code and DSH's `fresh-fit-02` ran 298 s with exit 0, the length of a cap cut. Over all exit-0 turns, Devin has 4 of 61 at 280 s or more and Pi none of 78 |
| Rank 1's check: OpenCode `cappedOfferRows` falls below 6 (performance-5) | `summary-arm.json` | Corrected as a check. 033 already reads 3 off and 1 on, so the check cannot show a change. OpenCode's capped start rows read 8 and 5 of 15 |
| Devin's start rate rests on 11 and 12 judgeable rows (cross-cli-5) | `summary-arm.json` | Reproduced: 2 of 11 off and 6 of 12 on |
| OpenCode delivery is unknown on all 80 lines because `briefDelivered` has no OpenCode branch, and a test pins it (cross-cli-5 rank 1) | `scripts/routing-accuracy/command-offer.mjs:220-303`, `tests/command-offer.vitest.ts:259-265` and `arm-evidence.txt` | Reproduced. The function falls through to unknown, and the test expects unknown even for records that hold the brief |
| Unknown counts as reached, so OpenCode's off arm reads 5 of 5 offers reached (cross-cli-5) | `score-command-transcripts.mjs:2353` and `summary-arm.json` | Reproduced. Claude, Pi, Devin and DSH read 0 of 5 off and 5 of 5 on. OpenCode reads 5 of 5 in both arms |
| Devin and DSH each lose one offer row to a line written before the offer field existed (cross-cli-5) | Keys of every run line | Corrected. The rows are the `fresh-skill-04` head-move lines, which the runner writes without offer or delivery fields (`run-command-behaviour.mjs:1359`). Once deduplicated they are Devin off, Devin on and DSH on. They are also the three `deliveryUnknown` cells of 1 |
| All 400 deduplicated lines carry an offer answer and none carries an `offerError` (cross-cli-5) | Keys of every run line | Corrected: 397 of 400 carry the offer fields and the three head-move lines carry none. No line carries `offerError` |
| The decline start drew an ask offer of `/deep:review` with the brief delivered and no changed path on both on-arm runs. Its session holds 12 declined lines (cross-cli-5, ux-5) | Run lines plus counts and tool names from the decompressed DSH session, with no text printed | Reproduced. The session also holds 12 mentions of the `/create:sk-skill` document path and no command line for that command. `commandStartRuns` names `/create:sk-skill` beside the offered `/deep:review`. Its 84 tool calls are bash, read and grep, with no skill call. The coordinator reran the scorer's `normalize` on it: the start is a read of the document plus four relative "writes" that are `>` comparisons inside a heredoc body, and the run lines record no changed path (section 7, question 9) |
| Codex is out by the runner's refusal and the operator's Q075 (cross-cli-5) | `run-command-behaviour.mjs:1473-1488` and `decision-record.md` Q075 | Reproduced |
| Claude's arms carry a second rules file of 27,730 bytes that the runner does not isolate (cross-cli-5 rank 5) | `ls -l` and `wc -c` of `~/.claude/CLAUDE.md`, a diff against the arena's `AGENTS.md` at `b765c7a14c5` and a stat of the usual home rule paths of the other runtimes | Corrected in substance. The file is a symlink to the operator's checkout `AGENTS.md`, 27,730 bytes. It is the same framework as the arena's own 27,750-byte `AGENTS.md` and differs on 2 lines: the Gate 2 direct-call example and the command sentence that B-6 reworded. Claude reads the framework twice. The checked OpenCode, Pi, Codex, DSH and Devin paths hold no such file |
| The printed start rate counts a bare document read while the decline count needs a write (cross-cli-5 rank 2) | `score-command-transcripts.mjs:1424-1441`, `:1477-1493` and `:2073` | Reproduced. It also contradicts the goal's fixed arm start rule, which says a read alone is a lookup (`goal.md:295`). The decline clause follows that rule. The printed start rates break it |
| Per-runtime Wilson intervals on the start rate all overlap (cross-cli-5) | Recomputed from the printed counts | Reproduced to two decimals for all ten intervals |
| One asked classification in 280 runs. `offerSeen` reads 0, 0, 1, 3 and 2 off and 0, 2, 1, 3 and 7 on (cross-cli-5) | `summary-arm.json` | Reproduced |
| On-arm command lines: DSH 7, OpenCode 2, Pi 2, Devin 3 and Claude 0, with one declined run (ux-5) | `summary-arm.json` | Corrected: Pi reads 1. The declined count is Devin's 1 per arm, but the scorer reads declines only on rows with an expected command, so it cannot see the 12 declines in the DSH refusal session |
| On-arm starts on start rows: Claude 0, OpenCode 5, Pi 4, Devin 5 and DSH 7 of 10. On ask rows 1, 0, 0, 2 and 3 of 5 (ux-5) | The `byPolicy` blocks | Reproduced as printed. The counts include capped rows (OpenCode 4 and Devin 3 of 10) and count a bare read as a start |
| A command on 7 of 20 fresh plain rows that is the same on all runtimes, with none on the 5 ask rows (ux-5) | Offer fields of every plain-row line, compared across runtimes and arms | Reproduced. The offer set is identical across the five runtimes and both arms |
| Five of the seven offers are the expected command, one is a subcommand and two are another doctor command (ux-5) | The same offers against the corpus labels | Corrected: four are the expected command, one is a subcommand of the expected family (`/doctor:agents-md check`) and two are another doctor command |
| Five of eight decline rows carry an offer on every runtime and arm, and 1 of 50 on-arm offers became a start (ux-5) | Decline-row lines | Reproduced. The 50 are on-arm, from two runs of each row. The off arm ran decline rows once, and its 25 offers are replays the model never saw |
| R1's depth phrase removes the offer on 4 of 8 decline rows (ux-5) | `lib/command-attach.ts:272-289` and `:510-512`, with the generated tables at `:15-40` and `:179` | Corrected: 1 of 8. The depth list is read only on the `system-deep-loop` route, and only the `/deep:review` offer comes through it. `/create:goal` and `/create:readme` come from the `sk-doc` route and `/speckit:ai-council` from a `system-spec-kit` scorer row |
| The depth gate is inverted: it offers on the refusal and not on the request row `fresh-fit-18` (ux-5) | Run lines and `lib/command-attach.ts:510-512` | Reproduced for the offers: `fresh-fit-18` carries none on any runtime. The cause is not checked. As the lineage itself quotes the row, its wording holds a phrase on the depth list, so the gate would pass it and the miss sits before the gate. Finding where needs a hook replay, which this draft may not run |
| R2: a single-value edit phrase removes the changelog offer (ux-5) | `lib/command-attach.ts:294-309`, `:339` and `:498-502` | Corrected. The gate first requires one of three commands, and `/create:changelog` is not one, so a phrase alone leaves the offer. The fix needs the phrase and gate membership |
| R4: measure Claude's start silence after phase 016's 44 of 44 listing (ux-5) | Phase 016's `implementation-summary.md:66` and `:155` plus the ancestry of `b765c7a14c5` | Corrected: 033 is that measurement. Its arenas were built after phase 016, and Claude started 0 of 10 start rows in both arms with 4 of the 10 offered |
| Phase 020 cut probe offers 26 to 8 and real holdout 5 to 4, phase 021 printed 17 of 17 and phase 023 found 8 of 24 sealed decline rows (ux-5) | Phase 020's `implementation-summary.md:51` and `:89`, phase 021's `:51` and phase 023's `:98` | Reproduced |
| `AGENTS.md:68` defines `run`, `start` and `ask` (ux-5) | `AGENTS.md:68` at `HEAD` | Reproduced |
| The fixed tail is 218 bytes, a 12-byte label plus a 206-byte directive (ux-5), against a 219-byte directive (performance-5) | Byte length of the two constants at `lib/render.ts:127` and `:133` | Corrected to 218 for performance-5 and reproduced at 218 for ux-5. ux-5's 71 percent uses segment four's pre-016 typed-row median of 306 bytes. On the built state's 262-byte median the tail is 83 percent |
| 17,775 duration rows: 15,400 in 77 sweep files and 2,375 real rows in 381 files (performance-5) | A read-only pass over the OS temp metrics folder. A sweep is a file whose 200 durations run 101 to 300 ms in order | Reproduced. The newest duration row is from 03:50Z on 2026-11-16, before the lineages started |
| Real rows median 12, p95 279, p99 735 and max 2,218 ms. Live rows median 124, p95 311, p99 757 and max 1,538 ms over 1,695 (performance-5) | The same pass | Reproduced |
| Claude uncached median 172 and p95 618 ms over 529 rows, cached 30 and 151 ms over 926. Pi, DSH and Devin uncached medians 160 to 165 and p95 237 to 264 ms (performance-5) | The same pass | Reproduced. Pi's median reads 159 ms by this draft's method |
| Briefs: 1,234 at mean 270.6, median 262, p95 316 and max 361 bytes, with 9 under 120 bytes (performance-5) | The same pass | Reproduced. 1,221 are 240 bytes or more. The record's `directivesSuppressed` flag is false on those 1,221 and true on the other 13 |
| Rank 3's basis: filtered live p95 311 against unfiltered 279, checked by a reader that prints n 2,375 and p95 311 (performance-5) | The same pass | Corrected. The unfiltered p95 over all 17,775 rows is 290 ms. 279 ms is the p95 of the 2,375 real rows of every status, and 311 ms belongs to the 1,695 live rows |
| The sweeps come from a timing script (performance-5) | File shape and a source search | Corrected: one unit test. `trims the default health log to 200 records` (`tests/handlers/advisor-status.vitest.ts:602-622`) writes 301 Claude live records with durations 0 to 300 into the shared root (`lib/metrics.ts:185`), which keeps the last 200 (`lib/metrics.ts:183`). Each sweep file holds 200 such rows written within milliseconds, and every suite run adds one |
| 664 unavailable rows at a median of 0 ms show that the record prices a cold failure at zero (performance-5 ranks 4 and 6) | The same pass grouped by status and error code | Corrected. 557 of the 664 are `skipped`: the hook was switched off or the prompt gate declined (`hooks/claude/user-prompt-submit.ts:317-325`, `lib/skill-advisor-brief.ts:420-434`). The fail-open rows are 104: 85 parse failures in one 250-row Claude file, 13 timeouts, 3 missing Python and 3 non-zero exits. The 13 timeouts and 3 degraded timeouts record 0 ms, all on 2026-11-15 in one file. The non-zero exits record about 2.2 s, and one of them is the 2,218 ms maximum |
| Seven probes read medians of 192 to 251 ms and p95 of 239 to 450 ms, which iteration 4 calls every committed probe (performance-5) | The 15 committed probe files of phases 003 to 005 | Corrected for every probe: 15 files are committed, with medians of 163.7 to 251.2 ms and p95 of 215.5 to 450.5 ms. Reproduced for the seven named. The live p95 of 311 ms sits inside either band |
| The cascade probe's 2,500 ms default equals the hook's child kill, so a cold first prompt can fail open (performance-5 rank 4) | `.skilled/skills/system-spec-kit/shared/embeddings/auto-select.ts:116-119`, `hooks/claude/user-prompt-submit.ts:160`, `skill-advisor-cli.ts:36` and `:45`, `lib/embedders/schema.ts:312` and `advisor-server.ts:380` | Corrected in scope. The constants reproduce. But the cascade runs in the daemon's startup and only while the stored embedder pointer is `auto` or unknown, so it is a first-start cost, not a cost of every cold prompt |
| Measured cold work of about 690 ms (performance-5) | Phase 008's `spec.md:132` | Corrected (inferred): the one cold advisor CLI call read 413 ms with the model cold, which already holds its own query embedding. Adding the separate 271 to 277 ms embedding calls counts that work twice. The reading is the operator's own and was not rerun in phase 008 or here |
| Three `UserPromptSubmit` commands at a 3 s timeout that cost three Node starts, about 111 ms (performance-5 ranks 5 and 7) | `.claude/settings.json` and `research.md:78` | Reproduced for the configuration and the arithmetic. The 36.85 ms start is segment one's and was not rerun |
| Command documents median about 1,131 and p95 about 3,143 tokens (performance-5) | `research.md:82` | Not checked: read from segment one and not rerun, because no ranked item rests on it |
| Each lineage stayed in its folder | `git -c core.fsmonitor=false status --short` and each lineage's `containment/quarantine/1/manifest.json` | Reproduced. The tracked changes are the merge outputs and a `lastUpdated` stamp in `009-ux-performance-cross-cli-research/description.json`. The three containment advisories record the step reader's session exports leaving `033-untuned-arm-arena-run/scratch/step-reader/sessions/` with the coordinator's commit `8bc85acbf12` at 04:12Z, while the lineages ran. They are not lineage writes. Each lineage's baseline still holds 20 copies of those exports, about 7.6 MB, git-ignored by `.gitignore:407-408` |
| No holdout prompt text in any lineage file | Not run | Not checked: the scan needs the holdout corpus, which this draft may not open. ux-5's `research.md` and several of its iteration files quote text they attribute to fresh rows. The fresh corpus is tracked, but phase 033 kept its session exports out of git because they hold opening prompts |

Two measures were not rerun. OpenCode's turn lengths were not, because its store holds none of the arm's sessions. The embedder's cold first call was not, because no run in this segment found the model unloaded.

## 3. Merged ranking and proposed disposition

Ranked by expected gain per unit of risk to the floors. Gain here means measurement restored or a silent failure made visible, because no lineage measured a product change that would start more useful commands. The floors are typed recall 24 of 44, false offers 0 of 35, the arm target's sealed reach floor and scorer eval `[160,49,21,5]` (goal log, catch-up merge row). None of the four build items touches a scoring input. The ranks below are new numbers. Earlier ranks are named as segment four rank N.

| Rank | Recommendation | Source | Proposed disposition |
|---|---|---|---|
| 1 | Record on every run line how long the turn ran and whether the cap fired, and mark `capped` from them | performance-5 rank 2, the aim of cross-cli-5 rank 3 and the store times in section 2 | Build in a new measurement phase. Phase 034 removed the B-5 retest, so the phase runs on its own merit |
| 2 | Write a prompt-free OpenCode delivery receipt and read it in `briefDelivered` | cross-cli-5 rank 1, segment four rank 3 | Build in the same phase, before the next run that includes OpenCode |
| 3 | Keep the advisor suite's records out of the shared metrics folder | performance-5 rank 3, moved from the readers to the producer | Build in the same phase |
| 4 | Print the shape of each start per runtime beside the start rate | cross-cli-5 rank 2 | Build in the same phase, print only. Which rule the rate follows waits on the operator (section 7, question 1) |
| 5 | Give turns that open a workflow a longer cap | performance-5 rank 1, segment four rank 4 | Decline. No further arm is planned in this packet, and a cap with no arm to run it measures nothing. Reopen when a full arm is designed |
| 6 | Split `capped` into exit 143 and exit null | cross-cli-5 rank 3 | Decline. Devin's null exits are cap kills |
| 7 | Score the head-moved lines as unscored | cross-cli-5 rank 4 | Decline. Phase 033 ADR-001 keeps and scores them |
| 8 | Read a negated depth phrase as a refusal and a positive one as a request | ux-5 R1 | Decline. It tunes on fresh rows and reaches 1 decline row, not 4 |
| 9 | Add a single-value edit phrase to the small-edit gate | ux-5 R2 | Decline. It tunes on a fresh row and would also need `/create:changelog` in the gated set |
| 10 | Split the decline target between offer fit and the model's path choice | ux-5 R5 | Decline. The target was fixed before the arm, and the scorer already prints the split |
| 11 | Run Claude alone on its 10 start rows, with or without its home rules isolated | ux-5 R4, cross-cli-5 rank 5 | Decline. 033 already measured Claude after phase 016, and the home file repeats the arena's framework |
| 12 | Bound the cascade probe by the hook budget and record elapsed time on a fail-open | performance-5 ranks 4 and 6 | Decline. The probe runs on a first daemon start only, and the zero-ms timeouts are 16 rows on one day |
| 13 | Collapse one advisor spawn on Claude | performance-5 rank 5 | Decline. An inferred 74 ms where the worst live p95 uses a quarter of the budget |
| 14 | Time all three Claude prompt hooks | performance-5 rank 7 | Decline. A diagnostic of two hooks that other skills own, with no failure measured |
| 15 | Accept more transcript shapes as an ask | cross-cli-5 rank 7 | Decline. It reaches 1 of 280 runs and rewrites earlier arms' numbers |

Not re-ranked, because the operator or a lineage settled them, or the coordinator found them after the lineages:

- The scorer's redirect parser reads a `>` inside a heredoc body as a write (section 7, question 9). The coordinator found it while reviewing this draft. It builds first, in its own phase, with a rescore of the 033 lines, because the B-5 trigger and every write boundary in the arm depend on it.
- B-5, the head reword. The operator decided it (P036, `goal.md:275`). Its trigger read Fired at first (`goal.md:335`), but phase 034 fixed the scorer misread behind it and the rescore reads decline starts on 0 of 80, so the trigger does not fire and B-5 is not built (goal rows `Arm verdict, rescored` and `B-5 trigger, rescored`).
- Codex. The operator left it out of the arm (Q075).
- A policy legend in the brief. ux-5 withdrew it, because `AGENTS.md:68` defines the words.
- Trimming the brief and lowering the 300 s cap. performance-5 declined both, and this draft agrees (section 5).

Detail for the build items and the rank 5 decline:

| Rank | Files | Measurable gain | Verify | Floor risk |
|---|---|---|---|---|
| 1 | `scripts/routing-accuracy/run-command-behaviour.mjs`: `spawnTurn` (lines 1063-1095) settles with the exit code alone and drops the signal and the elapsed time. It gains a duration and a flag set when its own cap fires, and the run line (1344-1353) records both. `scripts/routing-accuracy/score-command-transcripts.mjs`: `capped` (2035-2038) reads those fields and keeps the exit code as a fact. The two scripts' vitests | 033 counts 47 capped turns, but 60 ran to the cap by exit code or session length. The 13 DSH turns among them read as finished, the B-5 trigger turn included (store times, rerun) | A vitest spawns a child that traps the cap's signal and exits 0 after a 1 s cap, and asserts the line records the cap and a duration near 1 s. A scorer test asserts that line counts as capped. One smoke turn on each of Claude, Pi, Devin and DSH prints a duration within 5 s of its store's session length. OpenCode's store keeps no arm sessions, so there the check is that a turn ending in exit 143 carries the cap flag | None to commands or scores. Later arms' capped columns will not compare with 033's, which undercounts DSH |
| 2 | `.opencode/plugins/system-skill-advisor.js`: a prompt-free receipt where the plugin observes its emitted block (`observeEmittedAdvisorBlock`, defined at line 961). `scripts/routing-accuracy/command-offer.mjs`: an `opencode` branch in `briefDelivered` before the fall-through. `tests/command-offer.vitest.ts:259-265`, the test that pins unknown. `.opencode/plugins/tests/system-skill-advisor.test.cjs` | 80 of 80 OpenCode delivery answers are unknown, and its off arm is credited with 5 of 5 offers reached (rerun). The OpenCode store keeps none of the arm's sessions, so delivery cannot be recovered after a run | The plugin test asserts one receipt per emitted block and none when the plugin is off. The changed vitest reads true and false from receipts. In the next run with OpenCode, its off lines read `briefDelivered: false` and its off `offerReached` reads 0 | None to commands. One new file beside the health records |
| 3 | `vitest.config.ts`: the suite's environment gains a per-run `TMPDIR`, as `scripts/measure-brief-cost.mjs:167` already sets one for its children. Or a stubbed root in `tests/handlers/advisor-status.vitest.ts:602-622` alone | 15,400 of the folder's 17,775 duration rows are this test's output. A folder-wide p95 reads 290 ms with them and 279 ms without (rerun). A suite-wide fix also covers phase 015's known limitation 3, hook tests that write real logs (inferred) | One full advisor suite run leaves the file count and line count of the shared metrics folder unchanged and adds no 200-row file of 101 to 300 ms. The trim test still asserts 200 lines | None. Test environment only. The 77 existing files stay until the operator removes them |
| 4 | `scripts/routing-accuracy/score-command-transcripts.mjs`: `startState` (1477-1493) reports which shape made the start (skill call, `COMMAND:` line, host expansion, read with a write or read alone), and the summary prints the count per runtime | The printed start rate counts a read alone, which the arm's fixed rule calls a lookup (`goal.md:295`). No printed number says how many starts are bare reads | Rescoring the committed 033 lines of Claude, Pi, Devin and DSH, whose stores still hold the sessions, prints the same start rates as `summary-arm.json` and a shape split that sums to each | None. Print only, and no total changes |
| 5 | `scripts/routing-accuracy/run-command-behaviour.mjs`: `CAP_MS` (78-81) and `capForRow` (964-965), which gives 900 s to g2 rows only | A hypothesis. 26 OpenCode, 19 Devin, 2 Pi and 13 DSH turns ran to the cap, and OpenCode lost 8 and 5 of its 15 start rows. Devin's capped sessions were last active at 298 to 299 s (store times). No run measured how many would finish with more time | In that arm, fewer than 60 turns end at the cap and OpenCode's capped start rows fall below 8 and 5 | None to commands. Token cost: a capped turn may run up to three times longer, on runtimes whose median session already spends 715K tokens (OpenCode) and 729K (DSH) (`decision-record.md` Q063) |

Why each decline, and what would reopen it:

| Rank | Why declined | Reopen when |
|---|---|---|
| 6 | All 20 raw null-exit Devin sessions ran 298 to 299 s. A split by exit code would label cap kills as something else. Rank 1 names the cause from the duration and the cap instead | Not as written |
| 7 | ADR-001 in phase 033 keeps and scores the four head-moved turns, because the row's expected top is `sk-git` and a history operation may be its task. All three Devin head-move turns also ran to the cap | A future arm's design reopens head-move handling |
| 8 | The fix is fitted to `fresh-decline-refusal-02` and `fresh-fit-18`, so it tunes the advisor on the untuned arm's fresh rows. By code it reaches only the `/deep:review` offer, and the request row's miss sits before the gate it would change | A blind row set that the fresh arm never used, with its own before and after capture |
| 9 | The fix is fitted to `fresh-decline-small-edit-02`. A phrase alone cannot fire the gate, because `/create:changelog` is outside the three gated commands | Same as rank 8 |
| 10 | The target was fixed before the first session (P033, `goal.md:272`). `commandStartRuns` already prints the started command beside the offered one, so the B-5 phase can read the split with no code | Not as a target change |
| 11 | 033 measured Claude after phase 016's 44 of 44 listing: 0 of 10 start rows in both arms, with 4 of them offered. The home file is the same framework as the arena's `AGENTS.md` and differs on 2 lines | The operator asks for the cause (section 7, question 5) |
| 12 | The cascade runs only in the daemon's startup while the embedder pointer is unresolved. The timeouts recorded at 0 ms are 16 rows, all on 2026-11-15 in one file. No reader uses their elapsed time | Timeouts recur in real workspaces on several days |
| 13 | The saving is inferred from segment one's 36.85 ms start cost. Claude's uncached p95 of 618 ms uses 24.7 percent of the 2,500 ms budget | A real workspace's hook p95 nears the budget |
| 14 | `spec-gate-classify.mjs` and `context-nudge.mjs` belong to other skills, and no host timeout was measured on either | A host timeout shows on either hook |
| 15 | The arm holds one asked classification in 280 runs, and a wider rule changes earlier arms' published numbers | An arm design that scores the ask path |

## 4. Answers to the carried questions

### (a) The B-5 trigger and the decline path

Answer: the scorer's one decline start, its write unconfirmed, was the model's own substitution in a turn that ran to the cap. A head reword cannot remove the five decline-row offers.

- DSH's on-arm run 1 of `fresh-decline-refusal-02` drew an ask offer of `/deep:review`, and the brief arrived. The session's own lines report that command declined 12 times. It then read the document of `/create:sk-skill` (12 path mentions and no command line for it). The session made no skill call. The scorer's start is that read plus writes that are heredoc comparisons misread as redirects, so under the fixed rule the session made a lookup (section 7, question 9). The session ran 297.8 s and its line reads exit 0. All three DSH runs of this row ran 297 to 298 s.
- The other 49 on-arm decline offers drew no start. After phase 034's scorer fix, none of the 50 did: decline starts read 0 of 80, so the B-5 trigger does not fire and the retest this draft weighed falls away.
- Five of eight decline rows carry an offer on every runtime and in both arms, through three attach paths:

| Row | Kind | Offer | Attach path |
|---|---|---|---|
| `fresh-decline-refusal-01` | refusal | `/create:readme` (start) | `sk-doc` hub route |
| `fresh-decline-refusal-02` | refusal | `/deep:review` (ask) | `system-deep-loop` hub route, past the depth gate |
| `fresh-decline-question-01` | question | `/create:goal` (start) | `sk-doc` hub route |
| `fresh-decline-question-02` | question | `/speckit:ai-council` (ask) | `system-spec-kit` scorer row |
| `fresh-decline-small-edit-02` | small edit | `/create:changelog` (ask) | `sk-doc` hub route, outside the small-edit gate |

The offers come from the run lines and the kinds from the corpus, read with `jq 'del(.prompt)'`. The attach paths come from `lib/command-attach.ts:15-40`, `:179`, `:339` and `:510-512`.


### (b) What the 300 s cap took from the arm

Answer: every row ran under the 300 s chat cap and 60 of 400 turns ran to it, but the arm's `capped` field counts 47, because DSH's cap-length turns exit 0.

| Runtime | `capped`, off and on | Ran to the cap, by session length | Exit-0 turns at 280 s or more | Capped start rows, off and on |
|---|---|---|---|---|
| claude | 0 and 0 | 0, longest turn 79 s | 0 of 80 | 0 and 0 of 15 |
| opencode | 15 and 11, exit 143 | Not measurable, store empty. The 2 exports ran 291 and 293 s | Not measurable | 8 and 5 of 15 |
| pi | 2 and 0, exit 143 | 2, at 300 s | 0 of 78 | 1 and 0 of 15 |
| devin | 10 and 9, exit null | 19 (20 raw lines), at 298 to 299 s | 4 of 61 | 4 and 3 of 15 |
| dsh | 0 and 0 | 13, at 297 to 298 s, all exit 0 | 16 of 78, 13 of them at cap length | 0 and 0 of 15 |

Sources: run lines and `summary-arm.json`. Session times come from Devin's `sessions.db`, the Claude and Pi transcripts and the DSH session records, read without text.

- The 026 and 033 spec documents set no turn length. The design's cap of 900 counts sessions (026 `spec.md:120`), so every fresh row took the runner's 300 s chat default (`run-command-behaviour.mjs:964-965`).
- The exit code differs by runtime because each CLI meets the cap's signal its own way. The runner's spawn sends it at 300 s (`run-command-behaviour.mjs:1075`). OpenCode and Pi exit 143. Devin dies from it, so Node reports a null code (`:1094`). DSH's 13 turns end at the cap's length with exit 0, and whether the runner's signal or a DSH limit ended them is not shown.
- The cost lands on the start rates. A capped start row leaves the denominator, so OpenCode's rate rests on 7 and 10 rows and Devin's on 11 and 12. DSH's cut start rows count as judged.
- The cap also shapes the step reader. Five of its 20 sampled sessions ran 291 to 298 s, and three of its five no-output verdicts are among them. The 11 unclear verdicts sit on sessions that ended between 15 and 261 s, which fits the goal log's reading that sessions stopped at a setup question (`goal.md:336`).
- Hook time plays no part. A 311 ms live p95 is 0.1 percent of a 300 s turn.

### (c) What each runtime's numbers can carry

Answer: the per-runtime numbers measure document access under unequal instruments, so no runtime's start gain can be attributed to the brief.

| Runtime | Brief delivered | Followed, off and on | Named output, step sample | What limits the reading |
|---|---|---|---|---|
| claude | 80 answered | 4 and 6 of 28 | 2 of 4 | Sessions of 5 to 79 s. None of 10 start rows started, 4 of them offered. Reads the framework twice |
| opencode | 80 unknown | 11 and 13 of 28 | 1 of 4 | No delivery reader, so the off arm counts 5 of 5 offers reached. 26 turns capped. Sessions gone from the store |
| pi | 80 answered | 13 and 14 of 28 | 0 of 4 | All 4 sampled outputs unclear, on sessions of 41 to 79 s |
| devin | 78 answered, 2 unknown | 24 and 24 of 28 | 1 of 4 | 19 cap kills that read as null exits. Start rate over 11 and 12 rows |
| dsh | 79 answered, 1 unknown | 18 and 23 of 28 | 0 of 4 | 13 cap-length turns count as finished. Holds the one decline start |
| codex | Not measured | None | None | Left out by the operator (Q075) |

The unknown answers on Devin and DSH are the `fresh-skill-04` head-move lines.

- Claude's start silence answers segment four's question 3 for the fresh set. After phase 016's 44 of 44 listing, Claude started none of its 10 start rows in either arm, with 4 of them offered. In the on arm it ran no workflow on 21 of 28 owned rows, and its sessions run a median 20 s. The cause is not established (section 7, question 5).
- The start rate and the fixed rule disagree. The printed start rate and the `byPolicy` counts come from `startState`, which counts a read alone (`score-command-transcripts.mjs:1483`). The goal's fixed arm start rule calls a read alone a lookup (`goal.md:295`), and the decline clause follows it through `startedCommand` (`:1424`). So ux-5's per-policy contrast, Claude 0 of 10 against DSH 7 of 10, counts document access rather than starts under the fixed rule. Rank 4 prints the split. LOGIC-SYNC REQUIRED: the fixed rule contradicts the scorer's start rate (section 7, question 1).

### (d) Brief bytes and hook latency

Answer: neither limits the brief, and nothing in either is cheap to cut.

| Measure | Value |
|---|---|
| Hook, 1,695 live rows | Median 124, p95 311, p99 757, max 1,538 ms |
| Claude uncached, 529 rows | Median 172, p95 618 ms |
| Pi, DSH and Devin uncached, 141 rows | Medians 159 to 165, p95 237 to 264 ms |
| Briefs, 1,234 rows | Mean 270.6, median 262, p95 316, max 361 bytes |
| Fixed tail | 218 bytes, 83 percent of the median brief |

Sources: the OS temp metrics folder with the 77 sweep files left out (rerun) plus `lib/render.ts:127` and `:133`.

The worst live row uses 61.5 percent of the 2,500 ms budget. The 2,218 ms maximum is a Claude fail-open with a non-zero exit that sent no brief. The record's `directivesSuppressed` flag is false on 1,221 of the 1,234 briefs and true on 13, so the tail went out on all but 13 (rerun). The tail is the comment-hygiene hard block that segment one kept (`research.md:127`).

### (e) Segment four's open questions

- Question 2, another behaviour arm with OpenCode: none is planned. The B-5 retest fell away with phase 034's rescore. Rank 2 is built so that any later run with OpenCode answers delivery.
- Question 3, Claude's create rows after phase 016: answered in (c).
- Question 5, who writes small health files: one writer to the shared folder is now named, the trim test behind rank 3. The 13 marked records in one- or two-record files are a different shape and stay open.
- Question 6, the embedder's cold first call: still UNKNOWN. The cascade probe narrows to a first daemon start, and the 690 ms cold figure counts the cold embedding twice (inferred).
- Questions 1, 4, 7 and 8: not addressed by these lanes.

## 5. Eliminated alternatives

- Splitting `capped` by exit code: Devin's null exits are cap kills (rerun from its store).
- Reading DSH's exit 0 as a finished turn: 13 of its turns ran to the cap's length.
- A runtime-keyed cap: Claude's longest turn was 79 s, so a key by runtime misses the turns that need time. performance-5 ruled it out too.
- Filtering sweeps in every reader: one test produces them, so the fix belongs at the test.
- Treating the 664 unavailable rows as cold failures: 557 of them are deliberate skips.
- Fixing the decline offers on the fresh rows: that tunes the advisor on the untuned arm.
- Restating the decline target after the arm: it was fixed before the first session.
- A Claude isolation arm to test a second rule book: the home file is the same framework.
- Rescoring OpenCode's committed lines for delivery: the store holds none of the arm's sessions.
- Ranking runtimes by start gain: every pair of intervals overlaps (rerun).
- Trimming the brief, lowering the 300 s cap and a policy legend in the brief: declined or withdrawn by the lineages, and nothing measured here reopens them.

## 6. Convergence

Values confirmed from each lineage's `deep-research-state.jsonl`.

| Lineage | Iterations | Stop reason | Novelty per iteration |
|---|---|---|---|
| `ux-5` | 7 | `converged`, 4 of 4 questions answered | 0.60, 0.75, 0.70, 0.45, 0.40, 0.85, 0.20 |
| `performance-5` | 8 | `maxIterationsReached`, 5 of 5 questions answered | 0.83, 0.92, 0.93, 0.75, 0.70, 0.72, 0.75, 0.60 |
| `cross-cli-5` | 8 | `maxIterationsReached`, 5 of 5 questions answered | 0.75, 0.80, 0.70, 0.65, 0.70, 0.85, 0.80, 0.35 |

No lineage came near 0.05. ux-5's stop is convergence on question coverage, with a last novelty of 0.20. performance-5 reports that its coverage-graph stop was blocked on source diversity, so the cap ended it. cross-cli-5 ended on the cap with its questions answered.

Segment five has not converged against the 0.05 threshold, and segments one to four did not either. It has converged on what a research lane can still measure. Every open item now needs a build (ranks 1 to 4), a full arm (rank 5), a live Claude run or an operator answer. The largest corrections in this draft came from session times the lanes could have read and did not: Devin's cap kills and DSH's 13 cap-length turns. A sixth segment would find more only with a new arm to read. That is this draft's reading of the evidence. A lever that a lane could measure without a build or an arm would change it.

This draft proposes no segment six. It proposes recording the goal's research criterion as converged on coverage, with the 0.05 threshold never reached.

## 7. Open questions

1. Which start rule should the printed per-runtime start rate follow? LOGIC-SYNC REQUIRED: the goal's fixed arm start rule calls a read alone a lookup (`goal.md:295`), while `startState` counts it as a start (`score-command-transcripts.mjs:1483`). The verdict reads not shown either way, because its p value is 0.0769. Its decline clause follows the fixed rule, and whether the one decline start meets that rule is question 9. Owner: the operator. Rank 4 prints the split meanwhile.
2. Should the B-5 retest run as decided? Answered by phase 034: no. The trigger rested on a scorer misread, and the rescore with the fixed scorer reads decline starts on 0 of 80, so the P036 condition is not met and B-5 is not built.
3. Will a full behaviour arm run again in this packet? Yes means rank 5 enters its design with its token cost. Owner: the operator.
4. What ended DSH's 13 cap-length turns, the runner's signal or a DSH limit? Owner: rank 1's first smoke run.
5. Why does Claude start none of its 10 start rows after phase 016? Owner: the operator, if a Claude-only diagnostic run is wanted. The facts are in section 4 (c).
6. Should the 77 sweep files in the OS temp metrics folder and the 20 session-export copies in each lineage's containment baseline be removed? Both sit outside git, so removal cannot be undone. Owner: the operator.
7. What wrote the 85 parse failures in one 250-row Claude health file and the 16 timeouts recorded at 0 ms on 2026-11-15? No lineage asked. Owner: the next reader of advisor health.
8. Carried from segment four and not addressed here: the lexical half of segment four's rank 1 (its question 1), real use of the local scorer (question 4), the embedder's cold first call (question 6), Codex under `workspace-write` (question 7) and the three typed policy labels (question 8). Owners as segment four named them.
9. Did the trigger session write inside the checkout? Answered by the coordinator, 2026-11-16: no. The scorer's `normalize` turned run 1's session into 88 events, 7 of them writes. The 3 outside the checkout go to `/tmp`. The 4 inside are the relative targets `0` (three times) and `127:`. Each comes from a `>` in a Python comparison inside a heredoc body, `len(...)>0` and `ord(...)>127`, which `redirectTargets` reads as a redirect because, unlike `shellReadTargets` and `shellWriteTargets`, it does not strip heredoc bodies (`score-command-transcripts.mjs`, `HEREDOC_BODY`). `insideCheckout` counts any relative path as inside the checkout. That made the boundary that let `startedCommand` count the document read as a start. Run 2 holds one target of the same kind, `b[1]-a[1]`. Both run lines record no changed path. The check printed only event kinds, target names and a letter-masked context around each `>`, and no session text (scripts `q9-write.mjs`, `q9-mask.mjs` and `q9-gt.mjs` in the coordinator's scratchpad). So the arm's decline starts read 0 of 80 under the fixed rule, and the B-5 trigger rests on a scorer fault. A scorer fix and a rescore go to a new phase before anything is built for B-5.
