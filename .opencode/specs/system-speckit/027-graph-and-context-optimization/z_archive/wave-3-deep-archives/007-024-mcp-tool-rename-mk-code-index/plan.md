---
title: "Implementation Plan: MCP Tool Rename: mk-code-index"
description: "Plan for surgically renaming the extracted code-graph MCP server identity, launcher, client namespace references, and packet metadata without changing tool IDs or env vars."
trigger_phrases:
  - "010 mcp tool rename mk code index plan"
  - "mk-code-index rename plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/z_archive/wave-3-deep-archives/007-024-mcp-tool-rename-mk-code-index"
    last_updated_at: "2026-05-14T17:29:04Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-010"
    recent_action: "Planned surgical MCP rename"
    next_safe_action: "Restart MCP children after merge"
    blockers: []
    key_files:
      - ".claude/mcp.json"
      - "opencode.json"
      - ".opencode/bin/mk-code-index-launcher.cjs"
      - ".opencode/skills/system-code-graph/mcp_server/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-010-mcp-tool-rename-mk-code-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: MCP Tool Rename: mk-code-index

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, TypeScript, JSON, Markdown |
| **Framework** | MCP server under `.opencode/skills/system-code-graph/mcp_server` |
| **Runtime Configs** | `.claude/mcp.json`, `opencode.json` |
| **Testing** | `npx tsc`, launcher smoke, strict spec validation |

### Overview

Rename the standalone MCP server identity from `system_code_graph` to `mk-code-index`. Runtime configs use the MCP-safe key `mk_code_index`; the TypeScript MCP server advertises `mk-code-index`; client tool grants and docs use `mcp__mk_code_index__*`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 answered with new 010 packet path.
- [x] Confirmed no existing `010-*` child before writes.
- [x] Read current config, launcher, MCP entrypoint, docs, and namespace references.
- [x] Confirmed current branch is `main`.

### Definition of Done

- [x] MCP config keys and launcher path updated.
- [x] Launcher file renamed and internal prefix/state names updated.
- [x] MCP server name set to `mk-code-index`.
- [x] Runtime namespace grants and hints updated to `mcp__mk_code_index__*`.
- [x] `SPECKIT_CODE_GRAPH_*` env vars left unchanged.
- [x] TypeScript build, launcher smoke, and strict spec validation recorded.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

MCP server identity rename with stable tool IDs.

### Key Components

- **Runtime config key**: `mk_code_index` in Claude/OpenCode config files.
- **Server handshake name**: `mk-code-index` in `new Server({ name })`.
- **Client tool namespace**: `mcp__mk_code_index__*`.
- **Stable tool IDs**: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`, `code_graph_verify`, `code_graph_apply`, `detect_changes`, `ccc_status`, `ccc_reindex`, and `ccc_feedback`.

### Data Flow

MCP runtime reads the `mk_code_index` config entry, starts `.opencode/bin/mk-code-index-launcher.cjs`, which starts the built system-code-graph MCP server. The server advertises `mk-code-index`, and clients expose the server-prefixed tools as `mcp__mk_code_index__<tool>`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.claude/mcp.json` | Claude MCP config | Rename key and launcher path | JSON parse, grep |
| `opencode.json` | OpenCode MCP config | Rename key and launcher path | JSON parse, grep |
| `.opencode/bin/mk-code-index-launcher.cjs` | MCP bootstrapper | Rename file and internal state names | Launcher smoke |
| `.opencode/skills/system-code-graph/mcp_server/index.ts` | MCP server entrypoint | Set server name | `npx tsc` |
| Runtime grants/hints | Client tool namespace docs and permissions | Update to `mcp__mk_code_index__*` | grep |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigation

- [x] Pre-check no existing `010-*` child.
- [x] Read target config, launcher, MCP server, state file, and docs.
- [x] Search for stale `system_code_graph`, `mcp__system_code_graph`, and `system-code-graph-launcher` references outside historical packet docs.

### Phase 2: Implementation

- [x] Rename launcher and launcher state file.
- [x] Update runtime configs and server name.
- [x] Update live namespace references in system-code-graph, doctor commands, and spec-kit MCP hints.
- [x] Scaffold 010 packet docs and metadata.

### Phase 3: Verification

- [x] Run TypeScript build.
- [x] Run launcher startup smoke.
- [x] Run strict packet validation.
- [x] Stage intended files and attempt commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | system-code-graph TypeScript project | `npx tsc` |
| Runtime smoke | new MCP launcher | `timeout 8 node .opencode/bin/mk-code-index-launcher.cjs </dev/null 2>&1 \| head -10` |
| Static config | MCP server keys and namespace references | `rg`, JSON parse |
| Spec validation | 010 packet docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Local TypeScript toolchain | Build | Available in repository dependency tree | Required for `npx tsc`. |
| MCP runtime restart | Operator action | Pending after merge | Required for live children to expose the new namespace. |
| Main branch worktree | Git | In use | User forbids branch switching. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fresh runtime cannot start `mk-code-index` after merge and restart.
- **Procedure**: Restore the prior MCP config key, launcher filename, state file names, and `new Server({ name: 'system_code_graph' })`; then restart MCP children.
<!-- /ANCHOR:rollback -->
