---
title: "Cluster and classify"
description: "OKLCH color space clustering groups extracted colors into named roles, and L1-L4 stability classification gates which tokens enter DESIGN.md."
trigger_phrases:
  - "OKLCH color clustering"
  - "token stability classification"
  - "L1 L2 L3 L4 tokens"
  - "color role naming"
  - "cluster tokens by stability"
importance_tier: "normal"
version: 1.0.0.6
---

# Cluster and classify (cluster.ts / types.ts)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Transforms the raw color data from `tokens.json` into a stability-gated token set ready for DESIGN.md composition. Colors are clustered in the OKLCH color space into named roles (brand, semantic, surface, border, text, interactive). Each token then receives an L1 through L4 stability classification that governs whether and where it appears in the final document. This is the gating stage between raw extraction and publication: colors without a classification cannot reach DESIGN.md.

---

## 2. HOW IT WORKS

### OKLCH color clustering

`cluster.ts` reads the extracted color tokens and converts each hex value to OKLCH coordinates (lightness, chroma, hue). Colors within a defined perceptual-distance threshold are grouped into a shared role. The algorithm avoids splitting visually identical colors across roles and keeps the role count manageable for DESIGN.md authoring. Roles follow the taxonomy in `references/color-role-taxonomy.md`: brand colors, semantic role colors (success, error, warning, info), surface colors, border colors, text ladder colors, and interactive-state colors.

### Stability classification (L1-L4)

After clustering, each token receives a stability class. The heuristic is deterministic and defined in `types.ts`:

- **L1 (Permanent)**: colors that appear at high frequency with low variance across pages and viewports. Logo colors, brand-defining typefaces, core border radii. These represent brand identity that rarely changes.
- **L2 (System)**: semantic colors, spacing scale values, shadow tokens, typography hierarchy values. These represent the stable design system.
- **L3 (Campaign)**: hero-section gradient endpoints, seasonal accent colors, launch-specific background treatments. These are temporary and tagged with the extraction date.
- **L4 (Content)**: colors derived from images, hero photographs, product thumbnails, or single-use text treatments. These are one-off values that do not represent a design rule.

### Coverage-election pre-gate

Before boundary disambiguation, a coverage gate caps low-reach colors. A color appearing on under 30% of the crawled pages is treated as a one-off rather than a site-wide system color: even when its frequency would otherwise elect it to L1 (permanent) or L2 (system), it is capped at L3 (campaign). This stops a single-page or hero-only color from being promoted into the main sections on frequency alone.

### Boundary disambiguation

When a token straddles the L2/L3 or L3/L4 boundary, the classifier assigns the higher (more restrictive) class. An L2/L3 boundary token becomes L3; an L3/L4 boundary token becomes L4 and is excluded. Tokens on the L1/L2 boundary become L2. This conservative rule prevents campaign colors from leaking into main sections and content colors from appearing at all.

### DESIGN.md gating

The classification drives the write-phase gating:

- L1 and L2 tokens populate the main token sections.
- L3 tokens appear in the `Current Campaign Colors` sub-table with a "Subject to change" annotation.
- L4 tokens are excluded entirely from DESIGN.md.

### Incremental extraction

`mergeTokenSets` (exported from `cluster.ts`) supports incremental extraction: when `extract.ts` runs with `--merge-with <prior-tokens.json>`, the prior token set is merged with the fresh run, deduplicated, and re-clustered so a re-crawl refines rather than replaces the existing tokens.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `backend/scripts/cluster.ts` | Script | OKLCH color space clustering engine, role assignment, stability heuristic |
| `backend/scripts/types.ts` | Shared | Token type definitions, L1-L4 classification enum, interface contracts |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `backend/tests/cluster.test.ts` | Automated test | Color parsing, px-value extraction, and cluster classification unit tests |

---

## 4. SOURCE METADATA

- Group: CLUSTER AND CLASSIFY
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `cluster-classify/cluster-classify.md`

Related references:
- [references/color-role-taxonomy.md](../../references/color-role-taxonomy.md) — color role naming conventions and hierarchy
- [extract.md](../extract/extract.md) — the extraction phase that produces tokens consumed by the cluster
- [write-design-md.md](../write-design-md/write-design-md.md) — the write phase that applies stability gating
