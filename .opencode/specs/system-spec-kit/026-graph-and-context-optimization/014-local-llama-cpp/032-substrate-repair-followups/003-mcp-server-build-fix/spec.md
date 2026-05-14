---
title: "003 mcp-server-build-fix (resolve MCP SDK import errors)"
description: "Fix the 3 `Cannot find module '@modelcontextprotocol/sdk/*'` errors blocking `mcp_server/npm run build`. Likely a missing dep or stale import path post-system-code-graph extraction."
trigger_phrases:
  - "mcp_server build fix"
  - "modelcontextprotocol sdk cannot find module"
  - "post-extraction system-code-graph import paths"
  - "package.json dependency repair"
importance_tier: "important"
status: "planned"
---

# 003 — mcp_server build fix

## Goal

Make `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` exit 0. Currently failing with 3 errors:

```
@modelcontextprotocol/sdk/server/index.js
@modelcontextprotocol/sdk/server/stdio.js
@modelcontextprotocol/sdk/types.js
```

These prevent `dist/` from being regenerated cleanly. This session had to dual-patch source + dist for two fixes (retry-manager.ts in `b3363483c`, classifier in `7fbed77c8`). Future fixes shouldn't need that workaround.

## Source anchors (investigate)

- `.opencode/skills/system-spec-kit/mcp_server/package.json` — check `dependencies` for `@modelcontextprotocol/sdk`.
- `.opencode/skills/system-code-graph/mcp_server/` — the recently-extracted skill that may have moved imports.
- `.opencode/skills/system-code-graph/mcp_server/index.ts` — likely import site for the SDK.
- `.opencode/skills/system-code-graph/mcp_server/context-server.ts` — alternative import site.
- `.opencode/skills/system-spec-kit/mcp_server/tsconfig.json` — check paths/references.
- The 014/007-mcp-topology-pivot ADR may explain the extraction.

## Investigation steps

1. Confirm the exact errors via `cd mcp_server && npm run build 2>&1 | head -30`.
2. Identify which file(s) import the missing modules.
3. Check whether `@modelcontextprotocol/sdk` is in `package.json`'s deps.
4. If missing: `npm install @modelcontextprotocol/sdk` (version-pin to whatever system-code-graph/mcp_server uses to avoid drift).
5. If present but not installed: `npm install` in the right workspace root.
6. If import path is wrong post-extraction: update to the correct relative or package-name path.

## Acceptance criteria

1. `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` exits 0.
2. `ls dist/` shows freshly-regenerated `.js` files for `lib/governance/scope-governance.js`, `lib/providers/retry-manager.js`, `handlers/save/response-builder.js`, `lib/errors/recovery-hints.js`.
3. The dual-patches applied this session (via direct dist file edits) survive — `diff` between source TS and rebuilt JS shows the runtime behavior is preserved.
4. No regressions in `npm test` (run a quick sanity test, not full suite).
5. `implementation-summary.md` documents: root cause (missing dep / stale path / etc.), the precise commands run, and verification output.

## Out of scope

- Fixing the OTHER 13 skill_advisor/* errors I saw in an earlier build attempt (those may have already resolved themselves; if not, separate packet).
- Migrating mcp_server to a different build tool.
- Restructuring the workspace `package.json` dependency tree.
