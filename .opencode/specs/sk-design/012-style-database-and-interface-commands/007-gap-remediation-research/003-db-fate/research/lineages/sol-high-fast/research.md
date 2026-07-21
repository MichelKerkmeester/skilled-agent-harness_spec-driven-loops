# Styles SQLite Database Fate: Final Research

## 1. Executive Summary

**Decision: formally shelve the dormant SQLite runtime and keep the flat-file engine as the single supported retrieval source.** Do not merely leave `legacy` as the default beside live-but-unused `shadow` and `persistent` modes; remove the supported database runtime surface and preserve its design knowledge in research/spec history.

The persistent implementation is high-quality and technically mature, but the current product case is not. No SQLite generation exists, no active embedding profile exists, no current-scale workload or p50/p95 trace exists, no human relevance set exists, and the four actual consumers use only bounded generation-safe reference selection plus flat-file hydration. Weighted present-state scoring favors shelf 85/100 over wire 54/100. [SOURCE: iterations/iteration-001.md] [SOURCE: iterations/iteration-003.md] [SOURCE: iterations/iteration-004.md]

This is a reversible "not now," not a claim that SQLite is broken. Reactivation is appropriate only when all workload, materiality, lifecycle, parity, relevance, shadow, rollback, and demand gates in Section 9 clear.

## 2. Scope and Method

The five forced iterations examined:

1. The actual interface, motion, audit, and foundations corpus consumers.
2. Persistent schema/index/query/operator completeness and missing wiring.
3. Current-scale benefit, recurring cost, and evidence quality.
4. A weighted decision framework and promotion gates.
5. Adversarial validation plus complete plans for both choices.

Research was static/read-only outside this lineage. No database was built and no production code was changed. The hard stop was five iterations; convergence was telemetry only before the cap.

## 3. Current Architecture

`styles/_engine/style-library.mjs` exports a stable `runQuery`/`runHydrate` facade. The current default runs the flat retrieval manifest, checks it against the live corpus, applies eligibility, builds disposable FTS5 or a bounded source-scan fallback, and returns compact cards. Hydration reads bounded, hash-verified flat artifacts. [SOURCE: .opencode/skills/sk-design/styles/_engine/style-library.mjs:73-207] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:81-238]

`styles/_db` is a rebuildable projection: normalized SQLite schema, FTS5, vectors/jobs, relationships, immutable generations, atomic pointer publication, rollback, telemetry, differential oracle, deterministic fixtures, and an operator. Flat artifacts remain authoritative content even in persistent mode. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:35-269] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:1-87]

The adapter supports `legacy`, `shadow`, and `persistent`, but defaults to `legacy`. No published SQLite pointer or generation exists in the workspace. [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-166] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md:72-89]

## 4. Consumer Reality

All four corpus modules call the storage-neutral facade; none imports the database directly. Each asks for reference-only, no-exact-reuse, bounded cards, verifies the generation identity, chooses known IDs, and hydrates `DESIGN.md`, `source.md`, and sometimes `design-tokens.json`. Audit produces at most two comparisons; motion retrieves at most one temporal owner. [SOURCE: .opencode/skills/sk-design/design-interface/corpus/relational-exemplar.mjs:566-647] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/motion-evidence.mjs:732-822] [SOURCE: .opencode/skills/sk-design/design-audit/corpus/comparison-lane.mjs:448-515] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/relationship-blueprint.mjs:798-875]

No consumer call site uses persistent-only vector, cursor, candidate-K, or channel-control features. The invariant to preserve is deterministic generation-safe query/hydration behavior, not SQLite.

## 5. Database Readiness

The database is implementation-complete enough for a controlled migration, not default-complete:

- **Built:** schema v2, FTS5, structured/vector lanes, weighted RRF, cursors, attribution, generation validation, atomic publication, rollback, repair, telemetry, oracle, fixtures, and tests. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:13-25] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:364-517] [SOURCE: .opencode/skills/sk-design/styles/_db/operator.mjs:75-247]
- **Missing:** initial full-corpus publication, clean-checkout distribution/bootstrap policy, extraction-to-refresh ownership, periodic reconciliation, real workload metrics, human relevance evidence, and a bounded cutover/observation owner.
- **Correct integrity choice:** query/hydrate never auto-build. Reads fail closed if publication is missing or inconsistent. [SOURCE: .opencode/skills/sk-design/styles/_db/README.md:27-49]

