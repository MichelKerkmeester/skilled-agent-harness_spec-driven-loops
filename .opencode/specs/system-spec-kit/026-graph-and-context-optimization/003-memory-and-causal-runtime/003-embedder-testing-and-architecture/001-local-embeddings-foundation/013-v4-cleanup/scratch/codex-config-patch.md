# `.codex/config.toml` Note Patch

Direct write to `.codex/config.toml` was blocked in this runtime. Apply this note-only patch to align the database example with the runtime-derived q8 slug:

```diff
 [mcp_servers.spec_kit_memory.env]
 EMBEDDINGS_PROVIDER = "auto"
-# MEMORY_DB_PATH intentionally unset: filename is auto-derived from provider+model+dim
-# (e.g., context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite
-# for the Setup A default since 014/011). To override the model: set
+# MEMORY_DB_PATH intentionally unset: filename is auto-derived from provider+model+dim+dtype
+# (e.g., context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite
+# for the Setup A default since 014/012). To override the model: set
 # HF_EMBEDDINGS_MODEL in .env.local at repo root (see .env.example).
 SPECKIT_SESSION_BOOST = "true"
 SPECKIT_CAUSAL_BOOST = "true"
-_NOTE_1_DATABASE = "Stores vectors in: .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite"
+_NOTE_1_DATABASE = "Stores vectors in: .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite"
```
