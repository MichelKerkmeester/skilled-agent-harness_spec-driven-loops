---
title: "MCP Server Build Fix: Standalone Code-Graph SDK Dependency Repair"
description: "The standalone system-code-graph package now declares the MCP SDK it imports. The system-spec-kit MCP server build exits 0 with no SDK import errors."
trigger_phrases:
  - "mcp server build fix"
  - "modelcontextprotocol sdk cannot find module"
  - "system-code-graph dependency repair"
  - "post-extraction sdk dependency"
  - "mcp_server npm run build fix"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups`

### Summary

Three `Cannot find module '@modelcontextprotocol/sdk/*'` errors were blocking `npm run build` in the system-spec-kit MCP server. The root cause was a dependency ownership gap introduced during the ADR-002 standalone code-graph extraction: `system-code-graph/mcp_server/index.ts` imports `@modelcontextprotocol/sdk` directly, but the standalone package did not declare it. Resolution only worked locally through an accidental symlink into the sibling `system-spec-kit/mcp_server/node_modules`.

Path A was used: the standalone `system-code-graph` package now declares `@modelcontextprotocol/sdk` at `^1.24.3`, matching the existing `system-spec-kit` range. Its lockfile records the SDK package metadata using the already-resolved sibling lockfile as a source, because sandbox DNS blocked a live registry fetch. The MCP server build now exits 0 with no SDK errors. The watched dist JS files carry the previously-landed retry, save-classifier plus error-recovery fixes.

### Added

- `@modelcontextprotocol/sdk` dependency declaration in `.opencode/skills/system-code-graph/package.json` at version range `^1.24.3`
- SDK dependency metadata entry in `.opencode/skills/system-code-graph/package-lock.json` for the standalone package

### Changed

- `.opencode/skills/system-code-graph/package.json`: from missing SDK declaration to explicit `^1.24.3` dependency
- `.opencode/skills/system-code-graph/package-lock.json`: lockfile updated to record the SDK resolution path

### Fixed

- `npm run build` in `system-spec-kit/mcp_server` failed with three `Cannot find module '@modelcontextprotocol/sdk/*'` errors. Declaring the SDK in the standalone package's manifest resolves all three.
- `system-code-graph` reported the SDK as an extraneous dependency after the ADR-002 extraction. The manifest declaration removes the extraneous flag.

### Verification

| Check | Result |
|-------|--------|
| `npm run build` in `system-spec-kit/mcp_server` | PASS. Exit code 0. Output: `> @spec-kit/mcp-server@1.8.0 build` then `> tsc --build`. No SDK errors. |
| `npm ls @modelcontextprotocol/sdk --depth=0` in `system-code-graph` | PASS. Resolves `@modelcontextprotocol/sdk@1.27.1` via sibling path. No longer extraneous after manifest repair. |
| `npx tsc -p tsconfig.json --tsBuildInfoFile /tmp/spec-kit-mcp-server-build-fix.tsbuildinfo` | PASS. Fresh compiler output generated for watched dist files. |
| Dist mtimes on watched root JS files | PASS. All show `2026-05-14 13:10:34`. |
| `grep SPECKIT_RETRY_INTERVAL_MS` in `retry-manager.js` | PASS. Found at lines 200 and 204. |
| `grep classifySaveErrorCode` in `response-builder.js` | PASS. Found at line 340 along with E085 through E089 markers. |
| `grep MEMORY_SAVE_GOVERNANCE_REJECTED` in `recovery-hints.js` | PASS. Found at lines 70 and 71. |
| `npm install --save @modelcontextprotocol/sdk@^1.24.3` | FAIL. Sandbox DNS blocked `registry.npmjs.org`. No manifest changes were applied by npm. |
| `npm run build -- --force` | FAIL. Unrelated `EPERM` on `shared/dist/**`. Plain required build passes. |
| `npx vitest run tests/context-server.vitest.ts` | FAIL out of scope. 74 stale topology assertions expect pre-ADR-002 co-resident code-graph tools. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/package.json` | Modified | Declares `@modelcontextprotocol/sdk` at `^1.24.3` for the standalone MCP package. |
| `.opencode/skills/system-code-graph/package-lock.json` | Modified | Records SDK dependency metadata for the standalone package. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/providers/retry-manager.js` | Regenerated | Preserves `SPECKIT_RETRY_INTERVAL_MS` runtime fix from a prior packet. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/handlers/save/response-builder.js` | Regenerated | Preserves save error classifier fix including E085 through E089. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/errors/recovery-hints.js` | Regenerated | Preserves `MEMORY_SAVE_GOVERNANCE_REJECTED` and `MEMORY_SAVE_EMBEDDING_FAILED` recovery codes. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Regenerated | Confirms dist emit path refresh from compiler output. |

### Follow-Ups

- Registry install could not run in this sandbox. DNS resolution for `registry.npmjs.org` failed, so node_modules was not freshly downloaded from the registry. The on-disk SDK remains the existing symlinked install at version `1.27.1`, satisfying the declared `^1.24.3` range. A fresh checkout should install cleanly now that the manifest declares the dependency.
- `tsc --build --force` is blocked by shared dist permissions and fails with `EPERM` on `shared/dist/**`. The normal required build command exits 0 and is the correct gate.
- Update `tests/context-server.vitest.ts` to remove the 74 stale topology assertions that still expect pre-ADR-002 co-resident code-graph tools in `system-spec-kit`. This is outside the scope of a dependency repair packet.
