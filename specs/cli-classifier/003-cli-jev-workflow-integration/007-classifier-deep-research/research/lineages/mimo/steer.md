# mimo lead: review annotations and steering

**READ FIRST, for iteration 10, mimo-10: kill criteria as printed numbers (lead, after iteration 9).** Iterations 8 and 9 carried the numbers below uncorrected. Correct them before printing any kill line:
1. Do not drop the validator-residue flagger for "an empty population". Iteration 8's zero is a path artifact: Edit and Write paths are absolute (all 1,538 start with `/`), while the folder tokens are relative (`count-validator-residue2.py:26`, `:79`). The frame is 193 passing invocations followed by any `.md` edit (`results-mimo-08.txt:6`), not yet folder-scoped. Its status is unmeasured, not drop.
2. The stage-2 replay saves `ROUTER.md` reads: 68,335 + 613,586 bytes over 40 days (`results-mimo-04-buckets.txt:47`, `:55`), about 119 KB a week plus the re-scoring. It does not save 6.3 MB a week, because the chosen SKILL and reference leaves still load.
3. The comparison has 265 distinct rows, not 289: all 24 ambiguity prompts sit inside `labeled-prompts.jsonl`. Its PASS line must use a one-sided confidence bound on the paired gap, not the observed gap.
4. No minute figure at the 98 s whole-turn p50. Use tool_use-to-tool_result gaps, or mark the figure as an estimate.
5. The hook retention cap has no repository seam (the store is host-owned) and no context effect, so leave it out of the survivors. sk-prompt ran about 3.5 times a week (20 `prompt-improver` dispatches in 40 days). sk-design mode routing is compiled (`resolve.cjs:36-44`).
6. Deem's kill lines, each as printed text with a threshold: the health check requires a `torch` backend, not `stub` (`deem-local.md:70`); p95 against the measured 62.8 to 78.5 ms (`:36-38`); footprint against 3,368 MB (`:43`); startup against about 10 s (`:44`); agreement with gold per the deciding line; and a manual rollback plus a keep-rule re-check whenever `deem-ctl status` shows a new model commit (`:63`, `:65`).
7. For each kill line, say whether it can be evaluated today with zero calls. Read the closing lineage summaries at the end of grok's, deepseek's, glm's and swe's `steer.md` first.
8. In "Read first", quote the newest review heading you saw (it should be "Review of iteration 9"). Save every count to a new results file.

**CORRECTION to ALL-7:** dedupe token USAGE by message.id (usage repeats on each record), but count content blocks (tool_use, tool_result sizes) across ALL records; never keep only the first record per message.id. Recompute Q2-Q4 before building on them.

Written by the mimo lead (Opus 5.5 high) for the synthesis leaf. Each entry reviews one iteration. The steering notes are for any later iteration that reads this file. They name gaps and never supply conclusions.

## Review of iteration 1

Verdict: **adequate**. Angle mimo-01 was taken, and the iteration checked `steer.md` (absent at the time, `iteration-001.md:5`). The per-turn token baseline (Q1, Q5) is new and sound. The tool-call counts behind Q2 to Q4 are undercounted, and the claim that hook-injected context is unmeasurable is refuted by the transcripts.

