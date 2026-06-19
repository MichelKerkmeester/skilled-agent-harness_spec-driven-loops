---
title: "Spec 028 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 028 (memory-search-intelligence), organized under the five subsystem and release-readiness tracks. Each track links to its top rollup."
trigger_phrases:
  - "028 changelog index"
  - "028 changelog history"
  - "memory search intelligence changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 028 Changelog Index

Spec 028 (memory-search-intelligence) turned a long external memory-system research campaign into shipped retrieval intelligence across four subsystems plus a release-readiness track. The changelog mirrors the spec tree: one directory per track, flat per track, with phase changelogs named `changelog-<track>-<leaf>-<short-name>.md` and one per-track rollup named `changelog-<track>-root.md`. The packet root rollup is [changelog-028-root.md](./changelog-028-root.md) in this directory. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md). The flat 030 Wave-0 done-evidence is recorded separately under `030-memory-search-intelligence-impl`.

## Tracks

| Track | Leaf changelogs | Top rollup |
|-------|-----------------|------------|
| 001 speckit memory | 21 | [changelog-001-root.md](../001-speckit-memory/changelog/changelog-001-root.md) |
| 002 code graph | 8 | [changelog-002-root.md](../002-code-graph/changelog/changelog-002-root.md) |
| 003 skill advisor | 7 | [changelog-003-root.md](../003-skill-advisor/changelog/changelog-003-root.md) |
| 004 deep loop | 6 | [changelog-004-root.md](../004-deep-loop/changelog/changelog-004-root.md) |
| 005 release cleanup | 9 | [changelog-005-root.md](../005-release-cleanup/changelog/changelog-005-root.md) |

## How to read these

Each track's top rollup is its phase parent's Included Phases table, listing every child phase with its status and a one-line summary. Each leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed and Follow-Ups. The memory track carries the most phases because the campaign weighted the Memory MCP heaviest, and the release-cleanup track carries nine PENDING documentation-surface scaffolds rather than shipped code. A phase whose leaf Summary reads as planning-only may have been superseded by a later build commit, so the Added, Changed and Fixed evidence rows and the per-track rollup are the authoritative shipped state.

## Conventions

- File names use the pattern `changelog-<track>-<leaf>-<short-name>.md`. Per-track rollups use the `-root.md` suffix and the packet rollup is `changelog-028-root.md`. Numbers reflect the current five-track spec-tree position.
- One changelog per shipped phase. Multi-candidate phases collapse their candidates into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- PENDING and gated phases are shown as planned with their gate named, never disguised as shipped.
- The directory layout mirrors `027-xce-research-based-refinement/changelog/` (flat per track, one rollup per track).
