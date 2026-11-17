# Iteration 3: Q2 — review side: divergent-review-pivot.ts, deep-review reducer, review prompt pack, fanout-merge.cjs internals

## Focus

Map the four review-side mechanisms generation 1 never read (`divergent-review-pivot.ts`, the review block of `reduce-state.cjs`, the review prompt pack in `deep-review.yaml`, and `fanout-merge.cjs` review internals), identify what keeps review runs narrow, and name what the frontier sub-mode must change there. Selected interpretation: "reducer" = the review half of the shared `runtime/scripts/reduce-state.cjs`; "prompt pack" = the `render_prompt_pack` step output in `deep-review.yaml` plus its pivot/override prompt bodies.

## Actions Taken

1. Read `deep-review/scripts/divergent-review-pivot.ts` in full (428 lines) — adapter is a pure input-builder; trigger guard, seed vocabulary, boundary filter, seat mandates.
2. Read `reduce-state.cjs:1190-1269` (dimension derivation + `buildDimensionCoverage`) and `:2160-2259` (review strategy-section renderer incl. nextFocus chain); greped for inbox/question surfaces — zero hits in the whole file.
3. Read `convergence.cjs:1090-1199` (stop decision: `cleanReviewStop`, `all_dimensions_clean`, review BLOCKED path) and `:1520-1599` (`stopDecisionReviewFacts`: `missingDimensions` derivation).
4. Read `fanout-merge.cjs:869-997` (`mergeReviewRegistries`); greped structure (`REQUIRED_DIMENSIONS`, dedup, verdict). Cross-checked `deep-review.yaml` for prompt-pack and frontier/proposal wiring.

## Findings

1. **Custom `reviewDimensions` make `all_dimensions_clean` unreachable AND disable the review pivot entirely — a new defect beyond D1-D9.** `buildDimensionCoverage` only ever writes the four hard-coded `REQUIRED_DIMENSIONS` keys: the map is initialized to exactly those keys (`reduce-state.cjs:1225-1227`), the iteration-record loop sets `covered[normalized] = true` only `if (normalized in covered)` (`:1233-1237`), and the strategy-checklist loop flips a key only when the entry text *contains* a required dimension name (`:1246-1247`). Convergence, however, computes `missingDimensions` as every `config.reviewDimensions` entry with `coverage[dim] !== true` (`convergence.cjs:1540-1556`). A configured dimension outside the 4 can therefore never be covered → `cleanReviewStop` (`:1106-1111`) never fires → `all_dimensions_clean` (`:1145`) never emitted → the adapter throws for any other `triggerReason` (`divergent-review-pivot.ts:338-340`), so the pivot path is dead too. A review run with custom dimensions silently degrades to `composite_converged`-or-cap. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1223] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1540] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1106] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:338]

2. **Review has no question surface at all — generation 1's `inbox.jsonl`/`registry.frontier` admission design is research-shaped and has no review-side target.** No `inbox`, `keyQuestions`, `openQuestions`, `uncoveredQuestions`, or `reviewQuestions` exists anywhere in `reduce-state.cjs` (whole-file grep, 0 hits). The review coverage universe is `reviewDimensions`, normalized once at init (`deep-review.yaml:645` "Normalize reviewDimensions once during init for config + JSONL reuse"; also in `lockedFields`, `deep-review-config.json:95`). The only growable review registry surfaces are exactly the ones the pivot mines: `searchDebt`, `candidateCoverage`, `ruledOutCandidates`, `cleanSearchProof`, `traceability.results` (`divergent-review-pivot.ts:203-289`). A review frontier sub-mode therefore needs a *dimension/candidate admission surface* (frontier nodes admitted into `candidateCoverage`/`searchDebt`, or a `registry.frontier` the review nextFocus chain reads) — not an inbox row. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:645] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:203]

3. **Review nextFocus chain: leaf free text outranks the uncovered-dimension fallback — the D5 hijack exists verbatim on review.** `nextFocus = latest iteration-file "Recommended Next Focus" || first uncovered REQUIRED_DIMENSION || '[All dimensions covered]'`, then `registry.divergence.currentFocus` overrides it, then a most-recent blocked-stop pins recovery text (`reduce-state.cjs:2184-2215`; free text extracted at `:355`/`:379`). The pivot's `previousFocus` is re-read from that same strategy section (`divergent-review-pivot.ts:355-356`). A leaf's free text can pin focus indefinitely, and the structured fallback can only ever name one of the 4 dimensions. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2184] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:355] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:355]

4. **The review pivot's seed vocabulary is closed and re-derivational — it can re-sweep obligations but never widen the target.** Exactly five seed sources: unswept `config.reviewDimensions` (`:213-223`), `registry.searchDebt` (`:225-237`), v2-ledger method gaps for `producer_consumer_trace`/`negative_test_inspection` — only on `reviewDepthSchemaVersion === 2` records (`:239-268`) — and non-pass `traceability.results` (`:271-286`). Boundary regexes reject seeds implying implement/modify/rewrite/expand-scope (`:172-184`), and all three fixed seat mandates require closing "persisted coverage gap *without expanding the configured target*" (`:398-402`). Combined with finding 1, custom dimensions produce a permanent `unswept-dimension` seed on every pivot while never being coverable. [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:203] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:172] [SOURCE: .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:398]

