# Iteration 5: grok-05 — Contrarian build order and kill list

## Focus

Angle `grok-05`. One phase if only one ships, a printed kill for each build-now and next item, and where this lineage disagrees with the others. Wave W3. Closes question 30 from the contrarian side.

## Sibling check

- Read `research/lineages/deepseek/iterations/iteration-002.md` (newest in that lineage). Iteration 1 was already read.
- Read `research/lineages/mimo/iterations/iteration-001.md` (newest, and the only file there).
- `research/lineages/swe/iterations/` has no iteration file.
- Both siblings' own sibling checks say they read no round-2 sibling. Their numbers are not corroborated by having read this lineage.

Agreement with code opened here: this worktree's advisor data directory contains `prompt-policy.default.json` and `README.md` only. `shadow-deltas.jsonl` is absent. Question 21's recorded `ambiguousWith` count in this worktree is 0. That matches mimo-01's listing of this worktree. It is not a rate for any other checkout. mimo's upper bound of 55 movable rows was not re-counted here, so it is not adopted.

## Findings

### F1. If only one phase ships, it is 002's zero-call census

002's first slice sends nothing, reproduces a pinned baseline, and prints a line that can stop every later billed arm. BASE §13 already forbids a Jev arm in 003, 005 or 006 until 002 has a latency record (`research.md:1259`). No latency record exists when the census stops the arm. **Printed result that kills the rest of the billed program:** `baseline mismatch: comparison void`, or `verdict: underpowered` under BASE's rule of fewer than 5 movable rows (`research.md:626`, `:637`). Either line means there is no latency number for anyone else to wait on.

005's census stays build-now beside 002 when more than one phase ships, because it also costs zero calls. seat-001's dissent would park the whole compaction item (`council-report.md:310`). That parks the build-nothing slice with the arm. The arm stays later. The census does not. Parking both fails the checklist's "build nothing first" question (`repo-rules-digest.md:61`): the census is the build-nothing test of whether a deletion arm can exist.

