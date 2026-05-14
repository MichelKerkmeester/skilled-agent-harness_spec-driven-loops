# Iteration 002 — Local-LLM Legacy Hunt

## Focus
This iteration focused on traceability residue in live documentation, install guides, reference catalogs, package metadata, and packet metadata that can still steer operators or future agents toward the wrong post-014 embedding defaults. I searched the scoped surfaces for stale hf-local default claims, explicit llama-cpp opt-in wording, old MiniLM/nomic defaults, hardcoded legacy sqlite filenames, Voyage marketing residue, and ONNX runtime references, then filtered out the explicitly intentional cascade descriptions, test temp DB idioms, backward-compat tests, frozen review/evidence artifacts, and historical migration context.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-002-001 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/description.json:5 | "auto mode was restored to hf-local and llama-cpp remains explicit opt-in" | confirmed-residue | Refresh the packet description metadata to match the clarified outcome: llama-cpp became the intended auto local default when the GGUF runtime is installed, with hf-local as fallback. |
| L-002-002 | P1 | traceability | .opencode/specs/system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/017-llama-cpp-default-flip/graph-metadata.json:54 | "auto mode was restored to hf-local and llama-cpp remains explicit opt-in" | confirmed-residue | Regenerate or patch the graph metadata causal summary so memory/graph retrieval does not resurface the reversed 017 framing. |
| L-002-003 | P2 | traceability | .opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/29-setup-native-module-health-and-mcp-installation.md:32 | "attempts to load `better-sqlite3` plus optional `onnxruntime-node` and `sharp` installs" | confirmed-residue | Update the feature catalog entry to match `scripts/setup/check-native-modules.sh`, which now probes `better-sqlite3` and optional `sharp` only. |

## Iteration summary
- Files scanned: 5958
- New findings: 3 (P0=0, P1=2, P2=1)
- Out-of-scope/historical noted but NOT flagged: 6
- Notes: Saturation reached for traceability terms. Current root README, install guide, system-spec-kit README, shared embedding READMEs, CocoIndex docs, and config templates align with the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade and EmbeddingGemma defaults. Not flagged: intentional backward-compat MiniLM tests, vitest temp `context-index.sqlite` idioms, historical prompt-pack hardcoded DB examples, 007 cleanup metadata, package-lock transitive ONNX entries, and install-guide changelog history.
