---
title: "Design data search"
description: "A zero-dependency BM25 search over the design data sets, query-only with no generator or persistence surface."
trigger_phrases:
  - "design data search"
  - "design_search.py bm25 lookup"
  - "query the design data sets"
  - "query-only no generator no persist"
---

# Design data search (design_search.py)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A zero-dependency BM25 search over the design data sets, query-only with no generator or persistence surface.

This is the optional lookup that lets a designer find the common expected pattern for a brief quickly so they can deviate from it. It is never a required step, and the design principles remain the authority for what the interface actually becomes.

## 2. HOW IT WORKS

### Query behavior

The script runs a standard-library BM25 ranking over the search columns of a chosen data set and returns the top results in either token-optimized text or JSON. A query can target a domain explicitly, and when none is given the script auto-detects the most relevant of nine domains: style, color, chart, landing, product, ux, typography, web, and reasoning. It is invoked as `python3 scripts/design_search.py "<query>" [--domain <domain>] [--max-results <n>] [--json]`.

### Query-only guarantee

The upstream design-system generator and its persistence modes were deliberately not adopted, so there is no `--design-system` flag, no `--persist` flag, no design-system import, and no written design-system files. The script only reads the CSVs and prints results, which keeps the data in its critique-against role rather than turning it into a chooser. The ranking logic lives in a separate core module so the entry point stays a thin query and formatting wrapper.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/design_search.py` | Script | Query-only entry point with argparse, domain selection, max-results, JSON output, and result formatting. |
| `scripts/design_search_core.py` | Script | Zero-dependency BM25 implementation, CSV loading, domain config, and auto-domain detection. |
| `assets/data/styles.csv` | Shared | One of the nine data sets the search ranks over. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/manual_testing_playbook.md` | Manual playbook | ID-004 exercises a query-then-deviate flow with a negative control proving no generator or persistence mode exists. |

---

## 4. SOURCE METADATA

- Group: Critique-against data inventory
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--critique-against-data-inventory/design-data-search.md`

Related references:
- [design-data-sets.md](design-data-sets.md) - Design data sets
- [critique-against-inventory.md](critique-against-inventory.md) - Critique-against inventory framing
