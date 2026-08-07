# Deep Review: Playbook-Findings Remediation

Twenty-iteration adversarial review (ran 12 iterations before a session limit; 583 agents, skeptic-verified). Confirmed: 14 P0, 69 P1, 84 P2. The synthesis agent died on the session limit, so this report is hand-synthesized from the verified findings. The review targeted only the remediation commits f2cc2fc843..be9fdab279.

## Verdict

The remediation does NOT hold up. Several headline fixes are incomplete, defeated downstream, or introduce new bugs, and the unit verification passed partly because tests were gamed or exercised source the runtime does not run. This work is on the pushed 028 branch and should be fixed (or rolled back) before it is trusted.

## Distinct P0 issues (deduped from 14)

1. Score corruption (Cluster B, 5 confirmations, 2/2). `applySearchScoringObservability` in handlers/memory-search.ts:691-710 runs at line 1382 AFTER ranking and re-applies the document-type multiplier (spec 1.4, constitutional 2.0, scratch 0.6) plus the interference penalty to the already-final score, then writes it back into score/rrfScore/intentAdjustedScore. The "observability" hook silently mutates every returned score. Its test mocks the formatter and asserts only the observation count, so it never sees the corruption. Fix: make the hook observe-only (log without reassigning the score), add a no-mutation test.

2. Stale dist, runtime unfixed (Clusters E + D, 3 confirmations, 2/2). The daemons run the compiled dist/, which was never rebuilt for this remediation (dist mtime predates the source edits, dist is gitignored). dist/lib/search/channel-representation.js still has the removed below-floor guard, dist advisor-validate.js still has the old sync persistence. The green tests exercised TS source via vitest, not the served build. Fix: rebuild dist (npm run build) and ship it, add a CI gate that fails when dist is older than its source.

3. Folder-rank ordering clobbered (Cluster D, 3 confirmations, 2/2). twoPhaseRetrieval now sorts folder-rank-primary, but in the default path it runs before truncateToBudget and reorderTopNByCosine, and after channel-enforcement and graph-additive tail reservation, all of which re-sort by score or by window/tail boundaries, discarding folder rank. The D1 fix never reaches the caller. Fix: order folder-rank after the budget/cosine stages or fold folder rank into their comparator.

4. Routing re-map fails end-to-end (Cluster E, 2/2, confirmed live via CLI). "deep review" and "deep research" now route to sk-code-review at 0.85, never to the deep leaf. The native TS scorer does not surface the new deep-review/deep-research nodes into topK, and the Python cap can only demote, not inject. Fix: give the native lane positive lift for the deep nodes, or keep emitting deep-loop-workflows with mode discrimination per the SKILL.md contract.

5. Retry vs shutdown race (Cluster F, 2/2). The new opportunistic-restart guard in retry-manager.ts:887-890 clears shutdownRequested inside processRetryQueue, which exactly matches the post-stopBackgroundJob state, so a memory_save during fatalShutdown re-arms the retry pipeline and races DB writes against closeDb's WAL checkpoint. Fix: do not reset shutdownRequested inside processRetryQueue; re-arm only on an explicit start.

6. Code-graph selective-refresh over-triggers (Cluster G, 1/2). canRunSelectiveRefresh fires for ALL full_scan reasons including HEAD-drift and over-threshold scans, reindexing only the known stale files and skipping the full scan that would catch new in-scope files, leaving them permanently unindexed. Fix: gate the selective refresh to the genuinely-selective case (stale under threshold, not HEAD/scope drift).

## Key P1 issues

- Reorg left 10 dangling specFolder entries in the GLOBAL .opencode/specs/descriptions.json (and 4 double-indexed grandchildren), directly contradicting the commit's "zero dangling references" claim. The reorg only rewired the 028 tree, not the global index. Fix: regenerate descriptions.json and re-run the index scan.
- E5 bench-exit fix is documented in the wrong file (it lives in scripts/skill_advisor_bench.py, not lib/metrics.ts) and the underlying warm-latency regression stays red; the doc overclaims.
- E projection emits packet ids (deep-research/deep-review) with no top-level SKILL.md and no redirectTo, breaking the loadable-skill contract.
- F bm25 in-memory sync sits inside the embedding transaction with no rollback compensation, so a commit-time failure permanently diverges the lexical index from the DB.
- D window reservation can evict a genuine result to seat a duplicate id that dedupe later collapses.

## Recommendation

Fix the six P0 themes and the descriptions.json P1 before relying on this. Critically, rebuild and ship dist or none of the fixes are live. Re-run the per-cluster suites with no-mutation and dist-parity assertions added, then re-review.
