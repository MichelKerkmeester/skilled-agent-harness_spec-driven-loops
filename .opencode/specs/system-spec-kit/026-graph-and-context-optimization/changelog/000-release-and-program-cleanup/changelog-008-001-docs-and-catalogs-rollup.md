---
title: "008/001 Docs and Catalogs Rollup: sync umbrella docs to shipped 026 capabilities"
description: "Gap-analysis driven rollup that surfaced four final-sprint capabilities across the seven umbrella docs and catalog indexes. Surgical content-preserving additions, sync not aspiration."
trigger_phrases:
  - "008/001 docs and catalogs rollup"
  - "umbrella docs capability sync"
  - "026 readme feature catalog rollup"
  - "memory_embedding_reconcile docs"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-01

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup/001-docs-and-catalogs-rollup`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/008-docs-and-catalogs-rollup`

### Summary

The umbrella docs and catalog indexes needed to reflect the capabilities spec 026 actually shipped. A read-only gap analysis compared each of the seven umbrella docs against the 026 changelogs and found the docs were already largely current. Only four final-sprint capabilities were genuinely missing, so the work was surgical additions rather than a rewrite. Every addition is grounded in a shipped changelog.

### Added

- Documentation coverage across the seven docs for the four missing capabilities: `memory_embedding_reconcile` (a dry-run-default maintenance tool), `memory_index_scan` self-maintenance plus the `memory_health.index` block, Track 007 daemon reliability (non-destructive build, WAL durability, boot FTS5 integrity check, RSS watchdog), and Track 006 session and worktree tooling (`session-cleanup.sh` rename plus worktree-per-session isolation)

### Changed

- Tool counts updated where the net-new `memory_embedding_reconcile` tool justified it: mk-spec-memory 35 to 36, program total 60 to 61, feature catalog 54 to 55

### Fixed

- None

### Verification

- Gap analysis run before any edit, so already-current docs were not disturbed
- Per-doc diff confirmed additions-only, no existing content removed beyond the count bumps
- HVR lint clean on added lines, and every newly referenced path verified to exist
- Tool count changes traced to the single net-new tool registration

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `README.md` | Modified | Daemon reliability, index-scan, reconcile, tool counts |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modified | Index-scan and reconcile notes, worktree and session tooling |
| `.opencode/skills/system-spec-kit/README.md` | Modified | Reconcile, index-scan, RSS flag, corrupt-health troubleshooting |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Reconcile entrypoint, WAL and boot-integrity guardrails |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | Reconcile and health tools, non-destructive build, corrupt-health row |
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Reconcile entry, index-scan and health notes, session and worktree tooling |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modified | Reconcile scenario, extended index-scan scenario contract |

### Follow-Ups

- Code-graph and skill-advisor handler docs were left to the extracted system-code-graph and system-skill-advisor skills, so they are out of scope here
