# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This traceability pass scanned current operator-facing docs, READMEs, install guides, config notes, reference docs, generated catalog/playbook surfaces, packet description/graph metadata, and code comments for stale embedding-default claims after packet 022. The search targeted old Nomic/MiniLM/384-dimensional defaults, singleton sqlite filenames, rejected ONNX runtime references, "llama-cpp explicit opt-in" wording, hf-local-as-current-default wording, and Voyage marketing/default drift while treating the Voyage -> OpenAI -> llama-cpp -> hf-local cascade as canonical.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|

## Iteration summary
- Files scanned: 10777
- New findings: 0 (P0=0, P1=0, P2=0)
- Out-of-scope/historical noted but NOT flagged: 8
- Notes: Saturation. Candidate hits were already covered by iterations 001-007 (`PUBLIC_RELEASE.md`, `embedding_resilience.md`, `mcp_server/INSTALL_GUIDE.md`, `config/config.jsonc`, manual fixture text, dtype-less Voyage cloud DB examples), explicitly intentional compatibility/test material, CocoIndex `voyage-code-3` alternative-model guidance rather than default guidance, or historical packet metadata under the Setup A migration narrative. Current visible docs found in this pass align on EmbeddingGemma defaults and the intended auto cascade.
