---
title: "Spec 027 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 027 (xce-research-based-refinement). Groups each phase under its themed track and links to its rollup."
trigger_phrases:
  - "027 changelog index"
  - "027 changelog history"
  - "xce research based refinement changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 027 Changelog Index

Spec 027 (xce-research-based-refinement) shipped its memory, doctrine, search, resilience, and CLI hardening, then grouped the work under six themed tracks. Every shipped phase has a packet-local changelog, and every phase parent has a rollup with an Included Phases table. This index links each phase to its rollup, grouped by the themed track that now owns it. The chronological view of the same folders lives in `../timeline.md`. The full old-to-new path bridge lives in `../context-index.md`.

> **Path note:** The changelog files keep their original per-phase paths and names (for example `./013-vector-read-path-resilience/`). They are a frozen historical record. The `Now at` column gives each phase its current spec-tree home under the six themed tracks.

## Tracks

### 000 release cleanup

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `000-release-cleanup/` | release cleanup | complete | [changelog-000-release-cleanup-root.md](./000-release-cleanup/changelog-000-release-cleanup-root.md) |

### 001 research and doctrine

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `001-research-and-doctrine/001` | peck teachings adoption | shipped | [changelog-001-peck-teachings-adoption-root.md](./001-peck-teachings-adoption/changelog-001-peck-teachings-adoption-root.md) |
| `001-research-and-doctrine/002` | gem team adoption | shipped | [changelog-006-gem-team-adoption-root.md](./006-gem-team-adoption/changelog-006-gem-team-adoption-root.md) |

### 002 memory store and search

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `002-memory-store-and-search/001` | memory write safety | shipped | [changelog-002-memory-write-safety.md](./002-memory-write-safety/changelog-002-memory-write-safety.md) |
| `002-memory-store-and-search/002` | memory index causal lifecycle | shipped | [changelog-003-memory-index-causal-lifecycle-root.md](./003-memory-index-causal-lifecycle/changelog-003-memory-index-causal-lifecycle-root.md) |
| `002-memory-store-and-search/003` | semantic trigger fallback | shipped | [changelog-004-semantic-trigger-fallback-root.md](./004-semantic-trigger-fallback/changelog-004-semantic-trigger-fallback-root.md) |
| `002-memory-store-and-search/004` | learning feedback reducers | shipped | [changelog-005-learning-feedback-reducers-root.md](./005-learning-feedback-reducers/changelog-005-learning-feedback-reducers-root.md) |
| `002-memory-store-and-search/005` | memclaw derived memory hardening | shipped | [changelog-007-memclaw-derived-memory-hardening-root.md](./007-memclaw-derived-memory-hardening/changelog-007-memclaw-derived-memory-hardening-root.md) |
| `002-memory-store-and-search/006` | openltm retrieval observability | shipped | [changelog-008-openltm-retrieval-observability.md](./008-openltm-retrieval-observability/changelog-008-openltm-retrieval-observability.md) |
| `002-memory-store-and-search/007` | openltm continuity resilience | shipped | [changelog-009-openltm-continuity-resilience.md](./009-openltm-continuity-resilience/changelog-009-openltm-continuity-resilience.md) |
| `002-memory-store-and-search/008` | vector read path resilience | shipped | [changelog-013-vector-read-path-resilience.md](./013-vector-read-path-resilience/changelog-013-vector-read-path-resilience.md) |
| `002-memory-store-and-search/009` | packed bm25 field weights | shipped | [changelog-014-packed-bm25-field-weights.md](./014-packed-bm25-field-weights/changelog-014-packed-bm25-field-weights.md) |
| `002-memory-store-and-search/010` | bm25 warmup churn reduction | shipped | [changelog-017-bm25-warmup-churn-reduction.md](./017-bm25-warmup-churn-reduction/changelog-017-bm25-warmup-churn-reduction.md) |
| `002-memory-store-and-search/011` | vector resilience durability | shipped | [changelog-020-vector-resilience-durability.md](./020-vector-resilience-durability/changelog-020-vector-resilience-durability.md) |
| `002-memory-store-and-search/012` | hybrid search scope then limit | shipped | [changelog-021-hybrid-search-scope-then-limit.md](./021-hybrid-search-scope-then-limit/changelog-021-hybrid-search-scope-then-limit.md) |
| `002-memory-store-and-search/013` | provenance injection | shipped | [changelog-022-provenance-injection.md](./022-provenance-injection/changelog-022-provenance-injection.md) |
| `002-memory-store-and-search/014` | idempotency flag on correctness | shipped | [changelog-023-idempotency-flag-on-correctness.md](./023-idempotency-flag-on-correctness/changelog-023-idempotency-flag-on-correctness.md) |

### 003 advisor and code graph

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `003-advisor-and-codegraph/001` | causal traversal bfs | shipped | [changelog-012-causal-traversal-bfs.md](./012-causal-traversal-bfs/changelog-012-causal-traversal-bfs.md) |
| `003-advisor-and-codegraph/002` | xce feature adoption advisor codegraph | shipped | [changelog-018-xce-feature-adoption-advisor-codegraph-root.md](./018-xce-feature-adoption-advisor-codegraph/changelog-018-xce-feature-adoption-advisor-codegraph-root.md) |
| `003-advisor-and-codegraph/003` | skill advisor cross session reconnect | shipped | [changelog-019-skill-advisor-cross-session-reconnect.md](./019-skill-advisor-cross-session-reconnect/changelog-019-skill-advisor-cross-session-reconnect.md) |

