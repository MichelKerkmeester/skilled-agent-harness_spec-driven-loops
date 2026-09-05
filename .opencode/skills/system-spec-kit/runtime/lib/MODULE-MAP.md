---
title: "Library Module Map"
description: "Internal ownership boundaries and dependency directions for runtime/lib."
trigger_phrases:
  - "module map"
  - "lib dependency map"
  - "module ownership"
  - "dependency directions"
---

# Library Module Map

> Internal module ownership and dependency map for `runtime/lib/`.

---

## 1. OVERVIEW

This document is the internal ownership and dependency map for the `runtime/lib/` surface. It answers three practical questions:

1. Which library module owns which responsibilities?
2. Which sibling modules, handlers, hooks, or `api/` exports consume each module?
3. Which import directions are legal?

The inventory is derived from the files in each folder and from the import edges observed across `api/`, `core/`, `handlers/`, `hooks/`, and `lib/`. Consumer lists name the modules that actually import each folder; a folder consumed only by `tests/` says so.

---

## 2. MODULE INVENTORY

### `cognitive/`

- Purpose: Owns the rollout-percentage gate that decides whether a percentage-gated feature is on for this process.
- Key files:
  - `rollout-policy.ts` — reads `SPECKIT_ROLLOUT_PERCENT` (0-100, default 100) and clamps it.
- Primary consumers:
  - None in production `lib/` code today; only its own test (`tests/rollout-policy.vitest.ts`) imports it. Kept as the shared rollout-bucket implementation for a future percentage-gated flag.

### `config/`

- Purpose: Owns the canonical spec-document filename set, spec-folder identity resolution, and the phase-gated capability flags.
- Key files:
  - `spec-doc-paths.ts` — `SPEC_DOCUMENT_FILENAMES`, spec-folder identity resolution and the graph-metadata path classifier.
  - `capability-flags.ts` — phase-aware rollout defaults across the `baseline`, `lineage`, `graph`, `adaptive` and `scope-governance` phases.
- Primary consumers:
  - `api/index.ts`
  - `handlers/memory-index-discovery.ts`
  - `lib/validation/orchestrator.ts`, `lib/validation/generated-metadata-integrity.ts`
  - `lib/search/folder-discovery.ts`, `lib/graph/graph-metadata-parser.ts`, `lib/spec/is-phase-parent.ts`, `lib/resume/resume-ladder.ts`

### `context/`

- Purpose: Owns the common payload and provenance envelope shared by the startup, recovery and compaction hook surfaces.
- Key files:
  - `shared-payload.ts` — payload kinds, provenance envelope and label sanitization at the neutral seam.
- Primary consumers:
  - `hooks/claude/compact-inject.ts`
  - `hooks/claude/hook-state.ts`

### `continuity/`

- Purpose: Owns the continuity record a packet carries: the bounded thin record and the authored snapshot built around it.
- Key files:
  - `thin-continuity-record.ts` — the 2048-byte-bounded record format, its facets and its `MEMORY_003`-`MEMORY_009` error codes.
  - `authored-continuity-snapshot.ts` — composes the snapshot from the resume ladder and the thin record, and upserts it into markdown.
- Primary consumers:
  - `lib/resume/resume-ladder.ts`
  - `hooks/claude/compact-inject.ts`

### `description/`

- Purpose: Owns `description.json`: its schema, the merge rule that preserves authored keys, the shared synopsis extractor, and merge-preserving repair.
- Key files:
  - `description-schema.ts` — Zod schema plus the canonical derived and reserved key sets.
  - `description-merge.ts` — merges incoming fields over authored ones and reports which keys were overridden.
  - `packet-synopsis.ts` — the one shared extractor behind both generated summary fields, so `description` and `causal_summary` cannot drift from the same `spec.md`.
  - `repair.ts` — merge-preserving repair over a partial `description.json`. Test-only consumer today (`tests/description/repair*.vitest.ts`); no production caller yet.
- Primary consumers:
  - `lib/search/folder-discovery.ts`
  - `lib/graph/graph-metadata-parser.ts`, `lib/graph/generated-metadata-drift.ts`
  - `lib/validation/generated-metadata-integrity.ts`

### `discovery/`

- Purpose: A lib-level seam over spec-document discovery. The implementation stays in `handlers/`, which handler code also calls; this seam exists so `lib/` modules depend inward instead of reaching sideways into a handler.
- Key files:
  - `spec-document-finder.ts` — re-exports `findSpecDocuments` and its types with no behavioral change.
- Primary consumers:
  - `lib/resume/resume-ladder.ts`

### `extraction/`

- Purpose: Owns rule-based entity extraction over document content and the denylist that keeps generic nouns out of the results. Pure TypeScript, no npm dependencies.
- Key files:
  - `entity-extractor.ts` — rule-based extraction and canonical entity-name normalization, gated by `SPECKIT_AUTO_ENTITIES`.
  - `entity-denylist.ts` — common nouns and stop words filtered from candidates.
  - `entity-extraction-rules.json` — the extraction rule data.
