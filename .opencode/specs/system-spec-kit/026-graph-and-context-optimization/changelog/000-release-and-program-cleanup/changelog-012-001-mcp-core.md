---
title: "Review Changelog: MCP Core Audit"
description: "Review-only changelog for the MCP memory mutation, save and reconcile audit slice."
trigger_phrases:
  - "012 mcp core audit"
  - "memory mutation review findings"
  - "entity density cache stale"
  - "embedding reconcile dry run drift"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-04

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit/001-mcp-core` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/012-comprehensive-deep-review-audit`

### Summary

This review-only packet audited the MCP memory mutation, save and embedding reconcile path. The verdict was CONDITIONAL. The audit found no P0s, but it kept 3 P1 findings active around stale entity-density cache invalidation, dry-run versus apply predicate drift and stale operator docs for `memory_embedding_reconcile`. It also recorded 1 P2 advisory for an advertised `activeOnly` option that the implementation does not read.

### Added

- None (review-only packet).

### Changed

- None (review-only packet).

### Fixed

- None (review-only packet).

### Verification

| Check | Result |
|-------|--------|
| Slice verdict | CONDITIONAL in `probe-report.md`. |
| Fan-out attribution | 5 lineages recorded, all CONDITIONAL, with 5 iterations each. |
| Finding counts | `probe-report.md` records P0: 0, P1: 3 and P2: 1. |
| Traceability posture | Report says no tests were run because this lineage was a read-only review with evidence-based findings. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `001-mcp-core/spec.md` | Created | Defined the read-only audit scope for mutation hooks, save, CRUD and embedding reconcile files. |
| `001-mcp-core/probe-report.md` | Created | Recorded the primary CONDITIONAL verdict and active findings. |
| `001-mcp-core/probe-report-codex2.md` | Created | Recorded an independent lineage report focused on reconcile dry-run parity and stale docs. |
| `001-mcp-core/review/` | Created | Stored lineage reports, merged registries and fan-out attribution for the review slice. |

### Follow-Ups

- Plan remediation for entity-density invalidation after save, update, delete and bulk-delete mutations.
- Align reconcile dry-run counts with apply mutation predicates.
- Replace stale `dryRun: false` operator examples with the live `mode: "apply"` call shape.
