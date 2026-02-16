---
title: "Addendum Templates"
description: "Level extension blocks used to compose final level templates."
trigger_phrases:
  - "addendum"
  - "composition"
  - "level extension"
importance_tier: "normal"
---

# Addendum Templates

Source-only files that extend core templates.

## Overview
<!-- ANCHOR:overview -->

Addendums are not copied into spec folders directly.
They are merged into `level_2`, `level_3`, and `level_3+` templates.

<!-- /ANCHOR:overview -->

## Composition Model
<!-- ANCHOR:composition-model -->

| Level | Composition |
|---|---|
| 1 | Core only |
| 2 | Core + `level2-verify` |
| 3 | Level 2 + `level3-arch` |
| 3+ | Level 3 + `level3plus-govern` |

<!-- /ANCHOR:composition-model -->

## Contents
<!-- ANCHOR:contents -->

| Folder | Adds |
|---|---|
| `level2-verify/` | NFRs, edge cases, verification scaffolding |
| `level3-arch/` | architecture/risk/dependency content |
| `level3plus-govern/` | governance, compliance, approval sections |

<!-- /ANCHOR:contents -->

## Workflow Notes
<!-- ANCHOR:workflow-notes -->

- Copy from `../level_N/` for real specs.
- Keep addendums aligned with current level architecture.
- When sections move between levels, update both addendum source and affected level README.

<!-- /ANCHOR:workflow-notes -->

## Related
<!-- ANCHOR:related -->

- `../README.md`
- `../core/README.md`
- `../../references/templates/template_guide.md`

<!-- /ANCHOR:related -->
