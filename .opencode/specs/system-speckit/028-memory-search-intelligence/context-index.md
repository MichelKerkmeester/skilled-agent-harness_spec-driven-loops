# Context Index — Packet 028 Migration Bridge

> Migration record and consolidated work summary for `028-memory-search-intelligence`.
> The parent `spec.md` holds root purpose only; this file holds the reorganization
> narrative and a summary of the memory-search-engine and data-quality work.

## 1. Subsystem extraction (2026-07-06)

Three subsystems that had accreted under 028 were extracted to their own top-level
sibling packets, keeping their internal phase numbering.

### Batch 1 — primary clusters

| From (028) | To | Notes |
|---|---|---|
| `002-code-graph/` (parent + 11 children) | `system-code-graph/001-code-graph-core/` | seeded the empty packet root |
| `004-deep-loop/` (parent + 6 children + `007` sub-parent + 4) | `system-deep-loop/038-deep-loop-runtime/` | reconciled the stale root children_ids (real 036/037 added) |
| `002-skill-advisor/` phases 001-008 (parent) | `system-skill-advisor/002-skill-advisor-runtime/` | `001-hard-rule-and-dispatch-preflight-hardening` HELD in 028 (in-progress follow-up) |

### Batch 2 — scattered subsystem children (from the cross-cutting 007/008 suites)

| Subsystem | From | To |
|---|---|---|
| code-graph | `007-.../005-codegraph-seeded-ppr`, `.../006-codegraph-edge-lifecycle`, `.../007-graduation-follow-ups/001-codegraph-defaults-bitemporal`; `008-.../011-code-graph-doc-audit`, `.../011-fix-code-graph-docs` | `system-code-graph/002-006` |
| deep-loop | `007-.../008-deeploop-finding-dedup`, `.../007-graduation-follow-ups/002-deeploop-gauges-dedup-scale`; `008-.../013-deep-research-loop-instrumentation` | `system-deep-loop/039-041` |
| skill-advisor | `007-.../007-advisor-rrf-fusion`; `.../007-graduation-follow-ups/004-advisor-penalty-contract` | `system-skill-advisor/003-004` |

**Rollup docs migrated.** `changelog/{002,003,004}-*/` moved to the target packets' changelogs;
`before-vs-after.md`, `timeline.md`, `changelog/README.md` and `changelog-028-root.md` repointed;
the two relative parent-refs (`001-.../031-.../spec.md`, `005-.../046-.../spec.md`) and the 045/046
audit ledgers repointed. Frozen benchmark result files (`005-.../029-vague-query-model-benchmark`,
`system-deep-loop/033` transcripts, `027` fixers) left untouched by design.

**Mechanic.** Per folder: `git mv` subtree, substring-rewrite of self-refs (three spellings), regenerate
`description.json`/`graph-metadata.json` via the main-tree dist, inject the `level` field, pin continuity
freshness, fix `parent_id`. Each moved folder is a net improvement over its pre-extraction baseline
(DESCRIPTION_SHAPE and CONTINUITY_FRESHNESS fixed); remaining per-folder failures are pre-existing content debt.

## 2. Post-extraction 028 scope

028 top-level is now: `000-release-cleanup`, `001-speckit-memory` (the memory-search engine),
`002-skill-advisor` (holds only the in-progress `009`), `003-spec-data-quality`, `004-review-remediation`,
`005-dark-flag-graduation`, `006-speckit-surface-alignment`.

## 3. Memory-search engine + spec data-quality — work done and tested

### 016 deep-dive remediation program — `001-speckit-memory/031-fix-deep-dive-p0-p2-findings-for-mk-spec-memory`

13/13 phases shipped and pushed: daemon-freshness/health-truthfulness, orphan-sweep + corpus repair,
archived-tier + tombstone read-exclusions, content-hash normalization + save-dedup lanes, embedding
coverage + vector-shard consistency, trigger-phrase matcher guards, rescue-layer ranking authority,
ranking-filter-bypass + score-scale fixes, causal-graph hygiene + entity-linker noise, learning-feedback
loop repair, search-hot-path performance, envelope/command-doc alignment, and closeout. Recursive
`validate.sh --strict` was 14 passed / 0 failed across the program parent and all 13 children.

### Spec data-quality — `003-spec-data-quality`

On-write quality loop, retroactive automation, retrieval-gated tuning, novel research, the shared
safe-fix engine, generated-metadata build and full-repo JSON migration, plus the flat drift-audit /
metadata-status-integrity / create.sh-corruption phases (045-053).

### This session (2026-07-06) — new work under `003-spec-data-quality`

- `051-graph-metadata-child-drift-audit-and-harden` — a repo-wide `children_ids`-vs-on-disk drift audit
  (21 drifted parents found and classified) plus a permanent `GRAPH_METADATA_CHILD_DRIFT` validate rule
  (advisory-by-default, enforce behind a flag) whose child enumeration is proven byte-identical to the
  graph-metadata writer; RED/GREEN test suite 10/10.
- `052-z-archive-metadata-backfill` — 9 z_archive container-root cold-tier nodes (`importance_tier: archived`),
  hard-excluded from default recall.
- `053-deep-loop-036-037-reindex` — reindex of the renamed system-deep-loop 036/037 folders + repointed
  stale metadata identifiers.
- Verified via a 10-iteration deep review (verdict CONDITIONAL) → GPT-5.5-fast remediation (commit
  `c712cd7104`) → independent Opus verification returning ALL-CLEAR.

### Re-embed drain diagnosis (the deferred 016/004 daemon-side item)

15,392 of 19,446 `memory_index` rows have no vector — all swept to `failed` by the retry-queue retention
backpressure (24h max-age + 1,000 pending-cap) during the multi-day daemon ABI/SIGBUS outage, not an
embedder fault (Ollama `nomic-embed-text:v1.5` at 768-dim is healthy). Census: ~78% are live-file
re-embeddable, ~22% are "orphans" that are mostly moved-not-deleted (re-nest casualties, still valid).
A naive reconcile re-triggers the retention trap. The full-fix remediation (checkpoint → re-path
moved rows → retention-tuned restart → reconcile-apply → drain → prune only truly-gone rows) is
prepared and restart-gated; this remains the packet's open daemon-side item.
