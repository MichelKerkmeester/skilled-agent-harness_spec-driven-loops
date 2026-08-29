---
title: The Cross-Repo Skill-Reference Integrity Guard
description: The drift guard that resolves every app path this surface skill names against the real app tree in a different repo, so a path can never silently rot when the app moves.
trigger_phrases:
  - "skill reference integrity guard"
  - "cross repo path drift"
  - "scan skill references broken"
  - "app path resolves top-level"
  - "backticked path claim verify"
  - "surface skill different repo"
  - "path rot after app moves"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# The Cross-Repo Skill-Reference Integrity Guard

This is a read-only surface skill: it names paths in the Pi Remote phone app, which lives in a
**different repository** from the skill. Nothing in the app repo imports these docs, so an app path
named here rots silently when the app is renamed or moved. This reference is the guard that catches
that rot.

---

## 1. OVERVIEW

### Core Principle

Every backticked app path in this skill is a claim about a repo the skill does not control. A claim
that no longer resolves is drift, and drift here is invisible until someone follows a dead path.
`scan-skill-references.mjs` turns each claim into a resolve-or-fail check against the live app tree.

### When to Use

- Before any completion claim on this skill — on `SKILL.md` and every reference and asset file
- After the app repo renames or moves a top-level folder
- When adding or editing any backticked app path in these docs

### Key Sources

- `scripts/naming/scan-skill-references.mjs`

---

## 2. WHAT COUNTS AS A CLAIM

The scan reads a Markdown file and extracts its backticked tokens, then classifies each:

- **App path** — a token whose first segment is a real app top-level entry (for example `app-mobile`,
  `scripts`). It must resolve to a real path in the app tree.
- **Filename** — a bare `name.ext` for a known code extension (`.ts`, `.svelte`, `.css`, `.mjs`, …).
  A basename with that spelling must exist somewhere in the app tree.
- **Ignored** — prose, placeholders, and anything not rooted at a real top-level entry.

Rooting at a real top-level entry is the whole trick: it is what lets the scan tell an app path claim
apart from ordinary prose, and it is why a retired root is exactly the drift the scan exists to catch.

---

## 3. RUN IT — EXPECT ZERO BROKEN

Run the scan on each doc, passing the file as the one argument:

```bash
node scripts/naming/scan-skill-references.mjs <skill-file.md>
```

It prints `path claims`, `filename refs`, and a `broken` count, listing each unresolved claim, and
**exits non-zero when any claim is broken**. The completion bar is `broken : 0` on `SKILL.md` and on
every file under `references/` and `assets/`. Anything above zero is a failing gate — fix the path or
remove the claim.

---

## 4. THE DRIFT IT CATCHES

The app has already moved once: it is `app-mobile`, Svelte-only, with tokens in `app.css`. The scan
is what catches a doc still describing the old shape — not `apps/pi-remote-web`, not `style.css`, not
`apps/pi-remote-web/src/App.tsx`. Those three name, in order, the retired React web root, its removed
global stylesheet, and its React entry component. The scan also verifies counter-examples: a token
written as "not `apps/pi-remote-web`" is required to **not** resolve, so a phrase that names a dead
path as forbidden is proven still forbidden. Had this guard run continuously, that
retired-`apps/pi-remote-web` / removed-`style.css` / React-entry drift could never have reached a
shipped reference.

---

## 5. WHERE IT SITS AMONG THE NAMING SCANS

`scan-skill-references.mjs` is one of the naming guards under `scripts/naming/`, alongside
`scan-naming.mjs` (in-repo filename grammar), `scan-comments.mjs` (comment grammar), and
`scan-folder-docs.mjs` (folder-doc coverage). Those three police the app repo's own files; this one is
the only guard that reaches **out** of the app repo to validate a document that describes it. Run all
of them together through the surface-gates entry point rather than one at a time.

---

## 6. RELATED REFERENCES

- [`storybook/component-story-upkeep.md`](../storybook/component-story-upkeep.md) — a doc whose story and script paths this guard keeps honest.
- [`browser-free-verification-recipe.md`](browser-free-verification-recipe.md) — the script paths this guard verifies still resolve.
- [`../conventions/comment-grammar.md`](../conventions/comment-grammar.md) — the design-system reference whose `app.css` and component paths must also resolve.
