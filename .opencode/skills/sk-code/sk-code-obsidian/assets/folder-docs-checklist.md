---
title: Folder-Docs Pairing Checklist
description: Gate the README.md/CODE.md folder-documentation threshold in the Note Database plugin — the >=3-direct-source rule in both directions, the six folders that owe docs today, and content split.
trigger_phrases:
  - "folder docs checklist obsidian plugin"
  - "readme code md threshold"
  - "folder owes a readme"
  - "three direct source files rule"
  - "paired readme and code markdown"
  - "src views modals owes docs"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Folder-Docs Pairing Checklist

Use this whenever a folder under `src/` or `tools/` in the Note Database plugin crosses the
paired-doc threshold, in either direction. No folder in this repository carries a `README.md` or
`CODE.md` today — this is a target convention mirrored from `sk-code-mobile-cli`, applied here for
the first time.

---

## 1. OVERVIEW

### Purpose

An undocumented folder with three or more source files, or any child folder that itself holds
source, forces a reader to reconstruct intent from the code alone. The threshold exists so the
obligation is mechanical — checked by a scanner, not left to judgment — and applies going forward
as the tree grows, not only to the folders measured at this packet's audit.

### Usage

Work through the sections in order — the threshold rule, the folders that owe docs today, crossing
the threshold in either direction, and the README/CODE content split — before claiming a folder's
documentation is complete, then confirm against THE GATE.

---

## 2. THE THRESHOLD (both directions)

- [ ] Confirmed the rule precisely: a folder owes `README.md` **and** `CODE.md` when it holds
  **three or more direct source files**, **or** when any of its immediate child folders itself
  contains source (regardless of how many direct files the parent holds)
- [ ] A smaller folder — fewer than three direct source files and no source-bearing child — owes
  **`README.md` only**, under the lighter rule (mirrored from `sk-code-mobile-cli`'s own threshold)
- [ ] A folder that drops below the threshold (files removed or moved elsewhere) no longer strictly
  owes the pairing — but do not delete an existing accurate `README.md`/`CODE.md` on that basis
  alone; a doc going stale from neglect is a different problem than a doc becoming technically
  optional

---

## 3. FOLDERS THAT OWE DOCS TODAY (measured baseline)

Owe both `README.md` and `CODE.md` (`audit.json` → `folderDocs.owesReadmeAndCode`):

- [ ] `src/`
- [ ] `src/data/` (128 `.ts` files — models, query, formulas, filters)
- [ ] `src/views/` (91 `.ts` files — the `*Renderer.ts` family)
- [ ] `src/views/modals/` (17 `.ts` files — every modal dialog)
- [ ] `tools/`
- [ ] `tools/screenshots/`
- [ ] `tools/screenshots/scenarios/`

Owe `README.md` only (`audit.json` → `folderDocs.owesReadmeOnly`):

- [ ] `src/__tests__/`
- [ ] `src/data/__tests__/`

This list is the baseline at this packet's measured commit, not a fixed set — a new folder that
crosses the threshold owes the same pairing even if it is not named here.

---

## 4. CROSSING THE THRESHOLD DURING A CHANGE

- [ ] A change that adds a folder's third direct source file, or adds its first source-bearing
  child folder, checked this list (or reran the scanner once it exists) before treating the folder
  as already covered
- [ ] A change that moves files between folders re-evaluated **both** the origin and destination
  folder against the threshold — a folder can drop below it (origin) in the same change another
  crosses above it (destination)
- [ ] New folders created under `src/` or `tools/` were counted from the start, not retrofitted
  after the fact once the third file happened to land

---

## 5. README VS CODE CONTENT SPLIT

Mirrored from `sk-code-mobile-cli`'s own folder-doc convention — keep the split consistent, not
duplicated across both files:

- [ ] `README.md` carries the folder's **purpose and orientation**: what the folder is for, how its
  files relate to each other, and what a newcomer reads first
- [ ] `CODE.md` (only for folders owing the full pair) carries **implementation detail**: the
  concrete contracts, data shapes, or invariants a maintainer needs before editing a file inside —
  not a restatement of `README.md`'s orientation in more words
- [ ] Neither file embeds a spec path, requirement id, task id, or checklist id — the durable WHY
  belongs in the doc; the ephemeral packet/phase reference does not (`AGENTS.md`, plugin repository
  root)

---

## 6. SCANNER AWARENESS

- [ ] `tools/naming/scan-folder-docs.mjs` does not exist yet at this packet's measured commit — it
  is target-state, built in a later phase of this same packet. Until it lands, the threshold in §2
  is checked by hand against `audit.json` or a fresh directory count, not by a green scanner run
- [ ] Once the scanner exists, a change that crosses the threshold and skips the doc pair should
  fail that scanner — do not treat a currently-absent scanner as evidence the obligation does not
  apply

---

## 7. THE GATE

A folder's documentation is "done" only when: the threshold was checked precisely (three-plus
direct files, or any source-bearing child, triggers the full pair; otherwise `README.md` alone);
every folder in the measured baseline list that has not yet been addressed is tracked, not
silently skipped; a threshold crossing during the current change was caught in both the origin and
destination folder; `README.md` carries orientation and `CODE.md` carries implementation detail
with no duplication; and no spec/task/checklist id was embedded in either file.
