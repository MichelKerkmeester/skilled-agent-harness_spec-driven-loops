---
title: Report Accessibility and Self-Containment Contract
description: The self-containment and accessibility guarantees of a create-diff HTML report, and what the report validator enforces.
trigger_phrases:
  - "create-diff report accessibility"
  - "self-contained diff report"
  - "zero javascript diff report"
  - "accessible before after report"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Report accessibility & self-containment contract

The report is meant to be reviewable by everyone, from `file://`, forever, with no dependencies. `scripts/validate_report.py` enforces the safety half of this; the guarantees below describe the whole contract.

## Self-containment (validated)

- Single HTML file. All CSS is inlined in one `<style>` block; there are no external stylesheets, fonts, scripts, or images.
- **Zero JavaScript.** No `<script>` tags and no inline event handlers (`onclick=`, etc.). The report is fully usable with scripting disabled.
- **No network.** No remote `href`/`src`. A restrictive Content-Security-Policy meta tag (`default-src 'none'; style-src 'unsafe-inline'; img-src data:; base-uri 'none'; form-action 'none'`) blocks any accidental request even if the file is opened in a browser.
- **Escaped content.** Every piece of source-document text is HTML-escaped, so a document containing markup (or a hostile `<script>`/`onerror=`) is shown as inert text, never executed.

## Accessibility

- `<html lang="en">`, semantic landmarks (`<header>`, `<main>`, `<section>` with `aria-labelledby`), and a single `<h1>`.
- A "Skip to differences" link as the first focusable element.
- The change summary is a real `<table>` with row headers (`<th scope="row">`); the diff is a `<table>` with column headers.
- **Colour is never the only signal.** Added lines carry a `+`, removed lines a `−`, in a dedicated marker column with an `aria-label` ("added"/"removed"); word-level changes are marked with `<mark>` in addition to background colour. This keeps the diff readable for colour-blind users and in monochrome.
- Contrast targets WCAG AA in both light and dark themes (`prefers-color-scheme`), using `color-scheme: light dark`.
- Relative units throughout, so browser zoom and text scaling work; content wraps (`overflow-wrap: anywhere`) rather than forcing horizontal scroll.
- Long runs of unchanged lines are collapsed to a labelled "N unchanged lines" row to keep the report scannable.

## Views

- **Unified** (default): old/new line numbers, a marker column, and content in one column.
- **Side-by-side** (`--view side-by-side`): before and after in two columns, each with its own line numbers.

Both views share the same summary, fidelity notes, and legend.

## What is not guaranteed

The report reflects the extraction tier (see `capabilities-and-fidelity.md`). For `text`/`text*` formats it shows textual change only; it does not claim to show formatting, layout, or tracked-change fidelity, and says so in the "Fidelity notes" section.
