---
title: "Scripts Library"
description: "Shared TypeScript and shell helper libraries used by system-spec-kit scripts."
trigger_phrases:
  - "scripts library"
  - "anchor generator"
  - "shell common"
---

# Scripts Library

---

## 1. OVERVIEW

`runtime/cli/lib/` contains shared helpers for the script package. TypeScript modules compile to `runtime/cli/dist/lib/`, while shell helpers and standalone CommonJS modules are sourced or required directly, with no build step.

Current state:

- TypeScript modules cover rendering, semantic extraction, frontmatter, memory quality, trigger-phrase safety and activity signals.
- Shell helpers centralize branch detection, template operations, boolean-flag parsing and shared validation utilities.
- Runtime JavaScript output for TypeScript sources is generated from those sources and should not be edited by hand.
- `dist-freshness.cjs` and `completion-state.cjs` are directly-executable CommonJS modules (no build step). `dist-freshness.cjs` is shared by four independent consumers: the three `.opencode/bin/*.cjs` CLI shims, `validate.sh`'s hard staleness backstop, the `sk-code` `claude-posttooluse.sh` hook, and the `system-dist-freshness-guard` OpenCode plugin.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                       SCRIPTS LIBRARY                        │
╰──────────────────────────────────────────────────────────────╯

┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│ TS callers     │ ───▶ │ lib/*.ts       │ ───▶ │ dist/lib/*.js  │
│ memory, core   │      │ source modules │      │ build output   │
└────────────────┘      └───────┬────────┘      └────────────────┘
                                │
                                ▼
                         ┌──────────────┐
                         │ shared pkg   │
                         │ imports      │
                         └──────────────┘

┌────────────────┐      ┌────────────────┐      ┌────────────────┐
│ Shell callers  │ ───▶ │ lib/*.sh       │ ───▶ │ spec and rules │
│ spec, rules    │      │ sourced funcs  │      │ workflows      │
└────────────────┘      └────────────────┘      └────────────────┘

Dependency direction: callers ───▶ lib source ───▶ shared package or shell primitives
```

---

## 3. PACKAGE TOPOLOGY

```text
runtime/cli/lib/
+-- anchor-generator.ts                    # Stable markdown anchor generation
+-- ascii-boxes.ts                         # Box drawing helpers for terminal output
+-- cli-capture-shared.ts                  # CLI capture payload helpers
+-- content-filter.ts                      # Content pre-processing helper
+-- decision-tree-generator.ts             # Decision tree structures
+-- embeddings.ts                          # Shared embedding wrapper
+-- esm-entry.ts                           # Main-module detection and dirname helpers for ESM
+-- esm-entry.js                           # Plain-JS mirror of esm-entry.ts kept alongside the source
+-- flowchart-generator.ts                 # Flowchart output generation
+-- frontmatter-migration.ts               # Frontmatter normalization helpers
+-- memory-frontmatter.ts                  # Memory doc frontmatter handling
+-- memory-telemetry.ts                    # Named memory-save metric constants and an emit helper
+-- phase-classifier.ts                    # Workflow phase classification
+-- semantic-signal-extractor.ts           # Semantic signal extraction
+-- semantic-summarizer.ts                 # Semantic content summarization
+-- session-activity-signal.ts             # Session activity signals
+-- simulation-factory.ts                  # Simulation inputs and fixtures
+-- topic-keywords.ts                      # Lexical topic extraction
+-- trigger-extractor.ts                   # Trigger phrase extraction
+-- trigger-phrase-sanitizer.ts            # Blocklist/allowlist-based trigger-phrase sanitization
+-- truncate-on-word-boundary.ts           # Code-point-safe, whitespace-aligned string truncation
+-- unicode-normalization.ts               # Re-exports of shared Unicode normalization helpers
+-- validate-memory-quality.ts             # Generated memory quality checks
+-- validator-registry.ts                  # Typed loader over validator-registry.json rule ids
+-- validator-registry.json                # Canonical validator rule id, alias and severity registry
+-- frontmatter-grandfather-allowlist.json # Cutoff date and path allowlist for legacy frontmatter
+-- dist-freshness.cjs                     # Standalone (not compiled) source-vs-dist staleness checker, 7 watched packages
+-- completion-state.cjs                   # Standalone merge of level, checklist and placeholder completion state
+-- git-branch.sh                          # Git branch helper
+-- parse-bool-flag.sh                     # Boolean CLI flag parser
+-- shell-common.sh                        # Shared shell utility functions
+-- status-classifier.sh                   # Pass/fail/regression status classification shared with sweep/
+-- template-utils.sh                      # Template rendering shell helpers
`-- README.md
```

Allowed direction:

- TypeScript callers may import `lib/*.ts` through package-local paths.
- Shell scripts may source `*.sh` helpers from this folder.
- Wrapper modules may delegate to `@spec-kit/shared` when the shared package owns the source behavior.

Disallowed direction:

- Library modules should not call CLI entrypoints.
- Shell helpers should not mutate files without the caller passing an explicit target path.
- Source files should not import generated `dist/` files.

---

## 4. KEY FILES

| File | Role |
|---|---|
| `anchor-generator.ts` | Creates stable anchor IDs for markdown sections. |
| `memory-frontmatter.ts` | Reads and writes memory frontmatter blocks. |
| `semantic-signal-extractor.ts` | Extracts semantic signals for routing and scoring. |
| `trigger-extractor.ts` | Extracts trigger phrases from document text. |
| `trigger-phrase-sanitizer.ts` | Sanitizes manual and extracted trigger phrases against a narrow, shape-based blocklist/allowlist. |
| `validate-memory-quality.ts` | Checks generated memory content before save or index. |
| `validator-registry.ts` / `validator-registry.json` | Typed loader plus the canonical registry of validator rule ids, aliases, script paths and severities. |
| `memory-telemetry.ts` | Named memory-save metric constants (`METRIC_M1`.."M9") and `emitMemoryMetric()`. |
| `dist-freshness.cjs` | Compares each watched package's source mtimes (hash-cached) against its built dist entrypoint. `checkPackageFreshness()`/`checkAllFreshness()`/`checkFileFreshness()` are called directly by the 3 CLI shims and the `system-dist-freshness-guard` plugin; `validate.sh` and `check-dist-staleness.sh` shell out to its CLI (`check` / `check-file` / `check-all`, exit `69` on stale). |
| `completion-state.cjs` | Merges a spec folder's inferred level, checklist P0/P1/P2 completion and placeholder-completeness percentage into one never-throwing payload via `computeCompletionState()`. |
| `shell-common.sh` | Provides common shell functions for spec and rule scripts. |
| `status-classifier.sh` | Shares pass/fail/regression classification vocabulary with `runtime/cli/sweep/strict-pass-freshness.ts`. |
| `parse-bool-flag.sh` | Parses boolean CLI flags for shell entrypoints. |
| `template-utils.sh` | Provides shell helpers for template-based writes. |

---

## 5. BOUNDARIES AND FLOW

TypeScript helper flow:

```text
╭──────────────────────────────╮
│ TS script or module          │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ Import scripts/lib/*.ts      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Run pure helper logic        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Return data to caller        │
└──────────────────────────────┘
```

Shell helper flow:

```text
╭──────────────────────────────╮
│ spec or rules shell script   │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ Source scripts/lib/*.sh      │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Call helper with target path │
└──────────────────────────────┘
```

---

## 6. ENTRYPOINTS

`dist-freshness.cjs` is the one file in this folder runnable as a standalone CLI (`node dist-freshness.cjs check|check-file|check-all`). Every other module is imported, required or sourced by a caller rather than executed directly.

Example import after build:

```bash
node -e "import('./.opencode/skills/system-spec-kit/runtime/cli/dist/lib/anchor-generator.js').then(m => console.log(typeof m.generateAnchorId))"
```

Example require of the standalone CommonJS modules (no build step):

```bash
node -e "console.log(typeof require('./.opencode/skills/system-spec-kit/runtime/cli/lib/completion-state.cjs').computeCompletionState)"
```

---

## 7. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skills/system-spec-kit/runtime/cli run build
node -e "import('./.opencode/skills/system-spec-kit/runtime/cli/dist/lib/anchor-generator.js').then(m => console.log(typeof m.generateAnchorId))"
```

Shell helper behavior is covered through the spec and rule validation scripts that source it. `completion-state.test.mjs` imports Vitest but its `lib/*.test.mjs` path sits outside every configured Vitest `include` glob, so it currently runs under neither `npm test` nor `node --test`.

---

## 8. RELATED

- [`../README.md`](../README.md)
- [`../spec/README.md`](../spec/README.md)
- [`../rules/README.md`](../rules/README.md)
- [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md)
