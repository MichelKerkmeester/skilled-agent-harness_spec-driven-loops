# Iteration 3: grok-03 — Routing and ranking outside, against R1 and R21

## Focus

Angle `grok-03`. npm `jevctl` `route` and `rerank`, claude-jev `pickOption` / `rankHypotheses`, and the Pi post's per-prompt switching, against R1's sign test and R21. Wave W2. Questions 30 and 21.

## Sibling check

- Read `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/lineages/deepseek/iterations/iteration-001.md` (iteration 1, the newest file in that lineage).
- `research/lineages/mimo/iterations/` has no iteration file yet.
- `research/lineages/swe/iterations/` has no iteration file yet.
- mimo-01 and swe-01 therefore supplied no movable-row bound and no function list to push past.

Agreement that I reopened: the Python `--version` string is the literal `jev 0.6.2` at `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py:327`. DeepSeek's F1 holds. A wrapper that prints that string still passes check 2. Push past, below: that self-attested binary is what R1's gate accepts, and a missing score stored as 0 can still make the keep rule fire after the gate passes.

## Findings

### F1. A single `choice` fits the sign test. Independent `noul` scores change what a flip is

`runRerank` asks one `noul` per candidate. A missing answer is stored as relevance 0 (`src/core/rerank.ts:77`). Hits sort by relevance descending, and equal scores keep the caller's index (`:81`). Several candidates can stay `kept` when each relevance is at least `min` (`:84`, file comment at `:3`). There is no single modal key.

`runRoute` asks one `choice` and always adds a `none` handler: "None of the handlers applies" (`src/core/route.ts:42`, `:114`, `docs/route.md:11`). The returned handler is null when the choice is missing or is `none` (`route.ts:180`). Action is then `none`, before confidence is consulted (`:187-192`). A real handler with confidence below `minConfidence` (default 0.6, `docs/route.md:21`) is `review`, not `auto`. Argument `noul` values that are missing stay `null` (`route.ts:155-159`), which is the opposite of rerank's 0.

R1's arm, as BASE states it, is one modal pick per eligible row over 3 reruns, then a sign test. That object is a `choice` key, which is what `route` returns. It is not rerank's score list. If the implementation used rerank, the per-row flip rate would have to be defined on the top id after the sort, and a 0.0001 swap or an index tie-break (`rerank.ts:81`) would count as a flip even when the model did not change a discrete key. Do not use that definition. Keep the flip rate as "the modal key changed," and treat a tie on the choice probabilities as the key the model returned, not a local re-sort.

### F2. `none` matches route's decline, and a missing score of 0 is a false `keep`

On a movable row, gold sits in the cluster. `route` can still return `none` (`route.ts:180-189`). That pick is a loss against gold, not an abstention and not `unmeasured`. Abstention is the right label only when gold itself is `none` or outside the cluster. BASE row 4 already says the 13 unknowns are correct abstentions for a different arm. Copying that label onto a `none` pick inside a gold-bearing cluster would hide losses and help a keep. The keep rule should count it as a loss.

The contrarian hole: a judge can pass BASE's four `keep` conditions and still be unfit to serve. Fill missing rerank answers with 0 (`rerank.ts:77`). Across 3 reruns the one candidate whose answer arrived is the unique top, so the flip rate is 0. If that candidate is gold, the row is a win. Enough such rows pass a one-sided sign test at 0.05, beat the zero-call comparators, and hold right@3. The report prints `keep`. The wins are transport failures. **Printed addition to the keep rule:** `keep` is illegal when any win row contains a missing answer. Those rows are `unmeasured` and drop out of the sign test before the modal is taken. A missing `choice` stays `unmeasured` too (`route.ts:180`), never a synthetic key.

The gain the rule calls `inconclusive` while a reader might still care: a large move in MRR that is not significant at 0.05. BASE already says `inconclusive` closes nothing (Changes R-g). This iteration does not reopen that. The new failure is the false `keep`, not a missed `inconclusive`.

claude-jev `readDecision` throws through `choiceOf` on a missing choice (`options.ts:89-92`; `choiceOf` throws at `src/domain/question.ts:84-87`, opened in iteration 2). It then fills a missing *probability slot* with 0 (`options.ts:95-97`). That 0 is a display gap after a successful parse, not a substitute answer. `flat` is any of the three confidences below 0.5 (`options.ts:24-26`, `:110`). A flat pick is not unanimous evidence. R1 should record `flat` the same way and refuse to treat a flat modal as a stable win. `unanimous` (`:109`) is three questions agreeing. R1 asks one question per rerun, so unanimity does not apply. Do not import the three-question pick as the advisor arm.

`rankHypotheses` returns a ranked list (`rank-hypotheses.ts:35-42`), which is the hypothesis arm BASE already parked. It is not R1's cluster pick.

