---
title: Theme Variables and the Runtime Stand-Ins
description: The Obsidian host CSS custom properties styles.css consumes but never declares, and how tools/screenshots/theme.css and runtime-vars.css stand in for both the host theme and the plugin's own JavaScript-measured values.
trigger_phrases:
  - "obsidian theme css variables"
  - "background-primary text-normal interactive-accent"
  - "runtime-vars.css stand in"
  - "db-table-header-top sticky offset"
  - "note-database-container root inheritance"
importance_tier: normal
contextType: implementation
version: 0.1.0.0
---

# Theme Variables and the Runtime Stand-Ins

`styles.css` reads a set of CSS custom properties it never declares — Obsidian supplies them at
runtime from the active theme. This reference is that variable set, and the two files that stand
in for them when the plugin is captured outside a running Obsidian instance.

---

## 1. OVERVIEW

### Core Principle

The plugin's own `.db-*` rules resolve colors, spacing, and typography through `var(--obsidian-
supplied-name)` rather than literal values, so the plugin re-themes automatically with the host.
Outside a running Obsidian window (in the screenshot harness), nothing declares those variables
unless something stands in for them — that stand-in is `tools/screenshots/theme.css`.

### When to Use

- Adding a rule to `styles.css` and choosing which Obsidian variable to key off
- A screenshot capture renders with wrong colors, spacing, or an unstyled form control
- Distinguishing an Obsidian-supplied variable from one the plugin sets itself at runtime
- Extending `theme.css` or `runtime-vars.css` for a new surface

### Key Sources

- `tools/screenshots/theme.css` — the Obsidian host-theme stand-in
- `tools/screenshots/runtime-vars.css` — the plugin's own JavaScript-measured stand-in
- `styles.css` — the consumer of both variable sets

---

## 2. OBSIDIAN-SUPPLIED VARIABLES (`theme.css` stands in)

Obsidian declares these at the app level; the plugin only reads them. `theme.css`'s header
comment states the reason for its existence plainly: without a stand-in, every `var()` call falls
back to an unstyled default and a capture stops resembling the real surface. Values in `theme.css`
track Obsidian's default light and dark themes:

| Variable | Purpose |
| --- | --- |
| `--font-interface`, `--font-text`, `--font-monospace` | the three font stacks |
| `--background-primary`, `--background-primary-alt` | main surface background |
| `--background-secondary`, `--background-secondary-alt` | card/toolbar background |
| `--background-modifier-border`, `--background-modifier-border-hover` | borders |
| `--background-modifier-hover`, `--background-modifier-active-hover` | interaction states |
| `--background-modifier-error`, `--background-modifier-success` | status colors |
| `--text-normal`, `--text-muted`, `--text-faint`, `--text-accent` | text color scale |
| `--interactive-accent` | the primary accent (buttons, active states) |
| `--file-line-width` | editor line width, default `760px` |

`theme.css` also supplies baseline styling for bare form controls (native `<input>`, `<select>`,
`<button>`) that Obsidian's own CSS resets and styles at the app level — without it, form controls
inside a capture render with browser-default chrome instead of Obsidian's.

---

## 3. PLUGIN-SUPPLIED RUNTIME VALUES (`runtime-vars.css` stands in)

A second set is declared by the plugin's own JavaScript, measured from the live DOM layout at
runtime (toolbar height, column widths, timeline geometry) — these do not exist when `styles.css`
loads standalone, so `runtime-vars.css` supplies capture-appropriate defaults:

| Variable | Stand-in value | Why |
| --- | --- | --- |
| `--db-table-header-top` | `22px` | sticky offset; resolves to `0` in the real plugin only when a toolbar sits above the table — a capture with no toolbar needs the same effective result |
| `--db-selection-status-offset` | `0px` | no active selection status bar in a static capture |
| `--db-group-table-head-top` | `0px` | matches the no-toolbar-above assumption |
| `--db-header-height` | `40px` | measured toolbar height stand-in |
| `--db-layer-sticky` | `25` | z-index tier |
| `--db-board-column-width` | `280px` | board column width the plugin otherwise computes |
| `--db-card-field-width` | `120px` | card field column width |
| `--db-gallery-card-width` | `220px` | gallery card width |

**Load order matters.** `runtime-vars.css` loads AFTER `styles.css` in `capture.mjs`'s
`buildPage(...)` so it wins the cascade against the plugin's own `:root` defaults for these same
properties. It targets both `:root` and `.note-database-container` — a custom property inherits
from the nearest ancestor that declares it, so a `:root`-only override never reaches an element
the plugin sets the property on directly on `.note-database-container`.

---

## 4. THE STICKY-HEADER CASE — WHY THIS MATTERS CONCRETELY

The clearest example of what happens without a stand-in: the sticky table header's CSS declares a
default `top` offset assuming a toolbar sits above it. A capture with no running plugin has no
such toolbar, so the stylesheet's own default would offset the header downward and cover the
first data row. `runtime-vars.css`'s `--db-table-header-top: 22px` supplies the value a capture
implies (no toolbar above, so the header sticks at a small fixed offset) rather than the value the
live plugin computes.

---

## 5. WHEN A CAPTURE LOOKS WRONG

Before filing a rendering issue found in a capture as a plugin defect, check whether it is a gap
in `theme.css` or `runtime-vars.css` instead — a surface that reads an Obsidian variable or a
plugin-runtime variable neither file supplies falls back to the browser default, which usually
looks broken but proves nothing about the shipped plugin. See `screenshot-harness.md` §5 for the
full stand-in discipline.

---

## 6. RELATED REFERENCES

- `screenshot-harness.md` — the capture pipeline these two files feed into.
- `stylesheet-ownership.md` — where the plugin's own `.db-*` rules that consume these variables
  live.
- `mobile-and-touch.md` — the `is-phone` body class, the third runtime signal captures must set.
