---
title: "Spec 027 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 027 (xce-research-based-refinement), organized under the six themed tracks. Each track links to its top rollup."
trigger_phrases:
  - "027 changelog index"
  - "027 changelog history"
  - "xce research based refinement changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 027 Changelog Index

Spec 027 (xce-research-based-refinement) shipped its memory, doctrine, search, resilience, and CLI hardening across six themed tracks. The changelog mirrors the spec tree: one directory per track, flat per track, with phase changelogs named `changelog-<track>-<leaf>-<...>.md`. Every track has a top rollup with an Included Phases table; multi-child phases keep their own `-root.md` rollup. The chronological view of the same folders lives in `../timeline.md`; the old-to-new path bridge in `../context-index.md`.

## Tracks

| Track | Leaf changelogs | Rollups | Top rollup |
|-------|-----------------|---------|------------|
| 000 release cleanup | 9 | 1 | [changelog-000-release-cleanup-root.md](./000-release-cleanup/changelog-000-release-cleanup-root.md) |
| 001 research and doctrine | 10 | 3 | [changelog-001-research-and-doctrine-root.md](./001-research-and-doctrine/changelog-001-research-and-doctrine-root.md) |
| 002 memory store and search | 27 | 5 | [changelog-002-memory-store-and-search-root.md](./002-memory-store-and-search/changelog-002-memory-store-and-search-root.md) |
| 003 advisor and code graph | 11 | 2 | [changelog-003-advisor-and-codegraph-root.md](./003-advisor-and-codegraph/changelog-003-advisor-and-codegraph-root.md) |
| 004 shared infrastructure | 32 | 7 | [changelog-004-shared-infrastructure-root.md](./004-shared-infrastructure/changelog-004-shared-infrastructure-root.md) |
| 005 verification and remediation | 9 | 4 | [changelog-005-verification-and-remediation-root.md](./005-verification-and-remediation/changelog-005-verification-and-remediation-root.md) |

## How to read these

Each track's top rollup lists its phases and links to each phase changelog. Multi-child phases (for example `004/001` mcp-to-cli) carry their own `-root.md` rollup that links to its sub-children; single-leaf phases carry one changelog that doubles as the entry. Every leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups.

## Conventions

- File names: `changelog-<track>-<leaf>-<child>-<short-name>.md`; phase rollups use the `-root.md` suffix. Numbers reflect the current six-track spec-tree position.
- One changelog per shipped phase. Multi-commit phases collapse into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- The directory layout mirrors `026-graph-and-context-optimization/changelog/` (flat per themed track).
