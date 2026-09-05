---
title: "Parsing: Markdown Content Normalization"
description: "Markdown-to-plaintext normalization shared by packet-synopsis extraction and per-folder description discovery."
trigger_phrases:
  - "content normalizer"
  - "strip yaml frontmatter"
  - "normalize content for embedding"
---

# Parsing: Markdown Content Normalization

---

## 1. OVERVIEW

`runtime/lib/parsing/` normalizes raw markdown content before it feeds embedding-style text extraction or keyword-style tokenization. Raw markdown carries structural noise (YAML frontmatter, HTML comment anchors, pipe-table syntax, fence markers, checkbox notation) that degrades the quality of downstream text derivation, so this folder strips it once behind two composed entry points.

Current state:

- `content-normalizer.ts` is the only implementation file in this folder.
- Individual strip/normalize primitives (frontmatter, anchors, HTML comments, code fences, tables, lists, headings) compose into two pipelines: one for embedding-style text, one for BM25-style keyword text. The BM25 pipeline currently delegates to the same steps as the embedding pipeline; a separate entry point exists so BM25-specific adjustments can diverge later without touching the embedding path.
- Consumed by `lib/description/packet-synopsis.ts` (strips frontmatter before deriving a synopsis) and `lib/search/folder-discovery.ts`.

---

## 2. DIRECTORY TREE

```text
parsing/
+-- content-normalizer.ts   # Markdown-to-plaintext normalization primitives and pipelines
`-- README.md
```

---

## 3. KEY FILES

| File | Responsibility |
|---|---|
| `content-normalizer.ts` | Strips frontmatter, anchors, HTML comments, code fences, tables, lists and heading markers, and composes them into `normalizeContentForEmbedding` and `normalizeContentForBM25`. |

---

## 4. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Inputs | Raw markdown content as a string. |
| Outputs | Normalized plaintext, or a single-purpose strip result (e.g. frontmatter-free content). |
| Discovery | Candidate-file discovery and reading belong in `handlers/` and `lib/search/`, not this folder. |
| Persistence | This folder performs no file I/O and no database writes. |
| Determinism | Every function is a pure string transform with no side effects. |

Normalization pipeline (`normalizeContentForEmbedding`, reused by `normalizeContentForBM25`):

```text
raw markdown
  -> stripYamlFrontmatter
  -> stripAnchors
  -> stripHtmlComments
  -> stripCodeFences
  -> normalizeMarkdownTables
  -> normalizeMarkdownLists
  -> normalizeHeadings
  -> collapse excess whitespace
  -> normalized plaintext
```

---

## 5. ENTRYPOINTS

| Entrypoint | Purpose |
|---|---|
| `stripYamlFrontmatter(content)` | Remove a leading `---\n...\n---` frontmatter block. |
| `stripAnchors(content)` | Remove HTML comment anchor markers. |
| `stripHtmlComments(content)` | Remove remaining HTML comments. |
| `stripCodeFences(content)` | Drop fence markers and language id, keeping the code body. |
| `normalizeMarkdownTables(content)` | Extract cell text from pipe tables. |
| `normalizeMarkdownLists(content)` | Drop bullet and checkbox notation. |
| `normalizeHeadings(content)` | Drop `#` heading markers. |
| `normalizeContentForEmbedding(content)` | Run the full pipeline for embedding-style text. |
| `normalizeContentForBM25(content)` | Run the same pipeline for BM25-style keyword text. |

---

## 6. VALIDATION

Run from `.opencode/skills/system-spec-kit/runtime`.

```bash
npx vitest run tests/content-normalizer.vitest.ts
```

Expected result: the content-normalizer suite passes.

For README-only edits, run the document validator:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/lib/parsing/README.md
```

Expected result: the validator exits with code `0`.

---

## 7. RELATED

- [`../description/README.md`](../description/README.md)
- [`../search/README.md`](../search/README.md)
- [`../../handlers/README.md`](../../handlers/README.md)
