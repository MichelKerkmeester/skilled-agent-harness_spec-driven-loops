# Iteration 2: Measured Migration Gates for Vector Retrieval

## Focus

Define which measured p50/p95 latency, vector dimension, eligible-row distribution, and query-rate conditions should trigger exact-search optimization at 10x or ANN evaluation at 100x, without converting corpus size into an unsupported performance claim.

## Actions Taken

1. Read the externalized state, reducer-owned strategy, and iteration 1 findings to preserve the scale-specific architecture conclusions and saturated directions.
2. Decomposed the current retrieval path into eligibility, structured SQL, FTS5, vector fetch/JSON decode/cosine/full sort, fusion, and card assembly stages.
3. Inspected the retrieval and adapter tests for existing dimensions, latency percentiles, scale fixtures, and performance budgets.
4. Compared the generated `IN` statements with SQLite's documented host-parameter limit and used a published interaction-response budget only as a provisional budget, not as a styles-database measurement.

## Findings

### F1. No measured styles migration gate exists yet

The only timing test takes three samples, compares medians, uses 20 synthetic styles, and asserts merely that persistent retrieval is faster than legacy retrieval. It does not exercise vectors, report absolute milliseconds, calculate p95, model 1,290/12,900/129,000 rows, or record query rate. [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:31-39] [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/adapter.test.mjs:107-132]

The vector tests use two-dimensional fixtures, while production input accepts from 1 to 16,384 dimensions and up to 256 KiB of serialized query-vector JSON. Therefore neither the fixture dimension nor the maximum is an evidence-based production dimension. The benchmark must read each registered profile's actual dimension and report results by `(eligible rows, dimension)` rather than assuming one model. [SOURCE: .opencode/skills/sk-design/styles/_db/__tests__/retrieval.test.mjs:98-128] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:19-23] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:82-99]

### F2. Eligible rows, not corpus rows, are the scale variable

Eligibility is computed before every ranking lane. The vector lane then creates one placeholder per eligible row, returns every matching vector as JSON, parses it, performs `N*d` cosine work, fully sorts the scored set, and only then truncates to `candidateK`. [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:121-169] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:218-249]

For a 768-dimensional profile, the cosine loop visits about 0.99 million, 9.91 million, and 99.07 million components at 1,290, 12,900, and 129,000 eligible rows. At 1,536 dimensions those figures double to about 1.98 million, 19.81 million, and 198.14 million. These are workload counts, not latency predictions. The benchmark should sample the observed p50, p95, and maximum eligible-row counts and cross them with every active profile dimension; a nominal 100x corpus whose p95 eligible set remains small does not clear an ANN gate.

### F3. The current SQL shape has a correctness ceiling before the 100x ANN question

