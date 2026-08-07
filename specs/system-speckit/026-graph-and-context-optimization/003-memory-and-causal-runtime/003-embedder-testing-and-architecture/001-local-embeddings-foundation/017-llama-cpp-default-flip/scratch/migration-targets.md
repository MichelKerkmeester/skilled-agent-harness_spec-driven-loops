# Migration Targets

## T002 inventory

| Store | Size bytes | Size MB | `memory_index` rows | `vec_memories` rows | Notes |
|---|---:|---:|---:|---:|---|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite` | 96772096 | 92.29 | 2488 | 2495 | Active hf-local q8 store |

Row counts were collected with `better-sqlite3` plus `sqlite-vec` loaded. Plain `sqlite3` can count `memory_index`, but cannot query `vec_memories` on this host without loading the sqlite-vec extension.
