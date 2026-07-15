---
title: Capabilities and Fidelity Tiers
description: Which document formats create-diff supports, the full/text/conditional fidelity tiers, the format matrix, and the optional PDF extractor dependency.
trigger_phrases:
  - "create-diff supported formats"
  - "document diff fidelity tiers"
  - "docx pdf diff support"
  - "pdf extractor dependency"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Capabilities & fidelity tiers

A diff is only as trustworthy as the extraction behind it. `create-diff` tells the user what tier a comparison is at, so a limited result is never mistaken for a complete one. Run `python3 ../scripts/create_diff.py capabilities` (from the packet dir) to see the live matrix and which PDF extractor, if any, is available.

## Tiers

| Tier | Meaning |
| --- | --- |
| `full` | Exact text comparison; nothing is dropped. |
| `text` | Visible/structural text only; formatting, styling, and non-text content are not compared. |
| `text*` | Text layer only, and only when an optional extractor is installed. |
| `unsupported` | No reliable local extraction available. |

## Format matrix

| Format | Extensions | Tier | Compared | Not compared |
| --- | --- | --- | --- | --- |
| text | `.txt`, `.text`, `.log`, `.csv`, unknown text-like | `full` | exact text | — |
| markdown | `.md`, `.markdown`, `.mdown` | `full` | exact text + heading/section list | rendered-HTML output differences |
| html | `.html`, `.htm`, `.xhtml` | `text` | visible text, `<h1>`–`<h6>` headings | CSS, attributes, inline styles, `<script>`/`<style>` content, layout |
| docx | `.docx` | `text` | paragraph and table text, heading-styled paragraphs | run formatting, styles, images, comments, tracked changes |
| pdf | `.pdf` | `text*` | extracted text layer | layout, fonts, images; scanned/image-only pages |

Unknown *text-like* extensions are treated as plain text, and the report states that assumption so it can be corrected. Binary or unsupported formats — spreadsheets, presentations, images, and archives (`.xlsx`, `.pptx`, `.png`, `.zip`, …), or any file whose bytes are binary — are refused with exit `3` rather than raw-byte "text"-diffed into a meaningless report.

## PDF dependency

Text-PDF support needs one local extractor, probed in this order:

1. **`pdftotext`** (poppler) — on `PATH`. On macOS: `brew install poppler`.
2. **`pypdf`** — `pip install pypdf`.
3. **`pdfplumber`** — `pip install pdfplumber`.

If none is present, `compare`/`compare-pair` on a PDF exits `3` with an actionable message. The fallback is to extract the text yourself and run `compare-pair --before old.txt --after new.txt`.

## Scanned PDFs

A PDF with no text layer (a scan/image) extracts to empty text. The engine detects this and adds a prominent warning to the report rather than presenting an empty, misleading diff. OCR is deliberately out of scope for this mode.

## Normalization

Before diffing, both sides are canonicalized so incidental encoding differences are not reported as edits: Unicode NFC, `\r\n`/`\r` → `\n`, and trailing whitespace stripped per line. Structural content (headings/sections) is surfaced in the summary but does not change the text comparison.
