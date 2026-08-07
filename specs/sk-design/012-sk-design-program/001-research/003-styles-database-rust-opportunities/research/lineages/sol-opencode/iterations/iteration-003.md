# Iteration 3: Measured Replay Boundary on the Current Host

## Focus

Determine whether the repository can supply measured production or replayed eligibility percentiles, active embedding dimensions, per-stage p50/p95 latency, and query-rate distribution on a declared reference host.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, prior iteration, and deep-research iteration/output contracts.
2. Located the default persistent database path, publication pointer contract, embedding-profile schema, adapter default, retrieval stages, and checked-in query shapes.
3. Verified whether a published SQLite generation or pointer exists and whether an active embedding profile can therefore be inspected.
4. Captured the current machine identity and ran a bounded read-only replay of seven repository-derived query shapes, with one warm-up and ten measured samples per shape.

## Findings

### F1. The packet had not declared a reference host; this replay now has an explicit observation host

The measured replay ran on `arm64`, Apple M5 Max, 64 GiB RAM, macOS 26.5.1, Node v22.23.1. This identifies the host for the numbers below but does not retroactively create a production baseline or make this developer machine representative of deployed callers. [SOURCE: command `uname -m && sysctl -n machdep.cpu.brand_string && sysctl -n hw.memsize && sw_vers -productVersion && node --version`, 2026-07-20]

### F2. There is no active persistent generation or embedding dimension to measure

The default database is `_db/style-library.sqlite`, selected through an optional `.current.json` pointer, but neither the database nor pointer is checked in. The only published retrieval artifact is the legacy `_retrieval-manifest.json`, with 1,290 records. The adapter defaults to `legacy`, and prior delivery evidence explicitly states that persistent activation and generation publication require opt-in. Consequently there is no active `embedding_profiles` row, no production vector projection, and no evidence-based active dimension on this workspace. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:10-24] [SOURCE: .opencode/skills/sk-design/styles/_engine/persistent-adapter.mjs:97-110] [SOURCE: .opencode/skills/sk-design/styles/_retrieval-manifest.json:1-6] [SOURCE: .opencode/specs/sk-design/012-style-database-and-interface-commands/003-style-database/implementation-summary.md:73-89]

The schema records dimensions only when a profile is registered or its first vector is accepted; dimensions are not derivable from the manifest or the 16,384-element validation ceiling. [SOURCE: .opencode/skills/sk-design/styles/_db/schema.mjs:188-229] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:37-75] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:206-280]

### F3. Repository-derived replay eligibility is bimodal and broad, not a production percentile distribution

Seven checked-in or contract-derived shapes were replayed: a broad query, the manual motion scenario, interface, motion, foundations, an intentionally impossible facet, and exact-reuse. Five shapes admitted all 1,290 records; the impossible-facet and exact-reuse shapes admitted zero. Across these seven shapes, eligible-row p50 and p95 were both 1,290, with min 0 and max 1,290. [SOURCE: .opencode/skills/sk-design/manual-testing-playbook/styles-library-utilization/retrieval-query-eligible-cards.md:21-51] [SOURCE: .opencode/skills/sk-design/design-interface/corpus/__tests__/fixtures.mjs:157-192] [SOURCE: .opencode/skills/sk-design/design-motion/corpus/__tests__/fixtures.mjs:121-129] [SOURCE: .opencode/skills/sk-design/design-foundations/corpus/__tests__/fixtures.mjs:198-231] [SOURCE: bounded replay command, 2026-07-20]

This is useful negative evidence: current checked-in positive requests usually carry no required facet, while the negative fixtures deliberately request a nonexistent facet. The resulting 0/1,290 distribution cannot be presented as production selectivity or used to estimate ANN filtering behavior.

### F4. Only legacy end-to-end latency was measurable; vector and stage p50/p95 remain absent

