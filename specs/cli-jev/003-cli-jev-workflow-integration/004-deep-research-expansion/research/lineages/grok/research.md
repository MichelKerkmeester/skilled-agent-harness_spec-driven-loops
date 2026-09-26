# Grok lineage synthesis: contrarian outside patterns

Lineage `grok`. Session `fanout-grok-1790457982528-yjdrdz`. Five iterations, cap 5, convergence mode off. Python `jev-cli` 0.6.2 is the package every arm would spawn. npm `jevctl` 0.2.3 is the vendored source of the patterns below. Both install a `jev` command. Exit 2 is a usage error with no quota on the Python package, and a tripped `--fail-on` gate on `jevctl`.

## Table of Contents

1. Executive Summary
2. Scope, Method and Inputs
3. RQ1 and the keep rule
4. RQ2 Advisor order
5. RQ3 Goal verification
6. RQ4 Compaction
7. RQ5 Outside patterns
8. RQ6 What not to add
9. RQ7 Cost, order and kills
10. Cross-lineage notes
11. Recommendations
12. Eliminated Alternatives
13. Open Questions
14. Proposed Build Phases
15. Evidence Quality
16. References
17. Convergence Report

The protocol places Eliminated Alternatives after Recommendations and before Open Questions. The numbering above follows that placement. BASE's research.md uses a different number for Open Questions. This file is the lineage synthesis, not a replacement of BASE.

## 1. Executive Summary

Ranks from BASE §11 do not move. R1 stays build-now. R19's census stays build-now and its arm stays later. R20 and R2's zero-call slice stay next. R21 stays next and conditional. R10 stays later.

What changed is the clause on each rank. A missing answer stored as 0 can print `keep`. `none` on a row whose gold sits in the cluster is a loss. The compaction fit column is a stage name from npm `jevctl` `fitState`, not host `preTokens` against 25,000. `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` match neither local assignment regex, and claude-jev's path refuse does not catch them inside a source file. A strict walk of 3,271 review iteration files found 0 usable rejected-P0 rows.

If only one phase ships, it is 002's zero-call census. `baseline mismatch: comparison void` or `verdict: underpowered` kills every later billed arm, because those arms wait on 002's latency record.

No key: every arm stays dormant. The scrub change is the exception, and it is not an arm. It redacts locally and spawns nothing.

## 2. Scope, Method and Inputs

The brief, RQ1 to RQ7 and the answer shape are in the parent `spec.md`. The baseline is `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`. Angles are `grok-01` through `grok-05` in `context/research-angles.md`.

Each iteration opened vendored files or counted local files, then wrote under this lineage only. No live `jev` call. No `.env` file. Private transcript bodies were not copied. Claims marked "BASE says" were not reopened.

`resource-map.md` was absent at init (`resource_map_present` false). The file written at synthesis lists what this lineage opened. It was not an input.

Wave 1 (iterations 1 and 2) read no sibling. Wave 2 read deepseek iteration 1. Wave 3 read deepseek iteration 2 and mimo iteration 1. swe has no iteration file.

## 3. RQ1 and the keep rule

R1's arm is one `choice` key, including an explicit `none`, which is what npm `route` always injects (`route.ts:114`). Independent `noul` scores from `rerank` are the wrong shape: a missing score becomes 0 (`rerank.ts:77`) and ties break by input order (`:81`). A gold survivor of that fill can pass BASE's four `keep` conditions. **Printed addition:** `keep` is illegal when any win row contains a missing answer. Those rows are `unmeasured` before the sign test. A `none` pick when gold is inside the cluster is a loss.

npm `validateAnswers` throws on a missing answer and says a 0 would let a screen pass (`provider.ts:119`). Copy the throw. Do not copy `rerank`'s 0.

mimo-01's power table and movable bound of 55 were not re-counted. BASE's `underpowered` line stays "fewer than 5 movable rows" until that table is recomputed from the census's own count.

## 4. RQ2 Advisor order

The served order (R3) stays behind `verdict: keep`. Per-prompt model switching is a user warning that it fights a prompt cache (Pi post `:464`, `:743`), which is another reason not to serve R3 early. An answer cache, including supercov's on-disk request cache, zeroes the flip rate. `jevcache.md` is a URL only.

Question 21: this worktree's `runtime/data/` has no `shadow-deltas.jsonl`. Recorded `ambiguousWith` events here: 0. Other checkouts were not listed.

## 5. RQ3 Goal verification

`jev verify` throws when claims or evidence are empty and cannot lint a criterion that has no evidence. It is not R20. R20 stays a lexical lint. The Jev arm stays later, and it dies if the command was `jev verify` or if the labeled violation rate is under 5%.

R2's zero-call slice stays next. The Jev arm stays later until recorded OpenCode or Pi verifier use exists, and it dies if the evidence is only the stored goal string. Unsure bands from `verify`, `classify` and `exists` belong in that slice's cascade table. They are not a second heuristic. A missing `noul` filled as 0, which `screen` and `classify` both do, is the defect to refuse.

## 6. RQ4 Compaction

