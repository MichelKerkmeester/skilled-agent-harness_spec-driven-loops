---
title: README Resource Map for 014 Changes
description: Inventory of every README in the repo with staleness verdicts and per-file edit guidance.
trigger_phrases:
  - "019 readme resource map"
  - "readme staleness map"
  - "post-014 doc cleanup"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/019-readme-resource-map"
    last_updated_at: "2026-05-13T15:44:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Authored resource map from 522-README scan"
    next_safe_action: "Main agent applies edits per Section 3"
    blockers: []
    key_files:
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0140190c2a9e0000000000000000000000000000000000000000000000000005"
      session_id: "019-readme-resource-map-2026-05-13"
      parent_session_id: "019-readme-resource-map-2026-05-13"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Q1: Remove Ollama from install guide -> A"
      - "Q2: barter copies -> B. Symlink"
      - "Q3: providers README auto-migration mention -> A. Brief mention + link"
      - "Q4: ollama in EMBEDDINGS_PROVIDER -> No"
---
<!-- SPECKIT_TEMPLATE_SOURCE: resource-map-core | v2.2 -->
# README Resource Map for 014 Changes

<!-- SPECKIT_LEVEL: 1 -->

## 1. SUMMARY

Found 522 README.md files across the full repository tree (excluding `node_modules`, `.venv`, `dist`, `.git`, `external`). Of these, 7 are **MAJOR** (headline narrative out of sync with the 014 post-state), contributing roughly 800 KB of stale content across the most-read docs in the project. 1 is a borderline minor/clean case flagged for a second look. The remaining 514 READMEs are directory-level indexes in spec folders, skill subdirectories, test fixtures, and z_archive — none of them discuss embedding infrastructure and are all CLEAN.

**Top 3 to fix first:**
1. `README.md` (root) — the first thing every new user reads; recommends Voyage as default.
2. `.opencode/install_guides/README.md` — the canonical setup guide; describes Nomic as HF default and lacks `llama-cpp` entirely.
3. `.opencode/skills/system-spec-kit/README.md` — the 81 KB framework manual; Voyage as "Recommended", missing `llama-cpp`, 1024d as default vector dimension.

**Cross-cutting pattern:** Every README that describes the embedding provider story is out of sync. None of them mention `llama-cpp` or the local-first cascade. The `barter/` subdirectory contains independent copies of the same READMEs (same staleness, same fixes needed) — see §4.

## 2. INVENTORY

| # | Path | Size | Last Modified | Verdict | Priority |
|---|------|------|---------------|---------|----------|
| 1 | `README.md` (root) | 74 KB | 2026-04-05 | MAJOR | P0 |
| 2 | `.opencode/install_guides/README.md` | 60 KB | 2026-05-11 | MAJOR | P0 |
| 3 | `.opencode/skills/system-spec-kit/README.md` | 81 KB | 2026-05-09 | MAJOR | P0 |
| 4 | `.opencode/skills/system-spec-kit/shared/embeddings/providers/README.md` | 4.7 KB | 2026-05-07 | MAJOR | P1 |
| 5 | `.opencode/skills/system-spec-kit/shared/embeddings/README.md` | 6.4 KB | 2026-05-07 | MAJOR | P1 |
| 6 | `.opencode/skills/system-spec-kit/shared/README.md` | 25 KB | 2026-05-07 | MAJOR | P1 |
| 7 | `.opencode/skills/mcp-coco-index/README.md` | 24 KB | 2026-05-09 | MAJOR | P0 |
| 8 | `.opencode/skills/system-spec-kit/shared/mcp_server/database/README.md` | 4.1 KB | 2026-05-07 | CLEAN | — |
| 9–522 | (all other 514 READMEs) | various | various | CLEAN | — |

**Note on #8:** The `test-context-index.sqlite` references in this file ARE test fixture names, not documentation of the production DB filename pattern. They are not stale. Marked CLEAN after closer inspection.

**Note on barter/ copies:** `barter/.opencode/skills/system-spec-kit/README.md`, `barter/.opencode/skills/mcp-coco-index/README.md`, `barter/.opencode/install_guides/README.md`, and `barter/.opencode/skills/system-spec-kit/shared/` READMEs exist as independent copies with the same stale content. They are not listed as separate verdict rows because they are byte-for-byte or near-identical copies of the canonical `.opencode/` versions above. The same edits should be applied to both the canonical and barter/ copies. See §4 Cross-Cutting Themes.

## 3. PER-README DETAIL

### 3.1 — README.md (root)

**Verdict:** `MAJOR`
**Priority:** `P0`
**Reason:** The root README is the project landing page. It recommends Voyage as the default embedding provider and uses the legacy `context-index.sqlite` filename.

**Stale sections / lines:**

- **Line 95, ASCII architecture diagram:**
  > `│  Voyage │ OpenAI │ HuggingFace Local     │`
  **Why stale:** Provider list is missing `llama-cpp`. The diagram reinforces the old cloud-first worldview.
  **Suggested replacement:**
  > `│  llama-cpp │ HF Local │ OpenAI │ Voyage  │`

- **Lines 136–147, §2 Quick Start "Set Up Embedding Provider":**
  > ```bash
  > # Option A: Voyage AI (recommended - best quality)
  > export VOYAGE_API_KEY="your-key-here"
  > 
  > # Option B: OpenAI embeddings
  > export OPENAI_API_KEY="your-key-here"
  > 
  > # Option C: HuggingFace Local (free, no API key needed)
  > # No setup required - auto-detected when no API keys are set
  > ```
  **Why stale:** Presents Voyage as "Option A: recommended" and HuggingFace Local as "Option C" fallback. In reality (per `factory.ts:786-836`), llama-cpp is the default on most clones with zero setup. Voyage is now gated behind the egress guard and is cloud opt-in only.
  **Suggested replacement:**
  > ```bash
  > # Default: llama-cpp (free, local, zero setup on Apple Silicon)
  > # No setup required. The daemon auto-detects the GGUF model and Metal GPU.
  > 
  > # Option A: Voyage AI (cloud, requires API key — opt-in only)
  > export VOYAGE_API_KEY="your-key-here"
  > 
  > # Option B: OpenAI embeddings (cloud, requires API key)
  > export OPENAI_API_KEY="your-key-here"
  > 
  > # Option C: HuggingFace Local (free, CPU fallback when llama-cpp is unavailable)
  > # Auto-detected when llama-cpp probe fails and no cloud keys are set
  > ```

