---
title: "Implementation Summary: System Code Graph Import Path Cleanup"
description: "mcp_server clean builds no longer regenerate the stale system-spec-kit/shared orphan tree, and the runtime entrypoint still starts cleanly."
trigger_phrases:
  - "033 import path cleanup summary"
  - "mcp_server orphan shared summary"
  - "system-code-graph dist cleanup summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup"
    last_updated_at: "2026-05-14T15:39:08Z"
    last_updated_by: "codex-gpt5.5-033"
    recent_action: "Completed import path cleanup"
    next_safe_action: "No action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tsconfig.json"
      - ".opencode/skills/system-spec-kit/mcp_server/package.json"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-033-system-code-graph-import-path-cleanup"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The stale shared orphan came from compile-time source resolution into a broad rootDir output tree."
      - "The final runtime shared source is the @spec-kit/shared package export surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Clean `mcp_server` builds no longer leave a stale duplicate of `@spec-kit/shared` under `dist/system-spec-kit/shared`. The build now keeps shared runtime code behind the workspace package exports while preserving the documented `dist/context-server.js` startup path.

### Root Cause

`mcp_server/tsconfig.json` compiled with `rootDir: "../.."` and mapped `@spec-kit/shared/*` to `../shared/*`. That combination let TypeScript treat shared package sources as part of the broad mcp_server emit geometry, so compiled sibling output could point at `dist/system-spec-kit/shared/**` instead of the actual workspace package at `.opencode/skills/system-spec-kit/shared/dist/`.

An `exclude` alone was not enough. Health-check exposed compiled sibling files that still imported `system-spec-kit/shared/...`, so the fix also needed dist finalization to rewrite those compiled references to `@spec-kit/shared/*.js`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` | Modified | Removed the shared source path alias and excluded `../../shared/**` from mcp_server compilation. |
| `.opencode/skills/system-spec-kit/mcp_server/package.json` | Modified | Runs `scripts/finalize-dist.mjs` after `tsc --build`. |
| `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` | Created | Copies the prefixed mcp_server emit to the canonical root dist, rewrites flattened sibling imports, rewrites shared imports to `@spec-kit/shared/*.js`, and removes the orphan shared dist tree. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/033-system-code-graph-import-path-cleanup/` | Created | Level 2 packet docs and metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I first confirmed the orphan existed at `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/shared/`. The sandbox blocked the exact requested `rm -rf dist`, so I used a non-destructive clean-build equivalent by moving `dist` aside into `/private/tmp/033-mcp-server-dist-*`, then rebuilt from an empty dist path.

The first implementation pass proved why this was not a plain tsconfig exclude: health-check caught a bad rewritten sibling import, then a second health-check caught sibling output still resolving `system-spec-kit/shared`. The finalizer now handles both cases: root mcp_server files get flattened sibling import paths, and all compiled shared-relative imports become package imports.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `rootDir: "../.."` | Current mcp_server source directly imports sibling `system-code-graph` and `system-skill-advisor` TypeScript. Tightening rootDir without source refactors causes TS6059 and invalid runtime geometry. |
| Remove the `@spec-kit/shared/*` source alias | Shared is already a workspace package with `exports`; resolving through package output is the single runtime source of truth. |
| Add a postbuild finalizer | TypeScript cannot emit both the broad sibling bundle and the documented flattened `dist/context-server.js` entrypoint from tsconfig alone. |
| Leave `shared/` and `mcp_server/lib/` source untouched | The packet was scoped to tsconfig/dist hygiene, and the final fix did not require changing those source surfaces. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Pre-fix orphan check | PASS: `.opencode/skills/system-spec-kit/mcp_server/dist/system-spec-kit/shared/` existed before cleanup. |
| Clean dist setup | PASS: exact `rm -rf dist` was blocked by policy; moved `dist` aside to `/private/tmp/033-mcp-server-dist-*` instead. |
| `npm run build </dev/null` from `mcp_server` | PASS, exit 0. |
| Orphan regeneration check | PASS: `test -d dist/system-spec-kit/shared` returned 1 after clean build, so the orphan did not come back. |
| Shared-relative compiled import check | PASS: `rg -n "system-spec-kit/shared" dist --glob '*.js' --glob '*.d.ts'` returned no matches. |
| Runtime health-check | PASS, exit 0. Output included `API key validated (provider: llama-cpp)` and `Database initialized`. Startup scan also logged existing memory/template warnings, but the process returned success. |
| Vitest smoke | PASS, exit 0: 2 files passed, 6 tests passed, 1 skipped. |
| OpenCode alignment drift | PASS, exit 0: 982 files scanned, 0 errors, 6 warnings in unrelated existing `mcp_server/lib/*` module headers. |
| Strict packet validation | PASS after final docs validation. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Sibling MCP code is still bundled into `mcp_server/dist`.** This packet removes the shared-package orphan, not the broader sibling bundle architecture. Removing those sibling emits would require source import boundary work outside this packet.
2. **Health-check is noisy.** Startup logs existing memory/template warnings during the background scan, but the command exits 0 and the requested API-key/database startup evidence is present.
<!-- /ANCHOR:limitations -->