The census is build-now. The arm is later. `fitState` walks a stage ladder and can throw. `worth_it` is a character ratio of at least 0.25. The later arm's printed kill is `fit_throws>=50%` or an offline upper bound under 0.25, computed by dropping unpinned tool results to a short head and leaving prose alone, with no model.

deepseek-02 still describes the fit column as a 25,000-token estimate. That ceiling is not host `preTokens`. The column this lineage will accept is the local estimate plus the stage name, including throws. Their brief column (a `SessionStart:compact` attachment) was not re-counted. The Hermes dollar figure does not transfer.

pi-jev-context filters the model request and, by the vendor's note, invalidates a prompt cache. Saved pruning applies after an API error. That is not R19's arm.

The vendored `session.compact` hook runs unless compaction is set false and can read `TYPESAFE_API_KEY` from settings. It stays an anti-pattern.

## 7. RQ5 Outside patterns

| Pattern | Decision |
|---|---|
| `route`'s explicit `none` | Adopt as R1's abstain key. A gold-in-cluster `none` is a loss. |
| `rerank`'s missing score as 0 | Refuse. |
| `verify` as a lint | Refuse. |
| Prefix-blind assignment regexes | Fix locally. Not a Jev call. |
| Path refuse for `.env` | Already right for file names. Does not catch the two assignment strings in `app.ts`. |
| Print a call count, then throw if the body does not fit | Adopt on the first billed arm. |
| `clampText` writing `...` | Refuse for a Jev prompt. |
| jev-review's follow-at-most-8 | A different product. Not R10's gold. |
| Answer cache | Refuse for reruns. |

## 8. RQ6 What not to add

No new skill, command or global switch. No npm `jevctl` subcommand wrapped as if it were Python `jev-cli`. No phase whose only job is an exit-code matrix for arms that make no calls yet. The matrix, when 005 and 006 are written, is a copy of BASE `research.md:628`.

R10 does not promote. The duty to record a rejected P0 is in `completion-criteria.md:63`. The walk found the phrase `downgraded from P0` zero times. The one retraction sentence is a quoted changelog. The one `from P0 to P1` line is a focus heading.

## 9. RQ7 Cost, order and kills

Vendor dollar examples are not local costs. The line before a billed call is `planned calls: N, about T input tokens`. Dollars stay UNKNOWN.

Order:

1. Redaction, so both prefixed samples match. Blocks egress. Does not block censuses.
2. 002 zero-call and 005 census, side by side.
3. 002's billed arm, after the baseline matches, the planned count matches, the scrub matches, and missing answers cannot win.
4. 006 lexical lint and 003 zero-call.
5. R21 only on `underpowered`, with missing answers excluded. Other Jev arms stay later.

Single phase: step 2's 002 half only. Kills are in iteration 5.

## 10. Cross-lineage notes

Wave 1 agreement is the only corroboration that counts as independent. This lineage's wave 1 did not read siblings. deepseek-01 and this lineage both opened `__init__.py:327` and found the literal `jev 0.6.2`. That is agreement with a file each opened, not a shared reading of each other's iteration.

mimo-01 and deepseek-02 both report that they read no sibling. Their counts are not treated as this lineage's counts. swe wrote no iteration file, so there is no code-sized order to contest.

Disagreement that is grounded: deepseek-02's fit column. Agreement that is grounded: the version literal, and the empty shadow sink in this worktree.

## 11. Recommendations

| ID | Verdict | What this lineage adds |
|---|---|---|
| R1 | build-now | `choice` with explicit `none`. Missing answers are `unmeasured`. `none` on gold-in-cluster is a loss. |
| N-grok-04-1 | build-now | Prefix-tolerant scrub. No switch. |
| N-grok-05-1 | build-now | The single phase is 002's zero-call census. |
| R19 census | build-now | Stage column, not `preTokens` versus 25,000. |
| R20 | next | Lexical lint. Not `jev verify`. |
| R2 zero-call | next | Unsure bands inside the one cascade table. |
| N-grok-04-2 | next | Planned-call line, then refuse. |
| R21 | next, conditional | One `noul`. Not `route` or `rerank`. |
| R19 arm | later | Kill on throw rate or the offline bound. |
| R2 Jev arm | later | Waits on recorded verifier use. |
| R3 | later | Waits on `keep`. No per-prompt model switch. No answer cache. |
| R10 | later | `narrative_p0_negatives=0`. |

Every Jev item keeps its own flag. The three D5 checks are `command -v jev`, `jev --version` printing exactly `jev 0.6.2`, and `jev auth status` exiting 0. Failure prints `jev arm skipped: <check>` and the rest of the output matches the no-flag run. Exit 3 stops the arm. Exit 4 and a malformed answer mark the row `unmeasured`. Python exit 2 stops the arm. No path returns a default score.

