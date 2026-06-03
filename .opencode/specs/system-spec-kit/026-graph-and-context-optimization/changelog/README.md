---
title: "Spec 026 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 026 (graph-and-context-optimization). Links each track to its phase-parent rollup. Per-directory rollups serve as the index for each parent."
trigger_phrases:
  - "026 changelog index"
  - "026 changelog history"
  - "graph and context optimization changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 026 Changelog Index

Spec 026 (graph-and-context-optimization) shipped across 8 tracks and about 634 phase packets. Every shipped phase has a packet-local changelog, and every phase parent has a rollup with an Included Phases table. This index links each track to its top-level rollup. The full coverage report, method, and known follow-ups live in the work-audit at `000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-changelog-backfill-and-audit/audit-report.md`.

## Tracks

| Track | Leaf changelogs | Rollups | Top rollup |
|-------|-----------------|---------|------------|
| 000 release and program cleanup | 128 | 14 | [changelog-000-release-and-program-cleanup-root.md](./000-release-and-program-cleanup/changelog-000-release-and-program-cleanup-root.md) |
| 001 research and baseline | 6 | 1 | [changelog-001-research-and-baseline-root.md](./001-research-and-baseline/changelog-001-research-and-baseline-root.md) |
| 002 spec-kit internals | 120 | 13 | [changelog-002-spec-kit-internals-root.md](./002-spec-kit-internals/changelog-002-spec-kit-internals-root.md) |
| 003 memory and causal runtime | 240 | 27 | [changelog-003-memory-and-causal-runtime-root.md](./003-memory-and-causal-runtime/changelog-003-memory-and-causal-runtime-root.md) |
| 004 code graph | 76 | 10 | [changelog-004-code-graph-root.md](./004-code-graph/changelog-004-code-graph-root.md) |
| 005 graph impact and affordance | 6 | 1 | [changelog-005-graph-impact-and-affordance-root.md](./005-graph-impact-and-affordance/changelog-005-graph-impact-and-affordance-root.md) |
| 006 operator tooling | 28 | 4 | [changelog-006-operator-tooling-root.md](./006-operator-tooling/changelog-006-operator-tooling-root.md) |
| 007 mcp daemon reliability | 24 | 3 | [changelog-007-mcp-daemon-reliability-root.md](./007-mcp-daemon-reliability/changelog-007-mcp-daemon-reliability-root.md) |

## How to read these

Each track rollup has an Included Phases table linking to its child phase rollups and leaf changelogs. Every leaf changelog follows the canonical phase template: Summary, Added, Changed, Fixed, Verification, Files Changed, Follow-Ups. Research-only and review-only phases mark Added, Changed, and Fixed as None and put artifact paths under Verification. Each phase parent rollup follows the root template with an Included Phases table.

## Program-spanning entries

These changelogs cover work that spans multiple tracks. Each lives in its home track folder and is cross-linked here:

- [mk-spec-memory rename](./003-memory-and-causal-runtime/changelog-001-052-mk-spec-memory-rename.md)
- [substrate harness hardening](./007-mcp-daemon-reliability/changelog-007-016-substrate-harness-hardening.md)

## Conventions

- File names: `changelog-<phase>-<short-name>.md`. Phase-parent rollups use the `-root.md` suffix.
- One changelog per shipped phase. Multi-commit phases collapse into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- Per-directory rollups are the authoritative child inventory for each parent.
