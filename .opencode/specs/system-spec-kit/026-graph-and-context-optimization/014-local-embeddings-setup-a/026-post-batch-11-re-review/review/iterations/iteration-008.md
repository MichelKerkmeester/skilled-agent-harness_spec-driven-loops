# Iteration 008 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue across live-facing docs, install guides, packet metadata, config mirrors, and references for stale embedding-default claims after packet 022. I scanned for old hf-local/MiniLM/Nomic/default-dimension language, rejected ONNX runtime references, singleton sqlite filenames, and Voyage marketing/default wording while excluding the active re-review packet, archived history, forensic evidence, test fixtures, and prior iteration duplicates.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-008-001 | P1 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:209 | "`@huggingface/transformers` (local embedding model; brings `onnxruntime-common` transitively for Transformers.js internals)" | confirmed-residue | Remove the current install-guide dependency claim for `onnxruntime-common`, or rewrite it to state that the rejected ONNX runtime backend is not an installed/runtime dependency in the post-014 path. |
| L-008-002 | P2 | traceability | .opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md:1165 | "Added `@huggingface/transformers` (with `onnxruntime-common` transitively), `chokidar`, `zod`." | confirmed-residue | Add a supersession note or update the version-history entry so readers do not carry the rejected ONNX runtime dependency forward as current installation guidance. |

## Iteration summary
- Files scanned: 9578
- New findings: 2 (P0=0, P1=1, P2=1)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation reached for the traceability pass. The canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp auto-selection, Voyage auto-pick with `VOYAGE_API_KEY`, profile-keyed sqlite filenames, fixed test sqlite filenames, legacy model registries, and prior iteration findings were not re-flagged.
