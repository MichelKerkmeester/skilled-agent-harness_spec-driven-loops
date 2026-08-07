# Iteration 006 - Implicit contracts

## Preflight reasoning
- Focus: hidden invariants between modules that tests may exercise accidentally but not document as contracts.
- Hypotheses: prompt handling, mirror dedup before rerank, and Jina API result shape are implicit contracts.
- Evidence to gather: embedder prompt registry, indexing/query embedding calls, mirror collapse order, reranker dispatch, and Jina missing-index fallback.
- Falsification test: explicit contract tests and metadata already bind those assumptions.
- Expected surprise level: high because adapters often hide these details.

## Hypotheses going in
- H1: Asymmetric query/document prompt requirements are not fully represented in the embedder metadata.
- H2: The query pipeline depends on dedup happening before rerank, but the contract is not encoded as a module boundary.

## Evidence gathered
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60` maps query prompt names for several models and explicitly notes that EmbeddingGemma's document prompt is not applied at indexing time.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:143-160` creates `SentenceTransformerEmbedder` with `trust_remote_code=True` and stores `query_prompt_name`.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713` embeds dense query variants with `shared.query_prompt_name`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:328` embeds chunk text without a document prompt argument.
- External evidence: Nomic CodeRankEmbed model card `https://huggingface.co/nomic-ai/CodeRankEmbed` says the query prompt must include a task instruction prefix at lines 113-124 in the browse capture.
- External evidence: BGE-Code-v1 model card `https://huggingface.co/BAAI/bge-code-v1` shows separate `encode_queries`/`encode_corpus` usage and a query instruction format at lines 120-136 and sentence-transformers prompt usage at lines 141-164 in the browse capture.
- External evidence: Jina 1.5B model card `https://huggingface.co/jinaai/jina-code-embeddings-1.5b` describes task-specific instruction prefixes for NL2Code, Code2Code, Code2NL, Code2Completion, and QA at lines 115-120 and example query/passage prefixes at lines 153-163 in the browse capture.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:541-582` collapses mirror aliases and content/realpath duplicates before rerank; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:818-824` reranks the selected candidates.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py:155-165` assigns missing Jina-returned indices a `0.0` relevance score, then sorts.
- Source evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:113-198` returns original candidate order on cross-encoder load/predict failure; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py:146-153` does the same for Jina model errors.

## Findings (severity-tagged)
- **FINDING-006-A** [severity: HIGH-LATENT-RISK]:
  - **What**: Prompt contracts are model-specific but metadata only records a query prompt name. Document/passages prompts, task modes, and per-model instruction schemas are not first-class index metadata.
  - **Why deep-review couldn't catch this**: The reviewed default works for CodeRankEmbed's query prompt path. The missing contract appears when swapping to EmbeddingGemma, BGE-Code-v1, or Jina code embeddings.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py:35-60`, `:143-160`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:710-713`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/indexer.py:328`; external model-card URLs above.
  - **What to do**: Extend `EmbedderMetadata` with query/document prompt policy, task mode, dimension options, and license. Store the resolved policy in index metadata and invalidate/reindex when it changes.

- **FINDING-006-B** [severity: HIGH-LATENT-RISK]:
  - **What**: The reranker assumes it receives already-collapsed candidates. If a future refactor moves rerank before mirror/content dedup, reranker capacity can be wasted on aliases and path mirrors, reducing effective recall.
  - **Why deep-review couldn't catch this**: Tests can verify current order, but the invariant is not named as a pipeline contract that future changes must preserve.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:541-582`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py:818-824`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py:136-145` clips documents before calling the model, so duplicated aliases also consume reranker context.
  - **What to do**: Add a contract test named around the invariant: "mirror/content dedup precedes rerank and rerank_top_k applies after dedup".

- **FINDING-006-C** [severity: MEDIUM-OPPORTUNITY]:
  - **What**: Jina adapter fallback behavior is intentionally graceful but weakly observable. Missing result indices become `0.0`; model errors return original order. That avoids hard failures but can hide adapter/API drift.
  - **Why deep-review couldn't catch this**: Graceful degradation was probably the desired safety behavior. Deep-research asks whether operators can see when it happens.
  - **Evidence**: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers_jina_v3.py:146-165`; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/reranker.py:113-198`.
  - **What to do**: Emit a structured rerank status counter for model-load failure, predict failure, missing-index repair, doc truncation count, and elapsed time.

## Hypotheses that FAILED falsification
- The hypothesis that all candidate models share a simple "query prompt only" contract failed against EmbeddingGemma comments and BGE/Jina model cards.
- The hypothesis that reranker fallback necessarily breaks searches failed. The code preserves original order on adapter errors, so the risk is silent quality degradation, not immediate crash.

## Updates to research.md
- Added implicit contracts inventory: prompt metadata, dedup-before-rerank, and reranker fallback observability.

## NO-EARLY-STOP confirmation
- Iteration <= 10: continuing to next iter with the explicit question "what didn't I challenge yet?"

