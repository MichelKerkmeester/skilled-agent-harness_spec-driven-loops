---
title: "Memory Scripts: Context Save and Metadata Maintenance CLIs"
description: "TypeScript CLI entrypoints for canonical context saves, memory ranking, markdown parsing, metadata repair, and quality checks."
trigger_phrases:
  - "memory scripts"
  - "generate context"
  - "rank memories"
  - "memory quality"
  - "backfill frontmatter"
---

# Memory Scripts: Context Save and Metadata Maintenance CLIs

---

## 1. OVERVIEW

`runtime/cli/continuity/` contains the source TypeScript and Node CLI entrypoints for Spec Kit context saves, ranking, metadata, and quality tasks. These files compile to `runtime/cli/dist/continuity/` for runtime use.

Current state:

- `generate-context.ts` is the canonical context-save CLI for structured JSON, stdin, or JSON file input. It writes into the packet's own documents; there is no index or database behind it.
- Maintenance scripts repair research metadata and frontmatter across generated documents.
- Quality scripts parse markdown structure, rank candidate records, and check rendered continuity output before it is accepted.
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
│ maintenance    │     │ shared frontmatter │     │ validators and  │
│ index CLIs     │     │ and section parse  │     │ quality output  │
└───────┬────────┘     └──────────┬─────────┘     └────────┬────────┘
        │                         │                        │
        ▼                         ▼                        ▼
┌──────────────────────────────────────────────────────────────────┐
│ generated packet metadata and the packet's own documents          │
└──────────────────────────────────────────────────────────────────┘

Dependency direction:
runtime/cli/continuity/*.ts ───▶ runtime/cli/core, extractors, loaders and lib helpers
compiled CLIs ───▶ runtime/cli/dist/continuity/*.js
runtime hooks and slash commands invoke the compiled CLIs directly
```

---

## 3. PACKAGE TOPOLOGY

```text
runtime/cli/continuity/
+-- generate-context.ts                  # Canonical context-save CLI
+-- validate-memory-quality.ts           # Rendered memory quality gates
+-- backfill-frontmatter.ts              # Bulk frontmatter normalization
+-- backfill-research-metadata.ts        # Research metadata backfill helper
+-- migrate-trigger-phrase-residual.ts   # Trigger phrase residual cleanup
`-- README.md
```

Allowed dependency direction:

```text
runtime/cli/continuity/ → runtime/cli/core/
runtime/cli/continuity/ → runtime/cli/extractors/
runtime/cli/continuity/ → runtime/cli/loaders/
runtime/cli/continuity/ → scripts/lib/ and shared packages
```

Disallowed dependency direction:

```text
runtime/cli/continuity/ → runtime hook adapters as runtime dependencies
runtime/cli/continuity/ → prompt text or agent-only session state without structured JSON input
maintenance CLIs → silent mutation without an explicit command mode or target
```

---

## 4. DIRECTORY TREE

```text
runtime/cli/continuity/
+-- backfill-frontmatter.ts
+-- backfill-research-metadata.ts
+-- generate-context.ts
+-- migrate-trigger-phrase-residual.ts
+-- validate-memory-quality.ts
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `generate-context.ts` | Parses save arguments, rejects unsafe temp paths, validates explicit spec-folder targets, accepts `--stdin`, `--json`, or JSON file input, and runs the canonical memory workflow. |
| `validate-memory-quality.ts` | Checks rendered memory artifacts for structure, semantic sufficiency, duplicate risk, trigger quality, and post-save review output. |
| `backfill-frontmatter.ts` | Normalizes managed frontmatter keys across targeted markdown roots. |
| `backfill-research-metadata.ts` | Adds or repairs metadata needed by research memory artifacts. |
| `migrate-trigger-phrase-residual.ts` | Cleans residual trigger phrase metadata that no longer matches the current schema. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Inputs | Prefer structured JSON through `--stdin` or `--json`. JSON file mode is valid when the file path is session-scoped. |
| Outputs | Write generated context artifacts, packet metadata, reports, and cleanup results. |
| Ownership | This folder owns CLI surfaces for context save and maintenance. Validation rules, generated-metadata internals, templates, and spec-folder authoring rules live outside this folder. |

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
│ run core continuity workflow             │
└──────────────────────────────────────────┘
                   │
                   ▼
┌──────────────────────────────────────────┐
│ validate rendered continuity quality     │
└──────────────────────────────────────────┘
                   │
                   ▼
╭──────────────────────────────────────────╮
│ the packet's documents and generated     │
│ metadata are updated; the save ends here │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

Run compiled commands from the repository root after the TypeScript build has produced `runtime/cli/dist/continuity/`.

| Entrypoint | Type | Purpose |
|---|---|---|
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin` | CLI | Save structured session context from stdin. |
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --json '{...}' <spec-folder>` | CLI | Save structured context from an inline JSON string with an explicit packet target. |
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/validate-memory-quality.js <file>` | CLI | Check rendered continuity quality before accepting the output. |
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/backfill-frontmatter.js --dry-run --include-archive` | CLI | Preview frontmatter normalization changes. |
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/backfill-frontmatter.js --apply --include-archive --report /tmp/frontmatter-apply.json` | CLI | Apply frontmatter normalization and write a report. |
| `node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/migrate-trigger-phrase-residual.js` | CLI | Clean residual trigger-phrase metadata that no longer matches the current schema. |

---

## 8. VALIDATION

Run from the repository root.

```bash
python3 .opencode/skills/sk-doc/shared/scripts/extract_structure.py .opencode/skills/system-spec-kit/runtime/cli/continuity/README.md
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/cli/continuity/README.md
```

Expected result: the structure extractor reports README type with no critical issues, and document validation exits `0`.

For CLI behavior checks, use command-specific dry-run or help modes where available:

```bash
node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --help
node .opencode/skills/system-spec-kit/runtime/cli/dist/continuity/backfill-frontmatter.js --dry-run --include-archive --report /tmp/frontmatter-dry-run.json
```

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../../runtime/scripts/README.md`](../../runtime/scripts/README.md)
- [`../../references/memory/save-workflow.md`](../../references/memory/save-workflow.md)
- [`../core/README.md`](../core/README.md)