The redaction unit case is not a phase. It fails today (iteration 4's printed false/false). It blocks egress. It does not block 002's or 005's zero-call slices.

### F2. Kills, as printed results

| Item | Verdict | Printed kill |
|---|---|---|
| R1 census and arm | build-now | `baseline mismatch: comparison void` stops the arm. `verdict: kill` closes R3. `r1 not served: missing_answer_in_win_row` means the report is illegal (iteration 3). `verdict: underpowered` closes nothing and does not by itself start a product. |
| R19 census | build-now | `unknown_record_shape` on more than half of sessions, or any transcript text in the report. |
| R19 arm | later | `arm not built: fit_throws>=50% OR offline_reduction_upper_bound<0.25` |
| N-grok-04-1 scrub | build-now, no switch | After the patch, `prefixed_api_key scrubber False` or `service_token scrubber False`. |
| R20 lexical lint | next | Jev arm: `r20 jev arm not built: labeled_violation_rate<0.05` (BASE's 5% bar, `council-report.md:314`). Also `r20 jev arm not built: command was jev verify`. |
| R2 zero-call | next | Fewer than 30 fixture rows (`research.md:664`). |
| R2 Jev arm | later | `r2 jev arm not built: no recorded OpenCode or Pi verifier use`. `r2 jev arm not built: evidence is the stored goal string`. |
| N-grok-02-1 unsure bands | next, inside R2's table | `r2 bands not shipped: cascade table missing`. They are not a second heuristic. |
| R21 | next, conditional | `r21 not built: r1 was not underpowered`. `r21 not built: missing_answer_counted`. |
| N-grok-04-2 planned-call line | next, on R1's arm | Dry run prints `planned_n != request_list_length`. |
| R10 | later | `r10 not promoted: narrative_p0_negatives=0` (iteration 4, 3,271 files). |

mimo-01 asks the census to print `power: movable need-wins q80` and to treat a high `q80` as underpowered. The binomial table was not recomputed here. BASE's fewer-than-5 rule stays the printed `underpowered` until that table is recomputed from the census's own `movable` count. Widening the trigger is not a rank change. It is also not a number this lineage owns.

### F3. What fails a checklist question

deepseek-02's R19 idea record still calls the fit column a "25,000-token fit estimate (unchanged)". Iteration 1 opened npm `jevctl` `fitState`: the 25,000 figure is a state-token ceiling on a judgment state, and host `preTokens` is a different object. A metric that subtracts one from the other fails checklist question 1 (`repo-rules-digest.md:56`): the baseline is not the quantity the decision uses. The census column is the local `estimateTokens` plus the stage name, including throws. deepseek-02's brief column (read the `SessionStart:compact` attachment, replay only if absent) was not re-counted here. One private transcript's character count is not adopted. The census staying build-now is compatible with that column once the fit metric is the stage, not 25,000 against `preTokens`.

Shelling npm `jev verify` as R20's lint fails question 3 (the lexical lint is the build-nothing path) and the red flag against a default that papers over a missing value (`repo-rules-digest.md:102`). Dropped in iteration 2.

Using `rerank`'s independent scores as R1's modal pick fails the red flag against tallying disagreeing judgments (`repo-rules-digest.md:105`) and papers a missing answer as 0. Dropped in iteration 3.

N-deepseek-01-3, one exit table for arms whose phase folders do not exist, fails question 5 if it is built now: the smallest slice is the census, which makes no call. Copy BASE `research.md:628` into 005 and 006 when those docs are created. This lineage did not reopen `002 spec.md`, so it does not adopt a `partial` wording from that file.

A global Jev switch fails question 6. None of the four build-now or next items uses one. Each keeps its own flag. No key: today's behavior, one skip line, no score.

### F4. Vendor claims the order does not use

| Claim | Where it came from | Local replacement |
|---|---|---|
| Hermes paired measurement, about $0.002 and +13,200 tokens | User report, iteration 1 | Stage histogram and `offline_reduction_upper_bound`. The dollar figure does not transfer. |
| supercov example `$0.0047` | `docs/quality.md:195`, a vendor illustration | `planned calls: N, about T input tokens`. No dollars until a local price exists. |
| R1's about $0.03 to $0.06 | BASE, inferred from a vendor price | Same planned-call line. Dollars stay UNKNOWN. |
| F1 0.9843 | BASE says, not reopened | Not a reason to build R21 as a product. |
| Python version `jev 0.6.2` | Confirmed at `__init__.py:327` in iteration 3 | The gate compares to that literal. A wrapper can forge it. |

### F5. Order

1. The redaction expressions, so the two prefixed samples match. No Jev flag. Lands before any egress, not before the censuses.
2. 002 zero-call and 005 census, side by side. 005's fit column is the stage ladder from iteration 1, not host `preTokens` against 25,000.
3. 002's billed arm only after the baseline matches 53/70, the planned-call line matches the request list, the scrub booleans are true, and a missing answer cannot count as a win. First latency number lives here.
4. 006 lexical lint and 003's zero-call slice. Neither spawns `jev`.
5. R21 only on `verdict: underpowered`, and only if missing answers are excluded. R2's Jev arm and R19's arm stay later under the kills in F2.

Question 30, closed here: R1's rank stays build-now, with the missing-answer clause. R19's rank stays census build-now and arm later, and the fit metric is the stage, which is why seat-001's "park all of it" is rejected. R2 stays zero-call next and Jev later. None of the three moves.

## Per-idea records

### N-grok-05-1

| Field | Record |
|---|---|
| **Idea** | `N-grok-05-1`. If only one phase ships, ship 002's zero-call census. Type: none. |
| **Builds on** | BASE §13 line 1259. Iterations 1 to 4. |
| **Value** | One printed line can stop every later billed arm without a key. |
| **Seam** | The script BASE names, `score-jev-tiebreak.mjs`, which does not exist yet. The baseline it must reprint is `research.md:626`. |
| **Metric, baseline, harness** | Holdout top-1 53/70, BASE's number, not re-counted here. Kill lines in F2. |
| **Cost, latency, privacy** | Zero calls. Prompts stay on the machine. |
| **Key gate and no-key behavior** | No flag on this slice. A stub `jev` logs nothing. |
| **Rough LOC** | BASE's 250 to 320 for the whole script. This slice is the census half. |
| **Verdict** | build-now, as 002's first slice, not a new phase. |
| **Confidence** | The stop lines are in BASE, opened this iteration. Movable-row power was not recomputed. |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| One phase, if only one ships, is 002's zero-call census | new as a selection | `research.md:1259`, `:637` |
| seat-001 parking compaction entirely drops the build-nothing slice | contests the dissent | `council-report.md:310`. Census stays build-now |
| deepseek-02's unchanged 25,000-token fit column compares two objects | contests that idea record | Their iteration-002 R19 record. Fit stages opened in this lineage's iteration 1 |
| Question 21 in this worktree | new count | `runtime/data/` lists two files. `shadow-deltas.jsonl` absent. Count 0 |
| mimo-01 movable ≤ 55 and the q80 table | not adopted | Not re-counted here |
| deepseek-02 brief length of 2,335 characters | not adopted | One transcript, not reopened. Private text was not copied |
| swe-01 order | none to contest | No iteration file |

## Sources Consulted

- This lineage's `iterations/iteration-001.md` through `iteration-004.md`
- `research/lineages/deepseek/iterations/iteration-002.md`
- `research/lineages/mimo/iterations/iteration-001.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md` §11 and §13
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/ai-council/council-report.md` Dissent
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md` §3 and §4
- `.skilled/repo-rules/prevent-overengineering.md`
- `.skilled/skills/system-skill-advisor/runtime/data/`

## Assessment

newInfoRatio: 0.62. The kills were earned in earlier iterations. What is new is the single-phase selection, the checklist failure on the 25,000-token column, and the zero sink count in this worktree. Confidence: high on the files opened this iteration. The power curve and the other lineages' transcript counts stay theirs. Convergence is telemetry only. This is iteration 5 of 5.

## Reflection

What worked: reading the two sibling files that appeared after iteration 4, and refusing their counts without a recount. What failed: swe-01 still has no file, so there is no code-sized order to contest. Ruled out: parking R19's census with its arm, shelling `jev verify`, and treating a vendor dollar example as a local cost.

## Recommended Next Focus

None. The cap is 5. Synthesis follows.

## Hand-off

- Question 30 is closed without a rank change.
- Question 21 is 0 in this worktree and UNKNOWN elsewhere.
- Question 7 stays 0 usable narrative negatives.
- Question 18, question 19 and the tau 0.03 veto were not reopened.
- mimo's power line and deepseek's brief column can fold into 002 and 005 when someone recomputes or recounts them. They do not lead the order.
