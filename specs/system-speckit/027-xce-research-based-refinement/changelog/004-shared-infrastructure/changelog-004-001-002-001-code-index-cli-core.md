---
title: "Changelog: 002-code-index-cli / 001-cli-core"
description: "Code-index CLI core shipped: manifest-backed 8-command CLI over the existing daemon contract with blocked-read preservation, exit taxonomy 0/1/64/69/75, IPC auto-spawn, and stale-dist guard."
trigger_phrases:
  - "code-index cli core changelog"
  - "code-index phase 1 changelog"
  - "code-index shim changelog"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli/001-cli-core` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli`

### Summary

The code-index CLI core shipped as a manifest-backed CLI layer over the existing daemon contract. The CLI exposes exactly 8 commands from `CODE_GRAPH_TOOL_SCHEMAS` with `validateToolArgs()` parity, preserves `status:blocked` payloads in all output formats, maps exits to 0/1/64/69/75, supports IPC auto-spawn, and guards stale dist output with a dev override flag. No daemon or launcher files were changed.

### Added

- `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` — CLI dispatcher, argument validation, blocked-read output rendering, exit taxonomy, and IPC auto-spawn
- `.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts` — manifest-backed command registry generated from `CODE_GRAPH_TOOL_SCHEMAS`
- `.opencode/bin/code-index.cjs` — stable shim with dist-freshness guard and `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE` override

### Changed

- None (daemon and launcher files intentionally untouched)

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Clean build (TypeScript 5.9.3) | PASS |
| Manifest parity | `list-tools` enumerated exactly 8 commands |
| Daemon smoke (IPC auto-spawn) | PASS |
| Argument validation | Bad enum, unknown key, missing required argument: all exit 64 |
| Blocked-read rendering | `status:blocked` preserved in JSON and text |
| Exit taxonomy | 0/1/64/69/75 verified |
| Dist freshness | Stale dist: exit 69; dev override verified |

### Files Changed

| File | Action | Purpose |
|------|---------|---------|
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | Added | CLI dispatcher, validation, output rendering, exits, auto-spawn |
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli-manifest.ts` | Added | Manifest-backed command registry from `CODE_GRAPH_TOOL_SCHEMAS` |
| `.opencode/bin/code-index.cjs` | Added | Stable shim with dist-freshness guard and dev stale-dist override |

### Follow-Ups

- Broader end-to-end transition verification remains in later program phases