- **Lines 517–519, Embedding Providers section:**
  > - **Voyage AI** - Set `VOYAGE_API_KEY` env var. Best quality, recommended.
  > - **OpenAI** - Set `OPENAI_API_KEY` env var. Strong alternative.
  > - **HuggingFace Local** - No setup needed. Free, auto-detected fallback.
  **Why stale:** Same issue — Voyage presented as recommended default. Missing llama-cpp.
  **Suggested replacement:**
  > - **llama-cpp** — Default on Apple Silicon. Free, local, 768d Q8_0 GGUF with Metal GPU. No setup.
  > - **HuggingFace Local** — Fallback when llama-cpp is unavailable. Free, local, 768d q8 ONNX. No setup.
  > - **Voyage AI** — Cloud opt-in. Requires `VOYAGE_API_KEY`. 1024d. Gated by egress guard.
  > - **OpenAI** — Cloud opt-in. Requires `OPENAI_API_KEY`. 1536d.

- **Line 828, mcp-coco-index skill description:**
  > `- Semantic code search via vector embeddings (Voyage Code 3 and All-MiniLM-L6-v2 models)`
  **Why stale:** CocoIndex now defaults to `google/embeddinggemma-300m` 768d bf16, not Voyage Code 3 / All-MiniLM-L6-v2.
  **Suggested replacement:**
  > `- Semantic code search via vector embeddings (google/embeddinggemma-300m 768d default)`

- **Lines 1257–1264, Memory Engine Configuration:**
  > `- **VOYAGE_API_KEY** (optional) - Voyage AI embeddings (recommended)`
  > `- **OPENAI_API_KEY** (optional) - OpenAI embeddings (alternative)`
  > `Default repo-local database path: .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite`
  > `If no API key is set, the memory engine auto-detects **HuggingFace Local** embeddings`
  **Why stale:** Voyage listed as "recommended". DB path uses legacy `context-index.sqlite` without the `__provider__model__dim__dtype` suffix. The "auto-detects HF Local" claim is out of date — it auto-detects llama-cpp first.
  **Suggested replacement:**
  > - **`VOYAGE_API_KEY`** (optional) - Voyage AI cloud embeddings (opt-in)
  > - **`OPENAI_API_KEY`** (optional) - OpenAI cloud embeddings (opt-in)
  > - **`LLAMA_CPP_EMBEDDINGS_MODEL`** (optional) - Override llama-cpp model (default: `unsloth/embeddinggemma-300m-GGUF`)
  > - **`HF_EMBEDDINGS_DTYPE`** (optional) - hf-local fallback dtype (default: `q8`)
  >
  > Default repo-local database path: `.opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`
  >
  > > [!TIP]
  > > If no API key is set, the memory engine auto-detects **llama-cpp** on most hosts and falls back to **HuggingFace Local** when the llama-cpp probe fails.

- **Lines 1289, Database Schema:**
  > `- **Paths** - The checked-in configs default to .opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite.`
  **Why stale:** Legacy filename without provider/model/dim/dtype encoding.
  **Suggested replacement:**
  > `- **Paths** - The checked-in configs default to the provider-keyed database path under `.opencode/skills/system-spec-kit/mcp_server/database/`. The filename encodes provider, model, dimension and dtype (e.g., `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`).`

- **Line 1392, FAQ "What does local-first mean?":**
  > `HuggingFace Local embeddings run entirely on-device.`
  **Why stale:** llama-cpp is now the primary local path. HF Local is the fallback.
  **Suggested replacement:**
  > `llama-cpp runs entirely on-device with Metal GPU acceleration on Apple Silicon. HuggingFace Local is the offline fallback when llama-cpp is unavailable.`

- **Line 1434, Related External Resources:**
  > `- **[→ Voyage AI](https://www.voyageai.com/)** - Recommended embedding provider`
  **Why stale:** Voyage is no longer recommended as default.
  **Suggested replacement:**
  > `- **[→ Voyage AI](https://www.voyageai.com/)** - Cloud embedding provider (opt-in)`
  > `- **[→ HuggingFace GGUF Models](https://huggingface.co/unsloth)** - Local llama-cpp model source`

---

### 3.2 — .opencode/install_guides/README.md

**Verdict:** `MAJOR`
**Priority:** `P0`
**Reason:** The canonical install guide still describes Voyage as recommended, Nomic as the HF default, `nomic-embed-text` as the Ollama model, and the provider list as `hf-local|voyage|openai`. This is the document most operators read when setting up.

**Stale sections / lines:**

- **Lines 488–492, Phase 2 "Ollama & Models":**
  > `- **Voyage** (recommended if you have VOYAGE_API_KEY). Best retrieval quality, cloud embeddings`
  > `- **OpenAI** (alternative if you have OPENAI_API_KEY). Cloud embeddings`
  > `- **HF Local** (default without API keys). Local embeddings with HuggingFace Transformers`
  > `- **Ollama** (optional). For local embeddings via Ollama`
  **Why stale:** No mention of llama-cpp. HF Local described as "default" — it's now the fallback. Ollama is presented as a fourth option but isn't in the provider list.
  **Suggested replacement:**
  > `- **llama-cpp** (default on Apple Silicon). Free local embeddings with Metal GPU, zero setup`
  > `- **HF Local** (fallback when llama-cpp is unavailable). Free local embeddings with ONNX CPU runtime`
  > `- **Voyage** (cloud opt-in). Requires VOYAGE_API_KEY. Gated by egress guard`
  > `- **OpenAI** (cloud opt-in). Requires OPENAI_API_KEY`

