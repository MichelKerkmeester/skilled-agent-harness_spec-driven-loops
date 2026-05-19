# Iteration 008 - Operator UX

## Preflight reasoning
- Focus: walk through first install, first index, model swap, daemon restart, and multi-project switching.
- Hypotheses: the code path works for maintainers but has high hidden cost for first-time operators; stale CLI/venv mismatch is already visible locally.
- Evidence to gather: actual CLI failure, venv success, reindex timing, daemon restart notes, and model swap instructions.
- Falsification test: global CLI works, cost estimates are surfaced before expensive work, and model swaps are guided safely.
- Expected surprise level: high because local environment mismatches often mirror user installs.

## Hypotheses going in
- H1: First-time users can hit dependency or entrypoint drift between global `ccc` and the project venv.
- H2: Model swap/reindex cost is too expensive to be implicit.

## Evidence gathered
- Command evidence: global `ccc search "reranker mirror dedup hybrid fusion invariant" --path ... --limit 8` failed with `ModuleNotFoundError: No module named 'tree_sitter'` from `cocoindex_code/chunkers/code_aware.py:11`.
- Command evidence: `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc status` succeeded and reported the current project index stats.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28-45` includes tree-sitter and grammar packages as core dependencies; `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:53-54` exposes `ccc = "cocoindex_code.cli:app"`.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:168-175` reports full reindex times: nomic about 25 minutes and bge about 10 minutes for this repo.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:91-100` reports best-lane median/p95 latency around `1964ms/13554ms`, so first-time perceived performance is not tiny.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27` says dimension migration requires editing env/settings plus `ccc reset && ccc index`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:539-593` auto-starts/restarts daemon and retries; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:738-760` searches wait for indexing completion.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:255-258` documents a daemon env gotcha during benchmark setup.

## Findings (severity-tagged)
- **FINDING-008-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The global `ccc` entrypoint can be stale or under-provisioned relative to the repo venv. In this workspace, global `ccc` failed before search because `tree_sitter` was unavailable, while the venv CLI worked.
  - **Why deep-review couldn't catch this**: Deep-review runs against the intended test environment. It does not simulate operator path leakage, old editable installs, or non-venv shell PATH ordering.
  - **Evidence**: Global command error above; `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:28-45`, `:53-54`; successful venv `ccc status` command output in iteration 001.
  - **What to do**: Add `ccc doctor install` or startup diagnostics that checks package path, dependency availability, model cache, and current index metadata before a search.

- **FINDING-008-B** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The model swap story is operationally expensive: 10-25 minute full reindex on this repo, plus reset/index instructions for dimension changes. Users need preflight cost estimates and rollback guidance.
  - **Why deep-review couldn't catch this**: The code correctly documents reset/reindex. UX risk comes from when and how the operator experiences that cost.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:168-175`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27`.
  - **What to do**: Add a model-swap plan command that prints estimated reindex size/time from current chunk count and writes a backup/migration note before destructive reset.

- **FINDING-008-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Searches wait for indexing completion, but the UX around "daemon is alive but blocked on index" may be opaque if the user only issued a search command.
  - **Why deep-review couldn't catch this**: The wait behavior is correct for consistency. The gap is progress and recoverability in a real CLI session.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:738-760`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:539-593`.
  - **What to do**: Make the wait notice include project root, active model, elapsed indexing time, processed files/chunks if available, and a recommended status command.

## Hypotheses that FAILED falsification
- The hypothesis that a normal shell `ccc` is always equivalent to the repo venv failed in this environment.
- The hypothesis that model swaps are cheap enough to treat as ordinary config toggles failed against the benchmark's 10-25 minute full reindex rows.

## Updates to research.md
- Added operator UX gaps: stale global CLI, expensive model swaps, index-wait opacity, and daemon env surprise.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

