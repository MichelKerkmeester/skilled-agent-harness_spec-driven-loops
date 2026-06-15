---
title: "deep-loop-workflows: Feature Catalog (merged index)"
description: "Hub-level feature catalog for the deep-loop-workflows skill. Partitioned by the five modes (context, research, review, ai-council, improvement), linking to each mode's per-mode catalog. Per-mode feature IDs are preserved and never renumbered here."
trigger_phrases:
  - "deep-loop-workflows feature catalog"
  - "deep loop feature inventory"
  - "merged feature catalog"
last_updated: "2026-06-15"
---

# deep-loop-workflows: Feature Catalog (merged index)

This is the hub directory for the `deep-loop-workflows` feature surface. The skill routes a request to one of five modes over the shared `deep-loop-runtime` backend, and each mode keeps its own verbatim feature catalog under `deep-loop-workflows/<mode>/feature_catalog/`. This index links to those five per-mode catalogs and reports the merged totals. It holds no per-feature content of its own.

Per-mode feature files and their local IDs are authoritative and are never renumbered here. Read a mode's own `feature_catalog.md` for the category breakdown, implementation anchors, and the manual-testing scenario that backs each feature.

---

## 1. MODE PARTITIONS

| Mode | Per-mode catalog | Categories | Features (files on disk) |
| --- | --- | ---: | ---: |
| context | [`context/feature_catalog/feature_catalog.md`](../context/feature_catalog/feature_catalog.md) | 7 | 25 |
| research | [`research/feature_catalog/feature_catalog.md`](../research/feature_catalog/feature_catalog.md) | 4 | 16 |
| review | [`review/feature_catalog/feature_catalog.md`](../review/feature_catalog/feature_catalog.md) | 4 | 27 |
| ai-council | [`ai-council/feature_catalog/feature_catalog.md`](../ai-council/feature_catalog/feature_catalog.md) | 9 | 32 |
| improvement | [`improvement/feature_catalog/feature_catalog.md`](../improvement/feature_catalog/feature_catalog.md) | 6 | 24 |
| **Merged total** | | **30** | **124** |

Counts in the table above are file-backed (`find <mode>/feature_catalog -mindepth 2 -name '*.md' | wc -l`) so they can be reverified directly.

### Known drift (pre-existing, flagged not fixed here)

- **research**: the mode catalog's category table sums to 15 features, but 16 per-feature files exist on disk (the `01--loop-lifecycle/` category lists 6 features and carries 7 files, the extra being `fanout-dispatch.md`). The merged total above uses the file-backed count (16). Reconciling the per-mode table row is drift-reconciliation work (plan 007 T8) owned by a separate seat, not this index.

---

## 2. ID NAMESPACE POLICY

Each mode owns its own feature-ID prefix and number space. The prefixes do not collide across modes, so feature IDs need no qualification at this index:

| Mode | Feature ID family |
| --- | --- |
| context | named features grouped by the 7 capability categories |
| research | named features grouped by the 4 capability categories |
| review | named features grouped by the 4 capability categories |
| ai-council | `DAC-001..DAC-032` |
| improvement | named features grouped by the 6 capability categories (Lanes A/B/C/D) |

Where a per-feature file cross-links to its companion validation scenario, follow the link into the matching mode's `manual_testing_playbook/`. The merged playbook index lives at [`../manual_testing_playbook/manual_testing_playbook.md`](../manual_testing_playbook/manual_testing_playbook.md), which is where cross-mode `CP-` scenario IDs are mode-qualified.

---

## 3. CASING

All five mode catalogs use the lowercase filename `feature_catalog.md`. The `ai-council` catalog was normalized from the legacy uppercase `FEATURE_CATALOG.md` during governance consolidation. Per-feature `Canonical catalog source` back-links inside `ai-council/feature_catalog/**` were updated to match.
