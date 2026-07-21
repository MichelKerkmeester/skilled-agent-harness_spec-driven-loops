# Iteration 3: Current-Scale Economics and Evidence Quality

## Focus

Determine whether the persistent path's present benefits justify its recurring lifecycle and maintenance burden, separating measured evidence from plausible benefit.

## Findings

1. The legacy path has a real asymptotic and I/O cost: it can rebuild disposable in-memory FTS by reading every eligible `DESIGN.md` (up to 64 KiB each), with fallback scan bounds of 1,290 records or 24 MiB. The styles tree is about 135 MiB locally. Persistent reads avoid this corpus walk. [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:18-23] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:81-127] [SOURCE: .opencode/skills/sk-design/styles/_engine/rank-fts.mjs:146-184] [SOURCE: command `du -sk .opencode/skills/sk-design/styles`: 138412 KiB]
2. The only direct adapter speed gate proves merely that persistent is faster on a synthetic 20-style fixture. It records no committed latency, ratio, warm/cold state, or current 1,290-style result. This supports directionality, not materiality. [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:107-132]
3. The strongest correctness evidence is excellent but orthogonal to default-path value: 69 tests cover atomic publication, telemetry, full-matrix oracle replay, and 1x/10x/100x determinism. They prove that the system can be operated safely, not that current callers need its capabilities or that end-to-end latency crosses an SLO. [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:50-57] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:101-111]
4. Product-quality evidence is explicitly incomplete: there is no active published generation or embedding profile in the workspace; broad positive query shapes often admit all 1,290 bundles; relevance labels are authored/silver seed data rather than human gold; and live-corpus stage/SLO evidence remains open. [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/research.md:38-44] [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:117-123]
5. Current-scale benefit is therefore narrow but credible: lower repeat-query I/O/latency and stable immutable snapshots. Advanced vector, cursor, multimodal, and growth benefits are future options, not present requirements; the roadmap itself gates native/growth work on measured SLO or 10x-100x scale. [SOURCE: .opencode/specs/sk-design/015-styles-database-evolution/spec.md:40-63] [SOURCE: .opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/research.md:77-95]
6. Keeping SQLite as default creates recurring obligations independent of its small source footprint: generate and publish on corpus changes, distribute or bootstrap generations, retain rollback artifacts, migrate schema, monitor/repair vectors, diagnose pointer/generation failures, and keep dual parity during rollout. Those are operational state surfaces that the flat-file default does not currently own. [INFERENCE: .opencode/skills/sk-design/styles/_db/README.md:27-87 and iteration 2]
7. At observed scale and evidence, the value case has not cleared a default-path threshold. This is not evidence that SQLite is slow or broken; it is negative knowledge that the missing workload, relevance, and lifecycle evidence makes permanent default ownership unjustified now. [INFERENCE: findings 1-6]

## Ruled Out

- Using the 20-style timing test as a production business case.
- Counting the 69-test correctness suite as proof of caller demand.
- Charging the whole 135 MiB corpus as database overhead; the database projection size is unknown because no real generation exists.

## Dead Ends

- Exact cost modeling is impossible without a real build artifact, build telemetry, query frequency, and representative p50/p95 traces.

## Edge Cases

- Ambiguous input: maintenance cost could be low if corpus updates are rare and DB generation is committed; no ownership or cadence evidence confirms that assumption.
- Contradictory evidence: persistent is directionally faster, yet the default-path recommendation can still be "not now" because materiality and operations are unproven.
- Missing dependencies: real database size/build time, production query frequency, current-scale latency, and human relevance judgments.
- Partial success: a qualitative economic decision is possible; a numerical ROI is not.

## Sources Consulted

- `.opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:1-132`
- `.opencode/skills/sk-design/styles/_engine/rank-fts.mjs:1-238`
- `.opencode/specs/sk-design/015-styles-database-evolution/001-foundation/implementation-summary.md:1-126`
- `.opencode/specs/sk-design/013-styles-database-rust-opportunities/research/lineages/sol-opencode/research.md:1-283`
- `.opencode/specs/sk-design/015-styles-database-evolution/spec.md:1-73`
- Local read-only size measurement of the styles, `_db`, and `_engine` trees.

## Assessment

- New information ratio: 0.72
- Novelty justification: Four findings are new economic evidence, two synthesize prior architecture facts, and one is a new negative-knowledge conclusion.
- Questions addressed: measurable benefits and recurring costs.
- Questions answered: repeat-query efficiency is plausible and directionally proven, but materiality and product value are not; default ownership is not justified by current evidence.
- Confidence: high on evidence gaps and legacy I/O shape; medium on operational cost magnitude.

## Reflection

- What worked and why: distinguishing correctness, performance direction, performance materiality, and product demand prevented sunk-cost reasoning.
- What did not work and why: no committed full-corpus DB exists, so exact size/build/query measurements could not be gathered without violating the research-only scope.
- What I would do differently: encode explicit promotion thresholds so a future decision can be evidence-driven rather than permanent.

## Recommended Next Focus

Build a weighted decision framework with present-state scoring and reversible promotion gates, then test whether shelving or wiring best fits those scores.