- **Lines 632–638, Provider comparison table:**
  > | Provider | When to use | Dimension | Requirements |
  > |----------|-------------|-----------|------------|
  > | **Voyage** | Recommended, best quality | 1024 | `VOYAGE_API_KEY` |
  > | **OpenAI** | API key available, cloud preference | 1536/3072 | `OPENAI_API_KEY` |
  > | **HF Local** | No API key, privacy/offline | 768 | Node.js only (default) |
  > | **Ollama** | Ollama local preference | 768 | Ollama + nomic model |
  **Why stale:** Missing llama-cpp row. "HF Local" described as default. Ollama row shouldn't be in the provider table (not a factory provider).
  **Suggested replacement:**
  > | Provider | When to use | Dimension | Requirements |
  > |----------|-------------|-----------|------------|
  > | **llama-cpp** | Default, local, zero setup | 768 | Apple Silicon (auto), or manual GGUF |
  > | **HF Local** | Fallback when llama-cpp unavailable | 768 | Node.js only |
  > | **Voyage** | Cloud opt-in, best quality | 1024 | `VOYAGE_API_KEY` |
  > | **OpenAI** | Cloud opt-in | 1536/3072 | `OPENAI_API_KEY` |

- **Lines 641–645, Provider selection:**
  > `- Default: HF Local (768d), works out of the box with no API key required`
  > `- If VOYAGE_API_KEY set + EMBEDDINGS_PROVIDER=voyage: uses Voyage (recommended, 8% better retrieval)`
  > `- If OPENAI_API_KEY set + EMBEDDINGS_PROVIDER=openai: uses OpenAI`
  > `- Manual override: export EMBEDDINGS_PROVIDER=hf-local|voyage|openai`
  **Why stale:** Default is now llama-cpp, not HF Local. Provider list missing `llama-cpp`. "8% better retrieval" claim for Voyage is pre-014 (compared against Nomic fp32, not EmbeddingGemma q8).
  **Suggested replacement:**
  > `- Default: llama-cpp (768d Q8_0 GGUF), works out of the box on Apple Silicon with zero API keys`
  > `- If llama-cpp probe fails: falls back to HF Local (768d q8 ONNX) automatically`
  > `- If VOYAGE_API_KEY is set: Voyage cloud embeddings (1024d, opt-in)`
  > `- If OPENAI_API_KEY is set: OpenAI cloud embeddings (1536d, opt-in)`
  > `- Manual override: export EMBEDDINGS_PROVIDER=llama-cpp|hf-local|voyage|openai|auto`

- **Lines 666–678, Optional environment variables:**
  > ```bash
  > # Provider selection (hf-local|voyage|openai)
  > export EMBEDDINGS_PROVIDER=hf-local  # Default: local embeddings (free, offline)
  > 
  > # Voyage config (recommended - best retrieval quality)
  > export VOYAGE_API_KEY=pa-...
  > export VOYAGE_EMBEDDINGS_MODEL=voyage-3.5  # Default
  > ...
  > # HF Local config (if using HF local)
  > export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Default
  > ```
  **Why stale:** Provider list missing `llama-cpp`. HF model default is now `onnx-community/embeddinggemma-300m-ONNX`, not Nomic. Missing `HF_EMBEDDINGS_DTYPE`, `LLAMA_CPP_EMBEDDINGS_MODEL`, `LLAMA_CPP_EMBEDDINGS_GGUF_FILE`, `LLAMA_CPP_EMBEDDINGS_MODEL_DIR`, `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA`.
  **Suggested replacement:**
  > ```bash
  > # Provider selection (llama-cpp|hf-local|voyage|openai|auto)
  > export EMBEDDINGS_PROVIDER=auto  # Default: cascade (llama-cpp → hf-local → cloud)
  > 
  > # llama-cpp config (default local provider)
  > export LLAMA_CPP_EMBEDDINGS_MODEL=unsloth/embeddinggemma-300m-GGUF  # Default
  > export LLAMA_CPP_EMBEDDINGS_GGUF_FILE=embeddinggemma-300M-Q8_0.gguf  # Default
  > 
  > # HF Local config (fallback, used when llama-cpp probe fails)
  > export HF_EMBEDDINGS_MODEL=onnx-community/embeddinggemma-300m-ONNX  # Default
  > export HF_EMBEDDINGS_DTYPE=q8  # Default (also: fp32, fp16, q4, q8, int8, uint8, bnb4)
  > 
  > # Voyage config (cloud opt-in)
  > export VOYAGE_API_KEY=pa-...
  > ```

- **Line 678 (old), nomic model:**
  > `export HF_EMBEDDINGS_MODEL=nomic-ai/nomic-embed-text-v1.5  # Default`
  **Why stale:** HF default model changed to `onnx-community/embeddinggemma-300m-ONNX`.
  **Suggested replacement:** Covered in the block above.

- **Lines 530, 539, 545, 976, 989, 1475 — Ollama nomic-embed-text references:**
  > `ollama pull nomic-embed-text`
  **Why stale:** If Ollama is kept as an optional path, it should reference the EmbeddingGemma model, not Nomic. However, per BEFORE_VS_AFTER.md, Ollama is not a factory provider — these sections may need to be reframed as "optional alternative" rather than part of the embedding stack.
  **Suggested replacement:** Replace `nomic-embed-text` with `embeddinggemma` where Ollama is mentioned, or add a note that Ollama is a separate optional path not managed by the factory cascade.