- Primary consumers:
  - `lib/graph/graph-metadata-parser.ts`

### `graph/`

- Purpose: Owns `graph-metadata.json` end to end — schema, derivation, merge, serialization, the drift gate, and the index-layer store for access and freshness signals.
- Key files:
  - `graph-metadata-schema.ts` — schema version, document type, filename constant, and the closed status and save-lineage value sets.
  - `graph-metadata-parser.ts` — load, validate, derive, merge, serialize, write and refresh for one spec folder.
  - `generated-metadata-drift.ts` — re-derives a folder and compares stored synopsis fields against a fresh derivation. Reads and reports only, so it cannot churn the files it exists to keep clean. Pairs with `source_doc_hashes` as a cheap freshness key.
  - `access-telemetry.ts` — index-layer record for `last_accessed_at` and the phase-parent last-active pointers, so a read or a resume updates the signal without rewriting the generated file. Every write is best-effort and fails closed.
- Primary consumers:
  - `api/index.ts`, `api/graph-refresh.ts`
  - `lib/validation/orchestrator.ts`, `lib/validation/generated-metadata-integrity.ts`
  - `lib/resume/resume-ladder.ts`

### `hooks/`

- Purpose: Owns the runtime-neutral completion-evidence policy every runtime adapter shares. It checks recorded artifacts only, never executes a test or a build, and never writes to stdout or stderr.
- Key files:
  - `completion-evidence-sentinel.cjs` — the transport-free decision plus the shared dedup fingerprint store.
- Primary consumers:
  - `hooks/claude/completion-evidence-stop.cjs`
  - `hooks/codex/completion-evidence-stop.cjs`
  - `hooks/devin/completion-evidence-stop.cjs`
  - `hooks/cursor/completion-evidence-response.mjs`
  - `hooks/pi/completion-evidence.ts`

### `parsing/`

- Purpose: Owns markdown content normalization — stripping frontmatter, anchors, table syntax, fence markers and checkbox notation so downstream consumers read content rather than structural noise.
- Key files:
  - `content-normalizer.ts` — normalization helpers including `stripYamlFrontmatter`.
- Primary consumers:
  - `lib/description/packet-synopsis.ts`
  - `lib/search/folder-discovery.ts`

### `resume/`

- Purpose: Owns the continuity ladder a resume walks.
- Key files:
  - `resume-ladder.ts` — builds the ladder from discovered spec documents and the continuity facets.
- Primary consumers:
  - `lib/continuity/authored-continuity-snapshot.ts`

### `search/`

- Purpose: Owns per-folder description discovery. Despite the folder name, it is a discovery module, not a retrieval engine; runtime gates now live in `config/capability-flags.ts`.
- Key files:
  - `folder-discovery.ts` — resolves a packet's description from its canonical documents so callers read one merged answer rather than guessing from a filename. Also owns `extractKeywords`, `slugifyFolderName` and `getSpecsBasePaths`.
- Primary consumers:
  - `api/index.ts`
  - `lib/graph/graph-metadata-parser.ts`

### `spec/`

- Purpose: Owns the single detection rule for phase-parent folders, so no caller re-implements the traversal.
- Key files:
  - `is-phase-parent.ts` — a folder is a phase parent when it has at least one `^[0-9]{3}-[a-z0-9-]+$` child and at least one such child carries `spec.md` or `description.json`.
- Primary consumers:
  - `lib/validation/orchestrator.ts`
  - `lib/graph/graph-metadata-parser.ts`
  - `lib/resume/resume-ladder.ts`

### `storage/`

- Purpose: Owns the persistence helper the package still needs: atomic file writes with pending-file recovery.
- Key files:
  - `transaction-manager.ts` — atomic write and pending-file helpers.
- Primary consumers:
  - None in production `api/`, `core/`, `handlers/`, or `lib/` code today; only `tests/transaction-manager*.vitest.ts` exercise it directly. Kept as the shared atomic-write primitive for a future filesystem-writing caller.

### `templates/`

- Purpose: Owns resolution of the per-level document contract that the validation rules check a folder against.
- Key files:
  - `level-contract-resolver.ts` — resolves a `SpecKitLevel` to its document contract.
- Primary consumers:
  - `lib/validation/orchestrator.ts`
  - `lib/validation/spec-doc-structure.ts`

### `test-helpers/`

- Purpose: Owns test-only helpers kept out of the production modules they support.
- Key files:
  - `env-snapshot.ts` — snapshots `process.env` keys and returns a `restore()` that runs even when assertions fail.
- Primary consumers:
  - Test suites only; no production module imports this folder.

### `utils/`

- Purpose: Owns low-level shared plumbing: path identity, index scope, prompt-safety sanitization and exhaustiveness checking. This is a dependency root.
- Key files:
  - `canonical-path.ts` — canonical path keying used for identity and deduplication.
  - `index-scope.ts` — index scope invariants and the included-skills policy.
  - `skill-label-sanitizer.ts` — strips instruction-shaped labels and control characters before a label reaches a prompt.
  - `exhaustiveness.ts` — `assertNever` for statically unreachable branches.
