---
title: Stylesheet Ownership
description: styles.css is the plugin's one stylesheet — 18,931 lines, measured, with no component-scoped styles anywhere in the tree. Where a rule belongs, and why splitting the file is an operator decision this packet documents but does not make.
trigger_phrases:
  - "single stylesheet ownership"
  - "styles.css one file"
  - "where does this css rule go obsidian plugin"
  - "no component scoped styles"
  - "splitting styles.css"
  - "cjk comment preamble"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Stylesheet Ownership

The plugin has no component-scoped `<style>` blocks and no per-component `.css` file. Every rule
the plugin ships lives in exactly one file: `styles.css`, at the repository root, 18,931 lines
and 524,126 bytes measured. This reference is the ownership model for that one file, and the
honest state of its internal structure.

---

## 1. OVERVIEW

### Core Principle

Unlike a scoped-style stack (Svelte, React CSS Modules), this plugin ships one flat stylesheet
that Obsidian loads globally alongside the plugin's `main.js`. Every `.db-*` and
`.note-database-*` rule any renderer's output can match lives in this single file — there is no
second place to look, and no "this component owns its own CSS" escape hatch.

### When to Use

- Adding or editing any CSS rule for the plugin
- Deciding whether a new class name has anywhere to live besides `styles.css`
- Considering whether to split `styles.css` into multiple files
- Reasoning about load order or cascade inside the file

### Key Sources

- `styles.css` — the one stylesheet, 18,931 lines
- `esbuild.config.mjs` — confirms no CSS bundling step; Obsidian loads `styles.css` directly
  alongside `main.js` per the manifest convention, not through the JS bundle
- `002-repo-convention-audit/audit.json` → `styles` — the measured counts cited below

---

## 2. THE ONE FILE

There is no second home for a plugin rule. A renderer written in `src/views/` never carries a
`<style>` block, a CSS Module import, or a styled-components call — grep any `*Renderer.ts` file
and the only styling touch points are `el.addClass(...)` / `el.createDiv({ cls: "..." })` calls
that reference class names defined in `styles.css`. If a class a renderer emits has no matching
rule in `styles.css`, it renders unstyled — there is no scoped fallback to catch it.

---

## 3. INTERNAL STRUCTURE — MEASURED, NOT ASPIRATIONAL

`styles.css` opens with a 312-line Chinese-language (CJK) CSS-property cheat sheet — a quick
reference to common properties (`display: flex / grid`, `position: sticky`, Obsidian's own CSS
variable names) written for the plugin's original, non-English-speaking maintainer workflow.
This is a real, pre-existing convention in the shipped file, not a placeholder and not the
numbered box-drawing grammar `comment-grammar.md` documents as target-state. The file also
carries 65 `===`-style banner comments (`/* ====... N. Section Name ... ==== */`) marking major
sections, but zero true box-drawing rule characters (`─`) — `boxDrawingRules: 0` in the measured
audit. Do not describe the CJK preamble as broken or as something this packet's later phases
silently replace; state which convention a given passage of the file follows before proposing a
change to it.

---

## 4. DISTINCT CLASSES AND ORPHANS

The file defines 1,196 distinct `.db-*` classes and 11 distinct `.note-database-*` classes
(measured). Of the 1,196 `.db-*` classes, 427 are referenced by at least one screenshot fixture
and 769 are referenced by none — "orphaned" in the sense that no fixture photographs them, not
necessarily dead in the running plugin, since the real renderers (not fixtures) emit many classes
the fixture harness never exercises. See `db-class-naming.md` for the full grammar and what an
edit must not silently orphan.

---

## 5. SPLITTING THE FILE — AN OPERATOR DECISION

A later target convention (see `comment-grammar.md` §4) proposes numbered box-drawing sections
across all 18,931 lines. Whether the file then stays one section-annotated file or is split into
several is explicitly an operator decision, not one this packet or its later phases make
unilaterally — a split changes the load order the vitest suites and the screenshot capture
harness both depend on (`tools/screenshots/capture.mjs` loads `styles.css` as one `<style>`
block per capture; `src/views/screenshot-fixtures.test.ts` reads it as one file via
`readFileSync`). Document a proposed split; do not execute one without that decision being made
explicit first.

---

## 6. RELATED REFERENCES

- `db-class-naming.md` — the `.db-*` grammar this file's rules must satisfy.
- `comment-grammar.md` — the CJK preamble versus the target box-drawing section grammar.
- `screenshot-harness.md` — how the fixture harness loads this file for a capture.
