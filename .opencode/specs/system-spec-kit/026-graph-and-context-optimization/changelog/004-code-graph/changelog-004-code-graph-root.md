---
title: "Phase Parent Rollup: code graph"
description: "Rollup of 29 child phase changelogs under 004-code-graph. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "004-code-graph rollup"
  - "004-code-graph phase parent"
  - "004-code-graph changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-05-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2, Phase Parent)

### Summary

This phase parent groups 29 child phases spanning 2026-04-09 to 2026-05-29. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-001-code-graph-upgrades.md](./_root/changelog-001-code-graph-upgrades.md) | 2026-04-09 | Code Graph Phase 001: Code Graph Upgrades |
| [changelog-002-code-graph-self-contained-package.md](./_root/changelog-002-code-graph-self-contained-package.md) | 2026-04-25 | Code Graph Phase 002: Self-Contained Package Migration |
| [changelog-003-code-graph-context-and-scan-scope.md](./_root/changelog-003-code-graph-context-and-scan-scope.md) | 2026-04-23 | Code Graph Phase 003: Context and Scan Scope Remediation |
| [changelog-004-001-mcp-shared-dependency-startup-fix.md](./001-mcp-shared-dependency-startup-fix/changelog-004-001-mcp-shared-dependency-startup-fix.md) | 2026-05-16 | Code Graph Phase 001: MCP Shared Dependency Startup Fix |
| [changelog-004-003-code-graph-workspace-root-fix.md](./003-code-graph-workspace-root-fix/changelog-004-003-code-graph-workspace-root-fix.md) | 2026-05-26 | Code Graph Phase 003: Workspace-Root and IPC Socket Reconnect Fix |
| [changelog-004-012-empty-graph-first-time-auto-scan.md](./012-empty-graph-first-time-auto-scan/changelog-004-012-empty-graph-first-time-auto-scan.md) | 2026-05-29 | Code Graph Phase 012: Empty-Graph First-Time Auto-Establish |
| [changelog-004-013-owner-lease-election-race.md](./013-owner-lease-election-race/changelog-004-013-owner-lease-election-race.md) | 2026-05-29 | Code Graph Phase 013: Owner-Lease Election Race (OR-R-01) Investigation |
| [changelog-004-code-graph-hook-improvements.md](./_root/changelog-004-code-graph-hook-improvements.md) | 2026-04-24 | Code Graph Phase 004: Hook Improvement Implementation |
| [changelog-004-research-013-code-graph-hook-improvements-pt-02.md](./_root/changelog-004-research-013-code-graph-hook-improvements-pt-02.md) | 2026-04-22 | Code Graph Phase 004/Research/013-Pt-02: Hook Improvement Investigation |
| [changelog-004-research-013-code-graph-zero-calls-pt-03.md](./_root/changelog-004-research-013-code-graph-zero-calls-pt-03.md) | 2026-04-22 | Code Graph Phase 004/Research/013-Pt-03: Zero-Calls Root-Cause Investigation |
| [changelog-004-research-028-code-graph-hook-improvements-pt-01.md](./_root/changelog-004-research-028-code-graph-hook-improvements-pt-01.md) | 2026-04-21 | Code Graph Phase 004/Research/028: Hook Improvement Investigation Pt-01 |
| [changelog-004-research-030-code-graph-gap-investigation-pt-01.md](./_root/changelog-004-research-030-code-graph-gap-investigation-pt-01.md) | 2026-04-22 | Code Graph Phase 004/Research/030: Gap Investigation Pt-01 |
| [changelog-005-code-graph-advisor-refinement.md](./_root/changelog-005-code-graph-advisor-refinement.md) | 2026-04-25 | Code Graph Phase 005: Code Graph and Skill Advisor Refinement |
| [changelog-005-research-015-code-graph-advisor-refinement-pt-01.md](./_root/changelog-005-research-015-code-graph-advisor-refinement-pt-01.md) | 2026-04-23 | Code Graph Phase 005/Research/015: Advisor Refinement Deep Research Pt-01 |
| [changelog-005-review-015-code-graph-advisor-refinement-pt-01.md](./_root/changelog-005-review-015-code-graph-advisor-refinement-pt-01.md) | 2026-04-24 | Code Graph Phase 005/Review/015: Advisor Refinement Deep Review Pt-01 |
| [changelog-006-code-graph-doctor-command.md](./_root/changelog-006-code-graph-doctor-command.md) | 2026-04-25 | Code Graph Phase 006: Doctor Command |
| [changelog-007-code-graph-resilience-research.md](./_root/changelog-007-code-graph-resilience-research.md) | 2026-04-25 | Code Graph Phase 007: Resilience Research |
| [changelog-008-code-graph-backend-resilience.md](./_root/changelog-008-code-graph-backend-resilience.md) | 2026-04-25 | Code Graph Phase 008: Backend Resilience |
| [changelog-009-end-user-scope-default.md](./_root/changelog-009-end-user-scope-default.md) | 2026-05-02 | Code Graph Phase 009: Default scope changed to user code only |
| [changelog-010-fix-iteration-quality-meta-research.md](./_root/changelog-010-fix-iteration-quality-meta-research.md) | 2026-05-02 | Code Graph Phase 010: Fix-Iteration Quality Meta-Research |
| [changelog-011-broader-scope-excludes.md](./_root/changelog-011-broader-scope-excludes.md) | 2026-05-03 | Code Graph Phase 011: Parser stopped silently failing in production |
| [changelog-012-001-execution.md](./_root/changelog-012-001-execution.md) | 2026-05-05 | Code Graph Phase 012/001: Real-World Usefulness Test Execution |
| [changelog-012-002-native-rerun.md](./_root/changelog-012-002-native-rerun.md) | 2026-05-05 | Code Graph Phase 012/002: Native Rerun of Deferred Usefulness Cells |
| [changelog-012-003-deep-research-issues.md](./_root/changelog-012-003-deep-research-issues.md) | 2026-05-06 | Code Graph Phase 012/003: Deep Research Issues |
| [changelog-012-004-remediation.md](./_root/changelog-012-004-remediation.md) | 2026-05-06 | Code Graph Phase 012/004: Index can no longer be wiped |
| [changelog-012-005-scope-guard.md](./_root/changelog-012-005-scope-guard.md) | 2026-05-06 | Code Graph Phase 012/005: Scope changes need explicit consent |
| [changelog-012-006-cluster-a-to-e.md](./_root/changelog-012-006-cluster-a-to-e.md) | 2026-05-06 | Code Graph Phase 012/006: Cluster A to E polish |
| [changelog-012-007-tree-sitter-parser-resilience.md](./_root/changelog-012-007-tree-sitter-parser-resilience.md) | 2026-05-06 | Code Graph Phase 012/007: Tree-sitter parser resilience |
| [changelog-012-real-world-usefulness-test.md](./_root/changelog-012-real-world-usefulness-test.md) | 2026-05-06 | Code Graph Phase 012: Real-World Usefulness Test |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 29 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `004-code-graph/` (child phases) | n/a | Rollup of 29 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
