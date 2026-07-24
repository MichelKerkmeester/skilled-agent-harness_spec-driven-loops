# Context Index — Folder Provenance Bridge

This bridge records the packet's identity history and the completed folder
restructuring. The current topology is authoritative on disk: one research
phase parent, fifteen numbered implementation/program children, and the nested
topologies documented below.

## Rename history

| When | Identity | Note |
|---|---|---|
| Earlier | `sk-doc/031-...` | The routing-alignment packet before renumbering |
| Renumber | `sk-doc/019-sk-doc-router-alignment` | Renumbered 031 → 019; per-file history preserved |
| Metadata drift | self-ID'd as `018-sk-doc-router-alignment` | Generated metadata and the parent spec lagged while describing the narrow create-* work |
| Scope rename | `sk-doc/019-skill-routing-refactor` | The packet's scope became the complete skill-routing program |
| Structure migration | `019-skill-routing-refactor/001-research` plus `002`–`016` | Research was consolidated and the remaining top-level phases were renumbered; all moves were completed with `git mv` before this content repair |

## Old → new path map

### Parent and surgical child renames

| Old path | New path |
|---|---|
| `019-sk-doc-router-alignment/` | `019-skill-routing-refactor/` |
| `001-audit-and-fix-map` | `002-router-audit-and-fix-map` |
| `002-p0-collision-fixes` | `003-router-collision-fixes` |
| `003-p1-trigger-scoping-and-handoffs` | `004-trigger-scoping-and-handoffs` |
| `004-p2-standardization-and-regen` | `005-router-standardization-and-regen` |
| `005-smart-routing-mechanism-notes` | `006-create-skill-smart-routing-notes` |
| `006-router-conformance-gap-analysis` | `007-create-skill-router-marker-gap` |
| `008-create-benchmark-routing` | `009-create-benchmark-routing-fix` |
| `009-packet-smart-routing-conformance` | `010-create-packet-routing-conformance` |

### Research consolidation

The former top-level research packets now live under `001-research/`.

| Former location | Current location |
|---|---|
| `010-sk-doc-routing-research` | `001-research/001-sk-doc-routing-research` |
| `011-skill-advisor-routing-research` | `001-research/002-skill-advisor-routing-research` |
| `016-sk-design-routing-research` | `001-research/003-sk-design-routing-research` |
| `017-system-code-graph-routing-research` | `001-research/004-system-code-graph-routing-research` |
| `018-system-deep-loop-routing-research` | `001-research/005-system-deep-loop-routing-research` |
| `019-sk-prompt-routing-research` | `001-research/006-sk-prompt-routing-research` |
| `020/002-default-mode-policy-research` | `001-research/007-default-mode-policy-research` |
| `020/004-oob-glm-parallel-research` | `001-research/008-oob-glm-parallel-research` |
| `020/005-oob-idea-deep-dives` | `001-research/009-oob-idea-deep-dives` |
| `020/006-unified-refactor-research` | `001-research/010-unified-refactor-research` |

### Top-level renumbering

| Old phase | New phase |
|---|---|
| `001-router-audit-and-fix-map` | `002-router-audit-and-fix-map` |
| `002-router-collision-fixes` | `003-router-collision-fixes` |
| `003-trigger-scoping-and-handoffs` | `004-trigger-scoping-and-handoffs` |
| `004-router-standardization-and-regen` | `005-router-standardization-and-regen` |
| `005-create-skill-smart-routing-notes` | `006-create-skill-smart-routing-notes` |
| `006-create-skill-router-marker-gap` | `007-create-skill-router-marker-gap` |
| `007-hub-intent-keyword-coverage` | `008-hub-intent-keyword-coverage` |
| `008-create-benchmark-routing-fix` | `009-create-benchmark-routing-fix` |
| `009-create-packet-routing-conformance` | `010-create-packet-routing-conformance` |
| `012-sk-doc-routing-fixes` | `011-sk-doc-routing-fixes` |
| `013-skill-advisor-routing-fixes` | `012-skill-advisor-routing-fixes` |
| `014-benchmark-harness-typed-wiring` | `013-benchmark-harness-typed-wiring` |
| `015-sk-code-router-alignment` | `014-sk-code-router-alignment` |
| `020-router-unification-program` | `015-router-unification-program` |
| `021-documentation-quality-program` | `016-documentation-quality-program` |

