# 021/002 README Refresh — Diff Summary

## README existed?

Yes. 1513 LOC pre-edit, 1520 LOC post-edit. Net delta: **+7 LOC** (added 20, removed 13). Surgical, well within the under-100 LOC budget.

## Sections touched

| Location | Change |
|---|---|
| `## 1. OVERVIEW` → ASCII connection diagram (line 122) | Replaced `llama-cpp │ HF Local │ OpenAI │ Voyage` with `jina-v3 (Ollama) │ HF Local │ Voyage` |
| `## 1. OVERVIEW` → new subsection (after "What's Shipped Recently", before `</ANCHOR:overview>`) | **Added** new `### Embedder Architecture` paragraph covering both MCPs' defaults, pluggability, ADR-011 rescue toggle, MPS auto-detect, and cross-links to the canonical narrative + CocoIndex INSTALL_GUIDE |
| `## 2. QUICK START` → "Set Up Embedding Provider" (lines 165-181) | Replaced llama-cpp/GGUF default note with jina-v3 + Ollama HTTP + `ollama pull` instruction; reworded HF fallback note to reference Ollama probe |
| `### MEMORY ENGINE` → "Embedding Providers" subsection (line 555) | Replaced 4-bullet list: added pluggability framing + canonical-narrative link; Ollama (jina-v3) replaces llama-cpp as default; HF Local reframed as fallback when Ollama probe fails; Voyage + OpenAI bullets unchanged |
| `### SKILLS LIBRARY` → mcp-coco-index bullet (line 886) | Replaced stale `google/embeddinggemma-300m 768d default` with `sbert/jinaai/jina-embeddings-v2-base-code` 768d code-tuned + MPS auto-detect + cross-links to `registered_embedders.py` and INSTALL_GUIDE §4 |
| `## 4. CONFIGURATION` → "Memory Engine Configuration" env-var list (lines 1323-1330) | Removed stale `LLAMA_CPP_EMBEDDINGS_MODEL` and `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env vars; added current `SPECKIT_EMBEDDER` and `SPECKIT_RERANK_LAYER` env vars; updated default DB filename to `context-index__ollama__jina-embeddings-v3__1024__q4_k_m.sqlite` |
| `## 4. CONFIGURATION` → TIP block (line 1333) | Updated auto-detect language: Ollama-serving-jina-v3 → HuggingFace Local fallback |
| `## 4. CONFIGURATION` → "Database Schema" Paths bullet (line 1358) | Updated example filename to match new ollama+jina-v3 default |

## LOC delta

- Pre-edit: 1513 LOC
- Post-edit: 1520 LOC
- Net: **+7 LOC** (20 added, 13 removed)
- `git diff --numstat` confirms: `20	13	README.md`

## Cross-links added

1. `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` — canonical pluggability narrative (forward reference to 021/003 output; relative link is OK to leave as a placeholder per dispatch instructions). Appears 3× (new Embedder Architecture section, Memory Engine Embedding Providers intro, SPECKIT_EMBEDDER env var note).
2. `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` — verified exists. Linked twice: from the new Embedder Architecture section ("§4 Choosing an embedder") and from the mcp-coco-index skill-library bullet ("INSTALL_GUIDE §4").
3. `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/registered_embedders.py` — verified exists. Linked once from the mcp-coco-index skill-library bullet so readers can browse the registered embedder catalog.

## Stale claims removed

- `llama-cpp` as current default (4 occurrences in current-state copy; historical packet-name citations in "What's Shipped Recently" intentionally retained)
- `google/embeddinggemma-300m` as CocoIndex default (1 occurrence)
- `unsloth/embeddinggemma-300m-GGUF` as memory-engine default (3 occurrences, all replaced with `ollama-jina-v3` / `jina-embeddings-v3` and the new DB-path filename)
- `LLAMA_CPP_EMBEDDINGS_MODEL` and `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env vars (removed; the latter is no longer applicable post-Ollama default)

## Verification

- `grep -i "embeddinggemma\|gemma-300m"` on the updated README: zero hits.
- `grep -i "llama-cpp"` on the updated README: only the historical packet-name citation in "What's Shipped Recently" remains, which is the intended historical reference (not a current-state claim).
- Cross-link targets `INSTALL_GUIDE.md` and `registered_embedders.py` verified to exist on disk.
- Cross-link target `embedder-pluggability.md` confirmed forward-ref to 021/003 output, OK to leave as relative placeholder.
