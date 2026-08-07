## Focus

Integrated recommendation review after iterations 011-014: final reorder, merge/split decisions, implementation readiness, exact next packet, and what continuation synthesis should add to `research.md`.

## Actions Taken

- Read the configured continuation state, strategy, state log, current synthesis, iterations 009-014, and deltas 009-014 before writing.
- Compared the iteration 009/010 final matrix with the continuation validation evidence from iterations 011-014.
- Classified each recommendation as ready to open, ready only after an upstream packet, or needing measurement, fixture design, or safety-spec work before implementation.
- Kept this pass research-only: no target skill source edits, no follow-up packet folders, no sub-agents, no nested loops, and no AI CLI dispatch.

## Sources Consulted

- `research/deep-research-config.json:3-10` and `research/deep-research-config.json:46-58` for the 15-iteration continuation and cli-codex executor lane.
- `research/deep-research-strategy.md:21-23` and `research/deep-research-strategy.md:595-599` for research-only boundaries and the reducer-selected final focus.
- `research/deep-research-state.jsonl:13-17` for the resumed 011-014 continuation state and recent new-info ratios.
- `research/research.md:80-113` for the iteration 010 baseline remediation order.
- `research/iterations/iteration-009.md:61-77` and `research/deltas/iter-009.jsonl:5` for the original order and ordering rationale.
- `research/iterations/iteration-010.md:36-63` and `research/deltas/iter-010.jsonl:5` for the final synthesis clusters and acceptance contracts.
- `research/iterations/iteration-011.md:35-47` and `research/deltas/iter-011.jsonl:2-10` for the validated remove/protocol split, internal registry prerequisite, and cancel identity/test requirements.
- `research/iterations/iteration-012.md:37-59` and `research/deltas/iter-012.jsonl:2-16` for the background-index process-boundary split and code-graph orphan/liveness constraints.
- `research/iterations/iteration-013.md:30-52` and `research/deltas/iter-013.jsonl:2-20` for process-sweep metadata, dry-run gates, sidecar ownership ledger, and unsafe `pkill` exclusions.
- `research/iterations/iteration-014.md:56-85` and `research/deltas/iter-014.jsonl:2-15` for project close scope, registry embedder cache ownership, adapter close shape, and benchmark gates.

## Findings

1. The first implementation packet should not change: open `remove-project-cancel-safety` next. It has no upstream dependency in the baseline order (`research/research.md:82-87`), iteration 011 validated that the unsafe remove/close race exists without a public cancel protocol (`research/iterations/iteration-011.md:35-47`), and the same pass defined the smallest safe internal registry and tests (`research/deltas/iter-011.jsonl:2-10`). This packet unlocks safe protocol cancel, background shutdown, project close, and registry cache eviction.

2. The recommended order should change only by splitting and tightening, not by moving resident-memory work ahead of correctness. The refined order is: `remove-project-cancel-safety`; `daemon-protocol-cancel-index-surface`; `daemon-bg-index-task-registry-shutdown`; `mcp-bg-index-threadpool-shutdown`; `code-graph-launcher-single-owner-and-orphan-reap`; `rerank-sidecar-lifecycle`; `mcp-host-session-process-sweep` inventory/termination policy; `project-close-full-release`; `registry-embedder-cache-lifecycle`; `adapter-lifecycle-management`; `code-graph-read-path-friction`; no-action F-009 bucket. If keeping fewer packets, the two background-index entries can remain under one parent, but their acceptance gates must stay separate.

3. `remove-project-cancel-safety` and `daemon-protocol-cancel-index-surface` should remain split. Merging them would blur an internal registry/SQLite safety fix with a public wire-protocol feature, and iteration 011 explicitly ruled out adding `CancelIndexRequest` before owned task identity exists (`research/iterations/iteration-011.md:64-69`, `research/deltas/iter-011.jsonl:11`).

