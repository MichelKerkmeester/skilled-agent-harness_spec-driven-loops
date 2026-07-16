---
title: "Implementation Summary: MCP server build fix"
description: "The standalone code-graph MCP package now declares the SDK it imports, and the system-spec-kit MCP build exits cleanly."
trigger_phrases:
  - "mcp_server build fix summary"
  - "modelcontextprotocol sdk root cause"
  - "system-code-graph dependency repair"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix"
    last_updated_at: "2026-05-14T11:12:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Path A dependency repair and build verification"
    next_safe_action: "No follow-up needed for SDK build errors"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/package.json"
      - ".opencode/skills/system-code-graph/package-lock.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/handlers/save/response-builder.js"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000302"
      session_id: "003-mcp-server-build-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Path A used: SDK was missing from standalone system-code-graph dependencies."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix` |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The build blocker was a dependency ownership bug from the standalone code-graph extraction. `system-code-graph/mcp_server/index.ts` imports `@modelcontextprotocol/sdk`, but `.opencode/skills/system-code-graph/package.json` did not declare the SDK; local resolution only worked through a symlink into `system-spec-kit/mcp_server/node_modules`.

### Dependency Repair

Path A was used. The standalone package now declares `@modelcontextprotocol/sdk` with the same dependency range used by `system-spec-kit/mcp_server` (`^1.24.3`), and its lockfile records the SDK package metadata. The attempted registry-backed install failed because sandbox DNS could not resolve `registry.npmjs.org`, so the lock repair used the already-resolved metadata present in the sibling `system-spec-kit` lockfile.

### Dist Refresh

`npm run build` exits 0. A direct `tsc -p tsconfig.json --tsBuildInfoFile /tmp/spec-kit-mcp-server-build-fix.tsbuildinfo` produced fresh compiler output under `dist/system-spec-kit/mcp_server/**`; the watched root runtime JS files were refreshed from that compiler output and now have `2026-05-14 13:10:34` mtimes.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-code-graph/package.json` | Modified | Declares `@modelcontextprotocol/sdk` for the standalone MCP package. |
| `.opencode/skills/system-code-graph/package-lock.json` | Modified | Records SDK dependency metadata for the standalone package. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Regenerated | Preserves `SPECKIT_RETRY_INTERVAL_MS` runtime fix. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/save/response-builder.js` | Regenerated | Preserves save error classifier fix. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js` | Regenerated | Preserves `E085`/`E086` recovery code fix. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Regenerated | Confirms dist emit path refresh. |
| Packet docs | Created/updated | Records plan, tasks, checklist, summary, and completion metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The investigation checked the actual current build first, then verified import sites, manifests, node_modules, and ADR-002. The chosen fix is the smallest durable change: declare the SDK where the extracted standalone server imports it, without changing code-graph TypeScript source or sibling-owned Fix-1 source files.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use Path A | `system-code-graph` imports the SDK directly but did not declare it; the symlinked install was an accidental local resolution path. |
| Match `^1.24.3` | This matches `system-spec-kit/mcp_server/package.json` and avoids unplanned SDK version drift. |
| Do not touch code-graph source | The import path is valid for the installed SDK exports; the bug was ownership, not syntax. |
| Document failed Vitest sanity instead of fixing it here | The failure is stale co-resident code-graph topology expectations after ADR-002, outside this dependency packet. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-spec-kit/mcp_server && npm run build 2>&1 \| head -40` | PASS, output only showed the build banner and no SDK errors. |
| `npm install --save @modelcontextprotocol/sdk@^1.24.3` in `system-code-graph` | FAIL due sandbox DNS: `getaddrinfo ENOTFOUND registry.npmjs.org`; no manifest changes were made by npm. |
| `npm install --save @modelcontextprotocol/sdk@^1.24.3 --offline` | FAIL due missing npm cache metadata: `ENOTCACHED`. |
| `npm ls @modelcontextprotocol/sdk --depth=0` in `system-code-graph` | PASS: resolves `@modelcontextprotocol/sdk@1.27.1 -> ./../system-spec-kit/mcp_server/node_modules/@modelcontextprotocol/sdk`; no longer extraneous after manifest repair. |
| `npm run build -- --force` | FAIL due unrelated `EPERM` rewriting `shared/dist/**`; plain build remains the required gate and passes. |
| `npx tsc -p tsconfig.json --tsBuildInfoFile /tmp/spec-kit-mcp-server-build-fix.tsbuildinfo --pretty false` | PASS, generated fresh compiler output for the watched files. |
| Final `npm run build` | PASS, exit code 0. Output: `> @spec-kit/mcp-server@1.8.0 build` then `> tsc --build`. |
| Dist mtimes | PASS: watched root JS files all show `2026-05-14 13:10:34`. |
| `grep -n "SPECKIT_RETRY_INTERVAL_MS" .../dist/lib/providers/retry-manager.js` | PASS: lines 200 and 204. |
| `grep -n "classifySaveErrorCode\|E085\|E086\|E087\|E088\|E089" .../dist/handlers/save/response-builder.js` | PASS: lines 340, 343, 350, 353, 356, 361, 405. |
| `grep -n "MEMORY_SAVE_GOVERNANCE_REJECTED\|MEMORY_SAVE_EMBEDDING_FAILED" .../dist/lib/errors/recovery-hints.js` | PASS: lines 70 and 71. |
| `npx vitest run tests/context-server.vitest.ts` | FAIL out of scope: 74 stale topology assertions still expect co-resident code-graph tools and `mcp_server/code_graph/tools`. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Registry install could not run in this sandbox.** DNS resolution for `registry.npmjs.org` failed, so node_modules was not freshly downloaded; the on-disk SDK remains the existing symlinked install at version `1.27.1`, satisfying the declared `^1.24.3` range.
2. **`tsc --build --force` is blocked by shared dist permissions.** It fails with `EPERM` on `shared/dist/**`; the normal required build command exits 0.
3. **`context-server.vitest.ts` is stale after ADR-002.** It still asserts co-resident code-graph registration in `system-spec-kit`; this packet did not change that sibling-owned test surface.
<!-- /ANCHOR:limitations -->
