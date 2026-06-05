---
title: "Phase Parent Rollup: mcp daemon reliability"
description: "Rollup of 15 child phase changelogs under 007-mcp-daemon-reliability. Each child shipped independently and is listed in the Included Phases table. Detail lives in the child changelogs."
trigger_phrases:
  - "007-mcp-daemon-reliability rollup"
  - "007-mcp-daemon-reliability phase parent"
  - "007-mcp-daemon-reliability changelog index"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` (Level 2, Phase Parent)

### Summary

This phase parent groups 15 child phases spanning 2026-05-28 to 2026-06-01. Each child phase shipped independently and carries its own changelog with full detail. The Included Phases table below is the authoritative child inventory. Read each child changelog for the per-phase summary, verification, and files changed.

### Included Phases

| Changelog | Date | Title |
|-----------|------|-------|
| [changelog-007-001-ipc-socket-dir-canonicalize.md](./changelog-007-001-ipc-socket-dir-canonicalize.md) | 2026-05-28 | MCP Daemon Reliability Phase 001: IPC Socket Dir Canonicalize |
| [changelog-007-002-code-graph-initial-scan.md](./changelog-007-002-code-graph-initial-scan.md) | 2026-05-28 | MCP Daemon Reliability Phase 002: Code Graph Initial Scan |
| [changelog-007-003-daemon-reliability-research.md](./changelog-007-003-daemon-reliability-research.md) | 2026-05-28 | MCP Daemon Reliability Phase 003: Root-Cause Investigation and Fix Roadmap |
| [changelog-007-004-nondestructive-build.md](./changelog-007-004-nondestructive-build.md) | 2026-05-28 | Non-destructive mcp-server build: rebuilds no longer crash a running daemon (RC-4) |
| [changelog-007-005-provider-dispose.md](./changelog-007-005-provider-dispose.md) | 2026-05-28 | MCP Daemon Reliability Phase 005: Dispose the Embedding Provider's Native ONNX Session on Swap |
| [changelog-007-006-graceful-exit-watchdog.md](./changelog-007-006-graceful-exit-watchdog.md) | 2026-05-28 | Changelog: Launcher RSS-ceiling watchdog and graceful-exit supervision |
| [changelog-007-007-bridge-liveness-reap.md](./changelog-007-007-bridge-liveness-reap.md) | 2026-05-28 | MCP Daemon Reliability Phase 007: Bridge Liveness Probe and Reap-Aware Respawn |
| [changelog-007-008-spec-memory-graceful-wal-checkpoint-on-close.md](./changelog-007-008-spec-memory-graceful-wal-checkpoint-on-close.md) | 2026-05-29 | spec-memory Graceful WAL Checkpoint on Close |
| [changelog-007-009-shutdown-durability.md](./changelog-007-009-shutdown-durability.md) | 2026-05-29 | MCP Daemon Reliability 009: Shutdown Durability for Forwarded Launcher Signals |
| [changelog-007-010-at-rest-wal-durability.md](./changelog-007-010-at-rest-wal-durability.md) | 2026-05-29 | At-Rest WAL Durability: Bounded Autocheckpoint and Dual-Schema TRUNCATE |
| [changelog-007-011-deep-review-shutdown-and-codegraph.md](./changelog-007-011-deep-review-shutdown-and-codegraph.md) | 2026-05-29 | Deep Review 011: opus-4.8 Daemon-Shutdown and Code-Graph (CONDITIONAL, 9 P1 / 0 P0) |
| [changelog-007-012-boot-integrity-retention-probe.md](./changelog-007-012-boot-integrity-retention-probe.md) | 2026-05-29 | Boot Integrity-Check + Retention Durability + Probe Liveness Fix |
| [changelog-007-013-standalone-save-second-writer-guard.md](./changelog-007-013-standalone-save-second-writer-guard.md) | 2026-05-29 | 013 Standalone Save Second-Writer Guard |
| [changelog-007-016-substrate-harness-hardening.md](./changelog-007-016-substrate-harness-hardening.md) | 2026-05-31 | Substrate stress-harness hardening: start-time identity, run-id TSV, env suppression |
| [changelog-007-mcp-daemon-reliability.md](./changelog-007-mcp-daemon-reliability.md) | n/a | changelog-007-mcp-daemon-reliability.md |

### Added

- None. Detail lives in the child phase changelogs.

### Changed

- None. Detail lives in the child phase changelogs.

### Fixed

- None. Detail lives in the child phase changelogs.

### Verification

- All 15 child phases were verified independently. See each child changelog for per-phase verification evidence.

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `007-mcp-daemon-reliability/` (child phases) | n/a | Rollup of 15 child phase changelogs, no direct source changes at the parent level |

### Follow-Ups

- None.
