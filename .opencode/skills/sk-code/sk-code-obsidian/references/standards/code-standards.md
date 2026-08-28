---
title: Applied Code Standards (Current State + Target)
description: How sk-code standards apply to this TypeScript-only Obsidian plugin — module headers, naming, comments, single-stylesheet CSS ownership, and the change gate — stated as measured current state, not an aspirational summary.
trigger_phrases:
  - "obsidian plugin code standards summary"
  - "typescript only plugin conventions"
  - "pascalcase dominant naming"
  - "single stylesheet css ownership standard"
  - "change gate obsidian plugin"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Applied Code Standards (Current State + Target)

A current-state summary of how sk-code standards apply to this TypeScript-only Obsidian plugin —
module headers, naming, comments, CSS ownership, and the change gate. Not a point-in-time audit;
each section states plainly whether it describes the shipped tree or a target this packet
proposes.

---

## 1. OVERVIEW

### Purpose

Gives plugin engineers the applied shape of sk-code standards at a glance, so conventions do not
have to be reverse-engineered from the source alone — and so a target convention (banners, kebab-
case, folder docs) is never mistaken for one already adopted.

### When to Use

- Reviewing a plugin change against naming, comment, or module-header conventions
- Onboarding to this TypeScript-only plugin's source tree and build
- Confirming the change gate before any completion claim

### Key Sources

- **`SKILL.md` §3** (surface standards) and **§3b** (source tree conventions) — the living
  authority this page restates
- `002-repo-convention-audit/audit.json` — the measured counts cited throughout

---

## 2. APPLIED SURFACE

The standards cover one TypeScript source tree: `src/` (240 `.ts` files, 87,462 lines measured)
bundled with esbuild to `main.js`, plus `tools/` (9 `.mjs` scripts, the screenshot harness) and
the single `styles.css`. There is no framework layer — no React, no Svelte, no component-scoped
styling. The runtime dependency surface is `chart.js` alone; everything else (`obsidian`,
`electron`, the CodeMirror/Lezer packages) is externalized in `esbuild.config.mjs`, not bundled.

---

## 3. MODULE HEADERS AND SECTIONS — TARGET, NOT SHIPPED

A `MODULE:` banner plus numbered box-drawing sections is this packet's proposed target
(`comment-grammar.md`), mirroring `sk-code-mobile-cli`. **Zero of 249 source files carry one
today** (measured). Do not describe any file in this tree as following that convention until a
later phase adopts it and the count changes.

---

## 4. NAMING — CURRENT STATE

Files are **PascalCase-dominant**: 232 PascalCase filenames against 16 kebab-case, measured, with
one camelCase outlier (`textLinkScheme`) and one underscore-prefixed folder (`_shared`, under
`tools/screenshots/scenarios/`). No scanner enforces either form today. A kebab-case target exists
(mirroring `sk-code-mobile-cli`'s own filename grammar) but is not adopted — see the design
plan's phase sequencing for the manifest-driven rename that would execute it. Functions are
camelCase, interfaces/types are PascalCase, and constants that are true module-level constants are
UPPER_SNAKE_CASE (`DATABASE_VIEW_TYPE`, `TOUCH_LAYOUT_MAX_WIDTH`, `MAX_SOURCE_RULE_MATCH_TEXT_
LENGTH`).

---

## 5. COMMENTS — CURRENT STATE

1,423 total line comments across 249 files; 32 files carry a leading block comment; only 4 files
contain any box-drawing rule character, and none of those 4 follow the target sectioning
convention. See `comment-grammar.md` for the full measured breakdown and the pre-existing CJK
cheat-sheet preamble in `styles.css`, which is a separate, real convention — not the target
grammar and not a defect. One rule is already in force regardless of banner-adoption status:
never embed a spec path, requirement id, task id, or checklist id in a code comment
(`AGENTS.md`, plugin repository root).

---

## 6. STYLES AND CSS OWNERSHIP — CURRENT STATE

Every rule lives in the single `styles.css` (18,931 lines, 1,196 distinct `.db-*` classes). There
are no component-scoped styles and no per-component `.css` file anywhere in the tree — see
`stylesheet-ownership.md` for the full ownership model and `db-class-naming.md` for the class
grammar a renderer's output must satisfy.

---

## 7. THE CHANGE GATE

Every change runs `npx tsc --noEmit`, `npm run build`, and `npx vitest run`; all three must pass
before any completion claim. `npm run screenshots:verify` must stay at its current entry count
(180) or grow with new scenarios added in the same change. `npm run lint` carries a known,
recorded baseline of 115 problems — never implied clean, never claimed reduced without re-running
the count. See `verification.md` for the exact command set and sequencing, and
`release/release-verification.md` for the tag-triggered release build on top of the same gate.
