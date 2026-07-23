# Iteration 5: Adversarial Validation and Both Execution Plans

## Focus

Try to overturn the shelf recommendation, map the live-code blast radius, and deliver complete reversible plans for either operator choice.

## Findings

1. Shelving has a bounded live-code blast radius. In executable `.mjs`, database-mode references outside `_db` occur only in `_engine/persistent-adapter.mjs`, `_engine/style-library.mjs`, and the DB adapter tests. The four corpus modules have no direct DB imports, so their API need not change. [SOURCE: scoped Grep for `SK_DESIGN_STYLE_DB_MODE|styleDatabaseMode|persistent-adapter|_db/...` under `.opencode/**/*.mjs`]
2. The flat engine is not an unsafe fallback. Its dedicated suite covers byte-stable non-writing checks, eligibility-first behavior, source-scan fallback, generation/path/hash hydration guards, invalidation, and proof behavior. It rejects poisoned derived fields and stale manifests before query, and enforces generation, rights, byte, and path-escape guards during hydration. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/index.mjs:1-10] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:14-80] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/hydrate-guard.test.mjs:20-163]
3. The strongest pro-wire counterargument is repeat-query cost: the legacy engine reconstructs freshness and disposable search repeatedly, while the persistent implementation already has safe publication and richer retrieval. Wiring now would be rational if real design sessions issue enough queries to breach an approved latency SLO and a clean-checkout publication lifecycle is already funded. Neither condition is evidenced, so the counterargument does not overturn the recommendation. [SOURCE: iterations 1-3]
4. **Wiring plan if kept:** (a) preserve the facade and flat files as content authority; (b) choose and document clean-checkout distribution, either checked-in immutable generation under a size budget or mandatory install/prewarm build; (c) build and publish a real full-corpus generation, record size/build telemetry, and verify status/rollback; (d) add authoritative refresh ownership after corpus extraction plus periodic reconciliation; (e) run legacy/persistent shadow against representative consumer requests, strict oracle/refusal/generation parity, and human relevance judgments; (f) meet every promotion gate from iteration 4; (g) switch the adapter default to persistent while retaining an explicit legacy kill switch for a bounded observation window; (h) monitor pointer/generation/vector failures and latency; (i) remove dual-mode code only after the window. Rollback is one manifest-pointer reversal plus the legacy kill switch. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:27-87] [SOURCE: iteration-004.md]
5. **Deprecation plan if shelved:** (a) record the decision and mark the 015 roadmap and children superseded/shelved rather than planned; (b) retain 013/015/this research as design evidence and reactivation gates; (c) remove `_db`, DB-only tests/goldens/seeds, `persistent-adapter.mjs`, `SK_DESIGN_STYLE_DB_MODE`, `styleDatabaseMode`, CLI `--backend/--database`, and DB README claims; (d) route `runQuery`/`runHydrate` directly to the existing flat implementation; (e) keep the retrieval manifest because it is the flat engine's generation/freshness contract, then rename/restructure it only in the separate filesystem packet; (f) run the flat engine suite plus all four corpus suites and verify no DB imports/modes/artifacts remain; (g) remove planned DB evolution from active navigation. Rollback is a targeted Git revert; no data migration exists because no real DB was published. [SOURCE: scoped dependency Grep] [SOURCE: scoped retrieval-manifest Grep] [SOURCE: gap-analysis.md:72-105]
6. Preserving dormant runtime code is not a safe middle path. It leaves two supported semantics, mode-dependent failures, roadmap obligations, and documentation drift while providing no user-visible default capability. Preserve knowledge, not an unowned live surface. [INFERENCE: iterations 2-5]

## Ruled Out

- Shelf by deleting `_retrieval-manifest.json`: it belongs to and protects the flat engine.
- Shelf while leaving environment/CLI switches live: that is the current dormant state, not remediation.
- Wire by lazy query-time build: integrity-sensitive reads should not unexpectedly walk and mutate the corpus.
- Wire without a clean-checkout distribution decision: a missing pointer would make default consumers fail.

## Dead Ends

- No evidence overturns the shelf recommendation. The remaining pro-wire case is explicitly contingent on future measured workload and funded lifecycle ownership.

## Edge Cases

- Ambiguous input: whether to preserve generic canonicalizer/telemetry/oracle modules. They are currently DB-owned and have no independent consumer; preserve their design in docs/Git, not live source, unless a concrete reuse is identified before removal.
- Contradictory evidence: the recently built foundation is high quality, but removing it can still be correct because quality does not create demand.
- Missing dependencies: the operator must approve final deletion scope and the proposed numeric reactivation thresholds.
- Partial success: plans are implementation-ready at decision level but intentionally do not enumerate every deleted file.

## Sources Consulted

- Detached state/config/strategy through iteration 4.
- Scoped DB-mode/import dependency search.
- Scoped retrieval-manifest/build ownership search.
- Flat engine test index, stable-check tests, and hydration-guard tests.

## Assessment

- New information ratio: 0.43
- Novelty justification: The bounded blast radius and both sequenced execution plans are new; the final recommendation consolidates prior evidence.
- Questions addressed: safe wiring and deprecation plans.
- Questions answered: both paths are reversible; shelving is lower-risk and better supported now.
- Confidence: high on recommendation and blast radius; medium on exact implementation scope pending a dedicated plan/review.

## Reflection

- What worked and why: dependency search confirmed that storage choice is isolated enough for a clean shelf without consumer rewrites.
- What did not work and why: no runtime trace exists to test the strongest pro-wire hypothesis; it remains a reactivation gate.
- What I would do differently: if the operator chooses wire despite the recommendation, make the first implementation task measurement and distribution proof, not default flipping.

## Recommended Next Focus

Synthesize the five iterations into the final decision report. Stop reason: `maxIterationsReached`.