- STRONG-FINDING: per-turn carried context has a p50 of 384,219 and a p95 of 887,519 cache-read tokens over 66,498 unique `message.id`s (`results-mimo-01.txt:12`, `:15`). The usage repeats 2.3 times per message (`:11-12`). The lead did not rerun the count.
- DEFECT: tool_use blocks are counted only inside the dedupe branch (`count-context-baseline.py:116-140`). Every block after a message's first record is skipped. A read-only lead recount of unique tool_use ids across the same 93 files gives Read 1,986 against the reported 342 and Bash about 58,300 against 12,172 (`results-mimo-01.txt:19`, `:21`). This voids Q2 (calls per prompt), Q4 (29 re-reads, 8.5%), the Read classes and N-mimo-01-2's baseline.
- DEFECT: the script globs only top-level `*.jsonl` (`count-context-baseline.py:162`). The subagent transcripts live in `<session>/subagents/` (1,003 files, lead count), so "0 subagent files" (`results-mimo-01.txt:4`) is an artifact of that glob.
- DEFECT: hook context is recorded as attachment records. In the largest main transcript, `hook_success` carries 73.9% of attachment bytes and `hook_additional_context` 5.1% (lead count, type names only). The script reads a non-existent `hookAdditionalContext` field (`count-context-baseline.py:106-109`). This refutes "hook-injected context 0" (`iteration-001.md:75-79`), and it refutes the claim that the 71.3% attachment share is a surface no classifier prunes (`:84-85`).
- WEAK-CLAIM: "no ROUTER.md leaf was ever read" (`iteration-001.md:61`, `:111-114`) counts the Read tool only. 293 Bash tool_use records mention `ROUTER.md` and 2,738 mention `SKILL.md` (a lead rg count: mentions, not proven reads).
- DRIFTED-CITE: every `script:` citation is off. Cutoff `:22` is `:17`, the filter `:92-94` is `:87-90`, dedupe `:123-130` is `:113-123`, the sidechain split `:187-196` is `:162-175`, the output `:199-241` is `:177-227` (the file has 231 lines), `path_class` `:36-48` is `:29-42` and the human-prompt test `:155-159` is `:143-150`. Resolved: `results-mimo-01.txt:15`, `:54` and `.claude/settings.json:47` (it holds `additionalContext`).
- WEAK-CLAIM: N-mimo-01-1 is typed `score` in its Idea row and gated as a `choice` elsewhere. Its verdict sentence ("28.6% of ... 28.6% of 649 MB") is garbled (`iteration-001.md:122`, `:132`).

## Steering for next iterations (2 and 3)

- Before mimo-04 cites any tool count, fix the harness: count tool_use blocks over all records, deduplicated by tool_use id rather than by message id. Walk `*/subagents/*.jsonl` and report them separately. Bucket attachment bytes by `attachment.type`. Rerun, and add a new results file rather than overwriting `results-mimo-01.txt`.
- Measure hook injection as a surface: bytes per `hook_additional_context` and per injecting `hook_success`, by hook event. That is the in-repo seam for skill-advisor briefs, and it is priced in tokens off the 384,219 carry.
- Count file loads through Bash too (`cat`, `sed -n`, `head` on a path class), and label mentions apart from reads.
- Carry the Q1 baseline forward unchanged. Treat the Q2 to Q4 numbers as void until they are recounted.
- For mimo-02 and mimo-03: keep W1 independence, bound the review-corpus pattern up front and cite the script at its actual lines.

## Review of iteration 2

Verdict: **adequate**. Angle mimo-02 was taken, and the iteration read `steer.md` and applied the ALL-7 correction: `count-context-baseline2.py:101-107` dedupes usage by `message.id`, and `:108-117` counts tool_use across all records by tool_use id. `count-validator-residue.py:63-105` has no first-record gating. The validator-run residue is new ground. The problems are citations and one misread baseline.

- STRONG-FINDING: 8,364 validator commands, of which 8,251 did not error, and 354 of those were followed by a `.md` Edit or Write within 6 assistant records (`results-mimo-02.txt:2-10`). It is the first counted post-pass residue. The lead did not rerun it.
- STRONG-FINDING: the recount confirms Read 1,984, Bash 58,109, re-reads 598 and `hook_additional_context` 12,152,899 bytes over 19,588 events (`results-mimo-01-recount.txt:14`, `:16`, `:63`, `:69`).
- DRIFTED-CITE: every `r2:` line is wrong while the values are right. Read is `:16` (not `:21`), Bash `:14` (not `:18`), calls per prompt `:54` (not `:44-46`), re-reads `:63` (not `:57`), hook context `:69` and `:160` (not `:65`, `:128`), the subagent header `:112` (not `:83`), Bash mentions `:109-110` (not `:79-81`), subagent re-reads `:152` (not `:119`) and the Q1 baseline `:10` (not `:15`).
- DEFECT: the claim that 2,075 severity rows "confirm R22's premise" (`iteration-002.md:82-84`, `:160`) misreads R22. R22's 50 labels are HVR reader-needed voice passages (BASE2 `research.md:711-716`), not review findings on correctness or traceability, which are mostly code findings and not tied to a passed document.
- WEAK-CLAIM: Q2's "findings on documents that had passed validation" never checks that the reviewed target was a passed document. The category counts are all review findings.
- WEAK-CLAIM: `VALIDATOR_RE` (`count-validator-residue.py:24`, `:76`) matches any Bash command that mentions a validator, including grep, cat and sed on the script. A pass is taken as `is_error` not true (`:101`), which is exit status only. The window counts records, not messages, and "any `.md` edit" is not "the same file". The 354 is an upper bound.
- WEAK-CLAIM: "0.8 x 62 = 50 true flags" (`iteration-002.md:105-107`) treats precision as recall and assumes all 354 events need a reread.
- WEAK-CLAIM: 598 re-reads (30.1%) include the Read that must precede an Edit, reads after a compaction and offset or limit reads. That is a ceiling, not waste.

