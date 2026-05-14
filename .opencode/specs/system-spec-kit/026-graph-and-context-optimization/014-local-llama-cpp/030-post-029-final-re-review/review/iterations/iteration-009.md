# Iteration 009 — Local-LLM Legacy Hunt

## Focus
I scanned maintainability-facing residue across shared embedding code, setup/install surfaces, README/SKILL/reference docs, config examples, prompt/assets/templates, fixture-style paths, and package/config metadata. The pass prioritized drift that 022 might have missed after the canonical resolver clarification: stale default labels, obsolete local-provider naming, legacy singleton sqlite paths, ONNX-runtime residue, Nomic/MiniLM default claims, and Voyage marketing/default-context residue.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-009-001 | P2 | maintainability | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:770 | "reason: 'Default local provider (transformers.js/ONNX q8)'," | confirmed-residue | Reword the fallback reason to `Fallback local provider (hf-local transformers.js/ONNX q8)` so logs and diagnostics do not describe hf-local as the local default after the llama-cpp probe fails. |

## Iteration summary
- Files scanned: 4379
- New findings: 1 (P0=0, P1=0, P2=1)
- Out-of-scope/historical noted but NOT flagged: 31
- Notes: Saturation. The remaining hits were prior-iteration duplicates (`README.md` Apple Silicon/no-setup wording, shared README default table, shared embeddings README Apple Silicon parenthetical, system-spec-kit README requirements/provider table, mcp_server README "old provider"), intentional legacy model lookup/test coverage (`nomic-ai/nomic-embed-text-v1.5`, `all-MiniLM-L6-v2`, 384-dim mock vectors), accepted test singleton sqlite idioms, or explicitly allowed cascade/default-local wording. I did not flag Voyage/OpenAI "cloud opt-in" phrasing because the surrounding docs also state the key-driven auto cascade and the user clarified that key presence is the intentional selection signal.
