---
title: "Spec Kit Runtime Engine"
description: "Spec folder validation, generated metadata, description generation, and the runtime hook adapters, consumed as a library by the scripts workspace and the runtime hook configs."
trigger_phrases:
  - "spec kit engine"
  - "validation orchestrator"
  - "graph metadata"
  - "spec kit hook adapters"
importance_tier: "important"
---

# Spec Kit Runtime Engine

> `@spec-kit/runtime` is the compiled TypeScript engine behind spec folder validation, generated packet metadata, and the per-runtime hook adapters. It is consumed as a library, not run as a service.

---

## 1. OVERVIEW

### What This Package Does

This package owns three things that the rest of Spec Kit builds on.

- **Spec folder validation.** `lib/validation/orchestrator.ts` decides every rule verdict for a spec folder. `../scripts/spec/validate.sh` is a thin front end over its compiled output and deliberately implements no rules of its own.
- **Generated packet metadata.** `lib/graph/` and `lib/description/` derive, merge, validate, and serialize the two generated JSON files a spec folder carries — `description.json` and `graph-metadata.json` — plus the integrity and drift gates that prove they still match the documents they summarize.
- **Runtime hook adapters.** `hooks/` holds the per-runtime adapters for Claude, Codex, Cursor, Devin, and Pi, together with the runtime-neutral Gate-3 spec-gate core they all call.

The package has no server process and no transport of its own. Its build artifact is a library under `dist/`, and every consumer reaches it either through the `./api` export or by naming a file under `hooks/` in a runtime hook config.

### How It Is Consumed

Two consumers, and no third.

