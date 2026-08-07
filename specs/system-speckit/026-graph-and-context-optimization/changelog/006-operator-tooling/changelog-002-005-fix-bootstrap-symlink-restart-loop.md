---
title: "Changelog: Fix Doctor Bootstrap Symlink Restart Loop [002-doctor-update-orchestrator/005-fix-bootstrap-symlink-restart-loop]"
description: "Chronological changelog for the Fix Doctor Bootstrap Symlink Restart Loop phase."
trigger_phrases:
  - "phase changelog"
  - "nested changelog"
  - "phase completion"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-15

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/005-fix-bootstrap-symlink-restart-loop` (Level unknown)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator`

### Summary

> Spec: ./spec.md | Date: 2026-06-08 | Status: Complete & verified

### Added

- None.

### Changed

- Removed the symlink-creation branch (branch 3) from doctor-runtime-bootstrap.sh so the bootstrap no longer recreates .opencode/skill -> skills whenever the symlink is absent.
- Retained directory migration branches (mv) but dropped ln -s and restart_required=true from legacy migration paths, since all launchers and MCP configs resolve the plural .opencode/skills/ directly.
- Updated --help usage text from "Creates the legacy bridge" to "Migrates a legacy directory" to reflect the new behavior.
- Synced the identical edit to the Public mirror copy, preserving the byte-identical invariant.

### Fixed

- Eliminated spurious restart_required:true on /doctor:update caused by branch 3 unconditionally recreating the compatibility symlink and forcing a restart before any database rebuild could start.

### Verification

- bash -n (both copies) - PASS
- diff both copies - IDENTICAL (sync invariant held)
- Live bootstrap run - restart_required:false, actions:[], no symlink
- Remaining restart_required=true - 1 occurrence — the dist-build branch only
- Tasks complete - 10 completed task item(s) recorded

### Files Changed

_No file-level detail recorded._

### Follow-Ups

- Git commit/push — deferred to operator (assistant git policy is read-only)
