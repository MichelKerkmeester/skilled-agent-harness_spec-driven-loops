---
title: "MCP Server Library"
description: "TypeScript library modules for spec folder validation, generated metadata, description generation, continuity and shared support helpers."
trigger_phrases:
  - "mcp library"
  - "lib modules"
  - "validation library"
  - "graph metadata library"
---

# MCP Server Library

---

## 1. OVERVIEW

`runtime/lib/` contains the TypeScript implementation behind the package's public API. It owns spec folder validation, the two generated metadata files a packet carries, per-folder description generation, continuity records and resume ladders, and the small shared helpers those depend on.

Current state:

- Callers reach these modules through `api/index.ts`, not through a `lib/` barrel.
- Validation rules live in `validation/`; nothing outside it decides a rule verdict.
- Generated-metadata reads and writes stay split: the parser writes, the gates only report.
- Support folders (`utils/`, `config/`, `parsing/`) are dependency roots that do not import domain modules.

---

## 2. ARCHITECTURE

```text
╭────────────────────────────────────────────────────────────────╮
│ MCP Server Library                                             │
╰────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ api/         │ ───▶ │ validation/    │ ───▶ │ templates/     │
│ barrel       │      │ orchestrator   │      │ level contract │
└──────┬───────┘      └───────┬────────┘      └────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ graph/       │ ───▶ │ description/   │ ───▶ │ parsing/       │
│ metadata     │      │ synopsis+merge │      │ normalizer     │
└──────┬───────┘      └───────┬────────┘      └────────────────┘
       │                      │
       ▼                      ▼
┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ search/      │      │ continuity/    │ ───▶ │ resume/        │
│ discovery    │      │ records        │      │ ladder         │
└──────┬───────┘      └───────┬────────┘      └────────────────┘
       │                      │
       └──────────────────────▼────────────────────────┐
                     ┌────────────────┐      ┌────────────────┐
                     │ utils/ config/ │      │ spec/ discovery│
                     │ dependency roots│      │ folder shape  │
                     └────────────────┘      └────────────────┘

Dependency direction:
api → validation, graph, search, description
domain modules → utils, config, parsing, spec
utils, config and parsing do not import domain modules
```

---

## 3. PACKAGE TOPOLOGY

| Zone | Folders | Import role |
|---|---|---|
| Validation | `validation/`, `templates/`, `spec/` | Resolve the level contract, detect folder shape, decide rule verdicts. |
| Generated metadata | `graph/`, `description/`, `search/` | Derive, merge, write and gate `graph-metadata.json` and `description.json`. |
| Continuity | `continuity/`, `resume/`, `context/` | Own continuity records, the resume ladder and the shared payload envelope. |
| Discovery | `discovery/`, `config/` | Locate spec documents and name the canonical spec-document set. |
| Content | `parsing/`, `extraction/` | Normalize markdown and extract entities from it. |
| Support | `utils/`, `cognitive/`, `storage/`, `hooks/`, `test-helpers/` | Shared plumbing: path identity, rollout gates, atomic writes, hook policy, test helpers. |

---

## 4. DIRECTORY TREE

```text
lib/
├── cognitive/       # Rollout-percentage gate behind feature flags
├── config/          # Canonical spec-document filenames and capability flags
├── context/         # Shared payload and provenance envelope
├── continuity/      # Authored continuity snapshots and thin continuity records
├── description/     # description.json schema, merge, synopsis and repair
├── discovery/       # Lib seam over spec-document discovery
├── extraction/      # Rule-based entity extraction and its denylist
├── graph/           # graph-metadata.json schema, parser, drift gate, access telemetry
├── hooks/           # Runtime-neutral completion-evidence sentinel policy
├── parsing/         # Markdown content normalization
├── resume/          # Resume ladder construction
├── search/          # Per-folder description discovery and search flags
├── spec/            # Phase-parent detection
├── storage/         # Atomic writes and drift-marker helpers
├── templates/       # Level contract resolution
├── test-helpers/    # Environment snapshot helper for tests
├── utils/           # Canonical paths, index scope, sanitizers, exhaustiveness
├── validation/      # Orchestrator, structure rules, generated-metadata integrity
├── MODULE-MAP.md    # Per-module ownership and dependency directions
└── README.md
```

---

## 5. KEY FILES

| File | Role |
|---|---|
| `validation/orchestrator.ts` | Owns every spec folder rule verdict and the report shape `validate.sh` prints. |
| `validation/spec-doc-structure.ts` | Per-document structure rules and the continuity fingerprint. |
| `validation/generated-metadata-integrity.ts` | Schema, path-prefix and status-enum invariants for the two generated JSON files. |
| `graph/graph-metadata-parser.ts` | Loads, derives, merges, serializes and writes `graph-metadata.json`. |
| `graph/generated-metadata-drift.ts` | Re-derives a folder and compares stored synopsis fields against a fresh derivation. Reports only; never writes. |
| `description/packet-synopsis.ts` | The one shared synopsis extractor behind both generated summary fields. |
| `search/folder-discovery.ts` | Resolves a packet's description from its canonical documents into one merged answer. |
| `continuity/thin-continuity-record.ts` | Bounded continuity record format and its error codes. |
| `resume/resume-ladder.ts` | Builds the continuity ladder a resume reads. |
| `templates/level-contract-resolver.ts` | Resolves the per-level document contract the rules check against. |
| `spec/is-phase-parent.ts` | Single-source-of-truth phase-parent detection: a numbered child that carries `spec.md` or `description.json`. |
| `utils/canonical-path.ts` | Canonical path keying used for identity and deduplication. |
| `utils/index-scope.ts` | Index scope invariants that decide what is in scope for indexing. |

---

## 6. BOUNDARIES AND FLOW

Boundaries:

- This folder provides implementation modules. It does not own the public barrel; that is `api/index.ts`.
- Domain modules import inward toward `utils/`, `config/` and `parsing/`, never the reverse.
- `discovery/spec-document-finder.ts` exists so `lib/` code never reaches sideways into a handler module.
- Generated-metadata gates read and report. Writes go through the parser's explicit write path.

Validation flow:

```text
╭────────────────────╮
│ validateFolder()   │
╰─────────┬──────────╯
          ▼
┌────────────────────┐
│ level contract     │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ structure rules    │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ integrity + drift  │
└─────────┬──────────┘
          ▼
┌────────────────────┐
│ validation report  │
└────────────────────┘
```

---

## 7. ENTRYPOINTS

There is no stable `lib/` barrel for external callers. External consumers import `@spec-kit/runtime/api`; package-internal code imports the concrete module.

Examples:

```ts
import { validateFolder } from './validation/orchestrator.js';
import { buildResumeLadder } from './resume/resume-ladder.js';
import { getCanonicalPathKey } from './utils/canonical-path.js';
```

---

## 8. VALIDATION

Run from the repository root:

```bash
npm --prefix .opencode/skills/system-spec-kit/runtime run typecheck
npm --prefix .opencode/skills/system-spec-kit/runtime run build
(cd .opencode/skills/system-spec-kit/runtime && npm run test:core)
```

Use targeted Vitest paths when changing one subsystem under `lib/`.

---

## 9. RELATED

| Document | Role |
|---|---|
| [MCP Server README](../README.md) | Parent package overview. |
| [Module Map](./MODULE-MAP.md) | Per-module ownership and dependency directions. |
| [Validation README](./validation/README.md) | Validation subsystem details. |
| [Graph README](./graph/README.md) | Generated graph metadata details. |
| [Handlers README](../handlers/README.md) | Discovery and mutex modules beside `lib/`. |
