# Iteration 009 — Local-LLM Legacy Hunt

## Focus
This iteration focused on maintainability residue in active fixtures, generated config artifacts, provider reference assets, and template-like documentation after the packet 022 fixes. I scanned active code/config/doc surfaces for singleton database names, rejected ONNX runtime package traces, stale 384/Nomic-era defaults, Voyage marketing/default drift, and fixture rot, while excluding the current review packet, frozen review logs, evidence files, z_archive, and the explicitly intentional cascade/provider implementation areas.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/embeddings/providers/README.md:62 | "configured via env" | confirmed-residue | Update the provider table to name the canonical Voyage default model `voyage-4` while still noting that `VOYAGE_EMBEDDINGS_MODEL` can override it. |
| L-009-002 | P2 | maintainability | .opencode/skills/system-spec-kit/package-lock.json:7470 | "\"onnxruntime-node\": \"1.21.0\"," | confirmed-residue | Regenerate or audit the lockfile after the package manifest cleanup; if this remains unavoidable through `@huggingface/transformers`, document it as a transitive exception rather than leaving it indistinguishable from the rejected backend. |
| L-009-003 | P2 | maintainability | .opencode/skills/system-spec-kit/package-lock.json:8528 | "\"node_modules/onnxruntime-common\": {" | confirmed-residue | Remove stale top-level lockfile material if it is no longer reachable, or record why the transitive `onnxruntime-common` lock entry is expected for the hf-local Transformers.js path. |

## Iteration summary
- Files scanned: 4409
- New findings: 3 (P0=0, P1=0, P2=3)
- Out-of-scope/historical noted but NOT flagged: 24
- Notes: Saturation reached for maintainability-focused residue. Most remaining hits were intentional legacy model registries, temp-dir `context-index.sqlite` test idioms, frozen changelog/history, or correct Voyage -> OpenAI -> llama-cpp -> hf-local cascade descriptions.
