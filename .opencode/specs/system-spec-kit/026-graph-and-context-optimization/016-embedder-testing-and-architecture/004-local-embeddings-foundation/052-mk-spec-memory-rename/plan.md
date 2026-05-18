---
title: "Implementation Plan: mk-spec-memory MCP Rename"
description: "Plan for renaming the Spec Kit Memory MCP server alias to mk-spec-memory while preserving raw tool names and historical audit references."
trigger_phrases:
  - "017 rename plan"
  - "mk-spec-memory implementation plan"
  - "spec kit memory mcp rename"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/052-mk-spec-memory-rename"
    last_updated_at: "2026-05-15T05:59:52Z"
    last_updated_by: "main_agent"
    recent_action: "Replaced scaffold plan with actual shipped rename plan"
    next_safe_action: "Reference shipped evidence"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "resource-map.md"
    session_dedup:
      fingerprint: "sha256:0e2c75b4cb50ff6c84f4bd30d24aa04d40be962f40d6695a4145dc5ea1c42b7f"
      session_id: "main-2026-05-15-017-plan-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Raw MCP tool names remain unchanged"
      - "Historical spec packet docs are preserved as audit trail"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: mk-spec-memory MCP Rename

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode MCP runtime config, Node.js launcher, TypeScript MCP server |
| **Framework** | Model Context Protocol server and multi-runtime config files |
| **Storage** | Launcher state files and existing Spec Kit Memory databases |
| **Testing** | JSON-RPC smoke probe, grep verification, strict spec validation |

### Overview

Rename the configured Spec Kit Memory MCP server alias from `spec_kit_memory` / `spec-kit-memory` to `mk-spec-memory`. The implementation changes runtime server keys, launcher identity, operational fully qualified references, and documentation while preserving raw MCP tool names such as `memory_context` and `memory_search`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research confirmed runtime aliases produce host-qualified MCP tool prefixes.
- [x] Scope excludes raw tool-name changes and historical packet rewrites.
- [x] Runtime config surfaces are known: OpenCode, Claude Code, Codex, Gemini, `.mcp.json`, and `.vscode/mcp.json`.

### Definition of Done
- [x] Runtime configs use `mk-spec-memory` and the renamed launcher.
- [x] Operational `mcp__spec_kit_memory__*` references are migrated or documented as historical.
- [x] Smoke evidence confirms `serverInfo.name = "mk-spec-memory"` and the 41 raw tools remain listed.
- [x] Packet docs record the active-vs-historical split and validation evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Configuration rename plus compatibility-preserving runtime identity update.

### Key Components
- **Runtime config keys**: OpenCode, Claude Code, Codex, Gemini, `.mcp.json`, and `.vscode/mcp.json` derive visible tool namespaces from the configured server alias.
- **Launcher binary**: `.opencode/bin/mk-spec-memory-launcher.cjs` owns env loading, lock-dir lifecycle, and state-file naming.
- **MCP server source**: `context-server.ts` advertises the server display name while raw tool schemas remain unchanged.
- **Operational docs and scripts**: active command, skill, agent, YAML, and test references use the new `mcp__mk_spec_memory__*` prefix.

### Data Flow

Runtimes start the launcher, the launcher loads environment and spawns the MCP server, and host tools expose `mcp__mk_spec_memory__<raw_tool_name>` while the server still registers raw names such as `memory_context`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime MCP configs | Define server alias and launch command | Rename server key and point to launcher | Config grep plus JSON/TOML parse where applicable |
| MCP server source/dist | Advertise server identity | Update server name to `mk-spec-memory`; rebuild dist | JSON-RPC initialize smoke probe |
| Launcher and state files | Own env loading and process lifecycle | Rename launcher/state prefix to mk-spec-memory | Launcher stderr prefix and smoke probe |
| Operational references | Host-qualified tool examples and command allowlists | Sweep old prefix to new prefix, excluding historical docs | Grep excluding `.opencode/specs/**/*.md` audit trail |
| Historical specs | Audit trail of prior server name | Preserve old references | Resource map documents retained counts |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime Identity
- [x] Rename runtime server keys to `mk-spec-memory`.
- [x] Rename launcher binary and launcher state-file prefix.
- [x] Update server display name in MCP source and dist.

### Phase 2: Operational Sweep
- [x] Replace active `mcp__spec_kit_memory__*` references with `mcp__mk_spec_memory__*`.
- [x] Retune substrate harness and sandbox runner for hyphen display name plus underscore namespace form.
- [x] Preserve `.opencode/specs/**/*.md` historical references as audit evidence.

### Phase 3: Verification and Documentation
- [x] Run smoke probe against the renamed launcher.
- [x] Reconcile resource-map counts and shipped evidence.
- [x] Record validation evidence in implementation-summary.md.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | MCP initialize and tools/list through launcher | Node JSON-RPC probe |
| Grep | Old prefix absent from active operational files | `rg` / `grep` with historical exclusions |
| Syntax | Changed JS/TS helper surfaces | Existing vitest/build checks from implementation summary |
| Spec validation | Packet metadata and required docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Runtime support for hyphenated server keys | Runtime config | Green | Codex TOML needs quoted table name |
| Raw MCP tool schemas | Internal API | Green | Must remain byte-for-byte stable for callers |
| Historical packet policy | Documentation | Green | Old references are preserved only in audit-trail docs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A runtime cannot start or resolve `memory_context` through `mk-spec-memory`.
- **Procedure**: Revert the rename commit, restore the previous runtime server keys and launcher filename, then restart MCP runtimes. No data migration rollback is required because raw tool names and database formats did not change.
<!-- /ANCHOR:rollback -->
