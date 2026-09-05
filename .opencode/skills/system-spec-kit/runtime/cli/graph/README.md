---
title: "Graph Scripts: Metadata Backfill And Migration"
description: "CLI helpers for refreshing and migrating spec-folder graph-metadata and description.json files across the specs tree."
trigger_phrases:
  - "graph metadata backfill"
  - "backfill graph metadata"
  - "spec graph metadata"
  - "migrate generated json"
---

# Graph Scripts: Metadata Backfill And Migration

## 1. OVERVIEW

`scripts/graph/` contains the CLI entrypoints that refresh and migrate `graph-metadata.json` and `description.json` files for spec folders. It discovers packet folders, derives current metadata, and reports low-confidence fields or drift that may need review.

Current state:

- `backfill-graph-metadata.ts` defaults to an inclusive scan of active, archived, and future spec trees.
- `backfill-graph-metadata.ts` supports `--active-only` when archived paths should be skipped.
- Both entrypoints support `--dry-run` for previewing created, refreshed, and flagged packets.
- `migrate-generated-json.ts` regenerates both generated files per folder in isolation, and supports a `--prune-report` / `--prune --prune-confirm` two-step flow for removing stale artifacts.

---

## 2. DIRECTORY TREE

```text
graph/
+-- backfill-graph-metadata.ts
`-- migrate-generated-json.ts
```

---

## 3. KEY FILES

| File | Role |
|---|---|
| `backfill-graph-metadata.ts` | Collects spec folders and calls graph metadata derivation or refresh APIs. |
| `migrate-generated-json.ts` | Enumerates every spec folder and regenerates `description.json` and `graph-metadata.json` per folder, with dry-run, scoped `--only`/`--root`, and a hash-confirmed prune flow. |

---

## 4. ENTRYPOINTS

Run the built scripts from the repository root:

```bash
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js --dry-run
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/backfill-graph-metadata.js --active-only
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/migrate-generated-json.js --dry-run --verify
node .opencode/skills/system-spec-kit/runtime/cli/dist/graph/migrate-generated-json.js --only <spec-folder>
```

Use `--root <specs-dir>` to target a specific specs directory.

---

## 5. BOUNDARIES

The scripts own graph metadata and description regeneration only. They should not edit authored spec documents such as `spec.md`, `plan.md`, or `implementation-summary.md`.

---

## 6. RELATED

- `../config/README.md`
- `../../runtime/api/`
