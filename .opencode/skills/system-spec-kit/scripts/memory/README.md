---
title: "Memory Scripts: Context Save and Index Maintenance CLIs"
description: "TypeScript CLI entrypoints for canonical context saves, memory ranking, markdown parsing, metadata repair, quality checks, and index maintenance."
trigger_phrases:
  - "memory scripts"
  - "generate context"
  - "rank memories"
  - "memory quality"
  - "reindex embeddings"
---

# Memory Scripts: Context Save and Index Maintenance CLIs

---

## 1. OVERVIEW

`scripts/memory/` contains the source TypeScript and Node CLI entrypoints for Spec Kit memory save, ranking, metadata, quality, and index maintenance tasks. These files compile to `scripts/dist/memory/` for runtime use.

Current state:

- `generate-context.ts` is the canonical context-save CLI for structured JSON, stdin, or JSON file input.
- Maintenance scripts repair memory index scope, stale vectors, embedding state, generated entities, research metadata, and frontmatter.
- Quality scripts parse markdown structure, rank candidate memories, and check rendered memory output before indexing.
- One-shot migration scripts remain in this folder only when they still need a documented invocation path.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         MEMORY SCRIPTS                           │
╰──────────────────────────────────────────────────────────────────╯

┌────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│ CLI callers    │ ──▶ │ generate-context.ts │ ──▶ │ core workflow   │
│ node dist/*    │     │ argument parsing    │     │ save pipeline   │
└───────┬────────┘     └──────────┬─────────┘     └────────┬────────┘
        │                         │                        │
        ▼                         ▼                        ▼
┌────────────────┐     ┌────────────────────┐     ┌─────────────────┐
│ maintenance    │     │ ast-parser.ts      │     │ validators and  │
│ index CLIs     │     │ markdown sections  │     │ ranked output   │
└───────┬────────┘     └──────────┬─────────┘     └────────┬────────┘
        │                         │                        │
        ▼                         ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│ memory database, embeddings, generated packet metadata and docs   │
└──────────────────────────────────────────────────────────────────┘

Dependency direction:
scripts/memory/*.ts ───▶ scripts/core, extractors, loaders, renderers and lib helpers
compiled CLIs ───▶ scripts/dist/memory/*.js
MCP tools may invoke compiled CLIs or equivalent library workflows
```

---

## 3. PACKAGE TOPOLOGY

```text
scripts/memory/
+-- generate-context.ts                  # Canonical context-save CLI
+-- validate-memory-quality.ts           # Rendered memory quality gates
+-- ast-parser.ts                        # Markdown heading, table and code block parser
+-- rank-memories.ts                     # Candidate ranking utility
+-- backfill-frontmatter.ts              # Bulk frontmatter normalization
+-- backfill-research-metadata.ts        # Research metadata backfill helper
+-- rebuild-auto-entities.ts             # Auto-entity metadata rebuild
+-- reindex-embeddings.ts                # Full embedding reindex CLI
+-- cleanup-orphaned-vectors.ts          # Stale vector cleanup
+-- cleanup-index-scope-violations.ts    # Out-of-scope index cleanup
+-- migrate-trigger-phrase-residual.ts   # Trigger phrase residual cleanup
+-- fix-memory-h1.mjs                    # H1 format repair helper
`-- README.md
```

Allowed dependency direction:

```text
scripts/memory/ → scripts/core/
scripts/memory/ → scripts/extractors/
scripts/memory/ → scripts/loaders/
scripts/memory/ → scripts/renderers/
scripts/memory/ → scripts/lib/ and shared packages
```

Disallowed dependency direction:

```text
scripts/memory/ → MCP transport request handlers as runtime dependencies
scripts/memory/ → prompt text or agent-only session state without structured JSON input
maintenance CLIs → silent mutation without an explicit command mode or target
```

---

## 4. DIRECTORY TREE

```text
scripts/memory/
+-- ast-parser.ts
+-- backfill-frontmatter.ts
+-- backfill-research-metadata.ts
+-- cleanup-index-scope-violations.ts
+-- cleanup-orphaned-vectors.ts
+-- fix-memory-h1.mjs
+-- generate-context.ts
+-- migrate-trigger-phrase-residual.ts
+-- rank-memories.ts
+-- rebuild-auto-entities.ts
+-- reindex-embeddings.ts
+-- validate-memory-quality.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `generate-context.ts` | Parses save arguments, rejects unsafe temp paths, validates explicit spec-folder targets, accepts `--stdin`, `--json`, or JSON file input, and runs the canonical memory workflow. |
| `validate-memory-quality.ts` | Checks rendered memory artifacts for structure, semantic sufficiency, duplicate risk, trigger quality, and post-save review output. |
| `ast-parser.ts` | Parses markdown into heading, code block, table, and section-aware structures used by memory extraction and validation. |
| `rank-memories.ts` | Scores and ranks memory candidates from JSON input. |
| `backfill-frontmatter.ts` | Normalizes managed frontmatter keys across targeted markdown roots. |
| `backfill-research-metadata.ts` | Adds or repairs metadata needed by research memory artifacts. |
| `cleanup-index-scope-violations.ts` | Removes memory index records that do not belong in active indexed scope. |
| `cleanup-orphaned-vectors.ts` | Removes vector rows no longer attached to active memory records. |
| `reindex-embeddings.ts` | Forces embedding regeneration for indexed memory and spec documents. |
| `rebuild-auto-entities.ts` | Recomputes auto-entity metadata from indexed content. |
| `migrate-trigger-phrase-residual.ts` | Cleans residual trigger phrase metadata that no longer matches the current schema. |
| `fix-memory-h1.mjs` | Repairs H1 formatting in older generated memory artifacts. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Inputs | Prefer structured JSON through `--stdin` or `--json`. JSON file mode is valid when the file path is session-scoped. |
| Outputs | Write generated context artifacts, packet metadata, reports, and cleanup results. Step 11.5 only gates save-time canonical spec-doc indexing; embedding/vector rows can also be written by the Step 12 retry queue and memory maintenance CLIs. |
| Ownership | This folder owns CLI surfaces for memory save and maintenance. MCP tool schemas, database connection internals, templates, and spec-folder authoring rules live outside this folder. |

Canonical save flow:

```text
╭──────────────────────────────────────────╮
│ caller provides structured session JSON  │
╰──────────────────────────────────────────╯
                   │
                   ▼
┌──────────────────────────────────────────┐
│ generate-context.ts parses CLI args      │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ validate explicit spec-folder target     │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ load collected data and session details  │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ run core memory workflow                 │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ validate rendered memory quality         │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ context artifacts are updated; indexing  │
│ may run, defer or hand off to MCP scan    │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

Run compiled commands from the repository root after the TypeScript build has produced `scripts/dist/memory/`.

| Entrypoint | Type | Purpose |
|---|---|---|
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin` | CLI | Save structured session context from stdin. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '{...}' <spec-folder>` | CLI | Save structured context from an inline JSON string with an explicit packet target. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/rank-memories.js /tmp/memories.json` | CLI | Rank candidate memory records from JSON input. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/validate-memory-quality.js <file>` | CLI | Check rendered memory quality before accepting or indexing output. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive` | CLI | Preview frontmatter normalization changes. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --apply --include-archive --report /tmp/frontmatter-apply.json` | CLI | Apply frontmatter normalization and write a report. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/reindex-embeddings.js` | CLI | Rebuild embeddings for indexed memory content. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-orphaned-vectors.js` | CLI | Remove stale vectors. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/cleanup-index-scope-violations.js` | CLI | Remove out-of-scope memory index records. |
| `node .opencode/skills/system-spec-kit/scripts/dist/memory/rebuild-auto-entities.js` | CLI | Rebuild auto-entity metadata. |

---

## 8. VALIDATION

Run from the repository root.

```bash
node .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/scripts/memory/README.md
node .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/scripts/memory/README.md
```

Expected result: the structure extractor reports README type with no critical issues, and document validation exits `0`.

For CLI behavior checks, use command-specific dry-run or help modes where available:

```bash
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --help
node .opencode/skills/system-spec-kit/scripts/dist/memory/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json
```

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../mcp-server/scripts/README.md`](../../mcp-server/scripts/README.md)
- [`../../mcp-server/database/README.md`](../../mcp-server/database/README.md)
- [`../core/README.md`](../core/README.md)
