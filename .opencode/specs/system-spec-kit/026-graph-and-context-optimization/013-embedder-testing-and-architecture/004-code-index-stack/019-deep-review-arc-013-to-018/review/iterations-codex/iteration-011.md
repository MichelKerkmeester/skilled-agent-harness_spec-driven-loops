# Codex Iteration 011 — daemon lifecycle

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: daemon lifecycle and benchmark isolation.
- Scope: `sweep-rrf.sh`, `rerank-matrix-bench.sh`, daemon env pickup comments.
- Devin coverage: iter 003 tracked Lane A bug, but did not evaluate restart isolation.
- Adversarial angle: find TOCTOU and shared-daemon risks during benchmarks.
- Evidence plan: cite stop/restart functions and per-lane env exports.

## Cross-reference to devin pass
- Building on devin iter 003: expands Lane A operational risk to all bench lanes that mutate daemon env.
- Devin finding [003:Lane A bug follow-up] (EXPANDED): the benchmark design depends on global daemon restarts without a lock.

## Files reviewed
- `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/sweep-rrf.sh`:64-71,136-145
- `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh`:108-112,136-165

## Findings

### P2 — benchmark lane switching stops the shared daemon without a lock
**File**: `specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-bench.sh`:108-112
**Evidence**:
```bash
restart_daemon() {
  "$CCC" daemon stop >/dev/null 2>&1 || true
  # The installed CLI has no `daemon start`; the first `ccc search` auto-starts
}
```
Each lane exports env vars, stops the global daemon, and lets the next `ccc search` auto-start it. There is no lock or isolated `COCOINDEX_CODE_DIR` per run.
**Why it matters**: Concurrent operator searches during a matrix run can observe lane envs, trigger auto-start at the wrong time, or be interrupted by daemon stop. That weakens benchmark reproducibility.
**Suggested fix**: Use a bench-specific `COCOINDEX_CODE_DIR`/daemon state directory plus a lockfile, or make `ccc search` accept per-command config for bench lanes.
**Dimension(s)**: reproducibility, performance, architecture

## Dimension coverage delta (codex pass)
- architecture: covered
- code-quality: partial
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 0
New P2 in this iter: 1
