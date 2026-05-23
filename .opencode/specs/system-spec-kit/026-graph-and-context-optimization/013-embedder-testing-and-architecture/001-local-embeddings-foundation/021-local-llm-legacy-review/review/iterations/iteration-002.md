# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability surfaces: root markdown, `.opencode/skills/**` markdown/references, `.opencode/install_guides/**`, and the configured JSON/TOML entry points. I searched for user-facing claims that still present Voyage, MiniLM, or `llama-cpp` as default/recommended after packet 014 made EmbeddingGemma the canonical default for Memory MCP and CocoIndex.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-002-001 | P1 | traceability | README.md:139 | "# Option A: Voyage AI (recommended - best quality)" | confirmed-residue | Update the root quick start to lead with hf-local EmbeddingGemma defaults and move Voyage to optional explicit setup. |
| L-002-002 | P1 | traceability | README.md:517 | "- **Voyage AI** - Set `VOYAGE_API_KEY` env var. Best quality, recommended." | confirmed-residue | Remove Voyage-as-recommended wording from the embedding provider feature list. |
| L-002-003 | P1 | traceability | README.md:828 | "Semantic code search via vector embeddings (Voyage Code 3 and All-MiniLM-L6-v2 models)" | confirmed-residue | Replace the CocoIndex model summary with `google/embeddinggemma-300m` / sentence-transformers / bf16 / 768 dims. |
| L-002-004 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/README.md:46 | "The default `auto` cascade is cloud key when configured, then `llama-cpp` when the local GGUF runtime is available, then `hf-local` as the local fallback." | confirmed-residue | Rewrite provider resolution docs so `auto` falls through to hf-local when no API keys are present; document `llama-cpp` as explicit opt-in only. |
| L-002-005 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/README.md:52 | "`EMBEDDINGS_PROVIDER=auto` resolves to `llama-cpp` after cloud providers." | confirmed-residue | Remove the auto-to-llama-cpp claim and describe synchronous migration only for explicit `EMBEDDINGS_PROVIDER=llama-cpp`. |
| L-002-006 | P1 | traceability | .opencode/skills/system-spec-kit/README.md:361 | "Compares meaning via embeddings (Voyage AI 1024d)" | confirmed-residue | Update the hybrid-search channel docs to name hf-local EmbeddingGemma q8 768d as the Memory MCP default. |
| L-002-007 | P1 | traceability | .opencode/skills/system-spec-kit/README.md:691 | "Recommended. Best retrieval quality. Requires `VOYAGE_API_KEY`" | confirmed-residue | Remove the recommendation from the provider table and mark Voyage as optional/fallback. |
| L-002-008 | P1 | traceability | .opencode/skills/system-spec-kit/shared/README.md:340 | "`HF_EMBEDDINGS_MODEL` ... `nomic-ai/nomic-embed-text-v1.5`" | confirmed-residue | Replace the stale HF model default with `onnx-community/embeddinggemma-300m-ONNX`, q8, 768 dims. |
| L-002-009 | P1 | traceability | .opencode/skills/system-spec-kit/shared/README.md:345 | "Auto-detection: Voyage if `VOYAGE_API_KEY` exists (recommended)" | confirmed-residue | Align provider precedence with post-014 behavior and remove the Voyage recommendation. |
| L-002-010 | P1 | traceability | .opencode/skills/mcp-coco-index/README.md:76 | "`sentence-transformers/all-MiniLM-L6-v2` (local, no API key)" | confirmed-residue | Change the documented default model to `google/embeddinggemma-300m` with 768-dimensional expectations. |
| L-002-011 | P1 | traceability | .opencode/skills/mcp-coco-index/README.md:77 | "`voyage/voyage-code-3` via LiteLLM (1024-dim, requires `VOYAGE_API_KEY`)" | confirmed-residue | Remove `voyage-code-3` as the primary model and present it only as optional LiteLLM configuration if retained. |
| L-002-012 | P1 | traceability | .opencode/skills/mcp-coco-index/INSTALL_GUIDE.md:437 | "**Primary (recommended):** `voyage/voyage-code-3` via LiteLLM provider -- best code search quality." | confirmed-residue | Rewrite the CocoIndex model section so sentence-transformers + `google/embeddinggemma-300m` is primary/default. |

## Iteration summary
- Files scanned: 2459
- New findings: 12 (P0=0, P1=12, P2=0)
- Out-of-scope/historical noted but NOT flagged: 4
- Notes: Additional stale CocoIndex MiniLM/Voyage references remain in README/install-guide/settings-reference/feature-catalog clusters; this iteration sampled distinct user-facing claims while avoiding duplicate flags from iteration 001. Not flagged: Qwen mentions in `cli-opencode` provider docs, Voyage in `CONTRIBUTING.md` example PR text, optional Narsil Voyage key comments, and feature-specific `node-llama-cpp` reranker playbook entries.
