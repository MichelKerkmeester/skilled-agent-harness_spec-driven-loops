---
title: Folder Documentation Thresholds (Target State)
description: The README.md/CODE.md pairing threshold mirrored from sk-code-mobile-cli — three or more direct source files, or any child folder that itself contains source — and the seven folders that owe both today, measured, none of which carry either yet.
trigger_phrases:
  - "folder owes readme code md obsidian plugin"
  - "zero folder docs exist in plugin tree"
  - "which folders owe readme and code"
  - "folder documentation threshold obsidian"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Folder Documentation Thresholds (Target State)

This packet proposes the same `README.md`/`CODE.md` folder-doc threshold `sk-code-mobile-cli`
uses for its own tree. **Zero folders in this plugin carry either document today.** This
reference names the threshold and exactly which folders would owe what, measured against the
current tree — a target to adopt, not a state already reached.

---

## 1. OVERVIEW

### Core Principle

Documentation weight tracks folder weight. A folder below the threshold owes a `README.md` only;
at or above it, it also owes a `CODE.md` code map. The same threshold `sk-code-mobile-cli`
enforces for `app-mobile/src` applies here: **3 or more direct source files, OR any child folder
that itself contains source.**

### When to Use

- Deciding whether a folder needs a `README.md`, a `CODE.md`, or both, once adoption begins
- Adding a source file or subfolder that may push a folder over the threshold
- Checking whether a proposed folder doc's threshold call is correct before writing it

### Key Sources

- `002-repo-convention-audit/audit.json` → `folderDocs` — the measured owing list below
- `$HUB/.opencode/skills/sk-code/sk-code-mobile-cli/references/folder-docs.md` — the mirrored
  source convention

---

## 2. THE THRESHOLD

A folder owes a `CODE.md` when it has 3 or more direct source files (`.ts`, excluding
`.test.ts`), OR when it has any child folder that itself contains source — the second clause
exists because a folder whose job is orienting a reader across children owes a code map however
few files it directly holds. Below both conditions, a `README.md` alone is sufficient.

---

## 3. THE MEASURED OWING LIST

Measured against the current tree at `6b3d77e`. **None of these folders carry a `README.md` or a
`CODE.md` today** — `folderDocs.existing: 0` in the audit.

| Folder | Owes | Why |
| --- | --- | --- |
| `src` | README + CODE | top-level source root; several direct files plus every source child |
| `src/data` | README + CODE | 128 direct `.ts` files |
| `src/views` | README + CODE | 91 direct `.ts` files, plus the `modals/` source child |
| `src/views/modals` | README + CODE | 17 direct `.ts` files |
| `tools` | README + CODE | holds the `screenshots/` source child |
| `tools/screenshots` | README + CODE | 3+ direct `.mjs` files plus the `scenarios/` source child |
| `tools/screenshots/scenarios` | README + CODE | 5 direct `.mjs` scenario modules |
| `src/__tests__` | README only | below the 3-file / no-source-child threshold |
| `src/data/__tests__` | README only | below the 3-file / no-source-child threshold |

`src/views/modals` owing docs it does not have compounds with the coverage gap in
`view-renderer-architecture.md` §4 — the folder is both undocumented and unphotographed.

---

## 4. README VS CODE

- `README.md` is the feature document — what the folder is for, from a reader's perspective.
- `CODE.md` is the code map — what lives here and how the pieces fit, for a folder large enough
  that a reader needs orientation before diving into individual files.

Every source folder owes at least a README; whether it also owes a CODE map is the threshold
above.

---

## 5. CURRENT-STATE ORIENTATION

A folder doc describes the folder as it is now, not the history of how it got there. When these
docs are authored, they name the folder's real files and real surfaces — not a migration log, and
not a restatement of this packet's own phase numbering (see `comment-grammar.md` §5, the same
no-ephemeral-id rule applies to folder docs).

---

## 6. RELATED REFERENCES

- `comment-grammar.md` — the file-scope target convention this folder-scope one complements.
- `stylesheet-ownership.md` — the one exception to "every source lives under a documented
  folder": `styles.css` sits at the repository root, outside `src/`, and is not subject to this
  threshold.
- `view-renderer-architecture.md` §4 — why `src/views/modals` is the highest-priority folder to
  document first.
