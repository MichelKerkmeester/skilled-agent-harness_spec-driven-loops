# Deep Review Iteration 001

## Dispatcher

- Target: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc`
- Review packet root: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/008-rerank-sidecar-arc/review/`
- Iteration: 001
- Dimension: D1 Correctness
- Focus area: phase 001 routing precedence plus phase 002 rerank sidecar correctness
- Budget profile: scan
- Status: complete

## Files Reviewed

- `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts`
- `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py`
- `.opencode/skills/system-rerank-sidecar/scripts/start.sh`
- `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py`
- `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts`
- `.opencode/skills/sk-code-review/references/review_core.md`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Sidecar pytest contract does not prove the edge behavior it names** -- `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:48` -- `test_rerank_basic_sigmoid_bounds` only sends one live request and asserts returned scores are in `[0,1]`, so it does not drive known positive and negative logits through the sigmoid overflow-safe branches. `test_rerank_concurrent_requests_serialized` launches five requests with `asyncio.gather`, but only checks that all responses contain bounded scores; it has no overlap counter, timing gate, or mocked `predict()` critical section proving serialization. `test_sigterm_clean_shutdown` checks process exit after SIGTERM but does not observe FastAPI lifespan cleanup. [SOURCE: `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:48`] [SOURCE: `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:65`] [SOURCE: `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py:88`]

   Finding class: test-isolation
   Scope proof: The full sidecar pytest file was reviewed; these are the only tests covering sigmoid bounds, concurrent serialization, and SIGTERM behavior in `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py`.
   Affected surface hints: ["system-rerank-sidecar pytest suite", "sigmoid edge coverage", "asyncio.Lock serialization contract", "lifespan shutdown coverage"]
   Recommendation: Add a unit-level test that injects fixed logits into `_model.predict()` or tests `sigmoid()` directly for large positive and negative values, add an instrumented fake `predict()` with an active-call counter to prove `max_active == 1`, and assert lifespan shutdown evidence through a monkeypatched model or observable cleanup hook.

## Traceability Checks

- Phase 001 precedence intent is present in source: `isCrossEncoderEnabled()` is evaluated before `isLocalRerankerEnabled()`, and the cross-encoder branch precedes the local shim. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:379`]
- The helper guard matches the documented defense-in-depth rule: `isLocalRerankerEnabled()` returns `false` immediately when `isCrossEncoderEnabled()` is true. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:364`]
- Phase 002 sidecar correctness probes were tied to source, not only tests: sigmoid math, locking, health, warmup, rerank normalization, and launcher signal routing were all inspected directly.

## Integration Evidence

- Cross-encoder precedence: the cross-encoder branch returns from `applyCrossEncoderReranking()` before the local-reranker branch is reachable, so both branches cannot execute in one call. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:403`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:459`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:472`]
- Local-reranker guard: the legacy local path is suppressed at the flag helper when cross-encoder mode is enabled. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts:365`]
- Sigmoid math is overflow-safe for both signs: non-negative inputs use `exp(-x)`, negative inputs use `exp(x)` and divide by `1 + z`. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:38`]
- `asyncio.Lock` covers model loading and `_model.predict()` in `/rerank`, while sigmoid sorting and response construction happen after the lock is released. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:117`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:122`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:124`]
- `/health` does not await or acquire the lock; `_lock.locked()` is a non-blocking status peek. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:85`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:91`]
- `/rerank` returns sigmoid-normalized relevance scores sorted by score and wrapped in the response model, keeping response scores in `[0,1]` for finite raw logits. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:124`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:149`]
- SIGTERM reaches uvicorn directly because `start.sh` uses `exec python -m uvicorn ...`; under uvicorn's graceful signal handling, this is the path that runs FastAPI lifespan shutdown rather than leaving the shell as an intermediate signal sink. [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/start.sh:24`] [SOURCE: `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:73`]

## Edge Cases

- Uvicorn lifespan-on-SIGTERM behavior is an external runtime contract. This iteration verified the local launcher uses `exec` so SIGTERM targets uvicorn directly, but it did not run a live process-level instrumentation test proving the lifespan cleanup block executes.
- The pytest suite uses a live sidecar/model path, which is useful as smoke coverage but weak for deterministic edge contracts like overflow branches and lock serialization.

## Confirmed-Clean Surfaces

- No conditional inversion was found in the phase 001 precedence swap.
- No path was found where cross-encoder and local GGUF reranking both execute in a single Stage 3 rerank call.
- No sigmoid overflow issue was found for finite positive or negative logits.
- No missing lock around `_model.predict()` was found.
- No blocking lock acquire was found in `/health`.
- No sidecar source path was found returning raw, unnormalized model logits from `/rerank`.
- The two Stage 3 regression tests correctly mock both flag states and assert the intended provider path: cross-encoder wins when both flags are true, and the legacy local shim still runs when cross-encoder is false. [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:93`] [SOURCE: `.opencode/skills/system-spec-kit/mcp_server/tests/stage3-rerank-regression.vitest.ts:124`]

## Ruled Out

- Ruled out: phase 001 branch double-execution. Evidence: cross-encoder branch returns before the local branch line window.
- Ruled out: defense-in-depth helper regression. Evidence: `isLocalRerankerEnabled()` short-circuits on `isCrossEncoderEnabled()`.
- Ruled out: raw-score response leakage for normal finite model outputs. Evidence: `/rerank` maps raw scores through `sigmoid()` before response construction.
- Ruled out: shell swallowing SIGTERM before uvicorn. Evidence: launcher uses `exec`.

## Next Focus

- dimension: D2 Security
- focus area: `trust_remote_code=True` with pinned revision and local cache posture, 127.0.0.1 binding, subprocess/env allowlist behavior, benchmark/log data exposure, and sidecar HTTP trust boundary
- reason: D1 source paths are clean except for one P2 test-quality advisory; security is the next configured dimension and carries the highest remaining risk around model loading and local service exposure.
- rotation status: D1 complete; rotate to D2 for iteration 002.
- blocked/productive carry-forward: Productive D1 method was direct source line-window review plus focused tests. Carry P2 test-contract weakness forward to D4 Maintainability if the loop needs a test-suite quality pass.
- required evidence: sidecar skill code and launcher/config surfaces, runtime env allowlists, benchmark/log artifacts, and documentation claims around localhost-only exposure.

Review verdict: PASS