- **The scripts workspace** (`@spec-kit/scripts`) declares `"@spec-kit/runtime": "file:../runtime"` and imports the barrel as `@spec-kit/runtime/api`. Live callers include `../scripts/spec-folder/generate-description.ts`, `../scripts/core/workflow.ts`, `../scripts/memory/generate-context.ts`, and `../scripts/memory/backfill-research-metadata.ts`. Imports that reach past the barrel into `lib/`, `core/`, or `handlers/` are rejected by the import-policy checks in `../scripts/evals/` unless they carry a governed allowlist entry.
- **The runtime hook configs** name files under `hooks/` directly. `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, and `.devin/hooks.v1.json` register a mix of compiled `dist/hooks/<runtime>/*.js` outputs and directly-runnable `.mjs`/`.cjs` adapters. Pi discovers `hooks/pi/*` through relative symlinks in `.pi/extensions/`.

`../scripts/spec/validate.sh` is a third consumer in practice but not an import one: it resolves `dist/lib/validation/orchestrator.js`, guards it with the `validation-orchestrator` freshness entry in `../scripts/lib/dist-freshness.cjs`, and refuses to run against a stale build.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                     SPEC KIT RUNTIME PACKAGE                     │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ scripts/     │ ───▶ │ api/index.ts     │ ───▶ │ lib/            │
│ workspace    │      │ public barrel    │      │ validation      │
└──────────────┘      └────────┬─────────┘      │ graph, search   │
                               │                └────────┬────────┘
                               ▼                         │
┌──────────────┐      ┌──────────────────┐               │
│ validate.sh  │ ───▶ │ lib/validation/  │ ◀─────────────┘
│ front end    │      │ orchestrator.ts  │
└──────────────┘      └──────────────────┘

┌──────────────┐      ┌──────────────────┐      ┌─────────────────┐
│ runtime hook │ ───▶ │ hooks/<runtime>/ │ ───▶ │ hooks/lib/      │
│ configs      │      │ adapters         │      │ spec-gate core  │
└──────────────┘      └──────────────────┘      └─────────────────┘

Dependency direction:
scripts ───▶ api/ ───▶ lib/ ───▶ core/ and configs/
hooks/<runtime> ───▶ hooks/lib ───▶ filesystem and shared state
handlers/ ───▶ filesystem discovery only
```

---

## 3. PACKAGE TOPOLOGY

```text
runtime/
+-- api/          # Public barrel for the scripts workspace
+-- lib/          # Validation, graph metadata, description, continuity and support modules
+-- handlers/     # Spec-document discovery and the save-path folder mutex
+-- hooks/        # Per-runtime hook adapters and the runtime-neutral spec-gate core
+-- core/         # Runtime path and config resolution
+-- configs/      # Environment-validated cognitive config and ranking weight data
+-- scripts/      # Build finalizer, metadata repair, and test runners
+-- tests/        # Vitest suites
+-- stress-test/  # Long-running Vitest suites under their own config
`-- README.md
```

Allowed dependency direction:

```text
api/ → lib/ → core/ → configs/
api/ → handlers/
lib/ → lib/ (inward: domain modules depend on utils, config, parsing)
hooks/<runtime>/ → hooks/lib/
tests/ → any package module plus package-local fixtures
```

Disallowed dependency direction:

```text
lib/ → api/
core/ or configs/ → lib/
external consumers → lib/, core/ or handlers/ without an allowlist entry
dist/ → source imports
```

---

## 4. DIRECTORY TREE

```text
runtime/
+-- api/                     # index.ts barrel and graph-refresh.ts
+-- core/                    # config.ts path and limit resolution
+-- data/                    # Repository-local data files
+-- handlers/                # Spec-document discovery, save/ folder mutex
+-- hooks/                   # claude, codex, cursor, devin, pi, lib
+-- lib/                     # Domain modules; see lib/MODULE-MAP.md
+-- scripts/                 # Package build and maintenance scripts
+-- stress-test/             # Stress suites
+-- tests/                   # Vitest suites
+-- ENV-REFERENCE.md         # Environment variable reference
+-- package.json             # Package manifest and script definitions
+-- tsconfig.json            # Build configuration
+-- vitest.config.ts         # Core test configuration
+-- vitest.stress.config.ts  # Stress test configuration
`-- README.md
```

---

## 5. KEY FILES

| File | Responsibility |
|---|---|
| `api/index.ts` | The public barrel. Every export has a named caller in the scripts workspace; adding one without a caller re-widens the surface this package exists to keep narrow. |
| `api/graph-refresh.ts` | Resolves a spec folder reference written as an absolute path, a cwd-relative path, or a bare folder id, then re-derives that folder's graph metadata. |
| `lib/validation/orchestrator.ts` | Owns every spec folder rule verdict. `validate.sh` calls its compiled output and adds no rules. |
| `lib/validation/spec-doc-structure.ts` | Per-document structure rules plus the continuity fingerprint used by completion freshness checks. |
| `lib/validation/generated-metadata-integrity.ts` | Validates `description.json` and `graph-metadata.json` against the shared Zod schemas and the canonical path-prefix and status-enum invariants. |
| `lib/graph/graph-metadata-parser.ts` | Loads, derives, merges, serializes, and writes `graph-metadata.json`, and re-derives a folder on refresh. |
| `lib/graph/graph-metadata-schema.ts` | The `graph-metadata.json` schema, its version constant, and the closed status and lineage value sets. |
| `lib/graph/generated-metadata-drift.ts` | Re-derives one folder and compares the stored synopsis fields against a fresh derivation. Reads and reports only; it never writes the folder it checks. |
| `lib/search/folder-discovery.ts` | Resolves a packet's description from its canonical documents so discovery reads one merged answer rather than guessing from a filename. |
| `lib/description/packet-synopsis.ts` | The one shared synopsis extractor behind both generated summary fields, so `description` and `causal_summary` cannot drift from the same `spec.md`. |
| `lib/resume/resume-ladder.ts` | Builds the continuity ladder a resume reads. |
| `lib/templates/level-contract-resolver.ts` | Resolves the per-level document contract the validation rules check against. |
| `handlers/memory-index-discovery.ts` | Walks the filesystem to find spec documents and detect spec level. Deliberately local rather than shared so discovery does not depend on a wider layer. |
| `handlers/save/spec-folder-mutex.ts` | Serializes work per spec folder across async chains and interprocess lock directories. |
| `hooks/lib/spec-gate/spec-gate-core.mjs` | The runtime-neutral Gate-3 policy core every runtime adapter calls. Adapters translate payloads; they never decide policy. |
| `core/config.ts` | Resolves runtime paths and input limits, and loads the validated cognitive config. |
| `ENV-REFERENCE.md` | Environment variable reference for the package. |

Canonical spec-document discovery includes `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research.md`, `research/research.md`, `resource-map.md`, `handover.md`, root-level `review-report.md`, `<packet>/review/review-report.md`, and `description.json`. `graph-metadata.json` is discovered through the graph-metadata path gate, including metadata backfilled under `<packet>/iterations/`; `research/iterations/` and `review/iterations/` markdown remain working artifacts rather than canonical spec docs.

---

## 6. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Public API | External callers import `@spec-kit/runtime/api`. Reaching into `lib/`, `core/`, or `handlers/` needs a governed allowlist entry in `../scripts/evals/import-policy-allowlist.json`. |
| Internal imports | Package-internal code imports the owning module directly rather than routing back through `api/index.ts`. |
| Rule ownership | Validation rules live in `lib/validation/`. Shell front ends stay thin. |
| Generated metadata | The drift and integrity gates read and report. Writes go through the parser's explicit write path so a check cannot dirty the file it checks. |
| Hook adapters | Each runtime folder owns payload translation for its own envelope shape. Policy stays in `hooks/lib/`. |
| Build output | `dist/` is generated and gitignored. It is never a source dependency, and it must be rebuilt after pulling source changes. |

Main flow, validation:

```text
╭──────────────────────────────────────────╮
│ validate.sh <spec-folder> --strict        │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ dist-freshness guard on the compiled      │
│ validation-orchestrator entry             │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ lib/validation/orchestrator.ts            │
│ resolves level contract, runs rules       │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ structure, integrity and drift rules      │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ per-rule verdicts and a RESULT line       │
╰──────────────────────────────────────────╯
```

---

## 7. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `@spec-kit/runtime/api` | Package export | The supported import surface, resolved to `dist/api/index.js`. |
| `dist/lib/validation/orchestrator.js` | Runtime artifact | Compiled validation orchestrator resolved by `../scripts/spec/validate.sh`. |
| `dist/hooks/<runtime>/*.js` | Runtime artifacts | Compiled lifecycle adapters registered by each runtime's hook config. |
| `hooks/<runtime>/*.mjs`, `hooks/<runtime>/*.cjs` | Hook scripts | Directly-runnable adapters with no build step. |
| `scripts/finalize-dist.mjs` | Script | Post-build step that records freshness entries and prunes stale dist roots. |
| `npm run build` | Command | Runs the freshness prepare step, `tsc --build`, then `finalize-dist.mjs`. |
| `npm test` | Command | Runs the bounded Vitest runner in `scripts/run-tests.mjs`. |

---

## 8. VALIDATION

Run from `runtime/` unless noted.

```bash
npm run build
npm run typecheck
npm test
```

Additional lanes defined in `package.json`:

```bash
npm run lint                  # eslint . --ext .ts
npm run test:core             # vitest run
npm run test:sharded          # scripts/run-tests-sharded.mjs
npm run typecheck:tests       # tsconfig.tests.json
npm run test:spec-validation   # the tracked validation suites in ../scripts/tests
```

`test:sharded` covers the Vitest lane; `test:spec-validation` covers the tracked shell
validation suites. A shard that exceeds `SPECKIT_TEST_RUN_TIMEOUT_MS` prints
`[test-bound] invocation exceeded` and exits 124, which is not a result — read the log
and the exit status separately rather than through a pipe.

Focused documentation checks from the repository root:

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/system-spec-kit/runtime/README.md
python3 .opencode/skills/sk-doc/scripts/extract_structure.py .opencode/skills/system-spec-kit/runtime/README.md
```

Expected result: build, typecheck, and tests exit 0, README validation reports no blocking issues, and structure extraction returns a README document profile.

---

## 9. RELATED

- [`ENV-REFERENCE.md`](./ENV-REFERENCE.md)
- [`api/README.md`](./api/README.md)
- [`lib/README.md`](./lib/README.md)
- [`lib/MODULE-MAP.md`](./lib/MODULE-MAP.md)
- [`hooks/README.md`](./hooks/README.md)
- [`../scripts/README.md`](../scripts/README.md)
- [`../ARCHITECTURE.md`](../ARCHITECTURE.md)
