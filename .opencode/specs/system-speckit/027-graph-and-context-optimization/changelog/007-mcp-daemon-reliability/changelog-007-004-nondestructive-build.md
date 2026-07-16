---
title: "Non-destructive mcp-server build: rebuilds no longer crash a running daemon (RC-4)"
description: "Removing the destructive prebuild auto-clean from mcp_server/package.json stops the live dist/ from being wiped before every recompile. A running daemon now survives a rebuild. Incremental builds drop from minutes to about one second."
trigger_phrases:
  - "non-destructive mcp build"
  - "prebuild clean removed incremental"
  - "rebuild crashes daemon RC-4"
  - "mcp_server package.json clean fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-28

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/004-nondestructive-build` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability`

### Summary

The `@spec-kit/mcp-server` build ran a `prebuild` step that called `rmSync('dist', {recursive, force})` before every `tsc --build`. Any daemon running at that moment had its module tree deleted mid-session, causing `MODULE_NOT_FOUND` crashes on lazy imports (root cause RC-4). The wipe also removed `dist/tsconfig.tsbuildinfo`, forcing a full recompile on every build instead of an incremental one.

Removing the destructive `prebuild` lets `tsc --build` reconcile only changed files in place against the preserved build-info file. The live `dist/` is never wiped. A daemon mid-session keeps its loaded modules. Builds drop from minutes to about one second. An explicit `clean` script remains for manual wipes. A new `rebuild` script (`clean && build`) covers intentional full rebuilds. Sibling workspaces (`@spec-kit/shared` and `@spec-kit/scripts`) were already non-destructive and required no change.

This is the first fix shipped from the 030 daemon-reliability roadmap.

### Added

- `rebuild` script (`clean && build`) in `mcp_server/package.json` for explicit full rebuilds when no daemon must stay up

### Changed

- `mcp_server/package.json` build scripts: `prebuild` auto-clean removed so `tsc --build` runs incrementally in place on the default `build` path

### Fixed

- Running `npm run build` no longer wipes the live `dist/` tree, eliminating the `MODULE_NOT_FOUND` daemon crash (RC-4) that occurred every time the mcp-server was rebuilt during an active session
- Build now reuses `dist/tsconfig.tsbuildinfo` so a no-op incremental rebuild completes in about one second instead of triggering a full recompile

### Verification

- `npm run build` leaves live dist intact and complete: PASS (key artifacts present before and after. `assertRequiredArtifacts()` passed)
- Incremental build (tsbuildinfo reused): PASS (about 1s wall-time vs minutes for a full wipe)
- `dist-freshness.vitest.ts`: PASS (18/18)
- `check-source-dist-alignment-orphans.vitest.ts`: PASS (5 of 6 pass. 1 pre-existing skip unrelated to this change)
- Rebuild-while-daemon-runs (live): not run this session (MCP was disconnected). The non-destructive property is structural: the live `dist/` is never deleted on the default build path.
- Strict packet validation (`validate.sh --strict`): PASS

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Removed `prebuild` auto-clean. Added `rebuild` (`clean && build`). Kept `clean` for manual wipes. |

### Follow-Ups

- A from-scratch build (`npm run rebuild` or `clean`) still has a brief partial-tree window while tsc repopulates. Run `rebuild` only when no daemon must stay up.
- Orphan `.js` files from deleted or renamed sources can linger without the auto-clean. The `dist-freshness` and orphan tests catch them. Run `npm run rebuild` to clear them on demand.
- Only RC-4 is addressed. The remaining 030 root causes (sidecar OOM, no auto-respawn, bridge-to-dead-socket) are tracked in separate packets per the 030 roadmap.
