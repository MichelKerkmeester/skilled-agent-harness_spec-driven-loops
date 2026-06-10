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

Spec 027 (xce-research-based-refinement) shipped its memory, doctrine, and CLI hardening across ten implemented phase tracks (001 through 010) plus the 000 release-cleanup track (complete this release, captured in the root README and before-vs-after.md), with the 011 command-presentation track planned and scaffolded but not yet implemented. Every shipped phase has a packet-local changelog, and every phase parent has a rollup with an Included Phases table. This index links each track to its top rollup. The chronological view of the same folders lives in `../timeline.md`.

## Tracks

| Track | Status | Leaf changelogs | Top rollup |
|-------|--------|-----------------|------------|
| 000 release cleanup | complete | 0 | (captured in root README + before-vs-after.md) |
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
| 011 command presentation workflow separation | planned | 0 | (scaffolded, not implemented) |

## How to read these

Each track rollup has an Included Phases table linking to its leaf changelogs (and, for track 010, three nested sub-lane rollups for the spec-memory, code-index, and skill-advisor CLI lanes). Every leaf changelog follows the canonical phase template: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups. Docs-only and process-only phases mark Added, Changed, and Fixed as None and put evidence under Verification. Single-leaf tracks (002, 008, 009) carry one changelog that doubles as the track entry, so they have no separate rollup.

## Shipped reality reflected here

The 027 changelogs record the schema progression v34 to v37 (source_kind v35, idempotency receipt v36, tombstone partitions v37), the new default-off flags (semantic triggers, session-trace causal inference, feedback retention learning, soft-delete tombstones, memory idempotency, authored continuity snapshot, completion freshness), the always-on write-ingress provenance guard, the two new advisory constitutional rules, the additive read-only retrieval observability, the markdown-native continuity resilience surfaces, and the dual-stack CLI front doors over the three MCP daemons. Every results-affecting addition ships default-off or shadow-first.

## Conventions

- File names: `changelog-<phase>-<short-name>.md`. Phase-parent rollups use the `-root.md` suffix.
- One changelog per shipped phase. Multi-commit phases collapse into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- Per-directory rollups are the authoritative child inventory for each parent.
- Tracks 000 and 011 gain changelogs when their phases ship.
