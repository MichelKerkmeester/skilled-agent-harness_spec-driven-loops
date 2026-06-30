# Deep Review v4 Iteration 043 - launcher parity sweep

## Focus

Search all active runtime configs for direct `context-server.js` bypasses and stale launcher metadata.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| P2-V4-CONFIG-001 | P2 | `.codex/config.toml:15` | Codex runtime now uses the launcher, but its comments and `_NOTE_1_DATABASE` still show `context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite`, missing both the actual sanitizer shape and the `__q8` dtype suffix. The runtime-derived q8 basename is `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`. | Update Codex notes to say the path is derived, or use the exact sanitized q8 basename. |

## Notes

No active `.codex`, `.claude`, `.gemini`, `.mcp.json`, or `opencode.json` Spec Kit Memory config still launches `context-server.js` directly.
