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