After one warm-up and ten samples per shape, measured legacy end-to-end p50 ranged from 1,167.863 ms to 1,412.187 ms and p95 ranged from 1,266.673 ms to 1,614.001 ms. The 70 measured calls consumed approximately 91,143.260 ms, or 0.77 sequential queries per second. The broad query used `fts5-bm25`; the other replay shapes used `source-scan`. [SOURCE: bounded replay command importing `.opencode/skills/sk-design/styles/_engine/style-library.mjs`, 2026-07-20]

These figures do not measure the persistent path, vector JSON fetch/decode, cosine scoring, fusion, or card assembly separately. `queryPersistentStyles()` invokes eligibility and ranking stages without timers, and the public result exposes counts and channel health but no durations. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:357-479]

### F5. Query-rate distribution is unavailable, and measured service throughput is not arrival demand

No checked-in production trace, request timestamp series, or query-rate histogram was found. The replay's 0.77 sequential QPS is a single-process service-throughput observation dominated by the legacy engine; it is not sustained or burst arrival rate and must not be substituted into the utilization gates from iteration 2. Without arrival telemetry, active dimensions, and persistent per-stage timings, neither the 10x exact-native gate nor the 100x ANN gate is currently cleared.

## Questions Answered

- **What measurements exist on a declared reference host?** A bounded legacy replay now has an explicit M5 Max host and reports eligibility plus end-to-end p50/p95. It does not provide production percentiles, active vector dimensions, persistent/vector stage timings, or arrival-rate distribution.
- **Does current evidence trigger a Rust vector-search migration?** No. The only measured latency is in the legacy flat-file path, while the proposed Rust opportunity targets persistent vector residency. Optimizing from these numbers would address an unmeasured stage and violate the residency gate.

## Questions Remaining

- Which vector-search architecture, if any, unlocks meaningful capability once a published vector projection and representative trace exist?
- Which indexing and embedding automations become materially better with Rust?
- Which visual and multimodal analysis features are practical?
- Is a shared Rust search core worth cross-system coordination?
- Which complete opportunity set clears residency, materiality, and scale gates?
- What are production arrival-rate percentiles and representative facet-selectivity percentiles after persistent opt-in?

## Sources Consulted

- Persistent schema, retrieval, vectors, adapter, and database README under `.opencode/skills/sk-design/styles/_db/` and `styles/_engine/`.
- The 1,290-record `_retrieval-manifest.json`.
- Manual-playbook and interface, motion, and foundations fixture query shapes.
- Prior style-database implementation summary and iteration 2 migration gates.
- Read-only host-identification and replay commands run on 2026-07-20.

## Ruled Out Directions

- Treating the absent default SQLite database as an empty active vector deployment: persistent mode is opt-in, so absence means no measurable active profile, not zero-dimensional vectors.
- Treating fixture-derived p50/p95 eligibility as production traffic: the seven shapes are intentionally sparse and bimodal.
- Treating 0.77 sequential replay QPS as caller demand: service throughput is not an arrival-rate distribution.
- Attributing legacy end-to-end latency to vector cosine or JSON materialization: the replay did not execute a vector projection.

## Assessment

- **newInfoRatio:** 0.64
- **Novelty justification:** This iteration added the first host-bound full-corpus replay measurements, proved that no active embedding profile exists, and separated measured legacy service throughput from the still-missing production arrival and vector-stage evidence.
- **Confidence:** High on host identity, artifact absence, adapter mode, replay outputs, and instrumentation gaps; low on production representativeness because no production trace or published persistent generation exists.

## Reflection

Direct artifact inspection prevented an invalid vector benchmark, while repository-derived queries supplied a bounded replay without inventing workload data. The replay is too biased to answer production selectivity, and current instrumentation cannot decompose stages. The absence itself is decision-relevant: benchmark and telemetry enablement must precede a Rust vector-search migration.

## Next Focus

Map indexing and embedding residency to determine whether parallel streaming ingestion, local inference, file watching, or content-addressed caching adds a capability that clears the Rust materiality gate rather than accelerating orchestration.
