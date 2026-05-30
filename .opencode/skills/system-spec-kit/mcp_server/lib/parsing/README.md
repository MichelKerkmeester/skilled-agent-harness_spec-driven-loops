---
title: "Parsing Modules"
description: "Markdown parsing, trigger matching and content normalization for memory and spec-document ingestion."
trigger_phrases:
  - "memory parser"
  - "trigger matcher"
  - "content normalizer"
---

# Parsing Modules

---

## 1. OVERVIEW

`mcp_server/lib/parsing/` converts markdown and metadata into structured inputs for memory save, search, trigger matching and indexing flows.

Current state:

- Memory file parsing extracts title, trigger phrases, tier, context type, content hash, anchors, causal links and document type from a markdown file.
- Content normalization strips frontmatter, anchors, comments, fences, tables, lists and heading markers so downstream retrieval indexing sees clean text.
- Trigger matching ranks indexed phrases against prompt text with cached, word-boundary-aware comparisons.
- Helpers stay deterministic and side-effect-light except for explicit file reads.

---

## 2. DIRECTORY TREE

```text
parsing/
+-- memory-parser.ts        # Markdown metadata, anchor, causal-link and document-type extraction
+-- content-normalizer.ts   # Markdown-to-plaintext normalization for retrieval indexing
+-- trigger-matcher.ts      # Cached, word-boundary-aware trigger-phrase matching
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `memory-parser.ts` | Extracts metadata, anchors, causal links, content hashes and document type from markdown files, with encoding-aware file reads. |
| `content-normalizer.ts` | Removes frontmatter, anchors, comments, fences, tables, lists and heading markers before embedding and BM25 tokenization. |
| `trigger-matcher.ts` | Matches prompt text against stored trigger phrases using normalized text, cached lookups and word-boundary-aware comparisons. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Inputs | Markdown file paths, markdown content and prompt text plus indexed trigger phrases. |
| Outputs | Parsed metadata, normalized text and ranked phrase matches with cache and debug data. |
| Discovery | Candidate-file discovery belongs in handlers and indexing helpers, not this directory. |
| Persistence | Embeddings, BM25 storage and graph writes are downstream responsibilities outside this folder. |
| Determinism | Helpers must stay deterministic and side-effect-light except for explicit file reads. |

Parsing and script IO:

| Flow | Input | Output |
|---|---|---|
| Memory file parsing | Markdown file path | Parsed title, trigger phrases, tier, context type, content hash, anchors, causal links and document type |
| Content normalization | Markdown content | Text suitable for embedding and BM25 tokenization |
| Trigger matching | Prompt text and indexed trigger phrases | Ranked memory matches plus cache and debug metadata |

---

## 5. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `parseMemoryFile` | Function (`memory-parser.ts`) | Parse a markdown file into indexable metadata. |
| `readFileWithEncoding` | Function (`memory-parser.ts`) | Read markdown with encoding handling for parser callers. |
| `extractAnchors` / `validateAnchors` | Functions (`memory-parser.ts`) | Expose anchor parsing and validation helpers. |
| `normalizeContentForEmbedding` | Function (`content-normalizer.ts`) | Run the full normalization pipeline for embedding text. |
| `normalizeContentForBM25` | Function (`content-normalizer.ts`) | Prepare markdown text for BM25 keyword indexing. |
| `matchTriggerPhrases` / `matchTriggerPhrasesWithStats` | Functions (`trigger-matcher.ts`) | Match prompt text against stored trigger phrases, optionally with cache and timing stats. |

---

## 6. VALIDATION

Run parser and MCP validation from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skills/system-spec-kit/mcp_server test
```

For README-only edits, run the document validator:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/mcp_server/lib/parsing/README.md
```

Expected result: the validator exits with code `0`.

---

## 7. RELATED

- [`../search/README.md`](../search/README.md)
- [`../storage/README.md`](../storage/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
