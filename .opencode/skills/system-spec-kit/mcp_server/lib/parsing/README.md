---
title: "Parsing Modules"
description: "Markdown parsing, trigger matching, and content normalization for memory and spec-document ingestion."
trigger_phrases:
  - "memory parser"
  - "trigger matcher"
  - "content normalizer"
---

# Parsing Modules

## 1. OVERVIEW

`mcp_server/lib/parsing/` converts markdown and metadata into structured inputs for memory save, search, trigger matching, and indexing flows.

## 2. PARSING AND SCRIPT IO

| Flow | Input | Output |
| --- | --- | --- |
| Memory file parsing | Markdown file path | Parsed title, trigger phrases, tier, context type, content hash, anchors, causal links, and document type |
| Content normalization | Markdown content | Text suitable for embedding and BM25 tokenization |
| Trigger matching | Prompt text and indexed trigger phrases | Ranked memory matches plus cache/debug metadata |

## 3. ENTRYPOINTS

- `parseMemoryFile()` parses a markdown file into indexable metadata.
- `readFileWithEncoding()` reads markdown with encoding handling for parser callers.
- `normalizeContent()` prepares markdown text for retrieval indexes.
- `matchTriggerPhrases()` matches prompt text against stored trigger phrases.
- `extractAnchors()` and `validateAnchors()` expose anchor parsing and validation helpers.

## 4. VALIDATION FROM REPO ROOT

Run parser and MCP validation from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skills/system-spec-kit/mcp_server test
python3 .opencode/skills/sk-code/scripts/verify_alignment_drift.py --root .opencode/skills/system-spec-kit/mcp_server/lib/parsing
```

## 5. KEY FILES

| File | Purpose |
| --- | --- |
| `content-normalizer.ts` | Removes frontmatter, anchors, comments, fences, tables, lists, and heading markers before retrieval indexing |
| `memory-parser.ts` | Extracts metadata, anchors, causal links, content hashes, and document type from markdown files |
| `trigger-matcher.ts` | Performs cached phrase matching with normalized text and word-boundary-aware comparisons |

## 6. BOUNDARIES

- Discovery of candidate files belongs in handlers and indexing helpers, not this directory.
- Persistence, embeddings, BM25 storage, and graph writes are downstream responsibilities.
- Parser helpers must stay deterministic and side-effect-light except for explicit file reads.

## 7. RELATED

- `../search/README.md`
- `../storage/README.md`
- `../../handlers/README.md`