### Router-unification internal renumbering

The former `020-router-unification-program` research children are now in the
shared research parent. Its remaining children are directly under `015`.

| Former location | Current location |
|---|---|
| `020/001-3-tier-consistency-standard` | `015/001-3-tier-consistency-standard` |
| `020/003-default-mode-implementation` | `015/002-default-mode-implementation` |
| `020/007-unified-refactor-implementation` | `015/003-unified-refactor-implementation` |

## Workstream grouping

| Group | Current children | Theme |
|---|---|---|
| A — Router audit and fixes | `002`–`005` | Trigger ownership, collision fixes, handoffs, standardization, and registry regeneration |
| B — create-skill routing conformance | `006`–`010` | Smart-routing posture, marker gap, keyword coverage, benchmark routing, and packet conformance |
| C — Benchmark and typed-pair routing fixes | `011`–`014` | sk-doc and advisor fixes, typed benchmark wiring, and the sk-code measurement pilot |
| D — Consolidated research | `001-research` | Ten research lineages covering benchmark, per-hub, defaultMode, out-of-box, and unified-refactor questions |
| E — Router-unification program | `015` | Three-tier standard, defaultMode implementation, and unified-router implementation |
| F — Documentation-quality program | `016` | Metadata, templates, READMEs, tooling, validators, and review remediation |

## Nested topology

`015-router-unification-program/` now has exactly three direct children: `001`,
`002`, and `003`. Its former research children are the research children
`001-research/007`–`010`; research readers should start at `../001-research/`.

The `015/003-unified-refactor-implementation/` sub-parent retains its internal
`000`–`015` children unchanged. Its nested
`015-routing-coverage-activation-verification/001-research` remains inside that
subtree and is unrelated to the top-level `001-research` phase parent.

The `001-research/009-oob-idea-deep-dives/` sub-parent retains its eight idea
children `001`–`008`.

## Historic synthesis

**Groups A+B — packet corrections to routing conformance (`002`–`010`).** The
renumbered phases audited the routing sources, corrected ownership and triggers,
standardized the packet contracts, closed hub-routing gaps, and normalized the
create-skill documentation contract.

**Group C — benchmark and typed-pair fixes (`011`–`014`).** Research children
`001-research/001` and `001-research/002` provide the sk-doc and advisor root
causes. Phases `011`–`013` carry the corresponding implementation and benchmark
work, while `014` is the sk-code typed-pair measurement pilot.

**Group D — consolidated research (`001-research`).** Children `003`–`006`
cover per-hub routing surfaces. Children `007`–`010` cover defaultMode policy,
the parallel out-of-box lineage, the eight idea dives, and the unified-router
synthesis. All ten lineages now share one research parent and their child
handoffs point to the current implementation phases.

**Group E — router-unification (`015`).** The program now reads as a three-child
arc: the fleet consistency standard, the shipped defaultMode implementation,
and the unified-refactor implementation. The compiled-routing cutover is
default-on and remains reversible through its documented kill-switch.

**Group F — documentation quality (`016`).** The documentation-quality program
continues to own metadata, templates, READMEs, tooling, and review remediation
through its eleven children.

## Notes

- Research, benchmark, and lineage artifacts retain their original evidence and
  iteration content; only structural cross-references and parent pointers were
  repaired in this migration pass.
- The fleet compiled-routing cutover is verified byte-identical to legacy and
  remains reversible. The formal default-on decision is in
  `015/003/012-default-on-decision`.
- When a parent phase-map row and a child's status disagree, the child's
  `graph-metadata.json` is machine-authoritative for resume and traversal. The
  parent map and this bridge are human-readable summaries that must be reconciled
  to it.
