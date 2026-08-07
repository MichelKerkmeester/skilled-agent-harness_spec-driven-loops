# Iteration 007 — Local-LLM Legacy Hunt

## Focus
This iteration scanned correctness-oriented source and config surfaces for post-022 drift in active defaults: provider resolver order, local fallback model naming, provider-keyed sqlite paths, rejected ONNX runtime references, and stale CocoIndex defaults. The main OpenCode, Claude, Codex, and Gemini runtime notes now mostly reflect the canonical Voyage -> OpenAI -> llama-cpp -> hf-local cascade, so the pass concentrated on sidecar config files, environment examples, and non-vitest validation scripts that can still steer users or tests toward the old hf-local/MiniLM/nomic/singleton-database assumptions.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-007-001 | P1 | correctness | .opencode/skills/system-spec-kit/.env.example:11 | "Provider selection (auto \| voyage \| openai \| hf-local)" | confirmed-residue | Add `llama-cpp` to the provider list so the env template exposes the canonical auto-selectable local provider. |
| L-007-002 | P1 | correctness | .opencode/skills/system-spec-kit/.env.example:12 | "Default: auto (detects from API keys, falls back to hf-local)" | confirmed-residue | Rewrite the auto description to include the full Voyage -> OpenAI -> llama-cpp -> hf-local cascade. |
| L-007-003 | P1 | correctness | .opencode/skills/system-spec-kit/.env.example:23 | "HuggingFace local model (default when no API keys set)" | confirmed-residue | Rephrase hf-local as the final fallback, not the no-cloud-key default when llama-cpp is installed. |
| L-007-004 | P1 | correctness | .opencode/skills/system-spec-kit/.env.example:25 | "EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5" | confirmed-residue | Replace the commented current-model example with `onnx-community/embeddinggemma-300m-ONNX`, or label nomic strictly as a legacy opt-in example. |
| L-007-005 | P1 | correctness | .opencode/skills/system-spec-kit/.env.example:66 | "Choose a provider (or use default hf-local)" | confirmed-residue | Update the setup checklist to say `auto` defaults through cloud keys, then llama-cpp when available, then hf-local fallback. |
| L-007-006 | P1 | correctness | .vscode/mcp.json:20 | "Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'" | confirmed-residue | Bring the VS Code MCP config mirror in line with the canonical provider list and cascade by inserting `llama-cpp` before hf-local. |
| L-007-007 | P1 | correctness | .vscode/mcp.json:22 | "Get Voyage key: https://dash.voyageai.com/api-keys (recommended, 8% better than OpenAI)" | confirmed-residue | Remove the stale marketing comparison from the committed config note; keep only neutral key-acquisition guidance. |
| L-007-008 | P1 | correctness | .vscode/mcp.json:39 | "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)" | confirmed-residue | Change the CocoIndex VS Code config note to `google/embeddinggemma-300m` with sentence-transformers/bf16/768-dim wording. |
| L-007-009 | P1 | correctness | .opencode/skills/system-spec-kit/scripts/tests/test-folder-detector-functional.js:22 | "const REAL_DB_PATH = path.join(SKILL_ROOT, 'mcp_server/database/context-index.sqlite');" | confirmed-residue | Stop the functional test from targeting the legacy singleton DB; resolve the active provider-keyed profile path or use an isolated fixture DB. |

## Iteration summary
- Files scanned: 3347
- New findings: 9 (P0=0, P1=9, P2=0)
- Out-of-scope/historical noted but NOT flagged: 17
- Notes: No P0s found. The strongest remaining correctness residue is in sidecar setup/config surfaces rather than the canonical runtime resolver. Intentional legacy registries, vitest temp-dir singleton filenames, `test_backward_compat.py`, doctor provider-detection branches, z_archive/history, evidence files, and this review packet were excluded or noted without flags.
