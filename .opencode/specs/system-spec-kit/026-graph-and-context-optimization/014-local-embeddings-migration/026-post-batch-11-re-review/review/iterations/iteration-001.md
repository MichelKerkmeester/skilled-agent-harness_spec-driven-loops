# Iteration 001 — Local-LLM Legacy Hunt

## Focus
Scanned correctness-sensitive production code, committed MCP/runtime configs, and active command prompt packs for post-014 embedding-default residue after packet 022. The pass prioritized live behavior or operator-facing configuration drift: provider cascade order, current default models/dimensions, profile-keyed sqlite filenames, ONNX package residue, and hardcoded singleton/vector DB names outside tests and frozen forensic material.

## Findings

| ID | Severity | Dimension | File:Line | Evidence (quote) | Disposition | Recommendation |
|----|----------|-----------|-----------|------------------|-------------|----------------|
| L-001-001 | P1 | correctness | .vscode/mcp.json:20 | "Current: 'auto' (VOYAGE_API_KEY -> OPENAI_API_KEY -> hf-local). Options: 'auto', 'voyage', 'openai', 'hf-local'" | confirmed-residue | Update VS Code MCP config to the canonical auto cascade and include `llama-cpp` in provider options. |
| L-001-002 | P1 | correctness | .vscode/mcp.json:22 | "Get Voyage key: https://dash.voyageai.com/api-keys (recommended, 8% better than OpenAI)" | confirmed-residue | Remove the unsupported "recommended, 8% better than OpenAI" marketing claim from the live config note. |
| L-001-003 | P1 | correctness | .vscode/mcp.json:39 | "Default embedding: all-MiniLM-L6-v2 (local, no API key needed)" | confirmed-residue | Replace the CocoIndex default note with `google/embeddinggemma-300m` / 768-dim sentence-transformers wording. |
| L-001-004 | P1 | correctness | .opencode/commands/doctor/update.md:121 | "LONG-POLE: memory_index_scan over context-index + voyage vector DB." | confirmed-residue | Make the `/doctor:update` prompt provider-neutral and refer to the active profile DB(s), not Voyage specifically. |
| L-001-005 | P1 | correctness | .claude/commands/doctor/update.md:121 | "LONG-POLE: memory_index_scan over context-index + voyage vector DB." | confirmed-residue | Mirror the provider-neutral `/doctor:update` prompt wording in the Claude command pack. |
| L-001-006 | P1 | correctness | .gemini/commands/doctor/update.toml:2 | "LONG-POLE: memory_index_scan over context-index + voyage vector DB." | confirmed-residue | Regenerate or patch the Gemini command pack from the corrected provider-neutral doctor update source. |

## Iteration summary
- Files scanned: 4347
- New findings: 6 (P0=0, P1=6, P2=0)
- Out-of-scope/historical noted but NOT flagged: 4
- Notes: Production provider resolver/default code looked aligned with the canonical Voyage -> OpenAI -> llama-cpp -> hf-local order. The remaining correctness residue I found is in active committed configs/prompt packs; test temp DB filenames, backward-compat model registries, historical changelogs, and forbidden-target legacy guards were not flagged.
