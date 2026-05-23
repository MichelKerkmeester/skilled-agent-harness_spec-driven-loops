# Iteration 017 — CORRECTNESS (TS-Python cross-stack contract)

## P0 Findings

### P0-1: Disjoint model namespaces — zero contract overlap
**Severity:** P0  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:29-93` (MANIFESTS array)  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:49-110` (MANIFESTS tuple)

**Issue:** The TS-side and Python-side embedder registries are completely disjoint with no shared model namespace. TS has 8 models, Python has 6 models, and there is zero overlap even after accounting for naming convention differences.

**Reproduction:**
1. Read `registry.ts:29-93` — observe 8 models: `embeddinggemma-300m`, `nomic-embed-text-v1.5`, `mxbai-embed-large-v1`, `bge-small-en-v1.5`, `bge-large-en-v1.5`, `jina-embeddings-v3`, `bge-m3`, `snowflake-arctic-embed-l-v2.0`
2. Read `registered_embedders.py:49-110` — observe 6 models: `sbert/jinaai/jina-embeddings-v2-base-code`, `sbert/google/embeddinggemma-300m`, `sbert/nomic-ai/CodeRankEmbed`, `sbert/BAAI/bge-code-v1`, `sbert/jinaai/jina-embeddings-v2-base-en`, `sbert/Salesforce/SFR-Embedding-Code-2B_R`
3. Compare: Even accounting for the `sbert/` prefix vs bare name convention, there is no model that appears on both sides
4. The closest match is `embeddinggemma-300m` (TS) vs `sbert/google/embeddinggemma-300m` (Python), but these are different model variants (TS uses llama-cpp GGUF, Python uses SentenceTransformers HF)

**Recommendation:** Establish a shared model namespace contract. Decide whether:
- Option A: Python adopts TS models (llama-cpp/ollama backends)
- Option B: TS adopts Python models (SentenceTransformers backend)
- Option C: Create a mapping layer that translates between the two namespaces
This is a fundamental architectural decision that affects 016/019 parity claims.

---

### P0-2: Default model mismatch
**Severity:** P0  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:25-28` (DEFAULT_ACTIVE_EMBEDDER)  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:10` (_DEFAULT_MODEL) and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:113` (_DEFAULT_NAME)

**Issue:** The default embedder models are different between TS and Python, violating cross-stack contract consistency.

**Reproduction:**
1. Read `schema.ts:25-28` — TS default is `embeddinggemma-300m` with dim 768
2. Read `config.py:10` — Python default is `sbert/jinaai/jina-embeddings-v2-base-code`
3. Read `registered_embedders.py:113` — Python confirms default is `sbert/jinaai/jina-embeddings-v2-base-code`
4. Compare: These are completely different models (TS: Google Gemma via llama-cpp, Python: Jina code-tuned via SentenceTransformers)

**Recommendation:** Align default model selection after resolving P0-1. The default should be:
- Present in BOTH registries (after namespace unification)
- The same model variant (same backend, same quantization if applicable)
- Documented in both sides as the production default

---

### P0-3: Contract violation — "mirrors the MANIFESTS pattern" claim is false
**Severity:** P0  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:1-9` (docstring claims "Mirrors the MANIFESTS pattern from 016's mk-spec-memory pluggable architecture")

**Issue:** The Python registry docstring claims it mirrors the TS MANIFESTS pattern from 016, but the actual content is completely different (disjoint namespaces, different models, different metadata structure). This is a documentation-contract violation.

**Reproduction:**
1. Read `registered_embedders.py:1-9` — docstring states: "Mirrors the MANIFESTS pattern from 016's mk-spec-memory pluggable architecture"
2. Read `registry.ts:29-93` — TS MANIFESTS structure: name, dim, backend, modelPath/ollamaName, notes (no ram_mb, disk_mb, mps_compatible, category, hf_url)
3. Read `registered_embedders.py:49-110` — Python MANIFESTS structure: name, dim, ram_mb, disk_mb, mps_compatible, category, hf_url, notes (no backend, modelPath, ollamaName)
4. Compare: The schemas are different, the models are different, the intent is different (TS: local backends, Python: SentenceTransformers HF models)

**Recommendation:** Either:
- Remove the "mirrors" claim if the registries are intentionally independent
- Or actually mirror the TS MANIFESTS (same models, same schema) if parity is the goal
- Update the docstring to accurately describe the relationship (e.g., "Inspired by 016's MANIFESTS pattern but adapted for SentenceTransformers backend")

---

## P1 Findings

### P1-1: Dimension drift — asymmetric dimension support
**Severity:** P1  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:29-93` (MANIFESTS dim values)  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:49-110` (MANIFESTS dim values)

**Issue:** The two stacks support different embedding dimensions, creating migration asymmetry. TS supports 384, 768, 1024 dims. Python supports 768, 2048 dims.

