---
title: "System-Spec-Kit Scripts"
description: "Script package entrypoints, source zones, boundaries and validation commands for system-spec-kit."
trigger_phrases:
  - "spec kit scripts"
  - "validation scripts"
  - "memory save script"
  - "upgrade level workflow"
---

# System-Spec-Kit Scripts

---

## 1. OVERVIEW

`.opencode/skills/system-spec-kit/scripts/` contains the shell and TypeScript tooling for spec lifecycle work, memory saves, metadata refresh, evaluations, setup checks and script regression coverage.

Current state:

- Shell entrypoints live in focused folders such as `spec/`, `rules/`, `setup/` and `ops/`.
- TypeScript source folders compile to `dist/` for runtime use.
- `scripts-registry.json` describes script inventory and package-level entrypoints.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────╮
│                    SYSTEM-SPEC-KIT SCRIPTS                   │
╰──────────────────────────────────────────────────────────────╯

┌──────────────┐      ┌────────────────┐      ┌────────────────┐
│ Operator     │ ───▶ │ Entry scripts  │ ───▶ │ Spec, memory   │
│ or command   │      │ spec, memory   │      │ or graph files  │
└──────┬───────┘      └───────┬────────┘      └────────────────┘
       │                      │
       │                      ▼
       │              ┌──────────────┐       ┌────────────────┐
       └────────────▶ │ TS source    │ ───▶  │ dist/ runtime  │
                      │ modules      │       │ output         │
                      └──────┬───────┘       └────────────────┘
                             │
                             ▼
                      ┌──────────────┐       ┌────────────────┐
                      │ lib, utils   │ ───▶  │ tests and evals│
                      │ shared code  │       │ verification    │
                      └──────────────┘       └────────────────┘

Dependency direction: entrypoints ───▶ source modules ───▶ lib and utils
```

---

## 3. PACKAGE TOPOLOGY

```text
scripts/
+-- spec/                  # Spec lifecycle shell entrypoints
+-- rules/                 # Validation rule scripts
+-- memory/                # Memory save, ranking and indexing CLIs
+-- graph/                 # Graph metadata backfill CLI
+-- spec-folder/           # Spec folder metadata and detection modules
+-- core/                  # Workflow modules
+-- extractors/            # Semantic extraction modules
+-- loaders/               # Data loading module
+-- renderers/             # Template rendering module
+-- utils/                 # Utility modules
+-- lib/                   # Shared TypeScript and shell helpers
+-- evals/                 # Evaluation scripts and policy checks
+-- setup/                 # Environment checks and setup helpers
+-- ops/                   # Healing and runbook helpers
+-- tests/                 # JS, shell, Python and Vitest coverage
+-- test-fixtures/         # Validation fixtures
+-- templates/             # Inline renderer sources
+-- types/                 # Shared TypeScript type definitions
+-- deploy-mcp.sh          # Rebuild all MCP server dists (+ optional recycle)
+-- package.json           # ESM package manifest
+-- scripts-registry.json  # Script inventory
`-- README.md
```

Allowed direction:

- CLI folders may call shared helpers in `lib/` and `utils/`.
- TypeScript source may import package-local modules through ESM paths.
- Tests may exercise fixtures under `test-fixtures/`.

Disallowed direction:

- Source files should not import generated `dist/` output.
- Shared helpers should not own spec folder policy that belongs in `spec/` or `rules/`.
- Temporary artifacts should stay under `scratch/` or OS temp paths.

---

## 4. KEY FILES

| File or Folder | Role |
|---|---|
| `spec/` | Creates, upgrades, validates, completes and archives spec folders. |
| `rules/` | Holds validation checks used by `spec/validate.sh`. |
| `memory/generate-context.ts` | Builds structured memory save output and metadata updates. |
| `graph/backfill-graph-metadata.ts` | Refreshes graph metadata across spec folders. |
| `lib/` | Shares TypeScript helpers and sourced shell utilities. |
| `deploy-mcp.sh` | Rebuilds every MCP server `dist/` (mk-spec-memory + `@spec-kit/shared`, code-graph, advisor) after a source change; `--recycle` also transparently recycles the mk-spec-memory daemon. `dist/` is gitignored, so this is the canonical rebuild step after pulling source changes. |
| `scripts-registry.json` | Lists package scripts and known entrypoints. |
| `package.json` | Defines ESM runtime settings and build scripts. |

---

## 5. BOUNDARIES AND FLOW

Build flow:

```text
╭──────────────────────────────╮
│ TypeScript source folders    │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ npm run build                │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ dist/ runtime output         │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ Node CLI entrypoints         │
└──────────────────────────────┘
```

Validation flow:

```text
╭──────────────────────────────╮
│ Spec folder path             │
╰──────────────────────────────╯
              │
              ▼
┌──────────────────────────────┐
│ spec/validate.sh             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ rules/check-*.sh             │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│ pass, warning or error       │
└──────────────────────────────┘
```

This package owns local automation. Long-lived product behavior belongs in the skill docs, MCP server code or shared package code.

---

## 6. ENTRYPOINTS

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<name> --strict
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<inline-json>' specs/<name>
# Or use --stdin, or a session-scoped temp file (e.g. /tmp/save-context-data-<session-id>.json).
# The legacy shared path /tmp/save-context-data.json is rejected (LEGACY_SHARED_DATA_FILE).
node .opencode/skills/system-spec-kit/scripts/dist/graph/backfill-graph-metadata.js --dry-run
```

Use structured JSON input with `generate-context.js`. Do not pass free-form positional save text.

---

## 7. VALIDATION

Use repository-root commands:

```bash
npm --prefix .opencode/skills/system-spec-kit/scripts run build
npm --prefix .opencode/skills/system-spec-kit/scripts test
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/<name> --strict
```

Run targeted shell or Vitest checks when editing one script zone. Use the parent package build after TypeScript changes.

---

## 8. RELATED

- [`spec/README.md`](spec/README.md)
- [`lib/README.md`](lib/README.md)
- [`rules/README.md`](rules/README.md)
- [`memory/README.md`](memory/README.md)
- [`evals/README.md`](evals/README.md)
- [`setup/README.md`](setup/README.md)
- [`ops/README.md`](ops/README.md)