### 004 shared infrastructure

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `004-shared-infrastructure/001` | mcp to cli tool transition | shipped | [changelog-010-mcp-to-cli-tool-transition-root.md](./010-mcp-to-cli-tool-transition/changelog-010-mcp-to-cli-tool-transition-root.md) |
| `004-shared-infrastructure/002` | command presentation workflow separation | shipped | [changelog-011-command-presentation-workflow-separation-root.md](./011-command-presentation-workflow-separation/changelog-011-command-presentation-workflow-separation-root.md) |
| `004-shared-infrastructure/003` | storage adapter ports | shipped | [changelog-015-storage-adapter-ports.md](./015-storage-adapter-ports/changelog-015-storage-adapter-ports.md) |
| `004-shared-infrastructure/004` | cli tooling ux | shipped | [changelog-016-cli-tooling-ux-root.md](./016-cli-tooling-ux/changelog-016-cli-tooling-ux-root.md) |
| `004-shared-infrastructure/005` | autonomous dependency patching | shipped | [changelog-024-autonomous-dependency-patching.md](./024-autonomous-dependency-patching/changelog-024-autonomous-dependency-patching.md) |
| `004-shared-infrastructure/006` | code mode orphan lifecycle | shipped | [changelog-025-code-mode-orphan-lifecycle.md](./025-code-mode-orphan-lifecycle/changelog-025-code-mode-orphan-lifecycle.md) |
| `004-shared-infrastructure/007` | ipc client cap hardening | shipped | [changelog-026-ipc-client-cap-hardening.md](./026-ipc-client-cap-hardening/changelog-026-ipc-client-cap-hardening.md) |
| `004-shared-infrastructure/008` | mcp config alignment reelection default | shipped | [008-mcp-config-alignment-reelection-default/](../004-shared-infrastructure/008-mcp-config-alignment-reelection-default/) |

### 005 verification and remediation

| Now at | Phase | Status | Top rollup |
|--------|-------|--------|------------|
| `005-verification-and-remediation/001` | finding remediation | complete | [changelog-027-finding-remediation-root.md](./027-finding-remediation/changelog-027-finding-remediation-root.md) |
| `005-verification-and-remediation/002` | tri system deep research | complete | [changelog-028-tri-system-deep-research-root.md](./028-tri-system-deep-research/changelog-028-tri-system-deep-research-root.md) |
| `005-verification-and-remediation/003` | deep research remediation | complete | [changelog-029-deep-research-remediation-root.md](./029-deep-research-remediation/changelog-029-deep-research-remediation-root.md) |
| `005-verification-and-remediation/004` | residual design units | complete | [changelog-030-residual-design-units.md](./030-residual-design-units/changelog-030-residual-design-units.md) |

## How to read these

Each track rollup has an Included Phases table linking to its leaf changelogs (and, for the mcp-to-cli phase, three nested sub-lane rollups for the spec-memory, code-index, and skill-advisor CLI lanes). Every leaf changelog follows the canonical phase template: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups. Docs-only and process-only phases mark Added, Changed, and Fixed as None and put evidence under Verification. Single-leaf phases carry one changelog that doubles as the entry, so they have no separate rollup.

The four parents authored at epic close (release-cleanup, command-presentation, cli-tooling-ux, xce-feature-adoption) summarize their children inline in the rollup's Included Phases table, which links to each child's spec docs, rather than carrying separate per-child leaf changelogs. The pre-existing parents (peck, memory-index, semantic-trigger, learning-feedback, memclaw, mcp-to-cli) retain separate per-child leaf changelogs. Both forms keep the rollup as the authoritative child inventory.

## Shipped reality reflected here

The 027 changelogs record the schema progression v34 to v37 (source_kind v35, idempotency receipt v36, tombstone partitions v37), the new default-off flags (semantic triggers, session-trace causal inference, feedback retention learning, soft-delete tombstones, memory idempotency, authored continuity snapshot, completion freshness), the always-on write-ingress provenance guard, the two new advisory constitutional rules, the additive read-only retrieval observability, the markdown-native continuity resilience surfaces, and the dual-stack CLI front doors over the three MCP daemons. Every results-affecting addition ships default-off or shadow-first.

The verification-and-remediation track records the eight-lane verify-first remediation, the 50-angle tri-system deep-research and findings adjudication, the single-writer lock, secret scrubber, command-probe protocol and apply-pipeline safety cluster, and the memory_health budget re-tier, background maintenance-job store, synthetic replay corpus and three verify-first dispositions.

## Conventions

- File names: `changelog-<original-phase>-<short-name>.md`. Phase-parent rollups use the `-root.md` suffix. Original phase numbers are retained in changelog file names as a historical record.
- One changelog per shipped phase. Multi-commit phases collapse into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- Per-directory rollups are the authoritative child inventory for each parent.
- The thirty shipped phases are now grouped under six themed tracks. The `Now at` column maps each historical changelog to its current spec-tree home. The old-to-new bridge with full paths lives in `../context-index.md`.