Therefore a default-value flip is not wiring. It would make a clean checkout fail against a missing pointer.

## 6. Cost and Benefit

### Wire and Populate

**Benefits**

- Avoid repeated corpus walking and disposable FTS construction on normal reads.
- Strong immutable snapshot, atomic publish, and rollback semantics.
- Persistent FTS5, structured/vector fusion, attribution, and cursors.
- Existing telemetry and oracle reduce migration risk.
- Enables the planned multimodal/growth roadmap if demand materializes.

**Costs**

- Must own generation build, distribution/bootstrap, freshness, reconciliation, retention, migration, monitoring, repair, and failure diagnostics.
- Requires dual-mode parity during rollout and a clean rollback path.
- Adds generated binary/state lifecycle to a repository that currently has no database artifact.
- Advanced features exceed observed consumer demand.
- Product quality remains unproven without representative traces and human judgments.

### Formally Shelve

**Benefits**

- One supported retrieval contract and one operational source.
- Removes dormant modes, mode-dependent failures, documentation drift, and roadmap obligations.
- Keeps consumer behavior unchanged because the facade boundary already isolates storage.
- Preserves strong flat-engine generation, hash, rights, byte, and path guards. [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/check-stable.test.mjs:14-80] [SOURCE: .opencode/skills/sk-design/styles/_engine/__tests__/hydrate-guard.test.mjs:20-163]
- Git and research retain the option to revive the database.

**Costs**

- Gives up lower repeat-query I/O and richer persistent capabilities now.
- Removes recently built, well-tested code.
- Future revival requires restoration and revalidation against intervening engine changes.
- Flat queries retain their current freshness/scan cost.

## 7. Decision Framework

Ratings use 1=poor and 5=strong. Weighted score is `sum(weight * rating / 5)`.

| Criterion | Weight | Wire | Shelf | Evidence basis |
|---|---:|---:|---:|---|
| Current consumer fit | 25 | 3 | 5 | Consumers need bounded facade behavior, not DB-only features |
| Measured material value | 20 | 1 | 4 | Only a directional synthetic 20-style speed assertion exists |
| Operational simplicity/ownership | 20 | 1 | 5 | Wiring adds permanent publication and repair state |
| Integrity and rollback | 15 | 5 | 4 | DB generation semantics are stronger; flat guards remain robust |
| Future capability leverage | 10 | 5 | 2 | DB enables vector/multimodal/growth plans |
| Reversibility and option value | 10 | 3 | 4 | Git restores shelf; wiring creates generated-state coupling |
| **Total** | **100** | **54** | **85** | **Shelf leads by 31 points** |

Moderate rating changes do not reverse the result unless future capability or unmeasured performance is weighted above current use and operational ownership combined.

## 8. Recommendation

Formally shelve now. Preserve knowledge, not an unowned live runtime.

The decisive evidence is not that flat files are universally better. It is that the present consumers are served, SQLite materiality is unmeasured, the operational lifecycle has no owner, and the repository has no generated database to support a default. The database's high integrity and future leverage justify explicit reactivation gates, not indefinite dormancy.

## 9. Reactivation Gates

All gates must pass before a new wiring decision:

1. **Representative workload:** capture real or approved representative query count, request shapes, eligibility distribution, and warm/cold p50/p95.
2. **Materiality:** legacy breaches an approved SLO, or persistent shows at least 30% and 25 ms absolute p95 improvement on the representative trace. These are proposed thresholds, not observed results.
3. **Build economics:** record full-corpus database size, cold/incremental build time, RSS, and publication/retention cost.
4. **Lifecycle ownership:** name the owner and mechanism for clean-checkout distribution/bootstrap, extraction-triggered refresh, periodic reconciliation, monitoring, and repair.
5. **Contract parity:** 100% facade DTO/refusal/generation parity where exact behavior is required; differential oracle green.
6. **Relevance:** no statistically material regression on human-labeled judgments; authored/silver seed data alone is insufficient.
7. **Operational proof:** shadow run succeeds against representative requests; cutover and rollback are rehearsed.
8. **Demand:** at least two consumers require a persistent-only capability, or latency alone clears the approved materiality gate.

