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
version: 1.1.1.0
---

# Report accessibility & self-containment contract

## 1. OVERVIEW

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
- **Colour is never the only signal.** Added lines carry a `+`, removed lines a `−`, in a dedicated marker column with an `aria-label` ("added"/"removed"). Word-level changes use `<mark>` with a non-colour decoration in addition to the background tint — inline additions are underlined and inline removals are struck through — so the exact changed substring stays distinguishable for colour-blind users and in monochrome, not only in forced-colours mode.
- Contrast targets WCAG AA in both light and dark themes (`prefers-color-scheme`), using `color-scheme: light dark`.
- Relative units govern typography and content/column sizing so browser zoom and text scaling work (the 4px spacing scale, hairline borders, and radii use fixed pixel tokens). In the **unified** view, content wraps (`overflow-wrap: anywhere`) so the page itself never scrolls sideways. The **side-by-side** view keeps its two code columns aligned inside a scoped `overflow-x: auto` container that is given a `min-width`, so on a narrow viewport that diff region actually scrolls horizontally instead of collapsing the columns — while the surrounding page (header, summary, legend, footer) still reflows and never forces the whole document to scroll. That scroll container is keyboard-operable: it is a labelled `role="region"` with `tabindex="0"` and a visible focus ring, so a keyboard-only user can focus and scroll it.
- Long runs of unchanged lines are collapsed to a labelled "N unchanged lines" row to keep the report scannable.
- In validated aggregate reports, every file transition remains visible as a full-width table row group. `START FILE` is the strongest transition, `END FILE` explicitly closes the group, and both include the escaped path as visible text so color is never the only signal. Every file after the first receives a 32px canvas-colored spacer row marked `aria-hidden="true"`; that gap also masks the frame edges at its sides, so it reads as open whitespace without adding empty navigation to the accessibility tree. Boundary rows also reset Markdown section context, preventing a heading from one file from labelling changes in the next.

## Views

- **Unified** (default): old/new line numbers, a marker column, and content in one column.
- **Side-by-side** (`--view side-by-side`): before and after in two columns, each with its own line numbers. The two-column grid is held in a scoped horizontal-scroll region so columns stay aligned rather than wrapping into each other on narrow viewports.

Both views share the same summary, fidelity notes, and legend.

## What is not guaranteed

The report reflects the extraction tier (see `capabilities-and-fidelity.md`). For `text`/`text*` formats it shows textual change only; it does not claim to show formatting, layout, or tracked-change fidelity, and says so in the "Fidelity notes" section.
