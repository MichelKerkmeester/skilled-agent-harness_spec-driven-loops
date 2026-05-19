# Iteration 004 - Architectural blind spots

## Preflight reasoning
- Focus: architecture risks that pass fixture review but fail under model swaps, multi-project use, or daemon restarts.
- Hypotheses: the 768d table and one-embedder daemon state form an implicit global mode; settings/env restart detection is partial.
- Evidence to gather: SQLite schema, embedder registry dimensions, daemon project registry, socket path, handshake/restart logic, and benchmark operational notes.
- Falsification test: per-project embedder metadata and dimension-aware table dispatch already exist.
- Expected surprise level: high because the benchmark arc explicitly retained losing adapters as opt-in.

## Hypotheses going in
- H1: The current index architecture is 768d-first and will make non-768 adapters operationally sharp.
- H2: The daemon has improved restart handling, but environment-driven configuration and multi-project isolation still have blind spots.

## Evidence gathered
- Schema command output: `sqlite3 .cocoindex_code/target_sqlite.db '.schema code_chunks_vec'` returned a `vec0` table with `embedding float[768]`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:37-39` states the dimension must match schema or trigger reindex; `:125-142` registers 2048d SFR and 1024d Stella candidates.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27` tells operators that different dimensions require `ccc reset && ccc index`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348` constructs one `ProjectRegistry` with one `_embedder` shared across loaded projects.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:268-277` stores the daemon socket under `daemon_dir() / "daemon.sock"` on Unix; isolation depends on `COCOINDEX_CODE_DIR` changing `daemon_dir()`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:524-536` restarts only when daemon handshake fails or global settings mtime changes; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:692-700` handshakes on exact package version plus captured settings mtime.
- Benchmark evidence: `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:168-175` reports full reindex costs of about 25 minutes for nomic and 10 minutes for bge; `:255-258` documents an env-var gotcha where daemon stop auto-restart did not pick up intended env vars before force kill.

## Findings (severity-tagged)
- **FINDING-004-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The system advertises non-768 embedders, but the active vector schema is locked to 768 dimensions. The documented operator path is destructive reset/reindex, not a dimension-safe migration or parallel-table plan.
  - **Why deep-review couldn't catch this**: The reviewed code correctly supports the 768d default lane. The latent risk appears when the "wide embedder support" principle meets 1024d/2048d opt-ins and emerging 1536d code models.
  - **Evidence**: Schema command output above; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:22-27`, `:37-39`, `:125-142`; Jina 1.5B model card `https://huggingface.co/jinaai/jina-code-embeddings-1.5b` reports 1536d default embeddings and Matryoshka dimensions.
  - **What to do**: Build versioned vector tables by dimension (`code_chunks_vec_768`, `code_chunks_vec_1024`, etc.) plus explicit index metadata recording model, dimension, prompt contract, and corpus hash.

- **FINDING-004-B** [severity: HIGH-LATENT-RISK]:
  - **What**: Multi-project daemon support shares one loaded embedder across projects. If two projects require different embedders or dimensions, the daemon is a global mode rather than a per-project retrieval context.
  - **Why deep-review couldn't catch this**: Existing tests can validate daemon indexing and searching for one coherent configuration. They do not model two projects with incompatible embedder settings in the same daemon lifetime.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:317-348`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:457-521` uses search-only contexts against the same registry/embedder path; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:268-277`.
  - **What to do**: Add a per-project embedder fingerprint to daemon state and reject cross-project searches when the loaded embedder cannot serve that project's index.

- **FINDING-004-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Restart detection watches package version and global settings mtime, but environment-driven knobs remain hard to reason about. The benchmark already hit an env propagation surprise during daemon restarts.
  - **Why deep-review couldn't catch this**: Deep-review verified restart semantics after specific patches; it did not require full env/config fingerprint observability.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:524-536`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:692-700`; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:255-258`.
  - **What to do**: Include an effective-config fingerprint in daemon status: embedder model, dimension, query prompt, reranker model/top_k, RRF knobs, and selected env overrides.

## Hypotheses that FAILED falsification
- The hypothesis that the active DB schema is dimension-flexible failed: the concrete schema reports `embedding float[768]`.
- The hypothesis that daemon isolation is naturally per-project failed: `ProjectRegistry` stores one `_embedder` for all loaded projects.

## Updates to research.md
- Added architectural blind spots: 768d schema lock, global daemon embedder mode, and env/settings restart gaps.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

