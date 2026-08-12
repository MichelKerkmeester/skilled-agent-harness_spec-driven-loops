---
title: "references/import-export: Redraw and Export Procedures"
description: "Index of the draw.io redraw, Mermaid redraw, and PNG/SVG export procedures."
importance_tier: normal
trigger_phrases:
  - "diagram import export index"
  - "drawio mermaid export procedures"
contextType: general
version: 1.0.0.0
---

# references/import-export

The redraw procedures for import requests, and the manual export procedure.

---

## 1. OVERVIEW

Import requests route by source extension to one of the two redraw procedures below; both build on the IR extractors in [`../../scripts/`](../../scripts/). Export is always a separate, manual step — never automatic after a generate or import.

---

## 2. FILES

| File | Purpose |
|---|---|
| `import-drawio.md` | The draw.io redraw procedure: extract via `drawio_extract.py`, set the four dials, select a type, redraw, report the fidelity ledger. |
| `import-mermaid.md` | The Mermaid redraw procedure: extract via `mermaid_extract.py` under a strict trust boundary, then the same dial/select/redraw/ledger flow. |
| `export.md` | The manual PNG/SVG export procedure from a generated HTML diagram. |

---

## 3. RELATED

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Request-shape routing (generate / import / export). |
| [`../foundations/output-spec.md`](../foundations/output-spec.md) | The four output dials and degrade ladder both redraw procedures apply. |
| [`../../scripts/README.md`](../../scripts/README.md) | The two extractor CLIs these procedures call. |