SQLite documents a default maximum host-parameter number of 32,766 for versions after 3.32.0. The vector statement uses one binding for `profile_id` plus one for every eligible row ID, so its default-safe ceiling is 32,765 eligible rows. The FTS statement additionally binds the match expression and limit, giving a ceiling of 32,764 IDs. [SOURCE: https://www.sqlite.org/limits.html] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:200-215] [SOURCE: .opencode/skills/sk-design/styles/_db/retrieval.mjs:232-249]

At 12,900 total bundles, even 100% eligibility remains below that default ceiling. At 129,000 bundles, approximately 25.4% eligibility is enough to cross it. This creates a mandatory 100x query-shape gate independent of Rust and independent of measured cosine speed: move eligibility into SQL joins, a temporary ID table, or another bounded-binding representation before treating 100x vector benchmarks as valid. ANN must not be used to conceal this shared structured/FTS/vector correctness issue.

### F4. Adopt explicit measurement gates, not a corpus-size trigger

The styles subsystem has no stated response SLO. Google RAIL says a user-initiated interaction should visibly respond within 100 ms and budgets about 50 ms for input processing; this is web UX guidance, so it is only a conservative provisional budget until the actual CLI/agent caller defines one. [SOURCE: https://web.dev/articles/rail]

Use the following provisional gate on a declared reference host, with warm and cold runs reported separately and stage timings for eligibility, each lane, fusion, and card assembly:

| Decision | Measured trigger at observed p95 eligible rows and actual profile dimension |
|---|---|
| Retain current exact TS lane | End-to-end p95 <= 100 ms and vector-stage p95 <= 50 ms; no host-parameter overflow; sustained utilization below the query-rate gate. |
| Pilot compact binary/in-database or maintained native exact search | Vector-stage p50 > 25 ms or p95 > 50 ms, or JSON fetch/decode is at least 25% of end-to-end p95. Compare exact result identity before considering ANN. |
| Isolate work from the JS event loop | Sustained `QPS * vector_p50_seconds >= 0.25`, or peak `QPS * vector_p95_seconds >= 1.0`; these indicate at least 25% sustained single-core occupancy or one core-second of tail work arriving per second. |
| Evaluate maintained HNSW at 100x | After fixing bounded SQL eligibility, exact vector p50 > 50 ms and p95 > 100 ms at the observed p95 eligible set, with a real interactive or throughput requirement. Require recall@K and filtered-recall acceptance against the exact oracle. |
| Consider a custom Rust search core | Only if the maintained exact/HNSW candidates fail a required filter-aware, custom-metric, lifecycle, or event-loop-isolation contract; latency alone first selects an architecture benchmark, not custom ownership. |

The p50 condition distinguishes sustained cost from tail-only noise; p95 protects interactive latency; `QPS * service_time` exposes concurrency pressure. For example, 5 QPS at a 50 ms vector p50 equals 0.25 core-seconds per second, while 10 QPS at a 100 ms p95 equals one tail core-second per second. These are queueing/utilization gates, not benchmark results.

### F5. The benchmark matrix must preserve distribution and residency evidence

At minimum, record: corpus rows; active rows; eligible p50/p95/max; profile ID and actual dimension; vector rows returned; serialized vector bytes; warm/cold status; per-stage p50/p95; end-to-end p50/p95; sustained and burst QPS; CPU time; event-loop delay; and exact result hash. Run the 1x, 10x, and 100x scenarios with representative broad, median, and selective facet requests. A result is architecture-relevant only when the costly stage is identified: SQL binding/fetch, JSON materialization, cosine, sort, or caller concurrency.

No current evidence supplies production query-rate or eligibility distributions. They must be measured or replayed; inventing them would make the migration gate circular.

## Questions Answered

- **What measured conditions trigger the 10x migration gate?** Do not trigger on 12,900 rows alone. Pilot an exact compact representation when the actual-dimension vector stage exceeds 25 ms p50 or 50 ms p95 at the observed p95 eligible set, JSON materialization consumes at least 25% of end-to-end p95, or sustained query utilization reaches 0.25 core-seconds per second.
- **What measured conditions trigger the 100x migration gate?** First replace the unbounded eligible-ID binding shape because broad requests can exceed SQLite's default 32,766-variable ceiling above roughly 25.4% eligibility. Then evaluate maintained HNSW only when exact search exceeds 50 ms p50 and 100 ms p95 at the observed p95 eligible set and the workload has a real latency or throughput requirement. Custom Rust remains conditional on capability gaps, not these timings alone.

## Questions Remaining

- What are the measured production or replayed eligibility percentiles, active embedding dimensions, stage p50/p95 values, and query-rate distribution on the declared reference host?
- Can the existing generation publication model atomically publish an external HNSW index with the SQLite database, or does it require a new manifest contract?
- Which indexing and embedding automations materially improve with Rust?
- Which visual and multimodal analysis features are practical?
- Is a shared Rust search core worth cross-system coordination?
- Which complete opportunity set clears residency, materiality, and scale gates?

## Ruled Out Directions

- Corpus-size-only migration: total rows do not establish eligible rows, dimension, latency, or query pressure.
- ANN before the 100x binding fix: it would bypass neither the shared structured/FTS SQL-shape issue nor the need for an exact oracle.
- Treating the 20-style median test as a baseline: it lacks vectors, absolute budgets, percentiles, and representative scale.
- Treating the 16,384-dimension validation maximum as the expected workload: it is an input safety bound, not an active embedding profile measurement.

## Assessment

- **newInfoRatio:** 0.78
- **Novelty justification:** This iteration converted the prior qualitative scale gate into measurable latency/utilization thresholds and discovered that the current eligible-ID binding shape reaches SQLite's default parameter ceiling at only about 25.4% eligibility in the 100x scenario, making a query-shape fix prerequisite to ANN evaluation.
- **Confidence:** High on current residency, test gaps, component-work arithmetic, and SQLite's documented default binding limit; medium on provisional latency thresholds because the subsystem has no approved SLO or representative benchmark yet.

## Next Focus

Map the embedding queue, retrieval-hash cache, generation publication, and rebuild path to determine whether parallel streaming ingestion, content-addressed caching, local inference, or file watching contains enough JS-resident work for Rust to unlock a new automation rather than merely accelerate control flow.
