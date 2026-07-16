---
title: "MCP Daemon Reliability Phase 001: IPC Socket Dir Canonicalize"
description: "The code-graph MCP server (mk_code_index) no longer crashes with -32000 on startup when its /tmp socket dir is absent after a reboot. canonicalizePath now walks to the nearest existing ancestor so the missing tail still passes the allowed-root check."
trigger_phrases:
  - "ipc socket dir canonicalize"
  - "mk-code-index -32000 reboot fix"
  - "resolveIpcSocketPath missing dir"
  - "code-graph socket startup crash"
  - "allowed socket root canonicalize"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/001-ipc-socket-dir-canonicalize` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The `mk_code_index` (system-code-graph) MCP server crashed at startup with `MCP error -32000` whenever its `/tmp/mk-code-index` socket directory was absent, which happens on every reboot because macOS clears `/tmp`. The root cause was that `resolveIpcSocketPath` only called `realpath` on the socket dir when `existsSync` returned true. A missing dir stayed as the literal string `/tmp/mk-code-index`, which then failed the allowed-root check because that check compared it against the pre-canonicalized root `/private/tmp`.

`canonicalizePath` was rewritten to handle a non-existent leaf: it walks up to the nearest existing ancestor, calls `realpath` on that ancestor, then re-appends the missing tail segments. `resolveIpcSocketPath` now routes through this helper instead of the old `existsSync` ternary. A missing `/tmp/mk-code-index` resolves to `/private/tmp/mk-code-index`, which the allowed-root guard accepts. The server then creates the directory on bind via the existing `mkdirSync`. Scope was confirmed as `system-code-graph` only: the two sibling socket-servers (`system-spec-kit`, `system-skill-advisor`) have no allowed-root check and were never affected by this bug.

### Added

- Regression test `ipc-socket-resolve.vitest.ts` covering two cases: missing `/tmp` dir resolves to a canonical path, out-of-root dir still throws (NEW)

### Changed

- `canonicalizePath` in `socket-server.ts` rewrites to ancestor-walk: realpath the nearest existing ancestor then re-append the missing tail so a non-existent leaf canonicalizes correctly
- `resolveIpcSocketPath` in `socket-server.ts` routes through `canonicalizePath` instead of the old `existsSync ? realpath(dir) : dir` ternary
- Rebuilt `system-code-graph` dist via `tsc --build` to carry the fix into the deployed package

### Fixed

- `mk_code_index` crashed at startup with `-32000 Connection closed` after reboot when `/tmp/mk-code-index` did not exist. The ancestor-walk canonicalization eliminates the literal-path vs canonical-root mismatch that triggered the allowed-root rejection.

### Verification

| Check | Result |
|-------|--------|
| Regression test `ipc-socket-resolve.vitest.ts` | PASS (2/2: missing /tmp dir resolves, /var out-of-root throws) |
| `tsc --build` (system-code-graph) | PASS (exit 0, dist carries the fix) |
| Scope check: sibling socket-servers have the allowed-root guard? | PASS (grep `isWithinAllowedSocketRoot` = 0 in system-spec-kit + system-skill-advisor) |
| Live reconnect with no pre-created socket dir | Pending. Deferred to Phase 2 MCP reconnect |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` | Modified | `canonicalizePath` gets ancestor-walk logic. `resolveIpcSocketPath` routes through it instead of the `existsSync` ternary |
| `.opencode/skills/system-code-graph/mcp_server/tests/ipc-socket-resolve.vitest.ts` | Created (NEW) | Regression test covering missing-dir resolution to canonical path and out-of-root rejection |

### Follow-Ups

- Live confirmation deferred. Unit test and code inspection confirm the fix. The live `mk_code_index` reconnect with no pre-created socket dir is verified in Phase 2, which requires the reconnect anyway.