## Steering for next iterations (3 and 4)

- Cite every results line by `grep -n` on the file just before writing it. Two iterations in a row drifted.
- mimo-03: count rows per labeled set from the files (`labeled-prompts.jsonl` 195, `holdout-prompts.jsonl` 70, `ambiguity-prompts.jsonl` 24, lead `wc -l`), and pre-register one deciding line.
- Before mimo-04 prices re-reads, split them into edit-preceding, post-compaction and partial reads.
- Before mimo-08 uses the 354, restrict the validator regex to invocations, and require the edited path to sit under the validated folder.
- Keep R22 (HVR voice labels) apart from review-finding labels in every sentence.

## Review of iteration 3

Verdict: **strong**. Angle mimo-03 was taken, the iteration read `steer.md` and applied the grep-before-cite rule, and its `results-mimo-03-power.txt` citations all resolve. It is the first pre-registered two-backend comparison, with a power table and a calibration split. Neither baseline had one.

- STRONG-FINDING: the sign-test power table (`results-mimo-03-power.txt:1-13`) reproduces R1's 0.68 point (`:10`, BASE2 `research.md:45`). The unpaired gap sizing (`:14-17`) shows that about 10 points is the finest accuracy gap the corpus resolves.
- DEFECT: "combined 289" double-counts. All 24 `ambiguity-prompts.jsonl` prompts also appear in `labeled-prompts.jsonl`, and holdout overlaps neither (lead `comm` on the prompt fields). The distinct total is 265, so `results-mimo-03-power.txt:11-13`, `:19` and `iteration-003.md:25`, `:136-137` overstate the rows.
- WEAK-CLAIM: the deciding line "PASS iff gold-accuracy gap ... at most 10 points" (`iteration-003.md:81-83`) tests the point estimate. Non-inferiority needs the one-sided confidence bound on the paired gap to clear -10 points. As written, an underpowered run can PASS.
- WEAK-CLAIM: a PASS on routing prompts is said to license "local-classifier features" (`iteration-003.md:122`). It covers routing `choice` only. The validator-residue and pruning ideas (N-mimo-01-1, N-mimo-02-1) need their own gold (spec risk row, `spec.md` "ranks no Deem feature above later without a measured accuracy set").
- WEAK-CLAIM: the calibration row minimums (`results-mimo-03-power.txt:18`) are fixed constants, not arithmetic. Label them as rules of thumb.
- WEAK-CLAIM: gold semantics are unpinned. In `labeled-prompts.jsonl`, `skill_correct` is yes or no (177 and 18, lead count), not a skill name. The ambiguity slice copies `skill_top_1` from those rows (`derive-ambiguity-slice.mjs:80`), and holdout sets `skill_top_1` from the expected skill (`build-holdout.mjs:63`, `:83`, `:94`). Say which field is gold per set and how the 18 `no` rows are handled.
- DRIFTED-CITE: "rescaled peak probability" at `DEEM/eval/tare/README.md:22-23` points at the probe table. The formula is `deem_server.py:615` (`confidence = 2*max(value,1-value)-1`). Resolved: `deem_server.py:533-540`, Tare README `:26-32`, BASE2 `research.md:233`.

## Steering for next iterations (4 and 5)

