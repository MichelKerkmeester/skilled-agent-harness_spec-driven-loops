# Iteration 002 - External landscape sweep

## Preflight reasoning
- Focus: compare the 013-018 choices against current model/library landscape.
- Hypotheses: the registry is intentionally conservative but already lags several code-embedding families; licensing and API contracts matter as much as benchmark scores.
- Evidence to gather: model card/API data for default and candidate embedders/rerankers, PyPI release drift, and CoIR/MTEB-code signals.
- Falsification test: current registry already covers the best recent open, commercial-safe, dimension-compatible options.
- Expected surprise level: high because model cards can reveal non-obvious dimension, prompt, and license constraints.

## Hypotheses going in
- H1: Nomic CodeRankEmbed remains a reasonable 768d default, but it is not a stable "best code embedder" claim after the 2025/2026 landscape moved.
- H2: Some high-quality candidates carry licenses or dimensions that make "wide support" more complicated than adding registry rows.

## Evidence gathered
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:62-144` registers seven embedders; `:84-91` marks `sbert/nomic-ai/CodeRankEmbed` as default, while `:125-142` includes 2048d SFR and 1024d Stella entries.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:15-26` defaults reranking to `jinaai/jina-reranker-v3` with `rerank_top_k=20`.
- Hugging Face API command: `nomic-ai/CodeRankEmbed 383262 2025-06-24T01:59:48.000Z {'base_model': ['Snowflake/snowflake-arctic-embed-m-long'], 'library_name': 'sentence-transformers', 'license': 'mit'}`.
- Hugging Face API command: `jinaai/jina-reranker-v3 1152318 2026-03-27T13:54:20.000Z {'pipeline_tag': 'text-ranking', ... 'license': 'cc-by-nc-4.0'}`.
- Hugging Face model card: `https://huggingface.co/jinaai/jina-reranker-v3` reports CC BY-NC 4.0 at lines 55-58 and says commercial on-prem use needs licensing contact at lines 233-235 in the browse capture.
- Hugging Face model card: `https://huggingface.co/jinaai/jina-code-embeddings-1.5b` reports code-retrieval support across 15+ programming languages, task-specific instruction prefixes, default 1536d embeddings, and Matryoshka dimensions 128/256/512/1024/1536 at lines 115-120 and 123-129 in the browse capture.
- Hugging Face API command: `jinaai/jina-code-embeddings-1.5b 84440 2025-10-02T23:47:34.000Z {'license': 'cc-by-nc-4.0', ...}`.
- Hugging Face API search command for `code embedding`: top 12 included `jinaai/jina-code-embeddings-1.5b`, `Salesforce/SFR-Embedding-Code-400M_R`, `jinaai/jina-code-embeddings-1.5b-GGUF`, `jinaai/jina-code-embeddings-1.5b-mlx`, `jinaai/jina-embeddings-v4-text-code-GGUF`.
- PyPI command: `sentence-transformers` current `version 5.5.0`, `requires_python >=3.10`, recent releases include `5.4.1` and `5.5.0`; benchmark env used `sentence-transformers 5.4.1` in `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:179-181`.
- CoIR raw command from `https://huggingface.co/spaces/mteb/leaderboard/raw/5304e8398657610ebdb5f88639249bd054753b46/boards_data/coir/data_tasks/Retrieval/default.jsonl` shows old top rows dominated by 7B/e5/multilingual models with dimensions 4096/1024/768 and broad CodeSearchNet language columns.

## Findings (severity-tagged)
- **FINDING-002-A** [severity: HIGH-LATENT-RISK]:
  - **What**: The registry mixes 768d production defaults with 1024d/2048d opt-ins, while current external code-embedding families increasingly expose 1536d/Matryoshka or larger dimensions. Without dimension-negotiated schemas, "wide embedder support" becomes an operator reset/reindex path rather than true adapter breadth.
  - **Why deep-review couldn't catch this**: The reviewed packets intentionally kept the working 768d path stable. The failure appears only when the external model landscape is compared to schema and daemon lifecycle assumptions.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:37-39`, `:84-91`, `:125-142`; Jina 1.5B model card URL above with 1536d/Matryoshka details; CoIR raw command output above.
  - **What to do**: Add a "dimension-flex index architecture" packet: per-dimension vector tables, dimension-specific index metadata, and a no-surprise migration command.

- **FINDING-002-B** [severity: HIGH-LATENT-RISK]:
  - **What**: The default reranker is a non-commercially licensed model (`jinaai/jina-reranker-v3`). That may be acceptable for local research, but it is a deployment/legal risk if users assume Apache-licensed package dependencies imply unrestricted commercial use.
  - **Why deep-review couldn't catch this**: Deep-review verified the reranker adapter and benchmark lift. It did not audit external model license compatibility with operator deployment contexts.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:22-26`; Hugging Face model card `https://huggingface.co/jinaai/jina-reranker-v3` lines 55-58 and 233-235 in browse capture; API command output `license: cc-by-nc-4.0`.
  - **What to do**: Add an explicit model-license manifest field and startup warning for non-commercial defaults. Retain Jina as opt-in if the operator principle requires losing adapters to remain available.

- **FINDING-002-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: The benchmark environment is already one sentence-transformers minor release behind PyPI (`5.4.1` bench vs `5.5.0` current). That is not a bug by itself, but it means model-loading behavior and prompt handling should be version-pinned in benchmark reports.
  - **Why deep-review couldn't catch this**: The packets only needed the tested local environment to pass; they did not require future release drift monitoring.
  - **Evidence**: PyPI JSON command output above; `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-19/benchmark_report.md:179-181`.
  - **What to do**: Add a 3-month landscape refresh checklist that re-runs model loading smoke tests on the latest supported `sentence-transformers` minor.

## Hypotheses that FAILED falsification
- "All high-quality recent code models are Apache/MIT compatible" failed: Jina 1.5B and Jina reranker v3 are CC BY-NC 4.0, and SFR-Embedding-Code-2B_R also reports CC BY-NC 4.0 via the Hugging Face API command.
- "The current leaderboard raw path is stable enough to script directly from `main`" was not supported in earlier probing; a pinned commit raw URL worked, while a `main` raw path returned an entry-not-found response.

## Updates to research.md
- Added the external landscape diff: non-768 model pressure, license risk, sentence-transformers release drift, and model-card prompt requirements.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