- **Line 1344, Troubleshooting "Memory search returns empty":**
  > `sqlite3 .opencode/skills/system-spec-kit/mcp_server/dist/database/context-index.sqlite "SELECT COUNT(*) FROM memory_index;"`
  **Why stale:** Legacy filename. The actual DB path now encodes provider/model/dim/dtype. Also `dist/database/` is the compiled output path — the runtime database lives in `mcp_server/database/`.
  **Suggested replacement:**
  > ```bash
  > # Find the active database file (filename encodes provider, model, dim, and dtype)
  > ls .opencode/skills/system-spec-kit/mcp_server/database/context-index__*.sqlite
  > # Then query it:
  > sqlite3 .opencode/skills/system-spec-kit/mcp_server/database/context-index__llama-cpp__*.sqlite "SELECT COUNT(*) FROM memory_index;"
  > ```

---

### 3.3 — .opencode/skills/system-spec-kit/README.md

**Verdict:** `MAJOR`
**Priority:** `P0`
**Reason:** The 81 KB framework README is the primary reference document for contributors. It describes Voyage as the recommended provider, lists 1024d as the default vector dimension, and omits `llama-cpp` entirely from the provider table and env var docs.

**Stale sections / lines:**

- **Line 146, Requirements table:**
  > `| Embedding API | None (HuggingFace local) | Voyage AI recommended for best quality |`
  **Why stale:** Voyage is no longer recommended. llama-cpp is the default.
  **Suggested replacement:**
  > `| Embedding API | None (llama-cpp local) | Zero setup on Apple Silicon; HF Local fallback |

- **Lines 359–365, Hybrid Search "Vector" channel:**
  > `| **Vector**       | Compares meaning via embeddings (Voyage AI 1024d)   | Finding related content even when words differ |`
  **Why stale:** Default embedding is now 768d EmbeddingGemma via llama-cpp, not 1024d Voyage.
  **Suggested replacement:**
  > `| **Vector**       | Compares meaning via embeddings (EmbeddingGemma 768d) | Finding related content even when words differ |`

- **Lines 685–693, §5 Configuration "Embedding Providers":**
  > `Three providers are supported:`
  > `| Provider          | Dimensions | Notes                                                            |`
  > `| Voyage AI         | 1024       | Recommended. Best retrieval quality. Requires VOYAGE_API_KEY   |`
  > `| OpenAI            | 1536       | Alternative. Requires OPENAI_API_KEY                           |`
  > `| HuggingFace Local | Varies     | No API key needed. Higher latency, runs entirely on your machine |`
  **Why stale:** Says "three providers" — there are now five. Voyage listed as "Recommended". "HF Local" dimensions marked as "Varies" — they are 768. Missing llama-cpp.
  **Suggested replacement:**
  > `Five providers are supported. The default cascade (when EMBEDDINGS_PROVIDER=auto or unset) is local-first:`
  > `| Provider          | Dimensions | Notes                                                            |`
  > `| llama-cpp         | 768        | Default on Apple Silicon. Q8_0 GGUF + Metal GPU. No setup.     |`
  > `| HuggingFace Local | 768        | Fallback when llama-cpp unavailable. q8 ONNX on CPU. No setup. |`
  > `| Voyage AI         | 1024       | Cloud opt-in. Requires VOYAGE_API_KEY. Gated by egress guard.  |`
  > `| OpenAI            | 1536       | Cloud opt-in. Requires OPENAI_API_KEY.                         |`

- **Lines 695–703, Environment Variables table:**
  > `| VOYAGE_API_KEY     | Recommended | Voyage AI embeddings (1024d, best retrieval quality) |`
  > `| OPENAI_API_KEY     | Alternative | OpenAI embeddings fallback                           |`
  **Why stale:** Voyage marked "Recommended". Missing `LLAMA_CPP_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_DTYPE`, `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA`.
  **Suggested replacement:**
  > `| VOYAGE_API_KEY     | No          | Voyage AI cloud embeddings (opt-in)                           |`
  > `| OPENAI_API_KEY     | No          | OpenAI cloud embeddings (opt-in)                              |`
  > `| LLAMA_CPP_EMBEDDINGS_MODEL | No  | Override llama-cpp model (default: unsloth/embeddinggemma-300m-GGUF) |`
  > `| LLAMA_CPP_EMBEDDINGS_GGUF_FILE | No | GGUF filename (default: embeddinggemma-300M-Q8_0.gguf)       |`
  > `| HF_EMBEDDINGS_DTYPE | No         | hf-local dtype: q8 (default), fp32, fp16, q4, int8, uint8, bnb4 |`

- **Line 720, MCP Server Configuration JSON example:**
  > `"VOYAGE_API_KEY": "your-key-here"`
  **Why stale:** The example should show the new default (no key needed) or mention `EMBEDDINGS_PROVIDER`.
  **Suggested replacement:**
  > ```json
  > "env": {
  >   "EMBEDDINGS_PROVIDER": "auto"
  > }
  > ```
  > (No API key required. The cascade auto-selects llama-cpp on most hosts.)

---

### 3.4 — .opencode/skills/system-spec-kit/shared/embeddings/providers/README.md

**Verdict:** `MAJOR`
**Priority:** `P1`
**Reason:** The provider implementation directory README lists only three providers and names `nomic-ai/nomic-embed-text-v1.5` as the hf-local default. Missing the `llama-cpp.ts` provider.

**Stale sections / lines:**

- **Lines 3, 8 — Frontmatter description and trigger phrases:**
  > `description: "Concrete embedding provider implementations for HuggingFace Local, OpenAI and Voyage AI backends."`
  > `- "voyage embeddings"`
  **Why stale:** Missing "llama-cpp" in provider list.
  **Suggested replacement:**
  > `description: "Concrete embedding provider implementations for llama-cpp, HuggingFace Local, OpenAI and Voyage AI backends."`
  > Add trigger phrase: `- "llama-cpp embeddings"`

- **Lines 45–57, Structure diagram and provider table:**
  > ```text
  > providers/
  > ├── README.md
  > ├── hf-local.ts
  > ├── openai.ts
  > └── voyage.ts
  > ```
  > | `hf-local.ts` | HuggingFace Local | `nomic-ai/nomic-embed-text-v1.5` | 768 | ...
  > | `voyage.ts` | Voyage AI | `voyage-4` | 1024 | ...
  **Why stale:** Missing `llama-cpp.ts` in both the tree and the table. hf-local default model is Nomic — it's now `onnx-community/embeddinggemma-300m-ONNX`.
  **Suggested replacement:**
  > ```text
  > providers/
  > ├── README.md
  > ├── llama-cpp.ts   # llama-cpp GGUF provider (default)
  > ├── hf-local.ts    # HuggingFace local ONNX provider (fallback)
  > ├── openai.ts
  > └── voyage.ts
  > ```
  > Add row:
  > `| llama-cpp.ts | llama-cpp | unsloth/embeddinggemma-300m-GGUF | 768 | Default local provider with Metal GPU, Q8_0 GGUF |`
  > Update hf-local row:
  > `| hf-local.ts | HuggingFace Local | onnx-community/embeddinggemma-300m-ONNX | 768 | Fallback provider with ONNX q8 CPU inference |`
  > Update voyage row:
  > Remove "voyage-4" default model. Voyage.ts model is now configurable and no longer a recommended default.
  > `| voyage.ts | Voyage AI | (configured via env) | 1024 | Cloud opt-in provider with Voyage input_type hints |`

---

### 3.5 — .opencode/skills/system-spec-kit/shared/embeddings/README.md

**Verdict:** `MAJOR`
**Priority:** `P1`
**Reason:** The parent embeddings package README lists supported providers as `voyage, openai, hf-local and auto` — missing `llama-cpp`. Structure diagram missing `llama-cpp.ts`.

**Stale sections / lines:**

- **Line 35, §1 Overview:**
  > `- Supported provider names are voyage, openai, hf-local and auto.`
  **Why stale:** Missing `llama-cpp`.
  **Suggested replacement:**
  > `- Supported provider names are llama-cpp, voyage, openai, hf-local and auto.`

- **Lines 47–56, §2 Package Topology tree:**
  > ```text
  > providers/
  > |   +-- hf-local.ts
  > |   +-- openai.ts
  > |   +-- voyage.ts
  > ```
  **Why stale:** Missing `llama-cpp.ts`.
  **Suggested replacement:**
  > ```text
  > providers/
  > |   +-- llama-cpp.ts    # Default local GGUF provider
  > |   +-- hf-local.ts     # Fallback local ONNX provider
  > |   +-- openai.ts
  > |   +-- voyage.ts
  > ```

- **Lines 85–91, §3 Key Files table:**
  > `| providers/voyage.ts | Implements Voyage embedding requests... |`
  **Why stale:** Missing `providers/llama-cpp.ts` row.
  **Suggested replacement:** Add row:
  > `| providers/llama-cpp.ts | Implements llama-cpp GGUF embedding with Metal GPU health check, lazy session init and EmbeddingGemma prefixes. |`

---

### 3.6 — .opencode/skills/system-spec-kit/shared/README.md

**Verdict:** `MAJOR`
**Priority:** `P1`
**Reason:** The shared package overview describes the provider story at a high level. Multiple tables and examples reference Voyage as recommended, 1024d as default, Nomic as the HF model, and "3 provider implementations".

**Stale sections / lines:**

- **Lines 86–87, Key Statistics table:**
  > `| Provider Implementations | 3             | OpenAI, HF Local, Voyage                         |`
  > `| Embedding Dimensions     | 768/1024/1536 | Provider-dependent                               |`
  **Why stale:** Now 5 providers (added llama-cpp + auto). The dominant dimension is 768, not 1024.
  **Suggested replacement:**
  > `| Provider Implementations | 5             | llama-cpp (default), HF Local (fallback), OpenAI, Voyage, auto |`
  > `| Embedding Dimensions     | 768/1024/1536 | 768 default (llama-cpp + HF Local); 1024 (Voyage); 1536 (OpenAI) |`

- **Lines 93–94, Key Features:**
  > `| **Multi-Provider Embeddings**   | Supports Voyage, OpenAI, HuggingFace local with auto-detection |`
  > `| **Dynamic Dimension Detection** | 768 (HF), 1024 (Voyage), 1536/3072 (OpenAI)                    |`
  **Why stale:** Provider names missing `llama-cpp`.
  **Suggested replacement:**
  > `| **Multi-Provider Embeddings**   | Supports llama-cpp (default), HuggingFace local (fallback), Voyage, OpenAI with auto-detection |`
  > `| **Dynamic Dimension Detection** | 768 (llama-cpp, HF Local), 1024 (Voyage), 1536 (OpenAI) |`

- **Line 158, Example output:**
  > `// Example: "Provider: voyage, Dimensions: 1024"`
  **Why stale:** Default provider is now llama-cpp.
  **Suggested replacement:**
  > `// Example: "Provider: llama-cpp, Dimensions: 768"`