- mimo-04 (W2): read the newest sibling iterations first and name them in the Sibling check. Price each seam against the carry at `results-mimo-01-recount.txt:10`, and use the steered re-read split.
- Carry the comparison forward with 265 distinct rows, a confidence-bound deciding line and a per-feature gold requirement.
- mimo-05 (sk-prompt): start from BASE2 rows 52 and 63 and count invocations per week from the transcripts, using the all-records rule.
- mimo-06 (sk-design): verify from code whether mode routing is already compiled (`resolve.cjs:36-44` and the compiled-route script), whether `sk-design/SKILL.md:202-203` is stale, and whether only leaf selection inside a mode is still prose. A classifier can only earn the prose part.

## Review of iteration 4

Verdict: **adequate**. Angle mimo-04 was taken, and the iteration read `steer.md`, but a copy from before the iteration 3 review: it says "unchanged since its iteration-2 review" (`iteration-004.md:6`). The W2 cross-read is real. It opened grok-010, deepseek-010, swe-006 and glm-003, and it attributes numbers passed on from glm-03 as theirs. It did not use the grok or deepseek lineage summaries at the end of their `steer.md` files. The re-read split is new and useful, but two of the seam prices are mis-sized.

- STRONG-FINDING: of 1,777 re-reads, 1,497 are partial, 1,076 come before an edit, 292 come after a compaction and 84 are remainder (`results-mimo-04.txt:2-6`). The split logic compares each re-read with the previous read (`count-re-read-split.py:72-89`). The 84 is a lower bound on waste, not "the maximum prize" (`iteration-004.md:41`), because the classes overlap and absorb it.
- STRONG-FINDING: tool results total 378,331,270 bytes, with SKILL and reference loads at 11,660,172 by Read plus 24,354,866 by Bash (`results-mimo-04-buckets.txt:41`, `:49`, `:56`).
- DEFECT: minutes are priced by charging each read a whole human turn. "51 recovery reads x 98 s = 83 min" (`iteration-004.md:48`, `:105`) uses the turn duration p50 (`results-mimo-04.txt:8`, 4,575 `turn_duration` records, which are whole turns with many tool calls). The re-read row prices 15 reads a week at "~2 min" (`:50`), which is inconsistent with that. Minutes per tool call are uncounted.
- DEFECT: seam 1 (the stage-2 replay) is sized at 36.0 MB of SKILL and reference loads (`iteration-004.md:49`). A leaf replay replaces the model's reading and re-scoring of `ROUTER.md`, which is 68,335 plus 613,586 bytes (`results-mimo-04-buckets.txt:47`, `:55`). The chosen leaves still load, so rank 1 (`:63-64`) rests on the wrong bucket.
- DRIFTED-CITE: stored hook bytes of 546.2 MB are cited to `results-mimo-01-recount.txt:60`, which is `read_class_references=71`. `hook_success` sits at `:65` (main) and in the subagent block, and `:69` holds only the main 12.2 MB of `hook_additional_context`. The combined 14.4 MB also needs `:160`.
- WEAK-CLAIM: N-mimo-04-3 (the hook retention cap) has no context effect by the iteration's own account (`:139`). Its seam, the Claude Code transcript store, is host-owned with no repository `file:line`, so it does not belong in a context-reduction rank.
- WEAK-CLAIM: switch names (`--keep-rule`, `--output-prune`, `classifier.*`) and the operator lines are proposals. Mark them "proposed".
- Resolved: `results-mimo-01.txt:45`, `:60`, `:66`, `results-mimo-04.txt:2-8` and glm-003's F2 and N-glm-03-1 text (glm `iteration-003.md:46-53`).

## Steering for next iterations (5 and 6)

- Count minutes per tool call rather than per turn (for example, gaps between tool_use and tool_result timestamps), or mark every minute figure as an estimate.
- Re-rank seam 1 on the `ROUTER.md` bucket plus the counted re-scoring, not on the SKILL and reference bytes.
- mimo-05 and mimo-06 are W2: read the newest sibling files and each finished lineage's closing summary in its `steer.md`. For mimo-06, verify from code the compiled sk-design mode routing noted above.

## Review of iteration 5

