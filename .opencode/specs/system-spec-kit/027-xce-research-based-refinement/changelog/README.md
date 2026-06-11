---
title: "Spec 027 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 027 (xce-research-based-refinement). Links each phase track to its rollup. Per-directory rollups serve as the index for each parent."
trigger_phrases:
  - "027 changelog index"
  - "027 changelog history"
  - "xce research based refinement changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 027 Changelog Index

Spec 027 (xce-research-based-refinement) shipped its memory, doctrine, search, resilience, and CLI hardening across twenty-seven phase tracks (000 through 026). Every shipped phase has a packet-local changelog, and every phase parent has a rollup with an Included Phases table. This index links each track to its top rollup. The chronological view of the same folders lives in `../timeline.md`.

## Tracks

| Track | Status | Leaf changelogs | Top rollup |
|-------|--------|-----------------|------------|
| 000 release cleanup | complete | 0 (inline in rollup) | [changelog-000-release-cleanup-root.md](./000-release-cleanup/changelog-000-release-cleanup-root.md) |
| 001 peck teachings adoption | shipped | 7 | [changelog-001-peck-teachings-adoption-root.md](./001-peck-teachings-adoption/changelog-001-peck-teachings-adoption-root.md) |
| 002 memory write safety | shipped | 1 | [changelog-002-memory-write-safety.md](./002-memory-write-safety/changelog-002-memory-write-safety.md) |
| 003 memory index causal lifecycle | shipped | 4 | [changelog-003-memory-index-causal-lifecycle-root.md](./003-memory-index-causal-lifecycle/changelog-003-memory-index-causal-lifecycle-root.md) |
| 004 semantic trigger fallback | shipped | 4 | [changelog-004-semantic-trigger-fallback-root.md](./004-semantic-trigger-fallback/changelog-004-semantic-trigger-fallback-root.md) |
| 005 learning feedback reducers | shipped | 4 | [changelog-005-learning-feedback-reducers-root.md](./005-learning-feedback-reducers/changelog-005-learning-feedback-reducers-root.md) |
| 006 gem team adoption | shipped | 3 | [changelog-006-gem-team-adoption-root.md](./006-gem-team-adoption/changelog-006-gem-team-adoption-root.md) |
| 007 memclaw derived memory hardening | shipped | 5 | [changelog-007-memclaw-derived-memory-hardening-root.md](./007-memclaw-derived-memory-hardening/changelog-007-memclaw-derived-memory-hardening-root.md) |
| 008 openltm retrieval observability | shipped | 1 | [changelog-008-openltm-retrieval-observability.md](./008-openltm-retrieval-observability/changelog-008-openltm-retrieval-observability.md) |
| 009 openltm continuity resilience | shipped | 1 | [changelog-009-openltm-continuity-resilience.md](./009-openltm-continuity-resilience/changelog-009-openltm-continuity-resilience.md) |
| 010 mcp to cli tool transition | shipped | 13 | [changelog-010-mcp-to-cli-tool-transition-root.md](./010-mcp-to-cli-tool-transition/changelog-010-mcp-to-cli-tool-transition-root.md) |
| 011 command presentation workflow separation | shipped | 0 (inline in rollup) | [changelog-011-command-presentation-workflow-separation-root.md](./011-command-presentation-workflow-separation/changelog-011-command-presentation-workflow-separation-root.md) |
| 012 causal traversal bfs | shipped | 1 | [changelog-012-causal-traversal-bfs.md](./012-causal-traversal-bfs/changelog-012-causal-traversal-bfs.md) |
| 013 vector read path resilience | shipped | 1 | [changelog-013-vector-read-path-resilience.md](./013-vector-read-path-resilience/changelog-013-vector-read-path-resilience.md) |
| 014 packed bm25 field weights | shipped | 1 | [changelog-014-packed-bm25-field-weights.md](./014-packed-bm25-field-weights/changelog-014-packed-bm25-field-weights.md) |
| 015 storage adapter ports | shipped | 1 | [changelog-015-storage-adapter-ports.md](./015-storage-adapter-ports/changelog-015-storage-adapter-ports.md) |
| 016 cli tooling ux | shipped | 0 (inline in rollup) | [changelog-016-cli-tooling-ux-root.md](./016-cli-tooling-ux/changelog-016-cli-tooling-ux-root.md) |
| 017 bm25 warmup churn reduction | shipped | 1 | [changelog-017-bm25-warmup-churn-reduction.md](./017-bm25-warmup-churn-reduction/changelog-017-bm25-warmup-churn-reduction.md) |
| 018 xce feature adoption advisor codegraph | shipped | 0 (inline in rollup) | [changelog-018-xce-feature-adoption-advisor-codegraph-root.md](./018-xce-feature-adoption-advisor-codegraph/changelog-018-xce-feature-adoption-advisor-codegraph-root.md) |
| 019 skill advisor cross session reconnect | shipped | 1 | [changelog-019-skill-advisor-cross-session-reconnect.md](./019-skill-advisor-cross-session-reconnect/changelog-019-skill-advisor-cross-session-reconnect.md) |
| 020 vector resilience durability | shipped | 1 | [changelog-020-vector-resilience-durability.md](./020-vector-resilience-durability/changelog-020-vector-resilience-durability.md) |
| 021 hybrid search scope then limit | shipped | 1 | [changelog-021-hybrid-search-scope-then-limit.md](./021-hybrid-search-scope-then-limit/changelog-021-hybrid-search-scope-then-limit.md) |
| 022 provenance injection | shipped | 1 | [changelog-022-provenance-injection.md](./022-provenance-injection/changelog-022-provenance-injection.md) |
| 023 idempotency flag on correctness | shipped | 1 | [changelog-023-idempotency-flag-on-correctness.md](./023-idempotency-flag-on-correctness/changelog-023-idempotency-flag-on-correctness.md) |
| 024 autonomous dependency patching | shipped | 1 | [changelog-024-autonomous-dependency-patching.md](./024-autonomous-dependency-patching/changelog-024-autonomous-dependency-patching.md) |
| 025 code mode orphan lifecycle | shipped | 1 | [changelog-025-code-mode-orphan-lifecycle.md](./025-code-mode-orphan-lifecycle/changelog-025-code-mode-orphan-lifecycle.md) |
| 026 ipc client cap hardening | shipped | 1 | [changelog-026-ipc-client-cap-hardening.md](./026-ipc-client-cap-hardening/changelog-026-ipc-client-cap-hardening.md) |