4. `daemon-and-mcp-bg-index-task-lifecycle` should split by process boundary. The daemon half owns registry/shutdown invariants for load-time and explicit index tasks; the MCP child half owns default-ThreadPool blocking `DaemonClient.index`, visible telemetry, client transport shutdown, and bounded worker await. Iteration 012 showed that cancelling the asyncio wrapper does not stop the blocking worker (`research/iterations/iteration-012.md:37-44`, `research/deltas/iter-012.jsonl:8-12`).

5. `rerank-sidecar-lifecycle` should land before any process-sweep action that might stop a sidecar. Process sweep can open earlier as an inventory/dry-run classifier, but destructive sidecar handling needs the port-keyed ledger and health-visible instance metadata from iteration 013 (`research/iterations/iteration-013.md:30-44`, `research/deltas/iter-013.jsonl:12-17`).

6. `project-close-full-release` and `registry-embedder-cache-lifecycle` are implementation-ready after remove safety, but the synthesis should state their relationship carefully. `Project.close()` is shallow and has no `App.close()` anchor; registry embedder eviction is registry-owned, has a hard dependency on quiesced remove/refresh work, and should not wait on reranker adapter cleanup (`research/iterations/iteration-014.md:56-68`, `research/deltas/iter-014.jsonl:2-9`).

7. `adapter-lifecycle-management` remains P2 and benchmark-gated. Iteration 014 validated real close/unload gaps and an explicit cache-owner eviction shape, but it did not add successful-search or sidecar-fallback growth evidence (`research/iterations/iteration-014.md:84-85`, `research/deltas/iter-014.jsonl:13-15`).

Implementation readiness matrix:

| Recommendation | Readiness | Dependency / pre-work | First verification gate |
| --- | --- | --- | --- |
| `remove-project-cancel-safety` | Ready to open now | None | remove during explicit/load-time/queued index, bounded cancel/await, post-remove SQLite usability |
| `daemon-protocol-cancel-index-surface` | Ready after packet 1 | Choose `reqId`/`indexId` response schema in implementation spec | protocol round trips, stale/not-found/already-complete/remove-in-progress cancel cases |
| `daemon-bg-index-task-registry-shutdown` | Ready after packet 1, or merge into packet 1 if scope stays small | Reuse owned task registry and remove barrier | shutdown tracks and drains load-time/explicit index tasks |
| `mcp-bg-index-threadpool-shutdown` | Ready after daemon cancel identity exists | Test fixture for blocking `DaemonClient.index` in ThreadPool | visible `_bg_index` errors, bounded worker await, daemon-side cancel request |
| `code-graph-launcher-single-owner-and-orphan-reap` | Ready with fixture design first | Orphan/EPERM/symlink DB-dir fixtures | same effective DB dir, PPID-1 orphan candidate, `closeDb()` on shutdown |
| `rerank-sidecar-lifecycle` | Ready with safety spec first | Ledger path, owner token, shared-service health schema | fresh spawn ledger, healthy reuse, unknown-owner refusal, stale exact-PID cleanup |
| `mcp-host-session-process-sweep` | Ready as inventory first; termination after safety adapters | Exact PID/resource identity confirmation and per-service policy | dry-run no-signal, current PID/ancestor blocking, EPERM live/unknown |
| `project-close-full-release` | Ready after packet 1 | Avoid nonexistent `App.close()` anchor | idempotent deeper close that cannot interleave with active index/update work |
| `registry-embedder-cache-lifecycle` | Ready after packet 1, adjacent to project close | Fake heavy embedder/reference-release fixtures; `shared.embedder` decision | config-hash eviction, weakref/finalizer release, active work keeps references until quiesced |
| `adapter-lifecycle-management` | Not ready for priority escalation; implementation can be P2 | Fake heavy model/client tests plus benchmark before severity change | cache-owner pop-before-close, nested fallback/httpx close, successful-search/fallback RSS slope |
| `code-graph-read-path-friction` | Defer | Wait for launcher ownership | read-path batching/socket retention tests |
| `no-action-cosmetic-logging` | Do not open | None | Only smoke/static gate if touched incidentally |

## Questions Answered

