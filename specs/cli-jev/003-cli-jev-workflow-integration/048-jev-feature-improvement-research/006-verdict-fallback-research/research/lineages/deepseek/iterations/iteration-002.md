# Iteration 2: Accuracy and cost levers the recorded run exposes

## Focus

Identify concrete ways to raise the fallback's accuracy or lower its cost, separating recomputed effects on the recorded run from proposals that need a new measurement.

## Findings

1. **The measured protocol spends three calls per miss plus one auth call, serially.** For 24 rows the arm planned 73 calls (`3*K + 1`) and estimated 16,767 input tokens from a ceil(chars/4) heuristic; p50 wall time per call is 334 ms and p95 377 ms, so the sequential arm runs about 24 s of call time. Every row's cost is therefore 3x the minimum one-call ask. [SOURCE: score-verdict-fallback.cjs:42,700-708,775-830] [SOURCE: ~/.skilled/.labels/runs/047-025-jev.stdout.txt]

2. **Order rotation bought no accuracy on this corpus; a one-call protocol would have produced identical picks.** Recomputation over `calls.jsonl`: every row's three order picks are identical (F=0 and modal top=3 on all 24 rows), and the lowest recorded `pickProb` is 0.96. A confirm-on-uncertainty protocol (call two only when the first pick is missing or below a confidence line) would also have used 24 calls here. The three-order design exists to detect option-position bias, which this run shows no trace of; a single run cannot prove bias absent, but it is the measured cost case. [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/calls.jsonl recomputed] [SOURCE: score-verdict-fallback.cjs:418-419,775-830]

3. **Cost is invisible in the run's artifacts even though the client reports usage.** `calls.jsonl` records `wallMs`, `pickProb` and status, but no tokens or cost, while the `jev` response body carries `usage.input_tokens` / `usage.output_tokens` (the CLI's own recorded response shows the shape). The only cost figure anywhere is the pre-run ceil(chars/4) estimate, and `jev auth test` is itself a billed call. Recording usage per call would turn cost into a measured quantity per miss and per corpus. [SOURCE: score-verdict-fallback.cjs:702-708,758-773] [SOURCE: .skilled/skills/cli-classifier/cli-jev/benchmark/reports/2026-09-20-authenticated-verification/skill-benchmark-report.md:64] [SOURCE: .skilled/skills/cli-classifier/cli-jev/references/providers-and-models.md:148]

4. **A cache precedent exists in the same pipeline, and the fallback has none.** The eval rig keeps an append-only grader cache keyed by canonical input bundle and grader model build hash, with an explicit run-scoped root. The verdict fallback records no cache, so any rerun over the same outputs re-pays every call; the scorer's `requalify` check already shows the right invalidation seam (provider/model change). A content-hash cache (output text + question + options + model identity) would make repeated benchmark runs nearly free without hiding model drift. [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/lib/cache.cjs:1-45] [SOURCE: score-verdict-fallback.cjs:845-850]

5. **The regex accepts a narrower family of line shapes than reviewers plausibly write, but this corpus cannot price a widening.** A direct probe: `VERDICT: FAIL`, `Verdict: pass.`, `verdict - fail`, `Status: BLOCK` and whitespace-padded forms all hit; `**VERDICT: FAIL**`, `Verdict: **FAIL**`, `# VERDICT: FAIL`, `Final verdict: pass`, `Verdict: pass — stale evidence`, `Verdict: FAIL (stale evidence)` and `Conclusion: pass` all miss. Widening would cut fallback demand deterministically (the cheapest accuracy for near-miss formats), but the measured corpus contains no verdict tokens at all, so any widening's benefit must be measured on a natural miss corpus. [SOURCE: reviewer-scorer.cjs:117-123] [SOURCE: regex probe recomputed against the shipped `extractVerdict`]

6. **The production grader path is heavier than the Jev path that would replace it.** `classifyWithGrader` under `--grader llm` dispatches a process-isolated CLI through `dispatch-model.cjs` (default `cli-opencode`, also `cli-claude-code`; default timeout 600 s), while the recorded Jev arm's p50 is 334 ms hosted. A Jev backend on the grader keeps the same three-key contract, drops process-per-call overhead, and is the measured alternative to CLI dispatch. [SOURCE: reviewer-scorer.cjs:155-167] [SOURCE: .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs:139-141,437-472,490-536] [SOURCE: score-verdict-fallback.cjs:700-750]

## Ruled Out

- Treating the three-order protocol as free accuracy on this population: F=0 and unanimous picks mean the third call added cost, not information, on these 24 rows. [SOURCE: calls.jsonl recomputation]
- Treating a regex widening as measurable on the current corpus: the corpus avoids every verdict token, so widening can only be priced against a natural-miss corpus. [SOURCE: token census from iteration 1]
- Treating the printed token estimate as measured cost: it is a character heuristic printed before the first call, not usage from the client. [SOURCE: score-verdict-fallback.cjs:702-708]

## Dead Ends

- Searching the run artifacts for a dollars figure: none exists; the 047 evidence records only latencies and the verdict line. [SOURCE: ~/.skilled/.labels/runs/047-025-jev-20261002/ and 047 results.md:14]

## Edge Cases

- Failure paths have their own cost profile: exit 4 waits 2 s and retries once, timeouts kill at 90 s per call, and an interrupted or key-rejected arm stops with partial rows already recorded. A production cost model needs these tail cases, not only p50. [SOURCE: score-verdict-fallback.cjs:788-794,975-976,816-822]
- The auth call is also the model-identity probe (`auth test` returns the model that `requalify` compares against a stored report); skipping it saves one call but removes the drift check unless the model id is read another way. [SOURCE: score-verdict-fallback.cjs:719-750,845-850]

## Sources Consulted

- score-verdict-fallback.cjs:42, 418-419, 700-863, 975-976, 845-850
- reviewer-scorer.cjs:117-123, 155-167
- dispatch-model.cjs:139-141, 437-472, 490-536
- scorer/lib/cache.cjs:1-45
- cli-jev/references/cli-reference.md:38-66; providers-and-models.md:122-148
- cli-jev/benchmark/reports/2026-09-20-authenticated-verification/skill-benchmark-report.md:64
- ~/.skilled/.labels/runs/047-025-jev-20261002/{calls.jsonl,report.json}; stdout.txt
- deep-research-strategy.md (read before iteration 2); steer.md (checked before iteration 2; absent)

## Assessment

- New information ratio: 0.85
- Novelty: four cost mechanisms (one-call sufficiency on this corpus, usage-recording gap, cache precedent, grader-path overhead) and one accuracy/format lever, each grounded in files not cited by iteration 1.
- Questions addressed: Q2 fully; Q3 partially (cost evidence is also trust evidence).
- Questions answered: How can accuracy improve or cost fall?
- Confidence: High for the recomputed call counts, stability and format probes. The proposal to widen the regex or drop to one call requires a fresh run to price; that is stated rather than assumed.

## Reflection

- What worked and why: recomputing per-row stability from `calls.jsonl` turned "3 calls per row" from a design statement into a measured 3x cost with zero measured benefit on this corpus.
- What did not work and why: no cost figures exist in the record, so all dollar reasoning remains structural, not measured.
- What I would do differently: check the client's response shape for `usage` before concluding cost is unrecordable; it is recordable and simply not recorded.

## Recommended Next Focus

Iteration 3: audit the measurement's trustworthiness — corpus construction, label provenance, baseline choice, power, and what a natural-miss corpus would have to change.
