---
title: "Local Embeddings Phase 011: EmbeddingGemma Unification"
description: "EmbeddingGemma-300m promoted to the default embedding model for both Spec Kit Memory and CocoIndex. Qwen3 active references purged from source and config. Doc-prompt asymmetry documented as a known limitation."
trigger_phrases:
  - "embeddinggemma unification"
  - "EmbeddingGemma default both surfaces"
  - "cocoindex embeddinggemma default"
  - "purge qwen3 embeddings"
  - "hf-local onnx embeddinggemma"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/011-embeddinggemma-unification` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Setup A ended in a split-model state: Spec Kit Memory used EmbeddingGemma ONNX while CocoIndex still carried an older heavier code-side model. That split kept committed source defaults, runtime config comments and packet docs pointing at inconsistent models. Any new clone would inherit a broken story unless an operator manually aligned both surfaces.

This phase unified both embedding surfaces on EmbeddingGemma-300m. The memory side uses `onnx-community/embeddinggemma-300m-ONNX` loaded through transformers.js at 768 dimensions. The CocoIndex side uses `google/embeddinggemma-300m` loaded through sentence-transformers in bf16 safetensors form at 768 dimensions. Both source defaults now agree. Qwen3 references were purged from active source files and config comments. The CocoIndex query prompt mapping was extended to include `google/embeddinggemma-300m` with the `InstructionRetrieval` mode. A known asymmetry remains: the CocoIndex indexing path does not apply document-side prompts, so indexed documents are unprefixed. This is documented as suboptimal but acceptable for the current quiet local profile.

### Added

- `google/embeddinggemma-300m` entry in the CocoIndex query prompt registry (`shared.py`) mapped to `InstructionRetrieval` mode

### Changed

- `cocoindex_code/config.py` env fallback default updated to `sbert/google/embeddinggemma-300m`
- `cocoindex_code/settings.py` default user settings updated to `google/embeddinggemma-300m` with `sentence-transformers` provider
- `hf-local.ts` default model updated to `onnx-community/embeddinggemma-300m-ONNX`
- `factory.ts` hf-local provider-default metadata updated to match ONNX EmbeddingGemma
- Runtime config `_NOTE_2` docstrings updated across five committed MCP runtime configs to describe Gemma defaults

### Fixed

- New clones no longer inherit a split-model state where memory and CocoIndex defaults pointed at different model families

### Verification

| Check | Command | Result |
|-------|---------|--------|
| Source default diff | `git diff -- config.py settings.py hf-local.ts factory.ts` | PASS - expected defaults changed |
| Shared TypeScript build | `cd .opencode/skills/system-spec-kit/shared && npx tsc --build` | PASS |
| Legacy model sweep | targeted `rg` over active legacy code-side default strings | PASS - only historical and registry mentions remain |
| Strict validate | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py` | Default env fallback model changed to `sbert/google/embeddinggemma-300m` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Default user settings updated to `google/embeddinggemma-300m` with `sentence-transformers` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | EmbeddingGemma entry added to query prompt registry with `InstructionRetrieval` mode |
| `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` | Default model changed to `onnx-community/embeddinggemma-300m-ONNX` |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | hf-local provider-default metadata aligned to ONNX EmbeddingGemma |

### Follow-Ups

- Investigate document-side prompt support in the CocoIndex indexing path. The current asymmetry costs an estimated 5 to 10 points of recall on code queries. Addressing this is likely scoped to the `027/001-cocoindex-complete-fork` packet.
- Evaluate q8 quantization as the post-012 memory default for EmbeddingGemma ONNX to reduce RAM footprint while preserving 768-dim parity.
