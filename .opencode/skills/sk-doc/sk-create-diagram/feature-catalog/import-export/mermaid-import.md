---
title: "Mermaid import"
description: "Redraws a .mmd, .mermaid, or fenced Mermaid block into an editorial diagram via the mermaid_extract.py intermediate representation, without copying the renderer layout or theme."
trigger_phrases:
  - "Mermaid import"
  - "import mermaid diagram"
  - "convert mermaid source"
  - "redraw mermaid flowchart"
  - "mermaid_extract"
version: 1.0.0.0
---

# Mermaid import (mermaid_extract.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Redraws a `.mmd`, `.mermaid`, or fenced Mermaid block into an editorial diagram via the `mermaid_extract.py` intermediate representation, without copying the renderer layout or theme.

Mermaid supplies content and declared direction, not coordinates, so this is a redraw rather than a render: the extractor parses the source into a semantic IR and the agent creates a fresh layout in the packet's design system, discarding Mermaid's automatic spacing, routing, themes, classes, and styling. The caller is an agent holding a Mermaid file or Markdown with fenced Mermaid blocks, and the main failure modes are unsupported diagram kinds and malformed edges, both of which are reported rather than approximated.

---

## 2. HOW IT WORKS

### Extraction and trust boundary

`mermaid_extract.py` parses bounded text and never evaluates, renders, fetches, or executes Mermaid, JavaScript, browser content, click targets, or URLs, and it makes no network calls. Supported grammars are `flowchart`/`graph`, `sequenceDiagram`, `stateDiagram-v2`, and `erDiagram`; unsupported kinds such as `pie`, `mindmap`, `gitGraph`, `quadrantChart`, `timeline`, `C4Context`, or `sankey` are reported verbatim and never approximated. Inputs may be `.mmd`, `.mermaid`, or Markdown files containing fenced Mermaid blocks, with `--diagram` selecting an index or `all`. The digest mirrors the draw.io IR — diagram list, nodes/edges/containers, depth and cycles, shapes, type candidates, budget flags, hubs, entries, terminals, unconnected nodes, collapsible groups, and tables — plus sequence fragments and ER fields. Style directives and click handlers are counted and discarded. A malformed edge or unsupported kind exits 2 and the message is reported verbatim.

### Redraw pipeline

The agent sets the four dials from `references/output-spec.md`, then picks a target type from the grammar and digest signals (advisory: a flowchart with service topology and no decisions is really an architecture diagram). The semantic model preserves source meaning — meaningful edge labels, state guards, sequence order and fragments, ER cardinality and fields, and container membership — while discarding init themes, `style`/`classDef`/`class`/`:::class` attachments, `linkStyle`, and leading frontmatter. Declared direction (`TD`, `LR`, `RL`, `BT`) is a hint that the chosen type's layout conventions may override. The redraw starts from a blank `viewBox`, applies semantic treatments, reroutes all connections with the mandatory connector rules, and never adds a component merely to fill space.

### Delivery and fidelity ledger

The deliverable is a single self-contained `.html` checked against the taste gate and the `output-spec.md` checklist; SVG or PNG export happens only when requested. Every import ends with a fidelity ledger reporting the source count, the drawn count, and every merge, collapse, or drop. Multi-block Markdown files behave like multi-page draw.io files: with no `--diagram`, diagram 0 is inspected and the user is asked which block if not identified; `--diagram all` produces one independently type-selected output per block.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/mermaid_extract.py` | Script | Parses Mermaid text into the IR and digest with a strict trust boundary, supported-kinds reporting, size/node/edge limits, and exit code 2 for unreadable input |
| `references/import-mermaid.md` | Shared | The six-step redraw procedure, supported grammars, edge cases, and anti-patterns |
| `references/output-spec.md` | Shared | The four dials, size presets, degrade ladder, and fidelity-ledger contract |
| `assets/example-import-mermaid.html` | Shared | Shipped worked example of the procedure on a sample flowchart source |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/import-export/mermaid-import.md` | Manual playbook | Scenario IMP-002 exercises extraction via `mermaid_extract.py`, redraw without copying the renderer layout, and the fidelity ledger |
| `references/import-mermaid.md` | Reference | Anchor for the procedure and trust-boundary rules the scenario checks |

---

## 4. SOURCE METADATA

- Group: IMPORT AND EXPORT
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `import-export/mermaid-import.md`

Related references:
- [drawio-import.md](drawio-import.md) — the parallel import flow for draw.io sources via `drawio_extract.py`
- [export-guidance.md](export-guidance.md) — the manual PNG/SVG export used when the format dial asks for it
