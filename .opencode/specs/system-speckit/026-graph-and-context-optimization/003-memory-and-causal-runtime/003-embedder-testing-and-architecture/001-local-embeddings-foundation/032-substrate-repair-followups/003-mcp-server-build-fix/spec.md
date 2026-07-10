---
title: "003 mcp-server-build-fix (resolve MCP SDK import errors)"
description: "Fix the 3 `Cannot find module '@modelcontextprotocol/sdk/*'` errors blocking `mcp_server/npm run build` by repairing the post-extraction dependency boundary."
trigger_phrases:
  - "mcp_server build fix"
  - "modelcontextprotocol sdk cannot find module"
  - "post-extraction system-code-graph import paths"
  - "package.json dependency repair"
importance_tier: "important"
status: "complete"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/003-mcp-server-build-fix"
    last_updated_at: "2026-05-14T11:14:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed MCP SDK dependency repair"
    next_safe_action: "Use implementation-summary.md verification evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/package.json"
      - ".opencode/skills/system-code-graph/package-lock.json"
      - ".opencode/skills/system-spec-kit/mcp_server/dist/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000302"
      session_id: "003-mcp-server-build-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Path A used: missing standalone SDK dependency declaration."
---

# 003 mcp-server-build-fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | `003-mcp-server-build-fix` |
| **Parent** | `032-substrate-repair-followups` |
| **Status** | Complete |
| **Owner** | `cli-codex` |
| **Date** | 2026-05-14 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The target build was reported to fail on three missing MCP SDK imports:

```text
@modelcontextprotocol/sdk/server/index.js
@modelcontextprotocol/sdk/server/stdio.js
@modelcontextprotocol/sdk/types.js
```

The likely cause was the system-code-graph extraction. ADR-002 moved code-graph MCP ownership into a standalone `system-code-graph` package, but the standalone entrypoint imports the MCP SDK directly and therefore needs its own dependency declaration.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Confirm the current `system-spec-kit/mcp_server` build result.
- Inventory MCP SDK import sites.
- Check dependency declarations and installed node_modules state.
- Repair the simplest dependency/import issue that explains the SDK errors.
- Verify the earlier retry/save-classifier dist markers survive.
- Write Level-2 packet docs and mark the packet complete.

### Out of Scope
- Fixing stale topology tests that still expect co-resident code-graph tools.
- Migrating the MCP server build tool.
- Restructuring workspace dependency management.
- Changing TypeScript source under sibling-owned Fix-1 files.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001**: `cd .opencode/skills/system-spec-kit/mcp_server && npm run build` must exit 0.
- **REQ-002**: The three specific `@modelcontextprotocol/sdk` import errors must be absent.
- **REQ-003**: The dependency/import fix must be minimal and match the extracted topology.
- **REQ-004**: Watched dist files must preserve the earlier retry/save-classifier fixes.
- **REQ-005**: Packet docs must record root cause, commands run, verification output, and limitations.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] `npm run build` exits 0 in `.opencode/skills/system-spec-kit/mcp_server`.
- [x] No `Cannot find module '@modelcontextprotocol/sdk/*'` errors appear in final build output.
- [x] Watched dist JS files have fresh mtimes after compiler-output refresh.
- [x] `SPECKIT_RETRY_INTERVAL_MS`, `classifySaveErrorCode`, `E085` through `E089`, `MEMORY_SAVE_GOVERNANCE_REJECTED`, and `MEMORY_SAVE_EMBEDDING_FAILED` are present in root dist JS.
- [x] `implementation-summary.md` documents the root cause, commands, and verification evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Registry unavailable**: `npm install --save @modelcontextprotocol/sdk@^1.24.3` could not reach `registry.npmjs.org`; the repair used existing local and lockfile evidence.
- **Shared force rebuild blocked**: `npm run build -- --force` fails on `shared/dist/**` `EPERM`; the required plain build passes.
- **Stale tests**: `tests/context-server.vitest.ts` still expects pre-ADR-002 co-resident code-graph tools and fails outside this packet's scope.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for this packet. The remaining stale Vitest topology expectations should be handled by the topology-cleanup packet, not this SDK dependency repair.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Keep the repair narrow: dependency metadata and generated dist only.
- Preserve sibling-owned TypeScript source exactly.
- Avoid registry version drift by matching the existing `^1.24.3` dependency range.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- If node_modules is absent in a fresh checkout, `system-code-graph` must still express the SDK dependency it needs.
- If the SDK symlink remains present locally, it must no longer appear as an undeclared extraneous dependency for the standalone package.
- If TypeScript build output lands under nested `dist/system-spec-kit/mcp_server/**`, watched runtime root dist files still need source-derived refreshed JS.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY NOTES

The code change is small, but the validation path is Level 2 because it crosses package boundaries, generated dist, and an active extraction topology. The main complexity is distinguishing the current build state from stale failure reports and stale tests.
<!-- /ANCHOR:complexity -->
