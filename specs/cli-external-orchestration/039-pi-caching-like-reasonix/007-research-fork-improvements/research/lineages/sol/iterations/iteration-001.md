# Iteration 1: Baseline Architecture and Ownership Contract

## Focus

Establish what each fork currently owns, what has already been proven, and which seams deserve deeper investigation rather than rediscovering closed work.

## Findings

1. The runtime ownership split is correct but duplicated: `deep-pi` declares the two direct DeepSeek ids in `DEEPPI_MODEL_IDS`, while `pi-cache-optimizer` independently repeats the same provider/id predicate. Any future supported-model change therefore requires a coordinated two-repository edit; a mismatch can create either double mutation or a coverage hole. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279]
2. `pi-cache-optimizer` guards all six model-specific hooks, and the completed packet has live evidence for direct DeepSeek silence plus continued coverage of non-direct DeepSeek-family and non-DeepSeek models. The remaining improvement is contract-level drift detection, not broader guard logic. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:7279] [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/003-fork-and-guard-cache-optimizer/implementation-summary.md:85]
3. `deep-pi` is intentionally modular (eligibility, stability, storm breaker, telemetry, hashlines), but its entry point still funnels its full report only through `ctx.ui.notify`; this explains why non-interactive report capture remains a product-interface gap rather than a telemetry-format gap. [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:1] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:64]
4. The two projects have sharply asymmetric state lifecycles: `pi-cache-optimizer` advertises daily/session/process persisted stats and a persisted config, while `deep-pi` resets all telemetry at session start and has no durable storage path. This makes cross-session economics incomparable even though both claim cache economics. [SOURCE: .pi/extensions/pi-cache-optimizer/README.md:85] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi.ts:46]
5. Maintenance risk is concentrated in `pi-cache-optimizer`'s 8,390-line single source file and 887-line single test file, whereas `deep-pi` has 1,341 source lines split across seven modules and 1,213 test lines split across eight files. This is objective structural debt: the cache optimizer combines parsing, persistence, UI, provider adapters, mutation hooks, repair, and diagnostics in one compilation unit. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1] [SOURCE: .pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts:1] [INFERENCE: line counts from `wc -l` over both vendored extension trees]

## Ruled Out

- Reusing `pi-cache-optimizer`'s broad `isDeepSeekLikeModel` for ownership is unsafe because it intentionally matches non-direct DeepSeek-family routes that must stay cache-optimizer-owned. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1275]
- Re-activating `deep-pi` for every future `deepseek-v*` id remains unsafe until telemetry storage and model-specific assumptions become open-ended; the completed packet already traced the crash path. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/001-fix-and-test-deep-pi/spec.md:79]

## Dead Ends

- Treating the known non-interactive report limitation as proof that RPC exposes nothing. Prior live work confirmed RPC carries some extension UI events; the unresolved question is full-body delivery. [SOURCE: specs/cli-external-orchestration/039-pi-caching-like-reasonix/006-fork-and-improve-deep-pi/003-live-verification-and-closeout/implementation-summary.md:60]

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: none.
- Missing dependencies: no target `resource-map.md`; direct source inventory substituted.
- Partial success: none.

## Sources Consulted

- `.pi/extensions/pi-cache-optimizer/index.ts`
- `.pi/extensions/pi-cache-optimizer/README.md`
- `.pi/extensions/deep-pi/extensions/deeppi.ts`
- `.pi/extensions/deep-pi/extensions/deeppi/eligibility.ts`
- sibling packet 003 and 006 implementation summaries/specs

## Assessment

- New information ratio: 1.0
- Novelty justification: First lineage pass; all five synthesized baseline findings are new to this packet.
- Questions addressed: correctness ownership, observability asymmetry, maintainability.
- Questions answered: none fully; the baseline narrows subsequent investigation.

## Reflection

- What worked and why: pairing source reads with sibling closeout evidence separated proven guarantees from remaining gaps.
- What did not work and why: broad grep output was noisy because `index.ts` is unusually large; subsequent passes should target named functions and line ranges.
- What I would do differently: audit one concern per pass with focused source slices and executable checks.

## Recommended Next Focus

Audit correctness and failure isolation around state persistence, atomic writes, concurrent events, and the cross-extension ownership seam.