### F3. jevcache and per-prompt switching

`context/external websites/jevcache.md` is one line, the URL `https://jevcache.sh/`. No cache behavior is in the file. BASE rows 30 and 36 already drop an answer cache because it zeroes the flip rate. The local mechanism that does the same damage without a cache is F2's missing-as-0: repeated failures produce a repeated top id. A cache would do it for a different reason. Neither survives D5 plus the flip-rate rule. No cache use belongs in R1's reruns or in a live R3.

The Pi thread's per-prompt model switch is a user warning, not a measurement: changing model after every message fights prompt caching (`Pi post :464`), and "routing on each prompt will kill caching" (`:743`). Another comment asks if that is the way to kill cache efficiency (`:761`). Those lines are about a live router. Offline R1 does not edit the host prompt. A served R3 that switched models per prompt would. That is another reason R3 stays behind `keep`, which BASE already requires. Not a new rank.

Question 21, how often the live advisor sets `ambiguousWith`, is not answered here. mimo-01's count file does not exist. No shadow sink was opened this iteration. The rate stays UNKNOWN.

### F4. What this does to R21

R21 is one `noul` per labeled prompt, and it runs only when R1 prints `underpowered` (BASE). It must not be implemented as `route` or `rerank`. A missing `noul` stored as 0 (`rerank.ts:77`, and `screen.ts:56` from iteration 2) becomes a confident "no" and moves Brier score and accuracy. **Printed kill:** `r21 not built: missing_answer_counted` or `r21 not built: r1 was not underpowered`. The version gate stays the literal check DeepSeek opened; this iteration confirms the literal at `__init__.py:327` and does not add a second identity check.

### Adopt or anti-pattern

| Pattern | Where | Under the key gate |
|---|---|---|
| One `choice`, modal key, flip means the key changed | `route.ts:116`, `:180` | Adopt as R1's arm shape. Offline, own `--jev`, three D5 checks. |
| Explicit `none` inside the choice | `route.ts:114` | Adopt. A `none` pick on a gold-in-cluster row is a loss. |
| Missing handler choice → action `none` / unmeasured, not a key | `route.ts:180-189` | Adopt. Rows with a missing answer leave the sign test. |
| `review` below confidence 0.6 | `docs/route.md:21`, `route.ts:190-192` | Adopt as a label. A `review` row is not a win. |
| `rerank` independent `noul`, missing → 0, tie → input order | `rerank.ts:77-84` | Anti-pattern for R1 and R21. Changes the flip definition and can fake `keep`. |
| Probability slot `?? 0` after a parsed choice | `options.ts:95-97` | Do not copy into the sign test. The throw on a missing choice (`question.ts:86-87`) is the part to copy. |
| Answer cache, or per-prompt model switching | `jevcache.md:1` (URL only). Pi post `:464`, `:743` | Anti-pattern. Cache zeroes flip rate (BASE rows 30 and 36). Live switching is a prompt-cache warning from users, not a local count. |
| npm `--fail-on` exit 2 for `review` or `unrouted` | `docs/route.md:23` | Anti-pattern on the Python package. Exit 2 there is usage. Print `jev arm skipped: exit 2` and stop the arm. |

## Per-idea records

### N-grok-03-1

| Field | Record |
|---|---|
| **Idea** | `N-grok-03-1`. Before the sign test, drop any row whose rerun is missing an answer. Do not store that miss as 0 or as `none`. Type: a rule on R1's `choice` arm. |
| **Builds on** | R1's keep rule. Question 30. |
| **Value** | Stops a transport failure from printing `keep`. |
| **Seam** | The defect to refuse: `src/core/rerank.ts:77`. The shape to copy: `src/core/route.ts:180`. |
| **Metric, baseline, harness** | Count of `unmeasured` rows beside the four outcomes. Baseline UNKNOWN until R1 runs. Harness: the proposed `score-jev-tiebreak.mjs`. |
| **Cost, latency, privacy** | No extra call. The arm's calls stay BASE's 3 reruns. Prompt text leaves the machine only when `--jev` is on and the three checks pass. |
| **Key gate and no-key behavior** | R1's own switch. No key: census only, one skip line, no pick. Exit 3 stops the arm. Exit 4 and a malformed choice mark that row `unmeasured` and continue, matching the "no default score" rule. Python exit 2 stops the arm. |
| **Rough LOC** | A branch in the scorer, on the order of 20 lines. Inside BASE's 250–320. |
| **Verdict** | build-now, as a clause on R1, not a new phase. |
| **Confidence** | The 0-default and the `none` path are confirmed. No corpus was scored. |

### R1