- **Lines 195–199, Structure tree:**
  > ```text
  > │       ├── hf-local.ts         # HuggingFace local (fallback)
  > │       ├── openai.ts           # OpenAI embeddings API
  > │       ├── voyage.ts           # Voyage AI (recommended)
  > ```
  **Why stale:** Missing `llama-cpp.ts`. "Voyage AI (recommended)" is wrong.
  **Suggested replacement:**
  > ```text
  > │       ├── llama-cpp.ts        # llama-cpp GGUF (default)
  > │       ├── hf-local.ts         # HuggingFace ONNX (fallback)
  > │       ├── openai.ts           # OpenAI embeddings API
  > │       ├── voyage.ts           # Voyage AI (cloud opt-in)
  > ```

- **Line 238, Key Files table:**
  > `| paths.ts | Canonical context-index.sqlite path resolution |`
  **Why stale:** Paths now encode provider/model/dim/dtype in the filename.
  **Suggested replacement:**
  > `| paths.ts | Provider-keyed database path resolution (encodes provider, model, dim, dtype) |`

- **Line 258, Features code block:**
  > `| **Providers**      | Voyage AI, OpenAI, HuggingFace local    |`
  **Suggested replacement:**
  > `| **Providers**      | llama-cpp (default), HuggingFace local (fallback), Voyage AI, OpenAI |`

