# Deep-Research Strategy — Skill-Advisor Scoring Core Rust Rewrite (Packet 013 / Phase 001)

> Charter the future deep-research loop reads at the start of every round. Single lineage, GPT-5.6-sol (`xhigh`, `fast`) via `cli-codex`, up to 16 rounds. Research-only: **do not write Rust, modify backend source, or redesign the sibling-owned embedder/vector/graph-tool/transport stack.**

## Objective

Decide, with file-cited evidence, whether the `system-skill-advisor` **scoring and ranking core** should be fully rewritten in Rust, moved selectively into a `napi-rs` or WASM native module, isolated behind a Rust sidecar, or left in TypeScript. Quantify the CPU-bound JS work that converts a prompt into ranked recommendations, identify newly practical capabilities, preserve routing behavior, and recommend the smallest justified boundary.

## Subject under study

- `mcp_server/handlers/advisor-recommend.ts` — freshness/cache orchestration, scorer invocation, public recommendation mapping, shadow output, and cache write [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:369-482].
- `mcp_server/lib/scorer/fusion.ts` — query class, lane assembly, match indexing, fusion, candidate ranking, confidence/uncertainty, ambiguity/abstention, and delegation [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:605-875].
- `mcp_server/lib/scorer/text.ts` and `lanes/{explicit,lexical,derived,bm25,graph-causal,semantic-shadow}.ts` — normalization, vocabulary/intent matching, graph propagation, BM25F, and JS cosine.
- `mcp_server/lib/scorer/{projection,ambiguity,scoring-constants,weights-config,executor-delegation}.ts` — candidate projection, calibrated decisions, and post-fusion overrides.
- `mcp_server/bench/scorer-bench.ts` — current scorer benchmark with 50 ms reused-projection and 60 ms reload p95 gates [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/bench/scorer-bench.ts:15-62].
- Current baseline: SQLite rows plus six command bridges form the candidate projection [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58-149] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:596-633]. At charter time this resolved to 18 candidates and 41 graph edges; re-measure rather than assuming those counts remain fixed.

## Framing invariant (enforce every round)

Some expensive-looking stages already execute outside V8. SQLite queries use `better-sqlite3`; prompt embeddings may use `@huggingface/transformers`/ONNX; stored vectors come from the database [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/package.json:13-19] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:92-149]. **Rust cannot speed up work already performed by those native/FFI primitives merely by rewriting their JavaScript callers.**

Every latency or throughput claim must:
1. Label the work **JS-resident**, **native/FFI-resident**, **mixed**, or **unmeasured**.
2. Report absolute time and workload size, not percentage alone.
3. Exclude SQLite query execution and ONNX inference from any Rust scorer win.
4. Include FFI/serialization/copy/startup overhead when evaluating a native module or sidecar.
5. Distinguish JS cosine loops from native prompt embedding/vector loading; only the former is this phase's compute target [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:47-69] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts:266-310].

No "big win" may survive without naming the exact JS-resident loop/data structure, the scale at which it matters, and the measurement or model supporting it.

## The 12 predefined angles

**Survey (A1–A6):**
- **A1 Decision path and residency** — `handlers/advisor-recommend.ts`, `lib/prompt-cache.ts`, `lanes/semantic-shadow.ts`; stage-by-stage JS/native/mixed/cached map.
- **A2 Candidate/projection baseline** — `lib/scorer/projection.ts`, `mcp_server/package.json`; 18-current-candidate baseline, 41 edges, vocabulary/phrase/doc sizes, SQLite versus JS mapping costs.
- **A3 Text and vocabulary matching** — `lib/scorer/text.ts`, `lanes/explicit.ts`; tokenization, per-phrase regexes, overlap scans, hard-coded and projected intent vocabulary.
- **A4 Lexical/derived/BM25F lanes** — `lanes/lexical.ts`, `lanes/derived.ts`, `lanes/bm25.ts`; per-skill/per-posting complexity and per-call index construction.
- **A5 Graph/fusion/ranking math** — `lanes/graph-causal.ts`, `fusion.ts`, JS cosine in `lanes/semantic-shadow.ts`; adjacency construction, traversal, RRF, match maps, candidate loop, sort, top-10 rerank.
- **A6 Decision tail and cache semantics** — `scoring-constants.ts`, `ambiguity.ts`, `executor-delegation.ts`, handler rendering; thresholds, tie behavior, abstention, evidence, aliases, and exact-cache masking.

