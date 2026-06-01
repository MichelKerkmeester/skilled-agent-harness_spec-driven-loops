---
title: "System Code Graph Import Path Cleanup"
description: "mcp_server clean builds no longer regenerate a stale duplicate of @spec-kit/shared under dist/system-spec-kit/shared. A postbuild finalizer rewrites compiled shared imports to the workspace package surface and removes the orphan shared dist tree."
trigger_phrases:
  - "mcp_server orphan shared dist cleanup"
  - "system-spec-kit shared duplicate emit"
  - "finalize-dist mjs postbuild"
  - "tsconfig rootDir shared import fix"
  - "033 import path cleanup"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/033-system-code-graph-import-path-cleanup` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

`mcp_server` was compiling with `rootDir: "../.."` and mapping `@spec-kit/shared/*` to source. That combination caused TypeScript to emit a copy of the shared package under `mcp_server/dist/system-spec-kit/shared/`, producing a stale orphan that could drift from the canonical `@spec-kit/shared` workspace output. The orphan `llama-cpp.js` file had already drifted when this work began.

Removing the source path alias and adding an `exclude` turned out not to be sufficient. A runtime health check exposed sibling output files that still contained compiled references to `system-spec-kit/shared/...`. A postbuild finalizer, `scripts/finalize-dist.mjs`, was added to the `mcp_server` build script. It copies the prefixed compiler emit to the canonical `dist/` root, rewrites all compiled shared-relative imports to `@spec-kit/shared/*.js` and deletes the orphan shared subtree. The documented `dist/context-server.js` startup path is preserved.

All five P0 requirements passed: clean build exits 0, the orphan does not regenerate, the runtime health check succeeds, Vitest smoke passes and strict packet validation passes.

### Added

- `scripts/finalize-dist.mjs` postbuild step that copies the prefixed mcp_server compiler output to the canonical `dist/` root, rewrites flattened sibling imports, rewrites shared-relative imports to `@spec-kit/shared/*.js` and removes the orphan shared dist tree

### Changed

- `mcp_server/tsconfig.json`: removed the `@spec-kit/shared/*` source path alias and added `../../shared` plus `../../shared/**` to the `exclude` list
- `mcp_server/package.json`: build script extended to run `scripts/finalize-dist.mjs` after `tsc --build`

### Fixed

- Clean `mcp_server` builds no longer regenerate `dist/system-spec-kit/shared/`. The orphan tree that previously drifted from the real workspace package output is absent after every build.
- Compiled sibling files that referenced `system-spec-kit/shared/...` paths now resolve through `@spec-kit/shared/*.js` package exports instead of the stale orphan tree.

### Verification

| Check | Result |
|-------|--------|
| Pre-fix orphan check | PASS. `dist/system-spec-kit/shared/` existed before cleanup. |
| Clean dist setup | PASS. `rm -rf dist` was blocked by sandbox policy. `dist` was moved aside to `/private/tmp/033-mcp-server-dist-*` to achieve an equivalent clean-build baseline. |
| `npm run build` from `mcp_server` | PASS, exit 0. |
| Orphan regeneration check | PASS. `test -d dist/system-spec-kit/shared` returned 1 after the clean build. |
| Shared-relative compiled import check | PASS. `rg -n "system-spec-kit/shared" dist` returned no matches in `.js` or `.d.ts` files. |
| Runtime health check | PASS, exit 0. Output confirmed `API key validated (provider: llama-cpp)` and `Database initialized`. Existing memory/template warnings appeared in the startup scan log, but the process returned success. |
| Vitest smoke | PASS, exit 0. 2 files passed, 6 tests passed, 1 skipped. |
| OpenCode alignment drift | PASS, exit 0. 982 files scanned, 0 errors, 6 warnings in unrelated existing `mcp_server/lib/*` module headers. |
| Strict packet validation | PASS after final docs validation. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Modified | Removed `@spec-kit/shared/*` source path alias. Added `../../shared` and `../../shared/**` to the exclude list. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Build script now runs `scripts/finalize-dist.mjs` after `tsc --build`. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` | Created (NEW) | Copies the prefixed mcp_server emit to the canonical root dist, rewrites flattened sibling imports, rewrites shared imports to `@spec-kit/shared/*.js` and removes the orphan shared dist tree. |

### Follow-Ups

- Sibling MCP code for `system-code-graph` and `system-skill-advisor` is still bundled into `mcp_server/dist`. This packet removes the shared-package orphan, not the broader sibling bundle architecture. Removing those sibling emits would require source import boundary work and is outside this packet's scope.
- The runtime health check is noisy at startup. Existing memory/template warnings appear in the background scan log. The command exits 0 and the required API-key/database evidence is present, but the warnings should be cleaned up in a follow-on packet.