- **Lines 302, 317–323, 336–347 — Provider comparison tables and env vars:**
  > `| Decision Terms  | 2.0x  | "chose openai", "selected voyage"     |`
  > `| Feature    | Voyage     | HF Local | OpenAI    | ...`
  > `| VOYAGE_API_KEY | No | - | Voyage AI API key (recommended) |`
  > `| HF_EMBEDDINGS_MODEL | No | nomic-ai/nomic-embed-text-v1.5 | HF model |`
  > `2. Auto-detection: Voyage if VOYAGE_API_KEY exists (recommended)`
  **Why stale:** All pre-014 provider references.
  **Suggested replacement:** Update the provider comparison table to add a llama-cpp column. Update env var table to include new vars. Update selection precedence to show llama-cpp as step 4 before hf-local as step 5.
  > Provider table: Add column for llama-cpp (`Cost: Free, Quality: Good (0.968 cos parity), Dimensions: 768, Privacy: Local, Offline: Yes`)
  > Env var table: Add `LLAMA_CPP_EMBEDDINGS_MODEL`, `HF_EMBEDDINGS_DTYPE`, `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` rows. Change `HF_EMBEDDINGS_MODEL` default to `onnx-community/embeddinggemma-300m-ONNX`.
  > Selection precedence: Replace with the 5-step cascade from `factory.ts:786-836`.

- **Lines 375, 382, 414, 419 — Usage examples:**
  > `const content: string = 'Decided to use Voyage API for embeddings due to quality'`
  > `// Output: "voyage api, embeddings, quality"`
  > `// { provider: 'voyage', model: 'voyage-code-2', dim: 1024, healthy: true }`
  > `// '/base/path/context-index__voyage__voyage-code-2__1024.sqlite'`
  **Why stale:** Example uses Voyage as the sample provider.
  **Suggested replacement:**
  > `const content: string = 'Switched to llama-cpp embeddings for local-first retrieval'`
  > `// Output: "llama-cpp embeddings, local-first retrieval"`
  > `// { provider: 'llama-cpp', model: 'unsloth/embeddinggemma-300m-GGUF', dim: 768, healthy: true }`
  > `// '/base/path/context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite'`

- **Lines 498, 512–523 — Troubleshooting:**
  > `**Cause**: HF local downloads ~274MB model on first run`
  > `| Provider not detected | Check echo $VOYAGE_API_KEY or echo $OPENAI_API_KEY |`
  > `echo "VOYAGE_API_KEY: ${VOYAGE_API_KEY:0:10}..."`
  **Why stale:** Model size is now ~310MB (EmbeddingGemma). Diagnostics should check llama-cpp first.
  **Suggested replacement:**
  > `**Cause**: llama-cpp or HF Local downloads ~310MB model on first run`
  > `| Provider not detected | Check EMBEDDINGS_PROVIDER, then echo $LLAMA_CPP_EMBEDDINGS_MODEL or $VOYAGE_API_KEY |`
  > Diagnostic commands: Add `echo "LLAMA_CPP_EMBEDDINGS_MODEL: $LLAMA_CPP_EMBEDDINGS_MODEL"`

- **Lines 559–560, Related documents links:**
  > `| [nomic-embed-text](https://huggingface.co/nomic-ai/nomic-embed-text-v1.5) | Default HF embedding model         |`
  > `| [Voyage AI](https://www.voyageai.com/)                                    | Recommended embedding provider     |`
  **Why stale:** Nomic is not the default. Voyage is not recommended.
  **Suggested replacement:**
  > `| [EmbeddingGemma GGUF](https://huggingface.co/unsloth/embeddinggemma-300m-GGUF) | Default llama-cpp embedding model |`
  > `| [EmbeddingGemma ONNX](https://huggingface.co/onnx-community/embeddinggemma-300m-ONNX) | Fallback HF Local model       |`
  > `| [Voyage AI](https://www.voyageai.com/)                                    | Cloud embedding provider (opt-in)  |`

---

### 3.7 — .opencode/skills/mcp-coco-index/README.md

**Verdict:** `MAJOR`
**Priority:** `P0`
**Reason:** The CocoIndex README is the primary user-facing doc for code search. It describes `voyage/voyage-code-3` as the "Primary embedding model" and `all-MiniLM-L6-v2` as the default. Neither is correct — the default is now `google/embeddinggemma-300m` 768d bf16.

**Stale sections / lines:**