- Primary consumers:
  - `handlers/memory-index-discovery.ts`
  - `hooks/claude/hook-state.ts`
  - `lib/config/spec-doc-paths.ts`, `lib/context/shared-payload.ts`, `lib/search/folder-discovery.ts`

### `validation/`

- Purpose: Owns every spec folder rule verdict. Shell front ends call into it and add no rules of their own.
- Key files:
  - `orchestrator.ts` — resolves the level contract, detects folder shape and runs the rule set to a report.
  - `spec-doc-structure.ts` — per-document structure rules and the continuity fingerprint.
  - `generated-metadata-integrity.ts` — validates the two generated JSON files against the shared schemas plus the canonical path-prefix and status-enum invariants. Severity resolution is left to the caller so the same check backs both the report-mode rollout and the enforced run.
- Primary consumers:
  - `api/index.ts`
  - `../scripts/spec/validate.sh`, through the compiled `dist/lib/validation/orchestrator.js`

---

## 3. DEPENDENCY DIRECTIONS

Status: **DOCUMENTATION-ONLY**

No AST checker enforces the directions below inside `lib/`. The import-policy checks in `../scripts/evals/` enforce the package boundary — external callers must enter through `api/` — but not the internal layering.

### 3.1 Dependency Roots

Root modules:

- `config`
- `utils`
- `parsing`

Target rule:

- These may be imported by any other `lib/` module, by handlers, and by hooks.
- They should not import sibling domain modules.

`config/spec-doc-paths.ts` imports `utils/index-scope.ts`; both are roots, so this is a
root-to-root import rather than an inversion. `config/capability-flags.ts` has no imports
of its own — every flag reads `process.env` directly.

### 3.2 Foundation Modules

Foundation modules:

- `cognitive`
- `spec`
- `templates`
- `discovery`
- `test-helpers`

Target rule:

- These may import root modules only.
- They may be consumed by any domain module.
- `discovery` is deliberately a re-export seam and must stay one; putting logic in it would duplicate the handler implementation.

### 3.3 Domain Modules

Domain modules:

- `validation`
- `graph`
- `description`
- `search`
- `continuity`
- `resume`
- `extraction`
- `context`

Target rule by module:

- `validation`
  - May import: `templates`, `spec`, `graph`, `description`, `config`
  - Must not import: `api/`, handlers, hooks
- `graph`
  - May import: `description`, `extraction`, `search`, `spec`, `parsing`, `config`
  - Must not import: `validation` orchestration
- `description`
  - May import: `parsing`, root modules
  - Must not import: `graph`, `validation`
- `search`
  - May import: `description`, `parsing`, `config`, `utils`
  - Must not import: `graph`, `validation`
- `continuity` and `resume`
  - May import each other plus `discovery`, `graph`, root modules
  - Must not import: `validation`, handlers
- `extraction`
  - May import: root modules only
  - Must not import: `graph`, `search`, `validation`
- `context`
  - May import: `utils`
  - Must not import: any domain module

### 3.4 Support Modules

Support modules:

- `storage`
- `hooks`

Target rule:

- `storage` exposes atomic-write and marker helpers and imports `core/config` only.
- `hooks` is runtime-neutral policy. It must stay transport-free: no stdout, no stderr, no test or build execution.
- Neither may import a domain module.

### 3.5 Forbidden Global Directions

- `lib/* → api/*`
- `lib/* → handlers/*` outside the `discovery/` seam
- root modules importing domain modules
- `storage → validation` or `storage → graph`
- `hooks → any domain module`

---

## 4. CANONICAL LOCATIONS

### Rule Verdicts

- Canonical location: `lib/validation/orchestrator.ts`
- Non-canonical location: shell front ends such as `../scripts/spec/validate.sh`
- Rule: the shell script resolves and invokes the compiled orchestrator. It implements no rules and interprets no verdicts.

### Generated Metadata Writes

- Canonical location: `lib/graph/graph-metadata-parser.ts`
- Non-canonical location: the gates in `lib/graph/generated-metadata-drift.ts` and `lib/validation/generated-metadata-integrity.ts`
- Rule: gates read and report; only the parser writes. A gate that writes would dirty the file it exists to keep clean.

### Packet Synopsis

- Canonical location: `lib/description/packet-synopsis.ts`
- Rule: both generated summary fields — `description` in `description.json` and `causal_summary` in `graph-metadata.json` — derive from this one extractor with a per-field length limit, so they move together against the same source document.

### Spec Document Discovery

- Canonical location: `handlers/memory-index-discovery.ts`
- Seam for `lib/` callers: `lib/discovery/spec-document-finder.ts`
- Rule: `lib/` code imports the seam. Handler code may import the implementation directly.
