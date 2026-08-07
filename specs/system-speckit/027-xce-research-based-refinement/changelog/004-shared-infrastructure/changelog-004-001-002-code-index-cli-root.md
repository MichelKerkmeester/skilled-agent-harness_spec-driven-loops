---
title: "Changelog: 002-code-index-cli (lane rollup)"
description: "Rollup for the code-index CLI lane: feasibility research (GO verdict, 8-tool parity), CLI core (manifest-backed shim + blocked-read rendering), hardening (6 suites, 16/16 green), and runtime integration (bridge repair, warm-only hooks, maintenance block)."
trigger_phrases:
  - "code-index cli lane rollup"
  - "code-index cli changelog root"
  - "002 code-index cli complete"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/004-shared-infrastructure/001-mcp-to-cli-tool-transition/002-code-index-cli` (Phase Parent)

### Summary

The code-index CLI lane delivered a complete dual-stack CLI front-door over the mk-code-index daemon. A single 10-iteration research run produced a GO verdict for all 8 tools with the blocked-read envelope identified as the top system risk. The CLI core shipped as a manifest-backed layer over the existing daemon contract. Hardening locked dual-client safety, owner-lease respawn, blocked-read rendering, schema parity, and teardown cleanliness with 16/16 sandbox tests passing. Runtime integration repaired the mk-code-graph bridge (replacing the reverted in-process import approach) and wired warm-only fallback into hooks.

### Included Phases

| Phase | Title | Date | Status |
|-------|-------|------|--------|
| `000-code-index-cli-research` | Feasibility research (GO verdict) | 2026-06-06 | Complete |
| `001-cli-core` | CLI core: manifest, shim, blocked-read, exits | 2026-06-09 | Complete |
| `002-hardening-and-tests` | Hardening: 6 suites, 16/16 green | 2026-06-09 | Complete |
| `003-runtime-integration` | Runtime integration: bridge repair, hooks, allowlist | 2026-06-09 | Complete |

### Added

- `code-index-cli.ts`, `code-index-cli-manifest.ts` — daemon-backed CLI core
- `.opencode/bin/code-index.cjs` — stable executable shim
- 6 hardening Vitest suites (harness, dual-client, owner-respawn, blocked-read, parity, teardown)
- Warm-only code-index CLI fallback helper for Claude and Codex hooks

### Changed

- `mk-code-graph-bridge.mjs` — bridge repaired to CLI route; in-process imports removed
- `mk-code-graph.js` plugin — synthesizes transport contract from status payload
- Claude/Codex hook files — warm-only code-index CLI fallback paths added
- `AGENTS.md`, `.codex/settings.json` — policy guidance and allowlist

### Fixed

- `mk-code-graph-bridge.mjs` — removed in-process dist/DB imports (dual-writer hazard); replaced with CLI/IPC route

### Verification

| Check | Result |
|-------|--------|
| Research: 10/10 forced iterations | PASS — 1/1 lane, GO verdict |
| CLI core: manifest parity | PASS — 8 commands from `CODE_GRAPH_TOOL_SCHEMAS` |
| CLI core: blocked-read | PASS — `status:blocked` preserved |
| Hardening: 16/16 sandbox tests | PASS |
| Runtime: warm smoke | PASS — real payload over CLI route |
| Runtime: maintenance block | PASS |
| Runtime: MCP registrations | Untouched (diff-empty) |

### Files Changed

See per-phase changelogs for full file tables.

### Follow-Ups

- Dual-stack observation window remains open by design
- Final program-level multi-runtime transport-down drill tracked at program level