## 10. Wiring Plan If Kept

1. Freeze the stable `runQuery`/`runHydrate` facade and flat files as content authority.
2. Decide clean-checkout delivery before code changes: checked-in immutable generation under an explicit size policy, or mandatory install/prewarm generation. Do not use lazy query-time builds.
3. Build and publish the first real full-corpus generation; capture size, build telemetry, status, and rollback evidence.
4. Connect corpus extraction to an authoritative rebuild/reconciliation workflow. Watcher events may trigger work but cannot own correctness.
5. Build a representative request corpus from all four design modes and add human relevance judgments.
6. Run shadow mode. Require contract/oracle parity, relevance acceptance, and the performance gate.
7. Verify clean checkout, stale corpus, interrupted build, pointer mismatch, missing artifact, repair, and rollback scenarios.
8. Change the default to persistent only after all gates pass. Retain an explicit legacy kill switch for a time-bounded observation window.
9. Monitor query stage latency, publication failures, pointer/generation mismatches, vector queue health, and fallback use.
10. After the observation window, either confirm persistent authority and remove dual-mode complexity or revert using the kill switch and manifest-pointer rollback.

## 11. Deprecation Plan If Shelved

1. Record the accepted decision and mark `015-styles-database-evolution` plus its children as superseded/shelved, not planned active work.
2. Retain 013, 015, and this report as design evidence and the source of reactivation gates.
3. Remove the `_db` runtime, DB-only tests/goldens/seeds, and DB README claims.
4. Remove `persistent-adapter.mjs`, `SK_DESIGN_STYLE_DB_MODE`, `styleDatabaseMode`, and CLI `--backend`/`--database` options.
5. Route `runQuery` and `runHydrate` directly to the existing flat implementation without consumer changes.
6. Keep `_retrieval-manifest.json`: it is the flat engine's generation/freshness contract. Rename or relocate it only in the separate filesystem-restructure work.
7. Remove database evolution from active navigation and documentation claims.
8. Run the full flat engine suite plus interface, motion, audit, and foundations corpus suites. Search for residual DB imports, modes, environment variables, pointers, and generated artifacts.
9. Roll back only through a targeted Git revert. No data migration or persisted consumer contract exists because no database generation was published.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Rewrite consumers for a database API | Existing facade already isolates backend selection | `style-library.mjs:181-207` | 1 |
| Move authoritative content into SQLite | Persistent hydration still reads hash-verified flat artifacts | consumer hydration paths | 1 |
| Flip default without publication lifecycle | Clean checkouts have no pointer/generation and fail closed | DB README/operator/schema | 2 |
| Treat feature richness as demand | Vector/cursor capabilities are not used by current consumers | consumer and retrieval scan | 2, 4 |
| Promote from 20-style timing | Directional assertion has no committed magnitude/current-scale trace | `adapter.test.mjs:107-132` | 3 |
| Treat correctness tests as product value | Safety evidence does not establish material use | foundation summary | 3 |
| Keep dormant modes for optionality | Preserves current ambiguity and maintenance claims | dependency scan | 4, 5 |
| Promote because work is recent | Sunk cost does not create demand | weighted framework | 4 |
| Promote on one benchmark | Operations, parity, relevance, and ownership are conjunctive gates | reactivation framework | 4 |
| Lazy query-time DB build | Integrity-sensitive reads should not mutate/walk the corpus unexpectedly | DB lifecycle | 5 |
| Delete the flat retrieval manifest | It is the flat engine's freshness/generation guard | manifest ownership scan | 5 |

## Divergence Map

