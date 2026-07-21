# Iteration 5: Continuous Indexing and Watch Automation

## Focus

Identify automation value in making the projection continuously fresh, then determine whether the work is I/O orchestration, CPU-heavy processing, or model inference—and therefore whether Rust is necessary.

## Findings

1. Much of the proposed “incremental content hashing” already exists. Every bundle receives a metadata hint hash; only new/changed/lifecycle-mismatched candidates are fully read and hashed unless `verifyAll` is set. Aggregate and semantic retrieval hashes are separate, and vector jobs/cache keys use the retrieval hash. Reimplementing this policy in Rust would be a like-for-like port. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:181-221] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:670-740]
2. The net-new automation is event-driven freshness: watch only supported artifact paths, debounce editor atomic/chunked writes, map paths to dirty style IDs, verify changed bundles, coalesce events by content hash, enqueue embeddings, and publish one immutable generation after a quiet window. This could eliminate manual rebuild drift while preserving the current `DISCOVER → VERIFY → PARSE_VALIDATE → COMMIT → VECTOR_DRAIN → PUBLISH` lifecycle. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:25-32] [SOURCE: https://github.com/paulmillr/chokidar]
3. Rust is not necessary for the watcher. Node's raw `fs.watch` is cross-platform but has documented consistency, filename, network-filesystem, and security caveats; Chokidar already normalizes add/change/unlink, atomic writes, chunked writes, and recursive watching. A TypeScript watcher is lower effort and fits the existing shell. [SOURCE: https://nodejs.org/api/fs.html#fswatchfilename-options-listener] [SOURCE: https://github.com/paulmillr/chokidar]
4. Parallelizing filesystem discovery/hashing does not automatically justify Rust. The current loops await per-style/per-artifact I/O sequentially, so a bounded Promise pool can increase I/O concurrency without worker threads. Node's own guidance says worker threads help CPU-intensive JavaScript, not I/O-intensive work; SHA-256 is already native through `node:crypto`. Benchmark a TypeScript concurrency pool before adding a native boundary. [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:224-270,682-718] [SOURCE: https://nodejs.org/api/worker_threads.html] [SOURCE: .opencode/skills/sk-design/styles/_db/indexer.mjs:5,58-61]
5. Embedding scheduling is the material automation gap. `drainVectorQueue()` processes a bounded batch serially and awaits one embedder call per job; local runtimes often benefit from batch inference. A scheduler that claims jobs transactionally, batches compatible profile inputs, limits memory/concurrency, and publishes each result after identity recheck can materially reduce rebuild time. Rust is attractive only when this scheduler is co-located with the Rust local-inference core; otherwise batching in TypeScript is sufficient. [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:174-216] [SOURCE: .opencode/skills/sk-design/styles/_db/vectors.mjs:229-295]
6. A standalone Rust watcher/daemon clears the gate only under sustained high churn, much larger corpora, remote/network filesystems with a polling reconciliation loop, or a unified sidecar that also owns local inference and image analysis. At today's 1,290 mostly static bundles, a separate process adds supervision, IPC, packaging, and recovery state without measured benefit. [INFERENCE: current scale, Node watcher options, and repository boundary standard]
7. Correctness matters more than event latency: watchers can drop/coalesce events, so periodic full hint reconciliation remains mandatory. The generation pointer must advance only after validation, and deletes still require the existing two-observation quarantine/tombstone policy. [SOURCE: https://nodejs.org/api/fs.html#caveats] [SOURCE: .opencode/skills/sk-design/styles/_db/README.md#indexer-lifecycle]

## Ruled Out

- Port existing incremental hash policy to Rust.
- Use worker threads for asynchronous file I/O without evidence.
- Make a standalone Rust watcher at current scale.
- Trust watcher events as the correctness authority without reconciliation.

## Dead Ends

- Faster event delivery does not solve freshness if indexing still requires manual invocation or if events can be lost.

## Edge Cases

- Ambiguous input: “streaming indexing” can mean streaming file bytes, continuous event processing, or batched publication. Continuous dirty-set processing is the valuable interpretation here.
- Contradictory evidence: Node watchers are sufficient but imperfect. The resolution is Chokidar plus periodic reconciliation, not language replacement.
- Missing dependencies: no measured full-build/incremental-build durations or corpus change-rate trace.
- Partial success: the automation design is clear; concurrency and quiet-window values require measurement.

## Sources Consulted

- https://nodejs.org/api/fs.html#fswatchfilename-options-listener
- https://nodejs.org/api/worker_threads.html
- https://github.com/paulmillr/chokidar
- `.opencode/skills/sk-design/styles/_db/indexer.mjs:181-270,622-740`
- `.opencode/skills/sk-design/styles/_db/vectors.mjs:174-315`

## Assessment

- New information ratio: 0.72
- Questions addressed: indexing and watcher automation
- Questions answered: indexing and watcher automation

## Reflection

- What worked and why: separating I/O, hashing, inference, and publication prevented a blanket native-language recommendation.
- What did not work and why: no timing trace exists to size pools or prove a bottleneck.
- What I would do differently: instrument stage durations and queue wait/service times before implementation.

## Recommended Next Focus

Evaluate screenshot-derived palette, perceptual hash, layout fingerprint, and multimodal embedding features as genuinely new retrieval signals.