- After iterations 011-014, should the recommended packet order change? Yes, but narrowly: keep correctness/lifecycle ahead of resident memory, split the background-index umbrella by process boundary, require sidecar ledger work before sidecar termination in process sweep, and keep registry cleanup adjacent to project close after remove safety.
- Which recommendations are ready to open without more research? `remove-project-cancel-safety` is ready now. `daemon-protocol-cancel-index-surface`, daemon background-index shutdown, project close, registry embedder cache lifecycle, and code-graph ownership are research-ready but have dependency or fixture-design gates. `rerank-sidecar-lifecycle` and process sweep are research-ready only with explicit safety-spec gates before destructive behavior.
- Which recommendations need measurement, test fixture design, or safety spec work first? Adapter lifecycle needs successful-search/fallback growth measurement before escalation; MCP ThreadPool shutdown, code-graph orphan handling, registry eviction, and adapter release need fake/blocking fixtures; process sweep and sidecar lifecycle need safety-spec work around exact PID, ownership, unknown liveness, and shared-service behavior.
- What exact first implementation packet should be opened next and why? Open `remove-project-cancel-safety` because it is dependency-free, source-validated, and it establishes the owned task registry and quiescence barrier required by cancel, shutdown, close, and cache-eviction work.
- What should continuation synthesis add to `research.md`? Add an "Iterations 011-015 validation addendum" that preserves the iteration 009 matrix, records the refined order/split decisions, includes the readiness matrix above, states the first packet recommendation, and lists benchmark/safety/test-fixture gates separately from research blockers.

## Questions Remaining

- In packet 2, should public index identity be a client-supplied `reqId`, a daemon-returned `indexId`, or both?
- Should load-time auto-index become externally cancellable, or only internally cancellable through remove/shutdown?
- What exact ledger path and health payload should the shared rerank sidecar use?
- Should the process sweep support pre-authorized destructive cleanup inside deep-flow YAML, or require fresh explicit confirmation for every terminating action?
- When should LiteLLM package-level async client cleanup run: daemon shutdown only, or last-LiteLLM-embedder eviction?

## Ruled Out

- Reordering resident-memory optimization ahead of correctness/lifecycle. Iterations 009-010 already rejected that without successful-search or fallback-growth evidence, and iteration 014 added API-shape evidence but no growth measurement.
- Merging `remove-project-cancel-safety` with `daemon-protocol-cancel-index-surface`. The internal race exists before public cancel and must be fixed first.
- Treating `daemon-and-mcp-bg-index-task-lifecycle` as one undifferentiated implementation change. Daemon registry safety and MCP ThreadPool shutdown have different owners, failure modes, and tests.
- Using broad `pkill -f` cleanup patterns as process-sweep implementation. Iteration 013 showed they can kill unrelated sessions and violate current-session safety.
- Using a healthy sidecar port as ownership proof. Health proves availability, not lineage or authority to terminate.
- Raising `adapter-lifecycle-management` above P2 before measurement.

## Dead Ends

- No new source discovery was useful here; iterations 011-014 already supplied the validation evidence needed for the integrated recommendation review.
- No runtime measurement was attempted; adapter escalation still depends on a controlled successful-search or sidecar-fallback benchmark outside this research-only pass.
- No implementation packet folders were created because the user explicitly constrained this iteration to research artifacts.

## Reflection

- What worked and why: Treating iterations 011-014 as validation layers over the iteration 009/010 matrix exposed exactly where the order should be tightened without reopening broad discovery.
- What did not work and why: A single linear packet list is slightly misleading for process sweep and sidecar lifecycle because inventory can be implemented before sidecar termination authority exists, but destructive actions cannot.
- What I would do differently: Carry a readiness matrix from iteration 011 onward so split/merge and "ready vs gated" decisions are visible before the final continuation pass.

## Next Focus

No further research iteration is needed for this 15-iteration run. The continuation synthesis should update `research.md` with the validation addendum, refined order, readiness matrix, first-packet recommendation, and separated measurement/safety/test gates.

## Recommended Next Focus

Open `remove-project-cancel-safety` as the next implementation packet. Its first acceptance gate should prove active explicit, load-time, and queued index work is tracked, cancelled, bounded-awaited, and unable to race registry removal or `Project.close()`.
