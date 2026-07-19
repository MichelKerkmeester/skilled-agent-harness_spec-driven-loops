---
title: "Core Scripts: Context Workflow Modules"
description: "TypeScript modules that generate, score, write and index Spec Kit continuity context."
trigger_phrases:
  - "core workflow"
  - "memory workflow"
  - "subfolder resolution"
  - "daemon detect"
---

# Core Scripts: Context Workflow Modules

> TypeScript modules for context-save orchestration, scoring, file output, indexing hooks and daemon detection.

---

## 1. OVERVIEW

`scripts/core/` contains the TypeScript workflow modules used by `scripts/dist/memory/generate-context.js`. The folder owns context-save orchestration, quality scoring, metadata extraction, file writing, indexing hooks, spec-folder path handling and live daemon detection.

Current state:

- Source of truth is `scripts/core/*.ts`.
- Compiled runtime output is `scripts/dist/core/*.js`.
- `workflow.ts` composes the save flow and imports focused helpers from this folder.
- `daemon-detect.ts` decides whether the standalone indexer may open a writer or must defer to the running MCP daemon.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                         scripts/core/                            │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────────────┐      ┌──────────────────────┐
│ generate-context.js  │ ───▶ │ workflow.ts          │
│ dist/memory caller   │      │ save orchestration   │
└──────────────────────┘      └──────────┬───────────┘
                                          │
                       ┌──────────────────┼──────────────────┐
                       ▼                  ▼                  ▼
              ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
              │ path + config  │ │ metadata +     │ │ daemon-detect  │
              │ config/        │ │ scoring        │ │ writer-safety  │
              │ subfolders     │ │ memory/title/  │ │ gate           │
              └───────┬────────┘ │ topic/quality  │ └────────────────┘
                      │          └───────┬────────┘
                      ▼                  ▼
              ┌────────────────┐ ┌────────────────┐
              │ writers +      │ │ post-save      │
              │ frontmatter    │ │ review/drift   │
              └────────────────┘ └────────────────┘

Dependency direction:
workflow.ts -> focused core helpers -> scripts/lib utilities
index.ts -> public exports only
```

---

## 3. PACKAGE TOPOLOGY

```text
scripts/core/
+-- index.ts                  # Public barrel for core modules
+-- workflow.ts               # Main context-save orchestration
+-- workflow-accessors.ts     # Typed accessors for workflow objects
+-- workflow-path-utils.ts    # Path normalization and key-file discovery
+-- config.ts                 # Runtime config, constants and specs-dir resolution
+-- daemon-detect.ts          # MCP-daemon liveness gate (lease + process probe)
+-- subfolder-utils.ts        # Spec folder and child-folder resolution
+-- save-context-path.ts      # Save path resolution helpers
+-- memory-*.ts               # Metadata and indexing support
+-- *-scorer.ts               # Quality scoring support
+-- *-validator.ts            # Alignment and quality gate checks
`-- README.md
```

Allowed dependency direction:

```text
workflow.ts -> core helper modules -> scripts/lib utilities
index.ts -> core helper modules
core helper modules -> Node built-ins and local script libraries
```

Disallowed dependency direction:

```text
core helper modules -> scripts/dist compiled output
scripts/lib utilities -> workflow.ts
runtime callers -> private helper assumptions not exported by index.ts
```

---

## 4. DIRECTORY TREE