Verdict: **adequate**. Angle mimo-05 was taken, and the iteration started from BASE2 rows 52 and 63 as refined, with no dollar figure. It read `steer.md` at about 09:14, before the iteration 4 review landed (the file's mtime is 09:14:26), so it says "unchanged". The W2 cross-read covers grok-05 and glm-05. swe-008 was listed but not opened, which is honest. The skill-load bytes and the 5-against-7 registry check are new. The usage number is a loose bound where a direct count exists.

- STRONG-FINDING: a run loads 23,081 + 36,580 = 59,661 bytes (lead `wc -c` on `sk-prompt/SKILL.md` and `references/patterns-evaluation.md`). `framework-registry.json` holds five ids while `SKILL.md:309-315` teaches seven (a lead `jq` read confirms `rcaf`, `race`, `cidi`, `tidd-ec` and `costar`). CRAFT and CRISPE have no registry id.
- WEAK-CLAIM: the bound of 22 a week (`iteration-005.md:31-33`) adds subagent user records (`results-mimo-05-06-usage.txt:12`), which are prompts sent to subagents, to the operator's own. A direct count exists. Lead `rg` over main and subagent transcripts finds 20 unique Agent tool_use ids with `subagent_type` `prompt-improver`, about 3.5 a week, while main-session `subagent_type` mentions read 22. That makes the ceiling about six times smaller.
- DEFECT (repeat, predates the iteration 4 steer): "each turn ... ~98 s of AI time" (`iteration-005.md:46-48`) again prices work at the whole-turn p50 (`results-mimo-04.txt:8`).
- WEAK-CLAIM: 120-150 labels "adapted from mimo-03 sizing" (`:78-81`) has no arithmetic behind it. 20 to 30 per class is a rule of thumb, so label it as one.
- WEAK-CLAIM: "the docs fix collects the same bytes" (`:62-65`) assumes that reading one section of `patterns-evaluation.md` removes the whole 36,580 bytes. Size the section that would remain.
- Resolved: BASE2 `research.md:802` (row 52), `:813` (row 63), `SKILL.md:309-315`, `:321` (CLEAR, 50 points), and `results-mimo-05-06-usage.txt:3`, `:6`, `:12`.

## Steering for next iterations (6 and 7)

- mimo-06 (sk-design): count runs from Agent `subagent_type` `design` (the lead sees 38 mentions in main sessions) and from Skill tool launches (`results-mimo-05-06-usage.txt:8`, `:17`). Do not count sk-design name mentions, which are dominated by building the skill. Verify from code the compiled mode routing (`resolve.cjs:36-44`).
- Minutes: use tool_use-to-tool_result timestamp gaps, or mark them as estimates. The whole-turn p50 is not a per-step cost.
- mimo-07 (W3): read grok's, deepseek's and glm's closing lineage summaries in their `steer.md` before picking the one measured workflow.

## Review of iteration 6

Verdict: **weak**. Angle mimo-06 was taken. The iteration says "`steer.md` unchanged" (`iteration-006.md:5`), yet the mimo-06 pointer had been in the file since the iteration 3 review. It did not verify compiled routing and describes the hub router as a keyword scorer. Its new counts have no saved output. The one real addition is the zero-call replay idea, and its seam is wrong.

- DEFECT: sk-design mode routing is compiled. `resolve.cjs:36-44` (`.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/`) lists `sk-design` in `DEFAULT_ON_HUBS`, and `serving-closure.manifest.json:12` holds it (lead read, orchestrator-verified). `sk-design/SKILL.md:202-203` rule 6 ("not in the compiled closure") is stale. Findings 2 and 4 (`:42-46`, `:60-63`) describe the hub pick as `hub-router.json` keywords, and N-mimo-06-1's seam (`:90`) should be `.skilled/bin/compiled-route.cjs`. Only leaf selection inside a mode stays prose.
- WEAK-CLAIM: `sk-design-fundamentals/SKILL.md:197-203` is `classify_intents`, a keyword scorer for intents inside fundamentals, not the hub router (lead read).
- DEFECT: the per-mode mention counts (8,785, 7,039, 4,012, 884, rubric 1,880; `:21-25`) sit in no results file and no script. The lead finds them only in `deltas/iter-006.jsonl` and this iteration file, so they cannot be reproduced. They are also mentions, not runs. The steered run count (Agent `subagent_type` `design`, 38 main-session mentions) was not taken.
- DRIFTED-CITE: "`benchmark/reports/` is an empty directory (my `ls`)" (`:34`, `:120`). The directory does not exist: `sk-design/benchmark/` holds only `README.md` (lead `ls`). The conclusion (no archived run) stands on `README.md:1-21`, which resolves.
- DEFECT (repeat): rubric labor is priced at the whole-turn p50 97,798 ms (`:53-54`).
- Unverified (lead did not recount): 53 scenario files (4/12/10/9/18) matching grok-06.

## Steering for next iterations (7 and 8)

- Before N-mimo-06-1 goes forward, find whether compiled-routing canaries or fixtures already replay sk-design scenarios (`.skilled/bin/lib/compiled-routing/`). If they do, the harness exists and the slice is a report line, not a new script.
- Save every count to a new results file with its script. A number only in a delta counts for nothing.
- Re-read `steer.md` at the start of each iteration and quote the newest review heading you saw.
- mimo-07 (W3): read the closing lineage summaries at the end of grok's, deepseek's, glm's and swe's `steer.md` before picking the measured workflow.

## Review of iteration 7

Verdict: **adequate**. Angle mimo-07 was taken. The operator contract and the gap it names ("which backend and commit ran feature X" has no surface) are new and useful. But the iteration again says "`steer.md` unchanged" (`iteration-007.md:6`). The iteration 4 and 5 reviews were in the file before it started, and it repeats both defects they named, so this lineage is effectively not reading `steer.md`. The W3 cross-read of swe-010 is real, but no sibling's closing `steer.md` summary was read.

- STRONG-FINDING: no surface today reports which backend or commit a feature used (`iteration-007.md:37-40`), confirmed by absence. The on-demand status argument prices a per-session line at about 4,700 prints a week (`results-mimo-01.txt:45`).
- DEFECT (repeat of the iteration 4 review): the picked workflow, the stage-2 replay, is again sized at 8,413 loads and 36,015,038 bytes of SKILL and reference loads (`:65`, `:119`). A leaf replay removes the `ROUTER.md` reads and re-scoring (68,335 + 613,586 bytes, `results-mimo-04-buckets.txt:47`, `:55`). The chosen leaves still load.
- DEFECT (repeat): the "ask the AI" turns are priced at about 98 s each from the whole-turn p50 (`:106`).
- WEAK-CLAIM: `/doctor:classifier` does not match the router. `/doctor` dispatches `<target>` through `_routes.yaml` (`speckit.md:1-3`, `_routes.yaml:13-20`, where each route needs a `yaml` asset and a `route-validate.sh` pass). The seam is `/doctor classifier`, a new route entry plus an asset.
- WEAK-CLAIM: rollback is called "implicit in update failure" (`:27`). `deem-ctl update` rolls back only when its single `choice` check fails (`deem-local.md:65`). There is no operator command to roll back an update that passes that check but degrades a measured keep rule. The lifecycle gap the spec asks about is left open.
- Resolved: `cli-usage/SKILL.md:118-119`, `doctor/speckit.md:1-6`, `deem-local.md:55-70`. The claim that CORS is `*` holds at `deem_server.py:809`, `:837`: any local browser page can call the server. It deserves more than a passing mention.

## Steering for next iterations (8 to 10)

- Open this file first. The newest review is iteration 7. Quote its heading in "Read first", and apply the replay sizing and minutes corrections before reusing either number.
- mimo-08: design the label draw from the 354 residue events only after restricting the validator regex to invocations (the iteration 2 review). Report the labor as rows times a stated per-row minute, labeled as an estimate.
- mimo-09 and mimo-10: read the closing lineage summaries in grok's, deepseek's, glm's and swe's `steer.md`. Put a manual Deem rollback and a keep-rule re-check after each model update among Deem's kill lines.

## Review of iteration 8

Verdict: **weak**. Angle mimo-08 was taken, and the iteration applied the iteration 2 steer (invocations only, folder scoping), which suggests it reads only the file's opening. It still says "`steer.md` unchanged" (`iteration-008.md:6`). Its headline result is an artifact of path matching, and the synthesis must not "retire the 354" on it.

- DEFECT: "strict post-pass same-folder edits: 0" (`results-mimo-08.txt:5`, `iteration-008.md:27-31`, `:102`) cannot be anything but 0. `PATH_TOKEN_RE` captures relative tokens such as `specs/...` (`count-validator-residue2.py:26`), and the scoping test is `fp_in.startswith(f + '/')` (`:79-80`). Every Edit and Write `file_path` in the main transcripts is absolute: 1,538 of 1,538 start with `/` (lead `rg`). The honest frame is 193 passing invocations followed by any `.md` edit within 6 records (`results-mimo-08.txt:6`). That is down from 354 by the invocation-only rule and is not yet folder-scoped.
- STRONG-FINDING: the invocation-only regex (`count-validator-residue2.py:20-24`) cuts 8,364 matches to 2,471 invocations with 2,435 passing (`results-mimo-08.txt:2-4`). That confirms the iteration 2 review's inflation call.
- WEAK-CLAIM: the pivot to citation drift rests on sibling counts: 456 cites (swe `iteration-006.md:20`, resolved) and the gap in `AC_COVERAGE` (deepseek `iteration-003.md:36`, resolved). Its own evidence for the pivot is the artifactual zero.
- WEAK-CLAIM: "±0.15 ... half-width ~0.12" at n = 40, p = 0.8 (`:48`). The normal approximation gives 0.124, but 20 of the 40 rows are constructed drifts, so precision on the live 20 has a half-width of about 0.18.
- WEAK-CLAIM: "80 minutes" uses a 2 min per label rate carried from mimo-02, which was itself an unanchored estimate.
- Resolved: `results-mimo-08.txt:2-6`, `count-validator-residue2.py:20-29`, swe-006 `:20`, `:26`, `:65`, deepseek-003 `:36`.

## Steering for next iterations (9 and 10)

- See the READ FIRST block at the top of this file. It carries the corrections from all eight reviews.
- mimo-09: order the measurement slices by operator minutes. For each, state whether the number is counted or estimated.
- mimo-10: write kill lines as printed text with thresholds, and name which of them can be evaluated today with zero calls.

## Review of iteration 9

Verdict: **adequate**. Angle mimo-09 was taken, and the iteration read BASE2 section 9 (`research.md:446`) and its own iterations. It did not use the READ FIRST block. Its state record dates from 09:29 and the block landed at 09:30:49, so it started before the block existed, and it says "`steer.md` unchanged" (`iteration-009.md:6`). The labor table by phase is new. The order it proposes carries every uncorrected number forward.

- STRONG-FINDING: the operator-minutes table (`:26-37`) shows every zero-call slice runs with no operator time, and the first judged feature costs about 80 minutes of labels. The minutes are estimates on counted label sizes, and the table says so (`:40-41`).
- DEFECT (carried): "validator-residue flagger (drop, its population is empty)" (`:78-79`, `:108`) rests on iteration 8's path-artifact zero (see the iteration 8 review).
- DEFECT (carried): stage-2 replay savings of about 6.3 MB a week, or 1.6M tokens (`:47`), come from the SKILL and reference buckets (`results-mimo-04-buckets.txt:49`, `:56`). The `ROUTER.md` bytes that apply come to about 119 KB a week (`:47`, `:55`).
- DEFECT (carried): "the billed 289x2 run" (`:34`, `:72-73`). There are 265 distinct rows.
- WEAK-CLAIM: the hook retention cap is listed as a free-numbers survivor (`:30`, `:69`), but it has no repository seam and no context effect (the iteration 4 review).
- WEAK-CLAIM: "002 census, 0 operator minutes" relies on swe-010's design (swe `iteration-010.md:43`, resolved). Nothing in this lineage ran it.
- Resolved: `results-mimo-01-recount.txt:65`, `:69`, `:154` (hook_success 355.6 + 190.6 MB = 546.2 MB) and BASE2 `research.md:446`. The 2.5 MB-a-week context figure also needs the subagent line `:160`.

## Steering for iteration 10

- The READ FIRST block at the top now targets mimo-10. Apply points 1 to 3 before any survivor gets a kill line.

## Review of iteration 10

Verdict: **adequate**. Angle mimo-10 was taken, and the kill lines are printed strings with thresholds, the two proposed thresholds among them marked as proposals (`iteration-010.md:18`, `:30`). It again says "`steer.md` unchanged" (`:6`) and applies none of the READ FIRST corrections.

- STRONG-FINDING: Deem's kill lines are given as printed forms (`:14-19`), with the memory threshold honestly marked "proposed" (`:18`). Round 2's kill family gains skip forms for each backend, and the latency rows split (`:51-56`, adopting deepseek-10's changes as theirs).
- DEFECT (carried): "the strict residue line (0 of 2,435)" is listed as already evaluated (`:41-42`). It is the iteration 8 path artifact, so "half the program killable today" (`:46-47`) is overstated.
- DEFECT: the health line kills "if the commit pair changes between calls" (`:16`). The operator's `com.skilled.deem-update` schedule changes that pair by design every 6 hours (`deem-local.md:70`). A commit change should trigger a keep-rule re-check and an offered manual rollback, not a kill. No rollback line exists.
- WEAK-CLAIM: the latency kill sits at the 2,500 and 3,000 ms deadlines (`:17`), which is 30 times the measured p95 of 62.8 to 78.5 ms (`deem-local.md:36-38`). A severe regression would never fire. It needs a second, regression line against the measured p95.
- DEFECT (carried): "289x2 calls" (`:45`) and the gap of at most 10 on the point estimate (`:19`, `:33`). There are 265 distinct rows, and the test needs a confidence bound.
- Resolved: `deem-local.md:34-44`, `:49-50`, `:41-43`, BASE2 `research.md:233` and `results-mimo-04.txt:4`, `:6`.

## Lineage summary for the synthesis leaf (mimo, 10 iterations)

- **Keep (counted and resolved):** the carried context per turn has a p50 of 384,219 and a p95 of 887,519 cache-read tokens over 66,498 messages (`results-mimo-01-recount.txt:10`). Tool_use counted over all records gives Read 1,984 and Bash 58,109 (`:14`, `:16`). The re-read split is 1,777 total, 1,497 partial, 1,076 before an edit, 292 after a compaction and 84 remainder (`results-mimo-04.txt:2-6`). Tool results total 378.3 MB, with `ROUTER.md` at 0.68 MB (`results-mimo-04-buckets.txt:41`, `:47`, `:55`). Validator runs: 2,471 invocations, of which 2,435 pass (`results-mimo-08.txt:2-4`). The comparison power table is `results-mimo-03-power.txt:1-13`. sk-prompt's run load is 59,661 bytes, with a registry of 5 ids against the 7 its prose teaches (iteration 5).
- **Keep (design):** it3's pre-registered comparison of Deem against Jev with a 50-row calibration split, it7's missing "which backend and commit ran X" surface, it9's operator-minutes table and it10's printed Deem kill lines (all after the corrections below).
- **Defects, never repeat:**
  - it1's tool counts kept only the first record per `message.id` (the ALL-7 undercount), giving Read 342 instead of 1,984. Voided.
  - it4, it5, it6, it7 and it9 price work at the 98 s whole-turn p50.
  - it4, it7 and it9 size the router replay at 36 MB, or 6.3 MB a week, when it saves `ROUTER.md` bytes, about 119 KB a week.
  - it3, it9 and it10 use 289 rows when 265 are distinct.
  - it8's "0 edits after a pass" is an artifact of absolute against relative paths, and it9 and it10 carry it. The real frame is 193, unscoped.
  - it6 describes sk-design as a keyword scorer when its mode routing is compiled (`resolve.cjs:36-44`).
- **Weights:** it3 strong. it1 (Q1 only), it2, it4, it5, it7, it9 and it10 adequate. it6 and it8 weak, though it8 keeps its invocation count. From iteration 2 on, the lineage showed no sign of re-reading `steer.md`, so read the corrections here, not in the iterations.
- **Contested by others:** glm's lead finds the D-residue flagger's labels are found issues with no clean negatives (`glm/steer.md:70`). swe-004 and deepseek-009 quoted mimo-001 (the 28.6% share and the baseline) while newer mimo files existed (`swe/steer.md:100`, `:117`, `:180`), so any sibling reuse of it1's voided Q2 to Q4 numbers is invalid. glm-04's precision arithmetic of 50 true and 12 false a week came from it2's defective equation (`glm/iterations/iteration-004.md:43`).
