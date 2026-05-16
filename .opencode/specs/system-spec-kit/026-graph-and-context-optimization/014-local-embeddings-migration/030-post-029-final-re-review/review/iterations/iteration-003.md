# Iteration 003 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue in live templates, install metadata, README provider tables, and inline comments across the requested code and documentation surfaces. I scanned for stale local-LLM defaults, old model names, hardcoded database filenames, rejected ONNX backend references, and cloud-provider marketing residue, while excluding the current review packet, frozen archives, forensic evidence, prior packet review artifacts, dependency folders, build outputs, and known intentional compatibility tests.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-003-001 | P1 | maintainability | .opencode/skills/mcp-coco-index/mcp_server/pyproject.toml:51 | "Default install (`pip install -e .`) routes through LiteLLM (Voyage AI etc.) only." | confirmed-residue | Update the package metadata comments to match the shipped installer and docs: the default setup is local sentence-transformers EmbeddingGemma; LiteLLM/Voyage is an optional cloud path. |
| L-003-002 | P1 | maintainability | .opencode/skills/system-spec-kit/scripts/setup/install.sh:194 | "\"_NOTE_2_PROVIDERS\": \"Supports: Voyage (1024 dims), OpenAI (1536/3072 dims), HF Local (768 dims, no API needed)\"" | confirmed-residue | Add llama-cpp to the generated provider note and identify it as the default local provider when the GGUF runtime is installed. |
| L-003-003 | P2 | maintainability | .opencode/skills/system-spec-kit/scripts/setup/install.sh:274 | "- Multiple embedding providers (Voyage, OpenAI, local HF)" | confirmed-residue | Refresh the install help feature list so it names the full canonical provider set: Voyage, OpenAI, llama-cpp, and hf-local. |
| L-003-004 | P2 | maintainability | .opencode/skills/system-spec-kit/README.md:691 | "| llama-cpp         | 768        | Default on Apple Silicon. Q8_0 GGUF + Metal GPU. No setup.       |" | confirmed-residue | Rephrase to the canonical condition: llama-cpp is selected when the GGUF runtime/model probe succeeds; avoid implying Apple-Silicon-only behavior or unconditional no-setup availability. |
| L-003-005 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:21 | "// NOTE: kept as the default (Nomic) prefix shape for backward-compatible consumers" | confirmed-residue | Rename/comment this as a legacy TASK_PREFIX compatibility export, not a default prefix/model signal; point future callers to the EmbeddingGemma registry path. |

## Iteration summary
- Files scanned: 5260
- New findings: 5 (P0=0, P1=2, P2=3)
- Out-of-scope/historical noted but NOT flagged: 9
- Notes: Saturation is high after packet 022. I did not flag the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade, llama-cpp auto-selection, Voyage auto-pick when `VOYAGE_API_KEY` is set, vitest temp `context-index.sqlite` patterns, compatibility tests for MiniLM/Nomic, provider registries, package-lock transitive `onnxruntime-*` entries via `@huggingface/transformers`, or frozen archive/forensic records.
