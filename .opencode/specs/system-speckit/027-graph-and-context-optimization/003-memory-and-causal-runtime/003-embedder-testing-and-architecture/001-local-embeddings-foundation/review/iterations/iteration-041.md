# Deep Review v4 Iteration 041 - q8 DB boundary and fp32 orphaning

## Focus

Check whether q8 creates a distinct sqlite path and whether the old fp32/no-dtype DB remains isolated.

## Findings

| ID | Severity | Location | Evidence | Recommendation |
|----|----------|----------|----------|----------------|
| None | - | - | Existing live DB is still `.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768.sqlite`; q8 derivation produces `context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite`. Because the basename differs, old fp32/no-dtype vectors are orphaned by path selection instead of mixed with q8 vectors. | Keep the new-DB boundary and require a fresh `memory_index_scan` after first q8 startup. |

## Notes

This resolves `P1-V3-005-001` at the runtime identity level. The old DB is not migrated automatically, which is the intended safe failure mode.
