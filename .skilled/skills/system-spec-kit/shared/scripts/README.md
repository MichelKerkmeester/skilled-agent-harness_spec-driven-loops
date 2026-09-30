---
title: "shared/scripts: README Configuration Table Derivation"
description: "The maintenance script that derives the shared package configuration table from real environment reads and checks the committed README against it."
trigger_phrases:
  - "shared scripts"
  - "env reader table"
  - "configuration table drift"
---

# shared/scripts: README Configuration Table Derivation

---

## 1. OVERVIEW

`shared/scripts/` holds maintenance scripts for the `@spec-kit/shared` package. No module in the package imports them, and the environment scan skips this directory, so nothing here reaches a consumer.

Current state:

- `env-reader-table.mjs` collects every environment read in the package, matching `process.env.NAME`, `env.NAME`, `process.env['NAME']` and `env['NAME']` in `.ts`, `.mjs` and `.cjs` files under `shared/`. It skips `dist/`, `node_modules/`, `scripts/`, `*.test.*` and `*.d.ts`.
- Variable names are grouped by the editorial list in `GROUPS`. A variable that list omits falls into a trailing `Other` group sorted by name, and a grouped variable no file reads is left out entirely.
- The script owns one region of `../README.md`, the table introduced by the header row `| Group | Variable | Read by |`.

---

## 2. CONTENTS

| File | Responsibility |
| --- | --- |
| `env-reader-table.mjs` | Scans the package for environment reads, renders the configuration table, checks the README against it and rewrites the table in place |

---

## 3. ENTRYPOINTS

| Entrypoint | Type | Purpose |
| --- | --- | --- |
| `scanEnvReaders(root)` | Function | Returns a `Map` from variable name to the set of reader files, relative to `shared/` |
| `renderTable(readers)` | Function | Returns the header row plus the grouped Markdown rows |
| `extractReadmeTable(readme)` | Function | Slices the existing table out of README text, or returns `null` when the header is absent |
| `checkReadme(readme, readers)` | Function | Returns `{ ok, expected, actual }` by comparing the README slice with the rendered table |
| `node .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs` | CLI | Prints the derived table |
| `... env-reader-table.mjs --check` | CLI | Compares the README table with the derived one and exits 1 on drift |
| `... env-reader-table.mjs --write` | CLI | Replaces the README table with the derived one |

The CLI runs only when the module is the process entrypoint. That guard canonicalizes both paths before comparing them, because a relative path or a linked directory would otherwise make the script describe itself as merely imported and exit without printing.

---

## 4. VALIDATION

Run from the repository root.

```bash
node .skilled/skills/system-spec-kit/shared/scripts/env-reader-table.mjs --check
```

Expected result: `README configuration table matches the code.` and exit 0. On drift the derived table is printed and the exit status is 1.

Re-run the same path with `--write` after an environment read changes, then confirm the diff touches only the table.

---

## 5. RELATED

- [`shared/` package README](../README.md)