```text
scripts/core/
+-- alignment-validator.ts       # Spec-folder alignment and thinning targets
+-- config.ts                    # Config loading, path wiring, canonical-first specs-dir discovery
+-- content-cleaner.ts           # HTML stripping and literal-anchor escaping
+-- daemon-detect.ts             # MCP-daemon liveness check before standalone indexing
+-- find-predecessor-memory.ts   # Prior memory lookup support
+-- frontmatter-editor.ts        # Frontmatter injection and trigger rendering
+-- index.ts                     # Barrel exports
+-- memory-indexer.ts            # Indexing hooks and metadata preparation
+-- memory-metadata.ts           # Memory classification and evidence snapshots
+-- post-save-review.ts          # Post-save frontmatter drift review
+-- quality-gates.ts             # Save and indexing gate decisions
+-- quality-scorer.ts            # Artifact quality scoring
+-- save-context-path.ts         # Save target path helpers
+-- spec-root-canonical-resolver.ts     # Canonical-first spec-folder resolution (explicit paths preserved)
+-- spec-root-collision-classifier.ts   # Fail-closed root/packet collision classifier
+-- spec-root-fallback-telemetry.ts     # Legacy-fallback counters + clean-compatibility-window gate
+-- spec-root-fixtures.ts               # R1-R10 root/packet state fixtures
+-- spec-root-migration-manifest.ts     # Read-only hashed classification manifest
+-- spec-root-migration.ts              # Legacy-only to canonical migration with lossless quarantine
+-- spec-root-registry.ts               # Registry of every root-resolution call site + precedence
+-- spec-root-write-guard.ts            # Rejects divergent writes; honors the writer freeze
+-- spec-writer-freeze.ts               # Fail-closed writer-freeze guard for migration windows
+-- subfolder-utils.ts           # Spec folder resolution helpers
+-- title-builder.ts             # Memory title construction
+-- topic-extractor.ts           # Topic signal extraction
+-- tree-thinning.ts             # Context tree compaction helpers
+-- workflow-accessors.ts        # Safe accessors for loose workflow data
+-- workflow-path-utils.ts       # Path normalization and key-file discovery
+-- workflow.ts                  # Main orchestration flow
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `workflow.ts` | Runs the context-save flow from parsed input through generated continuity artifacts; serializes runs with an in-process queue plus filesystem lock and gates Step 11.5 auto-indexing on daemon liveness. |
| `config.ts` | Loads `config.jsonc`, validates and normalizes workflow limits, freezes the `CONFIG` object, and resolves the active specs directories canonical-first (`.opencode/specs` before legacy `specs`, with legacy read fallback). |
| `daemon-detect.ts` | Reports whether the `mk-spec-memory` daemon is alive by combining the launcher lease with live process probing, so a standalone save never opens a second SQLite writer. |
| `subfolder-utils.ts` | Resolves spec folders, child folders and subfolder-aware save targets. |
| `save-context-path.ts` | Computes canonical save paths for generated context output. |
| `memory-metadata.ts` | Builds metadata used by memory records, deduplication, causal links and evidence snapshots. |
| `memory-indexer.ts` | Prepares indexing calls and memory metadata for saved artifacts. |
| `frontmatter-editor.ts` | Injects quality and spec-doc-health metadata and renders trigger-phrase frontmatter. |
| `post-save-review.ts` | Compares saved frontmatter with JSON payloads and reports drift findings. |
| `quality-gates.ts` | Decides whether save and indexing quality gates pass or abort. |
| `index.ts` | Exposes the modules that callers can import from `core`. |

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Source modules import local TypeScript helpers and script libraries, not compiled `dist/` output. `daemon-detect.ts` is stdlib-only (`node:fs`, `node:path`, `node:url`). |
| Exports | `index.ts` is the public barrel for this folder. Keep one-off helpers private unless another script imports them. |
| Ownership | This folder owns context-save orchestration helpers and the writer-safety daemon gate. MCP server tools, database code and spec templates belong outside `scripts/core/`. |

Daemon-liveness gate:

```text
╭──────────────────────────────────────────╮
│ standalone save reaches Step 11.5        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ readLeasePids(): primaryPid + childPid   │
│ from .mk-spec-memory-launcher.json       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ primaryPid alive?  ──── yes ──▶ ALIVE     │
│ else childPid alive? ── yes ──▶ ALIVE     │
│ else ───────────────────────▶ NOT ALIVE   │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ ALIVE -> skip standalone index (use MCP) │
│ NOT ALIVE -> safe to index in-process    │
╰──────────────────────────────────────────╯
```

The childPid branch is load-bearing: a launcher pid that looks dead does not make the lease reclaimable while the recorded child (the real SQLite writer) is still live. Reclaiming there would spawn a second writer on `context-index.sqlite`.

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `runWorkflow` | Function (`workflow.ts`) | Main context-save orchestration entry, serialized under the run lock. |
| `isSpecMemoryDaemonAlive` | Function (`daemon-detect.ts`) | Returns `{ alive, pid }`; the writer-safety gate for standalone indexing. |
| `isProcessAlive` | Function (`daemon-detect.ts`) | Liveness probe via `process.kill(pid, 0)`, reused by the workflow lock cleanup. |
| `resolveSpecMemoryDaemonLeasePath` | Function (`daemon-detect.ts`) | Resolves the launcher lease path under `mcp-server/database/`. |
| `CONFIG` / `findActiveSpecsDir` | Export (`config.ts`) | Frozen runtime config and active specs-directory resolution. |
| `index.ts` | Module | Public barrel for importing core helpers. |
| `scripts/dist/memory/generate-context.js` | CLI script | Primary caller for core workflow behavior. |

---

## 8. VALIDATION

Run from the repository root unless noted.

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
```

Expected result: TypeScript compiles and updates `scripts/dist/`.

The sibling Vitest suite lives in `../tests/`. Targeted runs for this folder, from `scripts/`:

```bash
npm test
npx vitest run tests/daemon-detect.vitest.ts
npx vitest run tests/workflow-step115-daemon-guard.vitest.ts
npx vitest run tests/workflow-canonical-save-metadata.vitest.ts
```

Expected result: Vitest reports the daemon-detection, Step-11.5 guard and canonical-save suites passing.

---

## 9. RELATED

- [`../README.md`](../README.md)
- [`../tests/README.md`](../tests/README.md)
- [`../../README.md`](../../README.md)