## 12. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Install the npm `session.compact` hook | Runs unless compaction is false and can read the key from settings | `fast-jev.ts` enabled-default and key lookup, opened in iteration 1 | 1 |
| Use pi-jev-context's live filter as R19's arm | Filters the model request, vendor says it invalidates the prompt cache, and saved pruning survives an API error | pi-jev-context README and `context.ts`, iteration 1 | 1 |
| Compare host `preTokens` to `--max-state-tokens 25000` as one quantity | They are different objects. Fit is a stage ladder that can throw | `state.ts` `fitState`, iteration 1 | 1, 5 |
| Shell `jev verify` as R20's lint | Throws without evidence. npm exit 2 is not Python's usage exit | `verify.ts`, iteration 2 | 2, 5 |
| Use `rerank` as R1's modal pick | Missing `noul` becomes 0 and can fake `keep`. Ties follow input order | `rerank.ts:77-81`, iteration 3 | 3 |
| Treat `none` on a gold-in-cluster row as unmeasured | Hides a loss | `route.ts:180`, iteration 3 | 3 |
| Point R1 reruns at an answer cache | Zeroes the flip rate | `jevcache.md` is a URL. supercov cache at `quality.md:197` | 3, 4 |
| Adopt claude-jev's path refuse as the fix for `TYPESAFE_API_KEY=` and `SERVICE_TOKEN=` | The rule matches path segments. A check printed false for `app.ts` | `fs-source-reader.ts:16-33`, iteration 4 | 4 |
| Send a Jev prompt clamped with `...` | The question changes | `opencode-goal.js:388`. Throw instead: `jev.ts:96` | 4 |
| Promote R10 on narrative gold | 0 usable rejected-P0 rows in 3,271 iteration files | Phrase walk, iteration 4 | 4 |
| Park R19's census because the arm is later | The census is the build-nothing test | `council-report.md:310`, iteration 5 | 5 |
| Use a vendor dollar example as a local cost | The figures are illustrations or user reports | Hermes thread, `quality.md:195`, BASE's inferred R1 price | 1, 4, 5 |
| Build an exit-code matrix now for arms that do not call | The smallest slice makes no call | deepseek-01 F9. BASE `research.md:628` is the text to copy later | 5 |

## 13. Open Questions

| Question | State |
|---|---|
| 30, keep rule, R19 rank, R2 shape | Closed. Ranks unchanged. Clauses in §11. |
| 21, live `ambiguousWith` rate | 0 recorded events in this worktree. UNKNOWN elsewhere. |
| 7, narrative P0 negatives | 0 under the strict phrase list. The looser seat count of 41 was not repeated. |
| 18, production hook seconds | Not opened. |
| 19, recorded OpenCode or Pi verifier use | Not counted. R2's Jev arm stays later. |
| tau 0.03 veto | Council dissent says unresolved. Not rechecked. |
| mimo-01 power curve | Not recomputed. |
| deepseek-02 brief column | Not re-counted. |
| swe order | No file. |

## 14. Proposed Build Phases

No new phase number. Amendments, for the operator to accept before any Planned doc changes:

- 002's first slice prints the census and the comparators with zero calls. The keep rule gains the missing-answer clause. The planned-call line is `planned calls: N, about T input tokens` with no dollar amount. A body that does not fit prints `jev arm skipped: budget` and sends nothing.
- 005's fit column is the stage name plus the local estimate. Throws count. The 25,000 ceiling is not compared to host `preTokens`.
- 006 does not shell `jev verify`.
- 003's zero-call slice may carry the unsure bands in one table. Its Jev arm stays behind recorded verifier use.
- The scrub unit case is a precondition of egress, shared by any arm that sends text, and it is not behind `--jev`.

Build order is §9. Rollback of 002's slice: delete the new script and its reports. Rollback of the scrub: revert the two expressions. Neither touches a frozen caller until a later, separate change names that caller.

## 15. Evidence Quality

Confirmed by a command or a file opened in that iteration: the stage ladder, `worth_it`, the verify throw, route's `none`, rerank's 0, the four regex booleans, the 3,271-file phrase counts, the version literal, and the empty shadow directory in this worktree.

Inferred, and labeled where used: that a 0-filled rerank can pass a sign test when the survivor is gold. The mechanism is confirmed. No corpus was scored.

Not adopted, because this lineage did not recount them: mimo's movable bound and `q80`, deepseek's brief length, BASE's seat-reported 41 files, and every dollar figure.

Symlinks were not followed on the narrative walk. A file only reachable through a symlink is absent from the 3,271.

## 16. References

- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/research/research.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/ai-council/council-report.md`
- `specs/cli-jev/003-cli-jev-workflow-integration/001-deep-research/context/repo-rules-digest.md`
- `.skilled/repo-rules/prevent-overengineering.md`
- Vendored trees under `specs/cli-jev/003-cli-jev-workflow-integration/context/external repo's/` (`jev-cli-main`, `claude-jev-main`, `pi-jev-context-main`, `jev-review-main`, `supercov-main`)
- This lineage's `iterations/iteration-001.md` through `iteration-005.md`

`resource-map.md` in this directory was written at synthesis. It was absent at init and is not an input.

## 17. Convergence Report

`convergenceMode` is off. `newInfoRatio` by iteration: 0.75, 0.72, 0.78, 0.81, 0.62. All five sit above the 0.05 threshold. That fact is telemetry. The loop stopped because the cap is 5.

stopReason: maxIterationsReached. totalIterations: 5.
