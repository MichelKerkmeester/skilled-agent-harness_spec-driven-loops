# Iteration 004 — Local-LLM Legacy Hunt

## Focus
I scanned the correctness surface for post-022 residue in committed runtime configs, provider-resolution code, installer-generated config templates, and production/script comments that could still assert the wrong active embedding defaults. The scan emphasized the canonical post-014 resolver order, profile-keyed sqlite filenames, ONNX-runtime removal, and stale cloud/local model guidance while filtering out prior iteration findings, legacy registries, frozen review artifacts, vitest temp DB idioms, and historical changelog context.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-004-001 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/setup/install.sh:195 | `"_NOTE_3_CLOUD_PROVIDERS": "In auto mode: VOYAGE_API_KEY selects Voyage embeddings + rerank-2.5, OPENAI_API_KEY selects OpenAI, otherwise HF local fallback stays active"` | confirmed-residue | Update the generated MCP config note to the canonical auto cascade: Voyage -> OpenAI -> llama-cpp when GGUF runtime is installed -> hf-local fallback. |
| L-004-002 | P1 | correctness | opencode.json:50 | `"_NOTE_3": "If you switch to LiteLLM with VOYAGE_API_KEY, use voyage/voyage-code-3 for code embeddings"` | confirmed-residue | Align the checked-in CocoIndex config note with the canonical Voyage default (`voyage/voyage-4`) or explicitly label `voyage-code-3` as a non-default legacy/code-search alternative. |

## Iteration summary
- Files scanned: 4335
- New findings: 2 (P0=0, P1=2, P2=0)
- Out-of-scope/historical noted but NOT flagged: 18
- Notes: Saturation reached for the correctness pass. Remaining hits were prior-iteration duplicates (`INSTALL_GUIDE.md`, `memory_system.md`, `run-bm25-baseline.ts`, `ground-truth-generator.ts`, `restore-checkpoint.ts`, `chunking.ts`, `content-normalizer.ts`, `test-folder-detector-functional.js`, `config_templates.md`), allowed legacy lookup registries (`nomic-ai/nomic-embed-text-v1.5`, `voyage-code-3` dimensions), vitest/temp DB fixtures using `context-index.sqlite`, package-lock/node_modules transitive ONNX entries, and historical changelog/playbook text rather than current default-asserting production behavior.