- **Angles covered:** consumers, architecture, persistence readiness, operations, performance evidence, relevance evidence, roadmap governance, weighted economics, blast radius, and rollback.
- **Primary fork:** wire for repeat-query efficiency/future leverage versus shelf for present fit/operational clarity.
- **Counterargument tested:** the mature DB and repeated flat-file I/O could justify immediate wiring. It failed because workload materiality and lifecycle ownership are absent.
- **Saturated directions:** consumer rewrite, database-as-content-authority, default-only flip, dormant optionality, sunk-cost promotion, and one-benchmark promotion.
- **Pivots:** none; `stopPolicy=max-iterations` forced breadth manually.
- **Remaining frontier:** only implementation-level measurement and operator acceptance of thresholds/deletion scope.

## 12. Open Questions

No research question remains unanswered. Two operator decisions are required before implementation:

1. Accept or adjust the proposed 30% plus 25 ms p95 reactivation threshold.
2. Approve exact deletion/supersession scope in a dedicated implementation packet.

## 13. Risks

| Risk | Consequence | Mitigation |
|---|---|---|
| Shelving removes a future-useful implementation | Later restoration cost | Preserve reports, Git lineage, facade invariants, and gates |
| Legacy query cost is already user-visible but unmeasured | Shelf may defer a real latency fix | Capture a workload before implementation; reopen if materiality gate passes |
| Roadmap docs remain active after shelf | Contradictory repository truth | Mark parent and children superseded in the same implementation change |
| Flat manifest is mistaken for a DB artifact | Safety contract accidentally removed | Explicitly retain it and verify manifest/hydration tests |
| Partial shelf leaves hidden switches | Dormancy gap persists | Search executable code for mode/env/import/pointer residue |
| Wire path chooses no distribution owner | Clean checkouts fail | Distribution decision is a pre-cutover hard gate |

## 14. Quality and Validation

- Five iterations completed with write-once narratives and deltas.
- Five of five key questions have evidence-backed answers.
- Source diversity includes production code, consumer code, tests, spec roadmaps, prior research, and a local size measurement.
- No recommendation depends on one weak source.
- Findings distinguish confirmed behavior, proposed thresholds, and inference.
- The flat-engine safety claim is supported by its own test suite, not merely by absence of DB usage.

## 15. References

- `.opencode/specs/sk-design/012-style-database-and-interface-commands/007-gap-remediation-research/gap-analysis.md`
- `.opencode/skills/sk-design/styles/_engine/style-library.mjs`
- `.opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs`
- `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs`
- `.opencode/skills/sk-design/styles/_engine/__tests__/`
- `.opencode/skills/sk-design/styles/_db/{README,schema,indexer,retrieval,operator}.mjs`
- `.opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs`
- Four `design-*/corpus/*.mjs` consumers cited in Section 4
- `.opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/research.md`
- `.opencode/specs/sk-design/015-styles-database-evolution/`
- `iterations/iteration-001.md` through `iteration-005.md`

## 16. Limitations

- No full-corpus SQLite generation was built because this was research-only and write-scoped to the detached lineage.
- No real design-session workload trace or call frequency was available.
- The projection's real size, build time, and current-scale latency remain unknown.
- Relevance evidence is authored/silver seed data, not human gold.
- Decision ratings encode explicit judgment; they are not measured facts.

## 17. Convergence Report

- **Stop reason:** `maxIterationsReached`
- **Total iterations:** 5 / 5
- **Questions answered:** 5 / 5
- **newInfoRatio trend:** 1.00 -> 0.85 -> 0.72 -> 0.58 -> 0.43
- **Average newInfoRatio:** 0.716
- **Last-three rolling average:** 0.577, above the 0.05 convergence threshold
- **MAD noise floor:** approximately 0.208; latest 0.43 remained above it
- **Question-entropy signal:** STOP (100% answered)
- **Composite telemetry:** below the >0.60 legal-stop threshold because novelty signals remained active
- **Quality guards:** pass (source diversity, focus alignment, no weak-source dominance)
- **Convergence handling:** early convergence was telemetry only by operator instruction; synthesis began only after the fifth iteration