**Reproduction:**
1. Read `registry.ts:29-93` — extract dimensions: 768 (gemma, nomic), 1024 (mxbai, bge-large, jina-v3, bge-m3, arctic), 384 (bge-small)
2. Read `registered_embedders.py:49-110` — extract dimensions: 768 (jina-code, gemma, CodeRankEmbed, bge-code, jina-en), 2048 (SFR-Embedding-Code-2B_R)
3. Compare:
   - TS has 384-dim model (bge-small-en-v1.5) not in Python
   - Python has 2048-dim model (SFR-Embedding-Code-2B_R) not in TS
   - Shared dims: only 768 (both sides have multiple models)

**Recommendation:** Harmonize dimension support. Decide whether to:
- Add 384-dim support to Python (for bge-small parity)
- Add 2048-dim support to TS (for SFR-Embedding-Code-2B_R parity)
- Document that dimension support is intentionally asymmetric per backend capabilities

---

### P1-2: Orphaned cross-references — models referenced but not shared
**Severity:** P1  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:29-93`  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:49-110`

**Issue:** Both sides reference model families (nomic, bge, jina) but use completely different specific models, creating false impression of parity.

**Reproduction:**
1. Read `registry.ts:38-46` — TS has `nomic-embed-text-v1.5` (text model via ollama)
2. Read `registered_embedders.py:71-79` — Python has `sbert/nomic-ai/CodeRankEmbed` (code model via SentenceTransformers)
3. Compare: Same vendor (Nomic), different models, different backends, different purposes (text vs code)
4. Repeat for BAAI: TS has `bge-small-en-v1.5` and `bge-large-en-v1.5` (text models), Python has `sbert/BAAI/bge-code-v1` (code model)
5. Repeat for Jina: TS has `jina-embeddings-v3` (multilingual), Python has `jina-embeddings-v2-base-code` and `jina-embeddings-v2-base-en` (code and text v2)

**Recommendation:** Either:
- Align on the same specific models per vendor (if parity is goal)
- Or document that vendor overlap is coincidental and models are intentionally different per backend capabilities

---

## P2 Findings

### P2-1: Name normalization convention mismatch
**Severity:** P2  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/registry.ts:30-92` (name field)  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py:50-109` (name field)

**Issue:** TS uses bare model names (e.g., `embeddinggemma-300m`), Python uses `sbert/` prefixed HuggingFace paths (e.g., `sbert/google/embeddinggemma-300m`). This creates integration friction if cross-stack model selection is ever needed.

**Reproduction:**
1. Read `registry.ts:30-92` — all names are bare: `embeddinggemma-300m`, `nomic-embed-text-v1.5`, etc.
2. Read `registered_embedders.py:50-109` — all names are `sbert/` prefixed: `sbert/jinaai/jina-embeddings-v2-base-code`, `sbert/google/embeddinggemma-300m`, etc.
3. Compare: No shared naming convention; cannot directly map names without translation layer

**Recommendation:** Establish a shared naming convention. Options:
- Both sides use bare names (remove `sbert/` prefix from Python)
- Both sides use full HuggingFace paths (add HF paths to TS)
- Create a bidirectional name mapping function if conventions must differ

---

### P2-2: Environment variable naming divergence
**Severity:** P2  
**TS-side:** `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/schema.ts:30-31, 96-136` (uses DB schema with vec_metadata table)  
**Python-side:** `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config.py:119-122` (uses COCOINDEX_CODE_EMBEDDING_MODEL env var)

**Issue:** TS uses SQLite database schema for active embedder configuration (vec_metadata table with active_embedder_name/active_embedder_dim keys), while Python uses environment variable (COCOINDEX_CODE_EMBEDDING_MODEL). This creates configuration asymmetry.

**Reproduction:**
1. Read `schema.ts:30-31` — TS defines ACTIVE_EMBEDDER_NAME_KEY and ACTIVE_EMBEDDER_DIM_KEY for DB storage
2. Read `schema.ts:83-94` — TS reads active embedder from vec_metadata table, falls back to DEFAULT_ACTIVE_EMBEDDER
3. Read `config.py:119-122` — Python reads embedding model from COCOINDEX_CODE_EMBEDDING_MODEL env var, falls back to _DEFAULT_MODEL
4. Compare: Different configuration mechanisms (DB vs env var), different key names

**Recommendation:** Harmonize configuration mechanism. Options:
- Both sides use environment variables (add env var support to TS)
- Both sides use database/storage (add DB config to Python)
- Document that configuration mechanisms are intentionally different per runtime context (TS: long-running server, Python: CLI/session-based)

---

## Summary

This iteration identified fundamental cross-stack contract violations between the TS-side (system-spec-kit 016 embedder registry) and Python-side (mcp-coco-index 019 embedder registry). The two registries are completely disjoint with zero model overlap, different defaults, asymmetric dimension support, and divergent naming/configuration conventions.

**P0:** 3 findings (disjoint namespaces, default mismatch, false documentation claim)  
**P1:** 2 findings (dimension drift, orphaned cross-references)  
**P2:** 2 findings (naming convention mismatch, env var divergence)

These findings indicate that 016 and 019 do not currently share a cross-stack embedder contract, despite documentation suggesting parity. Resolution requires architectural decisions about shared namespace, backend alignment, and configuration harmonization.
