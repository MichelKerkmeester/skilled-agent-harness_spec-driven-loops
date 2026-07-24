# Context Index — Router-Unification Program

> Migration bridge for this reorganized phase parent. The former fleet-routing
> program was renumbered from `020` to `015`, and its research children moved to
> the sibling `../001-research/` parent so the
> whole storyline — fleet consistency → defaultMode → out-of-box exploration →
> unified refactor — reads as one historic-to-current arc. This file exists so
> links and memory that referenced the old packets can be traced; the `spec.md`
> stays free of migration narrative per phase-parent content discipline.

## Old → New Mapping

| Former packet (under `019-skill-routing-refactor/`) | New location (also under `019-skill-routing-refactor/`) |
|------------------------------------------------------|--------------|
| `020-fleet-routing-consistency` | `015-router-unification-program/001-3-tier-consistency-standard` |
| `021-default-mode-policy-research` | `../001-research/007-default-mode-policy-research` |
| `022-default-mode-implementation` | `015-router-unification-program/002-default-mode-implementation` |
| `023-oob-glm-parallel` | `../001-research/008-oob-glm-parallel-research` |
| `024-oob-idea-deep-dives/001-008` (the 8 idea dives) | `../001-research/009-oob-idea-deep-dives/001-008` |
| `024-oob-idea-deep-dives/009-unified-refactor-research` | `../001-research/010-unified-refactor-research` |
| `024-oob-idea-deep-dives/010-unified-refactor-implementation` | `015-router-unification-program/003-unified-refactor-implementation` |
| `024-oob-idea-deep-dives` (the former parent) | `015-router-unification-program` (this parent) |

## What changed in the consolidation

- **Renames preserve git history** (`git mv`, `R`-status) — every doc's lineage is intact.
- **Superseded debris dropped**: `021/run1-archive` (superseded by run 2) and pre-crosscut / failed / attempt re-run scratch dirs under the idea dives.
- **Kept verbatim as historic evidence**: the substantive research under `002-default-mode-policy-research/` (including `run2-archive/`, the canonical 20-iteration defaultMode study) and the `004-oob-glm-parallel-research/` lineage.
- **Distilled, not kept raw**: the per-idea 5-iteration deep-research iterations under the eight `005-oob-idea-deep-dives/` children were folded into each idea's `presentation.md`; the raw iteration logs were not retained.
- The single tracked external reference (the `019` parent's `graph-metadata.json` child list) was updated; ephemeral gate-state caches were left to regenerate.

## Current three-child topology

| Child | Former location | Current role |
|---|---|---|
| `001-3-tier-consistency-standard` | `020/001` | Fleet-wide three-tier routing standard |
| `002-default-mode-implementation` | `020/003` | Shipped defaultMode policy implementation |
| `003-unified-refactor-implementation` | `020/007` | Phased unified-router implementation and activation |

The defaultMode, GLM, idea-dive, and unified-refactor research readers should start at
`../001-research/`, specifically children `007`–`010`. This parent contains exactly
three direct children; the nested `003` child retains its internal `000`–`015`
topology, including its nested `015-routing-coverage-activation-verification/001-research`.