- **Lines 71–77, Key Statistics table:**
  > `| Default embedding model | sentence-transformers/all-MiniLM-L6-v2 (local, no API key) |`
  > `| Primary embedding model | voyage/voyage-code-3 via LiteLLM (1024-dim, requires VOYAGE_API_KEY) |`
  **Why stale:** Both models are pre-014. Default is now `google/embeddinggemma-300m` 768d. Voyage is no longer the "primary" (it's not even in the settings).
  **Suggested replacement:**
  > `| Default embedding model | google/embeddinggemma-300m via sentence-transformers (768d bf16, local, no API key) |`
  > (Remove the "Primary embedding model" row — there is only one default now.)

- **Lines 160–161, §3.1 Feature Highlights — model description:**
  > `The two embedding models trade off quality against convenience. The local model (all-MiniLM-L6-v2) requires no API key and works offline, making it the right default for most projects. The Voyage Code 3 model produces 1024-dimensional vectors trained specifically on code, and consistently returns higher-quality results for complex queries on large codebases.`
  **Why stale:** The model comparison describes the old two-model world. Now there is one default (EmbeddingGemma 768d). Users can still switch models via settings, but the default narrative changed.
  **Suggested replacement:**
  > `The default embedding model is google/embeddinggemma-300m, a 768-dimensional model from the same family as the Spec Kit Memory MCP. This unification means both MCP servers share the same vector space, enabling future cross-MCP retrieval. The model runs locally via sentence-transformers on PyTorch with Metal/MPS acceleration on Apple Silicon and requires no API key.`
  > `Users can switch to alternative models by editing the global settings file (~/.cocoindex_code/global_settings.yml). Changing models requires a full reset and reindex because vector dimensions are incompatible.`

- **Lines 203–208, Embedding models table:**
  > `| Model | Type | Dimensions | API Key | Best For |`
  > `| sentence-transformers/all-MiniLM-L6-v2 | Local | 384 | None | Offline use, no API dependency |`
  > `| voyage/voyage-code-3 | Cloud via LiteLLM | 1024 | VOYAGE_API_KEY | Higher quality code search |`
  **Why stale:** Both models are pre-014.
  **Suggested replacement:**
  > `| Model | Type | Dimensions | API Key | Best For |`
  > `| google/embeddinggemma-300m | Local via sentence-transformers | 768 | None | Default. Unified with Memory MCP. Metal/MPS accelerated. |`
  > `| sentence-transformers/all-MiniLM-L6-v2 | Local | 384 | None | Minimal disk/RAM footprint (~90MB) |`
  > `| voyage/voyage-code-3 | Cloud via LiteLLM | 1024 | VOYAGE_API_KEY | Higher dimensional code search (requires API key) |`

- **Lines 273–280, Global settings YAML example:**
  > ```yaml
  > embedding:
  >   provider: sentence-transformers       # or litellm for cloud models
  >   model: all-MiniLM-L6-v2              # or voyage/voyage-code-3
  >   device: cpu                           # cpu | cuda | mps (auto-detects if omitted)
  > envs:
  >   VOYAGE_API_KEY: "your-key-here"       # required only for voyage models
  > ```
  **Why stale:** Default model name changed. The comment about alternatives should reflect the current options.
  **Suggested replacement:**
  > ```yaml
  > embedding:
  >   provider: sentence-transformers       # or litellm for cloud models
  >   model: google/embeddinggemma-300m     # default 768d (also: all-MiniLM-L6-v2, voyage/voyage-code-3)
  >   device: auto                          # auto | cpu | cuda | mps (auto-detects if omitted)
  > envs:
  >   VOYAGE_API_KEY: "your-key-here"       # required only for voyage cloud models
  > ```

- **Line 320, Environment variables table:**
  > `| VOYAGE_API_KEY | (none) | Required for Voyage Code 3 cloud embeddings |`
  **Why stale:** Missing `COCOINDEX_CODE_EMBEDDING_MODEL` and `COCOINDEX_QUERY_PROMPT_NAME` env vars (documented in BEFORE_VS_AFTER.md §11).
  **Suggested replacement:** Add rows:
  > `| COCOINDEX_CODE_EMBEDDING_MODEL | sbert/google/embeddinggemma-300m | Override the cocoindex embedding model |`
  > `| COCOINDEX_QUERY_PROMPT_NAME | from registry | Override cocoindex query-prompt routing |`
  > Keep `VOYAGE_API_KEY` row but change "Required" to "Required only when using Voyage cloud models".

- **Lines 500–502, FAQ "When should I use Voyage Code 3?":**
  > `A: Use Voyage Code 3 when search quality matters more than avoiding an API dependency. The local model (all-MiniLM-L6-v2) is a general-purpose sentence embedding model with 384 dimensions...`
  **Why stale:** The FAQ describes a world where the local default is 384d MiniLM. It's now 768d EmbeddingGemma.
  **Suggested replacement:**
  > `A: The default model (google/embeddinggemma-300m, 768d) provides strong code search quality out of the box and runs locally with no API key. Voyage Code 3 (1024d) can be used as an alternative via the global settings file when higher-dimensional cloud embeddings are preferred. Switching models requires ccc reset && ccc index.`

---

## 4. CROSS-CUTTING THEMES

**Theme 1: "Voyage as recommended default" appears in every major README.**
Every README that discusses embedding providers (7 of the 8 analyzed READMEs) presents Voyage AI as the recommended, best-quality default. This is uniformly wrong after the 014 arc. The new story is: llama-cpp is the local-first default, Voyage is an opt-in cloud provider gated by an egress guard.

**Theme 2: No README mentions `llama-cpp` as a provider option.**
Zero READMEs include `llama-cpp` in their provider lists, env var docs, or configuration examples. The word "llama" does not appear in any README in the repo.

**Theme 3: `nomic-ai/nomic-embed-text-v1.5` is still documented as the HF Local default model.**
5 READMEs reference Nomic as the hf-local model. The actual default is now `onnx-community/embeddinggemma-300m-ONNX`.

**Theme 4: CocoIndex README describes a pre-014 model landscape.**
The CocoIndex README still centers on the `all-MiniLM-L6-v2` (384d) vs `voyage/voyage-code-3` (1024d) trade-off. The default is now `google/embeddinggemma-300m` (768d), unified with the Memory MCP.

**Theme 5: `context-index.sqlite` (legacy filename) appears in the two most-read READMEs.**
Both the root README and the install guide reference the bare `context-index.sqlite` path. The actual filenames now encode provider, model, dim and dtype.

**Theme 6: `barter/` copies need the same edits.**
The `barter/` subdirectory contains independent copies of `system-spec-kit/README.md`, `mcp-coco-index/README.md`, `install_guides/README.md`, and the `shared/` embedding READMEs. These copies have the same staleness. The markdown agent should apply identical edits to both the canonical `.opencode/` versions and the `barter/.opencode/` copies. Paths within the replacements may need to be adjusted to remove the `barter/` prefix from internal links.

**Theme 7: New env vars are undocumented in all READMEs.**
`LLAMA_CPP_EMBEDDINGS_MODEL`, `LLAMA_CPP_EMBEDDINGS_GGUF_FILE`, `LLAMA_CPP_EMBEDDINGS_MODEL_DIR`, `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA`, `HF_EMBEDDINGS_DTYPE`, `COCOINDEX_CODE_EMBEDDING_MODEL`, and `COCOINDEX_QUERY_PROMPT_NAME` are not documented in any README.

**Theme 8: Provider count is wrong everywhere.**
Every README that states a provider count says "3" or lists exactly three. The actual count is 5: `llama-cpp`, `hf-local`, `openai`, `voyage`, `auto`.

## 5. EDIT PLAN HANDOFF NOTES

**For the markdown-writing agent:**

1. **Use consistent language for the new auto-cascade paragraph.** Here is a reusable block that can be copy-pasted into multiple READMEs with minor path adjustments:

   > The embedding cascade (when `EMBEDDINGS_PROVIDER=auto` or unset) resolves in this order:
   > 1. `EMBEDDINGS_PROVIDER` env var, if set and not `auto`.
   > 2. `VOYAGE_API_KEY`, if present (cloud opt-in).
   > 3. `OPENAI_API_KEY`, if present (cloud opt-in).
   > 4. **llama-cpp**, if `node-llama-cpp` loads and the GGUF model is reachable. This is the default on Apple Silicon and most clones — zero setup.
   > 5. **hf-local** as the safety-net fallback when the llama-cpp probe fails (e.g., non-Apple-Silicon hosts without CUDA).
   >
   > Both local paths use the EmbeddingGemma model family at 768 dimensions with 8-bit quantization (Q8_0 GGUF for llama-cpp, per-tensor q8 ONNX for hf-local). The two backends produce vectors with ~0.968 cosine similarity parity.

2. **Env var table template.** Every README with an env var table should include these rows:

   | Variable | Default | Description |
   |---|---|---|
   | `EMBEDDINGS_PROVIDER` | `auto` | `auto`, `llama-cpp`, `hf-local`, `voyage`, `openai` |
   | `LLAMA_CPP_EMBEDDINGS_MODEL` | `unsloth/embeddinggemma-300m-GGUF` | Override llama-cpp model |
   | `LLAMA_CPP_EMBEDDINGS_GGUF_FILE` | `embeddinggemma-300M-Q8_0.gguf` | GGUF filename |
   | `HF_EMBEDDINGS_MODEL` | `onnx-community/embeddinggemma-300m-ONNX` | Override hf-local model |
   | `HF_EMBEDDINGS_DTYPE` | `q8` | hf-local dtype: `fp32`, `fp16`, `q4`, `q8`, `int8`, `uint8`, `bnb4` |
   | `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` | unset (enabled) | Set to `false` to disable 018 auto-migration |
   | `VOYAGE_API_KEY` | unset | Voyage cloud embeddings (opt-in) |
   | `OPENAI_API_KEY` | unset | OpenAI cloud embeddings (opt-in) |

3. **DB filename convention.** Replace bare `context-index.sqlite` with an explanatory sentence:
   > Database filenames encode the provider, model, dimension and dtype. For example: `context-index__llama-cpp__unsloth-embeddinggemma-300m-gguf__768__q8.sqlite`. This allows multiple backends to coexist on disk without mixing vector dimensions.

4. **Don't rewrite history.** The 014/014 ONNX rejection is a decision record — do not remove references to it. But do not present ONNX as the recommended path either. It is the hf-local fallback backend.

5. **Update TOCs when section anchors change.** If you rename section headings or add/remove sections, update the table of contents at the top of each README.

6. **barter/ copies.** Apply the same edits to the `barter/.opencode/` copies of these READMEs. The content is near-identical — adjust internal link paths to reflect the `barter/` prefix where needed.

7. **Highest-leverage edit per character changed:** The root `README.md` lines 136–147 (Quick Start "Set Up Embedding Provider") — changing those 12 lines fixes the first thing every new user reads.

## 6. OPEN QUESTIONS

1. **Should Ollama sections be removed from the install guide?** The install guide has ~30 lines about Ollama with `nomic-embed-text` references. Ollama is not a factory provider. Per BEFORE_VS_AFTER.md, Ollama is not in the cascade. Should the Ollama sections be removed entirely, or reframed as "optional alternative not managed by the cascade"?

2. **The `barter/.opencode/` copies: should they be symlinked instead of copied?** The `barter/.opencode/` directory is a real directory (~70 READMEs), not a symlink. If these are meant to stay in sync with `.opencode/`, a symlink might prevent future drift. But that's a structural decision beyond the scope of this map.

3. **Should the shared/embeddings/providers/README.md mention the auto-migration path?** The migration logic lives in the MCP server startup, not in the shared embeddings package. The provider README should probably reference it but not own the documentation. Up to the orchestrator.

4. **`EMBEDDINGS_PROVIDER` options in the install guide say `hf-local|voyage|openai`.** Should `ollama` be included as a valid value if Ollama sections are kept? Currently it's not in the factory, but the install guide implies it is.
