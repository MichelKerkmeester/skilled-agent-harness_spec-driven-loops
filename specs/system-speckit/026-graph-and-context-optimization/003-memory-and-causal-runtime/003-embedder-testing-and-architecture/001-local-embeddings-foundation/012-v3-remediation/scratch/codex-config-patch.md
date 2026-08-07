# `.codex/config.toml` Patch Status

RESOLVED 2026-05-13 in commit 42aa114e3. Main agent applied the patch outside codex's sandbox (Apple TCC blocks codex from writing to its own .codex/config.toml). The launcher.cjs routing change is now live in main.

Historical patch that was applied:

```diff
 [mcp_servers.spec_kit_memory]
 command = "node"
-args = [".opencode/skills/system-spec-kit/mcp_server/dist/context-server.js"]
+args = [".opencode/bin/spec-kit-memory-launcher.cjs"]
 
 [mcp_servers.spec_kit_memory.env]
 EMBEDDINGS_PROVIDER = "auto"
 # MEMORY_DB_PATH intentionally unset: filename is auto-derived from provider+model+dim+dtype
 # (e.g., context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite
 # for the Setup A default since 014/012). To override the model: set
 # HF_EMBEDDINGS_MODEL in .env.local at repo root (see .env.example).
 SPECKIT_SESSION_BOOST = "true"
 SPECKIT_CAUSAL_BOOST = "true"
-_NOTE_1_DATABASE = "Stores vectors in: .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community__embeddinggemma-300m-ONNX__768.sqlite"
-_NOTE_2_PROVIDERS = "Default HF Local: onnx-community/embeddinggemma-300m-ONNX (768 dims, no API key); cloud providers optional (Voyage 1024 dims, OpenAI 1536/3072 dims)"
+_NOTE_1_DATABASE = "Stores vectors in: .opencode/skills/system-spec-kit/mcp_server/database/context-index__hf-local__onnx-community_embeddinggemma-300m-onnx__768__q8.sqlite"
+_NOTE_2_PROVIDERS = "Default HF Local: onnx-community/embeddinggemma-300m-ONNX (768 dims, q8 dtype default for 1/4 RAM at ~99% quality, no API key); cloud providers optional (Voyage 1024 dims, OpenAI 1536/3072 dims)"
```
