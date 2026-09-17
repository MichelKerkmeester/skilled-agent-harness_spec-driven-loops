---
title: Folder Documentation Thresholds
description: When a source folder under app-mobile/src owes a CODE.md versus a README only, why the threshold is 3+ direct source files or child source folders, and how the scan enforces both directions and resolves every path a doc names.
trigger_phrases:
  - "folder owes code md"
  - "readme vs code md"
  - "folder documentation threshold"
  - "code map source folder"
  - "unwarranted code document"
  - "folder doc reference resolution"
  - "folder docs scan"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Folder Documentation Thresholds

Source folders under `app-mobile/src` carry documentation on a threshold, not by habit. A small
folder owes a `README.md` only; a folder large enough to need a map also owes a `CODE.md`. The scan
enforces the rule in both directions and checks that every path a doc names still resolves.

---

## 1. OVERVIEW

### Core Principle

Documentation weight tracks folder weight. Below the threshold, one README says everything there is to
say. At or above it, a `CODE.md` code map earns its place; below it, a `CODE.md` is unwarranted and is
flagged. The docs orient a reader to the current state — not the history of how it got there.

### When to Use

- Adding a source file or subfolder that may push a folder over the threshold
- Adding or removing a `CODE.md`
- Writing a folder doc that names sibling files
- Deciding whether a folder is documented enough to claim done

### Key Sources

- `scripts/naming/scan-folder-docs.mjs` (the threshold and reference gate)
- `app-mobile/src/CODE.md`, `app-mobile/src/README.md` (a folder that owes both)
- `app-mobile/src/pages/inbox/README.md` (a folder below the code-map threshold)

---

## 2. THE THRESHOLD

A folder owes a `CODE.md` when it has 3 or more direct source files (`.svelte` / `.ts`, excluding
`.stories.ts`), OR when it has any child folder that itself contains source. The second clause exists
because a folder whose job is orienting a reader across children owes a code map however few files it
directly holds. Below both conditions, a `README.md` alone is sufficient. The constant lives in the
scan as `CODE_DOC_SOURCE_THRESHOLD = 3`.

`app-mobile/src` sits above the threshold on both counts — several direct sources and many source
children — so it carries `app-mobile/src/CODE.md` alongside `app-mobile/src/README.md`. A leaf feature
folder below the threshold carries a README only.

---

## 3. README VS CODE

- `README.md` is the feature document (the reader-facing "what this folder is for"); it uses sk-doc's
  readme-template.
- `CODE.md` is the code map (the structural "what lives here and how it fits"); it uses sk-doc's
  readme-code-template.

Every source folder owes at least a README. Whether it also owes a CODE map is the threshold above.
The scan enforces both directions: it reports a folder that meets the threshold but is missing its
`CODE.md`, and a folder below the threshold that carries a `CODE.md` it does not owe.

---

## 4. CURRENT-STATE ORIENTATION

A folder doc describes the folder as it is now — its surfaces, its files, how a reader navigates it.
It is not a migration log. Do not narrate what a folder used to be, which framework it was ported
from, or which pass renamed it; that history belongs nowhere in the source tree's folder docs. A doc
that reads as a changelog is a doc doing the wrong job.

---

## 5. REFERENCE RESOLUTION

The scan also resolves every path- or file-shaped token a doc names in backticks. A bare filename is
resolved as a sibling of the doc; a slashed path is resolved from the repo root (with source-root and
folder-relative spellings tried as alternates). A token that resolves nowhere is a broken reference
and fails the scan. Globs, `@`-scoped specifiers, and spaced tokens are treated as shapes, not files,
and skipped. Keep every backticked path in a folder doc pointing at a file that exists.

---

## 6. CHECK AND RELATED REFERENCES

- Check: `node scripts/naming/scan-folder-docs.mjs` reports missing feature docs, missing code maps,
  unwarranted code maps, and broken references; `--json` lists the offending folders.
- [`comment-grammar.md`](comment-grammar.md) — the in-file banners that do at file scope what these docs do at folder scope.
- [`../design-system/scoped-style-ownership.md`](../design-system/scoped-style-ownership.md) — the per-surface ownership a folder's `CODE.md` records.
