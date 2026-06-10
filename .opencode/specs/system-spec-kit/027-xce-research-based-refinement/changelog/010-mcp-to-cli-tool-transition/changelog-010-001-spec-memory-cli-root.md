---
title: "Changelog: 001-spec-memory-cli (lane rollup)"
description: "Rollup for the spec-memory CLI lane: feasibility research (GO verdict, 37-tool parity), CLI core (shim + IPC client), hardening (4 suites, 10/10 green), and runtime integration (hooks, plugin bridge, allowlists)."
trigger_phrases:
  - "spec-memory cli lane rollup"
  - "spec-memory cli changelog root"
  - "001 spec-memory cli complete"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/root.md | v1.0 -->

## 2026-06-09

> Spec folder: `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/010-mcp-to-cli-tool-transition/001-spec-memory-cli` (Phase Parent)

### Summary

The spec-memory CLI lane delivered a complete dual-stack CLI front-door over the mk-spec-memory daemon. Four successive deep-research runs produced a decision-grade GO verdict with zero unresolved risks. The CLI core shipped as a thin IPC client generating 37 subcommands at runtime from `TOOL_DEFINITIONS`. Hardening locked dual-spawn, dual-client, lifecycle, and parity contracts. Runtime integration wired warm-only fallback into Claude and Codex hooks and shipped an OpenCode plugin bridge with no in-process DB imports.

### Included Phases

| Phase | Title | Date | Status |
|-------|-------|------|--------|
| `000-spec-memory-cli-research` | Feasibility research (GO verdict) | 2026-06-06 | Complete |
| `001-cli-core` | CLI core: shim, IPC client, 37 subcommands | 2026-06-07 | Complete |
| `002-hardening-and-tests` | Hardening: dual-spawn, dual-client, lifecycle, parity | 2026-06-09 | Complete |
| `003-runtime-integration` | Runtime integration: hooks, plugin bridge, allowlists | 2026-06-09 | Complete |

### Added

- `spec-memory-cli.ts` — daemon-backed CLI entrypoint with runtime command generation
- `.opencode/bin/spec-memory.cjs` — stable executable shim
- 4 hardening Vitest suites (dual-spawn, dual-client, lifecycle, parity)
- Warm-only CLI fallback helper for Claude and Codex hooks
- OpenCode plugin (`mk-spec-memory.js`) and CLI/IPC bridge

### Changed

- `package.json`, `tsconfig.json` — build and bin entries updated
- Claude/Codex hook files — warm-only CLI fallback paths added
- Runtime allowlists (`.codex/settings.json`, `.claude/settings.local.json`)
- `AGENTS.md` — transport-down fallback guidance

### Fixed

- None

### Verification

| Check | Result |
|-------|--------|
| Research: all 4 runs terminal | PASS — 0 unresolved, 0 unexamined |
| CLI core: 11 tests | PASS |
| CLI core: live daemon smoke | PASS — 9492 memories returned |
| Hardening: 10/10 sandbox tests | PASS |
| Runtime: hook smoke (fail-open + warm) | PASS |
| Runtime: bridge warm smoke | PASS (`status ok`, route `cli`) |
| Runtime: MCP registrations | Untouched (diff-empty) |

### Files Changed

See per-phase changelogs for full file tables.

### Follow-Ups

- REQ-005 dual-stack observation window remains in progress by design
- Final program-level multi-runtime transport-down drill tracked at program level