| Field | Record |
|---|---|
| **Idea** | R1 stays build-now. Judgment type `choice`, with `none` as an explicit key. |
| **Builds on** | BASE R1. DeepSeek iteration 1's version literal, reopened at `__init__.py:327`. |
| **Value** | Same decision BASE names, plus a keep that cannot be earned by missing answers. |
| **Seam** | Vendored: `route.ts:110-140`. The advisor scorer files were not reopened; mimo-01 and swe-01 have no files. |
| **Metric, baseline, harness** | BASE's sign test, flip rate ≤ 0.10, three comparators, four outcomes. New clause: missing-answer rows are out of the test. |
| **Cost, latency, privacy** | Unchanged from BASE. No cache. |
| **Key gate and no-key behavior** | Three D5 checks. The version check compares to the literal `jev 0.6.2` (`__init__.py:327`), which a wrapper can forge. On failure: `jev arm skipped: <check>`. |
| **Rough LOC** | BASE's estimate plus the N-grok-03-1 branch. |
| **Verdict** | build-now. |
| **Confidence** | Vendored control flow confirmed. Movable-row power was not computed; those siblings have not written. |

### R21

| Field | Record |
|---|---|
| **Idea** | R21 stays a conditional `noul` calibration. Not `route`, not `rerank`. |
| **Builds on** | BASE R21. Question 30's underpowered branch. |
| **Value** | A latency and calibration number when the advisor leaves no headroom. |
| **Seam** | Kill is defined against `rerank.ts:77`. |
| **Metric, baseline, harness** | BASE's accuracy, F1, Brier, flip rate. A missing answer must not enter those averages. |
| **Cost, latency, privacy** | BASE's 585 short calls, only after `underpowered` and `--jev`. |
| **Key gate and no-key behavior** | Runs under R1's flag. Skip line is R1's. |
| **Rough LOC** | BASE's 40–60, plus a reject-on-missing branch. |
| **Verdict** | next, still conditional on `underpowered`. |
| **Confidence** | The false-zero path is confirmed. Whether R1 is underpowered is UNKNOWN. |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| R1's modal pick should be a `choice` key, not an argmax of independent `noul` scores | new | `route.ts:116`, `rerank.ts:74-84` |
| `rerank` stores a missing `noul` as 0 and breaks ties by input order | new | `rerank.ts:77-81` |
| A keep can pass when missing answers are stored as 0 and the survivor is gold | contests BASE | BASE's four conditions do not name this row. `rerank.ts:77` |
| `route` always offers `none`, and choosing it is action `none` even at high confidence | new | `route.ts:114`, `:180-189`, `docs/route.md:11` |
| A `none` pick on a gold-in-cluster row must be a loss | new | Derived from `route.ts:180` plus BASE's movable-row definition, quoted as BASE |
| Python `--version` is the literal `jev 0.6.2` | confirms deepseek-01 with code opened here | `__init__.py:327` |
| jevcache.sh file holds only a URL | confirms BASE row 36's "not reopened" | `jevcache.md:1` |
| Live per-prompt model switching fights a prompt cache | new as a user report, not a local count | Pi post `:464`, `:743`, `:761` |
| Question 21's `ambiguousWith` rate | restated as UNKNOWN | No sibling file and no sink opened |

## Sources Consulted

- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/route.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/src/core/rerank.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/jev-cli-main/docs/route.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/application/pick-option.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/application/rank-hypotheses.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/claude-jev-main/src/domain/catalog/options.ts`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/external websites/jevcache.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/context/social posts/Reddit - I think i found the best use case for JEV and PI.md`
- `specs/cli-jev/001-cli-jev-creation/context/jev-cli-main/src/jev_cli/__init__.py`
- `specs/cli-jev/003-cli-jev-workflow-integration/004-deep-research-expansion/research/lineages/deepseek/iterations/iteration-001.md`

## Assessment

newInfoRatio: 0.78. Nine rows, six new or contesting, two confirmations with a file opened here, one unknown restated. Novelty justification: the false `keep` from a zero-filled rerank, and route's always-on `none`, are not in BASE's keep-rule paragraph. Confidence: high on the vendored branches; the corpus was not scored. Convergence is telemetry only.

## Reflection

What worked: comparing a discrete choice key with an independent-score sort on the same keep rule. What failed: expecting mimo-01's power numbers; that lineage has no iteration file. Ruled out: rerank as R1's arm, an answer cache, and treating `none` on a movable row as unmeasured.

## Recommended Next Focus

grok-04: egress, secrets, budgets and review funnels, including a count for question 7.

## Hand-off

- R1's keep rule gains one illegal input: a win row with a missing answer.
- `none` on a gold-in-cluster row is a loss. `none` when gold is outside the cluster stays an abstention, which this iteration did not re-count.
- Question 21 is still UNKNOWN.
- DeepSeek's exit matrix for R19 and R20 is a table this lineage has not copied line by line. grok-05 should not invent a second one.