## How to read these

Each track rollup has an Included Phases table linking to its leaf changelogs (and, for track 010, three nested sub-lane rollups for the spec-memory, code-index, and skill-advisor CLI lanes). Every leaf changelog follows the canonical phase template: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups. Docs-only and process-only phases mark Added, Changed, and Fixed as None and put evidence under Verification. Single-leaf tracks (002, 008, 009, 012, 013, 014, 015, 017, 019, 020, 021, 022, 023, 024, 025, 026) carry one changelog that doubles as the track entry, so they have no separate rollup.

The four parents added at epic close (000, 011, 016, 018) summarize their children inline in the rollup's Included Phases table, which links to each child's spec docs, rather than carrying separate per-child leaf changelogs. The pre-existing parents (001, 003 through 007, 010) retain separate per-child leaf changelogs. Both forms keep the rollup as the authoritative child inventory.

## Shipped reality reflected here

The 027 changelogs record the schema progression v34 to v37 (source_kind v35, idempotency receipt v36, tombstone partitions v37), the new default-off flags (semantic triggers, session-trace causal inference, feedback retention learning, soft-delete tombstones, memory idempotency, authored continuity snapshot, completion freshness), the always-on write-ingress provenance guard, the two new advisory constitutional rules, the additive read-only retrieval observability, the markdown-native continuity resilience surfaces, and the dual-stack CLI front doors over the three MCP daemons. Every results-affecting addition ships default-off or shadow-first.

## Conventions

- File names: `changelog-<phase>-<short-name>.md`. Phase-parent rollups use the `-root.md` suffix.
- One changelog per shipped phase. Multi-commit phases collapse into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- Per-directory rollups are the authoritative child inventory for each parent.
- All twenty-seven tracks (000 through 026) now have a changelog. Tracks 000, 011, 016, and 018 summarize children inline in their rollup; the others use separate leaf changelogs.
- Tracks 024 and 025 were authored as standalone packets at epic close and relocated into 027 (formerly track-root 028-autonomous-dependency-patching and 029-code-mode-orphan-lifecycle); see `../context-index.md` for the relocation record.
