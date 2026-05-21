# Codex Iteration 014 — benchmark validity

## Sequential-thinking preflight
- MCP status: unavailable; sequential-thinking calls were cancelled by runtime.
- Focus: sidecar-reported benchmark harness and published evidence validity.
- Scope: `run-phase2-smoke.sh`, `rerank-matrix-analyze.py`, 018 evidence JSON, benchmark docs.
- Devin coverage: iter 003 tracked the Lane A follow-up but not whether failed runs can be consumed as valid data.
- Adversarial angle: prove whether promoted nomic and reranker claims are reproducible from the shipped harness.
- Evidence plan: cite hardcoded embedder, failed JSON, analyzer behavior, and reproduction command syntax.

## Cross-reference to devin pass
- Building on devin iter 003: expands traceability drift into benchmark validity defects.
- Devin finding [003:Lane A bug follow-up] (EXPANDED): the evidence pipeline can ingest failed runs and the reproduction path is inconsistent.

## Files reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`:56-59
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`:57-66,77-116
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/018-rerank-matrix-rebench/evidence/runs/laneB-iter1.json`
- `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md`:297-303,353-368

## Findings

### P1 — nomic reproduction path is contradicted by the phase-2 smoke harness
**File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/run-phase2-smoke.sh`:56-59
**Evidence**:
```bash
# Pinned embedder for all lanes (reranker/path-role test)
export COCOINDEX_CODE_EMBEDDING_MODEL="sbert/BAAI/bge-code-v1"
export COCOINDEX_HYBRID="true"
export COCOINDEX_RERANK="true"
```
The benchmark report tells operators to reindex with `sbert/nomic-ai/CodeRankEmbed` and then run this script. The script immediately pins the query-time embedder back to BGE.
**Why it matters**: The nomic promotion evidence is not cleanly reproducible from the published command path. A query-time/model mismatch can make the reported "nomic" result actually run BGE for search.
**Suggested fix**: Make the embedder an explicit script input, persist it in every comparison artifact, and rerun nomic vs BGE from clean reset/index states.
**Dimension(s)**: reproducibility, correctness, embedder-agnosticism

### P1 — rerank matrix analyzer accepts failed run JSON as valid input
**File**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/011-rerank-model-fit-investigation/research/phase2-bench/rerank-matrix-analyze.py`:57-66
**Evidence**:
```python
for path in sorted(runs_dir.glob("lane*-iter*.json")):
    run = json.loads(path.read_text(encoding="utf-8"))
    runs.append(run)
```
The checked-in `laneB-iter1.json` has `success=false`, `hits=0`, and probe errors `Daemon did not start in time`. Running the analyzer on that directory still wrote `/tmp/rerank-matrix-audit.md` with a normal lane table.
**Why it matters**: Failed or stale JSON can pollute the picker and produce a plausible report from invalid measurements.
**Suggested fix**: Reject `success=false`, require expected lane/iteration counts, and fail if any probe return code is nonzero.
**Dimension(s)**: reproducibility, tests, correctness

### P2 — benchmark reproduction command passes env overrides as positional args
**File**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md`:365-368
**Evidence**:
```bash
bash .../run-phase2-smoke.sh \
  FIXTURE_OVERRIDE=... \
  OUTPUT_TAG=-reproduce \
  COMPARISON_OUTPUT=/tmp/reproduce-comparison.md
```
The script reads those as environment variables, not positional arguments.
**Why it matters**: The documented command silently ignores the intended fixture/output overrides.
**Suggested fix**: Use `FIXTURE_OVERRIDE=... OUTPUT_TAG=... COMPARISON_OUTPUT=... bash run-phase2-smoke.sh`.
**Dimension(s)**: documentation, reproducibility

### P2 — promoted benchmark docs rely on n=1 data while policy says not to
**File**: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md`:110-115
**Evidence**:
```markdown
- A place for single-data-point measurements. Promote here only when there is enough rigor...
```
The May 19 report caveat says per-embedder/reranker measurements are `n=1` and recommends 3-iteration confirmation.
**Why it matters**: The 10% latency win for nomic is plausible, but not stable enough to be promoted without a clearer provisional label.
**Suggested fix**: Demote the benchmark status until a 3-run replay exists, or label the production default provisional pending replay.
**Dimension(s)**: documentation, reproducibility

## Dimension coverage delta (codex pass)
- architecture: covered
- correctness: covered
- code-quality: covered
- maintainability: covered
- tests: covered
- documentation: covered
- performance: covered
- embedder-agnosticism: covered
- reranker-agnosticism: covered
- reproducibility: covered

## Convergence signal
New P0 in this iter: 0
New P1 in this iter: 2
New P2 in this iter: 2
