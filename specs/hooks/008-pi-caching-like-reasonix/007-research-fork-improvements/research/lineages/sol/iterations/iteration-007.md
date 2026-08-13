# Iteration 7: Adversarial Prioritization

## Focus

Convert the preceding findings into a delivery order that favors demonstrated correctness and evidence gaps over architectural ambition.

## Findings

1. The first implementation slice should build the evidence floor: restore DeepPi's missing live benchmark artifact, add a credential-independent fake-provider route test, add the shared ownership fixture matrix, and encode the first/second/restart cold-start scenario. These are low-risk and make later telemetry, economics, and refactors measurable. [SOURCE: .pi/extensions/deep-pi/package.json:56] [SOURCE: .pi/extensions/deep-pi/tests/package.test.ts:8] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279]
2. The highest-severity correctness change is cache-optimizer state durability: serialize across processes, quarantine malformed state instead of overwriting it, use collision-resistant exclusive temp creation, guarantee cleanup, and add race/fault tests. This can lose or erase accumulated statistics today; unlike most other findings, the failure follows directly from the read/merge/rename transaction and swallowed parse error. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4264] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4293] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4306]
3. DeepPi's versioned numeric snapshot is the next product-facing improvement because it simultaneously closes the non-interactive report gap, supplies durable evidence for live regressions, and supports cost experiments. Implement a pure report object and atomic per-extension file before adding another output transport. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:80] [INFERENCE: one structured producer serves TUI, files, tests, and benchmarks]
4. Economic work should follow stable telemetry: correct the `estimatedSavingsVsNoCache` label and cache-write handling immediately, but defer causal savings claims until the repeated enabled/disabled crossover exists. The benchmark must publish price provenance and separate provider latency from local hook duration. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/telemetry.ts:47] [SOURCE: https://api-docs.deepseek.com/guides/kv_cache] [SOURCE: https://api-docs.deepseek.com/quick_start/pricing?push_animated=1&show_loading=0&theme=light&webview_progress_bar=1]
5. Maintainability changes split into quick stewardship and staged architecture. Unique fork versions, patch ledgers, package-content checks, and duplicate-interface cleanup are cheap and reversible; cache-optimizer modularization is valuable but should begin only after characterization and persistence tests. The DeepPi `edit_lines` cross-process TOCTOU risk should remain monitored rather than driving a lock protocol now because no live clobber symptom is recorded and a stale-lock design could introduce a worse failure mode. [SOURCE: .pi/extensions/deep-pi/package.json:3] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:165] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6471] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:83] [INFERENCE: prioritize observed or mechanically demonstrable failures over speculative concurrency machinery]

## Priority Program

| Order | Work package | Evidence | Effort | Main acceptance signal |
|---:|---|---|---|---|
| 1 | Evidence floor and ownership contract | High | Low-medium | benchmark file packages; fake-provider matrix passes; cold/warm/restart fixture records structured usage |
| 2 | Cache-optimizer persistence hardening | High | Medium | deterministic two-process race and corruption tests preserve every update and original bad file |
| 3 | DeepPi structured persistent report | High | Medium | TUI and JSON snapshot derive from identical data; restart retains daily totals |
| 4 | Honest economics and controlled benchmark | Medium-high | Medium | reports distinguish no-cache counterfactual from measured treatment delta with price provenance |
| 5 | Fork provenance and hygiene gates | High | Low | unique build ids, patch ledger, package-content and duplicate-symbol checks pass |
| 6 | Staged cache-optimizer extraction | Medium | High | each seam moves with unchanged characterization results and a smaller production test export |
| 7 | DeepPi cross-process edit locking | Low-medium | Medium-high | only promote after a reproducible clobber or deployment evidence of concurrent writers |

## Ruled Out

- Starting with the monolith refactor; it expands blast radius before the missing behavioral evidence exists. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:6471]
- Treating every concurrency observation as equally urgent. Cache-stat loss is mechanically demonstrable; hashline clobber remains a plausible but unobserved external-writer race. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:4264] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/hashlines.ts:83]
- More RPC transport experiments before producing a structured snapshot. The snapshot closes the automation boundary independently. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64]

## Dead Ends

- A single composite “cache improvement percentage” would mix automatic provider caching, extension transformations, pricing changes, and hook overhead. Keep those measures separate. [SOURCE: https://api-docs.deepseek.com/guides/kv_cache]

## Edge Cases

- Ambiguous input: “improve both forks” does not require symmetric features; shared envelopes are useful, shared writable state is not.
- Contradictory evidence: atomic rename improves crash safety but does not make a multi-process read/modify/write transaction atomic.
- Missing dependencies: credentialed live economics remain optional evidence; all contract and persistence tests can be local.
- Partial success: the program is implementable from current evidence, but paid benchmark sample sizes require an explicit budget and target models.

## Sources Consulted

- all prior iteration narratives and state records
- critical persistence, package, telemetry, eligibility, and hashline source boundaries
- official DeepSeek caching and pricing documentation

## Assessment

- New information ratio: 0.45
- Novelty justification: No new defect class was needed; the value is an evidence-weighted order and explicit deferrals.
- Questions addressed: all five research questions and the implementation dependency graph.
- Questions answered: all key questions are sufficiently answered for synthesis; live economics remains an execution dependency, not a research blocker.

## Reflection

- What worked and why: separating proof strength from potential impact prevented a plausible DeepPi race from outranking demonstrated persistence loss.
- What did not work and why: a single numerical priority score hid different failure modes; ordered work packages preserve the reasons.
- What I would do differently: define the paid-run budget before selecting benchmark rounds and models.

## Recommended Next Focus

Synthesize the seven verified iterations into the final research report, evidence map, registry, dashboard, and terminal lineage state.