**Deep-validation (A7–A12):**
- **A7 Measured latency decomposition and break-even scale** — extend `bench/scorer-bench.ts` conceptually/experimentally into stage spans, p50/p95/p99, cache states, and candidate/edge/vocabulary/prompt scale sweeps.
- **A8 Targeted native-kernel feasibility** — evaluate a packed immutable projection + prompt → ranked score/evidence seam via `napi-rs` or WASM; include boundary copies and failure handling.
- **A9 High-cardinality compiled-index capability** — assess precompiled phrase automata, persistent packed BM25F, reused adjacency, and 10x/100x private catalogs; prove whether Rust is required rather than merely convenient.
- **A10 Ranking parity and deterministic ABI** — preserve top-k, six-decimal scores, confidence/uncertainty rounding, RRF ties, lifecycle filtering, ambiguity clusters, abstentions, attribution order, and executor delegation.
- **A11 Event-loop, memory, and tail-latency envelope** — compare current synchronous JS scoring, TypeScript precompute/worker alternatives, and Rust under concurrent recommendation load; do not count async ONNX/SQLite time as scorer compute.
- **A12 Architecture synthesis** — rank full rewrite / targeted native module / sidecar / do-not-rewrite by measured benefit, parity risk, packaging, observability, rollback, and team cost; name the first falsifiable benchmark.

## Round → angle allocation

| Round | Band | Angle | Required focus |
|-------|------|-------|----------------|
| 1 | Survey | A1 | End-to-end path and execution-residency ledger |
| 2 | Survey | A2 | Current candidate/edge/vocabulary sizes and projection/native boundary |
| 3 | Survey | A3 | Text, token, phrase, regex, and intent-matching operation counts |
| 4 | Survey | A4 | Lexical, derived, doc-trigger, and BM25F complexity |
| 5 | Survey | A5 | Graph propagation, fusion, sort, and JS-cosine complexity |
| 6 | Survey | A6 | Confidence/uncertainty/ambiguity/delegation/cache semantics |
| 7 | Deep validation | A7 | Stage-level latency measurement design and initial evidence |
| 8 | Deep validation | A8 | Native-module/WASM seam and boundary-overhead model |
| 9 | Deep validation | A9 | 10x/100x scale model and newly practical compiled indexes |
| 10 | Deep validation | A10 | Deterministic parity and golden-corpus contract |
| 11 | Deep validation | A11 | Concurrent load, event-loop stalls, memory, p95/p99 tails |
| 12 | Deep validation | A3 second pass | Compiled matcher versus regex reuse/token interning TS baseline |
| 13 | Deep validation | A5 second pass | Adjacency reuse, packed fusion, sort, and cosine quantification |
| 14 | Deep validation | A7 second pass | Reconcile JS scorer milliseconds with SQLite/ONNX/vector boundary time |
| 15 | Deep validation | A10/A11 second pass | Validate parity and tail risk at the leading architecture seam |
| 16 | Synthesis | A12 | Matrices, risk register, ranked recommendation, first step, rollback |

## Deliverables (must exist in `research.md` at convergence)

1. **Improvement matrix** — component × {latency / memory / tail latency / throughput / determinism / packaging} → {big win / marginal / none / already-native}; include current scale, target scale, residency, evidence, and confidence.
2. **New-feature-feasibility matrix** — candidate capability × {possible in TypeScript today / practical in TypeScript today / Rust unlocks / native dependency already supplies it}; include the enabling primitive and smallest implementation boundary.
3. **Risk register** — ranking/calibration drift, determinism, FFI copies, native packaging, sidecar operations, migration/test burden, ownership, and rollback.
4. **Ranked recommendation** — full rewrite / targeted `napi-rs` or WASM native module / Rust sidecar / do-not-rewrite, with rejected alternatives, first falsifiable benchmark, success threshold, and rollback seam.

## Non-goals

- Writing, scaffolding, compiling, or integrating Rust.
- Editing TypeScript backend source, tests, package manifests, databases, or generated artifacts.
- Researching or redesigning embedders, vector indexes/search, skill-graph tools, daemon lifecycle, MCP transport, or CLI transport.
- Treating SQLite, ONNX, or stored-vector loading as a Rust scorer speedup.
- Launching the loop during charter authoring; only the future `/deep:research` workflow may do so.

## Stop conditions

- The workflow's convergence threshold is met and source/focus quality guards pass, OR
- 16 rounds are reached, OR
- All 12 angles are answered with cited evidence and all four deliverables are complete.

Do not stop merely because "Rust is faster" or because one microbenchmark improves. Stop only with an end-to-end, residency-aware decision.

## Evidence discipline

- Repository claims use `[SOURCE: relative/path.ts:line]`; external ecosystem claims use `[SOURCE: url]`.
- Separate **confirmed**, **measured**, **modeled**, and **inferred** statements.
- Record workload dimensions with every timing: candidates, edges, prompt tokens, phrases, postings, vectors/dimension, top-k, cache state, and concurrency.
- Use the current 18-candidate/41-edge snapshot only as a baseline; re-measure at loop time.
- Every performance table includes execution residency and excludes already-native work from Rust wins.
- Cross-check any proposed "new capability" against current matcher, BM25F, graph, cache, and delegation behavior before calling it new.
- Record negative findings and ruled-out boundaries; a well-supported do-not-rewrite verdict is a successful result.
