# Context Index — Folder Provenance Bridge

This phase parent is the sk-doc skill-routing history. It began as a narrow
`create-*` packet-routing alignment and grew, over twenty-one children, into a
skill-wide routing-correctness program. Rename history, the old→new path map, the
workstream grouping, and the historic synthesis are recorded here so `spec.md` stays
free of reorganization narrative.

## Rename history

| When | Identity | Note |
|---|---|---|
| Earlier | `sk-doc/031-...` | The routing-alignment packet before renumbering |
| Renumber | `sk-doc/019-sk-doc-router-alignment` | Renumbered 031 → 019; per-file history preserved |
| Metadata drift | self-ID'd as `018-sk-doc-router-alignment` | The generated metadata and parent spec lagged, still describing the narrow original `018` create-* work |
| This rename | `sk-doc/019-skill-routing-refactor` | Renamed to its true scope; parent `spec.md`, `context-index.md`, and all generated metadata regenerated; the flat `001-021` filesystem kept and grouped narratively (below) |

All moves used `git mv`, so per-file history is preserved (`git log --follow` traces
back through the rename and the earlier `031 → 019` renumber).

## Old → new path map

**Parent:** `019-sk-doc-router-alignment/` → `019-skill-routing-refactor/`

**Surgical child renames (8 of 21)** — only the genuinely unclear names changed; the
opaque `p0/p1/p2` severity prefixes were dropped and the subject named:

| Old child | New child |
|---|---|
| `001-audit-and-fix-map` | `001-router-audit-and-fix-map` |
| `002-p0-collision-fixes` | `002-router-collision-fixes` |
| `003-p1-trigger-scoping-and-handoffs` | `003-trigger-scoping-and-handoffs` |
| `004-p2-standardization-and-regen` | `004-router-standardization-and-regen` |
| `005-smart-routing-mechanism-notes` | `005-create-skill-smart-routing-notes` |
| `006-router-conformance-gap-analysis` | `006-create-skill-router-marker-gap` |
| `008-create-benchmark-routing` | `008-create-benchmark-routing-fix` |
| `009-packet-smart-routing-conformance` | `009-create-packet-routing-conformance` |

**Kept as-is (13 of 21):** `007`, `010`–`021` — already clear; renaming them would
have multiplied reference churn for no gain.

## Workstream grouping

The flat `001-021` filesystem is preserved; the grouping below is how `spec.md`'s phase
map and this bridge present the children.

| Group | Children | Theme |
|---|---|---|
| A — Router audit and fixes | 001-004 | Trigger-ownership audit, collision fixes, trigger scoping/handoffs, standardization + registry regen |
| B — create-skill routing conformance | 005-009 | Smart-routing postures, router-marker gap, hub keyword coverage, create-benchmark fix, packet conformance |
| C — Benchmark-driven routing research and fixes | 010-014 | sk-doc + advisor research, their planned fixes, and the typed benchmark-harness wiring |
| D — Per-hub routing research | 015-019 | sk-code, sk-design, system-code-graph, system-deep-loop, sk-prompt typed-pair measurement |
| E — Router-unification program | 020 | Nested program: 3-tier standard, defaultMode policy, unified compiled-routing runtime (7 children) |
| F — Documentation-quality program | 021 | Nested program: metadata, templates, READMEs, tooling, review remediation (11 children) |

> **Nested topology (why the child counts understate the tree).** Groups E and F are
> multi-level. Group E's `020` has 7 direct children, but its `007-unified-refactor-implementation`
> is itself a sub-parent spanning `000`–`015` (17 physical folders — `012` appears twice, a
> pre-existing **duplicate-prefix collision**: `012-cutover-hardening` + `012-default-on-decision`,
> both intentional). Inside `007`, four children are their own sub-parents:
> `005-calibration` (3), `006-parent-hub-rollout` (3), `009-non-hub-rollout` (4), and
> `015-routing-coverage-activation-verification` (14). Treat the flat "7 children / 11 children"
> annotations as direct-child counts, not leaf totals; resume by walking each nested parent's own
> `graph-metadata.json`.

## Historic synthesis

**A+B — from packet corrections to routing conformance (001-009).** Phases 001-004
audited the routing sources, mapped the fixes, corrected routing ownership and triggers,
standardized the ten packet contracts, and synchronized both router JSON projections with
zero drift. Phases 005-006 documented flat-resource routing postures and established from
live checker output that the residual router-marker warnings were advisory, not defects.
Phases 007-008 closed hub-routing gaps for natural agent, changelog, and benchmark-package
prompts while preserving vocabulary synchronization and the benchmark word cap. Phase 009
extended the work into canonical create-skill section conformance, leaving nine of ten
packets passing.

**C — benchmark-driven root-causing and fixes (010-014).** Benchmark research traced
sk-doc's 20/100 result to wrong path roots, missing leaves, and over-bundling (falsifying
the proposed alias gap), while parallel skill-advisor research quantified usefulness and
isolated three correctness defects plus an unguarded metadata-hub discovery boundary. The
planned fix packets apply the typed routing contract to sk-doc, repair advisor correctness
and measurement, and wire the benchmark harness to sealed independent holdouts.

**D — per-hub typed-pair measurement (015-019).** The arc widened from sk-doc into
typed-pair measurement across five surfaces. sk-code supplied the pilot — baseline repair,
manifest-gated typed-gold derivation, and a reusable fan-out recipe — with live-mode
sampling still pending. Completed research mapped sk-design's six-mode topology,
system-code-graph's standalone leaf contract, and sk-prompt's unmeasured two-mode surface
into implementation-ready handoffs; system-deep-loop remains in progress.

**E — fleet router-unification (020).** This nested sub-program extends the arc into
fleet-wide routing consistency: a universal three-tier config standard, a researched and
shipped defaultMode policy, and two parallel out-of-box exploration lineages whose eight
deep dives were fused into one unified-router design. That design is implemented through
reversible, route-gold-gated phases that promote a compiled-routing runtime serving
byte-identically to legacy, with a fleet-wide kill-switch, while preserving destination-local
authority.

**F — documentation quality (021).** This nested sub-program extends the arc into
skill-wide documentation governance: legacy metadata cleanup, template and header
conformance, skill/mode and repo-wide code READMEs, and documentation-tooling defects.
Templates and tooling landed before authoring so later phases enforced a corrected standard;
phases 001-010 are complete and phase 011 (review remediation) remains in progress.

## Notes

- Historical research, benchmark, and lineage artifacts (`**/research/**`, `**/benchmark/**`,
  `**/lineages/**`, `*.out`, `*.log`, run configs, event logs) record their paths as-of-when-written
  and were intentionally left unchanged by the rename.
- The fleet compiled-routing cutover (Group E) is verified byte-identical to legacy and stays
  reversible; making it the fleet default is operator-gated.
- **Lifecycle-status authority.** When a parent phase-map row and a child's own status disagree,
  the child's `graph-metadata.json` is the machine-authoritative surface for automated resume and
  traversal; the parent `spec.md` rows and this bridge are human-readable intent summaries that must
  reconcile to it. A child's status is derived from its `implementation-summary.md` presence plus
  checklist completion. On conflict, trust the child graph for tooling and treat a more-advanced
  parent narrative as intent still to be reconciled downward — never the reverse.
