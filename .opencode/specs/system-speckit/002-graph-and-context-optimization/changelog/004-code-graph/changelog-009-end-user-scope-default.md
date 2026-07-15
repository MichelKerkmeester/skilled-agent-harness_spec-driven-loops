---
title: "Code Graph Phase 009: Default scope changed to user code only"
description: "The scanner used to index everything by default, including framework internals. Now it indexes the user's code only. Framework folders are opt-in via env flags."
trigger_phrases:
  - "phase 009 changelog"
  - "default scope changelog"
  - "end-user scope code-graph"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-02

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph` (Level 2)
> Parent packet: `002-graph-and-context-optimization/004-code-graph`

### Summary

Before this phase, running a default scan against any repo using this template indexed **everything**: your code, plus the framework's own skills, agents, commands, specs, and plugins. If you searched for a function name, results were polluted with framework internals, and end users had no clean way to filter them out.

After this phase, the default scope is "your code only." Framework folders (`.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, `specs/`, `plugins/`) are opt-in via environment variables (`SPECKIT_CODE_GRAPH_INDEX_SKILLS=true`, etc.) or per-call scope arguments. The MCP server's own implementation directories (`mcp-coco-index/`, `mcp_server/`) are excluded entirely because they belong to the framework, not the user.

The phase landed in three commits over 2.5 hours: the initial cut, two follow-up fixes that closed 1 P0 and 3 P1 from a deep-review, and a final verification that the scope policy was clean.

### Added

- Environment-variable opt-in flags for framework folders. Example: `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` enables skill indexing.
- Per-call `includeSkills`, `includeAgents`, `includeCommands`, `includeSpecs`, `includePlugins` arguments on `code_graph_scan` and `code_graph_status` for one-off opt-in.
- A scope label string in the status response (for example "end-user code only. opted-in .opencode folders: skills") so operators can see at a glance what was scanned.

### Changed

- Default scan scope flipped from "include all .opencode folders" to "exclude all .opencode folders by default."
- `mcp-coco-index/` and `mcp_server/` excluded permanently. These belong to the framework runtime, not user code, and indexing them produced confusing results.

### Fixed

- A canonical-path leak that exposed absolute filesystem paths in some response fields where relative paths were expected.

### Verification

- Vitest suite for `code_graph` passed before and after the change.
- Manual run: a fresh scan over a sample user repo returned only user code nodes, no framework noise.
- The final commit's verification step ran a deep-review against the new scope policy and confirmed CLEAN.

### Files Changed

| File | What changed |
|------|--------------|
| `code_graph/lib/index-scope-policy.ts` | New scope fingerprint and label generation. Default scope excludes all .opencode subfolders. |
| `code_graph/handlers/scan.ts` | Threaded the new scope arguments through the scan handler. |
| `code_graph/handlers/status.ts` | Surfaces `activeScope.label` and `storedScope` in the status response. |
| `code_graph/lib/code-graph-db.ts` | Stores the scope fingerprint alongside scan metadata for later drift detection. |

Commits: `79e97aec9` (initial), `03d873276` (FIX-009-v2: 1 P0 + 3 P1 + 3 P2), `c8ee2e819` (FIX-009-v3: 1 P0).

### Follow-Ups

- Phase 011 builds on this scope foundation by adding granular per-folder controls (for example "include skills but exclude .opencode/skills/system-spec-kit").
- Phase 012/005 hardened scope changes against accidental data loss by adding a fingerprint-based guard on the scan path.