5. **`fanout-merge.cjs` merges findings and debt but drops every coverage surface — the merged review registry cannot represent per-lineage coverage.** `mergeReviewRegistries` output = `openFindings`/`resolvedFindings`/`findingsBySeverity`/`searchDebt`/`failedRequiredGateIds`/`mergedVerdict` only (`:981-996`); `dimensionCoverage`, `traceability`, `searchCoverage`, `candidateCoverage`, `divergence`, `ruledOutCandidates` are never read. Generation 1's proposed "merge-time coverage guard" has no merged coverage map to read, and a `frontier_scope` partition (gen-1 plan: model on `review_focus`) cannot express frontier coverage today. Mechanics: only `disposition ?? status === 'active'` findings merge (`:894`); resolved findings suppressed while active in any lineage (`:917-919`); dedup key `findingId || title` plus optional title-token near-dup buckets (`:344-398`, `:898-904`); canonical record = highest `SEVERITY_RANK` (`:587-617`); `searchDebt` unioned by `bugClass || id`, first lineage's record wins (`:945-955`); verdict via `deriveReviewVerdict` strongest-restriction (`:958-964`). [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:869] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:981] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:587]

6. **The review prompt pack exposes frontier only as pivot-candidate frontier — there is no `frontier_proposal` channel for the review leaf (partially verified).** The dispatch renders via `render_prompt_pack` (`deep-review.yaml:1450`); every "frontier" occurrence in the yaml binds to the pivot adapter's persisted candidate frontier (`:1239`, `:1289-1290`) or to reducer-rendered divergence output (`:2098`); grep over the file finds no `frontier_proposal`/`expansive` wiring. Generation 1's leaf-proposal delta row was specified for the research pack only; the review pack's proposal surface would have to be added too. Confidence is partial: the pack body was not read in full, but the enumerated frontier hits cover the mechanism. [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1450] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:1239] [SOURCE: .skilled/commands/deep/assets/deep-review.yaml:2098]

## Ruled Out

- Admitting frontier nodes through `research/inbox.jsonl` on the review side — the review reducer has no question surface to project it into; nothing reads an inbox row (finding 2).

## Dead Ends

None — all four target surfaces yielded findings on first read. (Candidates for reducer promotion: finding 1's custom-dimension dead-stop should not be re-derived.)

## Edge Cases

- Ambiguous input: "review prompt pack" interpreted as the `render_prompt_pack` dispatch step + pivot/override prompt bodies in `deep-review.yaml` (not a standalone file); finding 6 marked partially verified accordingly.
- Contradictory evidence: none — the reducer/convergence asymmetry in finding 1 is a code-level defect, not a source conflict.
- Missing dependencies: none.
- Partial success: finding 6 relies on exhaustive grep enumeration rather than a full pack read; flagged in the finding.

## Sources Consulted

- `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` (full)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:24,355,379,1190-1269,2160-2259` + whole-file inbox/question grep
- `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1090-1199,1520-1599`
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1-60,869-1008` + structural grep
- `.skilled/commands/deep/assets/deep-review.yaml` (targeted greps: prompt pack, frontier, reviewDimensions)
- `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:37,95` (via grep)

## Assessment

- New information ratio: 0.9 (5 of 6 findings fully new internals; finding 6 partially verified)
- Questions addressed: Q2 (all four mechanisms mapped; gen-1 gaps named)
- Questions answered: Q2 — with one refinement: the gen-1 claim "the review reducer has the same shape" holds for focus-source chaining but misses that the review coverage universe is a fixed 4-key map with no question surface, which changes where frontier admission must land.

## Reflection

- What worked and why: reading the adapter file in full first exposed the single-trigger guard and the closed seed vocabulary, which made the `missingDimensions` vs `buildDimensionCoverage` asymmetry (finding 1) visible the moment the convergence side was read — a cross-file invariant check rather than a per-file summary.
- What did not work and why: nothing failed; the review reducer's location inside the shared `reduce-state.cjs` was already known from generation 1, so no time was lost locating it.
- What I would do differently: a targeted grep for `reviewDepthSchemaVersion` producers would have priced finding 4's v2-ledger gate sooner; deferred to Q5's slice work.

## Recommended Next Focus

Q4 (skill-advisor `df-idf.ts` + prompt-policy gate on casual chat) — the last unread subsystem; then Q5 should fold findings 1-6 into concrete slices (fix the coverage-key filter, define a review frontier admission surface, add `frontier_proposal` to the review pack, extend the merge to carry coverage/frontier maps).

## Questions Answered

- Q2: On the review side, how do divergent-review-pivot.ts, the deep-review reducer, the review prompt pack and fanout-merge.cjs internals keep review runs narrow, and what does the frontier sub-mode need to change there that generation 1 did not map?

## Questions Remaining

- Q4 (skill-advisor scorer + prompt-policy gate), Q5 (change slices — now includes review-side slices for findings 1-6), Q6 (completed-run extension), Q1 residual (D4/D8), open sub-question on per-pivot `maxCouncilSeatOutputs`.

## Next Focus

Q4: skill-advisor scorer (`df-idf.ts`) and prompt-policy gate on casual chat — the only subsystem still unread.

## SCOPE VIOLATIONS

None. No out-of-scope write was needed or attempted. `research/research.md` was not created: `progressiveSynthesis` permits it but the dispatch's explicit allowed-write list names only the iteration narrative, the delta file, and the gateway's own writes — and prior iterations made the same choice; synthesis remains workflow-owned.
